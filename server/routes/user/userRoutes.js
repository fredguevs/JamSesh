import express from 'express';
import { addUser, fetchUsers, fetchUserByUsername, modifyUser, removeUser, searchUsers} from '../../controllers/user/userController.js';

const router = express.Router();

router.post('/users', addUser); // Create a new user
router.get('/users', fetchUsers); // Get all users
router.get('/users/:username', fetchUserByUsername); // Get a user by username
router.put('/users/:username', modifyUser); // Update a user by username
router.delete('/users/:username', removeUser); // Delete a user by username
router.get('/search', searchUsers); // Search usernames

export default router;
