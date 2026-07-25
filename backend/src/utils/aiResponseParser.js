// AI models sometimes wrap their JSON response in markdown code fences
// (```json ... ```) even when told not to, or add stray whitespace.
// This function cleans that up and safely parses the result.
// Rule from the docs: "Never trust AI output without validation."

import AppError from "./AppError.js";

const REQUIRED_REPORT_FIELDS = [
  "candidateOverview",
  "technicalSkills",
  "keyContributions",
  "codeQuality",
  "strengths",
  "areasForImprovement",
  "interviewQuestions",
  "hiringRecommendation",
];

export const safeParseAIResponse = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new AppError("AI provider returned an empty response", 502);
  }

  // Strip ```json ... ``` or plain ``` ... ``` fences if present.
  const cleanedText = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new AppError("AI provider returned invalid JSON", 502);
  }

  const missingFields = REQUIRED_REPORT_FIELDS.filter(
    (field) => !(field in parsed)
  );

  if (missingFields.length > 0) {
    throw new AppError(
      `AI report is missing required fields: ${missingFields.join(", ")}`,
      502
    );
  }

  return parsed;
};
