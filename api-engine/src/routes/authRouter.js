import express from "express";
import { UserRegister, UserLogin } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);

export default router;