import express from "express";
import { submitFeedback , getLecturerFeedback ,getStudentFeedback1,updateFeedback,deleteFeedback,getAllFeedbacks} from "../Controllers/feedbackController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/submit/:id",protect , submitFeedback);
router.get("/student", protect, getStudentFeedback1);
router.put("/student/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);
router.get("/lecturer", protect, getLecturerFeedback);
router.get("/all", protect, getAllFeedbacks);


export default router;