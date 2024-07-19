import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const checkAndAddProfilePictureUrlColumn = async () => {
  const checkQuery = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='users' AND column_name='profile_picture_url';
  `;

  const addColumnQuery = `
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
  `;

  try {
    const result = await pool.query(checkQuery);
    if (result.rows.length === 0) {
      await pool.query(addColumnQuery);
      console.log('profile_picture_url column added to users table');
    } else {
      console.log('profile_picture_url column already exists in users table');
    }
  } catch (err) {
    console.error('Error checking or adding profile_picture_url column', err);
  } finally {
    pool.end();
  }
};

checkAndAddProfilePictureUrlColumn();