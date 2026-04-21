import { runAnalysis } from "../services/analysisService.js";

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