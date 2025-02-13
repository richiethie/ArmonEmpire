const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require('../models/User');
const axios = require('axios');
dotenv.config();

// Array to store clients for SSE
let appointmentsClients = [];

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;  // Attach userId to request object
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};

// GET route to fetch all appointments for the authenticated user
router.get("/", verifyToken, async (req, res) => {
    try {
        // Find appointments for the authenticated user
        const appointments = await Appointment.find({ userId: req.userId })
            .sort({ date: 1 }); // Sort appointments by date ascending

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found." });
        }

        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return res.status(500).json({ message: "Server error." });
    }
});

// SSE endpoint for sending updates to the frontend
router.get('/updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Store the response object to send messages to the client later
    appointmentsClients.push(res);

    // Close the connection when the client disconnects
    req.on('close', () => {
        appointmentsClients = appointmentsClients.filter(client => client !== res);
    });
});

router.post('/acuity-webhook', async (req, res) => {
    console.log("Webhook Payload:", req.body);
    try {
        const { action, id } = req.body;

        if (action !== "scheduled") {
            return res.status(400).json({ message: "Ignoring non-scheduled events" });
        }

        // 🔹 Step 1: Fetch full appointment details from Acuity API
        const acuityResponse = await axios.get(
            `https://acuityscheduling.com/api/v1/appointments/${id}`,
            {
                auth: { username: process.env.ACUITY_USER, password: process.env.ACUITY_API_KEY }
            }
        );

        const appointmentData = acuityResponse.data;
        console.log("Acuity Payload:", req.body);

        // 🔹 Step 2: Validate required fields before saving
        if (!appointmentData.datetime || !appointmentData.service || !appointmentData.duration || !appointmentData.email) {
            return res.status(400).json({ message: "Missing required fields from Acuity API" });
        }

        // 🔹 Step 3: Find user in MongoDB by email or phone number
        const user = await User.findOne({
            $or: [
                { email: appointmentData.email },
                { phoneNumber: appointmentData.phoneNumber } // Assuming phoneNumber is part of your User schema
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found for this appointment" });
        }

        // 🔹 Step 4: Save appointment with the correct userId
        const newAppointment = new Appointment({
            userId: user._id,  // Use the found user’s MongoDB _id
            datetime: new Date(appointmentData.datetime),
            service: appointmentData.service,
            duration: appointmentData.duration,
            status: "Scheduled",
        });

        await newAppointment.save();

        // 🔹 Step 5: Emit update to all connected clients via SSE
        appointmentsClients.forEach(client => {
            client.write(`data: ${JSON.stringify({ message: "New appointment created", appointment: newAppointment })}\n\n`);
        });

        res.status(201).json({ message: "Appointment saved successfully" });

    } catch (error) {
        console.error('Error processing Acuity webhook:', error);
        res.status(500).send('Error processing webhook');
    }
});

module.exports = router;
