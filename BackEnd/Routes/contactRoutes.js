import express from "express";
import {
  startConversation,
  replyToMessage,
  getAllThreads,
  getSingleThread,
  getMyThread,
} from "../controllers/contactController.js";

import verifyToken from "../middleware/verifyToken.js";
import { protect } from "../middleware/authMiddleware.js"; // see note below

const router = express.Router();

// ✅ FIX: /my-thread MUST be defined before /thread/:threadId.
// Express matches routes top-to-bottom — if /:threadId comes first,
// "my-thread" is treated as a threadId and you get a CastError.
router.get("/my-thread", verifyToken, getMyThread);

// ✅ FIX: /start uses optionalAuth instead of verifyToken.
// Guests (no token) must be able to open a support thread.
// optionalAuth sets req.user if a valid token exists, otherwise leaves it null.
router.post("/start", protect, startConversation);

// Authenticated routes
router.post("/reply/:threadId", verifyToken, replyToMessage);
router.get("/threads", verifyToken, getAllThreads);
router.get("/thread/:threadId", verifyToken, getSingleThread);

export default router;

/*
  optionalAuth middleware — create this at middleware/optionalAuth.js:

  import jwt from "jsonwebtoken";

  export default function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(); // no token — that's fine for /start

    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // invalid token — still fine, treat as guest
    }
    next();
  }
*/