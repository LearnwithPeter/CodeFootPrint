// Aggregates all parsed diffs into one structured summary
export const aggregateDiffs = (parsedDiffs) => {
  const fileMap = {};       // file → { linesAdded, linesRemoved, commitCount }
  const allFunctions = [];  // all functions written across all commits
  let totalLinesAdded = 0;
  let totalLinesRemoved = 0;

  for (const diff of parsedDiffs) {
    totalLinesAdded += diff.linesAdded;
    totalLinesRemoved += diff.linesRemoved;

    // aggregate per file stats
    for (const file of diff.filesChanged) {
      if (!fileMap[file]) {
        fileMap[file] = { linesAdded: 0, linesRemoved: 0, commitCount: 0 };
      }
      fileMap[file].linesAdded += diff.linesAdded;
      fileMap[file].linesRemoved += diff.linesRemoved;
      fileMap[file].commitCount += 1;
    }

    // collect all functions written
    for (const fn of diff.functionsAdded) {
      allFunctions.push(fn);
    }
  }

  // sort files by how much work was done in them
  const topFiles = Object.entries(fileMap)
    .sort((a, b) => b[1].linesAdded - a[1].linesAdded)
    .slice(0, 30) // top 30 most worked on files
    .map(([file, stats]) => ({
      file,
      linesAdded: stats.linesAdded,
      linesRemoved: stats.linesRemoved,
      commitCount: stats.commitCount,
    }));

  return {
    totalCommitsAnalyzed: parsedDiffs.length,
    totalLinesAdded,
    totalLinesRemoved,
    uniqueFilesTouched: Object.keys(fileMap).length,
    topFiles,
    allFunctions: allFunctions.slice(0, 100), // top 100 functions
  };
};