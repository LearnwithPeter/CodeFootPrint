import { Router } from "express";
import { getProfile, getStats } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// Every dashboard route requires the user to be logged in.
router.use(authMiddleware);

router.get("/profile", getProfile);
router.get("/stats", getStats);

export default router;
