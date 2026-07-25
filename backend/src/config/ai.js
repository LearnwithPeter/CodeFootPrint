// Configuration for each AI provider. Keeping endpoints/models here means
// if a model name changes, we update it in exactly one place.

import env from "./env.js";

export const aiConfig = {
  groq: {
    apiKey: env.groqApiKey,
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile",
  },
  gemini: {
    apiKey: env.geminiApiKey,
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
  },
  cohere: {
    apiKey: env.cohereApiKey,
    endpoint: "https://api.cohere.ai/v1/chat",
    model: "command-r",
  },
};

// Low temperature everywhere - the rules doc requires deterministic,
// consistent AI output rather than creative variation between requests.
export const AI_TEMPERATURE = 0.2;
