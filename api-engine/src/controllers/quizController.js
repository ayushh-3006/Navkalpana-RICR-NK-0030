import { generateQuizFree } from "../services/quiz/questionGenerator.free.js";
import { getTopicMeta, isValidTopicKey } from "../config/quizTopics.js";

import Topic from "../models/topicModel.js";
import Quiz from "../models/quizModel.js";
import QuizAttempt from "../models/quizAttemptModel.js";
import UserTopicStats from "../models/userTopicStatsModel.js";

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const uniq = (arr) => [...new Set((arr || []).filter(Boolean))];

const normalizeDifficulty = (difficulty) => {
  const d = String(difficulty || "").toLowerCase();
  return ["easy", "medium", "hard"].includes(d) ? d : "easy";
};

const getRecentMistakeTags = async ({ userId, topicKey }) => {
  const lastAttempts = await QuizAttempt.find({ userId, topicKey })
    .sort({ createdAt: -1 })
    .limit(3)
    .select("mistakeClassification");

  const tags = [];
  for (const a of lastAttempts) {
    for (const m of a.mistakeClassification || []) {
      (m.tags || []).forEach((t) => tags.push(t));
    }
  }
  return uniq(tags).slice(0, 8);
};

const pickAutoTopicKey = async ({ userId }) => {
  const weak = await UserTopicStats.find({ userId }).sort({ masteryScore: 1 }).limit(1);
  if (weak?.[0]?.topicKey) return weak[0].topicKey;

  const last = await QuizAttempt.findOne({ userId }).sort({ createdAt: -1 }).select("topicKey");
  if (last?.topicKey) return last.topicKey;

  return null;
};

const pickAutoDifficulty = async ({ userId, topicKey, requested }) => {
  if (requested) return normalizeDifficulty(requested);

  const stats = await UserTopicStats.findOne({ userId, topicKey });
  const mastery = stats?.masteryScore ?? 0;

  if (mastery > 75) return "hard";
  if (mastery < 40) return "easy";
  return "medium";
};

