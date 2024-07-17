import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import postLikesRoutes from './routes/postLikesRoutes.js';
import audioLikesRoutes from './routes/audioLikesRoutes.js';
import { createUserTable } from './models/userModel.js';
import { createPostTable } from './models/postModel.js';
import { createAudioTable } from './models/audioModel.js';
import { createPostLikesTable } from './models/postLikesModel.js';
import { createAudioLikesTable } from './models/audioLikesModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/audios', audioRoutes);
app.use('/api/v1/post-likes', postLikesRoutes);
app.use('/api/v1/audio-likes', audioLikesRoutes);

const initializeDatabase = async () => {
  await createUserTable();
  await createPostTable();
  await createAudioTable();
  await createPostLikesTable();
  await createAudioLikesTable();
};

app.listen(PORT, async () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
  await initializeDatabase();
});
