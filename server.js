import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Bienvenue sur la page d'accueil"));

app.get("/about", (req, res) => res.send("Bienvenue sur la page About"));

app.listen(PORT, () =>
  console.log(`Serveur lancé sur le port: http://localhost:${PORT}`)
);
