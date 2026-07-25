// This file is the ONLY place in the app that reads process.env directly.
// Every other file imports values from here instead.
// Why? If an env variable name ever changes, we only fix it in one spot.

import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  githubToken: process.env.GITHUB_TOKEN,

  groqApiKey: process.env.GROQ_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  cohereApiKey: process.env.COHERE_API_KEY,
};

// Without these, the app would start but fail in confusing ways later
// (e.g. every login silently producing broken tokens). Better to fail
// loudly right now, at startup, with a clear message.
const REQUIRED_KEYS = ["jwtSecret", "databaseUrl"];

export const validateEnv = () => {
  const missingKeys = REQUIRED_KEYS.filter((key) => !env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingKeys.join(", ")}. Check your .env file.`
    );
  }
};

export default env;
