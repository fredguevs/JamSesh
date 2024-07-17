import pool from '../../config/db.js';

export const createPostLikesTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS post_likes (
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      likeid SERIAL PRIMARY KEY,
      owner VARCHAR(20) NOT NULL,
      postid INTEGER NOT NULL,
      FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE,
      FOREIGN KEY (postid) REFERENCES posts(postid) ON DELETE CASCADE
    )
  `;

  try {
    await pool.query(queryText);
    console.log('Post Likes table created');
  } catch (err) {
    console.error('Error creating post likes table:', err);
  }
};

export const addPostLike = async (owner, postid) => {
  const queryText = `
    INSERT INTO post_likes (owner, postid)
    VALUES ($1, $2)
  `;

  try {
    await pool.query(queryText, [owner, postid]);
    console.log('Like added to post');
  } catch (err) {
    console.error('Error adding like to post:', err);
  }
};

export const deletePostLike = async (owner, postid) => {
  const queryText = `
    DELETE FROM post_likes
    WHERE owner = $1 AND postid = $2
  `;

  try {
    const res = await pool.query(queryText, [owner, postid]);
    if (res.rowCount > 0) {
      console.log('Like deleted from post');
      return true;
    } else {
      console.log('No like found to delete');
      return false;
    }
  } catch (err) {
    console.error('Error deleting like from post:', err);
    throw err;
  }
};

export const getPostLikes = async (postid, owner = null) => {
  let queryText = `
    SELECT likeid, owner
    FROM post_likes
    WHERE postid = $1
  `;
  const values = [postid];

  if (owner) {
    queryText += ` AND owner = $2`;
    values.push(owner);
  }

  try {
    const res = await pool.query(queryText, values);
    return res.rows;
  } catch (err) {
    console.error('Error getting likes for post:', err);
    return [];
  }
};
