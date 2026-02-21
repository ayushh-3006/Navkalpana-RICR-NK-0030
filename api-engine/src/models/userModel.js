import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    resumeMissingSkills: { type: [String], default: [] },
    targetRole: { type: String, default: "MERN Stack Developer" },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
