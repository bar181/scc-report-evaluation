import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CodeStatisticsCard from "./CodeStatisticsCard";
import SCCPasteInput from "./SCCPasteInput";
import EffortFormSection from "./EffortFormSection";
import type { SCCReport, EffortMetrics } from "@/types/scc";
import { parseSCCText } from "@/lib/sccParser";

interface ReportFormFieldsProps {
  reportName: string;
  pasteContent: string;
  currentReport: SCCReport;
  effort: {
    estimated: {
      months: number;
      people: number;
      cost: number;
    };
    actual: {
      months: number;
      people: number;
      cost: number;
    };
  };
  onReportNameChange: (name: string) => void;
  onPasteContentChange: (content: string) => void;
  onPasteData: (data: string) => void;
  onCurrentReportChange: (total: SCCReport['total']) => void;
  onEffortChange: (type: 'estimated' | 'actual', field: 'months' | 'people' | 'cost', value: string) => void;
  onClear: () => void;
}

const ReportFormFields = ({
  reportName,
  pasteContent,
  currentReport,
  effort,
  onReportNameChange,
  onPasteContentChange,
  onPasteData,
  onCurrentReportChange,
  onEffortChange,
  onClear
}: ReportFormFieldsProps) => {
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    onPasteContentChange(text);
    
    const { estimates, totalFiles } = parseSCCText(text);
    console.log('Parsed estimates:', estimates);
    
    if (estimates.estimatedMonths) {
      onEffortChange('estimated', 'months', estimates.estimatedMonths.toString());
    }
    
    if (estimates.estimatedPeople) {
      onEffortChange('estimated', 'people', estimates.estimatedPeople.toString());
    }
    
    onPasteData(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Repository Name</label>
        <Input
          value={reportName}
          onChange={(e) => onReportNameChange(e.target.value)}
          placeholder="Enter repository name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">SCC Report Data</label>
        <textarea
          className="w-full h-32 p-2 border rounded-md font-mono text-sm"
          placeholder="Paste your SCC report text here..."
          value={pasteContent}
          onChange={(e) => onPasteContentChange(e.target.value)}
          onPaste={handlePaste}
        />
      </div>

      <CodeStatisticsCard 
        stats={currentReport.total}
        onChange={(total) => onCurrentReportChange(total)}
      />
      
      <EffortFormSection
        title="Estimated Effort"
        effort={effort.estimated}
        onChange={(field, value) => onEffortChange('estimated', field, value)}
      />
      
      <EffortFormSection
        title="Actual Effort"
        effort={effort.actual}
        onChange={(field, value) => onEffortChange('actual', field, value)}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ReportFormFields;