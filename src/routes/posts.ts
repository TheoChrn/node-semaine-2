import { Router } from "express";
import { postController } from "../controllers";

const router = Router();

router.get("/", postController.getAllPosts);

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
