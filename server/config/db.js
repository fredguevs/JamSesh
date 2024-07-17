// config/db.js
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // Ensure this is correctly loaded
  database: process.env.DB_NAME
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

export default pool;
