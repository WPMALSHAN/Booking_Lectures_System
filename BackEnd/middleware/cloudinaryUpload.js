import dotenv from "dotenv";
dotenv.config(); // ensure env vars loaded when this module is evaluated

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary — env vars are guaranteed loaded above
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — file arrives as a Buffer in req.file.buffer
// The controller streams it directly to Cloudinary via upload_stream
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export { upload, cloudinary };

