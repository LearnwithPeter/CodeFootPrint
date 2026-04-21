import { runAnalysis } from "../services/analysisService.js";
import { getAllContributors } from "../services/gitService.js";

export const analyzeRepo = async (req, res) => {
  try {
    const { repoUrl, username } = req.body;

    if (!repoUrl || !username) {
      return res.status(400).json({ message: "Missing inputs" });
    }

    const result = await runAnalysis(repoUrl, username);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ new controller for contributors
export const getContributors = async (req, res) => {
  try {
    const { repoUrl, username } = req.query;

    if (!repoUrl || !username) {
      return res.status(400).json({ message: "Missing inputs" });
    }

    const contributors = await getAllContributors(repoUrl);

    // ✅ mark the target user in the list
    const marked = contributors.map((c) => ({
      ...c,
      isTargetUser: c.username === username,
    }));

    res.json({
      repoUrl,
      targetUser: username,
      totalContributors: contributors.length,
      contributors: marked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};