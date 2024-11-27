import { Card } from "@/components/ui/card";

interface SummaryStatsProps {
  stats: {
    lines?: number;
    code?: number;
    comments?: number;
    blanks?: number;
    complexity?: number;
    files?: number;
  };
}

const SummaryStats = ({ stats }: SummaryStatsProps) => {
  // Ensure stats object exists, if not use empty object
  const safeStats = stats || {};

  const metrics = [
    { label: "Total Files", value: safeStats.files ?? 0 },
    { label: "Lines of Code", value: safeStats.code ?? 0 },
    { label: "Comments", value: safeStats.comments ?? 0 },
    { label: "Blank Lines", value: safeStats.blanks ?? 0 },
    { label: "Total Lines", value: safeStats.lines ?? 0 },
    { label: "Complexity", value: safeStats.complexity ?? 0 },
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