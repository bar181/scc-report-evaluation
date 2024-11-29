import type { SCCLanguage, EffortMetrics } from "@/types/scc";

export const parseEffortEstimates = (text: string): Partial<EffortMetrics> => {
  const estimates: Partial<EffortMetrics> = {};
  
  // Parse months
  const monthsMatch = text.match(/(\d+\.?\d*)\s*months/);
  if (monthsMatch) {
    estimates.estimatedMonths = parseFloat(monthsMatch[1]);
  }

  // Parse people
  const peopleMatch = text.match(/Required.*?(\d+\.?\d*)/);
  if (peopleMatch) {
    estimates.estimatedPeople = parseFloat(peopleMatch[1]);
  }

  return estimates;
};

interface ParseSCCTextResult {
  languages: SCCLanguage[];
  estimates: Partial<EffortMetrics>;
  totalFiles: number;
}

export const parseSCCText = (text: string): ParseSCCTextResult => {
  const lines = text.split("\n");
  const languages: SCCLanguage[] = [];
  let isParsingLanguages = false;
  let totalFiles = 0;

  // Parse SCC data
  for (const line of lines) {
    // Skip separator lines and empty lines
    if (line.startsWith("─") || !line.trim()) continue;

    // Start parsing after the header
    if (line.includes("Language") && line.includes("Files")) {
      isParsingLanguages = true;
      continue;
    }

    // Parse the Total line
    if (line.startsWith("Total")) {
      const parts = line.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        totalFiles = parseInt(parts[1], 10);
      }
      break;
    }

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
          WeightedComplexity: parseInt(parts[6], 10),
          Files: [],
        });
      }
    }
  }

  // If we found languages but no total line, sum up the Count values
  if (totalFiles === 0 && languages.length > 0) {
    totalFiles = languages.reduce((sum, lang) => sum + lang.Count, 0);
  }

  // Parse effort estimates
  const estimates = parseEffortEstimates(text);

  return { 
    languages, 
    estimates,
    totalFiles
  };
};