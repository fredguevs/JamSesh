import pool from '../../config/db.js';

export const createFollowingTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS following (
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      username1 VARCHAR(40) NOT NULL,
      username2 VARCHAR(40) NOT NULL,
      FOREIGN KEY (username1) REFERENCES users(username) ON DELETE CASCADE,
      FOREIGN KEY (username2) REFERENCES users(username) ON DELETE CASCADE,
      PRIMARY KEY (username1, username2)
    )
  `;

  try {
    await pool.query(queryText);
    console.log('Following table created');
  } catch (err) {
    console.error('Error creating following table:', err);
  }
}

export const fetchFollowing = async (username1, username2) => {
  const queryText = `
    SELECT * FROM following
    WHERE username1 = $1 AND username2 = $2
  `;

  try {
    const res = await pool.query(queryText, [username1, username2]);
    return res.rows[0];
  } catch (err) {
    console.error('Error checking following', err);
  }
}

export const addFollowing = async (username1, username2) => {
  const queryText = `
    INSERT INTO following (username1, username2)
    VALUES ($1, $2)
  `;

  try {
    await pool.query(queryText, [username1, username2]);
    console.log(`${username1} is now following ${username2}`);
  } catch (err) {
    console.error('Error adding follower');
  }
}

export const removeFollowing = async (username1, username2) => {
  const queryText = `
    DELETE FROM following
    WHERE username1 = $1 AND username2 = $2
  `;

  try {
    const res = await pool.query(queryText, [username1, username2]);
    if (res.rowCount > 0) {
      console.log('Follower deleted from following');
      return true;
    } 
    else {
      console.log('Can not unfollow');
      return false;
    }
  }
  catch (err) {
    console.error('Error deleting follower', err);
    throw err;
  }
}
