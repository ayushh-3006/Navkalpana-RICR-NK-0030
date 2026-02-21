const normalize = (arr) =>
  (arr || []).map(String).map((s) => s.trim()).filter(Boolean);

const isSameSet = (a, b) => {
  const A = new Set(normalize(a));
  const B = new Set(normalize(b));
  if (A.size !== B.size) return false;
  for (const x of A) if (!B.has(x)) return false;
  return true;
};

export const scoreQuizAttempt = (questions, answers) => {
  const answerMap = new Map();
  (answers || []).forEach((a) => answerMap.set(a.questionId, normalize(a.answer)));

  let correct = 0;

  const details = questions.map((q) => {
    const userAns = answerMap.get(q.id) || [];
    const ok = isSameSet(q.correctAnswer, userAns);
    if (ok) correct++;

    return {
      questionId: q.id,
      type: q.type,
      question: q.question,
      isCorrect: ok,
      userAnswer: userAns,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });

  const score = Math.round((correct / questions.length) * 100);

  return {
    score,
    correctCount: correct,
    total: questions.length,
    details,
  };
};