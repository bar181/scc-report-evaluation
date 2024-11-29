import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CodeStatisticsCard from "./CodeStatisticsCard";
import SCCPasteInput from "./SCCPasteInput";
import EffortFormSection from "./EffortFormSection";
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
  const [reportName, setReportName] = useState(initialName || "");
  const [pasteContent, setPasteContent] = useState("");
  const [currentReport, setCurrentReport] = useState<SCCReport>({ 
    languages: [], 
    total: {
      files: 0,
      lines: 0,
      code: 0,
      comments: 0,
      blanks: 0,
      complexity: 0
    }
  });
  
  const [effort, setEffort] = useState({
    estimated: {
      months: initialEffort?.estimatedMonths || 0,
      people: initialEffort?.estimatedPeople || 0,
      cost: initialEffort?.estimatedCost || 0
    },
    actual: {
      months: initialEffort?.actualMonths || 0,
      people: initialEffort?.actualPeople || 0,
      cost: initialEffort?.actualCost || 0
    }
  });

  useEffect(() => {
    console.log('Initial report received:', initialReport);
    console.log('Initial effort received:', initialEffort);
    
    if (initialReport) {
      setCurrentReport(initialReport);
      setPasteContent(initialReport.rawText || "");
    }
    
    if (initialEffort) {
      setEffort({
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
      });
    }
  }, [initialReport, initialEffort]);

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
          
          <EffortFormSection
            title="Estimated Effort"
            effort={effort.estimated}
            onChange={(field, value) => handleEffortChange('estimated', field, value)}
          />
          
          <EffortFormSection
            title="Actual Effort"
            effort={effort.actual}
            onChange={(field, value) => handleEffortChange('actual', field, value)}
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