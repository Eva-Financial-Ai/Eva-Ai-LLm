import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import DocumentViewer from './DocumentViewer';
import { FileItem } from './FilelockDriveApp';

const FilelockDriveIntegrated: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [currentView, setCurrentView] = useState<'explorer' | 'viewer'>('explorer');
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock files for demonstration
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'file-1',
      name: 'Sample Document.pdf',
      type: 'pdf',
      size: 1200000,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Sample Document.pdf',
      parentId: 'root',
      owner: 'me',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true
      }
    }
  ]);

  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file);
    setCurrentView('viewer');
  };

  // Handle back navigation from viewer to explorer
  const handleBackToExplorer = () => {
    setCurrentView('explorer');
    setSelectedFile(null);
  };

  // Handle edit document
  const handleEditDocument = () => {
    console.log("Edit document:", selectedFile?.name);
    // Edit document logic would go here
  };

  // Handle sign document
  const handleSignDocument = () => {
    console.log("Sign document:", selectedFile?.name);
    // Sign document logic would go here
  };

  // Handle share document
  const handleShareDocument = (fileId: string, recipients: Array<{email: string, permission: 'viewer' | 'editor' | 'signer'}>) => {
    console.log("Share document with ID:", fileId, "with recipients:", recipients);
    // Share document logic would go here
  };

  // Handle delete document
  const handleDeleteDocument = () => {
    if (selectedFile) {
      setFiles(prevFiles => prevFiles.filter(file => file.id !== selectedFile.id));
      setCurrentView('explorer');
      setSelectedFile(null);
    }
  };

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    setIsUploading(true);
    let progress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }, 300);
  };

  // Handle folder creation
  const handleCreateFolder = (name: string) => {
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: `/${name}`,
      parentId: 'root',
      owner: 'me',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true
      }
    };
    setFiles(prevFiles => [...prevFiles, newFolder]);
  };

  // Handle delete files
  const handleDeleteFiles = (fileIds: string[]) => {
    setFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: '700px' }}>
      {currentView === 'explorer' ? (
        <FileExplorer 
          files={files}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          onFileSelect={handleFileSelect}
          onUpload={handleFileUpload}
          onCreateFolder={handleCreateFolder}
          onDelete={handleDeleteFiles}
          onShare={handleShareDocument}
          isGridView={isGridView}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      ) : selectedFile && (
        <DocumentViewer 
          file={selectedFile} 
          onBack={handleBackToExplorer}
          onEdit={handleEditDocument}
          onSign={handleSignDocument}
          onShare={(recipients) => selectedFile && handleShareDocument(selectedFile.id, recipients)}
          onDelete={handleDeleteDocument}
          onUpdateFile={(updatedFile) => {
            // Update the file in our state
            setSelectedFile(updatedFile);
            // Also update the file in the files list
            const updatedFiles = files.map(f => 
              f.id === updatedFile.id ? updatedFile : f
            );
            setFiles(updatedFiles);
          }}
        />
      )}
    </div>
  );
};

export default FilelockDriveIntegrated; 