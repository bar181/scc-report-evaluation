import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReportFormFields from "./ReportFormFields";
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
  initialName,
  initialEffort
}: ReportModalProps) => {
  const defaultReport: SCCReport = { 
    languages: [], 
    total: {
      files: 0,
      lines: 0,
      code: 0,
      comments: 0,
      blanks: 0,
      complexity: 0
    }
  };

  const defaultEffort = {
    estimated: {
      months: 0,
      people: 0,
      cost: 0
    },
    actual: {
      months: 1,
      people: 1,
      cost: 12000
    }
  };

  const [reportName, setReportName] = useState(initialName || "");
  const [pasteContent, setPasteContent] = useState("");
  const [currentReport, setCurrentReport] = useState<SCCReport>(initialReport || defaultReport);
  const [effort, setEffort] = useState(initialEffort ? {
    estimated: {
      months: initialEffort.estimatedMonths,
      people: initialEffort.estimatedPeople,
      cost: initialEffort.estimatedCost || 0
    },
    actual: {
      months: initialEffort.actualMonths,
      people: initialEffort.actualPeople,
      cost: initialEffort.actualCost || 0
    }
  } : defaultEffort);

  useEffect(() => {
    if (initialReport) {
      setCurrentReport(initialReport);
      setPasteContent(initialReport.rawText || "");
    }
  }, [initialReport]);

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
      }), currentReport.total);

      setCurrentReport({ 
        languages, 
        total,
        rawText: data 
      });

      if (estimates.estimatedCost) {
        setEffort(prev => ({
          ...prev,
          estimated: {
            ...prev.estimated,
            cost: estimates.estimatedCost
          }
        }));
      }
    } catch (error) {
      console.error('Error processing pasted data:', error);
    }
  };

  const handleEffortChange = (type: 'estimated' | 'actual', field: 'months' | 'people' | 'cost', value: string) => {
    setEffort(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleClear = () => {
    setReportName("");
    setPasteContent("");
    setCurrentReport(defaultReport);
    setEffort(defaultEffort);
  };

  const handleSave = () => {
    const effortMetrics: EffortMetrics = {
      estimatedMonths: effort.estimated.months,
      estimatedPeople: effort.estimated.people,
      estimatedCost: effort.estimated.cost,
      actualMonths: effort.actual.months,
      actualPeople: effort.actual.people,
      actualCost: effort.actual.cost
    };
    
    onSave(reportName, {
      ...currentReport,
      rawText: pasteContent
    }, effortMetrics);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialReport ? 'Edit Report' : 'Add New Report'}</DialogTitle>
        </DialogHeader>
        
        <ReportFormFields
          reportName={reportName}
          pasteContent={pasteContent}
          currentReport={currentReport}
          effort={effort}
          onReportNameChange={setReportName}
          onPasteContentChange={setPasteContent}
          onPasteData={handlePasteData}
          onCurrentReportChange={(total) => setCurrentReport(prev => ({ ...prev, total }))}
          onEffortChange={handleEffortChange}
          onClear={handleClear}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;