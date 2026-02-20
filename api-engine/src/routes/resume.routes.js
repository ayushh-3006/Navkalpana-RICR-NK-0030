import express from "express";
import multer from "multer";
import Groq from "groq-sdk";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// In-memory store (demo)
const lastAnalysisByUser = new Map();

function safeJsonParse(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) {
    throw new Error("AI JSON not found");
  }
  return JSON.parse(text.slice(first, last + 1));
}

router.get("/ping", (req, res) => {
  res.json({ ok: true });
});

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: "GROQ_API_KEY missing" });
    }

    const { targetRole = "MERN Stack Developer", jobDescription = "" } =
      req.body;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = (pdfData?.text || "").trim();

    if (resumeText.length < 200) {
      return res.status(400).json({
        message: "Resume text too short (scanned PDF won't work)",
      });
    }

    const prompt = `
Return STRICT JSON ONLY:
{
  "atsScore": 0-100,
  "selectionChance": 0-100,
  "verdict": "Poor|Average|Good|Excellent",
  "matchedKeywords": [],
  "missingKeywords": [],
  "formatIssues": [],
  "bestFixes": [],
  "rewrittenSummary": "",
  "note": ""
}

Target Role: ${targetRole}
Job Description: ${jobDescription || "N/A"}
Resume:
${resumeText}
`;

    const completion = await groq.chat.completions.create({
     model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        { role: "system", content: "Return JSON only." },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices?.[0]?.message?.content || "";
    const analysis = safeJsonParse(text);

    const userId = "demo-user";
    lastAnalysisByUser.set(userId, { analysis });

    return res.json({ message: "Success", analysis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

router.get("/latest-analysis", (req, res) => {
  const userId = "demo-user";
  const data = lastAnalysisByUser.get(userId);
  if (!data) return res.status(404).json({ message: "No analysis found" });
  return res.json(data);
});

export default router;