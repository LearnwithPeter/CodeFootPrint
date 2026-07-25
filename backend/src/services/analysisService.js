// Coordinates the full "analyze a contributor's work" pipeline:
// 1. Fetch every commit the user made (gitService)
// 2. Fetch the full diff for each commit (gitService)
// 3. Parse each diff into structured data (diffParser)
// 4. Filter out setup/boilerplate commits (diffParser)
// 5. Aggregate everything into summary statistics (diffAggregator)
//
// This is the "business logic" layer the architecture doc describes -
// it coordinates other services/utils but never touches req/res directly.

import { parseRepoUrl, batchProcess } from "../utils/helpers.js";
import { parseCommitDiff, isSetupCommit } from "../utils/diffParser.js";
import { aggregateContributions } from "../utils/diffAggregator.js";
import { generateAIReport } from "./aiService.js";
import prisma from "../config/database.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";
import {
  fetchRepository,
  fetchCommitsByUser,
  fetchCommitDetails,
} from "./gitService.js";

// How many commit-detail requests to run at once. Keeps us well under
// GitHub's rate limit instead of firing hundreds of requests simultaneously.
const COMMIT_DETAIL_BATCH_SIZE = 5;

// The single biggest lever for both speed and AI token usage: fetching full
// diff details (patch text included) is the expensive call, and every commit
// we fetch details for eventually feeds into the AI prompt via
// functionsDetected/topModifiedFiles. Analyzing a contributor's most recent
// 100 commits gives a report that's practically identical to analyzing all
// 1,000+ - GitHub already returns commits newest-first, so this is just a
// slice, not a different query.
const MAX_COMMITS_TO_ANALYZE = 100;

export const analyzeContributions = async (repoUrl, githubUsername) => {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    throw new AppError("Invalid GitHub repository URL", 400);
  }
  const { owner, repo } = parsed;

  // Step 1: confirm the repo exists, and get the commit list, at the same time.
  const [repository, commitSummaries] = await Promise.all([
    fetchRepository(owner, repo),
    fetchCommitsByUser(owner, repo, githubUsername),
  ]);

  if (commitSummaries.length === 0) {
    throw new AppError(
      `No commits found for user "${githubUsername}" in this repository`,
      404
    );
  }

  // Step 2: fetch full diff details for the most recent commits only
  // (see MAX_COMMITS_TO_ANALYZE above), in controlled batches.
  const commitsToAnalyze = commitSummaries.slice(0, MAX_COMMITS_TO_ANALYZE);

  const fullCommits = await batchProcess(
    commitsToAnalyze,
    COMMIT_DETAIL_BATCH_SIZE,
    (commitSummary) => fetchCommitDetails(owner, repo, commitSummary.sha)
  );

  // Step 3: parse each commit's diff into structured data.
  const parsedCommits = fullCommits.map(parseCommitDiff);

  // Step 4: separate real contribution commits from setup/boilerplate noise.
  const realCommits = parsedCommits.filter((commit) => !isSetupCommit(commit));
  const setupCommitCount = parsedCommits.length - realCommits.length;

  // Step 5: aggregate the REAL commits into summary statistics.
  const contributionStats = aggregateContributions(realCommits);

  logger.info(
    `Analyzed ${parsedCommits.length} of ${commitSummaries.length} total commits for ${githubUsername} ` +
      `in ${owner}/${repo} (${setupCommitCount} filtered as setup/boilerplate)`
  );

  const analysisData = {
    repository: {
      name: repository.full_name,
      description: repository.description,
      language: repository.language,
    },
    githubUsername,
    contributionStats,
    // A small, purely backend-computed summary of what the analysis is
    // based on. This is what powers the report's "Evidence Used" section -
    // every value here comes directly from real GitHub/aggregation data,
    // nothing from the AI. It's also included in the AI prompt so the AI
    // grounds its interview questions and key contributions in real
    // directory/file names instead of inventing generic ones.
    evidenceSummary: {
      commitsAnalyzed: contributionStats.totalCommits,
      filesModified: contributionStats.uniqueFilesCount,
      majorDirectories: contributionStats.contributionAreas.map((area) => area.area).slice(0, 5),
      representativeFiles: contributionStats.topModifiedFiles.slice(0, 5).map((f) => f.file),
      technologiesDetected: [repository.language].filter(Boolean),
    },
  };

  // Step 6: send the aggregated data to the AI and get back a structured report.
  const aiReport = await generateAIReport(analysisData);

  return {
    ...analysisData,
    setupCommitsFiltered: setupCommitCount,
    aiReport,
  };
};

// Trims down the full analysis result before saving it to the database.
// We keep the AI report and the summary stats (what a user actually wants
// to revisit later) but drop the full raw commit-by-commit list - that's
// large, reconstructable from GitHub at any time, and not something a
// dashboard/history view needs. This follows the rule: "store only
// necessary data."
const toStorableReport = (analysisResult) => ({
  repository: analysisResult.repository,
  contributionStats: analysisResult.contributionStats,
  evidenceSummary: analysisResult.evidenceSummary,
  setupCommitsFiltered: analysisResult.setupCommitsFiltered,
  aiReport: analysisResult.aiReport,
});

// Saves a completed analysis, associated with the user who requested it.
export const saveAnalysis = async (
  userId,
  repoUrl,
  githubUsername,
  analysisResult,
  processingTimeMs
) => {
  const analysis = await prisma.analysis.create({
    data: {
      userId,
      repositoryUrl: repoUrl,
      githubUsername,
      status: "completed",
      report: toStorableReport(analysisResult),
      processingTimeMs,
    },
  });

  logger.info(`Saved analysis ${analysis.id} for user ${userId}`);

  return analysis;
};

// Returns every analysis belonging to a user, most recent first.
// Only returns summary fields - not the full report - since a history
// list doesn't need to render the entire AI report for every row.
export const getAnalysisHistory = async (userId) => {
  return prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      repositoryUrl: true,
      githubUsername: true,
      status: true,
      createdAt: true,
    },
  });
};

// Returns one full analysis, but only if it belongs to the requesting user.
// Using the same "not found" error for "doesn't exist" and "belongs to
// someone else" prevents leaking which analysis IDs exist for other users.
export const getAnalysisById = async (userId, analysisId) => {
  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, userId },
  });

  if (!analysis) {
    throw new AppError("Analysis not found", 404);
  }

  return analysis;
};

// Deletes one analysis, but only if it belongs to the requesting user.
export const deleteAnalysis = async (userId, analysisId) => {
  // Reuse getAnalysisById so the same ownership check applies here too.
  await getAnalysisById(userId, analysisId);

  await prisma.analysis.delete({ where: { id: analysisId } });

  logger.info(`Deleted analysis ${analysisId} for user ${userId}`);
};
