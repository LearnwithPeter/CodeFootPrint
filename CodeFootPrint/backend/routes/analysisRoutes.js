import { Router } from "express";
import { analyzeRepo } from "../controllers/analysisController.js";

const router = Router();

router.post("/", analyzeRepo);

export default router;