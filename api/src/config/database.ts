import { Pool } from "pg";
import { env } from "./env";

let pool: Pool | null = null;

export function createPool(): Pool {
  pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  });

  return pool;
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error("Database pool is not initialized");
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function checkDatabaseConnection(): Promise<void> {
  await getPool().query("SELECT 1");
}
