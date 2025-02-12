const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

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

router.post('/acuity-webhook', async (req, res) => {
    const appointmentData = req.body;
  
    try {
      // Find the user by the client_id in the webhook data
      const user = await User.findOne({ acuityClientId: appointmentData.client_id }); // Assuming acuityClientId exists in your User model
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Create a new appointment using the webhook data
      const newAppointment = new Appointment({
        clientId: appointmentData.client_id,
        datetime: appointmentData.datetime,
        service: appointmentData.service,
        duration: appointmentData.duration,
        status: appointmentData.status,
        // Map other fields as necessary from the webhook
      });
  
      // Save the new appointment to the database
      await newAppointment.save();
  
      // Add the new appointment to the user's appointments array
      user.appointments.push(newAppointment._id);
      await user.save();
  
      // Send a response confirming that the webhook has been processed successfully
      res.status(200).send('Appointment created and linked to user');
    } catch (error) {
      console.error('Error processing Acuity webhook:', error);
      res.status(500).send('Error processing webhook');
    }
  });

module.exports = router;
