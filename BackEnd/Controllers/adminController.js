import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Feedback from "../models/Feedback.js";

export const getAdminAnalytics = async (req, res) => {
  try {

    const totalStudents = await User.countDocuments({ role: "student" });
    const totalLecturers = await User.countDocuments({ role: "lecturer" });

    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: "completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "cancelled" });

    const totalFeedbacks = await Feedback.countDocuments();

    res.json({
      totalStudents,
      totalLecturers,
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      totalFeedbacks
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

// Create Separate Admin-Only Lecturer Creation

export const createLecturer = async (req, res) => {
  const { email, firstname, lastname, password, department } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const lecturer = await User.create({
    email,
    firstname,
    lastname,
    password: hashedPassword,
    role: "lecturer",
    department,
  });

  res.status(201).json({
    message: "Lecturer created successfully",
  });
};

// Admin can  Soft Delete  Users {Lecture And Students}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id); // ✅ HARD DELETE

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "User permanently deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Can Block Users {Lecture And Students}

export const blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );

    res.json({ success: true, data: user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Can Unblock Users {Lecture And Students}

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );

    res.json({ success: true, data: user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Admin Can Update His profile

export const updateAdminProfile = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    const updatedAdmin = await User.findByIdAndUpdate(
      req.user._id,
      { firstname, lastname, email },
      { new: true }
    );

    res.json({ success: true, data: updatedAdmin });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


