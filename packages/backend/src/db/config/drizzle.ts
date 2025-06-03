import { env } from "../../config/env";
import { defineConfig } from "drizzle-kit";

const { DATABASE_URL } = env;

console.log("Loaded DATABASE_URL:", DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  out: "src/db/migrations",
  schema: "src/db/schemas/index.ts",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
