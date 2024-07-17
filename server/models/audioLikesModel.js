import pool from '../config/db.js';

const createAudioLikesTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS audio_likes (
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      likeid SERIAL PRIMARY KEY,
      owner VARCHAR(20) NOT NULL,
      audioid INTEGER NOT NULL,
      FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE,
      FOREIGN KEY (audioid) REFERENCES audios(audioid) ON DELETE CASCADE
    )
  `;

  try {
    await pool.query(queryText);
    console.log('Audio Likes table created');
  } catch (err) {
    console.error('Error creating audio likes table', err);
  }
};

const addAudioLike = async (owner, audioid) => {
  const queryText = `
    INSERT INTO audio_likes (owner, audioid)
    VALUES ($1, $2)
  `;

  try {
    await pool.query(queryText, [owner, audioid]);
    console.log('Like added to audio');
  } catch (err) {
    console.error('Error adding like to audio', err);
  }
};

const deleteAudioLike = async (owner, audioid) => {
  const queryText = `
    DELETE FROM audio_likes
    WHERE owner = $1 AND audioid = $2
  `;

  try {
    const res = await pool.query(queryText, [owner, audioid]);
    if (res.rowCount > 0) {
      console.log('Like deleted from audio');
      return true;
    } else {
      console.log('No like found to delete');
      return false;
    }
  } catch (err) {
    console.error('Error deleting like from audio', err);
    throw err;
  }
};


const getAudioLikes = async (audioid, owner = null) => {
  let queryText = `
    SELECT likeid, owner
    FROM audio_likes
    WHERE audioid = $1
  `;
  const values = [audioid];

  if (owner) {
    queryText += ` AND owner = $2`;
    values.push(owner);
  }

  try {
    const res = await pool.query(queryText, values);
    return res.rows;
  } catch (err) {
    console.error('Error getting likes for audio:', err);
    return [];
  }
};

export { createAudioLikesTable, addAudioLike, deleteAudioLike, getAudioLikes };



