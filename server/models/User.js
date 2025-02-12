const mongoose = require("mongoose");
const Appointment = require("./Appointment");  // Import Appointment model

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    membership: { type: String, enum: ["Free", "Bronze", "Silver", "Gold"], default: "Free" },
    preferredBarber: { type: String, default: "" },
    drinkOfChoice: { type: String, default: "" },
    isOfLegalDrinkingAge: { type: Boolean, default: false },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],  // Reference to Appointment model
    phoneNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
