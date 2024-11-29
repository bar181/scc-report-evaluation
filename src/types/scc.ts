export interface SCCLanguage {
  Name: string;
  Lines: number;
  Code: number;
  Comments: number;
  Blanks: number;
  Complexity: number;
  Count: number;
  WeightedComplexity: number;
  Files: string[];
}

export interface EffortMetrics {
  estimatedMonths: number;
  estimatedPeople: number;
  actualMonths: number;
  actualPeople: number;
  estimatedCost?: number;
  actualCost?: number;
}

export interface SCCReport {
  languages: SCCLanguage[];
  total: {
    lines: number;
    code: number;
    comments: number;
    blanks: number;
    complexity: number;
    files: number;
  };
  effort?: EffortMetrics;
  rawText?: string;
}

export interface ReportEntry extends SCCReport {
  id: number;
  name: string;
  effort: EffortMetrics;
}