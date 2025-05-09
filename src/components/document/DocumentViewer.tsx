import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';

// Define additional types to fix missing properties
interface FileVersion {
  id: string;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  action: string; // Added missing property
  timestamp: string; // Added missing property
  size: number;
  notes?: string;
}

// Interface for FilelockBlockchainService props
interface FilelockBlockchainServiceProps {
  file: FileItem;
  onComplete: (updatedFile: FileItem) => void;
  onCancel: () => void;
}

// Convert to a proper React component
const FilelockBlockchainService: React.FC<FilelockBlockchainServiceProps> = ({
  file,
  onComplete,
  onCancel,
}) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCertify = async () => {
    setProcessing(true);

    // Simulate blockchain certification process
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);

          // Generate mock blockchain data
          const blockchainData = {
            transactionHash: '0x' + Math.random().toString(36).substring(2, 15),
            blockNumber: Math.floor(Math.random() * 10000000),
            timestamp: new Date().toISOString(),
            network: 'Polygon',
          };

          // Complete the process
          setTimeout(() => {
            onComplete({
              ...file,
              blockchainVerified: true,
              blockchainTxId: blockchainData.transactionHash,
            });
          }, 500);
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Verification</h3>

        {processing ? (
          <>
            <div className="mb-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {progress < 100 ? 'Processing...' : 'Completed!'}
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Certify this document on the blockchain to ensure its authenticity and prevent
              unauthorized modifications.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCertify}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Certify Document
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface DocumentViewerProps {
  file: FileItem;
  onBack: () => void;
  onEdit: () => void;
  onSign: () => void;
  onShare: () => void; // Fixed: This doesn't accept parameters
  onDelete: () => void;
  onDownload: () => void;
  onUpdateFile?: (updatedFile: FileItem) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  file,
  onBack,
  onEdit,
  onSign,
  onShare,
  onDelete,
  onDownload,
  onUpdateFile,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // In a real app, get this from the PDF
  const [zoom, setZoom] = useState(100);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'viewer' | 'editor' | 'signer'>('viewer');
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<
    Array<{
      id: string;
      text: string;
      user: string;
      timestamp: string;
    }>
  >([]);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history' | 'security'>(
    'details'
  );
  const [isCertifying, setIsCertifying] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle zoom
  const zoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
  };

  // Handle share
  const handleShare = () => {
    if (shareEmail) {
      // Call onShare without parameters, since it doesn't accept any
      onShare();
      setShowShareModal(false);
      setShareEmail('');
    }
  };

  // Handle adding a comment
  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      text: comment,
      user: 'You',
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setComment('');
  };

  // Certify document on blockchain
  const handleCertifyDocument = async () => {
    setIsCertifying(true);

    try {
      // In a proper implementation, we would call a blockchain service API
      // For now, we'll show the blockchain verification modal
      setShowBlockchainLockModal(true);
    } catch (error) {
      console.error('Error certifying document:', error);
      setIsCertifying(false);
    }
  };

  // Get appropriate file icon based on type
  const getFileIcon = () => {
    if (file.type === 'pdf') {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (file.type === 'excel') {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a2 2 0 00-2 2v1H7a2 2 0 00-2 2v1H4a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V7a2 2 0 00-2-2h-1V4a2 2 0 00-2-2h-2zM8 8V7h4v1H8z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  // Add state for blockchain locking
  const [showBlockchainLockModal, setShowBlockchainLockModal] = useState(false);

  // Handle file update from blockchain service
  const handleFileUpdate = (updatedFile: FileItem) => {
    setShowBlockchainLockModal(false);
    if (onUpdateFile) {
      onUpdateFile(updatedFile);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      {/* Document header */}
      <div className="px-6 py-4 bg-white border-b flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-1 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5 text-gray-600"
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
          <div className="flex items-center">
            {getFileIcon()}
            <h1 className="ml-2 text-lg font-medium text-gray-900">{file.name}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {file.signatureStatus === 'awaiting' && (
            <button
              onClick={onSign}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
            >
              Sign Document
            </button>
          )}

          {!file.blockchainVerified && (
            <button
              onClick={() => setShowBlockchainLockModal(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Lock on Blockchain
            </button>
          )}

          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm"
          >
            Share
          </button>

          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm">
            Download
          </button>

          <div className="relative">
            <button className="p-1.5 rounded-full hover:bg-gray-100">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - split between document and sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Document preview area */}
        <div className="flex-1 overflow-auto relative">
          {/* Annotation toolbar (appears at top when annotation mode is active) */}
          {showDetails && (
            <div className="absolute top-0 left-0 right-0 bg-white shadow-md p-3 z-10 flex items-center justify-center space-x-4">
              <button className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="h-6 border-r border-gray-300"></div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-1"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
              <div className="h-6 border-r border-gray-300"></div>
              <button
                onClick={() => setShowDetails(false)}
                className="px-3 py-1 bg-gray-200 rounded text-sm font-medium"
              >
                Exit Details
              </button>
            </div>
          )}

          {/* Document content */}
          <div className="p-6">
            {file.blockchainVerified && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6 flex items-center">
                <svg
                  className="w-5 h-5 text-purple-700 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    Blockchain Verified Document
                  </p>
                  <p className="text-xs text-purple-700">
                    TxID: {file.blockchainTxId || 'Unknown'}
                  </p>
                </div>
              </div>
            )}

            {/* Document preview */}
            <div
              className="bg-gray-100 border rounded-lg flex flex-col items-center justify-center"
              style={{ height: '65vh' }}
            >
              {file.type === 'pdf' ? (
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full mx-auto">
                  <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold">{file.name.replace('.pdf', '')}</h2>
                  </div>

                  <div className="space-y-6">
                    <p className="text-gray-700">
                      This is a sample document preview. In a real implementation, this would
                      display the actual content of the {file.name} file.
                    </p>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative">
                      <div className="absolute -top-2 -left-2 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        1
                      </div>
                      <p className="text-sm font-medium text-yellow-800">Sample annotation</p>
                      <p className="text-xs text-yellow-700 mt-1">Added by Sarah Johnson</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Section 1: Introduction</h3>
                      <p className="text-gray-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi
                        at finibus hendrerit, nisl urna aliquam velit, id gravida nulla tortor at
                        eros.
                      </p>
                      <p className="text-gray-700">
                        Pellentesque habitant morbi tristique senectus et netus et malesuada fames
                        ac turpis egestas. Sed consequat, quam id lacinia venenatis, metus augue
                        mattis lectus, non pharetra orci sem ut orci.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Section 2: Terms and Conditions</h3>
                      <p className="text-gray-700">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p className="text-gray-700">
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat.
                      </p>
                    </div>
                  </div>

                  {file.signatureStatus === 'awaiting' && (
                    <div className="mt-8 p-4 border-2 border-dashed border-yellow-300 rounded-lg bg-yellow-50">
                      <p className="text-center text-yellow-800 font-medium">Signature required</p>
                      <div className="h-16 mt-2 bg-white rounded border flex items-center justify-center">
                        <p className="text-gray-400">Click to sign here</p>
                      </div>
                    </div>
                  )}

                  {file.signatureStatus === 'completed' && (
                    <div className="mt-8 p-4 border border-green-200 rounded-lg bg-green-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-800 font-medium">Signed by John Smith</p>
                          <p className="text-xs text-green-700">March 15, 2023 at 2:45 PM</p>
                        </div>
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  {getFileIcon()}
                  <p className="mt-4 text-gray-500">Preview not available for this file type</p>
                  <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md text-sm">
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {showDetails && (
          <div className="w-80 border-l bg-gray-50 overflow-auto">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'details' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'comments' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'history' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('history')}
              >
                History
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === 'security' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('security')}
              >
                Security
              </button>
            </div>

            {/* Tab content */}
            <div className="p-4">
              {/* Details tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">File Information</h3>
                    <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Size</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Created</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.createdAt
                            ? new Date(file.createdAt).toLocaleDateString()
                            : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Modified</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.lastModified
                            ? new Date(file.lastModified).toLocaleDateString()
                            : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Owner</span>
                        <span className="text-sm font-medium text-gray-900">{file.owner}</span>
                      </div>
                      {file.signatureStatus && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Signature Status</span>
                          <span
                            className={`text-sm font-medium ${file.signatureStatus === 'awaiting' ? 'text-yellow-600' : 'text-green-600'}`}
                          >
                            {file.signatureStatus === 'awaiting' ? 'Awaiting Signature' : 'Signed'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {file.sharedWith && file.sharedWith.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Shared With</h3>
                      <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                        {file.sharedWith.map(user => (
                          <div key={user.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
                              {user.permission}
                            </span>
                          </div>
                        ))}
                        <button className="w-full mt-2 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-700 p-2 border border-dashed border-gray-300 rounded-md">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Share with more people
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comments tab */}
              {activeTab === 'comments' && (
                <div>
                  <div className="mb-4">
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border rounded-lg text-sm"
                      rows={3}
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleAddComment}
                        disabled={!comment.trim()}
                        className={`px-3 py-1.5 rounded-md text-sm ${comment.trim() ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-400'}`}
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map(comment => (
                        <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
                              {comment.user.charAt(0) || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {comment.user}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-6">
                        <svg
                          className="w-10 h-10 text-gray-300 mx-auto"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">No comments yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* History tab */}
              {activeTab === 'history' && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Version History
                  </h4>

                  {file.versionHistory && file.versionHistory.length > 0 ? (
                    <ul className="space-y-4">
                      {file.versionHistory.map((version, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {version.createdBy === 'You' ? 'You' : version.createdBy}{' '}
                              <span className="font-normal text-gray-600">
                                {version.notes || 'Updated'}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(version.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No version history available
                    </p>
                  )}
                </div>
              )}

              {/* Security tab */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Security & Verification
                  </h4>

                  {blockchainInfo ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            Blockchain Verified
                          </h3>
                          <div className="mt-2 text-xs text-green-700">
                            <p>Transaction: {blockchainInfo.transactionHash.substr(0, 10)}...</p>
                            <p className="mt-1">Block: {blockchainInfo.blockNumber}</p>
                            <p className="mt-1">Network: {blockchainInfo.network}</p>
                            <p className="mt-1">
                              Timestamp: {new Date(blockchainInfo.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">
                        Certify this document on blockchain to ensure its authenticity and
                        integrity.
                      </p>
                      <button
                        onClick={handleCertifyDocument}
                        disabled={isCertifying}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {isCertifying ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Certifying...
                          </>
                        ) : (
                          <>
                            <svg
                              className="-ml-1 mr-2 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                            Certify on Blockchain
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Access Control
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-600">Password Protected</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.isPasswordProtected ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-600">Encryption</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.encryptionStatus || 'None'}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-gray-600">Expiration</span>
                        <span className="text-sm font-medium text-gray-900">
                          {file.expirationDate
                            ? new Date(file.expirationDate).toLocaleDateString()
                            : 'Never'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Document toolbar */}
      <div className="px-6 py-3 bg-gray-100 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center ${showDetails ? 'bg-primary-600 text-white' : 'bg-white border text-gray-700'}`}
          >
            <svg
              className={`-ml-0.5 mr-2 h-4 w-4 ${showDetails ? 'text-primary-500' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>

          <button className="px-3 py-1.5 bg-white border rounded-md text-sm text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          {file.type === 'pdf' && <span>Page 1 of 1</span>}
        </div>
      </div>

      {/* Blockchain lock modal */}
      {showBlockchainLockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowBlockchainLockModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <FilelockBlockchainService
                file={file}
                onComplete={handleFileUpdate}
                onCancel={() => setShowBlockchainLockModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Share Document</h3>
                    <div className="mt-2">
                      <input
                        type="email"
                        value={shareEmail}
                        onChange={e => setShareEmail(e.target.value)}
                        placeholder="Enter email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      <select
                        value={sharePermission}
                        onChange={e =>
                          setSharePermission(e.target.value as 'viewer' | 'editor' | 'signer')
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="signer">Signer</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
