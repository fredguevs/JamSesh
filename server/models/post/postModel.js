// models/postModel.js
import pool from '../../config/db.js';
import fs from 'fs';
import path from 'path';

// need a way to upload posts (image, videos)

export const createPostTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS posts (
      postid SERIAL PRIMARY KEY,
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      owner VARCHAR(20) NOT NULL,
      image_url TEXT,
      video_url TEXT,
      FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
    )
  `;
  try {
    await pool.query(queryText);
    console.log('Posts table created');
  } catch (err) {
    console.error('Error creating posts table', err);
  }
};

export const insertPost = async (owner, imageUrl, videoUrl) => {
  const queryText = `
    INSERT INTO posts (owner, image_url, video_url)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [owner, imageUrl, videoUrl];
  try {
    const res = await pool.query(queryText, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error inserting post', err);
    throw err;
  }
};

export const getAllPosts = async () => {
  try {
    const res = await pool.query('SELECT * FROM posts');
    return res.rows;
  } catch (err) {
    console.error('Error fetching posts', err);
    throw err;
  }
};

export const getPostsByUser = async (username) => {
  const queryText = `
    SELECT * FROM posts WHERE owner = $1
  `;
  try {
    const res = await pool.query(queryText, [username]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching posts by user', err);
    throw err;
  }
};

export const getPostsById = async (postid) => {
  const queryText = `
    SELECT * FROM posts WHERE postid = $1
  `;
  try {
    const res = await pool.query(queryText, [postid]);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching post by ID', err);
    throw err;
  }
};

export const deletePost = async (postid) => {
  const queryText = `
    DELETE FROM posts WHERE postid = $1 RETURNING *
  `;
  try {
    // Retrieve the post to get the media paths
    const post = await getPostsById(postid);

    if (post) {
      // Delete media files if they exist
      if (post.image_url) {
        fs.unlink(path.join(__dirname, '..', '..', post.image_url), (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
          }
        });
      }
      if (post.video_url) {
        fs.unlink(path.join(__dirname, '..', '..', post.video_url), (err) => {
          if (err) {
            console.error('Error deleting video file:', err);
          }
        });
      }

      // Delete the post from the database
      const res = await pool.query(queryText, [postid]);
      return res.rows[0];
    }
  } catch (err) {
    console.error('Error deleting post', err);
    throw err;
  }
};


