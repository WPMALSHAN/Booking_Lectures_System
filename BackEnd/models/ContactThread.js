import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      // ✅ FIX: Added "admin" and "guest" — without "admin" here, every admin reply
      // throws a Mongoose validation error and the message is never saved.
      enum: ["student", "lecturer", "admin", "guest"],
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const contactThreadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    email: String,
    role: {
      type: String,
      enum: ["student", "lecturer", "guest"],
    },
    subject: String,
    messages: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("ContactThread", contactThreadSchema);