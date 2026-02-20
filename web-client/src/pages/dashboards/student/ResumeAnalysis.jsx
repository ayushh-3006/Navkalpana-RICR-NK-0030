import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchLatestAnalysis } from "../../../services/resumeAI";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function verdictStyle(score = 0) {
  if (score >= 80)
    return {
      label: "Excellent",
      pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-600",
    };
  if (score >= 65)
    return {
      label: "Good",
      pill: "bg-blue-100 text-blue-700 border-blue-200",
      bar: "bg-blue-600",
    };
  if (score >= 45)
    return {
      label: "Average",
      pill: "bg-amber-100 text-amber-700 border-amber-200",
      bar: "bg-amber-600",
    };
  return {
    label: "Poor",
    pill: "bg-red-100 text-red-700 border-red-200",
    bar: "bg-red-600",
  };
}

export default function ResumeAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const [analysis, setAnalysis] = useState(location.state?.analysis || null);
  const [loading, setLoading] = useState(!location.state?.analysis);
  const [error, setError] = useState("");

  useEffect(() => {
    if (analysis) return;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchLatestAnalysis();
        setAnalysis(res?.analysis || null);
      } catch (e) {
        setError(e?.message || "No analysis found. Please upload resume first.");
      } finally {
        setLoading(false);
      }
    })();
  }, [analysis]);

  const atsScore = useMemo(
    () => clamp(Number(analysis?.atsScore || 0), 0, 100),
    [analysis]
  );

  const selScore = useMemo(
    () => clamp(Number(analysis?.selectionChance || 0), 0, 100),
    [analysis]
  );

  const verdict = useMemo(() => verdictStyle(atsScore), [atsScore]);

  const handleCopySummary = async () => {
    const text = analysis?.rewrittenSummary?.trim();
    if (!text) return toast.error("No summary to copy.");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Summary copied ✅");
    } catch {
      toast.error("Copy failed.");
    }
  };

  // ✅ BEST: print from same page (no about:blank, no missing CSS)
  const handleDownloadPDF = () => {
    if (!reportRef.current) return toast.error("Report not found.");

    toast.success("Print opened ✅ (Save as PDF)");

    // Add print class to body to enable print-only styles
    document.body.classList.add("print-mode");

    // Wait a bit to apply CSS then print
    setTimeout(() => {
      window.print();

      // After print closes, remove print class
      setTimeout(() => {
        document.body.classList.remove("print-mode");
      }, 500);
    }, 300);
  };

  if (loading) return <div className="p-6">Loading analysis...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!analysis) return <div className="p-6">No analysis found.</div>;

  return (
    <>
      {/* ✅ Print CSS (IMPORTANT) */}
      <style>{`
        @media print {
          /* hide everything */
          body * {
            visibility: hidden !important;
          }

          /* show only report */
          #print-report, #print-report * {
            visibility: visible !important;
          }

          /* position report at top */
          #print-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* remove shadows for clean print */
          .shadow, .shadow-sm, .shadow-md, .shadow-lg {
            box-shadow: none !important;
          }

          /* keep colors */
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }

          /* hide buttons */
          .noPrint {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Top bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 noPrint">
            <div>
              <p className="text-xs font-semibold inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white">
                Resume Report
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ATS Friendly
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Your AI Resume Analysis
              </h1>
              {analysis?.note && (
                <p className="mt-2 text-sm text-slate-600">{analysis.note}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/student/dashboard/resume-upload")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                Re-upload
              </button>

              <button
                onClick={handleCopySummary}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                Copy Summary
              </button>

              <button
                onClick={handleDownloadPDF}
                className="rounded-xl bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-800"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* ✅ PRINT AREA */}
          <div id="print-report" ref={reportRef}>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* ATS Score */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">ATS Score</p>
                    <p className="mt-1 text-4xl font-extrabold text-slate-900">
                      {atsScore}%
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${verdict.pill}`}
                  >
                    {analysis?.verdict || verdict.label}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${verdict.bar} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${atsScore}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Aim for 75+ for strong ATS compatibility.
                  </p>
                </div>
              </div>

              {/* Selection Chance */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm font-semibold text-slate-700">
                  Selection Chance
                </p>
                <p className="mt-1 text-4xl font-extrabold text-slate-900">
                  {selScore}%
                </p>

                <div className="mt-5">
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selScore}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Estimate based on keywords + structure.
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-6 text-white">
                <p className="text-sm font-semibold text-white/90">
                  Rewritten Summary
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/90">
                  {analysis?.rewrittenSummary || "—"}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mt-6">
              {/* Missing Keywords */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900">
                  Missing Keywords
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(analysis?.missingKeywords || []).length ? (
                    analysis.missingKeywords.map((k) => (
                      <span
                        key={k}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {k}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No missing keywords ✅
                    </p>
                  )}
                </div>
              </div>

              {/* Best Fixes */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900">Best Fixes</h3>
                <ul className="mt-4 space-y-3">
                  {(analysis?.bestFixes || []).slice(0, 10).map((x, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {!!(analysis?.formatIssues || []).length && (
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900">Format Issues</h3>
                <div className="mt-3 grid md:grid-cols-2 gap-3">
                  {analysis.formatIssues.map((x, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {x}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="mt-8 text-xs text-slate-500 noPrint">
            Tip: Keep resume single-column + add metrics like “improved speed by 40%”.
          </p>
        </div>
      </div>
    </>
  );
}