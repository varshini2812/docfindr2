/**
 * Generates a unique ID for documents
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
};

/**
 * Get file type from filename
 */
export const getFileType = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file type is supported
 */
export const isSupportedFileType = (fileType: string): boolean => {
  const supportedTypes = ['pdf', 'docx', 'txt', 'pptx'];
  return supportedTypes.includes(fileType.toLowerCase());
};

/**
 * Extract plain text content from file (mock implementation)
 * In a real-world scenario, this would use appropriate libraries
 * to extract text from different file types
 */
export const extractTextContent = async (file: File): Promise<string | null> => {
  const fileType = getFileType(file.name);
  
  // For plain text files, read directly
  if (fileType === 'txt') {
    try {
      return await file.text();
    } catch (error) {
      console.error('Error reading text file:', error);
      return null;
    }
  }
  
  // For other file types, we would use appropriate libraries in a real implementation
  // This is a mock implementation that returns placeholder content
  return `Mock extracted content from ${file.name}. This would contain the actual text content extracted from the document using appropriate parsing libraries in a real implementation.`;
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};
