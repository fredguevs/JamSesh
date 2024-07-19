import { insertPost, getAllPosts, getPostsByUser, getPostsById, deletePost } from '../../models/post/postModel.js';

export const createPost = async (req, res) => {
  const { owner } = req.body;
  if (req.user.username !== owner) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const imageUrl = req.files.image ? req.files.image[0].path : null;
  const videoUrl = req.files.video ? req.files.video[0].path : null;

  try {
    const newPost = await insertPost(owner, imageUrl, videoUrl);
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchPostsByUser = async (req, res) => {
  const { username } = req.params;
  try {
    const posts = await getPostsByUser(username);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const fetchPostById = async (req, res) => {
  const { postid } = req.params;
  try {
    const post = await getPostsById(postid);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removePost = async (req, res) => {
  const { postid } = req.params;
  try {
    const post = await getPostsById(postid);
    if (req.user.username !== post.owner) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const deletedPost = await deletePost(postid);
    res.status(200).json({ message: 'Successfully deleted post', post: deletedPost });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
