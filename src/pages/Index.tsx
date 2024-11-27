import { useState } from "react";
import { Input } from "@/components/ui/input";
import ReportsSection from "@/components/ReportsSection";
import PerformanceMetricsDisplay from "@/components/PerformanceMetricsDisplay";

const Index = () => {
  const [hourlyRate, setHourlyRate] = useState(70);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Monthly Consultant Report
          </h1>
          <h3 className="text-lg text-gray-600 mb-4">
            Track and analyze your consulting team's performance
          </h3>
          
          <div className="max-w-xs mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultant Hourly Rate (USD)
            </label>
            <Input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              min="0"
              className="text-center"
            />
          </div>
        </div>

        <ReportsSection hourlyRate={hourlyRate} />
      </div>
    </div>
  );
};

export default Index;