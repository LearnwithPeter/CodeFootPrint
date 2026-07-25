// Handles all AI provider communication.
// Provider priority: Groq -> Gemini -> Cohere (per the architecture doc).
// If a provider fails (quota, network, bad response), we automatically
// try the next one instead of failing the whole request.

import axios from "axios";
import { aiConfig, AI_TEMPERATURE } from "../config/ai.js";
import { buildAnalysisPrompt } from "../utils/aiPromptBuilder.js";
import { safeParseAIResponse } from "../utils/aiResponseParser.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

// --- Individual provider callers ---
// Each one takes the same { systemPrompt, userPrompt } input and returns
// the RAW TEXT the model replied with. Parsing/validation happens later,
// in one shared place, so all three providers are held to the same standard.

const callGroq = async ({ systemPrompt, userPrompt }) => {
  const { apiKey, endpoint, model } = aiConfig.groq;

  const response = await axios.post(
    endpoint,
    {
      model,
      temperature: AI_TEMPERATURE,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  return response.data.choices[0].message.content;
};

const callGemini = async ({ systemPrompt, userPrompt }) => {
  const { apiKey, endpoint } = aiConfig.gemini;

  const response = await axios.post(
    `${endpoint}?key=${apiKey}`,
    {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: AI_TEMPERATURE },
    }
  );

  return response.data.candidates[0].content.parts[0].text;
};

const callCohere = async ({ systemPrompt, userPrompt }) => {
  const { apiKey, endpoint, model } = aiConfig.cohere;

  const response = await axios.post(
    endpoint,
    {
      model,
      preamble: systemPrompt,
      message: userPrompt,
      temperature: AI_TEMPERATURE,
    },
    { headers: { Authorization: `Bearer ${apiKey}` } }
  );

  return response.data.text;
};

// Providers in priority order. Each entry pairs a human-readable name
// (for logging) with its caller function.
const PROVIDERS = [
  { name: "Groq", call: callGroq },
  { name: "Gemini", call: callGemini },
  { name: "Cohere", call: callCohere },
];

// Tries each provider in order until one succeeds. Returns the SAFELY
// PARSED report object. Throws only if every provider fails.
export const generateAIReport = async (analysisData) => {
  const prompt = buildAnalysisPrompt(analysisData);

  const failures = [];

  for (const provider of PROVIDERS) {
    try {
      const rawText = await provider.call(prompt);
      const report = safeParseAIResponse(rawText);

      logger.info(`AI report generated successfully using ${provider.name}`);
      return report;
    } catch (error) {
      const reason = error.response?.data?.error?.message || error.message;
      logger.warn(`${provider.name} failed, trying next provider: ${reason}`);
      failures.push(`${provider.name}: ${reason}`);
    }
  }

  throw new AppError(
    `All AI providers failed to generate a report. (${failures.join(" | ")})`,
    502
  );
};
