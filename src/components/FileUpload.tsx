import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
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
        accept=".json"
        className="hidden"
      />
      <div className="text-lg">
        Drop your SCC report JSON here or click to browse
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Only JSON files exported from SCC are supported
      </p>
    </Card>
  );
};

export default FileUpload;