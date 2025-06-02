import { Router } from "express";
import postRouter from "./posts";
import commentRouter from "./comments";

const router = Router();

router.use("/posts", postRouter);
router.use("/comments", commentRouter);

export default router;
