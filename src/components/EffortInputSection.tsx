import { Input } from "@/components/ui/input";
import type { EffortMetrics } from "@/types/scc";

interface EffortInputSectionProps {
  title: string;
  months: number;
  people: number;
  cost: number;
  onChange: (field: 'months' | 'people' | 'cost', value: string) => void;
}

const EffortInputSection = ({ title, months, people, cost, onChange }: EffortInputSectionProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{title}</h3>
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">Time (months)</label>
          <Input
            type="number"
            step="0.1"
            value={months}
            onChange={(e) => onChange('months', e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">People per month</label>
          <Input
            type="number"
            step="0.1"
            value={people}
            onChange={(e) => onChange('people', e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-muted-foreground mb-1">Cost (USD)</label>
          <Input
            type="number"
            value={cost}
            onChange={(e) => onChange('cost', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EffortInputSection;