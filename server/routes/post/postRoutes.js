// routes/post/postRoutes.js
import express from 'express';
import { createPost, fetchPosts, fetchPostById, fetchPostsByUser, removePost, modifyPost } from '../../controllers/post/postController.js';
import upload from '../../middlewares/postUploadMiddleware.js';

const router = express.Router();

// Define the route for creating a post
router.post('/', upload.fields([{ name: 'image' }, { name: 'video' }]), createPost);

// Other routes
router.get('/', fetchPosts);
router.get('/:postid', fetchPostById);
router.get('/user/:username', fetchPostsByUser);
router.delete('/:postid', removePost);
router.put('/:postid', modifyPost);

export default router;
