import pool from "./db/conn.js";

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', res.rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

testConnection();
