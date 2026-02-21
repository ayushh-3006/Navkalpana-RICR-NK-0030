import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    topicKey: { type: String, default: "" },
    id: { type: String, required: true, trim: true }, // "q1"
    type: {
      type: String,
      enum: ["mcq_single", "mcq_multi", "short", "scenario", "code_output"],
      required: true,
    },
    topic: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    question: { type: String, required: true },

    // for mcq_single/mcq_multi only
    options: { type: [String], default: [] },

    // Always keep as array (even single correct)
    correctAnswer: { type: [String], required: true, default: [] },

    explanation: { type: String, required: true },

    tags: { type: [String], default: [] },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
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

    title: { type: String, required: true },
    topicFocus: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    timeLimitSec: { type: Number, default: 900 }, // 15 min default
    totalQuestions: { type: Number, required: true },

    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);