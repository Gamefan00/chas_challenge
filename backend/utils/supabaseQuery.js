import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const password = process.env.DB_PASS;

const pool = new Pool({
  connectionString: `postgresql://postgres.vbvexkluugbhhzezvank:${password}@aws-0-eu-north-1.pooler.supabase.com:5432/postgres`,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool
  .connect()
  .then(() => console.log('Connected to Supabase PostgreSQL'))
  .catch((err) => console.error('Database connection error:', err));

export default async function query(sql, params) {
  const client = await pool.connect();

  try {
    const res = await client.query(sql, params);
    return res.rows;
  } catch (err) {
    console.error('Query error:', err);
    throw err;
  } finally {
    client.release();
  }
}
