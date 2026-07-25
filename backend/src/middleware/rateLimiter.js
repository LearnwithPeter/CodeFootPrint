// Two rate limiters, matching the rules doc: "protect authentication
// endpoints" and "protect analysis endpoints".
// Auth is limited harder because it's the classic brute-force target.
// Analysis is limited because each request costs real GitHub/AI quota.

import rateLimit from "express-rate-limit";

const buildLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // adds RateLimit-* response headers
    legacyHeaders: false,
    message: { success: false, message },
  });

export const authLimiter = buildLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // 10 attempts per window
  "Too many attempts. Please try again in 15 minutes."
);

export const analysisLimiter = buildLimiter(
  60 * 60 * 1000, // 1 hour
  20, // 20 analyses per window
  "Too many analysis requests. Please try again later."
);
