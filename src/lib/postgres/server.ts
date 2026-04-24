import "server-only";
import { Pool } from "pg";

/**
 * Bản port từ longdenviet — tên/ API trùng để code ported không phải đổi import.
 * Guard: chỉ cho phép target database `kaha_vn` (safety boundary của KAHA).
 * Cùng env priority như longdenviet: VPS_DATABASE_URL → DATABASE_URL.
 */

let pool: Pool | null = null;

function getConnectionString(): string | null {
  return process.env.VPS_DATABASE_URL || process.env.DATABASE_URL || null;
}

function assertKahaDb(connectionString: string): void {
  if (!/\/kaha_vn(\?|$)/.test(connectionString)) {
    throw new Error(
      "DATABASE_URL must target database kaha_vn only (safety boundary).",
    );
  }
}

export function hasPostgresConfigured(): boolean {
  return Boolean(getConnectionString());
}

export function getPostgresPool(): Pool {
  if (pool) return pool;

  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error("Missing VPS_DATABASE_URL/DATABASE_URL for PostgreSQL");
  }
  assertKahaDb(connectionString);

  pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  });

  return pool;
}
