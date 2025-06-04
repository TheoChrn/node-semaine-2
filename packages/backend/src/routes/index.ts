import { Router } from "express";
import postRouter from "./posts";
import commentRouter from "./comments";
import authRouter from "./auth";
import express from "express";

const router: Router = express.Router();

router.use("/posts", postRouter);
router.use("/comments", commentRouter);
router.use("/auth", authRouter);

export default router;
