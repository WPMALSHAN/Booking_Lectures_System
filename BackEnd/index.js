import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

/* =============================
   ROUTES IMPORT
============================= */
import authRoutes from "./Routes/authRoutes.js";
import availabilityRoutes from "./Routes/availabilityRoutes.js";
import appointmentRoutes from "./Routes/appointmentRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import adminRoute from "./Routes/adminRoute.js";
import contactRoutes from "./Routes/contactRoutes.js";

import verifyToken from "./middleware/verifyToken.js";
import "./utils/reminderCron.js";
import { errorHandler } from "./middleware/errorHandler.js";

/* =============================
   APP + SERVER
============================= */
const app = express();
const server = http.createServer(app);

/* =============================
   SOCKET.IO SETUP
============================= */
export const io = new Server(server, {
  cors: {
<<<<<<< HEAD
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
=======
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5177",
      process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
>>>>>>> 76756af4de6936ccc0e1924604c02040004d70ce
});

/* =============================
   SOCKET REAL-TIME CHAT
============================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join chat room (each thread = room)
  socket.on("joinThread", (threadId) => {
    socket.join(threadId);
    console.log(`Joined thread: ${threadId}`);
  });

  // Send message in real-time
  socket.on("sendMessage", ({ threadId, message, sender }) => {
    io.to(threadId).emit("newMessage", {
      message,
      sender,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =============================
   MIDDLEWARE
============================= */
app.use(
  cors({
<<<<<<< HEAD
    origin: "http://localhost:5173",
    credentials: true,
=======
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5177",
      process.env.FRONTEND_URL || "http://localhost:5173"
    ],
    credentials: true
>>>>>>> 76756af4de6936ccc0e1924604c02040004d70ce
  })
);

app.use(express.json());

/* =============================
   DATABASE CONNECTION
============================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* =============================
   API ROUTES
============================= */
app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/contact", contactRoutes);

/* =============================
   TEST ROUTE
============================= */
app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

/* =============================
   ERROR HANDLER
============================= */
app.use(errorHandler);

/* =============================
   START SERVER
============================= */
server.listen(7000, () => {
  console.log("Server running on port 7000");
});