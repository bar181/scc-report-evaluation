import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import SummaryStats from "@/components/SummaryStats";
import LanguageChart from "@/components/LanguageChart";
import ComplexityChart from "@/components/ComplexityChart";
import LanguageTable from "@/components/LanguageTable";
import type { SCCReport } from "@/types/scc";
import { parseSCCText } from "@/lib/sccParser";

const Index = () => {
  const [report, setReport] = useState<SCCReport | null>(null);
  const { toast } = useToast();

  const processLanguageData = (languages: any[]) => {
    const total = languages.reduce(
      (acc, curr) => ({
        lines: (acc.lines || 0) + curr.Lines,
        code: (acc.code || 0) + curr.Code,
        comments: (acc.comments || 0) + curr.Comments,
        blanks: (acc.blanks || 0) + curr.Blanks,
        complexity: (acc.complexity || 0) + curr.Complexity,
        files: (acc.files || 0) + curr.Count,
      }),
      {}
    );

    return { languages, total };
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith(".json")) {
        data = JSON.parse(text);
      } else {
        data = parseSCCText(text);
      }

      const transformedData = processLanguageData(data);
      setReport(transformedData);
      
      toast({
        title: "Report loaded successfully",
        description: `Analyzed ${transformedData.total.files} files`,
      });
    } catch (error) {
      console.error("Error parsing SCC report:", error);
      toast({
        title: "Error loading report",
        description: "Please ensure you're uploading a valid SCC report",
        variant: "destructive",
      });
    }
  };

  const handlePaste = (text: string) => {
    try {
      const data = parseSCCText(text);
      const transformedData = processLanguageData(data);
      setReport(transformedData);
      
      toast({
        title: "Report loaded successfully",
        description: `Analyzed ${transformedData.total.files} files`,
      });
    } catch (error) {
      console.error("Error parsing pasted SCC report:", error);
      toast({
        title: "Error parsing report",
        description: "Please ensure you're pasting a valid SCC report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SCC Report Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Upload or paste your SCC report to visualize your codebase statistics
          </p>
        </div>

        <FileUpload onUpload={handleFileUpload} onPaste={handlePaste} />

        {report && (
          <div className="space-y-8 animate-fade-in mt-8">
            <SummaryStats stats={report.total} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Language Distribution
                </h2>
                <LanguageChart languages={report.languages} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Complexity Analysis
                </h2>
                <ComplexityChart languages={report.languages} />
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Detailed Language Statistics
              </h2>
              <LanguageTable languages={report.languages} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;