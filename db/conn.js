// Connecting backend to postgreSQL database
import pkg from 'pg'; // connects Node.js to PostgreSQL database
import dotenv from 'dotenv';

dotenv.config();

// console.log('Database URL from .env:", process.env.DATABASE_URL');

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default pool;