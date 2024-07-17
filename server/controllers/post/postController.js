// controllers/postController.js
import { insertPost, getAllPosts, getPostsByUser, getPostsById, deletePost } from '../../models/post/postModel.js';

const addPost = async (req, res) => {
  const { owner, imageUrl, videoUrl } = req.body;
  try {
    const newPost = await insertPost(owner, imageUrl, videoUrl);
    res.status(201).json({ message: 'Successfully added post', post: newPost });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchAllPosts = async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status500().json({ error: 'Internal Server Error' });
  }
};

const fetchPostsByUser = async (req, res) => {
  const { username } = req.params;
  try {
    const posts = await getPostsByUser(username);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchPostById = async (req, res) => {
  const { postid } = req.params;
  try {
    const post = await getPostsById(postid);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const removePost = async (req, res) => {
  const { postid } = req.params;
  try {
    const deletedPost = await deletePost(postid);
    res.status(200).json({ message: 'Successfully deleted post', post: deletedPost });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { addPost, fetchAllPosts, fetchPostsByUser, fetchPostById, removePost };
