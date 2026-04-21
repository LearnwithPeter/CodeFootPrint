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

    const prompt = `You are a senior software engineer conducting a technical interview assessment.

    Analyze the contributions made by "${username}" in "${repoUrl}" and generate a detailed interview-ready report.
    
    Total commits by this user: ${totalCommits}
    
    STRICT RULES:
    - ONLY report what you can see in the data below
    - Do NOT assume or invent any work not shown
    - Be specific with exact file names and function names
    - If a section has no evidence say "No evidence found"
    
    --- CONTRIBUTION STATS ---
    ${statsSummary}
    
    --- TOP FILES BY WORK DONE ---
    ${topFilesSummary}
    
    --- FUNCTIONS & CLASSES WRITTEN ---
    ${functionsSummary}
    
    --- BACKEND FILES ---
    ${formatFiles(backend)}
    
    --- FRONTEND FILES ---
    ${formatFiles(frontend)}
    
    --- CONFIG FILES ---
    ${config.map((f) => f.filePath).join("\n")}
    
    Generate a report with these exact sections:
    
    1. **Candidate Overview**
       - Who is this developer based on their code?
       - What is their primary area of expertise?
       - Senior, Mid or Junior level based on code quality?
    
    2. **Technical Skills Demonstrated**
       - List exact languages, frameworks, tools seen in code
       - Rate proficiency: Expert / Proficient / Familiar
       - Back each rating with specific evidence from code
    
    3. **Problem Solving Ability**
       - What kind of problems did they solve?
       - How complex were the solutions?
       - Any evidence of good architectural decisions?
    
    4. **Code Quality Assessment**
       - Code organization and structure
       - Error handling patterns
       - Naming conventions
       - Modularity and reusability
       - Testing practices
    
    5. **Key Contributions** (most impressive work)
       - List top 3-5 most impactful things they built
       - For each: what it does, why it matters, complexity level
    
    6. **Collaboration & Consistency**
       - Commit frequency and consistency
       - Size of commits (focused or large dumps)
       - Evidence of iterative improvement
    
    7. **Areas of Strength**
       - Top 3 things this developer does well
       - Backed by specific code evidence
    
    8. **Areas for Improvement**
       - Gaps or weaknesses noticed in the code
       - What skills seem missing or underdeveloped
    
    9. **Interview Questions to Ask**
       - Generate 5 targeted technical questions based on their code
       - Each question should probe deeper into something they built
       - Example: "I see you wrote configureOrigin() — walk me through how you handle dynamic origin validation"
    
    10. **Hiring Recommendation**
        - Strong Hire / Hire / Maybe / No Hire
        - One paragraph justification based strictly on code evidence
        - What role would suit them best?`;
        
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