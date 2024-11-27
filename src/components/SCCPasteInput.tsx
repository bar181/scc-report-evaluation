import { Textarea } from "@/components/ui/textarea";

interface SCCPasteInputProps {
  value: string;
  onChange: (value: string) => void;
  onPaste: (data: string) => void;
}

const SCCPasteInput = ({ value, onChange, onPaste }: SCCPasteInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">SCC Report Data</label>
      <Textarea
        className="font-mono text-sm"
        placeholder="Paste your SCC report text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={(e) => onPaste(e.clipboardData.getData("text"))}
      />
    </div>
  );
};

export default SCCPasteInput;