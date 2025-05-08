import React, { useState, useEffect } from 'react';
import { FileItem, FileVersion } from './FilelockDriveApp';

interface DocumentPreviewProps {
  document: FileItem | null;
  selectedVersion?: FileVersion | null;
  isLoading?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  document, 
  selectedVersion,
  isLoading = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!document) return;

    // In a real app, this would generate a preview URL
    // For demo purposes, we'll simulate a preview URL
    setPreviewUrl(`https://via.placeholder.com/800x1000?text=${encodeURIComponent(document.name)}`);
    
    // Simulate any potential errors
    if (document.name.includes("error")) {
      setError("Preview generation failed");
      setPreviewUrl(null);
    } else {
      setError(null);
    }
  }, [document, selectedVersion]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Preview Error</h3>
        <p className="mt-1 text-gray-500">{error}</p>
      </div>
    );
  }

  if (!document || !previewUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No document selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-4 flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl bg-white shadow-md">
          {document.type === 'pdf' ? (
            <iframe 
              src={previewUrl} 
              className="w-full h-screen" 
              title={document.name}
            />
          ) : (
            <img 
              src={previewUrl} 
              alt={document.name} 
              className="w-full h-auto" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview; 