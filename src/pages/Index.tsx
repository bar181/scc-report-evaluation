import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/FileUpload";
import SummaryStats from "@/components/SummaryStats";
import LanguageChart from "@/components/LanguageChart";
import ComplexityChart from "@/components/ComplexityChart";
import LanguageTable from "@/components/LanguageTable";
import ReportsTable from "@/components/ReportsTable";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import type { SCCReport, ReportEntry } from "@/types/scc";
import { parseSCCText } from "@/lib/sccParser";

const Index = () => {
  const [currentReport, setCurrentReport] = useState<SCCReport | null>(null);
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [reportName, setReportName] = useState("");
  const [hourlyRate, setHourlyRate] = useState(70);
  const { toast } = useToast();

  const handleSaveReport = () => {
    if (!currentReport) return;

    const name = reportName || `Repository ${reports.length + 1}`;
    const newReport: ReportEntry = {
      ...currentReport,
      id: Date.now(),
      name,
    };

    setReports((prev) => [...prev, newReport]);
    setCurrentReport(null);
    setReportName("");

    toast({
      title: "Report saved",
      description: `Report "${name}" has been saved successfully`,
    });
  };

  const handleEditReport = (id: number) => {
    const report = reports.find((r) => r.id === id);
    if (report) {
      setCurrentReport(report);
      setReportName(report.name);
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDeleteReport = (id: number) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast({
      title: "Report deleted",
      description: "The report has been removed successfully",
    });
  };

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
      setCurrentReport(transformedData);
      
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
      setCurrentReport(transformedData);
      
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

  const handleManualEntry = (data: any) => {
    const transformedData = {
      languages: [],
      total: data
    };
    setCurrentReport(transformedData);
    
    toast({
      title: "Manual entry saved",
      description: "Statistics have been updated",
    });
  };

  const handleStatsChange = (newStats: any) => {
    if (currentReport) {
      setCurrentReport({
        ...currentReport,
        total: newStats,
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
          <h3 className="text-lg text-gray-600 mb-4">
            Created by{" "}
            <a
              href="https://www.linkedin.com/in/bradaross/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 underline"
            >
              Bradley Ross
            </a>
          </h3>
          
          <div className="max-w-xs mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Developer Hourly Rate (USD)
            </label>
            <Input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              min="0"
              className="text-center"
            />
          </div>
        </div>

        {reports.length > 0 && (
          <PerformanceMetrics reports={reports} />
        )}

        <FileUpload
          onUpload={handleFileUpload}
          onPaste={handlePaste}
          onManualEntry={handleManualEntry}
        />

        {currentReport && (
          <div className="space-y-8 animate-fade-in mt-8">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repository Name
                </label>
                <Input
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter repository name"
                />
              </div>
              <Button onClick={handleSaveReport}>Save Report</Button>
            </div>

            <SummaryStats
              stats={currentReport.total}
              onStatsChange={handleStatsChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Language Distribution
                </h2>
                <LanguageChart languages={currentReport.languages} />
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Complexity Analysis
                </h2>
                <ComplexityChart languages={currentReport.languages} />
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Detailed Language Statistics
              </h2>
              <LanguageTable languages={currentReport.languages} />
            </Card>
          </div>
        )}

        {reports.length > 0 && (
          <Card className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-4">Saved Reports</h2>
            <ReportsTable
              reports={reports}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
              hourlyRate={hourlyRate}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;