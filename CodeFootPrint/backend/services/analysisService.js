import {
  getCommitsByUser,
  getDiff,
  getFilesChangedByUser,
  getFileContent,
} from "./gitService.js";
import { analyzeContribution } from "./aiService.js";
import { filterCommits } from "../utils/helpers.js";
import { parseDiff } from "../utils/diffParser.js";
import { aggregateDiffs } from "../utils/diffAggregator.js";

// ✅ Fetch ALL diffs in batches — no sampling
const fetchAllDiffs = async (commits, repoUrl, batchSize = 10) => {
  const results = [];
  const total = commits.length;

  for (let i = 0; i < commits.length; i += batchSize) {
    const batch = commits.slice(i, i + batchSize);
    console.log(`Fetching diffs ${i + 1} to ${i + batch.length} of ${total}...`);

    const batchResults = await Promise.all(
      batch.map(async (commitHash) => {
        try {
          const diff = await getDiff(repoUrl, commitHash);
          const parsed = parseDiff(diff, commitHash);
          return parsed;
        } catch (err) {
          console.error(`Failed diff for ${commitHash}:`, err.message);
          return null;
        }
      })
    );

    results.push(...batchResults.filter(Boolean));
  }

  return results;
};

const fetchFileContents = async (repoUrl, commitHashes) => {
  console.log("Fetching files changed by user...");
  const userFiles = await getFilesChangedByUser(repoUrl, commitHashes);
  console.log(`Found ${userFiles.length} unique files`);

  const contents = [];
  for (const filePath of userFiles) {
    if (filePath.match(/\.(png|jpg|jpeg|gif|svg|ico|lock|md)$/)) continue;

    const content = await getFileContent(repoUrl, filePath);
    if (content) {
      contents.push({
        filePath,
        content: content.slice(0, 3000),
        totalLines: content.split("\n").length,
      });
    }
    if (contents.length >= 20) break;
  }
  return contents;
};

const categorizeFiles = (fileContents) => {
  const backend = fileContents.filter(
    (f) =>
      f.filePath.includes("/backend/") ||
      (f.filePath.match(/\.(js|ts|py|go|java|rb|php)$/) &&
        !f.filePath.includes("/frontend/"))
  );
  const frontend = fileContents.filter(
    (f) =>
      f.filePath.includes("/frontend/") ||
      f.filePath.match(/\.(tsx|jsx|css|html|vue)$/)
  );
  const config = fileContents.filter(
    (f) =>
      f.filePath.match(/\.(json|yaml|yml|env|lock|rc|ignore)$/) ||
      f.filePath.includes("config")
  );
  return { backend, frontend, config };
};

export const runAnalysis = async (repoUrl, username) => {
  console.log("1. Fetching all commits...");
  let commits = await getCommitsByUser(repoUrl, username);
  commits = filterCommits(commits);
  const totalCommits = commits.length;
  console.log("2. Total commits found:", totalCommits);

  if (commits.length === 0) {
    return {
      username,
      repoUrl,
      totalCommits: 0,
      report: null,
      message: "No commits found for this user.",
    };
  }

  // ✅ Fetch ALL diffs — no sampling
  console.log("3. Fetching ALL diffs in batches of 10...");
  const allParsedDiffs = await fetchAllDiffs(commits, repoUrl, 10);
  console.log(`4. Successfully parsed ${allParsedDiffs.length} diffs`);

  // ✅ Aggregate all diffs into one compact summary
  console.log("5. Aggregating all diffs...");
  const aggregated = aggregateDiffs(allParsedDiffs);
  console.log(`6. Aggregation done:
    - Total lines added   : ${aggregated.totalLinesAdded}
    - Total lines removed : ${aggregated.totalLinesRemoved}
    - Unique files touched: ${aggregated.uniqueFilesTouched}
    - Functions written   : ${aggregated.allFunctions.length}
  `);

  // ✅ Sample commits for file content fetching — still needed for file contents
  const sampledForFiles = commits.slice(0, 20);
  console.log("7. Fetching file contents...");
  const fileContents = await fetchFileContents(repoUrl, sampledForFiles);
  console.log(`8. Fetched ${fileContents.length} files`);

  const { backend, frontend, config } = categorizeFiles(fileContents);
  console.log(`Backend: ${backend.length} | Frontend: ${frontend.length} | Config: ${config.length}`);

  console.log("9. Sending aggregated data to Groq...");
  const report = await analyzeContribution(
    username,
    repoUrl,
    aggregated,    // ✅ send aggregated data not raw diffs
    totalCommits,
    { backend, frontend, config }
  );
  console.log("10. Done!");

  return {
    username,
    repoUrl,
    totalCommits,
    totalDiffsAnalyzed: allParsedDiffs.length,
    filesAnalyzed: fileContents.map((f) => f.filePath),
    stats: {
      totalLinesAdded: aggregated.totalLinesAdded,
      totalLinesRemoved: aggregated.totalLinesRemoved,
      uniqueFilesTouched: aggregated.uniqueFilesTouched,
      functionsWritten: aggregated.allFunctions.length,
    },
    report,
  };
};