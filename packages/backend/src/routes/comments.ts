import { getAllComments } from "@/controllers/index";
import { Router } from "express";

const router: Router = Router();

router.get("/", getAllComments);

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
