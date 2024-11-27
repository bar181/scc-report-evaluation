import React, { useState } from "react";
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
  onEffortUpdate?: (id: number, effort: ReportEntry['effort']) => void;
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
              <TableHead>Repository Name</TableHead>
              <TableHead className="text-right">Files</TableHead>
              <TableHead className="text-right">Lines</TableHead>
              <TableHead className="text-right">Est. Cost (USD)</TableHead>
              <TableHead className="text-right">Act. Cost (USD)</TableHead>
              <TableHead className="text-right">Difference (USD)</TableHead>
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
              const difference = estimatedCost - actualCost;

              return (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {report.name}
                    <div className="text-sm text-muted-foreground">
                      Est: {report.effort.estimatedMonths.toFixed(1)}m × {report.effort.estimatedPeople.toFixed(1)}p
                      <br />
                      Act: {report.effort.actualMonths.toFixed(1)}m × {report.effort.actualPeople.toFixed(1)}p
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{report.total.files}</TableCell>
                  <TableCell className="text-right">{report.total.lines}</TableCell>
                  <TableCell className="text-right">
                    ${estimatedCost.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    ${actualCost.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(difference).toLocaleString()}
                    {difference >= 0 ? ' under' : ' over'}
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