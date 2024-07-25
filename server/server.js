import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import userRoutes from './routes/user/userRoutes.js';
import postRoutes from './routes/post/postRoutes.js';
import audioRoutes from './routes/audio/audioRoutes.js';
import postLikesRoutes from './routes/post/postLikesRoutes.js';
import audioLikesRoutes from './routes/audio/audioLikesRoutes.js';
import uploadTestRoutes from './routes/uploadTestRoutes.js';

import { createSessionTable } from './models/user/sessionModel.js';
import { createUserTable } from './models/user/userModel.js';
import { createPostTable } from './models/post/postModel.js';
import { createAudioTable } from './models/audio/audioModel.js';
import { createPostLikesTable } from './models/post/postLikesModel.js';
import { createAudioLikesTable } from './models/audio/audioLikesModel.js';
import pool from './config/db.js'; // Adjust the path to your actual configuration file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const pgSession = connectPgSimple(session);

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'Lax'
  }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/audios', audioRoutes);
app.use('/api/v1/post-likes', postLikesRoutes);
app.use('/api/v1/audio-likes', audioLikesRoutes);
app.use('/api/v1', uploadTestRoutes);

// Add a direct session test route here
app.get('/api/v1/session', (req, res) => {

  if (req.session && req.session.user) {

    res.status(200).json(req.session.user);
  } else {
    console.log('No active session, returning 404 status.');
    res.status(404).json({ message: 'No active session' });
  }
});

const initializeDatabase = async () => {
  try {
    await createSessionTable();
    await createUserTable();
    await createPostTable();
    await createAudioTable();
    await createPostLikesTable();
    await createAudioLikesTable();
    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, async () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
  await initializeDatabase();
});
