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
    console.log('New client connected, total clients:', appointmentsClients.length);

    // Close the connection when the client disconnects
    req.on('close', () => {
        appointmentsClients = appointmentsClients.filter(client => client !== res);
        console.log('Client disconnected, total clients:', appointmentsClients.length);
    });
});

router.post('/acuity-webhook', async (req, res) => {
    console.log("Webhook Payload:", req.body);
    try {
        const { action, id } = req.body;

        // Handle different action types
        if (action === "scheduled") {
            // 🔹 Step 1: Fetch full appointment details from Acuity API
            const acuityResponse = await axios.get(
                `https://acuityscheduling.com/api/v1/appointments/${id}`,
                {
                    auth: { username: process.env.ACUITY_USER, password: process.env.ACUITY_API_KEY }
                }
            );

            const appointmentData = acuityResponse.data;
            console.log("Acuity Payload:", appointmentData);

            // 🔹 Step 2: Validate required fields before saving
            if (!appointmentData.datetime || !appointmentData.type || !appointmentData.duration || !appointmentData.email) {
                return res.status(400).json({ message: "Missing required fields from Acuity API" });
            }

            let phoneNumber = appointmentData.phone;
            if (phoneNumber.startsWith('+1')) {
                phoneNumber = phoneNumber.slice(2); // Remove the '+1' prefix
            }

            // 🔹 Step 3: Find user in MongoDB by email or phone number
            const user = await User.findOne({
                $or: [
                    { email: appointmentData.email },
                    { phoneNumber: phoneNumber }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found for this appointment" });
            }

            // 🔹 Step 4: Save appointment with the correct userId
            const newAppointment = new Appointment({
                userId: user._id,  // Use the found user’s MongoDB _id
                datetime: new Date(appointmentData.datetime),
                service: appointmentData.type,
                duration: appointmentData.duration,
                createdAt: appointmentData.datetimeCreated,
                acuityAppointmentId: id,
                status: "Scheduled",
            });

            await newAppointment.save();

            // 🔹 Step 5: Emit update to all connected clients via SSE
            appointmentsClients.forEach(client => {
                client.write(`data: ${JSON.stringify({ message: "New appointment created", appointment: newAppointment })}\n\n`);
            });

            return res.status(201).json({ message: "Appointment saved successfully" });

        } else if (action === "canceled") {
            // Handle canceled appointment: update status to 'Canceled'
            const canceledAppointment = await Appointment.findOneAndUpdate(
                { acuityAppointmentId: id },
                { status: "Canceled" },
                { new: true }
            );

            if (!canceledAppointment) {
                return res.status(404).json({ message: "Appointment not found for cancellation" });
            }

            // Emit update to all connected clients via SSE
            appointmentsClients.forEach(client => {
                client.write(`data: ${JSON.stringify({ message: "Appointment canceled", appointment: canceledAppointment })}\n\n`);
            });

            return res.status(200).json({ message: "Appointment canceled successfully" });

        } else if (action === "rescheduled") {
            // Handle rescheduled appointment: fetch new details and update
            const acuityResponse = await axios.get(
                `https://acuityscheduling.com/api/v1/appointments/${id}`,
                {
                    auth: { username: process.env.ACUITY_USER, password: process.env.ACUITY_API_KEY }
                }
            );

            const appointmentData = acuityResponse.data;
            console.log("Acuity Payload:", appointmentData);

            // Validate required fields before updating
            if (!appointmentData.datetime || !appointmentData.type || !appointmentData.duration || !appointmentData.email) {
                return res.status(400).json({ message: "Missing required fields from Acuity API" });
            }

            let phoneNumber = appointmentData.phone;
            if (phoneNumber.startsWith('+1')) {
                phoneNumber = phoneNumber.slice(2); // Remove the '+1' prefix
            }

            const user = await User.findOne({
                $or: [
                    { email: appointmentData.email },
                    { phoneNumber: phoneNumber }
                ]
            });

            if (!user) {
                return res.status(404).json({ message: "User not found for this rescheduled appointment" });
            }

            // Update the existing appointment with new details
            const updatedAppointment = await Appointment.findOneAndUpdate(
                { acuityAppointmentId: id },
                {
                    datetime: new Date(appointmentData.datetime),
                    service: appointmentData.type,
                    duration: appointmentData.duration,
                    createdAt: appointmentData.datetimeCreated,
                    status: "Scheduled",
                },
                { new: true }
            );

            if (!updatedAppointment) {
                return res.status(404).json({ message: "Appointment not found for rescheduling" });
            }

            // Emit update to all connected clients via SSE
            appointmentsClients.forEach(client => {
                client.write(`data: ${JSON.stringify({ message: "Appointment rescheduled", appointment: updatedAppointment })}\n\n`);
            });

            return res.status(200).json({ message: "Appointment rescheduled successfully" });

        } else {
            // If the action is not recognized
            return res.status(400).json({ message: "Unknown action" });
        }

    } catch (error) {
        console.error('Error processing Acuity webhook:', error);
        res.status(500).send('Error processing webhook');
    }
});


module.exports = router;
