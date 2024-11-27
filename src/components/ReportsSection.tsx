import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ReportsTable from "./ReportsTable";
import ReportModal from "./ReportModal";
import type { ReportEntry, SCCReport, EffortMetrics } from "@/types/scc";

interface ReportsSectionProps {
  hourlyRate: number;
}

const ReportsSection = ({ hourlyRate }: ReportsSectionProps) => {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ReportEntry | null>(null);
  const { toast } = useToast();

  const handleSaveReport = (name: string, report: SCCReport, effort: EffortMetrics) => {
    const newReport: ReportEntry = {
      ...report,
      id: editingReport?.id || Date.now(),
      name,
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
      description: `Report "${name}" has been ${editingReport ? 'updated' : 'saved'} successfully`,
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

  const handleEffortUpdate = (id: number, effort: ReportEntry['effort']) => {
    setReports(prev => prev.map(report => 
      report.id === id ? { ...report, effort } : report
    ));
    
    toast({
      title: "Effort updated",
      description: "The effort metrics have been updated successfully",
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingReport(null);
  };

  return (
    <>
      <ReportsTable
        reports={reports}
        onEdit={handleEdit}
        onDelete={handleDelete}
        hourlyRate={hourlyRate}
        onEffortUpdate={handleEffortUpdate}
        onAddNew={() => setIsModalOpen(true)}
      />
      <ReportModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSave={handleSaveReport}
        initialReport={editingReport || undefined}
        initialName={editingReport?.name}
        initialEffort={editingReport?.effort}
      />
    </>
  );
};

export default ReportsSection;