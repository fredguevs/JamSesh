import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Test file upload endpoint
router.post('/test-upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send({
    message: 'File uploaded successfully',
    file: req.file
  });
});

export default router;

// Curl Commands:
/*
  Image upload: curl -F "file=@/mnt/c/Users/FREDERICK/Downloads/profile.png" http://localhost:5000/api/v1/test-upload
  Video upload: curl -F "file=@/mnt/c/Users/FREDERICK/Videos/ttwu1.mp4" http://localhost:5000/api/v1/test-upload
  Audio upload: curl -F "file=@/mnt/c/Users/FREDERICK/Downloads/bruh.mp3" http://localhost:5000/api/v1/test-upload
*/