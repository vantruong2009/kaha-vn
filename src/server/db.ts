import "server-only";
import { Pool } from "pg";

let pool: Pool | undefined;

function assertKahaDbUrl(connectionString: string): void {
  if (!/\/kaha_vn(\?|$)/.test(connectionString)) {
    throw new Error(
      "DATABASE_URL must target database kaha_vn only (safety boundary).",
    );
  }
}

export function getPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url?.trim()) {
    throw new Error("DATABASE_URL is not set");
  }
  assertKahaDbUrl(url);
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 6,
      idleTimeoutMillis: 10_000,
    });
  }
  return pool;
}
