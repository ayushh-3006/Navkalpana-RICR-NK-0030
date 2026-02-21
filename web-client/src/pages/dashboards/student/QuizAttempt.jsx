import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuizById, submitQuiz } from "../../../services/quizService";

const LS_KEY = (quizId) => `quiz_progress_${quizId}`;

export default function QuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]); // { questionId, answer: [] }
  const [flagged, setFlagged] = useState({}); // {index: true}
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // ✅ prevents multiple auto-submits
  const autoSubmittedRef = useRef(false);

  // Load quiz
  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);
        const data = await getQuizById(quizId);
        setQuiz(data.quiz);
        setTimeLeft(data.quiz.timeLimitSec || 600);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [quizId]);

  // Load saved progress (answers + flagged + current)
  useEffect(() => {
    if (!quiz?._id) return;

    try {
      const saved = localStorage.getItem(LS_KEY(quiz._id));
      if (!saved) return;

      const parsed = JSON.parse(saved);

      // ✅ migrate old format {qid, answer} -> {questionId, answer}
      if (Array.isArray(parsed?.answers)) {
        const migrated = parsed.answers.map((a) => ({
          questionId: a.questionId || a.qid,
          answer: Array.isArray(a.answer) ? a.answer : [],
        }));
        setAnswers(migrated);
      }

      if (parsed?.flagged) setFlagged(parsed.flagged);
      if (typeof parsed?.current === "number") setCurrent(parsed.current);

      // ✅ restore time safely
      if (typeof parsed?.timeLeft === "number") {
        setTimeLeft(Math.max(0, parsed.timeLeft));
      }
    } catch {
      // ignore bad localStorage
    }
  }, [quiz?._id]);

  // Save progress
  useEffect(() => {
    if (!quiz?._id) return;
    localStorage.setItem(
      LS_KEY(quiz._id),
      JSON.stringify({ answers, flagged, current, timeLeft })
    );
  }, [quiz?._id, answers, flagged, current, timeLeft]);

  const answerMap = useMemo(() => {
    const map = {};
    answers.forEach((a) => (map[a.questionId] = a.answer));
    return map;
  }, [answers]);

  const setAnswerFor = (questionId, valueArray) => {
    setAnswers((prev) => {
      const next = prev.filter((x) => x.questionId !== questionId);
      next.push({ questionId, answer: valueArray });
      return next;
    });
  };

  const toggleFlag = (idx) => setFlagged((p) => ({ ...p, [idx]: !p[idx] }));

  const isAnswered = (questionId) => {
    const a = answerMap[questionId];
    return Array.isArray(a) && a.length > 0 && String(a[0] || "").trim() !== "";
  };

  const formatTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const stats = useMemo(() => {
    const total = quiz?.questions?.length || 0;
    const answered = (quiz?.questions || []).filter((qq) => isAnswered(qq.id)).length;
    const flaggedCount = Object.values(flagged || {}).filter(Boolean).length;
    const left = Math.max(0, total - answered);
    const percent = total ? Math.round((answered / total) * 100) : 0;
    return { total, answered, flaggedCount, left, percent };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, flagged, answerMap]);

 const submitNow = async (isAuto = false) => {
  try {
    if (submitting) return;
    if (!quiz?.questions?.length) return;

    if (!isAuto && stats.left > 0) {
      const ok = window.confirm(
        `You still have ${stats.left} unanswered question(s). Submit anyway?`
      );
      if (!ok) return;
    }

    setSubmitting(true);
    setErr("");

    const payload = (quiz.questions || []).map((qq) => ({
      questionId: qq.id,
      answer: answerMap[qq.id] || [],
    }));

    const data = await submitQuiz(quiz._id, payload);

    localStorage.removeItem(LS_KEY(quiz._id));
    toast.success(isAuto ? "Auto submitted ✅" : "Submitted ✅");

    // ✅ THIS IS IMPORTANT
    navigate(`/student/dashboard/quiz-result/${data.attemptId}`);
  } catch (e) {
    const msg = e?.response?.data?.message || e.message || "Submit failed";
    setErr(msg);
    toast.error(msg);
  } finally {
    setSubmitting(false);
  }
};

  // Timer (auto-submit on 0) ✅ fixed for duplicate call + negative time
  useEffect(() => {
    if (!quiz) return;

    // time up
    if (timeLeft <= 0) {
      if (!autoSubmittedRef.current && !submitting && quiz?.questions?.length) {
        autoSubmittedRef.current = true; // ✅ lock
        toast("Time up! Auto submitting…");
        submitNow(true);
      }
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((s) => Math.max(0, s - 1)); // ✅ prevent negative
    }, 1000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, timeLeft]);

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (!quiz) return;

      if (e.key === "ArrowLeft") setCurrent((c) => Math.max(0, c - 1));
      if (e.key === "ArrowRight") setCurrent((c) => Math.min(stats.total - 1, c + 1));
      if (e.key.toLowerCase() === "f") toggleFlag(current);
      if (e.key.toLowerCase() === "s") submitNow(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, current, stats.total]);

  const q = quiz?.questions?.[current];

  if (loading) return <div className="text-slate-400">Loading quiz...</div>;
  if (err && !quiz)
    return <div className="text-red-300 bg-red-500/10 p-3 rounded-xl">{err}</div>;

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
          <p className="text-slate-400 text-sm">
            {quiz.topicFocus} • {quiz.difficulty} • {quiz.totalQuestions} questions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl border border-slate-800 bg-black/30 text-slate-200">
            ⏱ {formatTime(timeLeft)}
          </div>
          <button
            onClick={() => submitNow(false)}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Progress stats */}
      <div className="border border-slate-800 rounded-2xl p-4 bg-black/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <p className="text-slate-400 text-sm">
            Question {current + 1} / {quiz.totalQuestions}
          </p>

          <div className="flex gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl border border-slate-800 bg-black/30 text-slate-200">
              Answered: <b className="text-emerald-300">{stats.answered}</b>
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-slate-800 bg-black/30 text-slate-200">
              Flagged: <b className="text-yellow-300">{stats.flaggedCount}</b>
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-slate-800 bg-black/30 text-slate-200">
              Left: <b className="text-slate-100">{stats.left}</b>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div className="h-full bg-cyan-500" style={{ width: `${stats.percent}%` }} />
        </div>

        {/* Flag button */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => toggleFlag(current)}
            className={`text-sm px-3 py-1.5 rounded-xl border ${
              flagged[current]
                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
                : "border-slate-800 bg-black/30 text-slate-300"
            }`}
          >
            {flagged[current] ? "Flagged" : "Flag for review"} (F)
          </button>

          <p className="text-xs text-slate-500">Shortcuts: ←/→, F=Flag, S=Submit</p>
        </div>

        {/* numbers */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quiz.questions.map((qq, idx) => {
            const answered = isAnswered(qq.id);
            const isFlag = !!flagged[idx];

            const cls = answered
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              : isFlag
              ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
              : "border-slate-800 bg-black/30 text-slate-300";

            return (
              <button
                key={qq.id}
                onClick={() => setCurrent(idx)}
                className={`w-10 h-10 rounded-xl border text-sm font-semibold ${cls} ${
                  idx === current ? "ring-2 ring-cyan-500/40" : ""
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {err && (
        <div className="p-3 rounded-xl bg-red-500/10 text-red-300 text-sm border border-red-500/20">
          {err}
        </div>
      )}

      {/* Question */}
      {q && (
        <div className="border border-slate-800 rounded-2xl p-5 bg-black/20">
          <p className="text-slate-200 font-semibold">{q.question}</p>

          {/* MCQ Single */}
          {q.type === "mcq_single" && (
            <div className="mt-4 space-y-2">
              {(q.options || []).map((opt) => {
                const selected = (answerMap[q.id] || [])[0] === opt;
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                      selected
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-slate-800 bg-black/30 hover:bg-black/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={selected}
                      onChange={() => setAnswerFor(q.id, [opt])}
                    />
                    <span className="text-slate-200">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* MCQ Multi */}
          {q.type === "mcq_multi" && (
            <div className="mt-4 space-y-2">
              {(q.options || []).map((opt) => {
                const arr = answerMap[q.id] || [];
                const selected = arr.includes(opt);

                const toggle = () => {
                  const next = selected ? arr.filter((x) => x !== opt) : [...arr, opt];
                  setAnswerFor(q.id, next);
                };

                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${
                      selected
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-slate-800 bg-black/30 hover:bg-black/50"
                    }`}
                  >
                    <input type="checkbox" checked={selected} onChange={toggle} />
                    <span className="text-slate-200">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Short / Scenario / Code Output */}
          {["short", "scenario", "code_output"].includes(q.type) && (
            <div className="mt-4">
              <textarea
                rows={4}
                value={(answerMap[q.id] || [])[0] || ""}
                onChange={(e) => setAnswerFor(q.id, [e.target.value])}
                className="w-full bg-black/30 border border-slate-800 rounded-xl p-3 text-slate-200"
                placeholder="Type your answer..."
              />
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-5 flex items-center justify-between">
            <button
              disabled={current === 0}
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-black/30 text-slate-200 disabled:opacity-50"
            >
              Prev (←)
            </button>
            <button
              disabled={current === quiz.totalQuestions - 1}
              onClick={() =>
                setCurrent((c) => Math.min(quiz.totalQuestions - 1, c + 1))
              }
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold disabled:opacity-60"
            >
              Next (→)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}