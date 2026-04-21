import { Router } from "express";
import { analyzeRepo } from "../controllers/analysisController.js";
import { getContributors } from "../controllers/analysisController.js";

const router = Router();

router.post("/", analyzeRepo);
router.get("/contributors", getContributors); // ✅ new route

export default router;