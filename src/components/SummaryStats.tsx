import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SummaryStatsProps {
  stats: {
    lines?: number;
    code?: number;
    comments?: number;
    blanks?: number;
    complexity?: number;
    files?: number;
  };
  onStatsChange?: (newStats: any) => void;
}

const SummaryStats = ({ stats, onStatsChange }: SummaryStatsProps) => {
  const [editableStats, setEditableStats] = useState(stats);

  useEffect(() => {
    setEditableStats(stats);
  }, [stats]);

  const handleStatChange = (key: string, value: string) => {
    const newStats = {
      ...editableStats,
      [key]: parseInt(value) || 0
    };
    setEditableStats(newStats);
    onStatsChange?.(newStats);
  };

  const metrics = [
    { key: "files", label: "Total Files", value: editableStats?.files ?? 0 },
    { key: "code", label: "Lines of Code", value: editableStats?.code ?? 0 },
    { key: "comments", label: "Comments", value: editableStats?.comments ?? 0 },
    { key: "blanks", label: "Blank Lines", value: editableStats?.blanks ?? 0 },
    { key: "lines", label: "Total Lines", value: editableStats?.lines ?? 0 },
    { key: "complexity", label: "Complexity", value: editableStats?.complexity ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map(({ key, label, value }) => (
        <Card key={key} className="p-4">
          <div className="text-sm text-muted-foreground">{label}</div>
          <Input
            type="number"
            value={value}
            onChange={(e) => handleStatChange(key, e.target.value)}
            min="0"
            className="mt-1"
          />
        </Card>
      ))}
    </div>
  );
};

export default SummaryStats;