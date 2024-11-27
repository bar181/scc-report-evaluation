import type { SCCLanguage } from "@/types/scc";

export const parseSCCText = (text: string): SCCLanguage[] => {
  const lines = text.split("\n");
  const languages: SCCLanguage[] = [];
  let isParsingLanguages = false;

  for (const line of lines) {
    // Skip separator lines and empty lines
    if (line.startsWith("─") || !line.trim()) continue;

    // Start parsing after the header
    if (line.includes("Language") && line.includes("Files")) {
      isParsingLanguages = true;
      continue;
    }

    // Stop parsing when we hit the Total line
    if (line.startsWith("Total")) break;

    if (isParsingLanguages) {
      const parts = line.split(/\s+/).filter(Boolean);
      if (parts.length >= 7) {
        languages.push({
          Name: parts[0],
          Count: parseInt(parts[1], 10),
          Lines: parseInt(parts[2], 10),
          Blanks: parseInt(parts[3], 10),
          Comments: parseInt(parts[4], 10),
          Code: parseInt(parts[5], 10),
          Complexity: parseInt(parts[6], 10),
          WeightedComplexity: parseInt(parts[6], 10), // Using complexity as weighted complexity
          Files: [], // File list not available in text format
        });
      }
    }
  }

  return languages;
};