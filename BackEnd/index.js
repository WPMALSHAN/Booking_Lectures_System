import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./Routes/authRoutes.js";
import verifyToken from "./middleware/verifyToken.js";
import availabilityRoutes from "./Routes/availabilityRoutes.js";
import appointmentRoutes from "./Routes/appointmentRoutes.js";
import aiRoutes from "./Routes/aiRoutes.js";
import "./utils/reminderCron.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";
import dashboardRoutes from "./Routes/dashboardRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import adminRoute from "./Routes/adminRoute.js"

const app = express();

/* =============================
   CREATE HTTP SERVER
============================= */

const server = http.createServer(app);

/* =============================
   SOCKET.IO SETUP
============================= */

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =============================
   MIDDLEWARE
============================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

/* =============================
   DATABASE
============================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

/* =============================
   ROUTES
============================= */

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoute );


/* =============================
   TEST ROUTE
============================= */

app.get("/api/test", verifyToken, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
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