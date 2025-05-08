import React, { useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: any[]) => void;
  documentType: string;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  multipleFiles?: boolean;
}

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  errorMessage?: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  documentType,
  acceptedFileTypes = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
  maxFileSize = 10, // Default 10MB
  multipleFiles = true
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)'
  }) as any; // Type assertion to any to avoid type conflicts with react-spring

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    
    const newFiles = Array.from(fileList).map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    processFiles(newFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).map(file => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setFiles(prev => [...prev, ...droppedFiles]);
    processFiles(droppedFiles);
  };

  const processFiles = (filesToProcess: UploadFile[]) => {
    filesToProcess.forEach((fileObj, index) => {
      const file = fileObj.file;
      
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setFiles(prev => {
          const updated = [...prev];
          const fileIndex = prev.findIndex(f => f.file === file);
          if (fileIndex >= 0) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: 'error',
              errorMessage: `File exceeds maximum size of ${maxFileSize}MB`
            };
          }
          return updated;
        });
        return;
      }
      
      // Validate file type
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const acceptedTypes = acceptedFileTypes.split(',');
      
      if (!acceptedTypes.includes(fileExt) && !acceptedTypes.includes('*')) {
        setFiles(prev => {
          const updated = [...prev];
          const fileIndex = prev.findIndex(f => f.file === file);
          if (fileIndex >= 0) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              status: 'error',
              errorMessage: `File type ${fileExt} is not supported`
            };
          }
          return updated;
        });
        return;
      }
      
      // Start upload simulation
      setFiles(prev => {
        const updated = [...prev];
        const fileIndex = prev.findIndex(f => f.file === file);
        if (fileIndex >= 0) {
          updated[fileIndex] = {
            ...updated[fileIndex],
            status: 'uploading'
          };
        }
        return updated;
      });
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => {
          const updated = [...prev];
          const fileIndex = prev.findIndex(f => f.file === file);
          
          if (fileIndex >= 0) {
            const currentProgress = updated[fileIndex].progress;
            const newProgress = Math.min(currentProgress + 10, 100);
            
            updated[fileIndex] = {
              ...updated[fileIndex],
              progress: newProgress,
              status: newProgress === 100 ? 'processing' : 'uploading'
            };
            
            // If upload is complete, clear the interval
            if (newProgress === 100) {
              clearInterval(progressInterval);
              
              // Simulate processing delay
              setTimeout(() => {
                setFiles(prev => {
                  const finalUpdated = [...prev];
                  const finalFileIndex = finalUpdated.findIndex(f => f.file === file);
                  
                  if (finalFileIndex >= 0) {
                    finalUpdated[finalFileIndex] = {
                      ...finalUpdated[finalFileIndex],
                      status: 'complete'
                    };
                  }
                  
                  return finalUpdated;
                });
                
                // Check if all files are processed
                checkAllFilesProcessed();
              }, 1500);
            }
          }
          
          return updated;
        });
      }, 300);
    });
  };

  const checkAllFilesProcessed = () => {
    const allComplete = files.every(file => file.status === 'complete' || file.status === 'error');
    if (allComplete) {
      // If all files are processed, notify parent component
      const successfulFiles = files.filter(file => file.status === 'complete');
      if (successfulFiles.length > 0) {
        onUploadComplete(successfulFiles.map(file => ({
          name: file.file.name,
          size: file.file.size,
          type: file.file.type,
          lastModified: file.file.lastModified
        })));
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="h-5 w-5 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        style={{
          opacity: modalAnimation.opacity.toString(),
          transform: modalAnimation.transform.toString()
        }}
        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Upload {documentType}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* File upload drop zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
              isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="mt-2 text-sm font-medium text-gray-600">
              Drag and drop files here, or click to browse
            </p>
            
            <p className="mt-1 text-xs text-gray-500">
              Supports {acceptedFileTypes.replace(/\./g, '')} (Max {maxFileSize}MB)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              multiple={multipleFiles}
              onChange={handleFileSelect}
            />
          </div>
          
          {/* File list */}
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Files ({files.length})</h4>
              <ul className="border rounded-md divide-y">
                {files.map((file, index) => (
                  <li key={index} className="p-3 flex items-center">
                    {/* File type icon */}
                    <div className="mr-3">
                      {getStatusIcon(file.status)}
                    </div>
                    
                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      
                      {/* Progress bar */}
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className={`h-1.5 rounded-full ${file.status === 'processing' ? 'bg-blue-500' : 'bg-primary-500'}`} 
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {/* Error message */}
                      {file.status === 'error' && file.errorMessage && (
                        <p className="text-xs text-red-500 mt-1">
                          {file.errorMessage}
                        </p>
                      )}
                    </div>
                    
                    {/* Status */}
                    <div className={`ml-3 text-xs font-medium ${getStatusColor(file.status)}`}>
                      {file.status === 'uploading' && `${file.progress}%`}
                      {file.status === 'processing' && 'Processing'}
                      {file.status === 'complete' && 'Complete'}
                      {file.status === 'error' && 'Failed'}
                      {file.status === 'pending' && 'Pending'}
                    </div>
                    
                    {/* Remove button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="ml-3 text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            onClick={() => {
              const successfulFiles = files.filter(file => file.status === 'complete');
              if (successfulFiles.length > 0) {
                onUploadComplete(successfulFiles.map(file => ({
                  name: file.file.name,
                  size: file.file.size,
                  type: file.file.type,
                  lastModified: file.file.lastModified
                })));
                onClose();
              }
            }}
            disabled={!files.some(file => file.status === 'complete')}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              files.some(file => file.status === 'complete')
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal; 