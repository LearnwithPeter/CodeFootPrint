// Protects private routes. Any route that uses this middleware requires
// a valid "Authorization: Bearer <token>" header.
// On success, it attaches req.userId so later controllers know who's asking.

import { verifyToken } from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No authentication token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    // Covers both "no token" (AppError above) and "invalid/expired token"
    // (jwt.verify throws its own error, which we normalize here).
    next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;
