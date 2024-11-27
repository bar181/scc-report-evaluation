import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
      <div className="flex justify-end">
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead className="text-right">Time Period</TableHead>
              <TableHead className="text-right">Performance</TableHead>
              <TableHead className="text-right">Est. Cost (USD)</TableHead>
              <TableHead className="text-right">Act. Cost (USD)</TableHead>
              <TableHead className="text-right">ROI (USD)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {report.effort.actualMonths.toFixed(1)} months
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {performance.toFixed(2)}x
                  </TableCell>
                  <TableCell className="text-right">
                    ${estimatedCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${actualCost.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(roi).toLocaleString()}
                    <br />
                    <span className="text-xs">
                      {roi >= 0 ? 'Under Budget' : 'Over Budget'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsTable;