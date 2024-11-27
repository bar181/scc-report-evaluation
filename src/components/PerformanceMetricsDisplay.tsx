import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeOff } from "lucide-react";
import type { ReportEntry } from "@/types/scc";
import { useCostVisibility } from "@/contexts/CostVisibilityContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetricsDisplayProps {
  reports: ReportEntry[];
  hourlyRate: number;
}

const PerformanceMetricsDisplay = ({ reports, hourlyRate }: PerformanceMetricsDisplayProps) => {
  const { showActualCosts, toggleActualCosts } = useCostVisibility();

  const calculateMetrics = () => {
    if (reports.length === 0) return {
      performanceRatio: 1,
      totalROI: 0,
      averagePerformance: 0,
      estimatedCost: 0,
      actualCost: 0,
      totalMonths: 0,
      totalLines: 0,
      totalFiles: 0,
      estimatedPerformance: 0
    };

    let totalEstimatedEffort = 0;
    let totalActualEffort = 0;
    let totalEstimatedCost = 0;
    let totalActualCost = 0;
    let totalMonths = 0;
    let totalLines = 0;
    let totalFiles = 0;
    let estimatedPerformance = 0;

    reports.forEach(report => {
      const estimatedEffort = report.effort.estimatedMonths * report.effort.estimatedPeople;
      const actualEffort = report.effort.actualMonths * report.effort.actualPeople;
      
      totalEstimatedEffort += estimatedEffort;
      totalActualEffort += actualEffort;
      totalMonths += report.effort.actualMonths;
      estimatedPerformance += report.effort.estimatedMonths * report.effort.estimatedPeople;
      
      totalEstimatedCost += estimatedEffort * hourlyRate * 160;
      totalActualCost += actualEffort * hourlyRate * 160;

      if (report.total) {
        totalLines += report.total.lines;
        totalFiles += report.total.files;
      }
    });

    const performanceRatio = totalEstimatedEffort / totalActualEffort;
    const roi = totalEstimatedCost - totalActualCost;
    const averagePerformance = totalActualEffort / reports.length;

    return {
      performanceRatio,
      totalROI: roi,
      averagePerformance,
      estimatedCost: totalEstimatedCost,
      actualCost: totalActualCost,
      totalMonths,
      totalLines,
      totalFiles,
      estimatedPerformance
    };
  };

  const metrics = calculateMetrics();

  // Prepare performance trend data
  const performanceTrendData = reports.map((report, index) => {
    const estimatedEffort = report.effort.estimatedMonths * report.effort.estimatedPeople;
    const actualEffort = report.effort.actualMonths * report.effort.actualPeople;
    const performance = estimatedEffort / actualEffort;
    
    return {
      name: report.name,
      performance: Number(performance.toFixed(2)),
      estimatedEffort: Number(estimatedEffort.toFixed(2)),
      actualEffort: showActualCosts ? Number(actualEffort.toFixed(2)) : null
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Statistics</h2>
        <Toggle 
          pressed={showActualCosts} 
          onPressedChange={toggleActualCosts}
          className="data-[state=on]:bg-primary"
        >
          {showActualCosts ? (
            <Eye className="h-4 w-4 mr-2" />
          ) : (
            <EyeOff className="h-4 w-4 mr-2" />
          )}
          {showActualCosts ? "Hide Actual Costs" : "Show Actual Costs"}
        </Toggle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Performance Ratio
          </h4>
          <p className="text-2xl font-bold text-primary">
            {metrics.performanceRatio.toFixed(1)}x
          </p>
          <p className="text-sm text-muted-foreground">
            Estimated vs Actual Time
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            {showActualCosts ? "Return on Investment" : "Estimated Value"}
          </h4>
          <p className="text-2xl font-bold text-green-600">
            ${showActualCosts 
              ? Math.abs(metrics.totalROI).toLocaleString()
              : metrics.estimatedCost.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {showActualCosts ? (metrics.totalROI >= 0 ? "Under Budget" : "Over Budget") : "Total Estimated Cost"}
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            Avg Performance
          </h4>
          <p className="text-2xl font-bold text-primary">
            {metrics.averagePerformance.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">
            Person-Months per Project
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">
            {showActualCosts ? "Total Cost" : "Estimated Performance"}
          </h4>
          <p className="text-2xl font-bold text-primary">
            {showActualCosts 
              ? `$${metrics.actualCost.toLocaleString()}`
              : `${metrics.estimatedPerformance.toFixed(1)}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {showActualCosts ? "Actual Spend" : "Est. Person-Months"}
          </p>
        </Card>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          There {reports.length === 1 ? 'was' : 'were'} {reports.length} project{reports.length === 1 ? '' : 's'} completed 
          over a period of {metrics.totalMonths.toFixed(1)} months. 
          {metrics.totalLines.toLocaleString()} lines of code were created in {metrics.totalFiles.toLocaleString()} files. 
          The estimated value is ${metrics.estimatedCost.toLocaleString()}.
        </h3>
      </div>

      {reports.length > 0 && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-bold">Performance Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#8B5CF6" 
                  name="Performance Ratio"
                />
                <Line 
                  type="monotone" 
                  dataKey="estimatedEffort" 
                  stroke="#10B981" 
                  name="Estimated Effort"
                />
                {showActualCosts && (
                  <Line 
                    type="monotone" 
                    dataKey="actualEffort" 
                    stroke="#EF4444" 
                    name="Actual Effort"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsDisplay;