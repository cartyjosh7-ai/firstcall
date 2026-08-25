import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let instance: PostgresJsDatabase<typeof schema> | null = null;

/**
 * Lazily created on first real query, not at import time — lets route/page
 * modules import this file at build time without POSTGRES_URL being set.
 */
export function getDb() {
  if (!instance) {
    const url = process.env.POSTGRES_URL;
    if (!url) throw new Error("POSTGRES_URL is not set.");
    instance = drizzle(postgres(url, { max: 1 }), { schema });
  }
  return instance;
}
