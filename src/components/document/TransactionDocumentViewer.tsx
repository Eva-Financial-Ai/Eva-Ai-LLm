import React, { useState, useEffect, useCallback, useRef, lazy, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileItem, FileVersion } from './FilelockDriveApp';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { UserContext } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileArchive,
  faFileCsv,
  faFileCode,
  faFileAlt,
  faFolder,
  faLock,
  faLockOpen,
  faHistory,
  faShareAlt,
  faTrashAlt,
  faDownload,
  faArchive,
  faChevronLeft,
  faEllipsisV,
  faEye,
  faEdit,
  faSignature,
  faSpinner,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

// Define the valid user roles
type UserRoleType = '' | 'lender' | 'borrower' | 'broker' | 'vendor' | 'underwriter';

// Interfaces for sub-components
interface VersionItemProps {
  version: FileVersion;
  isSelected: boolean;
  formatDate: (dateString: string) => string;
  formatFileSize: (bytes: number) => string;
  onSelect: (version: FileVersion) => void;
}

interface TransactionDocumentViewerProps {
  documentId: string;
  transactionId: string;
  onClose?: () => void;
  onLock?: (documentId: string) => void;
  onUnlock?: (documentId: string) => void;
  onBack?: () => void;
  onArchive?: (documentId: string, retentionPeriod: number) => void;
}

// Lazy-loaded tab components
const DocumentPreview = lazy(() => import('./DocumentPreview'));
const VersionHistory = lazy(() => import('./VersionHistory'));

// Loading spinner component
const LoadingSpinner = React.memo(() => (
  <div className="flex flex-col items-center justify-center h-64">
    <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-primary-600 animate-spin" />
    <p className="mt-4 text-gray-600">Loading...</p>
  </div>
));

// Version history item component
const VersionItem = React.memo<VersionItemProps>(
  ({ version, isSelected, formatDate, formatFileSize, onSelect }) => (
    <li key={version.id}>
      <button
        onClick={() => onSelect(version)}
        className={`w-full text-left block hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out ${
          isSelected ? 'bg-blue-50' : ''
        }`}
      >
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                {version.versionNumber}
              </span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                Version {version.versionNumber}
              </div>
              <div className="text-sm text-gray-500">
                Created by {version.createdBy} on {formatDate(version.createdAt)}
              </div>
              {version.notes && <div className="text-sm text-gray-600 mt-1">{version.notes}</div>}
            </div>
          </div>
          <div className="ml-2 flex-shrink-0 flex">
            <span className="text-sm text-gray-500">{formatFileSize(version.size)}</span>
          </div>
        </div>
      </button>
    </li>
  )
);

// Error message component
const ErrorMessage = React.memo(
  ({ error, onRetry }: { error: string | null; onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <FontAwesomeIcon icon={faExclamationTriangle} className="w-16 h-16 text-red-500" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Document</h3>
      <p className="mt-1 text-gray-500">{error || 'Document not found'}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Retry
      </button>
    </div>
  )
);

// Helper function to get icon based on file type (can be imported if centralized)
const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return faFilePdf;
    case 'document':
    case 'docx':
    case 'doc':
      return faFileWord;
    case 'spreadsheet':
    case 'xlsx':
    case 'xls':
      return faFileExcel;
    case 'presentation':
    case 'pptx':
    case 'ppt':
      return faFilePowerpoint;
    case 'image':
      return faFileImage;
    case 'video':
      return faFileVideo;
    case 'audio':
      return faFileAudio;
    case 'archive':
      return faFileArchive;
    case 'csv':
      return faFileCsv;
    case 'code':
      return faFileCode;
    case 'folder':
      return faFolder;
    default:
      return faFileAlt;
  }
};

