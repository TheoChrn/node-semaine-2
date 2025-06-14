import { env } from "@/config/env";
import { defineConfig } from "drizzle-kit";

const { DATABASE_URL } = env;

export default defineConfig({
  dialect: "postgresql",
  out: "src/db/migrations",
  schema: "src/db/schemas",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
