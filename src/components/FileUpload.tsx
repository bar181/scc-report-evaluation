import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";
import { parseSCCText } from "@/lib/sccParser";

interface FileUploadProps {
  onUpload: (file: File) => void;
  onPaste: (data: string) => void;
}

const FileUpload = ({ onUpload, onPaste }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pasteContent, setPasteContent] = useState("");

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
    onPaste(text);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "bg-primary/10" : "bg-white"
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
        <p className="text-sm text-gray-500 mt-2">
          Supports both JSON and text format SCC reports
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-gray-500 mb-2">
          Or paste your SCC report text here:
        </p>
        <textarea
          className="w-full h-32 p-2 border rounded-md font-mono text-sm"
          placeholder="Paste your SCC report text here..."
          value={pasteContent}
          onChange={(e) => setPasteContent(e.target.value)}
          onPaste={handlePaste}
        />
      </Card>
    </div>
  );
};

export default FileUpload;