import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getLecturerDashboard,
  getLecturerStatsById,       // ← new
} from "../Controllers/dashboardController.js";

const router = express.Router();

// Logged-in lecturer's own stats
router.get("/lecturer", protect, getLecturerDashboard);

// Any lecturer's stats by their MongoDB _id  ← new route
router.get("/lecturer/:id", protect, getLecturerStatsById);

export default router;