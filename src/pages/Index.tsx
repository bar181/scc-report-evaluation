import { useState } from "react";
import { Input } from "@/components/ui/input";
import ReportsSection from "@/components/ReportsSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Pencil, X } from "lucide-react";
import Footer from "@/components/Footer";

const Index = () => {
  const [hourlyRate, setHourlyRate] = useState(70);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState("Project Report Evaluation");

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {isEditingTitle ? (
              <>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="max-w-xs text-4xl font-bold text-center"
                />
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900">
                  {title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Pencil className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Created by{" "}
            <a
              href="https://www.linkedin.com/in/bradaross/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 underline inline-flex items-center gap-1"
            >
              Bradley Ross
              <ExternalLink className="h-4 w-4" />
            </a>
          </p>
          
          <div className="max-w-xs mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Standard industry rate per hour ($USD)
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
        <Footer />
      </div>
    </div>
  );
};

export default Index;