import express from 'express';
import { getFollowing, followUser, unfollowUser } from '../../controllers/following/followingController.js';

const router = express.Router();

router.get('/', getFollowing);
router.post('/', followUser);
router.delete('/', unfollowUser);

export default router;
