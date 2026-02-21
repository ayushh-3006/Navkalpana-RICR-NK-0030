import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    tags: [String],

    // 🔥 Hackathon Level Fields
    masteryScore: { type: Number, default: 0 }, // 0-100
    totalAttempts: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },
    riskLevel: { type: String, default: "low" }, // low | medium | high
  },
  { timestamps: true }
);

export default mongoose.model("Topic", topicSchema);