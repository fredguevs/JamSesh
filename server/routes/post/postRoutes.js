import express from 'express';
import { createPost, fetchPosts, fetchPostById, fetchPostsByUser, removePost } from '../../controllers/post/postController.js';
import upload from '../../middlewares/uploadMiddleware.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/post', verifyToken, upload.fields([{ name: 'image' }, { name: 'video' }]), createPost);
router.get('/post', fetchPosts);
router.get('/post/:postid', fetchPostById);
router.get('/post/user/:username', fetchPostsByUser);
router.delete('/post/:postid', verifyToken, removePost);

export default router;
