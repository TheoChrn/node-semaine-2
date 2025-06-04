import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({
  path: path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../../.env"
  ),
});

export const env: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV as EnvConfig["NODE_ENV"],
  ORIGIN: process.env.ORIGIN || "http://localhost:5173",
  DATABASE_URL: process.env.DATABASE_URL || "truc",
  JWT_SECRET:
    process.env.JWT_SECRET || "SecretTresBienGardeNePasDivulgerPubliquement",
};
