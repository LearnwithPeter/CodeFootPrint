// This file configures the Express application itself.
// It does NOT start the server (that happens in server.js) — this separation
// makes it easier to test the app later without actually opening a network port.

import express from "express";
import helmet from "helmet";
import cors from "cors";
import env from "./config/env.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

// 1. Helmet sets secure HTTP headers (e.g. prevents some common attacks)
app.use(helmet());

// 2. CORS controls which frontend origin is allowed to call this API
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

// 3. Parses incoming JSON request bodies into req.body
app.use(express.json());

// 4. Health check endpoint - confirms the server is alive and responding
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CodeFootPrint API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 5. Catch-all for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// 6. Global error handler - must be registered LAST
app.use(errorMiddleware);

export default app;
