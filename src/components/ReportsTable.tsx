import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCostVisibility } from "@/contexts/CostVisibilityContext";
import type { ReportEntry } from "@/types/scc";

interface ReportsTableProps {
  reports: ReportEntry[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  hourlyRate: number;
  onAddNew: () => void;
}

const ReportsTable = ({ 
  reports, 
  onEdit, 
  onDelete,
  hourlyRate,
  onAddNew 
}: ReportsTableProps) => {
  const { showActualCosts } = useCostVisibility();

  const calculateCost = (months: number, people: number) => {
    return Math.round(months * people * hourlyRate * 160);
  };

  const calculatePerformance = (estimated: number, actual: number) => {
    return estimated / actual;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-6">
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          if (!report?.total) return null;
          
          const estimatedCost = calculateCost(
            report.effort.estimatedMonths,
            report.effort.estimatedPeople
          );
          const actualCost = calculateCost(
            report.effort.actualMonths,
            report.effort.actualPeople
          );
          const roi = estimatedCost - actualCost;
          const performance = calculatePerformance(
            report.effort.estimatedMonths * report.effort.estimatedPeople,
            report.effort.actualMonths * report.effort.actualPeople
          );

          return (
            <Card key={report.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{report.name}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(report.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(report.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Time Period</p>
                  <p className="font-medium">{report.effort.actualMonths.toFixed(1)} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className="font-medium">{performance.toFixed(2)}x</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Est. Cost</p>
                  <p className="font-medium">${estimatedCost.toLocaleString()}</p>
                </div>
                {showActualCosts && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Act. Cost</p>
                      <p className="font-medium">${actualCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ROI</p>
                      <p className={`font-medium ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(roi).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <p className="font-medium">
                      {report.effort.estimatedPeople.toFixed(1)} → {report.effort.actualPeople.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Lines</p>
                  <p className="font-medium">{report.total.lines.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Files</p>
                  <p className="font-medium">{report.total.files.toLocaleString()}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsTable;