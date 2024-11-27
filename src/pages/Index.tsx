import { useState } from "react";
import { Input } from "@/components/ui/input";
import ReportsSection from "@/components/ReportsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";

const Index = () => {
  const [hourlyRate, setHourlyRate] = useState(70);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Project Report Evaluation
          </h1>
          <h3 className="text-lg text-gray-600 mb-4">
            Track and analyze your consulting team's performance
          </h3>
          
          <Alert className="mb-6 text-left">
            <AlertDescription className="flex items-center gap-2">
              Estimates are prepared using the standard SCC report findings. 
              Visit <a href="https://github.com/boyter/scc/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                SCC Documentation
                <ExternalLink className="h-3 w-3" />
              </a> or install using: <code className="bg-gray-100 px-2 py-1 rounded">go install github.com/boyter/scc/v3@latest</code>
            </AlertDescription>
          </Alert>
          
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