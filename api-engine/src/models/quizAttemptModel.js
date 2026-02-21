import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true, trim: true }, // matches Quiz.questions[].id
    answer: { type: [String], default: [] }, // always array
  },
  { _id: false },
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    answers: { type: [answerSchema], required: true },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    topicKey: { type: String, default: "" },
    difficulty: { type: String, default: "" },

    // example: { "React Hooks": 80 }
    topicWiseAccuracy: { type: Object, default: {} },

    // array of mistake objects (we will define in service)
    mistakeClassification: { type: Array, default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);
