import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ✅ create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// ✅ attach token automatically
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// ✅ handle 401 globally (session expired)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;

    if (status === 401) {
      // session invalid => logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

/* ===================== QUIZ TOPICS ===================== */
export const getQuizTopics = async () => {
  const res = await api.get(`/api/quiz/topics/list`);
  return res.data;
};

/* ===================== START QUIZ ===================== */
export const startQuiz = async ({ topicKey, difficulty = "easy", count = 10 } = {}) => {
  const res = await api.post(`/api/quiz/start`, {
    topicKey,
    difficulty,
    count,
  });
  return res.data;
};

/* ===================== GET QUIZ ===================== */
export const getQuizById = async (quizId) => {
  const res = await api.get(`/api/quiz/${quizId}`);
  return res.data;
};

/* ===================== SUBMIT QUIZ ===================== */
/**
 * ✅ answers payload supported:
 * - [{ questionId, answer: [] }]
 * - [{ qid, answer: [] }]  (old format) => auto map
 */
export const submitQuiz = async (quizId, answers = []) => {
  const normalized = (answers || []).map((a) => ({
    questionId: a.questionId || a.qid, // ✅ backward compatible
    answer: Array.isArray(a.answer) ? a.answer : [],
  }));

  const res = await api.post(`/api/quiz/${quizId}/submit`, {
    answers: normalized,
  });

  return res.data;
};

/* ===================== HISTORY ===================== */
export const getQuizHistory = async () => {
  const res = await api.get(`/api/quiz/history`);
  return res.data;
};

/* ===================== ATTEMPT BY ID ===================== */
export const getAttemptById = async (attemptId) => {
  const res = await api.get(`/api/quiz/attempt/${attemptId}`);
  return res.data;
};