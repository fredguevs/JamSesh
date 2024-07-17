import express from 'express';
import { createLike, removeLike, getLikes } from '../../controllers/post/postLikesController.js';

const router = express.Router();

router.post('/post-likes', createLike);
router.delete('/post-likes/:likeid', removeLike);
router.get('/post-likes/:postid', getLikes);

export default router;
