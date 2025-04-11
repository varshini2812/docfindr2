import { useRef, useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DropzoneProps {
  className?: string;
}

const Dropzone = ({ className }: DropzoneProps) => {
  const { uploadDocuments } = useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFiles = (files: File[]): File[] => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    const validExtensions = [".pdf", ".docx", ".txt", ".pptx"];
    
    const validFiles = files.filter(file => {
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const isValidType = validTypes.includes(file.type) || validExtensions.includes(fileExtension);
      
      if (!isValidType) {
        toast({
          variant: "destructive",
          title: "Invalid file format",
          description: `${file.name} is not a supported file type. Please use PDF, DOCX, TXT, or PPTX.`
        });
      }
      
      return isValidType;
    });
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);
    
    if (validFiles.length > 0) {
      uploadDocuments(validFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = validateFiles(selectedFiles);
      
      if (validFiles.length > 0) {
        uploadDocuments(validFiles);
      }
      
      // Reset file input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed border-gray-500 rounded-lg p-6 text-center cursor-pointer transition-all",
        isDragging && "border-primary bg-primary bg-opacity-10",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="font-medium mb-1">Drag & drop files here</p>
      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
      <Button>
        Select Files
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
        accept=".pdf,.docx,.txt,.pptx"
      />
    </div>
  );
};

export default Dropzone;
