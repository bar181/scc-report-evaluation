import type { SCCLanguage, EffortMetrics } from "@/types/scc";

export interface ProcessedData {
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

export const processLanguageData = (languages: SCCLanguage[]): ProcessedData => {
  const total = languages.reduce(
    (acc, curr) => ({
      lines: (acc.lines || 0) + curr.Lines,
      code: (acc.code || 0) + curr.Code,
      comments: (acc.comments || 0) + curr.Comments,
      blanks: (acc.blanks || 0) + curr.Blanks,
      complexity: (acc.complexity || 0) + curr.Complexity,
      files: (acc.files || 0) + curr.Count,
    }),
    {} as ProcessedData['total']
  );

  return { languages, total };
};