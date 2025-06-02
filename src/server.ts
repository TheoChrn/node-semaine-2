import express from "express";
import { requestLogger } from "./middlewares/requestLogger.js";
import router from "./routes/posts.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(requestLogger);
app.use("/", router);

app.listen(PORT, () =>
  console.log(`Serveur lancé sur le port: http://localhost:${PORT}`)
);
