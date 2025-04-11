import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { generateUniqueId } from "@/lib/utils/fileUtils";

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  date: Date;
  content?: string;
}

interface DocumentContextType {
  documents: Document[];
  uploadDocuments: (files: File[]) => void;
  deleteDocument: (id: string) => void;
  openFileUpload: () => void;
  uploading: boolean;
  uploadProgress: number;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const mockUploadProgress = () => {
    setUploading(true);
    setUploadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
        }, 500);
      }
      setUploadProgress(progress);
    }, 200);
  };

  const uploadDocuments = async (files: File[]) => {
    mockUploadProgress();
    
    // Process each file to create document objects
    for (const file of files) {
      const fileType = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Create document object
      const newDocument: Document = {
        id: generateUniqueId(),
        name: file.name,
        type: fileType,
        size: file.size,
        date: new Date(),
      };

      // Read text content for searchable content
      if (fileType === 'txt') {
        try {
          const content = await file.text();
          newDocument.content = content;
        } catch (error) {
          console.error('Error reading file text:', error);
        }
      }
      
      // Add to documents list
      setDocuments(prev => [newDocument, ...prev]);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const openFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Create a temporary file input if not available
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = '.pdf,.docx,.txt,.pptx';
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          uploadDocuments(Array.from(files));
        }
      };
      input.click();
    }
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        uploadDocuments,
        deleteDocument,
        openFileUpload,
        uploading,
        uploadProgress
      }}
    >
      {children}
      {/* Hidden file input for global upload functionality */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            uploadDocuments(Array.from(e.target.files));
            e.target.value = ''; // Reset for re-upload
          }
        }}
        style={{ display: 'none' }}
        multiple
        accept=".pdf,.docx,.txt,.pptx"
      />
    </DocumentContext.Provider>
  );
};
