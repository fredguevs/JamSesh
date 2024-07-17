import express from 'express';
import { addAudio, fetchAudios, fetchAudioById, fetchAudiosByUser, removeAudio } from '../../controllers/audio/audioController.js';

const router = express.Router();

router.post('/audios', addAudio); // Create a new audio
router.get('/audios', fetchAudios); // Get all audios
router.get('/audios/:audioid', fetchAudioById); // Get an audio by ID
router.get('/audios/user/:username', fetchAudiosByUser); // Get audios by user
router.delete('/audios/:audioid', removeAudio); // Delete an audio by ID

export default router;
