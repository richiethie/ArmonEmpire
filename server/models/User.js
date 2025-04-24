const mongoose = require("mongoose");
const Appointment = require("./Appointment");  // Import Appointment model

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    membership: { type: String, enum: ["Free", "Bronze", "Silver", "Gold", "Cancelled"], default: "Free" },
    preferredBarber: { type: String, default: "" },
    drinkOfChoice: { type: String, default: "" },
    isOfLegalDrinkingAge: { type: Boolean, default: false },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],  // Reference to Appointment model
    phoneNumber: { type: String, required: true, unique: true },
    photoId: { 
      data: Buffer, 
      contentType: String,
      fileName: String, 
    },
    verifiedId: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },

    // Stripe Integration
    stripeCustomerId: { type: String, default: null }, // Stores Stripe customer ID
    subscriptionId: { type: String, default: null }, // Stores Stripe subscription ID
    paymentStatus: {
      type: String,
      enum: ["active", "past_due", "cancelled", "pending", "incomplete"],
      default: "active"
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
