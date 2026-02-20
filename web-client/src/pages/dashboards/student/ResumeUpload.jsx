import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResumeForAnalysis } from "../../../services/resumeAI";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("MERN Stack Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fileMeta = useMemo(() => {
    if (!file) return null;
    const sizeKB = Math.round(file.size / 1024);
    const sizeLabel =
      sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
    return { name: file.name, type: file.type, sizeLabel };
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) return setError("Please upload a PDF resume.");
    if (file.type !== "application/pdf")
      return setError("Only PDF files are allowed.");

    setLoading(true);
    try {
      const res = await uploadResumeForAnalysis(file, targetRole, jobDescription);

      navigate("/student/dashboard/resume-analysis", {
        replace: true,
        state: { analysis: res?.analysis || null },
      });
    } catch (err) {
      setError(err?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-white">
            AI Resume Engine
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Groq Powered
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Upload your resume for ATS analysis
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Get an ATS score, missing keywords, and actionable fixes tailored for your target role.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Target Role
                </label>
                <input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 transition"
                  placeholder="e.g., MERN Stack Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Job Description{" "}
                  <span className="text-slate-400 font-medium">(optional)</span>
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-slate-200 focus:border-slate-400 transition resize-none"
                  placeholder="Paste the job description to improve keyword matching..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Resume PDF
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2.5 file:text-white file:font-semibold hover:file:bg-slate-800"
                  />

                  {fileMeta ? (
                    <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {fileMeta.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {fileMeta.sizeLabel} • PDF
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-slate-500">
                      Tip: Use a text-based PDF (scanned images won’t parse well).
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 text-white font-semibold py-3.5 hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Analyzing with AI..." : "Analyze Resume"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900">What you’ll get</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  ATS score + selection probability
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Missing keywords and how to add them
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Best fixes: bullets, action verbs, metrics
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  Rewritten professional summary
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold">Pro tip</h3>
              <p className="mt-2 text-sm text-slate-100/90">
                Keep your resume single-column, avoid tables/icons, and add quantifiable impact
                like “improved performance by 35%”.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}