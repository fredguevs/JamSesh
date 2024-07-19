import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // For handling CORS
import helmet from 'helmet'; // For securing HTTP headers
import rateLimit from 'express-rate-limit'; // For rate limiting

import userRoutes from './routes/user/userRoutes.js';
import postRoutes from './routes/post/postRoutes.js';
import audioRoutes from './routes/audio/audioRoutes.js';
import postLikesRoutes from './routes/post/postLikesRoutes.js';
import audioLikesRoutes from './routes/audio/audioLikesRoutes.js';
import uploadTestRoutes from './routes/uploadTestRoutes.js'; // Import the new route
import oauthRoutes from './routes/oauthRoutes.js'; // Import OAuth routes
import { verifyToken } from './middlewares/authMiddleware.js'; // Import auth middleware

import { createUserTable } from './models/user/userModel.js';
import { createPostTable } from './models/post/postModel.js';
import { createAudioTable } from './models/audio/audioModel.js';
import { createPostLikesTable } from './models/post/postLikesModel.js';
import { createAudioLikesTable } from './models/audio/audioLikesModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Secure HTTP headers
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Apply rate limiting

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', verifyToken, postRoutes); // Protect routes with verifyToken middleware
app.use('/api/v1/audios', verifyToken, audioRoutes); // Protect routes with verifyToken middleware
app.use('/api/v1/post-likes', verifyToken, postLikesRoutes); // Protect routes with verifyToken middleware
app.use('/api/v1/audio-likes', verifyToken, audioLikesRoutes); // Protect routes with verifyToken middleware
app.use('/api/v1/auth', oauthRoutes); // Register OAuth routes

// UNUSED: Testing routes
app.use('/api/v1', uploadTestRoutes);

const initializeDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      await createUserTable(); // Ensure the users table is created first
      await createPostTable(); // Ensure the posts table is created after users
      await createAudioTable(); // Ensure the audios table is created after users
      await createPostLikesTable(); // Ensure post likes table is created
      await createAudioLikesTable(); // Ensure audio likes table is created
    } else {
      await createUserTable(); // Ensure the users table is created first
      await createPostTable(); // Ensure the posts table is created after users
      await createAudioTable(); // Ensure the audios table is created after users
      await createPostLikesTable(); // Ensure post likes table is created
      await createAudioLikesTable(); // Ensure audio likes table is created
    }
    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, async () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
  await initializeDatabase();
});
