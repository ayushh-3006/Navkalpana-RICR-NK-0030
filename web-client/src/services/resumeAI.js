import { postFormData, getJSON } from "./api";

// ✅ Upload resume
export async function uploadResumeForAnalysis(file, targetRole, jobDescription = "") {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("targetRole", targetRole || "MERN Stack Developer");
  formData.append("jobDescription", String(jobDescription || ""));

  return await postFormData("/api/resume/upload", formData);
}

// ✅ Fetch latest analysis
export async function fetchLatestAnalysis() {
  return await getJSON("/api/resume/latest-analysis");
}