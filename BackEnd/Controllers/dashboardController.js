import Appointment from "../models/Appointment.js";
import Feedback from "../models/Feedback.js";

/* ─────────────────────────────────────────
   GET /dashboard/lecturer
   Returns stats for the LOGGED-IN lecturer
───────────────────────────────────────── */
export const getLecturerDashboard = async (req, res, next) => {
  try {
    const lecturerId = req.user.id;

    const totalAppointments = await Appointment.countDocuments({ lecturer: lecturerId });
    const pending   = await Appointment.countDocuments({ lecturer: lecturerId, status: "pending"   });
    const approved  = await Appointment.countDocuments({ lecturer: lecturerId, status: "approved"  });
    const completed = await Appointment.countDocuments({ lecturer: lecturerId, status: "completed" });
    const cancelled = await Appointment.countDocuments({ lecturer: lecturerId, status: "cancelled" });

    const feedbacks = await Feedback.find({ lecturer: lecturerId });
    let averageRating = 0;
    if (feedbacks.length > 0) {
      const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
      averageRating = total / feedbacks.length;
    }

    res.json({
      totalAppointments,
      pending,
      approved,
      completed,
      cancelled,
      averageRating: averageRating.toFixed(1),
      totalFeedbacks: feedbacks.length,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/* ─────────────────────────────────────────
   GET /dashboard/lecturer/:id
   Returns stats for ANY lecturer by their ID
   (Used by the faculty directory modal)
───────────────────────────────────────── */
export const getLecturerStatsById = async (req, res, next) => {
  try {
    const lecturerId = req.params.id;   // ← comes from the URL, not the token

    const totalAppointments = await Appointment.countDocuments({ lecturer: lecturerId });
    const pending   = await Appointment.countDocuments({ lecturer: lecturerId, status: "pending"   });
    const approved  = await Appointment.countDocuments({ lecturer: lecturerId, status: "approved"  });
    const completed = await Appointment.countDocuments({ lecturer: lecturerId, status: "completed" });
    const cancelled = await Appointment.countDocuments({ lecturer: lecturerId, status: "cancelled" });

    const feedbacks = await Feedback.find({ lecturer: lecturerId });
    let averageRating = 0;
    if (feedbacks.length > 0) {
      const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
      averageRating = total / feedbacks.length;
    }

    res.json({
      totalAppointments,
      pending,
      approved,
      completed,
      cancelled,
      averageRating: averageRating.toFixed(1),
      totalFeedbacks: feedbacks.length,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};