import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

// Create pool with better error handling
const createPool = () => {
  const password = process.env.DB_PASS;

  const pool = new Pool({
    connectionString: `postgresql://postgres.vbvexkluugbhhzezvank:${password}@aws-0-eu-north-1.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    max: 5, // Reduce from 10 to 5 to stay within limits
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Add error handler to prevent app crashes
  pool.on("error", (err) => {
    console.error("Unexpected database error:", err);
    // Don't crash the app, just log the error
  });

  return pool;
};

let pool = createPool();

// Attempt to connect and handle errors
const connectWithRetry = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to Supabase PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Database connection error:", err);
    // If connection failed, recreate the pool after a delay
    setTimeout(() => {
      console.log("Attempting to reconnect to database...");
      pool = createPool();
      connectWithRetry();
    }, 5000);
  }
};

connectWithRetry();

export default async function query(sql, params, retries = 3) {
  let client = null;

  try {
    client = await pool.connect();
    const res = await client.query(sql, params);
    return res.rows;
  } catch (err) {
    console.error("Query error:", err);

    // If this is a connection error and we have retries left, try again
    if (err.code === "XX000" && retries > 0) {
      console.log(`Retrying query, ${retries} attempts remaining`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return query(sql, params, retries - 1);
    }

    throw err;
  } finally {
    if (client) client.release();
  }
}
