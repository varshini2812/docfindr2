import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/ui/file-icon";
import { Download, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  date: Date;
  content?: string;
  relevance?: number; // For search results
  matchedText?: string; // For search highlighting
}

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  isSearchResult?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

const DocumentCard = ({ 
  document, 
  onDelete, 
  onView, 
  onDownload,
  isSearchResult = false 
}: DocumentCardProps) => {
  const { id, name, type, size, date, relevance, matchedText } = document;
  
  return (
    <div className="rounded-lg bg-gray-800 p-4 flex items-start mb-3 transition-all hover:bg-opacity-80">
      <div className="flex-shrink-0 p-2 mr-3 bg-primary bg-opacity-10 rounded-md">
        <FileIcon fileType={type} className="h-8 w-8 text-primary" />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-muted-foreground">
              {type.toUpperCase()} • {formatFileSize(size)} • Uploaded {formatDistanceToNow(date, { addSuffix: true })}
            </p>
            
            {isSearchResult && matchedText && (
              <p className="text-sm mt-1 line-clamp-2" 
                dangerouslySetInnerHTML={{ __html: matchedText }} 
              />
            )}
            
            {isSearchResult && relevance !== undefined && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      relevance > 90 ? "bg-green-500 w-12" :
                      relevance > 70 ? "bg-yellow-500 w-8" :
                      "bg-orange-500 w-6"
                    )}
                  />
                  <span className="text-xs text-muted-foreground">{relevance}% match</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(id)}
                className="text-muted-foreground hover:text-foreground rounded-full"
              >
                <Eye className="h-5 w-5" />
              </Button>
            )}
            
            {onDownload && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDownload(id)}
                className="text-muted-foreground hover:text-foreground rounded-full"
              >
                <Download className="h-5 w-5" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(id)}
                className="text-muted-foreground hover:text-foreground rounded-full"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
