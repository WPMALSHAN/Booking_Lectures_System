import ContactThread from "../models/ContactThread.js";
import User from "../models/User.js";
import { io } from "../index.js";

/* =========================
   1. START CONVERSATION
   No auth required — guests and logged-in users both allowed.
========================= */
export const startConversation = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // req.user is set only when optionalAuth middleware is used
    const user = req.user
      ? await User.findById(req.user.id || req.user._id)
      : null;

    const newThread = new ContactThread({
      userId: user?._id || null,
      name: name.trim(),
      email: email.trim(),
      role: (user?.role || "guest").toLowerCase(),
      subject: subject.trim(),
      messages: [
        {
          sender: (user?.role || "guest").toLowerCase(),
          senderId: user?._id || null,
          message: message.trim(),
        },
      ],
    });

    await newThread.save();

    return res.status(201).json({
      msg: "Thread created successfully",
      data: newThread,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   2. REPLY MESSAGE
========================= */
export const replyToMessage = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ msg: "Message cannot be empty" });
    }

    if (!req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const senderRole = (req.user.role || "student").toLowerCase();
    const senderId = req.user.id || req.user._id;

    const newMsg = {
      sender: senderRole,
      senderId,
      message: message.trim(),
      createdAt: new Date(),
    };

    const updatedThread = await ContactThread.findByIdAndUpdate(
      threadId,
      { $push: { messages: newMsg } },
      { new: true }
    );

    if (!updatedThread) {
      return res.status(404).json({ msg: "Thread not found" });
    }

    // Emit to the thread room so all connected clients receive it
    io.to(threadId).emit("newMessage", newMsg);

    return res.json({ msg: "Message sent", data: updatedThread });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   3. GET ALL THREADS (ADMIN)
========================= */
export const getAllThreads = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin only" });
    }

    const threads = await ContactThread.find()
      .sort({ updatedAt: -1 })
      .populate("userId", "name email role");

    return res.json(threads);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   4. GET SINGLE THREAD
========================= */
export const getSingleThread = async (req, res) => {
  try {
    const thread = await ContactThread.findById(req.params.threadId).populate(
      "userId",
      "name email role"
    );

    if (!thread) {
      return res.status(404).json({ msg: "Thread not found" });
    }

    return res.json(thread);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   5. GET MY THREAD
   ✅ FIX: Return the thread directly (no { data: } wrapper) so the
   frontend can read it consistently as res.data instead of res.data.data.
========================= */
export const getMyThread = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const thread = await ContactThread.findOne({
      userId: req.user.id || req.user._id,
    }).sort({ updatedAt: -1 });

    // Return null explicitly when no thread exists — frontend handles both cases
    return res.json(thread || null);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};