/* ========================= START QUIZ ========================= */
export const startAdaptiveQuiz = async (req, res, next) => {
  try {
    const userId = req.user._id;

    let { topicKey, difficulty, count = 10 } = req.body || {};
    const safeCount = clamp(Number(count) || 10, 5, 15);

    // auto topic if not provided
    if (!topicKey) {
      const auto = await pickAutoTopicKey({ userId });
      if (auto) topicKey = auto;
    }

    if (!topicKey || !isValidTopicKey(topicKey)) {
      return res.status(400).json({ success: false, message: "Invalid topic selected" });
    }

    const meta = getTopicMeta(topicKey);

    // ensure Topic (global)
    let topic = await Topic.findOne({ name: meta.name });
    if (!topic) {
      topic = await Topic.create({
        name: meta.name,
        category: meta.category,
        tags: [meta.key],
      });
    }

    // ensure per-user stats exists
    await UserTopicStats.updateOne(
      { userId, topicKey: meta.key },
      {
        $setOnInsert: {
          userId,
          topicKey: meta.key,
          topicName: meta.name,
          category: meta.category,
        },
      },
      { upsert: true }
    );

    const finalDifficulty = await pickAutoDifficulty({
      userId,
      topicKey: meta.key,
      requested: difficulty,
    });

    const mistakeTags = await getRecentMistakeTags({ userId, topicKey: meta.key });

    const quizPayload = generateQuizFree({
      topicKey: meta.key,
      difficulty: finalDifficulty,
      n: safeCount,
      mistakeTags,
    });

    const quizDoc = await Quiz.create({
      userId,
      topicId: topic._id,
      topicKey: meta.key,
      title: quizPayload.title,
      topicFocus: quizPayload.topicFocus,
      difficulty: quizPayload.difficulty,
      timeLimitSec: quizPayload.timeLimitSec,
      totalQuestions: quizPayload.questions.length,
      questions: quizPayload.questions,
    });

    const safeQuestions = quizDoc.questions.map((q) => ({
      id: q.id,
      type: q.type,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      tags: q.tags,
    }));

    return res.status(200).json({
      success: true,
      quiz: {
        _id: quizDoc._id,
        topicKey: quizDoc.topicKey,
        title: quizDoc.title,
        topicFocus: quizDoc.topicFocus,
        difficulty: quizDoc.difficulty,
        timeLimitSec: quizDoc.timeLimitSec,
        totalQuestions: quizDoc.totalQuestions,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================= GET QUIZ BY ID ========================= */
export const getQuizById = async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    const safeQuestions = quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      topic: q.topic,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      tags: q.tags,
    }));

    return res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        topicKey: quiz.topicKey,
        title: quiz.title,
        topicFocus: quiz.topicFocus,
        difficulty: quiz.difficulty,
        timeLimitSec: quiz.timeLimitSec,
        totalQuestions: quiz.totalQuestions,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ========================= SUBMIT QUIZ ========================= */
export const submitQuiz = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { quizId } = req.params;
    const { answers = [] } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

    const userAnswerMap = new Map();
    for (const a of answers) {
      if (!a?.qid) continue;
      userAnswerMap.set(a.qid, Array.isArray(a.answer) ? a.answer : []);
    }

    let correctCount = 0;
    const topicStats = {};
    const mistakeClassification = [];

    for (const q of quiz.questions) {
      const userAnsArr = userAnswerMap.get(q.id) || [];
      const topicName = q.topic || quiz.topicFocus || "General";

      if (!topicStats[topicName]) topicStats[topicName] = { total: 0, correct: 0 };
      topicStats[topicName].total += 1;

      const attempted = userAnsArr.length > 0;
      let isCorrect = false;

      if (Array.isArray(q.correctAnswer)) {
        const correctSorted = [...q.correctAnswer].sort().join(",");
        const userSorted = [...userAnsArr].sort().join(",");
        isCorrect = attempted && correctSorted === userSorted;
      } else {
        isCorrect = attempted && userAnsArr[0] === q.correctAnswer;
      }

      if (isCorrect) {
        correctCount += 1;
        topicStats[topicName].correct += 1;
      } else {
        mistakeClassification.push({
          questionId: q.id,
          type: q.type,
          topic: topicName,
          difficulty: q.difficulty,
          mistakeType: !attempted ? "unattempted" : "wrong_answer",
          userAnswer: userAnsArr,
          tags: q.tags || [],
        });
      }
    }

    const percentScore = Math.round((correctCount / (quiz.totalQuestions || 1)) * 100);

    const topicWiseAccuracy = {};
    for (const t of Object.keys(topicStats)) {
      const { total, correct } = topicStats[t];
      topicWiseAccuracy[t] = total ? Math.round((correct / total) * 100) : 0;
    }

    const formattedAnswers = (answers || [])
      .filter((a) => a?.qid)
      .map((a) => ({
        questionId: String(a.qid).trim(),
        answer: Array.isArray(a.answer) ? a.answer : [],
      }));

    const finalAnswers =
      formattedAnswers.length > 0
        ? formattedAnswers
        : quiz.questions.map((q) => ({ questionId: q.id, answer: [] }));

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      topicKey: quiz.topicKey || "",
      difficulty: quiz.difficulty || "",
      answers: finalAnswers,
      score: percentScore,
      topicWiseAccuracy,
      mistakeClassification,
    });

    // mastery update
    const meta = quiz.topicKey ? getTopicMeta(quiz.topicKey) : null;

    const stats = await UserTopicStats.findOneAndUpdate(
      { userId, topicKey: quiz.topicKey || "unknown" },
      {
        $setOnInsert: {
          userId,
          topicKey: quiz.topicKey || "unknown",
          topicName: meta?.name || quiz.topicFocus || "General",
          category: meta?.category || "General",
        },
      },
      { upsert: true, returnDocument: "after" } // ✅ no warning
    );

    stats.totalAttempts += 1;
    stats.lastScore = percentScore;

    const last3 = await QuizAttempt.find({ userId, topicKey: stats.topicKey })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("score");

    const avg = last3.reduce((s, a) => s + (a.score || 0), 0) / (last3.length || 1);

    stats.masteryScore = Math.round(percentScore * 0.7 + avg * 0.3);
    stats.riskLevel = stats.masteryScore < 40 ? "high" : stats.masteryScore < 70 ? "medium" : "low";

    const tags = [];
    for (const m of mistakeClassification) (m.tags || []).forEach((t) => tags.push(t));
    stats.mistakeTags = uniq(tags).slice(0, 10);

    await stats.save();

    return res.json({
      success: true,
      attemptId: attempt._id,
      score: percentScore,
      topicWiseAccuracy,
      masteryScore: stats.masteryScore,
      riskLevel: stats.riskLevel,
    });
  } catch (error) {
    next(error);
  }
};

/* ========================= QUIZ HISTORY ========================= */
export const getQuizHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const history = await QuizAttempt.find({ userId })
      .populate("quizId")
      .sort({ createdAt: -1 })
      .limit(30);

    return res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

/* ========================= GET ATTEMPT BY ID ========================= */
export const getAttemptById = async (req, res, next) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId).populate("quizId");
    if (!attempt) return res.status(404).json({ success: false, message: "Attempt not found" });

    return res.json({ success: true, attempt });
  } catch (error) {
    next(error);
  }
};

/* ========================= INSIGHTS ========================= */
export const getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await UserTopicStats.find({ userId }).sort({ masteryScore: 1 });

    const weakTopics = stats.filter((t) => (t.masteryScore ?? 0) < 50);
    const highRisk = stats.filter((t) => t.riskLevel === "high");

    const avgMastery =
      stats.reduce((s, t) => s + (t.masteryScore || 0), 0) / (stats.length || 1);

    const readiness = avgMastery >= 70 ? "ready" : avgMastery >= 50 ? "moderate" : "not_ready";

    return res.json({
      success: true,
      readiness,
      avgMastery: Math.round(avgMastery),
      weakTopics,
      highRisk,
      heatmap: stats,
    });
  } catch (error) {
    next(error);
  }
};