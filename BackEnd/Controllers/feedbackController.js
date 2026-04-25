import Feedback from "../models/Feedback.js";
import Appointment from "../models/Appointment.js";

export const submitFeedback = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit feedback" });
    }

    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ message: "Rating is required" });

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (!appointment.student) {
      return res.status(400).json({ message: "Invalid appointment data" });
    }

    if (appointment.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only review your own appointments" });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({ message: "Feedback allowed only after completion" });
    }

    const existing = await Feedback.findOne({ appointment: appointment._id });
    if (existing) return res.status(400).json({ message: "Feedback already submitted" });

    const feedback = await Feedback.create({
      appointment: appointment._id,
      student: req.user.id,
      lecturer: appointment.lecturer,
      rating,
      comment
    });

    appointment.isFeedbackSubmitted = true;
    await appointment.save();

    res.status(201).json({ message: "Feedback submitted successfully", feedback });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ message: "Error submitting feedback", error: error.message });
  }
};

//Get Lecture's own Feedbacks

export const getLecturerFeedback = async (req, res) => {
  try {

    const lecturerId = req.user.id;

    const feedbacks = await Feedback.find({
      lecturer: lecturerId
    })
    .populate("student", "firstname lastname")
    .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        feedbacks: []
      });
    }

    const totalRating = feedbacks.reduce((sum, item) => sum + item.rating, 0);

    const averageRating = (totalRating / feedbacks.length).toFixed(1);

    res.json({
      averageRating,
      totalReviews: feedbacks.length,
      feedbacks
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching lecturer feedback",
      error: error.message
    });
  }
};

// GET student feedbacks
export const getStudentAppointments = async (req, res) => {
  try {

    const appointments = await Appointment.find({
      student: req.user.id
    })
      .populate("lecturer", "firstname lastname")
      .sort({ date: -1 });

    // remove completed appointments with feedback
    const filteredAppointments = appointments.filter(
      (appt) => !(appt.status === "completed" && appt.isFeedbackSubmitted)
    );

    res.json(filteredAppointments);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message
    });
  }
};

// UPDATE feedback
export const updateFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.student.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    feedback.rating = rating || feedback.rating;
    feedback.comment = comment || feedback.comment;

    const updated = await feedback.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get feedback history for student
export const getStudentFeedback1 = async (req, res) => {
  try {
    if (req.user.role !== "student") return res.status(403).json({ message: "Only students can view feedback history" });

    const feedbacks = await Feedback.find({ student: req.user.id })
      .populate("lecturer", "firstname lastname")
      .populate({ path: "appointment", select: "date startTime status" })
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error loading feedback history", error: error.message });
  }
};

/* =========================
   2. GET ALL FEEDBACKS (Admin)
   Populates student name/email, lecturer name, appointment date
========================= */
export const getAllFeedbacks = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin only" });
    }
 
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate("student",     "name email role")
      .populate("lecturer",    "name email role")
      .populate("appointment", "date time status");
 
    return res.json(feedbacks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/* =========================
   5. DELETE FEEDBACK (Admin)
========================= */
export const deleteFeedback = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin only" });
    }
 
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
 
    if (!feedback) {
      return res.status(404).json({ msg: "Feedback not found" });
    }
 
    return res.json({ msg: "Feedback deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

