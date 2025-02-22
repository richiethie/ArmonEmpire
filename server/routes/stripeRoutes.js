const express = require("express");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const priceMap = {
    Gold: "price_1QtzuJKwDDaoYcMewTLSjUxU",
    Silver: "price_1QvAJ4KwDDaoYcMe8hOJQQHO",
    Bronze: "price_1QvAJPKwDDaoYcMefuHEuthL",
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

router.post("/create-subscription", async (req, res) => {
    try {
        const { email, membership } = req.body;

        if (!priceMap[membership]) {
            return res.status(400).json({ error: "Invalid membership type" });
        }

        // Find user in DB
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create customer in Stripe with metadata
        const customer = await stripe.customers.create({
            email,
            name: `${user.firstName} ${user.lastName}`, // Full name
            phone: user.phoneNumber, // Store phone number
            invoice_settings: { default_payment_method: null },
            metadata: {
                userId: user._id.toString(),
                membership: membership,
                phoneNumber: user.phoneNumber,
            },
            description: `Customer for ${email} - ${membership} plan`,
        });

        // Create subscription with default_incomplete behavior
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceMap[membership] }],
            payment_behavior: 'default_incomplete',
            expand: ["latest_invoice.payment_intent"],
        });

        // Save Stripe details to user in DB
        user.stripeCustomerId = customer.id;
        user.subscriptionId = subscription.id;
        await user.save();

        res.json({ 
            subscriptionId: subscription.id, 
            clientSecret: subscription.latest_invoice.payment_intent.client_secret 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
