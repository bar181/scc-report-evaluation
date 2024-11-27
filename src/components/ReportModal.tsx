import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUpload from "./FileUpload";
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

  const handleSave = () => {
    if (currentReport) {
      onSave(reportName, currentReport, currentEffort);
      onOpenChange(false);
      setCurrentReport(null);
      setReportName("");
      setCurrentEffort({
        estimatedMonths: 3,
        estimatedPeople: 2,
        actualMonths: 4,
        actualPeople: 1.5
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const { languages, estimates } = parseSCCText(text);
      
      // Calculate totals from languages
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
      console.error('Error processing file:', error);
    }
  };

  const handlePasteData = (data: string) => {
    try {
      const { languages, estimates } = parseSCCText(data);
      
      // Calculate totals from languages
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

  const handleManualEntry = (data: any) => {
    const report: SCCReport = {
      languages: [],
      total: {
        files: data.files,
        lines: data.lines,
        code: data.code,
        comments: data.comments,
        blanks: data.blanks,
        complexity: data.complexity
      }
    };
    setCurrentReport(report);
  };

  const handleEffortChange = (field: keyof EffortMetrics, value: string) => {
    setCurrentEffort(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
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

          <FileUpload
            onUpload={handleFileUpload}
            onPaste={handlePasteData}
            onManualEntry={handleManualEntry}
          />

          {currentReport && (
            <>
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3">Code Statistics</h3>
                <div className="grid grid-cols-6 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Files</div>
                    <div className="font-medium">{currentReport.total.files}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Lines</div>
                    <div className="font-medium">{currentReport.total.lines}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Blanks</div>
                    <div className="font-medium">{currentReport.total.blanks}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Comments</div>
                    <div className="font-medium">{currentReport.total.comments}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Code</div>
                    <div className="font-medium">{currentReport.total.code}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Complexity</div>
                    <div className="font-medium">{currentReport.total.complexity}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Estimated Effort</h3>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      value={currentEffort.estimatedMonths}
                      onChange={(e) => handleEffortChange('estimatedMonths', e.target.value)}
                      placeholder="Months"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={currentEffort.estimatedPeople}
                      onChange={(e) => handleEffortChange('estimatedPeople', e.target.value)}
                      placeholder="People"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Actual Effort</h3>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      step="0.1"
                      value={currentEffort.actualMonths}
                      onChange={(e) => handleEffortChange('actualMonths', e.target.value)}
                      placeholder="Months"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={currentEffort.actualPeople}
                      onChange={(e) => handleEffortChange('actualPeople', e.target.value)}
                      placeholder="People"
                    />
                  </div>
                </div>
              </Card>
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