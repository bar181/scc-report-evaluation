import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ReportEntry } from "@/types/scc";

interface EstimatedCostChartProps {
  reports: ReportEntry[];
}

const EstimatedCostChart = ({ reports }: EstimatedCostChartProps) => {
  const data = reports.map((report) => ({
    name: report.name,
    value: report.effort.estimatedMonths * report.effort.estimatedPeople * 160 * 70, // Using default hourly rate of 70
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ left: 15 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis 
          tickFormatter={(value) => `$${(value).toLocaleString()}`}
          style={{ fontSize: '11px' }}
          width={80}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Estimated Cost']}
        />
        <Bar dataKey="value" fill="#8B5CF6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EstimatedCostChart;