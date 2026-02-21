import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuizTopics, startQuiz } from "../../../services/quizService";

export default function AdaptiveQuiz() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [topicKey, setTopicKey] = useState("nodeExpress");

  const [autoTopic, setAutoTopic] = useState(false); // ✅ AI decides topic

  const [difficulty, setDifficulty] = useState("easy");
  const [count, setCount] = useState(10);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuizTopics();
        const list = data?.topics || [];
        setTopics(list);

        // default first topic
        if (list.length) setTopicKey(list[0].key);
      } catch (e) {
        // fallback topics if endpoint not ready
        const fallback = [
          { key: "nodeExpress", name: "Node.js + Express", category: "Backend" },
          { key: "mongodb", name: "MongoDB Basics", category: "Database" },
          { key: "javaOOP", name: "Java OOP", category: "Java" },
        ];
        setTopics(fallback);
        setTopicKey("nodeExpress");
      }
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    topics.forEach((t) => {
      const cat = t.category || "Other";
      map[cat] = map[cat] || [];
      map[cat].push(t);
    });

    // stable order
    Object.keys(map).forEach((k) => {
      map[k].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    });

    return map;
  }, [topics]);

  const handleStart = async () => {
    try {
      setErr("");
      setLoading(true);

      const payload = {
        // ✅ AI mode => do NOT send topicKey
        ...(autoTopic ? {} : { topicKey }),
        difficulty,
        count,
      };

      const data = await startQuiz(payload);
      const quiz = data.quiz;

      toast.success("Quiz started ✅");
      navigate(`/student/dashboard/quiz/${quiz._id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Failed to start quiz";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#050505] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Adaptive Quiz</h1>
            <p className="text-slate-400 mt-2">
              Select Topic • Difficulty • Questions
            </p>
          </div>

          {/* ✅ AI Toggle */}
          <button
            onClick={() => setAutoTopic((s) => !s)}
            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
              autoTopic
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-slate-800 bg-black/20 text-slate-200 hover:bg-black/30"
            }`}
            title="AI will pick your weakest topic"
          >
            AI Topic: {autoTopic ? "ON" : "OFF"}
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* Topic */}
          <div className={`${autoTopic ? "opacity-50 pointer-events-none" : ""}`}>
            <label className="text-sm text-slate-400">Topic</label>
            <select
              value={topicKey}
              onChange={(e) => setTopicKey(e.target.value)}
              className="mt-2 w-full bg-transparent border border-slate-800 rounded-xl p-3 text-slate-200"
            >
              {Object.keys(grouped).map((cat) => (
                <optgroup key={cat} label={cat}>
                  {grouped[cat].map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <p className="text-xs text-slate-500 mt-2">
              Bank file: <b>{topicKey}.{difficulty}.json</b>
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm text-slate-400">Difficulty</label>
            <div className="mt-2 flex gap-2">
              {["easy", "medium", "hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                    difficulty === d
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-black/20 text-slate-200 hover:bg-black/30"
                  }`}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="text-sm text-slate-400">Questions</label>
            <div className="mt-2 flex gap-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${
                    count === n
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-slate-800 bg-black/20 text-slate-200 hover:bg-black/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Note: Agar bank file me total questions kam hain, system max available return karega.
            </p>
          </div>

          {err && (
            <div className="p-3 rounded-xl bg-red-500/10 text-red-300 text-sm border border-red-500/20">
              {err}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Starting..." : "Start Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}