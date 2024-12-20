import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ReportsTable from "./ReportsTable";
import ReportModal from "./ReportModal";
import PerformanceMetricsDisplay from "./PerformanceMetricsDisplay";
import type { ReportEntry, SCCReport, EffortMetrics } from "@/types/scc";

interface ReportsSectionProps {
  hourlyRate: number;
}

const ReportsSection = ({ hourlyRate }: ReportsSectionProps) => {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportEntry | null>(null);
  const { toast } = useToast();

  const generateReportName = () => {
    const repoNumber = reports.length + 1;
    return `Repo ${repoNumber}`;
  };

  const handleSaveReport = (name: string, report: SCCReport, effort: EffortMetrics) => {
    const reportName = name.trim() || generateReportName();
    const newReport: ReportEntry = {
      ...report,
      id: editingReport?.id || Date.now(),
      name: reportName,
      effort
    };

    if (editingReport) {
      setReports(prev => prev.map(r => r.id === editingReport.id ? newReport : r));
      setEditingReport(null);
    } else {
      setReports(prev => [...prev, newReport]);
    }

    toast({
      title: editingReport ? "Report updated" : "Report saved",
      description: `Report "${reportName}" has been ${editingReport ? 'updated' : 'saved'} successfully`,
    });
  };

  const handleEdit = (id: number) => {
    const report = reports.find(r => r.id === id);
    if (report) {
      setEditingReport(report);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Report deleted",
      description: "The report has been removed successfully",
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  return (
    <>
      <PerformanceMetricsDisplay reports={reports} hourlyRate={hourlyRate} />
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Upload your SCC report here</h2>
        <ReportsTable
          reports={reports}
          onEdit={handleEdit}
          onDelete={handleDelete}
          hourlyRate={hourlyRate}
          onAddNew={() => setIsModalOpen(true)}
        />
      </div>
      <ReportModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSave={handleSaveReport}
        initialReport={editingReport || undefined}
        initialName={editingReport?.name || generateReportName()}
        initialEffort={editingReport?.effort}
      />
    </>
  );
};

export default ReportsSection;