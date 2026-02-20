import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routes/authRouter.js";
import resumeRoutes from "./src/routes/resume.routes.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

app.use("/auth", AuthRouter);
app.use("/api/resume", resumeRoutes);

app.get("/", (req, res) => res.send("Server running & DB connected ✅"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));