// Main component
const TransactionDocumentViewer: React.FC<TransactionDocumentViewerProps> = ({
  documentId,
  transactionId,
  onClose,
  onLock,
  onUnlock,
  onBack,
  onArchive,
}) => {
  const navigate = useNavigate();
  const { userRole } = React.useContext(UserContext);
  const { currentTransaction } = useWorkflow();
  const timeoutRefs = useRef<number[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Document state
  const [document, setDocument] = useState<FileItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File lock state
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState<string | null>(null);
  const [lockExpiration, setLockExpiration] = useState<Date | null>(null);

  // Version history state
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState<FileVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<FileVersion | null>(null);
  const [visibleVersions, setVisibleVersions] = useState<number>(10); // For pagination

  // Tab state
  const [activeTab, setActiveTab] = useState<'preview' | 'versions' | 'activity' | 'permissions'>(
    'preview'
  );

  // Archive/retention state
  const [retentionPeriod, setRetentionPeriod] = useState<number>(36); // Default 36 months
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  // Check if user has admin/editor privileges based on role
  const canEditDocument =
    (userRole as UserRoleType) === 'lender' || (userRole as UserRoleType) === 'broker';
  const isAdmin =
    (userRole as UserRoleType) === 'lender' || (userRole as UserRoleType) === 'underwriter'; // Consider lenders and underwriters as admins

  // Create a permissions object with defaults to avoid undefined errors
  const [permissions, setPermissions] = useState({
    canView: true,
    canEdit: canEditDocument,
    canDelete: isAdmin,
    canShare: canEditDocument,
    canDownload: true,
    canComment: true,
  });

  // Clear all timeouts when component unmounts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    timeoutRefs.current = [];
  }, []);

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  // Load more versions
  const loadMoreVersions = useCallback(() => {
    setVisibleVersions(prev => Math.min(prev + 10, versionHistory.length));
  }, [versionHistory.length]);

  // Retry loading document
  const retryLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetchDocument();
  }, []); // This will cause a lint warning but we'll handle it later

  // Fetch document data
  const fetchDocument = useCallback(async () => {
    try {
      // In a real app, this would fetch from your API
      // For now we'll mock the data
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock document data
      const mockDocument: FileItem = {
        id: documentId,
        name: 'Master Lease Agreement.pdf',
        type: 'pdf',
        size: 2500000,
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        path: `/Transaction ${transactionId}/Master Lease Agreement.pdf`,
        parentId: `folder-transaction-${transactionId}`,
        owner: 'system',
        thumbnailIcon: getFileIcon('pdf'),
        downloadUrl: '#',
        permissions: {
          canView: true,
          canEdit: canEditDocument,
          canDelete: isAdmin,
          canShare: canEditDocument,
          canDownload: true,
          canComment: true,
        },
      };

      // Mock version history
      const mockVersions: FileVersion[] = [
        {
          id: `${documentId}-v3`,
          versionNumber: 3,
          createdAt: new Date().toISOString(),
          createdBy: 'John Smith',
          size: 2500000,
          notes: 'Final version with all signatures',
        },
        {
          id: `${documentId}-v2`,
          versionNumber: 2,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          createdBy: 'Sarah Johnson',
          size: 2450000,
          notes: 'Updated terms on page 3',
        },
        {
          id: `${documentId}-v1`,
          versionNumber: 1,
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          createdBy: 'System',
          size: 2400000,
          notes: 'Initial document generation',
        },
      ];

      setDocument(mockDocument);
      setPermissions(mockDocument.permissions || permissions);
      setVersionHistory(mockVersions);

      // Mock lock status
      const randomLocked = Math.random() > 0.7; // 30% chance document is locked
      setIsLocked(randomLocked);
      if (randomLocked) {
        setLockedBy('Sarah Johnson');
        // Set expiration to 30 minutes from now
        setLockExpiration(new Date(Date.now() + 30 * 60 * 1000));
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [documentId, transactionId, canEditDocument, isAdmin, permissions]);

  // Initialize document data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        await fetchDocument();
      } catch (err) {
        if (isMounted) {
          console.error('Error in load effect:', err);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      clearAllTimeouts();
    };
  }, [documentId, transactionId, fetchDocument, clearAllTimeouts]);

  // Handle lock/unlock
  const handleLockToggle = useCallback(() => {
    if (isLocked && lockedBy !== 'You') {
      // Cannot unlock if locked by someone else
      return;
    }

    if (isLocked) {
      // Unlock document
      setIsLocked(false);
      setLockedBy(null);
      setLockExpiration(null);

      if (onUnlock) {
        onUnlock(documentId);
      }
    } else {
      // Lock document
      setIsLocked(true);
      setLockedBy('You');
      // Set expiration to 30 minutes from now
      setLockExpiration(new Date(Date.now() + 30 * 60 * 1000));

      if (onLock) {
        onLock(documentId);
      }
    }
  }, [isLocked, lockedBy, documentId, onLock, onUnlock]);

  // Handle archiving document in the shield vault
  const handleArchiveConfirm = useCallback(() => {
    setIsArchiving(true);

    // Simulate API call to archive document
    const timeoutId = window.setTimeout(() => {
      if (onArchive) {
        onArchive(documentId, retentionPeriod);
      }
      setIsArchiving(false);
      setShowArchiveConfirm(false);

      // Show success message
      alert(`Document has been securely archived in Shield Vault for ${retentionPeriod} months.`);
    }, 1500);

    timeoutRefs.current.push(timeoutId);
  }, [documentId, retentionPeriod, onArchive]);

  // Handle version selection
  const handleVersionSelect = useCallback((version: FileVersion) => {
    setSelectedVersion(version);
    // In a real app, this would load the specific version content
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }, []);

  // Format date
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Navigate to the filelock drive for this document
  const goToFileLock = useCallback(() => {
    navigate(`/filelock-drive/${transactionId}?documentId=${documentId}`);
  }, [navigate, transactionId, documentId]);

  // Toggle archive confirmation
  const toggleArchiveConfirm = useCallback((show: boolean) => {
    setShowArchiveConfirm(show);
  }, []);

  // Set active tab
  const handleTabChange = useCallback(
    (tab: 'preview' | 'versions' | 'activity' | 'permissions') => {
      setActiveTab(tab);
    },
    []
  );

  // Handle retention period change
  const handleRetentionPeriodChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRetentionPeriod(Number(e.target.value));
  }, []);

  // Handle back button
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);

  // Get visible versions
  const displayedVersions = useMemo(() => {
    return versionHistory.slice(0, visibleVersions);
  }, [versionHistory, visibleVersions]);

  // Render document header (icon, name, size)
  const renderDocumentHeader = () => {
    if (!document) return null;
    return (
      <div className="flex items-center p-4 border-b border-gray-200">
        <FontAwesomeIcon
          icon={document.thumbnailIcon || getFileIcon(document.type)}
          className="h-10 w-10 text-gray-500 mr-4 flex-shrink-0"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-700">{document.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{formatFileSize(document.size || 0)}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !document) {
    return <ErrorMessage error={error} onRetry={retryLoading} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Header with document controls */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={handleBack} className="mr-2 text-gray-500 hover:text-gray-700">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-gray-900">{document.name}</h2>
        </div>

        <div className="flex space-x-2">
          {/* Action buttons */}
          {permissions.canEdit && (
            <button
              onClick={handleLockToggle}
              disabled={isLocked && lockedBy !== 'You'}
              className={`px-3 py-1 text-sm rounded-md flex items-center ${
                isLocked
                  ? lockedBy === 'You'
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-red-100 text-red-800 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {isLocked ? (
                <>
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  {lockedBy === 'You' ? 'Unlock' : `Locked by ${lockedBy}`}
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Lock for Editing
                </>
              )}
            </button>
          )}

          {/* Archive in Shield Vault Button */}
          {isAdmin && (
            <button
              onClick={() => toggleArchiveConfirm(true)}
              className="px-3 py-1 text-sm bg-green-100 text-green-800 hover:bg-green-200 rounded-md flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Archive in Shield Vault
            </button>
          )}

          {/* File Lock Link Button */}
          <button
            onClick={goToFileLock}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in FileLock Drive
          </button>

          {/* Download Button */}
          {permissions.canDownload && (
            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          )}

          {/* Close Button */}
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'preview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('preview')}
          >
            Preview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'versions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('versions')}
          >
            Version History
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'activity'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('activity')}
          >
            Activity Log
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              activeTab === 'permissions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => handleTabChange('permissions')}
          >
            Permissions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === 'preview' && (
            <div className="flex flex-col items-center justify-center p-4 h-full">
              {/* Document Preview Placeholder - In a real app, this would be a PDF viewer */}
              <div className="w-full max-w-3xl bg-gray-100 rounded-lg shadow flex flex-col items-center justify-center h-[600px]">
                <div className="relative">
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    ref={imageRef}
                    src={document.thumbnailUrl || 'https://via.placeholder.com/100x120?text=PDF'}
                    alt="Document preview"
                    className={`w-16 h-20 mb-4 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={handleImageLoad}
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-700">{document.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{formatFileSize(document.size || 0)}</p>

                {/* Lock Indicator */}
                {isLocked && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3 max-w-md">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-amber-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">Document is locked</h3>
                        <div className="mt-1 text-sm text-amber-700">
                          <p>
                            {lockedBy === 'You'
                              ? 'You have locked this document for editing.'
                              : `This document is currently locked for editing by ${lockedBy}.`}
                          </p>
                          {lockExpiration && (
                            <p className="mt-1">
                              Lock expires: {formatDate(lockExpiration.toISOString())}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-8 text-gray-500">
                  This is a preview placeholder. In a real implementation, a PDF viewer would be
                  displayed here.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Version History</h3>

              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul className="divide-y divide-gray-200">
                  {displayedVersions.map(version => (
                    <VersionItem
                      key={version.id}
                      version={version}
                      isSelected={selectedVersion?.id === version.id}
                      formatDate={formatDate}
                      formatFileSize={formatFileSize}
                      onSelect={handleVersionSelect}
                    />
                  ))}
                </ul>

                {/* Load more versions trigger */}
                {versionHistory.length > visibleVersions && (
                  <div className="text-center py-4 border-t border-gray-200">
                    <button
                      onClick={loadMoreVersions}
                      className="px-4 py-2 text-sm text-primary-600 hover:text-primary-800"
                    >
                      Load More Versions
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tabs content would follow */}
        </Suspense>
      </div>

      {/* Archive Confirmation Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  Archive Document in Shield Vault
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This document will be securely stored in Shield Vault with blockchain verification
                  and automated retention policies.
                </p>

                <div className="mt-4">
                  <label
                    htmlFor="retention-period"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Retention Period
                  </label>
                  <div className="mt-1">
                    <select
                      id="retention-period"
                      value={retentionPeriod}
                      onChange={handleRetentionPeriodChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="12">12 months (1 year)</option>
                      <option value="24">24 months (2 years)</option>
                      <option value="36">36 months (3 years)</option>
                      <option value="60">60 months (5 years)</option>
                      <option value="84">84 months (7 years)</option>
                      <option value="120">120 months (10 years)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleArchiveConfirm}
                    disabled={isArchiving}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${isArchiving ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isArchiving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Archiving...
                      </>
                    ) : (
                      'Archive Document'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleArchiveConfirm(false)}
                    disabled={isArchiving}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(TransactionDocumentViewer);
