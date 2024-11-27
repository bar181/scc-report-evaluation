import { Card } from "@/components/ui/card";
import type { ReportEntry } from "@/types/scc";

interface PerformanceMetricsProps {
  reports: ReportEntry[];
}

const PerformanceMetrics = ({ reports }: PerformanceMetricsProps) => {
  const calculatePerformanceRatio = () => {
    if (reports.length === 0) return 1;

    const ratios = reports.map(report => {
      const estimated = report.effort.estimatedMonths * report.effort.estimatedPeople;
      const actual = report.effort.actualMonths * report.effort.actualPeople;
      return estimated / actual;
    });

    const averageRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    return averageRatio;
  };

  const performanceRatio = calculatePerformanceRatio();
  const percentageDiff = ((performanceRatio - 1) * 100).toFixed(1);
  const isAboveAverage = performanceRatio > 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Average Performance
        </h4>
        <p className="text-2xl font-bold">
          {performanceRatio.toFixed(2)}x
        </p>
        <p className={`text-sm ${isAboveAverage ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(Number(percentageDiff))}% {isAboveAverage ? 'above' : 'below'} average
        </p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Total Estimated Cost
        </h4>
        <p className="text-2xl font-bold">
          ${reports.reduce((sum, report) => 
            sum + (report.effort.estimatedMonths * report.effort.estimatedPeople * 160), 0).toLocaleString()}
        </p>
      </Card>
      <Card className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          Total Actual Cost
        </h4>
        <p className="text-2xl font-bold">
          ${reports.reduce((sum, report) => 
            sum + (report.effort.actualMonths * report.effort.actualPeople * 160), 0).toLocaleString()}
        </p>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;