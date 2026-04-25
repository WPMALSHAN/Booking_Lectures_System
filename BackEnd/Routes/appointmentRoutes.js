import express from "express";
import {
  bookAppointment,
  approveAppointment,
  cancelAppointment,
  // submitFeedback,
  completeAppointment,
  getStudentAppointments,getLecturerAppointments,
  getAllAppointments,
  getAppointmentStatistics

} from "../Controllers/appointmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", protect, bookAppointment);
router.put("/approve/:id", protect, approveAppointment);
router.put("/cancel/:id", protect, cancelAppointment);
router.put("/complete/:id",protect, completeAppointment);
router.get("/student", protect, getStudentAppointments);
router.get("/lecturer",protect , getLecturerAppointments);
// Admin routes - protected and authorized
router.get("/admin/all", protect, getAllAppointments);
router.get(
  "/admin/statistics",
  protect,
  
  getAppointmentStatistics
);


export default router;
