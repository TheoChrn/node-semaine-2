import { env } from "@/config/env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const { DATABASE_URL } = env;

export default defineConfig({
  dialect: "postgresql",
  out: "src/migrations",
  schema: "src/schemas/index.ts",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
