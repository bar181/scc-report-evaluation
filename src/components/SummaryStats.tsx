import { Card } from "@/components/ui/card";

interface SummaryStatsProps {
  stats: {
    lines: number;
    code: number;
    comments: number;
    blanks: number;
    complexity: number;
    files: number;
  };
}

const SummaryStats = ({ stats }: SummaryStatsProps) => {
  const metrics = [
    { label: "Total Files", value: stats.files },
    { label: "Lines of Code", value: stats.code },
    { label: "Comments", value: stats.comments },
    { label: "Blank Lines", value: stats.blanks },
    { label: "Total Lines", value: stats.lines },
    { label: "Complexity", value: stats.complexity },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-4">
          <div className="text-sm text-gray-500">{metric.label}</div>
          <div className="text-2xl font-bold mt-1">
            {metric.value.toLocaleString()}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryStats;