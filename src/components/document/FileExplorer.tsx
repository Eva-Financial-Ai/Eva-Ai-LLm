import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';

interface FileExplorerProps {
  files: FileItem[];
  selectedFiles: FileItem[];
  setSelectedFiles: (files: FileItem[]) => void;
  onFileSelect: (file: FileItem) => void;
  onUpload: (files: FileList) => void;
  onCreateFolder: (name: string) => void;
  onDelete: (fileIds: string[]) => void;
  onShare: (fileId: string, recipients: Array<{email: string, permission: 'viewer' | 'editor' | 'signer'}>) => void;
  isGridView: boolean;
  sortBy: 'name' | 'date' | 'size';
  setSortBy: (sort: 'name' | 'date' | 'size') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
  isUploading: boolean;
  uploadProgress: number;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  selectedFiles,
  setSelectedFiles,
  onFileSelect,
  onUpload,
  onCreateFolder,
  onDelete,
  onShare,
  isGridView,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  isUploading,
  uploadProgress
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [fileToShare, setFileToShare] = useState<FileItem | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'viewer' | 'editor' | 'signer'>('viewer');
  
  // Handle file selection (single click)
  const handleFileClick = (file: FileItem, e: React.MouseEvent) => {
    // If Ctrl or Cmd key is pressed, toggle selection
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (selectedFiles.some(f => f.id === file.id)) {
        setSelectedFiles(selectedFiles.filter(f => f.id !== file.id));
      } else {
        setSelectedFiles([...selectedFiles, file]);
      }
    } 
    // If Shift key is pressed, select range
    else if (e.shiftKey && selectedFiles.length > 0) {
      e.preventDefault();
      const fileIndex = files.findIndex(f => f.id === file.id);
      const lastSelectedIndex = files.findIndex(f => f.id === selectedFiles[selectedFiles.length - 1].id);
      
      const startIndex = Math.min(fileIndex, lastSelectedIndex);
      const endIndex = Math.max(fileIndex, lastSelectedIndex);
      
      const rangeSelection = files.slice(startIndex, endIndex + 1);
      const newSelection = [...selectedFiles.filter(f => 
        !rangeSelection.some(r => r.id === f.id)
      ), ...rangeSelection];
      
      setSelectedFiles(newSelection);
    }
    // Normal click, just select the file
    else {
      setSelectedFiles([file]);
      onFileSelect(file);
    }
  };
  
  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle sorting
  const handleSort = (column: 'name' | 'date' | 'size') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // Handle share modal
  const openShareModal = (file: FileItem) => {
    setFileToShare(file);
    setShowShareModal(true);
  };
  
  const handleShare = () => {
    if (fileToShare && shareEmail) {
      onShare(fileToShare.id, [{
        email: shareEmail,
        permission: sharePermission
      }]);
      setShowShareModal(false);
      setShareEmail('');
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    if (selectedFiles.length > 0) {
      onDelete(selectedFiles.map(file => file.id));
    }
  };
  
  // Handle create folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setShowCreateFolderModal(false);
      setNewFolderName('');
    }
  };
  
  // Render file icons based on type
  const renderFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
          <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
        </svg>
      );
    } else if (file.type === 'pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          <path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        </svg>
      );
    } else if (file.type === 'image') {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    } else if (file.type === 'spreadsheet') {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          <path d="M7 7h6v6H7V7z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          <path d="M7 14h6v-1H7v1zm0-3h6v-1H7v1zm0-3h6V7H7v1z" />
        </svg>
      );
    }
  };
  
  // Function to render signature badge
  const renderSignatureBadge = (file: FileItem) => {
    if (!file.signatureStatus) return null;
    
    switch (file.signatureStatus) {
      case 'awaiting':
        return (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full">
            Awaiting Signature
          </span>
        );
      case 'completed':
        return (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">
            Signed
          </span>
        );
      case 'rejected':
        return (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-2 border-b border-gray-200 flex justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9-6h9a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            New Folder
          </button>
          
          {selectedFiles.length > 0 && (
            <>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
              
              {selectedFiles.length === 1 && (
                <button
                  onClick={() => openShareModal(selectedFiles[0])}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [newSortBy, newSortDirection] = e.target.value.split('-');
                setSortBy(newSortBy as 'name' | 'date' | 'size');
                setSortDirection(newSortDirection as 'asc' | 'desc');
              }}
              className="block pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="date-desc">Date (Newest)</option>
              <option value="size-asc">Size (Smallest)</option>
              <option value="size-desc">Size (Largest)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* File list/grid */}
      <div className="flex-1 overflow-auto p-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9-6h9a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-500">No files found in this folder</p>
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="mt-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Create a folder
            </button>
          </div>
        ) : isGridView ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map(file => (
              <div
                key={file.id}
                onClick={(e) => handleFileClick(file, e)}
                onDoubleClick={() => onFileSelect(file)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedFiles.some(f => f.id === file.id) 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200'
                }`}
              >
                {renderFileIcon(file)}
                <p className="mt-2 text-sm font-medium text-gray-900 truncate w-full text-center">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 truncate w-full text-center">
                  {file.type !== 'folder' ? formatFileSize(file.size) : ''}
                </p>
                
                {renderSignatureBadge(file)}
                
                {file.isShared && (
                  <div className="absolute top-2 right-2">
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      <svg 
                        className={`h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Last Modified</span>
                    {sortBy === 'date' && (
                      <svg 
                        className={`h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('size')}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Size</span>
                    {sortBy === 'size' && (
                      <svg 
                        className={`h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map(file => (
                <tr 
                  key={file.id}
                  onClick={(e) => handleFileClick(file, e)}
                  onDoubleClick={() => onFileSelect(file)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedFiles.some(f => f.id === file.id) ? 'bg-primary-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        {renderFileIcon(file)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        {file.signatureStatus && (
                          <div className="text-xs text-gray-500">
                            {file.signatureStatus === 'awaiting' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Awaiting Signature
                              </span>
                            )}
                            {file.signatureStatus === 'completed' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Signed
                              </span>
                            )}
                            {file.signatureStatus === 'rejected' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Rejected
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(file.lastModified)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {file.type !== 'folder' ? formatFileSize(file.size) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openShareModal(file);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Share
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete([file.id]);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Create folder modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none"
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share modal */}
      {showShareModal && fileToShare && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Share "{fileToShare.name}"</h3>
            <p className="text-sm text-gray-500 mb-4">Enter email address to share this file</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                autoFocus
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Permission</label>
              <select
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value as 'viewer' | 'editor' | 'signer')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="viewer">Can view</option>
                <option value="editor">Can edit</option>
                <option value="signer">Can sign</option>
              </select>
            </div>
            
            {/* Currently shared with */}
            {fileToShare.sharedWith && fileToShare.sharedWith.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Currently shared with</h4>
                <div className="max-h-32 overflow-y-auto">
                  {fileToShare.sharedWith.map((person, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.email}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {person.permission === 'viewer' && 'Can view'}
                        {person.permission === 'editor' && 'Can edit'}
                        {person.permission === 'signer' && 'Can sign'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none"
                disabled={!shareEmail}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer; 