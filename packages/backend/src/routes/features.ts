import { controllers } from "@/controllers";
import { middlewares } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/", middlewares.isAuthenticated, controllers.feature.create);
router.delete("/:id", middlewares.isAuthenticated, controllers.feature.delete);
router.patch("/:id", middlewares.isAuthenticated, controllers.feature.update);
router.get("/:id", middlewares.isAuthenticated, controllers.feature.get);
router.get("/", middlewares.isAuthenticated, controllers.feature.getAll);
export default router;
