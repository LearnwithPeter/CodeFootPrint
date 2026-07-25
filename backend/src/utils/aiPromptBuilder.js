// Builds the prompt we send to the AI. Pure function - no network calls -
// so it's easy to test and easy to tweak the report format later.
//
// Two rules drive this file, both aimed at making the report defensible in
// an interview ("how was this calculated?"):
// 1. No numbers the AI made up. Anything that's a real calculation
//    (contribution stats, contribution area percentages) is computed by
//    the backend and never asked of the AI. The AI only produces
//    qualitative judgment calls (level labels, evidence bullets, written
//    assessments) - the kind of thing a human reviewer would actually have
//    to think about, not arithmetic.
// 2. Every AI conclusion must be traceable to real data. The prompt hands
//    over real file paths, directory-derived contribution areas, and
//    function names, and explicitly instructs the AI to ground its
//    interview questions and contributions in that data rather than
//    inventing generic ones.

const FUNCTIONS_LIMIT = 25;
const FILES_LIMIT = 8;

const TOKEN_BUDGET = 2000;
const estimateTokens = (text) => Math.ceil(text.length / 4);

const SKILL_LEVELS = "Beginner, Intermediate, Advanced, or Expert";
const OBSERVATION_LEVELS = "Weak, Moderate, Strong, or Excellent";

const REPORT_JSON_SHAPE = `{
  "candidateOverview": {
    "experienceLevel": "${SKILL_LEVELS}",
    "primaryExpertise": string,
    "summary": string,
    "reasoning": [string]
  },
  "technicalSkills": [ { "skill": string, "level": "${SKILL_LEVELS}", "evidence": [string] } ],
  "keyContributions": [ { "title": string, "description": string, "complexity": "Low" | "Medium" | "High", "files": [string] } ],
  "codeQuality": {
    "overall": "${OBSERVATION_LEVELS}",
    "naming": string,
    "modularity": string,
    "errorHandling": string,
    "testing": string,
    "documentation": string
  },
  "strengths": [string],
  "areasForImprovement": [string],
  "interviewQuestions": [string],
  "hiringRecommendation": { "verdict": string, "bestFitRole": string, "reasons": [string] }
}`;

const buildUserPrompt = (analysisData, functionsLimit, filesLimit) => {
  const { repository, githubUsername, contributionStats, evidenceSummary } = analysisData;

  const topFiles = contributionStats.topModifiedFiles
    .slice(0, filesLimit)
    .map((f) => f.file)
    .join(", ");

  const topFunctions =
    contributionStats.functionsDetected.slice(0, functionsLimit).join(", ") || "None detected";

  const contributionAreas = contributionStats.contributionAreas
    .map((area) => `${area.area} (${area.percentage}%)`)
    .join(", ");

  return `Analyze this contributor and return a report in EXACTLY this JSON shape:
${REPORT_JSON_SHAPE}

Repository: ${repository.name} (${repository.language || "Unknown"})
Contributor: ${githubUsername}
Commits analyzed: ${contributionStats.totalCommits} | Lines +${contributionStats.totalLinesAdded}/-${contributionStats.totalLinesRemoved} | Files touched: ${contributionStats.uniqueFilesCount}
Contribution areas (calculated from real directory data): ${contributionAreas}
Top files: ${topFiles}
Sample functions: ${topFunctions}
Technologies detected: ${evidenceSummary.technologiesDetected.join(", ") || "Unknown"}

Rules:
- Never output a numeric score or percentage anywhere in your response. Use
  only the level labels described in the JSON shape above.
- Every technical skill's "evidence" must reference an actual file,
  directory, or function name from the data above - not a generic claim.
- "reasoning" for experience level must be 2-4 short, specific bullet
  points based only on the data above (e.g. commit volume, which areas
  were touched) - not generic praise.
- Interview questions must reference the contributor's actual files or
  contribution areas from the data above, not generic language questions.
- keyContributions must describe what the data shows (files/areas
  touched), never an invented outcome like "improved performance" unless
  the data supports it.
- Base every conclusion only on the data above. If something can't be
  justified by this data, leave it out rather than guessing.
- Be factual and concise. Avoid superlatives ("exceptional", "outstanding")
  not supported by the data.
- Return ONLY the JSON object, no other text.`;
};

export const buildAnalysisPrompt = (analysisData) => {
  const systemPrompt =
    "You are a senior technical interviewer analyzing a developer's real GitHub " +
    "contributions. Respond with ONLY valid JSON - no markdown, no code fences, " +
    "no text outside the JSON. Never invent numeric scores - use only the " +
    "qualitative level labels requested.";

  let userPrompt = buildUserPrompt(analysisData, FUNCTIONS_LIMIT, FILES_LIMIT);

  // Token safety net: the limits above already keep prompts small in the
  // vast majority of cases, but if a prompt still comes in over budget
  // (e.g. unusually long file paths), trim the function list further
  // instead of sending a request that's likely to fail on the model's side.
  let functionsLimit = FUNCTIONS_LIMIT;
  while (estimateTokens(systemPrompt + userPrompt) > TOKEN_BUDGET && functionsLimit > 0) {
    functionsLimit = Math.floor(functionsLimit / 2);
    userPrompt = buildUserPrompt(analysisData, functionsLimit, FILES_LIMIT);
  }

  return { systemPrompt, userPrompt };
};
