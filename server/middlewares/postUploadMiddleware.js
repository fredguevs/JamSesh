import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads directory exists
const postUploadDir = 'uploads/posts';
if (!fs.existsSync(postUploadDir)) {
  fs.mkdirSync(postUploadDir, { recursive: true });
}

// Configure storage options for posts
const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, postUploadDir); // Directory to save post files
  },
  filename: (req, file, cb) => {
    // Make each file name unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with storage configuration for posts
const postUpload = multer({ storage: postStorage });

export default postUpload;
