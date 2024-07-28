import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import sessionLogger from './middlewares/sessionLogger.js';
import followingRoutes from './routes/following/followingRoutes.js'
import userRoutes from './routes/user/userRoutes.js';
import postRoutes from './routes/post/postRoutes.js';
import audioRoutes from './routes/audio/audioRoutes.js';
import postLikesRoutes from './routes/post/postLikesRoutes.js';
import audioLikesRoutes from './routes/audio/audioLikesRoutes.js';
import uploadTestRoutes from './routes/uploadTestRoutes.js';
import upload from './middlewares/uploadMiddleware.js';

import { getUserByUsername, updateUser } from './models/user/userModel.js';

import { createSessionTable } from './models/user/sessionModel.js';
import { createUserTable } from './models/user/userModel.js';
import { createFollowingTable } from './models/following/followingModel.js';
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
app.use(
  helmet.crossOriginResourcePolicy({ policy: 'same-site' })
);
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

app.use(sessionLogger);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes); // Ensure this is added correctly
app.use('/api/v1/audios', audioRoutes);
app.use('/api/v1/post-likes', postLikesRoutes);
app.use('/api/v1/audio-likes', audioLikesRoutes);
app.use('/api/v1/following', followingRoutes);
app.use('/api/v1', uploadTestRoutes);

app.get('/api/v1/session', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(404).json({ message: 'No active session' });
  }
});

app.post('/api/v1/logout', (req, res) => {
  console.log('logout api called');
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Failed to logout' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with username:', username);

  try {
    const user = await getUserByUsername(username); // Replace this with your actual user validation logic
    if (user && user.password === password) {
      req.session.user = {
        username: user.username,
        fullname: user.fullname,
        email: user.email,
      };

      req.session.save(err => {
        if (err) {
          console.error('Failed to save session:', err);
          return res.status(500).json({ error: 'Failed to save session' });
        }
        return res.status(200).json({ message: 'Login successful', user: req.session.user });
      });
    } else {
      console.log('Incorrect username or password');
      res.status(403).json({ message: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.post('/api/v1/login', loginUser);

const modifyUser = async (req, res) => {
  const { username } = req.params;
  const { fullname, email } = req.body;
  const profilePictureUrl = req.file ? req.file.path : null;

  console.log('Request Params:', req.params);
  console.log('Request Body:', req.body);
  console.log('File:', req.file);
  console.log('Request Session:', req.session);
  console.log('Request Session User:', req.session.user);

  // Check if the logged-in user is trying to modify their own profile
  if (req.session.user?.username !== username) {
    console.log('Username:', username);
    console.log('Session User:', req.session.user);
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Validate input data
  if (!fullname || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    const updatedUser = await updateUser(username, fullname, email, profilePictureUrl);
    res.status(200).json({ message: 'Successfully updated user', user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add route for modifying user
app.put('/api/v1/users/:username', upload.single('profilePicture'), modifyUser);

const initializeDatabase = async () => {
  try {
    await createSessionTable();
    await createUserTable();
    await createFollowingTable();
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
