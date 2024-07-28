import express from 'express';
import { addUser, fetchUsers, fetchUserByUsername, removeUser, searchUsers, createAccount, changeUserPassword } from '../../controllers/user/userController.js';
import profileUpload from '../../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', profileUpload.single('profilePicture'), addUser);
router.get('/', fetchUsers); // Get all users
router.get('/:username', fetchUserByUsername); // Get a user by username
router.delete('/:username', removeUser); // Delete a user by username
router.put('/:username/password', changeUserPassword); // Change user password
router.get('/test/search', searchUsers); // Search usernames
router.post('/create-account', profileUpload.single('profilePicture'), createAccount); // Create a new account


export default router;
