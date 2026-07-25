// Takes an array of ALREADY-PARSED commits (output of diffParser.parseCommitDiff)
// and combines them into overall contribution statistics.
// Pure logic - no network calls, no database. Easy to test with fake data.

// Counts how many times each file appears across all commits, and returns
// the top N most-frequently-touched files. This highlights which parts of
// the codebase the contributor actually focused on.
const getTopModifiedFiles = (parsedCommits, limit = 10) => {
  const fileCounts = {};

  for (const commit of parsedCommits) {
    for (const file of commit.filesModified) {
      fileCounts[file] = (fileCounts[file] || 0) + 1;
    }
  }

  return Object.entries(fileCounts)
    .sort((a, b) => b[1] - a[1]) // most-touched files first
    .slice(0, limit)
    .map(([file, count]) => ({ file, commitCount: count }));
};

// Groups modified files into repository-specific contribution areas, based
// purely on directory structure - no AI guessing involved. This answers
// "how was this calculated?" with a straight, defensible answer: we counted
// which top-level source directory each modified file lives in.
//
// Generic wrapper directories (src, lib, app...) are skipped in favor of
// the next meaningful segment, so "src/compiler/checker.ts" becomes
// "Compiler", not "Src". A small set of common directory names get a
// friendlier label (test -> "Tests"); anything else falls back to the
// directory name itself, Title Cased - which keeps this genuinely
// repository-specific instead of a fixed list of guessed categories.
const GENERIC_WRAPPER_DIRS = new Set(["src", "lib", "app", "source", "packages"]);

const LABEL_OVERRIDES = {
  test: "Tests",
  tests: "Tests",
  __tests__: "Tests",
  spec: "Tests",
  specs: "Tests",
  doc: "Documentation",
  docs: "Documentation",
  config: "Configuration",
  configs: "Configuration",
  ".github": "Infrastructure",
  script: "Infrastructure",
  scripts: "Infrastructure",
  style: "Styling",
  styles: "Styling",
  css: "Styling",
};

const titleCase = (text) =>
  text.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const ROOT_CONFIG_FILE_PATTERN =
  /^(package(-lock)?\.json|yarn\.lock|pnpm-lock\.yaml|tsconfig.*\.json|\.eslintrc.*|\.gitignore|\.prettierrc.*|dockerfile|docker-compose.*\.ya?ml|.*\.config\.(js|ts|json)|.*\.ya?ml)$/i;

const getCategoryForFile = (filePath) => {
  const segments = filePath.split("/").filter(Boolean);

  // A file with no real directory (e.g. "package-lock.json" at the repo
  // root) shouldn't have its raw filename title-cased into a category -
  // that produces awkward labels like "Package Lock.Json". Route it to a
  // sensible bucket instead.
  if (segments.length === 1) {
    return ROOT_CONFIG_FILE_PATTERN.test(segments[0]) ? "Configuration" : "Root";
  }

  const directorySegments = segments.slice(0, -1);

  let chosen = directorySegments[0];
  if (GENERIC_WRAPPER_DIRS.has(chosen.toLowerCase()) && directorySegments[1]) {
    chosen = directorySegments[1];
  }

  return LABEL_OVERRIDES[chosen.toLowerCase()] || titleCase(chosen);
};

// Returns the top contribution areas with REAL percentages, calculated from
// how many modified files fell into each directory-derived category.
const getContributionAreas = (parsedCommits, limit = 6) => {
  const areaCounts = {};
  let totalFileTouches = 0;

  for (const commit of parsedCommits) {
    for (const file of commit.filesModified) {
      const area = getCategoryForFile(file);
      areaCounts[area] = (areaCounts[area] || 0) + 1;
      totalFileTouches += 1;
    }
  }

  if (totalFileTouches === 0) return [];

  return Object.entries(areaCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([area, fileTouches]) => ({
      area,
      fileTouches,
      percentage: Math.round((fileTouches / totalFileTouches) * 100),
    }));
};

// Combines all parsed commits into one summary object.
export const aggregateContributions = (parsedCommits) => {
  const totalCommits = parsedCommits.length;

  const totalLinesAdded = parsedCommits.reduce(
    (sum, commit) => sum + commit.linesAdded,
    0
  );

  const totalLinesRemoved = parsedCommits.reduce(
    (sum, commit) => sum + commit.linesRemoved,
    0
  );

  const uniqueFiles = new Set(
    parsedCommits.flatMap((commit) => commit.filesModified)
  );

  const uniqueFunctions = new Set(
    parsedCommits.flatMap((commit) => commit.functionsDetected)
  );

  return {
    totalCommits,
    totalLinesAdded,
    totalLinesRemoved,
    uniqueFilesCount: uniqueFiles.size,
    uniqueFunctionsCount: uniqueFunctions.size,
    topModifiedFiles: getTopModifiedFiles(parsedCommits),
    functionsDetected: [...uniqueFunctions],
    contributionAreas: getContributionAreas(parsedCommits),
  };
};
