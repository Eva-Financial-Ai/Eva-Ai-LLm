import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileItem } from './FilelockDriveApp';

// Define cloud storage provider types
export type CloudStorageProvider = 'google-drive' | 'onedrive' | 'icloud' | 'dropbox';

// Define CloudFile type for files from cloud storage providers
export interface CloudFile {
  id: string;
  name: string;
  type: string;
  size?: number;
  lastModified: string;
  thumbnailUrl?: string;
  downloadUrl: string;
  webViewLink?: string;
  provider: CloudStorageProvider;
  parentId?: string | null;
}

interface CloudStorageConnectorProps {
  files?: FileItem[];
  currentFolder?: string;
  onFileSelect: (files: CloudFile[]) => void;
  onFileImport: (files: FileItem[]) => void;
  onClose: () => void;
}

const CloudStorageConnector: React.FC<CloudStorageConnectorProps> = ({
  files = [],
  currentFolder = 'root',
  onFileSelect,
  onFileImport,
  onClose,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<CloudStorageProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [selectedCloudFiles, setSelectedCloudFiles] = useState<CloudFile[]>([]);
  const [currentCloudFolder, setCurrentCloudFolder] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Destination folder selection state
  const [selectedDestinationFolder, setSelectedDestinationFolder] = useState<string>(currentFolder);
  const [availableFolders, setAvailableFolders] = useState<
    { id: string; name: string; path: string }[]
  >([]);

  // Extract folders from files prop on component mount and when files change
  useEffect(() => {
    const folders = [{ id: 'root', name: 'My Drive', path: '/' }];

    // Add all folders from files
    files.forEach(file => {
      if (file.type === 'folder') {
        folders.push({
          id: file.id,
          name: file.name,
          path: file.path,
        });
      }
    });

    setAvailableFolders(folders);
  }, [files]);

  // Connect to cloud provider
  const connectToProvider = async (provider: CloudStorageProvider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);
    setError(null);

    try {
      // In a real implementation, this would authenticate with the provider's API
      // For Google Drive: OAuth 2.0 flow
      // For OneDrive: Microsoft identity platform authentication
      // For iCloud: Apple authentication

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsConnected(true);
      setIsConnecting(false);

      // After connection, fetch root files
      fetchFiles(null);
    } catch (err) {
      setError('Failed to connect to provider. Please try again.');
      setIsConnecting(false);
    }
  };

  // Fetch files from cloud provider
  const fetchFiles = async (folderId: string | null) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the provider's API to list files
      // For demo purposes, we simulate different files for different providers

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let mockFiles: CloudFile[] = [];

      if (selectedProvider === 'google-drive') {
        mockFiles = generateMockGoogleDriveFiles(folderId);
      } else if (selectedProvider === 'onedrive') {
        mockFiles = generateMockOneDriveFiles(folderId);
      } else if (selectedProvider === 'icloud') {
        mockFiles = generateMockICloudFiles(folderId);
      }

      setCloudFiles(mockFiles);
      setCurrentCloudFolder(folderId);

      // Update folder history for navigation
      if (folderId !== null) {
        const folderName = mockFiles.find(f => f.id === folderId)?.name || 'Folder';
        if (!folderHistory.some(f => f.id === folderId)) {
          setFolderHistory([...folderHistory, { id: folderId, name: folderName }]);
        }
      } else {
        // Reset to root
        setFolderHistory([]);
      }

      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch files. Please try again.');
      setIsLoading(false);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folderId: string) => {
    fetchFiles(folderId);
  };

  // Navigate back
  const navigateBack = () => {
    if (folderHistory.length > 0) {
      const previousFolder = folderHistory[folderHistory.length - 2];
      setFolderHistory(folderHistory.slice(0, -1));
      fetchFiles(previousFolder?.id || null);
    } else {
      fetchFiles(null);
    }
  };

  // Toggle file selection
  const toggleFileSelection = (file: CloudFile) => {
    if (selectedCloudFiles.some(f => f.id === file.id)) {
      setSelectedCloudFiles(selectedCloudFiles.filter(f => f.id !== file.id));
    } else {
      setSelectedCloudFiles([...selectedCloudFiles, file]);
    }
  };

  // Import selected files to FileLock
  const importFiles = async () => {
    if (selectedCloudFiles.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would download the files from the cloud provider
      // and upload them to your FileLock system

      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Convert CloudFile objects to FileItem objects
      const fileItems: FileItem[] = selectedCloudFiles.map(cloudFile => ({
        id: `imported-${cloudFile.provider}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: cloudFile.name,
        type: cloudFile.type,
        size: cloudFile.size,
        lastModified: cloudFile.lastModified,
        createdAt: new Date().toISOString(),
        path: `/${cloudFile.name}`,
        parentId: selectedDestinationFolder,
        owner: 'me',
        thumbnailUrl: cloudFile.thumbnailUrl,
        downloadUrl: cloudFile.downloadUrl,
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: true,
          canShare: true,
          canDownload: true,
          canComment: true,
        },
        // Add metadata to track the cloud origin and verification status
        tags: [`Imported from ${selectedProvider}`, 'Unverified'],
        verificationStatus: 'pending',
        blockchainVerified: false,
      }));

      // Dispatch successful import event to parent components
      const event = new CustomEvent('filelock-import-success', {
        detail: { files: fileItems, provider: selectedProvider }
      });
      window.dispatchEvent(event);
      
      onFileImport(fileItems);
      setIsLoading(false);
      onClose();
      
      // Show success toast (in a real implementation, you'd use a toast notification system)
      alert(`Successfully imported ${fileItems.length} files from ${selectedProvider}`);
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import files. Please try again or contact support if the issue persists.');
      setIsLoading(false);
    }
  };

  // Helper function to generate mock Google Drive files
  const generateMockGoogleDriveFiles = (folderId: string | null): CloudFile[] => {
    if (folderId === 'gdrive-folder-1') {
      return [
        {
          id: 'gdrive-file-11',
          name: 'Quarterly Financial Report.pdf',
          type: 'pdf',
          size: 3500000,
          lastModified: new Date().toISOString(),
          downloadUrl: '#',
          provider: 'google-drive',
          parentId: 'gdrive-folder-1',
        },
        {
          id: 'gdrive-file-12',
          name: 'Balance Sheet.xlsx',
          type: 'spreadsheet',
          size: 1200000,
          lastModified: new Date().toISOString(),
          downloadUrl: '#',
          provider: 'google-drive',
          parentId: 'gdrive-folder-1',
        },
      ];
    }

    return [
      {
        id: 'gdrive-folder-1',
        name: 'Financial Documents',
        type: 'folder',
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'google-drive',
        parentId: null,
      },
      {
        id: 'gdrive-file-1',
        name: 'Business Plan 2023.pdf',
        type: 'pdf',
        size: 2500000,
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'google-drive',
        parentId: null,
      },
      {
        id: 'gdrive-file-2',
        name: 'Loan Application Form.docx',
        type: 'document',
        size: 1500000,
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'google-drive',
        parentId: null,
      },
    ];
  };

  // Helper function to generate mock OneDrive files
  const generateMockOneDriveFiles = (folderId: string | null): CloudFile[] => {
    if (folderId === 'onedrive-folder-1') {
      return [
        {
          id: 'onedrive-file-11',
          name: 'Tax Returns 2022.pdf',
          type: 'pdf',
          size: 4200000,
          lastModified: new Date().toISOString(),
          downloadUrl: '#',
          provider: 'onedrive',
          parentId: 'onedrive-folder-1',
        },
        {
          id: 'onedrive-file-12',
          name: 'Income Statements.xlsx',
          type: 'spreadsheet',
          size: 980000,
          lastModified: new Date().toISOString(),
          downloadUrl: '#',
          provider: 'onedrive',
          parentId: 'onedrive-folder-1',
        },
      ];
    }

    return [
      {
        id: 'onedrive-folder-1',
        name: 'Tax Documents',
        type: 'folder',
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'onedrive',
        parentId: null,
      },
      {
        id: 'onedrive-file-1',
        name: 'Property Deed.pdf',
        type: 'pdf',
        size: 3100000,
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'onedrive',
        parentId: null,
      },
      {
        id: 'onedrive-file-2',
        name: 'Incorporation Certificate.pdf',
        type: 'pdf',
        size: 1800000,
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'onedrive',
        parentId: null,
      },
    ];
  };

  // Helper function to generate mock iCloud files
  const generateMockICloudFiles = (folderId: string | null): CloudFile[] => {
    if (folderId === 'icloud-folder-1') {
      return [
        {
          id: 'icloud-file-11',
          name: 'Bank Statements.pdf',
          type: 'pdf',
          size: 2800000,
          lastModified: new Date().toISOString(),
          downloadUrl: '#',
          provider: 'icloud',
          parentId: 'icloud-folder-1',
        },
        {
          id: 'icloud-file-12',
          name: 'Credit History.pdf',
          type: 'pdf',
          size: 1600000,
          lastModified: new Date().toISOString(),
          downloadUrl: '#',
          provider: 'icloud',
          parentId: 'icloud-folder-1',
        },
      ];
    }

    return [
      {
        id: 'icloud-folder-1',
        name: 'Banking Documents',
        type: 'folder',
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'icloud',
        parentId: null,
      },
      {
        id: 'icloud-file-1',
        name: 'Insurance Policy.pdf',
        type: 'pdf',
        size: 2200000,
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'icloud',
        parentId: null,
      },
      {
        id: 'icloud-file-2',
        name: 'ID Documents.zip',
        type: 'archive',
        size: 5500000,
        lastModified: new Date().toISOString(),
        downloadUrl: '#',
        provider: 'icloud',
        parentId: null,
      },
    ];
  };

  // Render provider selection screen
  const renderProviderSelection = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Connect to Cloud Storage</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select a cloud storage provider to import your documents
        </p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Google Drive */}
          <div
            className={`relative rounded-lg border ${
              selectedProvider === 'google-drive' ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-300'
            } bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            onClick={() => connectToProvider('google-drive')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src="/icons/google-drive.svg"
                  alt="Google Drive"
                  className="h-10 w-10"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/40?text=GD`;
                  }}
                />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium text-gray-900">Google Drive</h4>
                <p className="text-sm text-gray-500">Connect to your Google Drive account</p>
              </div>
            </div>
          </div>

          {/* Microsoft OneDrive */}
          <div
            className={`relative rounded-lg border ${
              selectedProvider === 'onedrive' ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-300'
            } bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            onClick={() => connectToProvider('onedrive')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src="/icons/onedrive.svg"
                  alt="OneDrive"
                  className="h-10 w-10"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/40?text=OD`;
                  }}
                />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium text-gray-900">Microsoft OneDrive</h4>
                <p className="text-sm text-gray-500">Connect to your OneDrive account</p>
              </div>
            </div>
          </div>

          {/* Dropbox */}
          <div
            className={`relative rounded-lg border ${
              selectedProvider === 'dropbox' ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-300'
            } bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            onClick={() => connectToProvider('dropbox')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src="/icons/dropbox.svg"
                  alt="Dropbox"
                  className="h-10 w-10"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/40?text=DB`;
                  }}
                />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium text-gray-900">Dropbox</h4>
                <p className="text-sm text-gray-500">Connect to your Dropbox account</p>
              </div>
            </div>
          </div>

          {/* iCloud Drive */}
          <div
            className={`relative rounded-lg border ${
              selectedProvider === 'icloud' ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-300'
            } bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            onClick={() => connectToProvider('icloud')}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  src="/icons/icloud.svg"
                  alt="iCloud Drive"
                  className="h-10 w-10"
                  onError={e => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/40?text=iC`;
                  }}
                />
              </div>
              <div className="ml-4">
                <h4 className="text-md font-medium text-gray-900">iCloud Drive</h4>
                <p className="text-sm text-gray-500">Connect to your iCloud Drive account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="ml-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Render connecting screen
  const renderConnecting = () => (
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-gray-600">
        Connecting to{' '}
        {selectedProvider === 'google-drive'
          ? 'Google Drive'
          : selectedProvider === 'onedrive'
            ? 'OneDrive'
            : selectedProvider === 'dropbox'
              ? 'Dropbox'
              : 'iCloud Drive'}
        ...
      </p>
    </div>
  );

  // Render file browser
  const renderFileBrowser = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {selectedProvider === 'google-drive'
              ? 'Google Drive'
              : selectedProvider === 'onedrive'
                ? 'OneDrive'
                : selectedProvider === 'dropbox'
                  ? 'Dropbox'
                  : 'iCloud Drive'}
          </h3>
        </div>
        <div className="flex">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-2 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 border-b border-gray-200 flex items-center">
        <button
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
          onClick={() => fetchFiles(null)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>

        <button
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500 ml-1"
          onClick={navigateBack}
          disabled={folderHistory.length === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="ml-2 flex items-center text-sm text-gray-500 overflow-x-auto">
          <span className="cursor-pointer hover:text-primary-500" onClick={() => fetchFiles(null)}>
            Home
          </span>

          {folderHistory.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mx-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span
                className="cursor-pointer hover:text-primary-500"
                onClick={() => {
                  const newHistory = folderHistory.slice(0, index + 1);
                  setFolderHistory(newHistory);
                  fetchFiles(folder.id);
                }}
              >
                {folder.name}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex-grow overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">{error}</div>
        ) : cloudFiles.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No files found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cloudFiles.map(file => (
              <div
                key={file.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCloudFiles.some(f => f.id === file.id)
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() =>
                  file.type === 'folder' ? navigateToFolder(file.id) : toggleFileSelection(file)
                }
              >
                <div className="flex items-center">
                  {file.type === 'folder' ? (
                    <div className="w-10 h-10 flex items-center justify-center text-blue-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                  ) : file.type === 'pdf' ? (
                    <div className="w-10 h-10 flex items-center justify-center text-red-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  ) : file.type === 'document' || file.type === 'docx' || file.type === 'doc' ? (
                    <div className="w-10 h-10 flex items-center justify-center text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  ) : file.type === 'spreadsheet' || file.type === 'xlsx' || file.type === 'xls' ? (
                    <div className="w-10 h-10 flex items-center justify-center text-green-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="ml-3 flex-grow">
                    <div className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {file.type !== 'folder' && file.size
                        ? `${Math.round(file.size / 1024)} KB`
                        : file.type === 'folder'
                          ? 'Folder'
                          : file.type.toUpperCase()}
                    </div>
                  </div>

                  {file.type !== 'folder' && (
                    <div className="ml-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedCloudFiles.some(f => f.id === file.id)}
                        onChange={() => toggleFileSelection(file)}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Folder Selection */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Import to folder:</label>
          <select
            value={selectedDestinationFolder}
            onChange={e => setSelectedDestinationFolder(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {availableFolders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.id === 'root' ? 'My Drive' : folder.name} ({folder.path})
              </option>
            ))}
          </select>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={importFiles}
          >
            Import Selected ({selectedCloudFiles.length})
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          {/* Modal content */}
          <div className="bg-white p-0">
            {!selectedProvider && renderProviderSelection()}
            {selectedProvider && isConnecting && renderConnecting()}
            {selectedProvider && isConnected && renderFileBrowser()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CloudStorageConnector;
