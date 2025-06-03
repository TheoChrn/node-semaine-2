import * as dotenv from "dotenv";

dotenv.config();

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV as EnvConfig["NODE_ENV"],
  ORIGIN: process.env.ORIGIN || "http://localhost:5173",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:admin@localhost:5432/blog",
};
