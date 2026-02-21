import User from "../../models/userModel.js";
import UserTopicStats from "../../models/userTopicStatsModel.js";
import QuizAttempt from "../../models/quizAttemptModel.js";
import { QUIZ_TOPICS } from "../../config/quizTopics.js";

// helper
const uniq = (arr) => [...new Set(arr.filter(Boolean))];

export const pickAdaptiveTopicKey = async ({ userId }) => {
  // 1) Weak topics (mastery low)
  const weak = await UserTopicStats.find({ userId }).sort({ masteryScore: 1 }).limit(3);
  if (weak.length) return weak[0].topicKey;

  // 2) Resume gaps -> map skills to topicKey
  const user = await User.findById(userId).select("resumeMissingSkills");
  const gaps = user?.resumeMissingSkills || [];

  // simple mapping skill -> topicKey
  const skillToTopic = [
    { match: ["express", "node", "api", "rest"], topicKey: "nodeExpress" },
    { match: ["mongodb", "mongoose", "aggregation"], topicKey: "mongodb" },
    { match: ["oop", "class", "inheritance", "polymorphism"], topicKey: "javaOOP" },
    { match: ["react", "hooks", "useeffect", "usestate"], topicKey: "reactHooks" },
  ];

  const lower = gaps.map((s) => String(s).toLowerCase());
  for (const rule of skillToTopic) {
    if (rule.match.some((m) => lower.some((x) => x.includes(m)))) {
      return rule.topicKey;
    }
  }

  // 3) Mistake-based: last attempts me jo topicKey repeat ho
  const last = await QuizAttempt.find({ userId }).sort({ createdAt: -1 }).limit(5);
  const lastTopic = last.find((a) => a.topicKey)?.topicKey;
  if (lastTopic) return lastTopic;

  // 4) fallback: first topic
  return QUIZ_TOPICS[0]?.key || "nodeExpress";
};

export const pickAdaptiveDifficulty = async ({ userId, topicKey, requestedDifficulty }) => {
  // user ne select kiya to respect it
  if (requestedDifficulty && ["easy", "medium", "hard"].includes(requestedDifficulty)) return requestedDifficulty;

  const stats = await UserTopicStats.findOne({ userId, topicKey });
  const mastery = stats?.masteryScore ?? 0;

  if (mastery > 75) return "hard";
  if (mastery < 40) return "easy";
  return "medium";
};

// Mistake tags (from last attempts)
export const getUserMistakeTags = async ({ userId, topicKey }) => {
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