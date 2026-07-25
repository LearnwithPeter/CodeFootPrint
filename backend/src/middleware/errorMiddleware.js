// This middleware catches any error passed via next(error) anywhere in the app
// and turns it into a consistent JSON response.
// It must be registered LAST in app.js, after all routes.

import logger from "../utils/logger.js";

// Prisma errors have a "code" instead of a friendly message (e.g. "P2002").
// We translate the two most common ones into clear, correct HTTP responses
// instead of letting them fall through as a generic 500. This mainly
// protects against race conditions - e.g. two identical registration
// requests arriving at the same instant, both passing our manual
// "does this email exist" check before either one has saved yet.
const PRISMA_ERROR_RESPONSES = {
  P2002: { statusCode: 409, message: "A record with this value already exists" },
  P2025: { statusCode: 404, message: "Record not found" },
};

const errorMiddleware = (error, req, res, next) => {
  const prismaResponse = PRISMA_ERROR_RESPONSES[error.code];

  const statusCode = prismaResponse?.statusCode || error.statusCode || 500;
  const message = prismaResponse?.message || error.message || "Something went wrong on the server";

  logger.error(`${req.method} ${req.originalUrl} - ${message}`);

  res.status(statusCode).json({ success: false, message });
};

export default errorMiddleware;
