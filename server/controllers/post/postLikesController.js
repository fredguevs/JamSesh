import { addPostLike, deletePostLike, getPostLikes } from '../../models/post/postLikesModel.js';

export const createLike = async (req, res) => {
  const { postid } = req.body;
  const owner = req.user.username;

  try {
    await addPostLike(owner, postid);
    res.status(201).send('Like added successfully');
  } catch (err) {
    res.status(500).send('Error adding like');
  }
};

export const removeLike = async (req, res) => {
  const { postid } = req.body;
  const owner = req.user.username;

  try {
    const success = await deletePostLike(owner, postid);
    if (success) {
      res.status(200).send('Like removed successfully');
    } else {
      res.status(404).send('Like not found');
    }
  } catch (err) {
    res.status(500).send('Error removing like');
  }
};

export const getLikes = async (req, res) => {
  const { postid } = req.params;
  const owner = req.user ? req.user.username : null;

  try {
    const likes = await getPostLikes(postid, owner);
    const userLiked = likes.some(like => like.owner === owner);
    res.status(200).json({ likes, userLiked });
  } catch (err) {
    res.status(500).send('Error getting likes');
  }
};
