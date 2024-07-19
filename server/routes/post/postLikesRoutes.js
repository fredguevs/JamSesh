import express from 'express';
import { createLike, removeLike, getLikes } from '../../controllers/post/postLikesController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/post-likes', verifyToken, createLike);
router.delete('/post-likes/:likeid', verifyToken, removeLike);
router.get('/post-likes/:postid', getLikes);

export default router;
