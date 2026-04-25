import mongoose from "mongoose";

import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

/* =====================================
   AI Recommendation – Popular Slot
===================================== */

export const getRecommendedSlot = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    // Validate lecturerId
    if (!mongoose.Types.ObjectId.isValid(lecturerId)) {
      return res.status(400).json({ message: "Invalid lecturer ID" });
    }

    // Step 1: Find popular completed booking slots
    const popularSlots = await Appointment.aggregate([
      {
        $match: {
          lecturer: new mongoose.Types.ObjectId(lecturerId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            day: "$day",
            startTime: "$startTime",
          },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 10 },
    ]);

    if (popularSlots.length === 0) {
      return res.json({
        message: "Not enough booking data for AI recommendation",
      });
    }

    // Step 2: Check which of those slots are available
    let recommendedSlots = [];

    for (let slot of popularSlots) {
      const available = await Availability.findOne({
        lecturer: lecturerId,
        day: slot._id.day,
        startTime: slot._id.startTime,
        isBooked: false,
        isBlocked: false,
      });

      if (available) {
        recommendedSlots.push({
          day: slot._id.day,
          time: slot._id.startTime,
          confidenceScore: `${slot.totalBookings * 10}%`,
        });
      }

      if (recommendedSlots.length === 3) break;
    }

    if (recommendedSlots.length === 0) {
      return res.json({
        message: "No available recommended slots found",
      });
    }

    res.json({
      lecturerId,
      recommendedSlots,
    });

  } catch (error) {
    console.error("AI Slot Recommendation Error:", error);
    res.status(500).json({
      message: "AI recommendation failed",
      error: error.message,
    });
  }
};



// AI Recommend Best Lecturer

export const recommendLecturer = async (req, res) => {
  try {

    // Get lecturers with available slots
    const availableSlots = await Availability.find({
      isBooked: false,
      isBlocked: false
    });

    if (availableSlots.length === 0) {
      return res.json({ message: "No available slots found" });
    }

    // Get unique lecturer IDs
    const lecturerIds = [...new Set(
      availableSlots.map(slot => slot.lecturer.toString())
    )];

    let bestLecturer = null;
    let highestRating = 0;

    for (let lecturerId of lecturerIds) {

      const feedbacks = await Feedback.find({ lecturer: lecturerId });

      if (feedbacks.length === 0) continue;

      const total = feedbacks.reduce((sum, f) => sum + f.rating, 0);
      const avg = total / feedbacks.length;

      if (avg > highestRating) {
        highestRating = avg;
        bestLecturer = lecturerId;
      }
    }

    if (!bestLecturer) {
      return res.json({ message: "No rated lecturers found" });
    }

    // 🔹 Get lecturer details
    const lecturer = await User.findById(bestLecturer);

    res.json({
      lecturerId: lecturer._id,
      name: `${lecturer.firstname} ${lecturer.lastname}`,
      email: lecturer.email,
      rating: highestRating.toFixed(1)
    });

  } catch (error) {
    res.status(500).json({
      message: "Error in recommendation system",
      error: error.message
    });
  }
};