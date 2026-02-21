import { QUIZ_TOPICS } from "../config/quizTopics.js";

export const listTopics = async (req, res) => {
  return res.json({ success: true, topics: QUIZ_TOPICS });
};