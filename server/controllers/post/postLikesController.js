import { addPostLike, deletePostLike, getPostLikes } from '../../models/post/postLikesModel.js';

export const createLike = async (req, res) => {
  const { owner, postid } = req.body;

  try {
    await addPostLike(owner, postid);
    res.status(201).send('Like added successfully');
  } catch (err) {
    res.status(500).send('Error adding like');
  }
};

export const removeLike = async (req, res) => {
  const { owner, postid } = req.body;

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

/*
 TODO: For both AudioLikes and PostLikes I need to implement a 
 function that gets the likeid of a given post where the owner
 is the logged user
*/
