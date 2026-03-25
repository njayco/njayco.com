import { Router, type IRouter } from "express";
import healthRouter from "./health";
import divisionsRouter from "./divisions";
import musicRouter from "./music";
import documentsRouter from "./documents";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(divisionsRouter);
router.use(musicRouter);
router.use(documentsRouter);
router.use(adminRouter);

export default router;
