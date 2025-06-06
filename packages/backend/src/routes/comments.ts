import { controllers } from "@/controllers";
import { middlewares } from "@/middlewares";
import { Router } from "express";

const router: Router = Router();

router.post("/", middlewares.isAuthenticated, controllers.comment.create);
router.delete("/:id", middlewares.isAuthenticated, controllers.comment.delete);
router.patch("/:id", middlewares.isAuthenticated, controllers.comment.update);

export default router;
