// models/postModel.js
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pool from '../../config/db.js';
import fs from 'fs';
import path from 'path';

export const createPostTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS posts (
      postid SERIAL PRIMARY KEY,
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      owner VARCHAR(20) NOT NULL,
      caption VARCHAR(100) NOT NULL,
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

export const insertPost = async (owner, imageUrl, videoUrl, caption) => {
  const queryText = `
    INSERT INTO posts (owner, image_url, video_url, caption)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [owner, imageUrl, videoUrl, caption];
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
    const post = await getPostsById(postid);

    if (post) {
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

      const res = await pool.query(queryText, [postid]);
      return res.rows[0];
    }
  } catch (err) {
    console.error('Error deleting post', err);
    throw err;
  }
};

export const updatePost = async (postid, caption) => {
  const queryText = `
    UPDATE posts
    SET caption = $1
    WHERE postid = $2
    RETURNING *
  `;
  const values = [caption, postid];

  try {
    const res = await pool.query(queryText, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error updating post', err);
    throw err;
  }
};
