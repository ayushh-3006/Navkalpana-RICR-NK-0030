import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();
import connectDB from "./src/config/db.js";
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;


app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(port,()=>{
    console.log(`Server Running at Port ${port}`);
    connectDB();
})