import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAttemptById } from "../../../services/quizService";

export default function QuizResult() {
  const { attemptId } = useParams();

  const [attempt, setAttempt] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        const res = await getAttemptById(attemptId);

        // ✅ robust response handling
        const attemptDoc = res?.attempt || res?.data?.attempt || null;

        if (!attemptDoc) {
          setErr("Attempt not found or API did not return attempt.");
          setAttempt(null);
          return;
        }

        setAttempt(attemptDoc);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Failed to load result");
        setAttempt(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [attemptId]);

  if (loading) return <div className="text-slate-400">Loading result...</div>;

  if (err) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300">
          {err}
        </div>
        <div className="mt-4">
          <Link
            to="/student/dashboard/quiz-history"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-black/30 text-slate-200 inline-block"
          >
            Go to History
          </Link>
        </div>
      </div>
    );
  }

  // ✅ SAFE
  const quiz = typeof attempt?.quizId === "object" ? attempt.quizId : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#050505] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white">Quiz Result</h2>

        {/* ✅ if quiz not populated */}
        {!quiz ? (
          <p className="text-yellow-300 mt-2 text-sm">
            Quiz details not populated from backend. (quizId is not an object)
          </p>
        ) : (
          <p className="text-slate-400 mt-2">
            {quiz.title} • {quiz.topicFocus} • {quiz.difficulty}
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-800 bg-black/20">
            <p className="text-slate-400 text-sm">Score</p>
            <p className="text-3xl font-bold text-cyan-300">
              {attempt?.score ?? 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-black/20">
            <p className="text-slate-400 text-sm">Attempted</p>
            <p className="text-3xl font-bold text-white">
              {Array.isArray(attempt?.answers) ? attempt.answers.length : 0}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-black/20">
            <p className="text-slate-400 text-sm">Time</p>
            <p className="text-base font-semibold text-white">
              {attempt?.createdAt ? new Date(attempt.createdAt).toLocaleString() : "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/student/dashboard/adaptive-quiz"
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
          >
            Start New Quiz
          </Link>

          <Link
            to="/student/dashboard/quiz-history"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-black/30 text-slate-200"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}