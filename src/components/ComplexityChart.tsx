import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { SCCLanguage } from "@/types/scc";

interface ComplexityChartProps {
  languages: SCCLanguage[];
}

const ComplexityChart = ({ languages }: ComplexityChartProps) => {
  const data = languages
    .sort((a, b) => b.WeightedComplexity - a.WeightedComplexity)
    .map((lang) => ({
      name: lang.Name,
      complexity: lang.WeightedComplexity,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="complexity" fill="#8B5CF6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComplexityChart;