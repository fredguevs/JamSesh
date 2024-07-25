import pool from '../../config/db.js';

const createUserTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      username VARCHAR(40) PRIMARY KEY,
      fullname VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      profile_picture_url TEXT,
      password VARCHAR(256) NOT NULL
    )
  `;

  const createIndexQuery = `
    CREATE UNIQUE INDEX IF NOT EXISTS unique_username_idx ON users (LOWER(username))
  `;

  try {
    await pool.query(createTableQuery);
    await pool.query(createIndexQuery);
    console.log('Users table and unique index created');
  } catch (err) {
    console.error('Error creating users table', err);
  }
};

const insertUser = async (username, fullname, email, profilePictureUrl, password) => {
  const queryText = `
    INSERT INTO users (username, fullname, email, profile_picture_url, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [username, fullname, email, profilePictureUrl, password];
  try {
    const res = await pool.query(queryText, values);
    return res.rows[0];
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      throw new Error('Username already exists');
    } else {
      console.error('Error inserting user', err);
      throw err;
    }
  }
};

const getAllUsers = async () => {
  try {
    const res = await pool.query('SELECT * FROM users');
    return res.rows;
  } catch (err) {
    console.error('Error fetching users', err);
    throw err;
  }
};

const getUserByUsername = async (username) => {
  const queryText = 'SELECT * FROM users WHERE username ILIKE $1';
  try {
    const res = await pool.query(queryText, [username]);
    console.log(`Fetched`, username);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching user by username', err);
    throw err;
  }
};

const getUserByEmail = async (email) => {
  const queryText = 'SELECT * FROM users WHERE email = $1';
  try {
    const res = await pool.query(queryText, [email]);
    return res.rows[0];
  } catch (err) {
    console.error('Error fetching user by email', err);
    throw err;
  }
};

const updateUser = async (username, fullname, email, profilePictureUrl, password) => {
  const queryText = `
    UPDATE users
    SET fullname = $1, email = $2, profile_picture_url = $3, password = $4
    WHERE username = $5
    RETURNING *
  `;
  const values = [fullname, email, profilePictureUrl, password, username];
  try {
    const res = await pool.query(queryText, values);
    return res.rows[0];
  } catch (err) {
    console.error('Error updating user', err);
    throw err;
  }
};

const deleteUser = async (username) => {
  const queryText = 'DELETE FROM users WHERE username = $1 RETURNING *';
  try {
    const user = await getUserByUsername(username);

    if (user && user.profile_picture_url) {
      fs.unlink(path.join(__dirname, '..', '..', user.profile_picture_url), (err) => {
        if (err) {
          console.error('Error deleting profile picture file:', err);
        }
      });
    }

    const res = await pool.query(queryText, [username]);
    return res.rows[0];
  } catch (err) {
    console.error('Error deleting user', err);
    throw err;
  }
};

const searchUsernames = async (query) => {
  const queryText = `
    SELECT username
    FROM users
    WHERE username ILIKE $1
  `;
  const values = [`%${query}%`];

  try {
    const res = await pool.query(queryText, values);
    return res.rows;
  } catch (err) {
    console.error('Error searching usernames:', err);
    throw err;
  }
};

export { createUserTable, insertUser, getAllUsers, getUserByUsername, getUserByEmail, updateUser, deleteUser, searchUsernames };
