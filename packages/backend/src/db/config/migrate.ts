import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { env } from "process";

const { DATABASE_URL } = env;

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle(pool);

  console.log("Migrating database");

  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Database migrated successfully");

  pool.end;
}

main();
