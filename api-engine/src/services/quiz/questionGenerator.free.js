import fs from "fs";
import path from "path";
import { pickQuestionsSmart } from "./questionPicker.js";

const __root = process.cwd();
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export const generateQuizFree = ({ topicKey, difficulty = "easy", n = 10, mistakeTags = [] }) => {
  n = clamp(Number(n) || 10, 5, 15);

  const tryPath = (diff) =>
    path.join(__root, "src", "data", "questionBank", `${topicKey}.${diff}.json`);

  // requested -> medium -> easy fallback
  let filePath = tryPath(difficulty);
  if (!fs.existsSync(filePath)) filePath = tryPath("medium");
  if (!fs.existsSync(filePath)) filePath = tryPath("easy");

  if (!fs.existsSync(filePath)) {
    throw new Error(`Question bank not found for topicKey: ${topicKey}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const quiz = JSON.parse(raw);

  const bank = quiz.questions || [];
  const safeN = Math.min(n, bank.length); // ✅ if bank has only 10, will return 10

  const selected = pickQuestionsSmart({
    questions: bank,
    n: safeN,
    mistakeTags,
  });

  return {
    title: quiz.title,
    topicFocus: quiz.topicFocus,
    difficulty,
    timeLimitSec: quiz.timeLimitSec,
    questions: selected,
  };
};