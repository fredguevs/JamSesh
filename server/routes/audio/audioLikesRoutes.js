import express from 'express';
import { createAudioLike, removeAudioLike, fetchAudioLikes } from '../../controllers/audio/audioLikesController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/audio-likes', verifyToken, createAudioLike);
router.delete('/audio-likes/:likeid', verifyToken, removeAudioLike);
router.get('/audio-likes/:audioid', fetchAudioLikes);

export default router;
