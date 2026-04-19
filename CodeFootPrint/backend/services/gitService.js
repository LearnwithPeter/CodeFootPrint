const GITHUB_API = "https://api.github.com";

const parseRepoUrl = (repoUrl) => {
  const parts = repoUrl.replace("https://github.com/", "").split("/");
  return { owner: parts[0], repo: parts[1] };
};

export const getCommitsByUser = async (repoUrl, username) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  let page = 1;
  let allCommits = [];

  while (true) {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/commits?author=${username}&per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const commits = await response.json();
    if (!Array.isArray(commits) || commits.length === 0) break;

    allCommits = [...allCommits, ...commits.map((c) => c.sha)];
    page++;
  }

  return allCommits;
};

export const getDiff = async (repoUrl, commitHash) => {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/commits/${commitHash}`,
    {
      headers: {
        Accept: "application/vnd.github.diff",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  return await response.text();
};

// ✅ Get all files changed by the user across all their commits
export const getFilesChangedByUser = async (repoUrl, commitHashes) => {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const fileSet = new Set();

  for (const hash of commitHashes) {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}/commits/${hash}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (data.files) {
      data.files.forEach((f) => fileSet.add(f.filename));
    }

    // ✅ Stop early if we already have enough files
    if (fileSet.size >= 30) break;
  }

  console.log("Files user touched:", [...fileSet]);
  return [...fileSet];
};

// ✅ Fetch actual content of a file
export const getFileContent = async (repoUrl, filePath) => {
  const { owner, repo } = parseRepoUrl(repoUrl);

  const response = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();

  // GitHub returns file content as base64
  if (data.encoding === "base64") {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }

  return null;
};