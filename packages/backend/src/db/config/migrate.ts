import { env } from "@/config/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const { DATABASE_URL, NODE_ENV } = env;

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  console.log("Migrating database");

  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Database migrated successfully");

  pool.end;
}

main();
