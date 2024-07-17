import { addAudioLike, deleteAudioLike, getAudioLikes } from '../../models/audio/audioLikesModel.js';

export const createAudioLike = async (req, res) => {
  const { owner, audioid } = req.body;

  try {
    await addAudioLike(owner, audioid);
    res.status(201).send('Like added successfully');
  } catch (err) {
    res.status(500).send('Error adding like');
  }
};

export const removeAudioLike = async (req, res) => {
  const { owner, audioid } = req.body;

  try {
    const success = await deleteAudioLike(owner, audioid);
    if (success) {
      res.status(200).send('Like removed successfully');
    } else {
      res.status(404).send('Like not found');
    }
  } catch (err) {
    res.status(500).send('Error removing like');
  }
};

export const fetchAudioLikes = async (req, res) => {
  const { audioid } = req.params;
  const owner = req.user ? req.user.username : null;

  try {
    const likes = await getAudioLikes(audioid, owner);
    const userLiked = likes.some(like => like.owner === owner);
    res.status(200).json({ likes, userLiked });
  } catch (err) {
    res.status(500).send('Error getting likes');
  }
};
