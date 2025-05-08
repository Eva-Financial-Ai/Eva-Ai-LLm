import React, { useState, useRef } from 'react';
import FileExplorer from './FileExplorer';
import DocumentViewer from './DocumentViewer';
import { FileItem } from './FilelockDriveApp';
import ShareDocumentModal from './ShareDocumentModal';

// Mock implementation of toast from react-toastify
const toast = {
  success: (message: string) => {
    console.log('Toast success:', message);
    // In a real app, this would show a toast notification
  },
  error: (message: string) => {
    console.error('Toast error:', message);
    // In a real app, this would show an error toast
  },
  info: (message: string) => {
    console.info('Toast info:', message);
    // In a real app, this would show an info toast
  },
  warning: (message: string) => {
    console.warn('Toast warning:', message);
    // In a real app, this would show a warning toast
  }
};

const FilelockDriveIntegrated: React.FC = () => {
  const [currentView, setCurrentView] = useState<'explorer' | 'viewer'>('explorer');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample files data
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: 'file-1',
      name: 'Loan Application.pdf',
      type: 'pdf',
      size: 1542000, // 1.5MB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Loan Application.pdf',
      parentId: 'root',
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=PDF',
      downloadUrl: '/sample-documents/loan-application.pdf',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true
      }
    },
    {
      id: 'folder-1',
      name: 'Personal Documents',
      type: 'folder',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Personal Documents',
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
    if (file.type === 'folder') {
      // Navigate into folder (in a real app)
      console.log("Navigating into folder:", file.name);
    } else {
      setSelectedFile(file);
      setCurrentView('viewer');
    }
  };

  // Handle back to explorer
  const handleBackToExplorer = () => {
    setCurrentView('explorer');
    setSelectedFile(null);
  };

  // Handle share document
  const handleShareDocument = (fileId: string, recipients: Array<{email: string, phoneNumber?: string, permission: string, needsPassword: boolean, notificationMethods: string[]}>) => {
    console.log("Sharing document with ID:", fileId);
    console.log("With recipients:", recipients);
    
    // In a real implementation, this would make an API call to share the document
    
    // Update file to show it's shared
    const updatedFiles = files.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          isShared: true,
          sharedWith: recipients.map(r => ({
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: r.email.split('@')[0],
            email: r.email,
            permission: r.permission as 'viewer' | 'editor' | 'signer' | 'commenter',
            needsPassword: r.needsPassword
          }))
        };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    
    // Send notifications based on methods selected
    recipients.forEach(recipient => {
      recipient.notificationMethods.forEach(method => {
        switch(method) {
          case 'email':
            console.log(`Sending email notification to ${recipient.email}`);
            // In a real app, this would call an API endpoint to send an email
            break;
          case 'sms':
            if (recipient.phoneNumber) {
              console.log(`Sending SMS notification to ${recipient.phoneNumber}`);
              // In a real app, this would call an API endpoint to send an SMS
            }
            break;
          case 'app':
            console.log(`Sending in-app notification to user associated with ${recipient.email}`);
            // In a real app, this would store a notification in the database
            break;
        }
      });
    });
    
    // Display success message
    toast.success(`Document shared with ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}`);
  };

  // Handle document actions from document viewer
  const handleEditDocument = () => {
    console.log("Edit document", selectedFile?.name);
    // Would open document editor in a real implementation
  };

  const handleSignDocument = () => {
    console.log("Sign document", selectedFile?.name);
    // Would open signature workflow in a real implementation
  };

  // Handle delete document
  const handleDeleteDocument = () => {
    if (selectedFile) {
      setFiles(prevFiles => prevFiles.filter(file => file.id !== selectedFile.id));
      setCurrentView('explorer');
      setSelectedFile(null);
      
      // Show success notification
      toast.success(`${selectedFile.name} deleted successfully`);
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
        
        // Show success notification
        toast.success(`${files.length} file${files.length !== 1 ? 's' : ''} uploaded successfully`);
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
    
    // Show success notification
    toast.success(`Folder "${name}" created successfully`);
  };

  // Handle delete files
  const handleDeleteFiles = (fileIds: string[]) => {
    setFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
    
    // Show success notification
    toast.success(`${fileIds.length} item${fileIds.length !== 1 ? 's' : ''} deleted successfully`);
  };

  // Handle file download
  const handleDownloadFile = (file: FileItem) => {
    console.log("Downloading file:", file.name);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = file.downloadUrl || '#';
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    toast.success(`Downloading ${file.name}`);
  };

  // Handle share button from document viewer
  const handleShareButton = () => {
    if (selectedFile) {
      setShowShareModal(true);
    }
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
          onShare={(fileId, recipients) => {
            const file = files.find(f => f.id === fileId);
            if (file) {
              setSelectedFile(file);
              setShowShareModal(true);
            }
          }}
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
          onShare={handleShareButton}
          onDelete={handleDeleteDocument}
          onDownload={() => handleDownloadFile(selectedFile)}
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
      
      {/* ShareDocumentModal */}
      {showShareModal && selectedFile && (
        <ShareDocumentModal
          file={selectedFile}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          onShare={(recipients) => {
            handleShareDocument(selectedFile.id, recipients);
            setShowShareModal(false);
          }}
        />
      )}
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        multiple
      />
    </div>
  );
};

export default FilelockDriveIntegrated; 