import express from 'express';
import { createAudio, fetchAudios, fetchAudioById, fetchAudiosByUser, removeAudio } from '../../controllers/audio/audioController.js';
import upload from '../../middlewares/uploadMiddleware.js';


const router = express.Router();

router.post('/audios', upload.single('audio'), createAudio);
router.get('/audios', fetchAudios); // Get all audios
router.get('/audios/:audioid', fetchAudioById); // Get an audio by ID
router.get('/audios/user/:username', fetchAudiosByUser); // Get audios by user
router.delete('/audios/:audioid', removeAudio); // Delete an audio by ID

export default router;
