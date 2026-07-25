// Business logic for the dashboard: user profile info and summary
// statistics across all of a user's analyses.

import prisma from "../config/database.js";
import AppError from "../utils/AppError.js";

// Returns the logged-in user's profile, including how many analyses
// they've run - useful for a "member since" / "X analyses run" card.
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { analyses: true } },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    memberSince: user.createdAt,
    totalAnalyses: user._count.analyses,
  };
};

// Returns the four dashboard summary stats described in the design doc:
// Total Analyses, Repositories Analyzed, Average Analysis Time, Last Analysis.
export const getDashboardStats = async (userId) => {
  const [totalAnalyses, distinctRepos, timeAggregate, lastAnalysis] = await Promise.all([
    prisma.analysis.count({ where: { userId } }),

    prisma.analysis.findMany({
      where: { userId },
      distinct: ["repositoryUrl"],
      select: { repositoryUrl: true },
    }),

    prisma.analysis.aggregate({
      where: { userId },
      _avg: { processingTimeMs: true },
    }),

    prisma.analysis.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { repositoryUrl: true, createdAt: true },
    }),
  ]);

  return {
    totalAnalyses,
    repositoriesAnalyzed: distinctRepos.length,
    averageAnalysisTimeMs: timeAggregate._avg.processingTimeMs
      ? Math.round(timeAggregate._avg.processingTimeMs)
      : null,
    lastAnalysis: lastAnalysis
      ? { repositoryUrl: lastAnalysis.repositoryUrl, date: lastAnalysis.createdAt }
      : null,
  };
};
