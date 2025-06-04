import { controllers } from "@/controllers/index";
import { Router } from "express";

const router: Router = Router();

router.get("/", controllers.post.getAllPosts);

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
