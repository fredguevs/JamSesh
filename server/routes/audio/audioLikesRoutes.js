import express from 'express';
import { createAudioLike, removeAudioLike, fetchAudioLikes } from '../../controllers/audio/audioLikesController.js';

const router = express.Router();

router.post('/audio-likes', createAudioLike);
router.delete('/audio-likes/:likeid', removeAudioLike);
router.get('/audio-likes/:audioid', fetchAudioLikes);

export default router;
