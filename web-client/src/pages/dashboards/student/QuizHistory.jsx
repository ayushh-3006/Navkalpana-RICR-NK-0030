import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizHistory, startQuiz } from "../../../services/quizService";
import toast from "react-hot-toast";

export default function QuizHistory() {
  const [history, setHistory] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const loadHistory = async () => {
    try {
      setErr("");
      setLoading(true);
      const data = await getQuizHistory();
      setHistory(data.history || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const stats = useMemo(() => {
    const scores = (history || []).map((h) => Number(h.score) || 0);
    const total = scores.length;
    const avg = total ? Math.round(scores.reduce((a, b) => a + b, 0) / total) : 0;
    const best = total ? Math.max(...scores) : 0;
    return { total, avg, best };
  }, [history]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (history || []).filter((h) => {
      const title = (h.quizId?.title || "").toLowerCase();
      const topic = (h.quizId?.topicFocus || "").toLowerCase();
      const diff = (h.quizId?.difficulty || "").toLowerCase();

      const matchesText = !query || title.includes(query) || topic.includes(query);
      const matchesDiff = difficulty === "all" || diff === difficulty;
      return matchesText && matchesDiff;
    });
  }, [history, q, difficulty]);

  const retakeSimilar = async (h) => {
    try {
      const topicKey = h?.quizId?.topicKey; 
      // ✅ if backend doesn't store topicKey in Quiz, keep this button hidden or fallback
      if (!topicKey) {
        toast.error("TopicKey not found for this attempt (optional feature).");
        return;
      }

      const data = await startQuiz({
        topicKey,
        difficulty: h.quizId?.difficulty || "easy",
        count: 10,
      });

      toast.success("New quiz started ✅");
      window.location.href = `/student/dashboard/quiz/${data.quiz._id}`;
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || "Failed to start similar quiz");
    }
  };

  if (loading) return <div className="text-slate-400">Loading history...</div>;
  if (err) return <div className="text-red-300 bg-red-500/10 p-3 rounded-xl">{err}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#050505] border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Quiz History</h2>
            <p className="text-slate-400 mt-2">Last 30 attempts</p>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="px-4 py-3 rounded-2xl border border-slate-800 bg-black/20">
              <p className="text-xs text-slate-500">Attempts</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="px-4 py-3 rounded-2xl border border-slate-800 bg-black/20">
              <p className="text-xs text-slate-500">Avg Score</p>
              <p className="text-xl font-bold text-cyan-300">{stats.avg}</p>
            </div>
            <div className="px-4 py-3 rounded-2xl border border-slate-800 bg-black/20">
              <p className="text-xs text-slate-500">Best</p>
              <p className="text-xl font-bold text-emerald-300">{stats.best}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title or topic..."
            className="w-full bg-black/20 border border-slate-800 rounded-xl p-3 text-slate-200"
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-black/20 border border-slate-800 rounded-xl p-3 text-slate-200"
          >
            <option value="all">All Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <button
            onClick={loadHistory}
            className="w-full py-3 rounded-xl border border-slate-800 bg-black/30 text-slate-200 hover:bg-black/40"
          >
            Refresh
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.length === 0 && (
            <div className="text-slate-400 border border-slate-800 bg-black/20 p-5 rounded-2xl">
              No attempts found. Try changing filters.
            </div>
          )}

          {filtered.map((h) => (
            <div
              key={h._id}
              className="p-4 rounded-2xl border border-slate-800 bg-black/20 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="text-white font-semibold">{h.quizId?.title || "Quiz"}</p>
                <p className="text-slate-400 text-sm">
                  {h.quizId?.topicFocus} • {h.quizId?.difficulty} •{" "}
                  {new Date(h.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-cyan-300 font-bold text-xl">{h.score}</div>

                <Link
                 to={`/student/dashboard/quiz-result/${h._id}`}
                  className="px-3 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
                >
                  View
                </Link>

                {/* Optional: only show if topicKey exists */}
                {h?.quizId?.topicKey && (
                  <button
                    onClick={() => retakeSimilar(h)}
                    className="px-3 py-2 rounded-xl border border-slate-800 bg-black/30 text-slate-200 hover:bg-black/40"
                  >
                    Retake
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link
            to="/student/dashboard/adaptive-quiz"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-black/30 text-slate-200"
          >
            Back to Adaptive Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}