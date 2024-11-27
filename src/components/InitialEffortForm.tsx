import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { EffortMetrics } from "@/types/scc";

interface InitialEffortFormProps {
  hourlyRate: number;
  onChange: (effort: EffortMetrics) => void;
}

const InitialEffortForm = ({ hourlyRate, onChange }: InitialEffortFormProps) => {
  const [effort, setEffort] = useState<EffortMetrics>({
    estimatedMonths: 3,
    estimatedPeople: 2,
    actualMonths: 4,
    actualPeople: 1.5
  });

  const handleChange = (field: keyof EffortMetrics, value: string) => {
    const newEffort = {
      ...effort,
      [field]: parseFloat(value) || 0
    };
    setEffort(newEffort);
    onChange(newEffort);
  };

  const calculateCost = (months: number, people: number) => {
    return months * people * hourlyRate * 160;
  };

  return (
    <Card className="p-4 space-y-4 mb-4">
      <h3 className="text-lg font-semibold">Initial Effort Estimation</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Est. Months</label>
          <Input
            type="number"
            step="0.1"
            value={effort.estimatedMonths}
            onChange={(e) => handleChange('estimatedMonths', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Est. People</label>
          <Input
            type="number"
            step="0.1"
            value={effort.estimatedPeople}
            onChange={(e) => handleChange('estimatedPeople', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Est. Cost ($)</label>
          <Input
            type="text"
            value={calculateCost(effort.estimatedMonths, effort.estimatedPeople).toLocaleString()}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Act. Months</label>
          <Input
            type="number"
            step="0.1"
            value={effort.actualMonths}
            onChange={(e) => handleChange('actualMonths', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Act. People</label>
          <Input
            type="number"
            step="0.1"
            value={effort.actualPeople}
            onChange={(e) => handleChange('actualPeople', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Act. Cost ($)</label>
          <Input
            type="text"
            value={calculateCost(effort.actualMonths, effort.actualPeople).toLocaleString()}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>
    </Card>
  );
};

export default InitialEffortForm;