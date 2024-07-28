import express from 'express';
import { createAudio, fetchAudios, fetchAudioById, fetchAudiosByUser, removeAudio, modifyAudio } from '../../controllers/audio/audioController.js';
import upload from '../../middlewares/uploadMiddleware.js';


const router = express.Router();

router.post('/', upload.single('audio'), createAudio);

router.get('/', fetchAudios); // Get all audios
router.get('/:audioid', fetchAudioById); // Get an audio by ID
router.get('/user/:username', fetchAudiosByUser); // Get audios by user
router.delete('/:audioid', removeAudio); // Delete an audio by ID
router.put('/:audioid', modifyAudio);

export default router;
