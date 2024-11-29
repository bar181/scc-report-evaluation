import { Input } from "@/components/ui/input";
import type { EffortMetrics } from "@/types/scc";

interface EffortFormSectionProps {
  title: string;
  effort: {
    months: number;
    people: number;
    cost: number;
  };
  onChange: (field: 'months' | 'people' | 'cost', value: string) => void;
}

const EffortFormSection = ({ title, effort, onChange }: EffortFormSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Time (months)</label>
          <Input
            type="number"
            step="0.01"
            value={effort.months}
            onChange={(e) => onChange('months', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">People per month</label>
          <Input
            type="number"
            step="0.01"
            value={effort.people}
            onChange={(e) => onChange('people', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Cost (USD)</label>
          <Input
            type="number"
            value={effort.cost}
            onChange={(e) => onChange('cost', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default EffortFormSection;