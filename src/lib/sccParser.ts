import type { SCCLanguage, EffortMetrics } from "@/types/scc";

export const parseEffortEstimates = (text: string): Partial<EffortMetrics> => {
  const estimates: Partial<EffortMetrics> = {};
  
  // Parse months - look for the specific format in the SCC report
  const monthsMatch = text.match(/Estimated Schedule Effort \(organic\)\s*([\d.]+)\s*months/);
  if (monthsMatch) {
    console.log('Found months:', monthsMatch[1]);
    estimates.estimatedMonths = parseFloat(monthsMatch[1]);
  }

  // Parse people - look for the specific format in the SCC report
  const peopleMatch = text.match(/Estimated People Required \(organic\)\s*([\d.]+)/);
  if (peopleMatch) {
    console.log('Found people:', peopleMatch[1]);
    estimates.estimatedPeople = parseFloat(peopleMatch[1]);
  }

  // Parse estimated cost
  const costMatch = text.match(/Estimated Cost to Develop.*?\$([0-9,]+)/);
  if (costMatch) {
    const costString = costMatch[1].replace(/,/g, '');
    estimates.estimatedCost = parseFloat(costString);
    console.log('Found cost:', estimates.estimatedCost);
  }

  console.log('Parsed estimates:', estimates);
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
        console.log('Found total files in parser:', totalFiles);
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

  // Parse effort estimates
  const estimates = parseEffortEstimates(text);

  return { 
    languages, 
    estimates,
    totalFiles
  };
};