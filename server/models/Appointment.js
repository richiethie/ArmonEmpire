const mongoose = require("mongoose");
const User = require("./User");

const AppointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to the User model
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Canceled"],
      default: "Scheduled",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    clientId: {
        type: String,
        required: false,  // Only if needed for external reference
    },
    duration: {
        type: Number, // Store in minutes
        required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
