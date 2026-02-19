import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cors from "cors";
import AuthRouter from "./src/routes/authRouter.js";
 
 


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/auth", AuthRouter);
 

app.get("/", (req, res) => {
  res.send("Server running & DB connected");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});