// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import your User model
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const multer = require('multer');
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

router.get("/members", async (req, res) => {
  try {
    const members = await User.find();

    // Convert photoId to Base64 safely
    const membersWithBase64Images = members.map((member) => {
      let base64PhotoId = null;

      if (member.photoId && member.photoId.data) {
        try {
          // Ensure it's a Buffer before converting
          base64PhotoId = {
            contentType: member.photoId.contentType,
            data: Buffer.isBuffer(member.photoId.data)
              ? member.photoId.data.toString("base64")
              : null, // Return null if data is not a Buffer
            fileName: member.photoId.fileName,
          };
        } catch (error) {
          console.error("Error processing photoId for user:", member.email, error);
          base64PhotoId = null; // Ensure it doesn't break the response
        }
      }

      return {
        ...member._doc,
        photoId: base64PhotoId, // Return null if photoId was invalid
      };
    });

    res.json(membersWithBase64Images);
  } catch (error) {
    console.error("Failed to fetch members:", error);
    res.status(500).json({ error: "Failed to fetch members" });
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
router.put("/update", authenticateJWT, upload.single('photoID'), async (req, res) => {
  try {
      const userId = req.user.id; // Extract user ID from auth token
      const { preferredBarber, drinkOfChoice, firstName, lastName, email, photoIDName } = req.body;

      // Initialize an object to store the update fields
      const updateFields = {
          preferredBarber,
          drinkOfChoice,
          firstName,
          lastName,
          email,
      };

      // If a photo has been uploaded, add it to the update object
      if (req.file) {
          updateFields.photoId = {
              data: req.file.buffer,  // File content as Buffer
              contentType: req.file.mimetype, // File type (e.g., image/jpeg)
              fileName: photoIDName,
          };
      }

      // Find and update the user
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          updateFields,
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

router.post("/upload-photo-id", upload.single("photo"), async (req, res) => {
  try {
    const user = await User.findById(req.body.userId); // Get user by ID
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save photo ID data
    user.photoId = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };
    
    await user.save();
    res.status(200).json({ message: "Photo ID uploaded successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload photo ID" });
  }
});

router.patch("/verify-id", authenticateJWT, async (req, res) => {
  const { userId, verified } = req.body;

  // Check for a valid boolean value
  if (typeof verified !== "boolean") {
      return res.status(400).json({ message: "Invalid verified value. It must be true or false." });
  }

  try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      // Update the user's verification status
      user.verifiedId = verified;
      await user.save();

      return res.status(200).json({ message: "User verification status updated", user });
  } catch (error) {
      console.error("Error updating user verification:", error);
      return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
