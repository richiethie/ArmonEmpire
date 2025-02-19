const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
    try {
        const { priceId } = req.body;

        if (!priceId) {
            return res.status(400).json({ error: "Missing priceId" });
        }

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

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Payment Intent Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/create-subscription", async (req, res) => {
    try {
        const { email, paymentMethodId, priceId } = req.body;

        if (!email || !paymentMethodId || !priceId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if customer exists
        const customers = await stripe.customers.list({ email, limit: 1 });
        let customer = customers.data.length ? customers.data[0] : null;

        if (!customer) {
            // Create a new customer
            customer = await stripe.customers.create({ email, payment_method: paymentMethodId });
        }

        // Attach payment method
        await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id });

        // Set default payment method for the customer
        await stripe.customers.update(customer.id, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            expand: ["latest_invoice.payment_intent"],
        });

        res.json({ clientSecret: subscription.latest_invoice.payment_intent.client_secret });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
