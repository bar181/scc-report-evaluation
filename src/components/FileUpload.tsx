import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { parseSCCText } from "@/lib/sccParser";

interface FileUploadProps {
  onUpload: (file: File) => void;
  onPaste: (data: string) => void;
  onManualEntry: (data: any) => void;
}

const FileUpload = ({ onUpload, onPaste, onManualEntry }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteContent, setPasteContent] = useState("");
  const [manualEntry, setManualEntry] = useState({
    files: 0,
    code: 0,
    comments: 0,
    blanks: 0,
    lines: 0,
    complexity: 0,
    estimatedMonths: 0,
    estimatedPeople: 0
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onUpload(files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    setPasteContent(text);
    const { estimates, totalFiles } = parseSCCText(text);
    
    // Update manual entry with the total files count
    setManualEntry(prev => ({
      ...prev,
      files: totalFiles || 0,
      estimatedMonths: estimates.estimatedMonths || 0,
      estimatedPeople: estimates.estimatedPeople || 0
    }));
    
    onPaste(text);
  };

  const handleManualChange = (field: string, value: string) => {
    setManualEntry(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <Tabs defaultValue="paste" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="paste">Copy/Paste</TabsTrigger>
        <TabsTrigger value="upload">File Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>

      <TabsContent value="paste">
        <Card className="p-4">
          <textarea
            className="w-full h-32 p-2 border rounded-md font-mono text-sm"
            placeholder="Paste your SCC report text here..."
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            onPaste={handlePaste}
          />
        </Card>
      </TabsContent>

      <TabsContent value="upload">
        <Card
          className={`p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "bg-primary/10" : "bg-background"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".json,.txt"
            className="hidden"
          />
          <div className="text-lg">
            Drop your SCC report here or click to browse
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Supports both JSON and text format SCC reports
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="manual">
        <Card className="p-4 space-y-4">
          {Object.entries({
            files: "Total Files",
            code: "Lines of Code",
            comments: "Comments",
            blanks: "Blank Lines",
            lines: "Total Lines",
            complexity: "Complexity",
            estimatedMonths: "Estimated Months",
            estimatedPeople: "Estimated People"
          }).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              <Input
                type="number"
                value={manualEntry[key as keyof typeof manualEntry]}
                onChange={(e) => handleManualChange(key, e.target.value)}
                min="0"
                step={key.includes('estimated') ? '0.1' : '1'}
              />
            </div>
          ))}
          <Button onClick={() => onManualEntry(manualEntry)} className="w-full">
            Submit
          </Button>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FileUpload;