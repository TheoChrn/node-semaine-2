import { Router } from "express";
import { commentController } from "../controllers";

const router = Router();

router.get("/", commentController.getAllComments);

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
