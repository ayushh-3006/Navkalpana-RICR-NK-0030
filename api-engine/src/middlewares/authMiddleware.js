import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const Protect = async (req, res, next) => {
  try {
    const token = req.cookies.parleG;
    console.log(req.cookies);
    
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const OtpProtect = async (req, res, next) => {
  try {
    
    const token = req.cookies.otpToken;
    console.log(req);
    if (!token) return res.status(401).json({ message: "Unauthorized OTP" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) return res.status(401).json({ message: "Unauthorized OTP" });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized OTP" });
  }
};