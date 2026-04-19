export const parseDiff = (rawDiff, commitHash) => {
  const lines = rawDiff.split("\n");
  const filesChanged = [];
  const addedLines = [];
  const removedLines = [];
  const functionsAdded = [];
  let currentFile = null;

  for (const line of lines) {
    if (line.startsWith("diff --git")) {
      currentFile = line.split(" b/")[1];
      if (currentFile) filesChanged.push(currentFile);
    }
    if (line.startsWith("+") && !line.startsWith("+++")) {
      const code = line.slice(1).trim();
      if (code) addedLines.push(code);
      if (code.match(/^(function |const |let |var |class |export |async function|export default)/)) {
        functionsAdded.push({ file: currentFile, definition: code.slice(0, 100) });
      }
    }
    if (line.startsWith("-") && !line.startsWith("---")) {
      removedLines.push(line.slice(1).trim());
    }
  }

  return {
    commitHash: commitHash.slice(0, 7),
    filesChanged,
    linesAdded: addedLines.length,
    linesRemoved: removedLines.length,
    functionsAdded,
    addedCode: addedLines.slice(0, 100).join("\n"),
  };
};