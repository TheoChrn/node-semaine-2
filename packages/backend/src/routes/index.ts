import { Router } from "express";
import commentRouter from "./comments";
import authRouter from "./auth";
import featureRouter from "./features";
import express from "express";

const router: Router = express.Router();

router.use("/comments", commentRouter);
router.use("/auth", authRouter);
router.use("/features", featureRouter);

export default router;
