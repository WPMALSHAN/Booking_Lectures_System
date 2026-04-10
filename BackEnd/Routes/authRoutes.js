import express from "express";
import { registerUser, loginUser, getUserDetails , updateUserProfile ,getAllLecturers,getAllStudents } from "../Controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/profile", protect, getUserDetails);
router.put("/user/profile", protect, updateUserProfile);
router.get("/admin/lecturers", getAllLecturers);
router.get("/admin/students" , getAllStudents);



export default router;