const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const User = require("../models/User");
const bodyParser = require('body-parser');

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const priceMap = {
    Gold: "price_1RJoLoKwDDaoYcMenjErO10l",
    Silver: "price_1RJoL9KwDDaoYcMeJLPazwmR",
    Bronze: "price_1RJoKeKwDDaoYcMer5Fh5Rh1",
};

router.post("/create-payment-intent", async (req, res) => {
    try {
        const { membership } = req.body;

        if (!membership) {
            return res.status(400).json({ error: "Missing membership" });
        }

        const priceId = priceMap[membership];

        // Fetch product details
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount; // Get amount from Stripe price object

        // Create a Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });

        console.log("Payment Intent Created:", paymentIntent);

        // Send back both the clientSecret and amount
        res.json({ clientSecret: paymentIntent.client_secret, amount });
    } catch (error) {
        console.error("Stripe Payment Intent Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-setup-intent', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure Stripe Customer exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({ email });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create SetupIntent
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeCustomerId,
      usage: 'off_session',
    });

    res.json({ setupClientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error('Error in create-setup-intent:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/create-subscription", async (req, res) => {
  try {
    const { email, membership, paymentMethodId } = req.body;
    if (!email || !priceMap[membership] || !paymentMethodId) {
      return res.status(400).json({ error: "Invalid email, membership, or payment method" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phoneNumber,
        metadata: {
          userId: user._id.toString(),
          membership: membership,
          phoneNumber: user.phoneNumber,
          barber: user.preferredBarber,
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Attach the payment method to the customer
    console.log("Attaching payment method:", { paymentMethodId, customerId });
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set the payment method as the default for the customer
    console.log("Updating customer with default payment method:", { customerId, paymentMethodId });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create the subscription
    console.log("Creating subscription with:", { customerId, price: priceMap[membership], paymentMethodId });
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceMap[membership] }],
      default_payment_method: paymentMethodId,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice"],
    });

    // Save subscription details to user
    user.subscriptionId = subscription.id;
    user.membership = membership;
    user.paymentStatus = subscription.status === "active" ? "active" : "incomplete";
    console.log("Saving user:", {
      email: user.email,
      subscriptionId: user.subscriptionId,
      membership: user.membership,
      paymentStatus: user.paymentStatus,
    });
    await user.save();

    // Retrieve the latest invoice
    const invoice = subscription.latest_invoice;
    let clientSecret = null;

    if (invoice && typeof invoice !== "string") {
      let targetInvoice = invoice;

      // Log invoice state for debugging
      console.log("Initial invoice state:", {
        invoiceId: invoice.id,
        status: invoice.status,
        amount_due: invoice.amount_due,
        payment_intent: invoice.payment_intent,
      });

      // Finalize the invoice if in draft state
      if (invoice.status === "draft") {
        console.log("Finalizing invoice:", invoice.id);
        targetInvoice = await stripe.invoices.finalizeInvoice(invoice.id, {
          auto_advance: true,
        });
      }

      // Attempt to pay the invoice to ensure a payment intent is created
      if (targetInvoice.status === "open" && targetInvoice.amount_due > 0) {
        console.log("Attempting to pay invoice:", targetInvoice.id);
        try {
          targetInvoice = await stripe.invoices.pay(targetInvoice.id, {
            payment_method: paymentMethodId,
            off_session: false, // Require on-session for authentication
          });
        } catch (payError) {
          console.error("Failed to pay invoice:", {
            message: payError.message,
            code: payError.code,
            type: payError.type,
            status: payError.statusCode,
            payment_intent: payError.payment_intent,
          });
          // Re-retrieve the invoice to check for a payment_intent
          targetInvoice = await stripe.invoices.retrieve(targetInvoice.id);
          if (payError.code === "authentication_required" && payError.payment_intent) {
            // Handle 3D Secure or authentication-required cases
            clientSecret = payError.payment_intent.client_secret;
          } else if (targetInvoice.payment_intent) {
            // Check if the invoice has a payment_intent after error
            const paymentIntent = typeof targetInvoice.payment_intent === "string"
              ? await stripe.paymentIntents.retrieve(targetInvoice.payment_intent)
              : targetInvoice.payment_intent;
            clientSecret = paymentIntent.client_secret;
          } else {
            return res.status(400).json({
              error: "Payment attempt failed and no payment intent was created",
              details: payError.message,
            });
          }
        }
      }

      // Log invoice state after payment attempt
      console.log("Invoice state after payment attempt:", {
        invoiceId: targetInvoice.id,
        status: targetInvoice.status,
        amount_due: targetInvoice.amount_due,
        payment_intent: targetInvoice.payment_intent,
      });

      // Check if the invoice is paid or has a payment intent
      if (targetInvoice.status === "paid" || targetInvoice.amount_due === 0 || subscription.status === "active") {
        // If the invoice is paid, update user and return success
        if (targetInvoice.status === "paid") {
          user.paymentStatus = "active";
          await user.save();
          console.log("Updated user after paid invoice:", {
            email: user.email,
            paymentStatus: user.paymentStatus,
          });
        }
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: null,
          status: "active",
        });
      } else if (targetInvoice.payment_intent && !clientSecret) {
        const paymentIntent = typeof targetInvoice.payment_intent === "string"
          ? await stripe.paymentIntents.retrieve(targetInvoice.payment_intent)
          : targetInvoice.payment_intent;
        clientSecret = paymentIntent.client_secret;
      } else if (!clientSecret) {
        return res.status(400).json({
          error: "No payment intent available for the invoice",
        });
      }
    } else {
      return res.status(400).json({ error: "Failed to retrieve invoice" });
    }

    // Return subscription status
    return res.json({
      subscriptionId: subscription.id,
      clientSecret,
      status: subscription.status === "active" ? "active" : "requires_confirmation",
    });
  } catch (err) {
    console.error("Error creating subscription:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
      type: err.type,
      raw: err.raw,
    });
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

router.post("/attach-payment-method", async (req, res) => {
    const { paymentMethodId, email } = req.body;

    console.log("Received paymentMethodId:", paymentMethodId);
    console.log("Received email:", email);

    try {
        // Find the customer by email
        const customer = await stripe.customers.list({
            email,
            limit: 1,
        });

        if (customer.data.length === 0) {
            console.log("Customer not found for email:", email);
            return res.status(400).send({ error: 'Customer not found' });
        }

        const customerId = customer.data[0].id;
        console.log("Found customer with ID:", customerId);

        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });

        // Update the default payment method
        await stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        const user = await User.findOne({ email });
        if (user) {
          if (user.paymentStatus !== "active") {
            user.paymentStatus = "active";
            await user.save();
            console.log(`Updated paymentStatus for user ${email} to "active".`);
          } else {
            console.log(`Payment status for user ${email} is already "active".`);
          }
        } else {
          console.log(`No user found in the database for email ${email}.`);
        }

        res.send({ message: 'Payment method attached successfully' });
    } catch (error) {
        console.error("Error attaching payment method:", error);
        res.status(500).send({ error: error.message });
    }
});

router.post("/update-subscription", async (req, res) => {
    try {
        const { email, newMembership } = req.body;

        if (!priceMap[newMembership]) {
            return res.status(400).json({ error: "Invalid membership type" });
        }

        // Find user in DB
        let user = await User.findOne({ email });
        if (!user || !user.subscriptionId) {
            return res.status(404).json({ error: "User or subscription not found" });
        }

        // Retrieve the current subscription
        const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);

        // Update the subscription with the new membership tier
        const updatedSubscription = await stripe.subscriptions.update(user.subscriptionId, {
            items: [{ id: subscription.items.data[0].id, price: priceMap[newMembership] }],
            proration_behavior: "none", // Adjusts billing accordingly
        });

        // Save new membership tier to user in DB
        user.membership = newMembership;
        await user.save();

        res.json({ success: true, message: "Membership updated successfully!" });
    } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/cancel-subscription', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.subscriptionId) {
      return res.status(404).json({ error: 'User or subscription not found' });
    }

    // Cancel immediately
    await stripe.subscriptions.cancel(user.subscriptionId);

    // Detach all card payment methods from the customer
    if (user.stripeCustomerId) {
      const methods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type:     'card',
      });
      for (const pm of methods.data) {
        await stripe.paymentMethods.detach(pm.id);
      }
    }

    // Update user record
    user.membership     = 'Cancelled';
    user.subscriptionId = undefined;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/update-payment-method", async (req, res) => {
    try {
        const { email, paymentMethodId } = req.body;

        // Find user in DB
        let user = await User.findOne({ email });
        if (!user || !user.stripeCustomerId) {
            return res.status(404).json({ error: "User or Stripe customer not found" });
        }

        // Attach the new payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, { customer: user.stripeCustomerId });

        // Set the new payment method as default
        await stripe.customers.update(user.stripeCustomerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        res.json({ success: true, message: "Payment method updated successfully!" });
    } catch (error) {
        console.error("Error updating payment method:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/get-payment-method', async (req, res) => {
    try {
        const { customerId } = req.query;
        console.log("customerId", customerId);

        if (!customerId) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        // Retrieve the payment methods for the customer
        const paymentMethods = await stripe.customers.listPaymentMethods(
            customerId,
            { type: 'card' }
        );

        if (paymentMethods.data.length === 0) {
            return res.status(404).json({ error: 'No payment methods found' });
        }

        res.json({ paymentMethod: paymentMethods.data[0] });
    } catch (error) {
        console.error('Error fetching payment method:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/setup-intent", async (req, res) => {
    try {
        const { currentUser } = req.body;

        const userId = currentUser.id;

        // Validate userId format
        if (!userId) {
            return res.status(400).json({ error: "Missing User ID" });
        }

        // Find the user in the database
        const user = await User.findById(userId);
        if (!user || !user.stripeCustomerId) {
            return res.status(404).json({ error: "User not found or missing Stripe customer ID" });
        }

        // Create a SetupIntent for the user's Stripe customer
        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ["card"],
            customer: user.stripeCustomerId,
        });

        res.json({ clientSecret: setupIntent.client_secret });
    } catch (error) {
        console.error("Error creating setupIntent:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post(
    "/webhook",
    bodyParser.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];
      let event;
      // Log the event payload for debugging
      console.log("Received webhook event:", req.body.toString());
  
      // Verify the webhook signature using the raw body captured globally (using the verify callback)
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
  
      // Process the event
      try {
        switch (event.type) {
          case "invoice.payment_failed": {
            const invoice = event.data.object;
            // First try to use the subscription id
            let query;
            if (invoice.subscription) {
              query = { subscriptionId: invoice.subscription };
              console.log(`Payment failed for subscription: ${invoice.subscription}`);
            } else if (invoice.customer) {
              // If subscription is null, fall back to using the customer id
              query = { stripeCustomerId: invoice.customer };
              console.log(`Payment failed for customer: ${invoice.customer}`);
            } else {
              console.log("No subscription or customer ID available in the invoice.");
              break;
            }
  
            // Update the user's payment status to "past_due"
            await User.findOneAndUpdate(query, { paymentStatus: "past_due" });
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            // Use subscription if available; else fall back to customer id
            let query;
            if (invoice.subscription) {
              query = { subscriptionId: invoice.subscription };
              console.log(`Payment succeeded for subscription: ${invoice.subscription}`);
            } else if (invoice.customer) {
              query = { stripeCustomerId: invoice.customer };
              console.log(`Payment succeeded for customer: ${invoice.customer}`);
            } else {
              console.log("No subscription or customer ID available in the invoice (payment succeeded).");
              break;
            }
  
            // Update the user's payment status to "active"
            await User.findOneAndUpdate(query, { paymentStatus: "active" });
            break;
          }
  
          case "customer.subscription.updated": {
            const subscription = event.data.object;
            const subscriptionId = subscription.id;
            console.log(`Subscription updated: ${subscriptionId}`);
            // Check if the subscription status is past_due (or you can add other status conditions)
            if (subscription.status === "past_due") {
              await User.findOneAndUpdate(
                { subscriptionId },
                { paymentStatus: "past_due" }
              );
            }
            break;
          }
  
          case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const subscriptionId = subscription.id;
            console.log(`Subscription cancelled: ${subscriptionId}`);
  
            // Update the user record: mark the membership and payment status as cancelled
            await User.findOneAndUpdate(
              { subscriptionId },
              {
                membership: "Cancelled",
                paymentStatus: "cancelled",
              }
            );
            break;
          }
  
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
      } catch (error) {
        console.error("Error processing webhook event:", error);
        return res.status(500).send("Internal Server Error");
      }
  
      // Respond to Stripe to acknowledge receipt of the event
      res.status(200).json({ received: true });
});


module.exports = router;
