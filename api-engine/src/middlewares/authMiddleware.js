import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * JWT Protect Middleware
 * - Header: Authorization: Bearer <token>
 * - Verify token & expiry
 * - Attach user to req.user
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token (also checks expiry)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const msg =
        err.name === "TokenExpiredError"
          ? "Session expired: Please login again"
          : "Unauthorized: Invalid token";

      return res.status(401).json({
        success: false,
        message: msg,
      });
    }

    // Your token payload includes `id`
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
      });
    }

    // Get user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // Attach to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth middleware error",
      error: error.message,
    });
  }
};

/**
 * Role-based guard (optional)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Access denied",
      });
    }
    next();
  };
};