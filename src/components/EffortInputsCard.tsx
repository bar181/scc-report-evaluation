import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { EffortMetrics } from "@/types/scc";

interface EffortInputsCardProps {
  effort: EffortMetrics;
  onChange: (effort: EffortMetrics) => void;
}

const EffortInputsCard = ({ effort, onChange }: EffortInputsCardProps) => {
  const handleChange = (field: keyof EffortMetrics, value: string) => {
    onChange({
      ...effort,
      [field]: parseFloat(value) || 0
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Estimated Effort</h3>
        <div className="flex gap-4">
          <Input
            type="number"
            step="0.1"
            value={effort.estimatedMonths}
            onChange={(e) => handleChange('estimatedMonths', e.target.value)}
            placeholder="Months"
          />
          <Input
            type="number"
            step="0.1"
            value={effort.estimatedPeople}
            onChange={(e) => handleChange('estimatedPeople', e.target.value)}
            placeholder="People"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Actual Effort</h3>
        <div className="flex gap-4">
          <Input
            type="number"
            step="0.1"
            value={effort.actualMonths}
            onChange={(e) => handleChange('actualMonths', e.target.value)}
            placeholder="Months"
          />
          <Input
            type="number"
            step="0.1"
            value={effort.actualPeople}
            onChange={(e) => handleChange('actualPeople', e.target.value)}
            placeholder="People"
          />
        </div>
      </div>
    </Card>
  );
};

export default EffortInputsCard;