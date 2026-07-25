// A pre-configured axios instance for talking to the GitHub REST API.
// Every request made with this client automatically includes:
// - the base URL (so services just write "/repos/..." instead of the full URL)
// - the auth token (so we get GitHub's higher rate limit, not the anonymous one)
// - the correct Accept header GitHub expects

import axios from "axios";
import env from "./env.js";

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: env.githubToken ? `Bearer ${env.githubToken}` : undefined,
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

export default githubClient;
