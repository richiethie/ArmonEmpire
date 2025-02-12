// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import your User model
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Middleware to check if the user is authenticated using JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Assuming the token is passed as a Bearer token

  if (!token) {
    return res.status(403).json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Route to get user data (protected)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    // Fetch the user from the database using the user ID from the JWT token
    const user = await User.findById(req.user.id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Send the user data as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user membership
router.post("/update-membership", authenticateJWT, async (req, res) => {
    const { membership } = req.body;
    try {
      // Assuming you have a way to identify the logged-in user, for example:
      const userId = req.user.id; // This could be from a token or session
  
      // Update the user's membership
      const user = await User.findByIdAndUpdate(userId, { membership }, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Membership updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
});

// Update user preferences
router.put("/update", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from auth token
        const { preferredBarber, drinkOfChoice } = req.body;

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { preferredBarber, drinkOfChoice },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
