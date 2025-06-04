import { controllers } from "@/controllers/index";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/login", controllers.auth.login);

router.post("/register", controllers.auth.register);

export default router;
