import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { SCCLanguage } from "@/types/scc";

interface LanguageChartProps {
  languages: SCCLanguage[];
}

const COLORS = ["#8B5CF6", "#7E69AB", "#6E59A5", "#D6BCFA", "#9b87f5"];

const LanguageChart = ({ languages }: LanguageChartProps) => {
  const data = languages
    .sort((a, b) => b.Code - a.Code)
    .map((lang) => ({
      name: lang.Name,
      value: lang.Code,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LanguageChart;