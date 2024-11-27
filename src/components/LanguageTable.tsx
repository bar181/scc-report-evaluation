import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SCCLanguage } from "@/types/scc";

interface LanguageTableProps {
  languages: SCCLanguage[];
}

const LanguageTable = ({ languages }: LanguageTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Language</TableHead>
            <TableHead className="text-right">Files</TableHead>
            <TableHead className="text-right">Lines</TableHead>
            <TableHead className="text-right">Code</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right">Blanks</TableHead>
            <TableHead className="text-right">Complexity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {languages.map((lang) => (
            <TableRow key={lang.Name}>
              <TableCell className="font-medium">{lang.Name}</TableCell>
              <TableCell className="text-right">{lang.Count}</TableCell>
              <TableCell className="text-right">{lang.Lines}</TableCell>
              <TableCell className="text-right">{lang.Code}</TableCell>
              <TableCell className="text-right">{lang.Comments}</TableCell>
              <TableCell className="text-right">{lang.Blanks}</TableCell>
              <TableCell className="text-right">{lang.Complexity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LanguageTable;