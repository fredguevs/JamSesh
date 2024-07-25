import pool from '../../config/db.js';

export const createSessionTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      PRIMARY KEY ("sid")
    );
  `;

  const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Session table created successfully');
    
    await pool.query(createIndexQuery);
    console.log('Session index created successfully');
  } catch (err) {
    console.error('Error creating session table:', err);
  }
};