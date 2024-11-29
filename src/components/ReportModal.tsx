import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CodeStatisticsCard from "./CodeStatisticsCard";
import SCCPasteInput from "./SCCPasteInput";
import EffortInputsSection from "./EffortInputsSection";
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

const DEFAULT_STATS = {
  files: 0,
  lines: 0,
  code: 0,
  comments: 0,
  blanks: 0,
  complexity: 0
};

const DEFAULT_EFFORT: EffortMetrics = {
  estimatedMonths: 3,
  estimatedPeople: 2,
  actualMonths: 1,
  actualPeople: 1
};

const ReportModal = ({ 
  open, 
  onOpenChange, 
  onSave,
  initialReport,
  initialName,
  initialEffort
}: ReportModalProps) => {
  const [currentReport, setCurrentReport] = useState<SCCReport>({ 
    languages: [], 
    total: DEFAULT_STATS 
  });
  const [reportName, setReportName] = useState(initialName || "Repo 1");
  const [currentEffort, setCurrentEffort] = useState<EffortMetrics>(initialEffort || DEFAULT_EFFORT);
  const [pasteContent, setPasteContent] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [actualCost, setActualCost] = useState(0);

  useEffect(() => {
    if (initialReport) {
      setCurrentReport(initialReport);
    }
    if (initialEffort) {
      setCurrentEffort(initialEffort);
    }
    if (initialName) {
      setReportName(initialName);
    }
  }, [initialReport, initialEffort, initialName]);

  useEffect(() => {
    const calculateDefaultCost = (months: number, people: number) => {
      const hourlyRate = 75;
      return Math.round(months * people * hourlyRate * 160);
    };

    // Only set default costs if they haven't been manually edited
    if (estimatedCost === 0) {
      setEstimatedCost(calculateDefaultCost(currentEffort.estimatedMonths, currentEffort.estimatedPeople));
    }
    if (actualCost === 0) {
      setActualCost(calculateDefaultCost(currentEffort.actualMonths, currentEffort.actualPeople));
    }
  }, [currentEffort, estimatedCost, actualCost]);

  const handlePasteData = (data: string) => {
    try {
      console.log('Processing pasted data:', data);
      const { languages, estimates, totalFiles } = parseSCCText(data);
      
      const total = languages.reduce((acc, lang) => ({
        files: totalFiles || acc.files,
        lines: acc.lines + lang.Lines,
        code: acc.code + lang.Code,
        comments: acc.comments + lang.Comments,
        blanks: acc.blanks + lang.Blanks,
        complexity: acc.complexity + lang.Complexity
      }), DEFAULT_STATS);

      console.log('Parsed total files:', totalFiles);
      console.log('Updated total stats:', total);

      setCurrentReport({ languages, total });

      if (estimates.estimatedMonths || estimates.estimatedPeople || estimates.estimatedCost) {
        setCurrentEffort(prev => ({
          ...prev,
          ...(estimates.estimatedMonths && { estimatedMonths: estimates.estimatedMonths }),
          ...(estimates.estimatedPeople && { estimatedPeople: estimates.estimatedPeople })
        }));
        
        // Set the estimated cost if it was found in the SCC report
        if (estimates.estimatedCost) {
          console.log('Setting estimated cost from SCC report:', estimates.estimatedCost);
          setEstimatedCost(estimates.estimatedCost);
        }
      }
    } catch (error) {
      console.error('Error processing pasted data:', error);
    }
  };

  const handleSave = () => {
    const updatedEffort = {
      ...currentEffort,
      estimatedCost,
      actualCost
    };
    onSave(reportName, currentReport, updatedEffort);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setCurrentReport({ languages: [], total: DEFAULT_STATS });
    setReportName("Repo 1");
    setPasteContent("");
    setCurrentEffort(DEFAULT_EFFORT);
    setEstimatedCost(0);
    setActualCost(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialReport ? 'Edit Report' : 'Add New Report'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Repository Name</label>
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Enter repository name"
            />
          </div>

          <SCCPasteInput
            value={pasteContent}
            onChange={setPasteContent}
            onPaste={handlePasteData}
          />

          <CodeStatisticsCard 
            stats={currentReport.total}
            onChange={(total) => setCurrentReport(prev => ({ ...prev, total }))}
          />
          
          <EffortInputsSection
            effort={currentEffort}
            estimatedCost={estimatedCost}
            actualCost={actualCost}
            onEffortChange={(type, field, value) => {
              if (field === 'cost') {
                const numValue = Number(value) || 0;
                if (type === 'estimated') {
                  setEstimatedCost(numValue);
                } else {
                  setActualCost(numValue);
                }
              } else {
                setCurrentEffort(prev => ({
                  ...prev,
                  [`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]: parseFloat(value) || 0
                }));
              }
            }}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
