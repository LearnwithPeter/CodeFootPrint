import apiClient from "./client.js";

export const runAnalysisRequest = (repoUrl, githubUsername) =>
  apiClient.post("/analysis", { repoUrl, githubUsername }).then((res) => res.data);

export const getAnalysisHistoryRequest = () =>
  apiClient.get("/analysis").then((res) => res.data);

export const getAnalysisByIdRequest = (id) =>
  apiClient.get(`/analysis/${id}`).then((res) => res.data);

export const deleteAnalysisRequest = (id) =>
  apiClient.delete(`/analysis/${id}`).then((res) => res.data);
