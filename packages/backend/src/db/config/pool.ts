import { Pool } from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

import { env } from "process";
import { schema } from "@/db/schemas";

const { DATABASE_URL } = env;

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
});
