// Turns ONE raw commit (from gitService.fetchCommitDetails) into clean,
// structured data: which files changed, how many lines were added/removed,
// and which function names appear in the diff.
// This file is pure logic - no network calls, no database, no Express.
// That's what makes it easy to test and easy to reuse.

// Matches common function-declaration patterns across a few popular languages.
// This is intentionally simple pattern matching, not a real code parser -
// it's good enough to give a rough sense of "what functions were touched"
// without needing a heavy AST library.
const FUNCTION_PATTERNS = [
  /function\s+([a-zA-Z0-9_]+)\s*\(/g, // function myFunction(
  /const\s+([a-zA-Z0-9_]+)\s*=\s*(async\s*)?\(/g, // const myFunction = (
  /def\s+([a-zA-Z0-9_]+)\s*\(/g, // Python: def my_function(
];

// Only looks at ADDED lines in the diff (lines starting with "+") because
// those represent the actual new work the contributor did.
const extractFunctionsFromPatch = (patch) => {
  if (!patch) return [];

  const addedLines = patch
    .split("\n")
    .filter((line) => line.startsWith("+") && !line.startsWith("+++"))
    .join("\n");

  const functionNames = new Set();

  for (const pattern of FUNCTION_PATTERNS) {
    // Reset lastIndex since these regexes have the global flag and are reused.
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(addedLines)) !== null) {
      functionNames.add(match[1]);
    }
  }

  return [...functionNames];
};

// Keywords commonly used in commit messages that just set up a project,
// rather than representing real contribution work.
const SETUP_MESSAGE_KEYWORDS = [
  "initial commit",
  "init",
  "initial setup",
  "project setup",
  "scaffold",
  "create react app",
  "chore: init",
  "first commit",
];

// Files that, if they're the ONLY thing a commit touches, usually mean
// the commit is just dependency/lockfile churn rather than real work.
const BOILERPLATE_ONLY_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".gitignore",
];

// Returns true if a parsed commit looks like setup/boilerplate rather than
// meaningful contribution work. Used to filter the aggregate stats so a
// contributor's real work isn't diluted by "initial commit" noise.
export const isSetupCommit = (parsedCommit) => {
  const messageLower = parsedCommit.message.toLowerCase();

  const hasSetupKeyword = SETUP_MESSAGE_KEYWORDS.some((keyword) =>
    messageLower.includes(keyword)
  );

  const touchesOnlyBoilerplateFiles =
    parsedCommit.filesModified.length > 0 &&
    parsedCommit.filesModified.every((file) =>
      BOILERPLATE_ONLY_FILES.some((boilerplateFile) => file.endsWith(boilerplateFile))
    );

  return hasSetupKeyword || touchesOnlyBoilerplateFiles;
};
// Parses one commit object (as returned by GitHub's "get a commit" endpoint)
// into a clean summary we can aggregate later.
export const parseCommitDiff = (commit) => {
  const files = commit.files || [];

  const filesModified = files.map((file) => file.filename);

  const linesAdded = files.reduce((sum, file) => sum + (file.additions || 0), 0);
  const linesRemoved = files.reduce((sum, file) => sum + (file.deletions || 0), 0);

  const functionsDetected = files
    .flatMap((file) => extractFunctionsFromPatch(file.patch))
    .filter((name, index, all) => all.indexOf(name) === index); // dedupe

  return {
    sha: commit.sha,
    message: commit.commit.message,
    date: commit.commit.author.date,
    filesModified,
    linesAdded,
    linesRemoved,
    functionsDetected,
  };
};
