import { Input } from "@/components/ui/input";
import type { EffortMetrics } from "@/types/scc";
import EffortInputSection from "./EffortInputSection";

interface EffortInputsSectionProps {
  effort: EffortMetrics;
  estimatedCost: number;
  actualCost: number;
  onEffortChange: (type: 'estimated' | 'actual', field: 'months' | 'people' | 'cost', value: string) => void;
}

const EffortInputsSection = ({ 
  effort, 
  estimatedCost, 
  actualCost, 
  onEffortChange 
}: EffortInputsSectionProps) => {
  return (
    <div className="space-y-4">
      <EffortInputSection
        title="Estimated Effort"
        months={effort.estimatedMonths}
        people={effort.estimatedPeople}
        cost={estimatedCost}
        onChange={(field, value) => onEffortChange('estimated', field, value)}
      />

      <EffortInputSection
        title="Actual Effort"
        months={effort.actualMonths}
        people={effort.actualPeople}
        cost={actualCost}
        onChange={(field, value) => onEffortChange('actual', field, value)}
      />
    </div>
  );
};

export default EffortInputsSection;