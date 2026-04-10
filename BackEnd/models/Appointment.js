// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availabilitySlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
    },
    date: { type: Date, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
    message: {
      type: String,
      required: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [200, "Message cannot exceed 200 characters"],
      match: [/^[A-Za-z\s]+$/, "Message can only contain letters and spaces"],
    },
    reminderSent: { type: Boolean, default: false },
    cancelReason: { type: String, default: null },
    cancelHistory: [
      {
        cancelledBy: String,
        reason: String,
        date: { type: Date, default: Date.now },
      },
    ],
    isFeedbackSubmitted: { type: Boolean, default: false }, // ✅ NEW FIELD
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
