import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  startAdaptiveQuiz,
  getQuizById,
  submitQuiz,
  getQuizHistory,
  getAttemptById,
  getInsights,
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/start", protect, startAdaptiveQuiz);
router.get("/history", protect, getQuizHistory);
router.get("/attempt/:attemptId", protect, getAttemptById);
router.get("/insights", protect, getInsights);

router.get("/:quizId", protect, getQuizById);
router.post("/:quizId/submit", protect, submitQuiz);

export default router;