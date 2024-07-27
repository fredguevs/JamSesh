// controllers/post/postController.js
import { insertPost, getAllPosts, getPostsByUser, getPostsById, deletePost, updatePost } from '../../models/post/postModel.js';

export const createPost = async (req, res) => {
  // TODO: Implement security here
  const { owner, caption } = req.body;
  const image = req.files['image'] ? req.files['image'][0].path : null;
  const video = req.files['video'] ? req.files['video'][0].path : null;
  try {
    if (req.session.user?.username !== owner) {
      console.log('Username:', owner);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }
    const newPost = await insertPost(owner, image, video, caption); // Pass caption to insertPost
    res.status(201).json({ message: 'Successfully created post', post: newPost });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong!' });
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
    console.log('Getting post: ', postid)
    res.status(200).json(post);
    console.log('Post info: ', post)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removePost = async (req, res) => {
  const { postid } = req.params;
  try {
    const post = await getPostsById(postid);
    console.log('Post to delete retrieved');
    if (req.session.user?.username !== post.owner) {
      console.log('Username:', post.owner);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }
    const deletedPost = await deletePost(postid);
    res.status(200).json({ message: 'Successfully deleted post', post: deletedPost });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const modifyPost = async (req, res) => {
  const { postid } = req.params;
  const { caption } = req.body;
  try {
    const post = await getPostsById(postid)
    if (req.session.user?.username !== post.owner) {
      console.log('Username:', post.owner);
      console.log('Session User:', req.session.user);
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updatedPost = await updatePost(postid, caption);
    res.status(200).json({message: 'Successfully updated post', post: updatedPost})

  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error'});
  };
}