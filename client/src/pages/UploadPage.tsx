import { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import DocumentCard from "@/components/DocumentCard";
import Dropzone from "@/components/Dropzone";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const UploadPage = () => {
  const { documents, deleteDocument, uploadProgress, uploading } = useDocuments();
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  
  const filteredDocuments = documents.filter(doc => 
    fileTypeFilter === "all" || doc.type === fileTypeFilter
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
        <p className="text-muted-foreground">Supports PDF, DOCX, TXT, and PPTX formats</p>
      </div>
      
      {/* Dropzone */}
      <Dropzone className="mb-8" />
      
      {/* Upload Progress */}
      {uploading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">Uploading files...</p>
            <p className="text-sm text-primary">{uploadProgress}%</p>
          </div>
          <Progress value={uploadProgress} className="h-1 w-full bg-gray-700" />
        </div>
      )}
      
      {/* Uploaded Documents List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Your Documents</h3>
          <div className="flex gap-2">
            <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="pptx">PPTX</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No documents uploaded yet.</p>
          </div>
        ) : (
          filteredDocuments.map(document => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={deleteDocument}
              onDownload={(id) => console.log("Download", id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default UploadPage;
