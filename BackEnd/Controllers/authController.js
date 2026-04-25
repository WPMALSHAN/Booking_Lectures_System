import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cloudinary } from "../middleware/cloudinaryUpload.js";


export const registerUser = async (req, res) => {
  try {
    const { email, firstname, lastname, password, department} = req.body;

    
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const deptRegex = /^[A-Za-z\s]{0,50}$/;
    const passwordMinLength = 6;

   
    if (!email || !firstname || !lastname || !password) {
      return res.status(400).json({
        message: "All fields (email, firstname, lastname, password) are required",
        status: "error",
      });
    }

 
    if (!nameRegex.test(firstname)) {
      return res.status(400).json({
        message: "Firstname must contain only letters and spaces",
        status: "error",
      });
    }

    if (!nameRegex.test(lastname)) {
      return res.status(400).json({
        message: "Lastname must contain only letters and spaces",
        status: "error",
      });
    }

    
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Email must be a valid Gmail address",
        status: "error",
      });
    }

  
    if (department && !deptRegex.test(department)) {
      return res.status(400).json({
        message: "Department can contain only letters & spaces (max 50 chars)",
        status: "error",
      });
    }

   
    if (password.length < passwordMinLength) {
      return res.status(400).json({
        message: `Password must be at least ${passwordMinLength} characters long`,
        status: "error",
      });
    }

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        status: "error",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      firstname,
      lastname,
      password: hashedPassword,
      role: "student",
      department,
    });

    res.status(201).json({
      message: "User registered successfully",
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Registration failed",
      status: "error",
    });
  }
};

/* ===============================
   LOGIN USER
================================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "User not found",
        status: "error",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "User is blocked",
        status: "error",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid password",
        status: "error",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      status: "success",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      status: "error",
    });
  }
};





/* ===============================
   GET USER DETAILS
================================= */

export const getUserDetails = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error",
      });
    }

    res.status(200).json({
      message: "User details fetched successfully",
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture,
        isBlocked: user.isBlocked
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user details",
      status: "error"
    });
  }
};

/* ===============================
UPDATE USER PROFILE
================================= */

export const updateUserProfile = async (req, res) => {
  try {

    const { firstname, lastname, email, department } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error"
      });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.department = department || user.department;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      status: "success",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        department: user.department,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      status: "error"
    });
  }
};


// Get all lecturers
export const getAllLecturers = async (req, res) => {
  try {
    const lecturers = await User.find({ role: "lecturer" }).select("-password");

    res.status(200).json({
      success: true,
      count: lecturers.length,
      data: lecturers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//Get All Students

export const getAllStudents = async (req, res) => {
  try {

    // ✅ Get only users with role = student
    const students = await User.find({ role: "student" }).select("-password");

    res.status(200).json({
      message: "Students fetched successfully",
      status: "success",
      students
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      status: "error"
    });
  }
};

/* ===============================
UPLOAD PROFILE PICTURE
================================= */

// Helper: stream a Buffer to Cloudinary and return the result
const streamToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        status: "error"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error"
      });
    }

    // Delete old picture from Cloudinary before uploading new one
    if (user.profilePicturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      } catch (err) {
        console.error("Error deleting old image from Cloudinary:", err);
      }
    }

    // Upload the buffer directly to Cloudinary
    const result = await streamToCloudinary(req.file.buffer, {
      folder: "booking_lectures_system/profile_pictures",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
      resource_type: "image",
    });

    // Save the returned URL and public_id to the user document
    user.profilePicture = result.secure_url;
    user.profilePicturePublicId = result.public_id;

    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePicture: user.profilePicture,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Profile picture upload failed",
      status: "error",
      error: error.message
    });
  }
};

/* ===============================
DELETE PROFILE PICTURE
================================= */

export const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error"
      });
    }

    // Delete picture from Cloudinary if a custom one exists
    if (user.profilePicturePublicId) {
      try {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    // Reset to default profile picture
    user.profilePicture = "https://res.cloudinary.com/dz1qj3x4h/image/upload/v1735681234/DefaultProfilePicture.png";
    user.profilePicturePublicId = null;

    await user.save();

    res.status(200).json({
      message: "Profile picture deleted successfully",
      status: "success",
      user: {
        id: user._id,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Profile picture deletion failed",
      status: "error"
    });
  }
};

