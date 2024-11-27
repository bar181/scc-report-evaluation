import { Card } from "@/components/ui/card";
import type { ReportEntry } from "@/types/scc";

interface PerformanceMetricsDisplayProps {
  reports: ReportEntry[];
  hourlyRate: number;
}

const PerformanceMetricsDisplay = ({ reports, hourlyRate }: PerformanceMetricsDisplayProps) => {
  const calculateMetrics = () => {
    if (reports.length === 0) return {
      performanceRatio: 1,
      totalROI: 0,
      averagePerformance: 0,
      estimatedCost: 0,
      actualCost: 0
    };

    let totalEstimatedEffort = 0;
    let totalActualEffort = 0;
    let totalEstimatedCost = 0;
    let totalActualCost = 0;

    reports.forEach(report => {
      const estimatedEffort = report.effort.estimatedMonths * report.effort.estimatedPeople;
      const actualEffort = report.effort.actualMonths * report.effort.actualPeople;
      
      totalEstimatedEffort += estimatedEffort;
      totalActualEffort += actualEffort;
      
      totalEstimatedCost += estimatedEffort * hourlyRate * 160;
      totalActualCost += actualEffort * hourlyRate * 160;
    });

    const performanceRatio = totalEstimatedEffort / totalActualEffort;
    const roi = totalEstimatedCost - totalActualCost;
    const averagePerformance = totalActualEffort / reports.length;

    return {
      performanceRatio,
      totalROI: roi,
      averagePerformance,
      estimatedCost: totalEstimatedCost,
      actualCost: totalActualCost
    };
  };

  const metrics = calculateMetrics();
  const isPositiveROI = metrics.totalROI >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-50 to-white">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Performance Ratio</h3>
        <p className="text-4xl font-bold text-primary">
          {metrics.performanceRatio.toFixed(1)}x
        </p>
        <p className="text-sm text-gray-500 mt-2">Estimated vs Actual Time</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-50 to-white">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Return on Investment</h3>
        <p className={`text-4xl font-bold ${isPositiveROI ? 'text-green-600' : 'text-red-600'}`}>
          ${Math.abs(Math.round(metrics.totalROI)).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-2">{isPositiveROI ? 'Under Budget' : 'Over Budget'}</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-50 to-white">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Avg Performance</h3>
        <p className="text-4xl font-bold text-primary">
          {metrics.averagePerformance.toFixed(1)}
        </p>
        <p className="text-sm text-gray-500 mt-2">Person-Months per Project</p>
      </Card>

      <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-br from-purple-50 to-white">
        <h3 className="text-lg font-medium text-gray-600 mb-2">Total Cost</h3>
        <p className="text-4xl font-bold text-primary">
          ${Math.round(metrics.actualCost).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-2">Actual Spend</p>
      </Card>
    </div>
  );
};

export default PerformanceMetricsDisplay;