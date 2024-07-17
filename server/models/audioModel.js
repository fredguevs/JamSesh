import pool from '../config/db.js';

const createAudioTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS audios (
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      audioid SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      url TEXT NOT NULL,
      owner VARCHAR(20) NOT NULL,
      FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
    )
  `;

  try {
    await pool.query(queryText);
    console.log('Audios table created');
  } catch (err) {
    console.error('Error creating audios table', err);
  }
};

const insertAudio = async (title, url, owner) => {
  const queryText = `
    INSERT INTO audios (title, url, owner)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [title, url, owner];
  try {
    const res = await pool.query(queryText, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error inserting audio', err);
    throw err;
  }
};

const getAllAudios = async () => {
  try {
    const res = await pool.query('SELECT * FROM audios');
    return res.rows;
  } catch (err) {
    console.error('Error fetching audios', err);
    throw err;
  }
};

const getAudioById = async (audioid) => {
  const queryText = 'SELECT * FROM audios WHERE audioid = $1';
  try {
    const res = await pool.query(queryText, [audioid]);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching audio by ID', err);
    throw err;
  }
};

const getAudiosByUser = async (username) => {
  const queryText = 'SELECT * FROM audios WHERE owner = $1';
  try {
    const res = await pool.query(queryText, [username]);
    return res.rows;
  } catch (err) {
    console.error('Error fetching audios by user', err);
    throw err;
  }
};

const deleteAudio = async (audioid) => {
  const queryText = 'DELETE FROM audios WHERE audioid = $1 RETURNING *';
  try {
    const res = await pool.query(queryText, [audioid]);
    return res.rows[0];
  } catch (err) {
    console.error('Error deleting audio', err);
    throw err;
  }
};

export { createAudioTable, insertAudio, getAllAudios, getAudioById, getAudiosByUser, deleteAudio };
