import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import {
  createLecturer,
  getAdminAnalytics,
  deleteUser,
  blockUser,
  unblockUser,
  updateAdminProfile,
} from "../Controllers/adminController.js";

const router = express.Router();

router.post("/create-lecturer", protect, isAdmin, createLecturer);
router.get("/analytics", protect, isAdmin, getAdminAnalytics);
router.delete("/users/:id/delete", protect, isAdmin, deleteUser);
router.put("/users/:id/block",protect,isAdmin, blockUser);
router.put("/users/:id/unblock",protect,isAdmin, unblockUser);
router.put("/users/:id/update-profile", protect, isAdmin, updateAdminProfile);

export default router;
