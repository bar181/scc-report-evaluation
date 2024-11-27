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
}