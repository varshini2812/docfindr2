import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  File 
} from "lucide-react";

interface FileIconProps {
  fileType: string;
  className?: string;
}

export const FileIcon = ({ fileType, className }: FileIconProps) => {
  const type = fileType.toLowerCase();

  if (type === 'pdf') {
    return <FileText className={className} />;
  } else if (type === 'docx' || type === 'doc' || type === 'txt') {
    return <FileText className={className} />;
  } else if (type === 'xlsx' || type === 'xls' || type === 'csv') {
    return <FileSpreadsheet className={className} />;
  } else if (type === 'pptx' || type === 'ppt') {
    return <File className={className} />;
  } else if (type.match(/^(jpg|jpeg|png|gif|bmp|svg)$/)) {
    return <FileImage className={className} />;
  } else {
    return <FileText className={className} />;
  }
};
