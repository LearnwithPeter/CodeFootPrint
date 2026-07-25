// Controllers stay thin: read the request, call a service, send a response.
// All the real pipeline and database logic lives in analysisService.js.

import {
  analyzeContributions,
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} from "../services/analysisService.js";

// POST /api/analysis - runs the full pipeline, then saves the result.
export const analyzeRepository = async (req, res, next) => {
  try {
    const { repoUrl, githubUsername } = req.body;

    const startTime = Date.now();
    const result = await analyzeContributions(repoUrl, githubUsername);
    const processingTimeMs = Date.now() - startTime;

    const savedAnalysis = await saveAnalysis(
      req.userId,
      repoUrl,
      githubUsername,
      result,
      processingTimeMs
    );

    res.status(201).json({
      success: true,
      message: "Analysis completed and saved",
      data: {
        id: savedAnalysis.id,
        createdAt: savedAnalysis.createdAt,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analysis - list the logged-in user's analysis history.
export const listAnalyses = async (req, res, next) => {
  try {
    const analyses = await getAnalysisHistory(req.userId);

    res.status(200).json({
      success: true,
      data: { analyses },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analysis/:id - view one full saved analysis.
export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await getAnalysisById(req.userId, req.params.id);

    res.status(200).json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/analysis/:id - delete one saved analysis.
export const removeAnalysis = async (req, res, next) => {
  try {
    await deleteAnalysis(req.userId, req.params.id);

    res.status(200).json({
      success: true,
      message: "Analysis deleted",
    });
  } catch (error) {
    next(error);
  }
};
