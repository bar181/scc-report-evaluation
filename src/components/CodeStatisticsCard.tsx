import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface CodeStats {
  files: number;
  lines: number;
  blanks: number;
  comments: number;
  code: number;
  complexity: number;
}

interface CodeStatisticsCardProps {
  stats: CodeStats;
  onChange: (stats: CodeStats) => void;
}

const CodeStatisticsCard = ({ stats, onChange }: CodeStatisticsCardProps) => {
  const handleChange = (field: keyof CodeStats, value: string) => {
    onChange({
      ...stats,
      [field]: parseInt(value) || 0
    });
  };

  const fields = [
    { key: 'files', label: 'Files' },
    { key: 'lines', label: 'Lines' },
    { key: 'blanks', label: 'Blanks' },
    { key: 'comments', label: 'Comments' },
    { key: 'code', label: 'Code' },
    { key: 'complexity', label: 'Complexity' }
  ] as const;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium mb-3">Code Statistics</h3>
      <div className="grid grid-cols-6 gap-4 text-sm">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <div className="text-muted-foreground">{label}</div>
            <Input
              type="number"
              min="0"
              value={stats[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="mt-1"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CodeStatisticsCard;