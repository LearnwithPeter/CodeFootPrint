// Small, reusable, stateless helper functions.
// This file must never import Express or anything request/response related -
// that's what keeps it usable from anywhere (services, scripts, tests).

// Takes a GitHub repository URL and pulls out the owner and repo name.
// Accepts formats like:
//   https://github.com/facebook/react
//   https://github.com/facebook/react.git
//   github.com/facebook/react
export const parseRepoUrl = (repoUrl) => {
  const cleanedUrl = repoUrl.trim().replace(/\.git$/, "").replace(/\/$/, "");

  const match = cleanedUrl.match(
    /github\.com[/:]([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)$/
  );

  if (!match) {
    return null;
  }

  const [, owner, repo] = match;
  return { owner, repo };
};

// Runs an async function over a list of items in small batches, instead of
// all at once. Example: 200 commits with batchSize 5 means only 5 requests
// to GitHub are "in flight" at any moment, instead of 200 simultaneously -
// this protects us from tripping GitHub's rate limiter.
export const batchProcess = async (items, batchSize, asyncFn) => {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(asyncFn));
    results.push(...batchResults);
  }

  return results;
};
