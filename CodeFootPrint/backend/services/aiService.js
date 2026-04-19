import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeContribution = async (
  username,
  repoUrl,
  aggregated,
  totalCommits,
  fileContents = {}
) => {
  const { backend = [], frontend = [], config = [] } = fileContents;

  const formatFiles = (files) =>
    files
      .map((f) => `File: ${f.filePath} (${f.totalLines} lines)\n${f.content.slice(0, 1500)}`)
      .join("\n---\n")
      .slice(0, 8000);

  // ✅ Format aggregated stats for prompt
  const statsSummary = `
Total Commits Analyzed : ${aggregated.totalCommitsAnalyzed}
Total Lines Added      : ${aggregated.totalLinesAdded}
Total Lines Removed    : ${aggregated.totalLinesRemoved}
Unique Files Touched   : ${aggregated.uniqueFilesTouched}
Functions Written      : ${aggregated.allFunctions.length}`;

  // ✅ Top files sorted by most work done
  const topFilesSummary = aggregated.topFiles
    .map(
      (f) =>
        `${f.file} — ${f.linesAdded} lines added, ${f.linesRemoved} removed, ${f.commitCount} commits`
    )
    .join("\n");

  // ✅ All functions written
  const functionsSummary = aggregated.allFunctions
    .map((f) => `${f.file}: ${f.definition}`)
    .join("\n")
    .slice(0, 5000);

  const prompt = `You are an expert code contribution analyst.

Analyze the EXACT work done by "${username}" in "${repoUrl}".

STRICT RULES:
- ONLY describe work from data provided below
- Do NOT assume or invent any work not shown
- Clearly separate backend vs frontend work
- Config files count as project setup NOT feature work
- If a section has no files say "No work found in this area"
- Be specific with exact file names and function names

--- CONTRIBUTION STATS (ALL ${totalCommits} COMMITS) ---
${statsSummary}

--- TOP FILES BY WORK DONE ---
${topFilesSummary}

--- FUNCTIONS & CLASSES WRITTEN ---
${functionsSummary}

--- BACKEND FILE CONTENTS ---
${formatFiles(backend)}

--- FRONTEND FILE CONTENTS ---
${formatFiles(frontend)}

--- CONFIG FILES ---
${config.map((f) => f.filePath).join("\n")}

Provide this exact report:
1. **What They Built** — Specific features, systems, modules built
2. **Backend Contributions** — Exact files and functions written
3. **Frontend Contributions** — Exact files and components written
4. **Project Setup** — Config and tooling set up
5. **Tech Stack** — Based strictly on actual code seen
6. **Code Quality** — Based on actual code patterns seen
7. **Contribution Scale** — Lines added/removed, files touched, functions written
8. **Overall Summary** — What did this person actually build in plain English?`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert code contribution analyst. You only report what you can directly see in the provided data. You never assume or invent contributions.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.1,
    max_tokens: 2048,
  });

  return response.choices[0].message.content;
};