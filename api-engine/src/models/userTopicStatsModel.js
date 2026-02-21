import mongoose from "mongoose";

const userTopicStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    topicKey: { type: String, required: true, index: true }, // same as quizTopics.js key
    topicName: { type: String, required: true },
    category: { type: String, default: "General" },

    masteryScore: { type: Number, default: 0, min: 0, max: 100 },
    riskLevel: { type: String, default: "low" }, // low|medium|high

    totalAttempts: { type: Number, default: 0 },
    lastScore: { type: Number, default: 0 },

    // store top mistake tags for adaptive selection
    mistakeTags: { type: [String], default: [] },
  },
  { timestamps: true }
);

userTopicStatsSchema.index({ userId: 1, topicKey: 1 }, { unique: true });

export default mongoose.model("UserTopicStats", userTopicStatsSchema);