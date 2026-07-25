import { Router } from "express";
import {
  analyzeRepository,
  listAnalyses,
  getAnalysis,
  removeAnalysis,
} from "../controllers/analysisController.js";
import { analyzeRepositoryValidationRules } from "../validators/analysisValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { analysisLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Every analysis route requires the user to be logged in.
router.use(authMiddleware);

router.post("/", analysisLimiter, analyzeRepositoryValidationRules, validateRequest, analyzeRepository);
router.get("/", listAnalyses);
router.get("/:id", getAnalysis);
router.delete("/:id", removeAnalysis);

export default router;
