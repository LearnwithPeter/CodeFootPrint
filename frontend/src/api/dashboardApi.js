import apiClient from "./client.js";

export const getProfileRequest = () => apiClient.get("/dashboard/profile").then((res) => res.data);

export const getStatsRequest = () => apiClient.get("/dashboard/stats").then((res) => res.data);
