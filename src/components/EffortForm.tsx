import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EffortMetrics } from "@/types/scc";

interface EffortFormProps {
  effort: EffortMetrics;
  hourlyRate: number;
  onSave: (effort: EffortMetrics) => void;
  onCancel: () => void;
}

const EffortForm = ({ effort, hourlyRate, onSave, onCancel }: EffortFormProps) => {
  const [formData, setFormData] = useState(effort);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [actualCost, setActualCost] = useState(0);

  useEffect(() => {
    const calculateCost = (months: number, people: number) => {
      return months * people * hourlyRate * 160;
    };

    setEstimatedCost(calculateCost(formData.estimatedMonths, formData.estimatedPeople));
    setActualCost(calculateCost(formData.actualMonths, formData.actualPeople));
  }, [formData, hourlyRate]);

  const handleChange = (field: keyof EffortMetrics, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Est. Months</label>
          <Input
            type="number"
            step="0.1"
            value={formData.estimatedMonths}
            onChange={(e) => handleChange('estimatedMonths', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Est. People</label>
          <Input
            type="number"
            step="0.1"
            value={formData.estimatedPeople}
            onChange={(e) => handleChange('estimatedPeople', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Est. Cost ($)</label>
          <Input
            type="text"
            value={estimatedCost.toLocaleString()}
            readOnly
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Act. Months</label>
          <Input
            type="number"
            step="0.1"
            value={formData.actualMonths}
            onChange={(e) => handleChange('actualMonths', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Act. People</label>
          <Input
            type="number"
            step="0.1"
            value={formData.actualPeople}
            onChange={(e) => handleChange('actualPeople', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Act. Cost ($)</label>
          <Input
            type="text"
            value={actualCost.toLocaleString()}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(formData)}>Save</Button>
      </div>
    </Card>
  );
};

export default EffortForm;