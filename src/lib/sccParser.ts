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

export const parseSCCText = (text: string): { languages: SCCLanguage[], estimates: Partial<EffortMetrics> } => {
  const lines = text.split("\n");
  const languages: SCCLanguage[] = [];
  let isParsingLanguages = false;

  // Parse SCC data
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
          WeightedComplexity: parseInt(parts[6], 10),
          Files: [],
        });
      }
    }
  }

  // Parse effort estimates
  const estimates = parseEffortEstimates(text);

  return { languages, estimates };
};