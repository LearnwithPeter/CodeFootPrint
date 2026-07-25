// Handles all communication with the GitHub REST API.
// Every function here does ONE thing: fetch one kind of data and hand back
// clean, plain JavaScript data. Diff parsing / aggregation happens later,
// in Phase 4 - this file's job stops at "get the raw data from GitHub".

import githubClient from "../config/github.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";

// Turns any axios error from GitHub into a clear AppError with the
// right HTTP status code, instead of leaking GitHub's raw error format.
const handleGithubError = (error, context) => {
  const status = error.response?.status;

  if (status === 404) {
    throw new AppError(`${context}: repository or resource not found`, 404);
  }

  if (status === 403) {
    throw new AppError(
      `${context}: GitHub API rate limit exceeded, try again later`,
      429
    );
  }

  logger.error(`GitHub API error (${context}): ${error.message}`);
  throw new AppError(`${context}: failed to reach GitHub`, 502);
};

// Confirms the repository actually exists before we do any other work.
export const fetchRepository = async (owner, repo) => {
  try {
    const response = await githubClient.get(`/repos/${owner}/${repo}`);
    return response.data;
  } catch (error) {
    handleGithubError(error, "Fetch repository");
  }
};

// Fetches commits authored by a specific GitHub username, newest first.
// GitHub returns commits in pages of up to 100 - we keep requesting the
// next page until GitHub returns an empty page OR we hit MAX_COMMITS_TO_FETCH.
//
// The cap exists because a contributor on a huge repo (e.g. microsoft/TypeScript)
// can have thousands of commits. Paginating through all of them just to throw
// most away later wastes time and rate-limit budget for no benefit - the
// analysis pipeline only ever looks at a representative subset anyway
// (see MAX_COMMITS_TO_ANALYZE in analysisService.js). 500 is a generous
// ceiling: normal repos never hit it, huge ones stop wasting requests.
const MAX_COMMITS_TO_FETCH = 500;

export const fetchCommitsByUser = async (owner, repo, username) => {
  const commits = [];
  let page = 1;
  const perPage = 100;

  try {
    while (commits.length < MAX_COMMITS_TO_FETCH) {
      const response = await githubClient.get(`/repos/${owner}/${repo}/commits`, {
        params: { author: username, per_page: perPage, page },
      });

      commits.push(...response.data);

      // Fewer results than perPage means this was the last page.
      if (response.data.length < perPage) {
        break;
      }

      page += 1;
    }

    logger.info(
      `Fetched ${commits.length} commits by ${username} from ${owner}/${repo}`
    );

    return commits;
  } catch (error) {
    handleGithubError(error, "Fetch commits");
  }
};

// Fetches the full diff/details for a single commit (files changed,
// lines added/removed, patch text). Phase 4's diff parser will consume this.
export const fetchCommitDetails = async (owner, repo, commitSha) => {
  try {
    const response = await githubClient.get(
      `/repos/${owner}/${repo}/commits/${commitSha}`
    );
    return response.data;
  } catch (error) {
    handleGithubError(error, "Fetch commit details");
  }
};

// Fetches the list of everyone who has contributed to the repository.
export const fetchContributors = async (owner, repo) => {
  try {
    const response = await githubClient.get(`/repos/${owner}/${repo}/contributors`, {
      params: { per_page: 100 },
    });
    return response.data;
  } catch (error) {
    handleGithubError(error, "Fetch contributors");
  }
};
