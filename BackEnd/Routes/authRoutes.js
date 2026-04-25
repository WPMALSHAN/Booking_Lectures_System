import express from "express";
import { registerUser, loginUser, getUserDetails , updateUserProfile ,getAllLecturers,getAllStudents, uploadProfilePicture, deleteProfilePicture } from "../Controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/cloudinaryUpload.js";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/profile", protect, getUserDetails);
router.put("/user/profile", protect, updateUserProfile);
router.put("/user/profile/picture", protect, upload.single("profilePicture"), uploadProfilePicture);
router.delete("/user/profile/picture", protect, deleteProfilePicture);
router.get("/admin/lecturers", getAllLecturers);
router.get("/admin/students" , getAllStudents);



export default router;