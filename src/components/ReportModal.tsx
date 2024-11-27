import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CodeStatisticsCard from "./CodeStatisticsCard";
import EffortInputsCard from "./EffortInputsCard";
import type { SCCReport, EffortMetrics } from "@/types/scc";
import { parseSCCText } from "@/lib/sccParser";

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, report: SCCReport, effort: EffortMetrics) => void;
  initialReport?: SCCReport;
  initialName?: string;
  initialEffort?: EffortMetrics;
}

const ReportModal = ({ 
  open, 
  onOpenChange, 
  onSave,
  initialReport,
  initialName = "",
  initialEffort
}: ReportModalProps) => {
  const [currentReport, setCurrentReport] = useState<SCCReport | null>(initialReport || null);
  const [reportName, setReportName] = useState(initialName);
  const [currentEffort, setCurrentEffort] = useState<EffortMetrics>(initialEffort || {
    estimatedMonths: 3,
    estimatedPeople: 2,
    actualMonths: 4,
    actualPeople: 1.5
  });
  const [pasteContent, setPasteContent] = useState("");

  const handleSave = () => {
    if (currentReport) {
      onSave(reportName, currentReport, currentEffort);
      onOpenChange(false);
      setCurrentReport(null);
      setReportName("");
      setPasteContent("");
      setCurrentEffort({
        estimatedMonths: 3,
        estimatedPeople: 2,
        actualMonths: 4,
        actualPeople: 1.5
      });
    }
  };

  const handlePasteData = (data: string) => {
    try {
      const { languages, estimates } = parseSCCText(data);
      
      const total = languages.reduce((acc, lang) => ({
        files: acc.files + lang.Count,
        lines: acc.lines + lang.Lines,
        code: acc.code + lang.Code,
        comments: acc.comments + lang.Comments,
        blanks: acc.blanks + lang.Blanks,
        complexity: acc.complexity + lang.Complexity
      }), {
        files: 0,
        lines: 0,
        code: 0,
        comments: 0,
        blanks: 0,
        complexity: 0
      });

      setCurrentReport({ languages, total });
    } catch (error) {
      console.error('Error processing pasted data:', error);
    }
  };

  const handleStatsChange = (total: SCCReport['total']) => {
    if (currentReport) {
      setCurrentReport({
        ...currentReport,
        total
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialReport ? 'Edit Report' : 'Add New Report'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository Name
            </label>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter repository name"
            />
          </div>

          <div>
            <textarea
              className="w-full h-32 p-2 border rounded-md font-mono text-sm"
              placeholder="Paste your SCC report text here..."
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              onPaste={(e) => handlePasteData(e.clipboardData.getData("text"))}
            />
          </div>

          {currentReport && (
            <>
              <CodeStatisticsCard 
                stats={currentReport.total}
                onChange={handleStatsChange}
              />
              <EffortInputsCard
                effort={currentEffort}
                onChange={setCurrentEffort}
              />
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!currentReport}>
              Save Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;