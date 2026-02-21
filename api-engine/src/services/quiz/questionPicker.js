const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Topic × Difficulty × Error Pattern × Concept Coverage (heuristic)
export const pickQuestionsSmart = ({ questions, n, mistakeTags = [] }) => {
  const pool = shuffle(questions || []);
  const selected = [];
  const usedTags = new Set();

  const scoreQ = (q) => {
    const tags = q.tags || [];
    const mistakeBoost = tags.some((t) => mistakeTags.includes(t)) ? 5 : 0;
    const newTagBoost = tags.some((t) => !usedTags.has(t)) ? 2 : 0;
    return mistakeBoost + newTagBoost + Math.random();
  };

  while (pool.length && selected.length < n) {
    pool.sort((a, b) => scoreQ(b) - scoreQ(a));
    const q = pool.shift();
    selected.push(q);
    (q.tags || []).forEach((t) => usedTags.add(t));
  }

  return selected;
};