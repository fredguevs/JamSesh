import express from 'express';
import { addUser, fetchUsers, fetchUserByUsername, modifyUser, removeUser, searchUsers, createAccount } from '../../controllers/user/userController.js';
import upload from '../../middlewares/uploadMiddleware.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/users', upload.single('profilePicture'), addUser);
router.get('/users', fetchUsers); // Get all users
router.get('/users/:username', verifyToken, fetchUserByUsername); // Get a user by username
router.put('/users/:username', verifyToken, modifyUser); // Update a user by username
router.delete('/users/:username', verifyToken, removeUser); // Delete a user by username
router.get('/search', searchUsers); // Search usernames
router.post('/create-account', createAccount); // Create a new account

export default router;
