import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { requestLogger } from "@/middlewares/requestLogger";
import router from "@/routes/index";

const app = express();

const { PORT, ORIGIN } = env;

app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(requestLogger);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port: http://localhost:${PORT}`);
});
