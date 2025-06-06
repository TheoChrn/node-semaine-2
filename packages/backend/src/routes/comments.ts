import { controllers } from "@/controllers";
import { middlewares } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/", middlewares.isAuthenticated, controllers.comment.create);

export default router;
