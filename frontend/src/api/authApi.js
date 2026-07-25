import apiClient from "./client.js";

export const registerRequest = (name, email, password) =>
  apiClient.post("/auth/register", { name, email, password }).then((res) => res.data);

export const loginRequest = (email, password) =>
  apiClient.post("/auth/login", { email, password }).then((res) => res.data);

export const getMeRequest = () => apiClient.get("/auth/me").then((res) => res.data);
