import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";
import InitialEffortForm from "./InitialEffortForm";
import type { SCCReport, EffortMetrics } from "@/types/scc";

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

  const handleReportData = (report: SCCReport) => {
    setCurrentReport(report);
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
            onUpload={handleReportData}
            onPaste={handleReportData}
            onManualEntry={handleReportData}
          />

          {currentReport && (
            <InitialEffortForm
              hourlyRate={70}
              onChange={setCurrentEffort}
            />
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