import mongoose from "mongoose";

const mistakeHistorySchema = new mongoose.Schema(
  {
    tag: { type: String, trim: true },          // e.g. "dependency_array"
    count: { type: Number, default: 1 },
    lastAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const masterySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true,
    },

    masteryScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    riskLevel: {
      type: String,
      enum: ["high", "moderate", "low"],
      default: "moderate",
    },

    // Store tags + count (for "Mistake History" input)
    mistakeHistory: {
      type: [mistakeHistorySchema],
      default: [],
    },

    // Store last 3 quiz scores (for difficulty scaling)
    lastAttempts: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

// One user should have only 1 mastery doc per topic
masterySchema.index({ userId: 1, topicId: 1 }, { unique: true });

export default mongoose.model("Mastery", masterySchema);