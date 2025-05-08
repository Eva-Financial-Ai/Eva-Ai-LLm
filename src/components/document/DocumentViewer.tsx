import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';
import FilelockBlockchainService from './FilelockBlockchainService';

interface DocumentViewerProps {
  file: FileItem;
  onBack: () => void;
  onEdit: () => void;
  onSign: () => void;
  onShare: (recipients: Array<{email: string, permission: 'viewer' | 'editor' | 'signer'}>) => void;
  onDelete: () => void;
  onUpdateFile?: (updatedFile: FileItem) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  file,
  onBack,
  onEdit,
  onSign,
  onShare,
  onDelete,
  onUpdateFile
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // In a real app, get this from the PDF
  const [zoom, setZoom] = useState(100);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState<'viewer' | 'editor' | 'signer'>('viewer');
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  // Mock comments
  const [comments, setComments] = useState([
    {
      id: 'comment-1',
      text: 'Please review this section',
      user: 'Sarah Johnson',
      timestamp: new Date('2023-09-15T14:30:00').toISOString(),
      page: 1,
      position: { x: 120, y: 250 }
    },
    {
      id: 'comment-2',
      text: 'This needs to be updated with the latest information',
      user: 'John Smith',
      timestamp: new Date('2023-09-16T10:15:00').toISOString(),
      page: 2,
      position: { x: 300, y: 150 }
    }
  ]);

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      onShare([{
        email: shareEmail,
        permission: sharePermission
      }]);
      setShowShareModal(false);
      setShareEmail('');
    }
  };
  
  // Handle adding a comment
  const handleAddComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: `comment-${Date.now()}`,
        text: commentText,
        user: 'Me',
        timestamp: new Date().toISOString(),
        page: currentPage,
        position: { x: 200, y: 200 } // In a real app, this would be where the user clicked
      };
      
      setComments([...comments, newComment]);
      setCommentText('');
    }
  };

  // State for active tab in the sidebar
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity' | 'versions'>('details');
  const [showAnnotationTools, setShowAnnotationTools] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string>(file.versions ? file.versions[file.versions.length - 1]?.id : '');
  const [newComment, setNewComment] = useState('');

  // Get appropriate file icon based on type
  const getFileIcon = () => {
    if (file.type === 'pdf') {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
    } else if (file.type === 'excel') {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v1H7a2 2 0 00-2 2v1H4a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V7a2 2 0 00-2-2h-1V4a2 2 0 00-2-2h-2zM8 8V7h4v1H8z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
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
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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
          {showAnnotationTools && (
            <div className="absolute top-0 left-0 right-0 bg-white shadow-md p-3 z-10 flex items-center justify-center space-x-4">
              <button className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd" />
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
                onClick={() => setShowAnnotationTools(false)}
                className="px-3 py-1 bg-gray-200 rounded text-sm font-medium"
              >
                Exit Annotation Mode
              </button>
            </div>
          )}
          
          {/* Document content */}
          <div className="p-6">
            {file.blockchainVerified && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-6 flex items-center">
                <svg className="w-5 h-5 text-purple-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-purple-800">Blockchain Verified Document</p>
                  <p className="text-xs text-purple-700">TxID: {file.blockchainTxId || 'Unknown'}</p>
                </div>
              </div>
            )}
            
            {/* Document preview */}
            <div className="bg-gray-100 border rounded-lg flex flex-col items-center justify-center" style={{ height: '65vh' }}>
              {file.type === 'pdf' ? (
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full mx-auto">
                  <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-bold">{file.name.replace('.pdf', '')}</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-gray-700">This is a sample document preview. In a real implementation, this would display the actual content of the {file.name} file.</p>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative">
                      <div className="absolute -top-2 -left-2 bg-yellow-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        1
                      </div>
                      <p className="text-sm font-medium text-yellow-800">Sample annotation</p>
                      <p className="text-xs text-yellow-700 mt-1">Added by Sarah Johnson</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Section 1: Introduction</h3>
                      <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, nisi at finibus hendrerit, nisl urna aliquam velit, id gravida nulla tortor at eros.</p>
                      <p className="text-gray-700">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed consequat, quam id lacinia venenatis, metus augue mattis lectus, non pharetra orci sem ut orci.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Section 2: Terms and Conditions</h3>
                      <p className="text-gray-700">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                      <p className="text-gray-700">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              className={`flex-1 py-3 text-sm font-medium ${activeTab === 'activity' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button 
              className={`flex-1 py-3 text-sm font-medium ${activeTab === 'versions' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('versions')}
            >
              Versions
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
                      <span className="text-sm font-medium text-gray-900">{file.type.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Size</span>
                      <span className="text-sm font-medium text-gray-900">{file.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Created</span>
                      <span className="text-sm font-medium text-gray-900">{file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Modified</span>
                      <span className="text-sm font-medium text-gray-900">{file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Owner</span>
                      <span className="text-sm font-medium text-gray-900">{file.owner}</span>
                    </div>
                    {file.signatureStatus && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Signature Status</span>
                        <span className={`text-sm font-medium ${file.signatureStatus === 'awaiting' ? 'text-yellow-600' : 'text-green-600'}`}>
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
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border rounded-lg text-sm"
                    rows={3}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className={`px-3 py-1.5 rounded-md text-sm ${newComment.trim() ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-100 text-gray-400'}`}
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {file.comments && file.comments.length > 0 ? (
                    file.comments.map(comment => (
                      <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3 flex-shrink-0">
                            {comment.author?.charAt(0) || '?'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{comment.author}</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6">
                      <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">No comments yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Activity tab */}
            {activeTab === 'activity' && (
              <div>
                {file.activity && file.activity.length > 0 ? (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6 relative">
                      {file.activity.map((activity, index) => (
                        <div key={index} className="flex">
                          <div className="flex-shrink-0 w-9">
                            <div className="flex justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary-600 ring-4 ring-white mt-2"></div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg shadow-sm p-3 flex-1 ml-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {activity.type} by {activity.user}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            {activity.details && (
                              <p className="mt-1 text-xs text-gray-600">{activity.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No activity history</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Versions tab */}
            {activeTab === 'versions' && (
              <div>
                {file.blockchainVerified && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-purple-800 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      This document is secured on blockchain for immutable version history
                    </p>
                  </div>
                )}
                
                {file.versions && file.versions.length > 0 ? (
                  <div className="space-y-3">
                    {file.versions.map((version, index) => (
                      <div 
                        key={version.id}
                        className={`p-3 rounded-lg ${currentVersion === version.id ? 'bg-blue-50 border border-blue-200' : 'bg-white border'}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {index === (file.versions?.length || 0) - 1 ? 'Current Version' : `Version ${index + 1}`}
                            </p>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-gray-500 mr-2">
                                {new Date(version.timestamp).toLocaleString()}
                              </p>
                              <span className="text-xs font-medium text-gray-700">{version.author}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {currentVersion !== version.id && (
                              <button 
                                onClick={() => setCurrentVersion(version.id)}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                              >
                                View
                              </button>
                            )}
                            <button className="p-1.5 hover:bg-gray-100 rounded-full">
                              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <svg className="w-10 h-10 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No version history</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Document toolbar */}
      <div className="px-6 py-3 bg-gray-100 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAnnotationTools(!showAnnotationTools)}
            className={`px-3 py-1.5 rounded-md text-sm flex items-center ${showAnnotationTools ? 'bg-primary-600 text-white' : 'bg-white border text-gray-700'}`}
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {showAnnotationTools ? 'Exit Annotation' : 'Annotate'}
          </button>
          
          <button className="px-3 py-1.5 bg-white border rounded-md text-sm text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          {file.type === 'pdf' && (
            <span>Page 1 of 1</span>
          )}
        </div>
      </div>
      
      {/* Blockchain lock modal */}
      {showBlockchainLockModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowBlockchainLockModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Share Document
                    </h3>
                    <div className="mt-2">
                      <input
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="Enter email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      <select
                        value={sharePermission}
                        onChange={(e) => setSharePermission(e.target.value as 'viewer' | 'editor' | 'signer')}
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