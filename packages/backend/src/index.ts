import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { requestLogger } from "@/middlewares/requestLogger";
import router from "@/routes";
import cookieParser from "cookie-parser";

const app = express();

const { PORT, CORS_ORIGIN } = env;

app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port: http://localhost:${PORT}`);
});
