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

      {reports.length > 0 && (
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-white">
          <h3 className="text-lg font-semibold mb-4">Summary of All Projects</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-xl font-bold">{reports.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-xl font-bold">
                {reports.reduce((sum, r) => sum + (r.total?.files || 0), 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Lines</p>
              <p className="text-xl font-bold">
                {reports.reduce((sum, r) => sum + (r.total?.lines || 0), 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-xl font-bold">
                ${reports.reduce((sum, r) => 
                  sum + calculateCost(r.effort.actualMonths, r.effort.actualPeople), 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      )}

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