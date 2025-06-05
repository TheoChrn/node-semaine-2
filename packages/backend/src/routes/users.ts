import { controllers } from "@/controllers";
import { middlewares } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.get("/", middlewares.isAuthenticated, controllers.user.getSession);
export default router;
