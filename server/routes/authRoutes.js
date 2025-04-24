require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();

// Register User
router.post("/signup", async (req, res) => {
    try {
        let { firstName, lastName, email, phoneNumber, password, membership } = req.body;

        // Trim "+1" from the beginning of the phone number if it exists
        if (phoneNumber.startsWith("+1")) {
            phoneNumber = phoneNumber.slice(2); // Remove the first two characters ("+1")
        }
  
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
    
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create user
        user = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, membership });
        await user.save();
    
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,  // Ensure you have your JWT secret in an environment variable
            { expiresIn: "1h" } // Set expiration time for the token (1 hour here)
        );
    
        // Send response with user data and token
        res.status(201).json({
            message: "User registered successfully",
            user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            membership: user.membership,
            },
            token, // Send the token back
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, firstName: user.firstName, email: user.email, membership: user.membership } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token to the user's document in the database with expiration
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    // Configure Nodemailer Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, password } = req.body;

    // Check if email and token are provided
    if (!token || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if reset token exists and is not expired
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    if (user.resetPasswordToken !== resetTokenHash) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Check if token has expired
    if (Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password
    user.password = hashedPassword;

    // Clear reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the user with the new password
    await user.save();

    // Send a success response
    res.json({ message: "Password has been successfully reset" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
