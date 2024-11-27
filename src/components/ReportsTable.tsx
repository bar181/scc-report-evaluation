import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { SCCReport } from "@/types/scc";

interface ReportEntry extends SCCReport {
  id: number;
  name: string;
}

interface ReportsTableProps {
  reports: ReportEntry[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ReportsTable = ({ reports, onEdit, onDelete }: ReportsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository Name</TableHead>
            <TableHead className="text-right">Files</TableHead>
            <TableHead className="text-right">Lines</TableHead>
            <TableHead className="text-right">Code</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right">Blanks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.name}</TableCell>
              <TableCell className="text-right">{report.total.files}</TableCell>
              <TableCell className="text-right">{report.total.lines}</TableCell>
              <TableCell className="text-right">{report.total.code}</TableCell>
              <TableCell className="text-right">{report.total.comments}</TableCell>
              <TableCell className="text-right">{report.total.blanks}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportsTable;