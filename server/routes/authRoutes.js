const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/signup", async (req, res) => {
    try {
      const { firstName, lastName, email, password, membership } = req.body;
  
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create user
      user = new User({ firstName, lastName, email, password: hashedPassword, membership });
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

module.exports = router;
