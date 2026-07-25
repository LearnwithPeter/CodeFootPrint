// A pre-configured axios instance for talking to our backend API.
// Two interceptors do the heavy lifting:
// 1. REQUEST interceptor - automatically attaches the JWT to every call,
//    so individual components never have to remember to do it themselves.
// 2. RESPONSE interceptor - if the backend ever says "your token is invalid
//    or expired" (401), we automatically log the user out and send them
//    back to the login page instead of showing a confusing broken screen.

import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
