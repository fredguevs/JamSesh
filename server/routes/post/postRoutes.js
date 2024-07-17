import express from 'express';
import { addPost, fetchAllPosts, fetchPostsByUser, fetchPostById, removePost } from '../../controllers/post/postController.js';

const router = express.Router();

router.post('/posts', addPost); // Create a new post
router.get('/posts', fetchAllPosts); // Get all posts
router.get('/posts/user/:username', fetchPostsByUser); // Get all posts for a specific user
router.get('/posts/:postid', fetchPostById); // Get a single post by ID
router.delete('/posts/:postid', removePost); // Delete a post by ID

export default router;
