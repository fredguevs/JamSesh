import express from 'express';
import { addUser, fetchUsers, fetchUserByUsername, modifyUser, removeUser, searchUsers, createAccount, loginUser } from '../../controllers/user/userController.js';
import upload from '../../middlewares/uploadMiddleware.js'

const router = express.Router();

router.post('/', upload.single('profilePicture'), addUser);
router.get('/', fetchUsers); // Get all users
router.get('/:username', fetchUserByUsername); // Get a user by username
router.put('/:username', modifyUser); // Update a user by username
router.delete('/:username', removeUser); // Delete a user by username

router.get('/search', searchUsers); // Search usernames
router.post('/create-account', createAccount); // Create a new account


router.post('/login', loginUser);


export default router;
