const { Pool } = require('pg');
require('dotenv').config();

// Create a new PostgreSQL connection pool
// Use DATABASE_URL if available, otherwise use individual connection parameters
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    console.error('Error stack:', err.stack);
    console.error('Environment variables:', {
      DATABASE_URL: process.env.DATABASE_URL,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
