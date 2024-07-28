import { fetchFollowing, addFollowing, removeFollowing } from '../../models/following/followingModel.js';

export const getFollowing = async (req, res) => {
  const { follower, followee } = req.query;

  try {
    const following = await fetchFollowing(follower, followee);
    if (following) {
      res.status(200).json({ isFollowing: true });
    } else {
      res.status(404).json({ isFollowing: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const followUser = async (req, res) => {
  const { follower, followee } = req.body;

  try {
    if (req.session.user?.username !== follower) {
      console.log('Username:', follower);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }

    await addFollowing(follower, followee);
    res.status(201).json({ message: `${follower} is now following ${followee}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { follower, followee } = req.body;

  try {
    if (req.session.user?.username !== follower) {
      console.log('Username:', follower);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }
    const success = await removeFollowing(follower, followee);
    if (success) {
      res.status(200).json({ message: 'Successfully unfollowed' });
    } else {
      res.status(404).json({ message: `Following relationship not found for ${follower}, ${followee}`});
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
