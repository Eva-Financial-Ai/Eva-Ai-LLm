import React, { useState, useRef, useEffect, useContext } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { UserContext } from '../../contexts/UserContext';
// Sub-components
import FileExplorer from '../../components/document/FileExplorer';
import DocumentViewer from '../../components/document/DocumentViewer';
import PDFEditor from '../../components/document/PDFEditor';
import SignatureWorkflow from '../../components/document/SignatureWorkflow';
import SharedWithMe from './SharedWithMe';
import { useNavigate } from 'react-router-dom';
// Utilities for enhanced features
import { motion, AnimatePresence } from 'framer-motion';
import ShieldVaultDashboard from './ShieldVaultDashboard';
import FileChatPanel from './FileChatPanel';

// Types
export interface FileItem {
  id: string;
  name: string;
  type: string; // 'folder', 'pdf', 'image', 'document', 'spreadsheet', etc.
  size?: number;
  lastModified: string;
  createdAt: string;
  path: string;
  parentId: string | null;
  isStarred?: boolean;
  isShared?: boolean;
  isPasswordProtected?: boolean;
  passwordHash?: string; // Hashed password for security
  owner: string;
  signatureStatus?: 'unsigned' | 'awaiting' | 'completed' | 'rejected';
  thumbnailUrl?: string;
  thumbnailIcon?: any; // Added to support icon-based thumbnails
  downloadUrl?: string;
  permissions?: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
    canDownload: boolean;
    canComment: boolean; // New permission for commenting
  };
  sharedWith?: Array<{
    id: string;
    name: string;
    email: string;
    permission: 'viewer' | 'editor' | 'signer' | 'commenter';
    needsPassword?: boolean;
  }>;
  lastAccessed?: string;
  versionHistory?: FileVersion[];
  tags?: string[];
  aiSummary?: string;
  ocrProcessed?: boolean;
  encryptionStatus?: 'encrypted' | 'decrypted';
  expirationDate?: string;
  collaborators?: Array<{
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'editor' | 'viewer' | 'commenter';
    lastActive?: string;
  }>;
  comments?: FileComment[];
  blockchainVerified?: boolean;
  blockchainTxId?: string;
  versions?: Array<{
    id: string;
    timestamp: string;
    author: string;
  }>;
  activity?: Array<{
    type: string;
    timestamp: string;
    user: string;
    details?: string;
  }>;
}

export interface FileComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  resolved?: boolean;
  replies?: FileComment[];
  text?: string;
  author?: string;
}

export interface FileVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  size: number;
  notes?: string;
}

export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  createdAt: string;
  color?: string;
}

// Views
type ViewMode =
  | 'explorer'
  | 'viewer'
  | 'editor'
  | 'signature'
  | 'shared'
  | 'ai-processing'
  | 'version-history'
  | 'permissions'
  | 'shield-vault';

// Main component
const FilelockDriveApp: React.FC = () => {
  const { currentTransaction } = useWorkflow();
  const { userRole } = useContext(UserContext);
  const navigate = useNavigate();

  // View state
  const [currentView, setCurrentView] = useState<ViewMode>('explorer');
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current path breadcrumb
  const [pathHistory, setPathHistory] = useState<Folder[]>([
    {
      id: 'root',
      name: 'My Drive',
      path: '/',
      parentId: null,
      createdAt: new Date().toISOString(),
    },
  ]);

  // New feature states
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiProcessingStatus, setAIProcessingStatus] = useState<
    'idle' | 'processing' | 'completed' | 'error'
  >('idle');
  const [currentAIAction, setCurrentAIAction] = useState<
    'summarize' | 'extract' | 'translate' | 'analyze' | 'chat' | null
  >(null);

  // Version history state
  const [versionHistory, setVersionHistory] = useState<FileVersion[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Document collaboration state
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [currentCollaborators, setCurrentCollaborators] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);

  // E-signature workflow state
  const [signatureWorkflowStatus, setSignatureWorkflowStatus] = useState<
    'not_started' | 'in_progress' | 'completed'
  >('not_started');
  const [signatureRequest, setSignatureRequest] = useState<any | null>(null);

  // Security and permissions state
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);

  // Quick access folders
  const [quickAccessFolders, setQuickAccessFolders] = useState<string[]>(['folder-1']);

  // Tags management
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Important',
    'Confidential',
    'Draft',
    'Final',
    'For Review',
    'Approved',
    'Contract',
    'Financial',
    'Legal',
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data - in a real app this would come from an API
  const [files, setFiles] = useState<FileItem[]>([
    // Root folders
    {
      id: 'folder-1',
      name: 'Loan Documents',
      type: 'folder',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Loan Documents',
      parentId: 'root',
      owner: 'me',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    {
      id: 'folder-2',
      name: 'Financial Statements',
      type: 'folder',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Financial Statements',
      parentId: 'root',
      owner: 'me',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    // Files in root
    {
      id: 'file-1',
      name: 'Business Plan.pdf',
      type: 'pdf',
      size: 2500000, // 2.5MB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Business Plan.pdf',
      parentId: 'root',
      isStarred: true,
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=PDF',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    {
      id: 'file-2',
      name: 'Loan Agreement.pdf',
      type: 'pdf',
      size: 1800000, // 1.8MB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Loan Agreement.pdf',
      parentId: 'root',
      signatureStatus: 'awaiting',
      owner: 'me',
      isShared: true,
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=PDF',
      downloadUrl: '#',
      sharedWith: [
        { id: 'user-1', name: 'John Smith', email: 'john@example.com', permission: 'signer' },
        { id: 'user-2', name: 'Sarah Johnson', email: 'sarah@example.com', permission: 'viewer' },
      ],
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    // Files in Loan Documents folder
    {
      id: 'file-3',
      name: 'Loan Application.pdf',
      type: 'pdf',
      size: 1200000, // 1.2MB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Loan Documents/Loan Application.pdf',
      parentId: 'folder-1',
      signatureStatus: 'completed',
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=PDF',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    {
      id: 'file-4',
      name: 'Collateral Documentation.pdf',
      type: 'pdf',
      size: 3500000, // 3.5MB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Loan Documents/Collateral Documentation.pdf',
      parentId: 'folder-1',
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=PDF',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    // Files in Financial Statements folder
    {
      id: 'file-5',
      name: 'Balance Sheet 2023.xlsx',
      type: 'spreadsheet',
      size: 780000, // 780KB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Financial Statements/Balance Sheet 2023.xlsx',
      parentId: 'folder-2',
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=XLSX',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    {
      id: 'file-6',
      name: 'Cash Flow Statement.xlsx',
      type: 'spreadsheet',
      size: 850000, // 850KB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Financial Statements/Cash Flow Statement.xlsx',
      parentId: 'folder-2',
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=XLSX',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    {
      id: 'file-7',
      name: 'Income Statement.xlsx',
      type: 'spreadsheet',
      size: 920000, // 920KB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Financial Statements/Income Statement.xlsx',
      parentId: 'folder-2',
      owner: 'me',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=XLSX',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    },
    // Shared files
    {
      id: 'file-8',
      name: 'Tax Returns 2022.pdf',
      type: 'pdf',
      size: 4200000, // 4.2MB
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: '/Tax Returns 2022.pdf',
      parentId: 'root',
      isShared: true,
      owner: 'John Smith',
      thumbnailUrl: 'https://via.placeholder.com/100x120?text=PDF',
      downloadUrl: '#',
      permissions: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canShare: false,
        canDownload: true,
        canComment: false,
      },
    },
  ]);

  // Filter files based on current folder and search query
  const filteredFiles = files.filter(file => {
    // Filter by folder
    const folderMatch = file.parentId === currentFolder;

    // Filter by search (if search query exists)
    const searchMatch = searchQuery
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return folderMatch && searchMatch;
  });

  // Sort files: folders first, then by selected criteria
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Always put folders first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    // Then sort by the selected criteria
    if (sortBy === 'name') {
      return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }

    if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
        : new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }

    if (sortBy === 'size') {
      const aSize = a.size || 0;
      const bSize = b.size || 0;
      return sortDirection === 'asc' ? aSize - bSize : bSize - aSize;
    }

    return 0;
  });

  // Navigate to folder
  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);

    // Update path history for breadcrumbs
    if (folderId === 'root') {
      setPathHistory([
        {
          id: 'root',
          name: 'My Drive',
          path: '/',
          parentId: null,
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      const folder = files.find(f => f.id === folderId);
      if (folder) {
        // Split path and create breadcrumb items
        const pathParts = folder.path.split('/').filter(part => part);
        let currentPath = '';
        const newPathHistory = [
          {
            id: 'root',
            name: 'My Drive',
            path: '/',
            parentId: null,
            createdAt: new Date().toISOString(),
          },
        ];

        pathParts.forEach((part, index) => {
          currentPath += `/${part}`;
          const partFolder = files.find(f => f.path === currentPath && f.type === 'folder');
          if (partFolder) {
            newPathHistory.push({
              id: partFolder.id,
              name: partFolder.name,
              path: currentPath,
              parentId: null, // Set parentId to null to match type
              createdAt: partFolder.createdAt,
            });
          }
        });

        setPathHistory(newPathHistory);
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id, file.name);
    } else {
      setSelectedFile(file);

      // Open appropriate view based on file type
      if (file.signatureStatus === 'awaiting') {
        setCurrentView('signature');
      } else if (file.type === 'pdf') {
        setCurrentView('viewer');
      } else {
        setCurrentView('viewer');
      }
    }
  };

  // AI Processing Functionality
  const handleAIProcessing = (
    file: FileItem,
    action: 'summarize' | 'extract' | 'translate' | 'analyze'
  ) => {
    setSelectedFile(file);
    setCurrentAIAction(action);
    setAIProcessingStatus('processing');
    setShowAIPanel(true);

    // Simulate AI processing
    setTimeout(() => {
      setAIProcessingStatus('completed');

      // Update file with AI results
      const updatedFile = { ...file };

      if (action === 'summarize') {
        updatedFile.aiSummary =
          'This document contains financial information related to the loan application, including cash flow projections, balance sheets, and revenue forecasts for the next 12 months.';
      } else if (action === 'extract') {
        // Simulate extracted data
      } else if (action === 'translate') {
        // Simulate translation
      } else if (action === 'analyze') {
        // Simulate analysis
      }

      // Update the file in the state
      setFiles(prevFiles => prevFiles.map(f => (f.id === file.id ? updatedFile : f)));

      setSelectedFile(updatedFile);
    }, 2000);
  };

  // Document Collaboration
  const handleAddCollaborator = (
    fileId: string,
    collaborator: { name: string; email: string; role: 'viewer' | 'editor' | 'commenter' }
  ) => {
    // In a real app, this would send invitations, etc.
    setFiles(prevFiles => {
      return prevFiles.map(file => {
        if (file.id === fileId) {
          const collaborators = file.collaborators || [];
          return {
            ...file,
            collaborators: [
              ...collaborators,
              {
                id: `collab-${Date.now()}`,
                name: collaborator.name,
                email: collaborator.email,
                role: collaborator.role,
                lastActive: new Date().toISOString(),
              },
            ],
            isShared: true,
          };
        }
        return file;
      });
    });
  };

  const handleAddComment = (fileId: string, comment: string) => {
    setFiles(prevFiles => {
      return prevFiles.map(file => {
        if (file.id === fileId) {
          const comments = file.comments || [];
          return {
            ...file,
            comments: [
              ...comments,
              {
                id: `comment-${Date.now()}`,
                userId: 'current-user',
                userName: 'Current User',
                userAvatar: '/avatars/user1.jpg',
                content: comment,
                timestamp: new Date().toISOString(),
                resolved: false,
                replies: [],
              },
            ],
          };
        }
        return file;
      });
    });
  };

  // Version Management
  const handleCreateVersion = (fileId: string, notes?: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const currentVersions = file.versionHistory || [];
    const newVersion: FileVersion = {
      id: `version-${Date.now()}`,
      versionNumber: currentVersions.length + 1,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User',
      size: file.size || 0,
      notes: notes,
    };

    setFiles(prevFiles => {
      return prevFiles.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            versionHistory: [...(file.versionHistory || []), newVersion],
          };
        }
        return file;
      });
    });

    setVersionHistory([...currentVersions, newVersion]);
  };

  const handleRevertToVersion = (fileId: string, versionId: string) => {
    // In a real app, this would restore a previous version
    console.log(`Reverting file ${fileId} to version ${versionId}`);

    // Close the version history view
    setShowVersionHistory(false);
  };

  // E-signature workflow
  const handleInitiateSignature = (
    fileId: string,
    signers: Array<{ name: string; email: string; role: string }>
  ) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Create a signature request
    const request = {
      id: `sig-req-${Date.now()}`,
      fileId: fileId,
      fileName: file.name,
      signers: signers,
      status: 'awaiting',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    setSignatureRequest(request);
    setSignatureWorkflowStatus('in_progress');

    // Update the file status
    setFiles(prevFiles => {
      return prevFiles.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            signatureStatus: 'awaiting',
            isShared: true,
            sharedWith: signers.map(signer => ({
              id: `signer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: signer.name,
              email: signer.email,
              permission: 'signer' as const,
            })),
          };
        }
        return file;
      });
    });

    // Navigate to signature view
    setCurrentView('signature');
  };

  // Handle file upload
  const handleFileUpload = (files: FileList) => {
    setIsUploading(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);

        // Add uploaded files to the current folder
        Array.from(files).forEach((file, index) => {
          // Determine file type
          let type = 'document';
          if (file.type.includes('pdf')) type = 'pdf';
          else if (file.type.includes('image')) type = 'image';
          else if (
            file.type.includes('spreadsheet') ||
            file.name.endsWith('.xlsx') ||
            file.name.endsWith('.xls')
          )
            type = 'spreadsheet';

          const newFile: FileItem = {
            id: `file-new-${Date.now()}-${index}`,
            name: file.name,
            type,
            size: file.size,
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            path:
              currentFolder === 'root'
                ? `/${file.name}`
                : `${(files as unknown as FileItem[]).find(f => f.id === currentFolder)?.path || ''}/${file.name}`,
            parentId: currentFolder,
            owner: 'me',
            thumbnailUrl: `https://via.placeholder.com/100x120?text=${type.toUpperCase()}`,
            downloadUrl: '#',
            permissions: {
              canView: true,
              canEdit: true,
              canDelete: true,
              canShare: true,
              canDownload: true,
              canComment: true,
            },
          };

          setFiles(prevFiles => [...prevFiles, newFile]);
        });
      }
    }, 100);
  };

  // Create new folder
  const handleCreateFolder = (folderName: string) => {
    const parentFolder = files.find(file => file.id === currentFolder);
    const newFolder: FileItem = {
      id: `folder-${Date.now()}`,
      name: folderName,
      type: 'folder',
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path:
        currentFolder === 'root' ? `/${folderName}` : `${parentFolder?.path || ''}/${folderName}`,
      parentId: currentFolder,
      owner: 'me',
      permissions: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canShare: true,
        canDownload: true,
        canComment: true,
      },
    };

    setFiles(prevFiles => [...prevFiles, newFolder]);
  };

  // Delete files
  const handleDelete = (fileIds: string[]) => {
    setFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
  };

  // Share files
  const handleShare = (
    fileId: string,
    recipients: Array<{ email: string; permission: 'viewer' | 'editor' | 'signer' }>
  ) => {
    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            isShared: true,
            sharedWith: [
              ...(file.sharedWith || []),
              ...recipients.map((r, index) => ({
                id: `user-new-${Date.now()}-${index}`,
                name: r.email.split('@')[0],
                email: r.email,
                permission: r.permission,
              })),
            ],
          };
        }
        return file;
      })
    );
  };

  // Handle signature workflow
  const handleSignatureWorkflow = (
    fileId: string,
    status: 'unsigned' | 'awaiting' | 'completed' | 'rejected'
  ) => {
    setFiles(prevFiles =>
      prevFiles.map(file => {
        if (file.id === fileId) {
          return {
            ...file,
            signatureStatus: status,
          };
        }
        return file;
      })
    );
  };

  // Add UI for Shield Vault navigation tab
  const renderNavigation = () => {
    return (
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`${
            currentView === 'explorer'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          } px-4 py-3 text-sm font-medium`}
          onClick={() => setCurrentView('explorer')}
        >
          My Drive
        </button>

        <button
          className={`${
            currentView === 'shield-vault'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          } px-4 py-3 text-sm font-medium flex items-center`}
          onClick={() => setCurrentView('shield-vault')}
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Shield Vault
        </button>

        <button
          className={`${
            currentView === 'shared'
              ? 'border-b-2 border-primary-500 text-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          } px-4 py-3 text-sm font-medium`}
          onClick={() => setCurrentView('shared')}
        >
          Shared with Me
        </button>
      </div>
    );
  };

  // Add a state to manage the share dialog
  const [fileIdToShare, setShowShareDialog] = useState<string | null>(null);

  // Then modify the handleShare function usage to be called when the share dialog is confirmed
  // Add a useEffect to watch for fileIdToShare changes if needed
  useEffect(() => {
    if (fileIdToShare && selectedFile) {
      // Show a share dialog or modal here
      // When the dialog is confirmed with recipients, call handleShare(fileIdToShare, recipients)
      // Reset after handling
      // setShowShareDialog(null);
    }
  }, [fileIdToShare, selectedFile]);

  // Document viewing and actions
  // Add a method to handle the Chat With File feature in FilelockDriveApp component
  const handleChatWithFile = (file: FileItem) => {
    setSelectedFile(file);
    // Set a new view state for the chat interface
    setShowAIPanel(true);
    setCurrentAIAction('chat');
  };

  // Pass this handler to the DocumentViewer component when rendering it
  const renderDocumentViewer = () => {
    if (!selectedFile) return null;

    return (
      <DocumentViewer
        file={selectedFile}
        onBack={() => {
          setCurrentView('explorer');
          setSelectedFile(null);
        }}
        onEdit={() => setCurrentView('editor')}
        onSign={() => setCurrentView('signature')}
        onShare={() => handleShare(selectedFile.id, [])}
        onDelete={() => handleDelete([selectedFile.id])}
        onDownload={() => console.log('Download file:', selectedFile.name)}
        onUpdateFile={updatedFile => {
          const updatedFiles = files.map(f => (f.id === updatedFile.id ? updatedFile : f));
          setFiles(updatedFiles);
          setSelectedFile(updatedFile);
        }}
        onChatWithFile={() => handleChatWithFile(selectedFile)}
      />
    );
  };

  return (
    <div className="filelock-drive-app h-full flex flex-col">
      {renderNavigation()}

      {currentView === 'explorer' && (
        <FileExplorer
          files={sortedFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          onFileSelect={handleFileSelect}
          onUpload={handleFileUpload}
          onCreateFolder={handleCreateFolder}
          onDelete={handleDelete}
          onShare={() => setShowShareDialog(selectedFile?.id || null)}
          isGridView={isGridView}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      )}

      {currentView === 'shield-vault' && (
        <ShieldVaultDashboard transactionId={currentTransaction?.id} />
      )}

      {currentView === 'shared' && (
        <SharedWithMe
          files={files.filter(file => file.isShared)}
          onFileSelect={handleFileSelect}
          isGridView={isGridView}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
        />
      )}

      {currentView === 'viewer' && selectedFile && (
        <div className="flex flex-grow h-[calc(100vh-200px)] overflow-hidden">
          <div
            className={`flex-1 ${showVersionHistory || showAIPanel || showComments || showCollaborationPanel ? 'w-3/4' : 'w-full'}`}
          >
            {renderDocumentViewer()}
          </div>

          {/* Sidebar panels */}
          {showAIPanel && (
            <div className="sidebar-panel w-1/4 h-full">
              {currentAIAction === 'chat' ? (
                <FileChatPanel
                  file={selectedFile}
                  onClose={() => {
                    setShowAIPanel(false);
                    setCurrentAIAction(null);
                  }}
                />
              ) : (
                <div className="ai-processing-panel p-4 border-l border-gray-200 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">AI Document Processing</h3>
                    <button
                      onClick={() => {
                        setShowAIPanel(false);
                        setCurrentAIAction(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleAIProcessing(selectedFile, 'summarize')}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      disabled={aiProcessingStatus === 'processing'}
                    >
                      Summarize Document
                    </button>

                    <button
                      onClick={() => handleAIProcessing(selectedFile, 'extract')}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                      disabled={aiProcessingStatus === 'processing'}
                    >
                      Extract Key Data
                    </button>

                    <button
                      onClick={() => handleAIProcessing(selectedFile, 'analyze')}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md"
                      disabled={aiProcessingStatus === 'processing'}
                    >
                      Analyze Document
                    </button>

                    {aiProcessingStatus === 'completed' && selectedFile.aiSummary && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary</h4>
                        <p className="text-sm text-gray-600">{selectedFile.aiSummary}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other sidebar panels (version history, comments, collaboration) */}
          {(showVersionHistory || showComments || showCollaborationPanel) && (
            <div className="w-1/4 border-l border-gray-200 overflow-y-auto p-4">
              {/* Version History Panel */}
              {showVersionHistory && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Version History</h3>
                    <button
                      onClick={() => setShowVersionHistory(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleCreateVersion(selectedFile.id, 'Manual version save')}
                      className="w-full px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                    >
                      Create New Version
                    </button>

                    {selectedFile.versionHistory && selectedFile.versionHistory.length > 0 ? (
                      <ul className="mt-3 space-y-2">
                        {selectedFile.versionHistory.map(version => (
                          <li key={version.id} className="border rounded-md p-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">
                                Version {version.versionNumber}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(version.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">By {version.createdBy}</div>
                            {version.notes && (
                              <div className="text-xs mt-1 text-gray-700">{version.notes}</div>
                            )}
                            <button
                              onClick={() => handleRevertToVersion(selectedFile.id, version.id)}
                              className="mt-2 text-xs text-primary-600 hover:text-primary-700"
                            >
                              Revert to this version
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No version history available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Comments Panel */}
              {showComments && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Comments</h3>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Add a comment"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(selectedFile.id, 'This is a new comment')}
                        className="px-3 py-2 bg-primary-600 text-white rounded-r-md text-sm"
                      >
                        Post
                      </button>
                    </div>

                    {selectedFile.comments && selectedFile.comments.length > 0 ? (
                      <ul className="space-y-3 mt-4">
                        {selectedFile.comments.map(comment => (
                          <li key={comment.id} className="border-b pb-3">
                            <div className="flex items-start">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                              <div className="ml-2 flex-1">
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium">{comment.userName}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm mt-1">{comment.content}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 mt-4">No comments yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Cloud Storage Connections */}
              {showCollaborationPanel && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Share & Collaborate</h3>
                    <button
                      onClick={() => setShowCollaborationPanel(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Add Collaborators</h4>
                      <div className="flex">
                        <input
                          type="text"
                          placeholder="Email address"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm"
                        />
                        <button
                          onClick={() =>
                            handleAddCollaborator(selectedFile.id, {
                              name: 'New Collaborator',
                              email: 'collaborator@example.com',
                              role: 'editor',
                            })
                          }
                          className="px-3 py-2 bg-primary-600 text-white rounded-r-md text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Current Collaborators</h4>
                      {selectedFile.collaborators && selectedFile.collaborators.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedFile.collaborators.map(collab => (
                            <li
                              key={collab.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span>
                                {collab.name} ({collab.email})
                              </span>
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                {collab.role}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No collaborators yet</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">E-Signature</h4>
                      <button
                        onClick={() =>
                          handleInitiateSignature(selectedFile.id, [
                            { name: 'John Doe', email: 'john@example.com', role: 'Signer' },
                            { name: 'Jane Smith', email: 'jane@example.com', role: 'Reviewer' },
                          ])
                        }
                        className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md"
                      >
                        Initialize E-Signature Process
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {currentView === 'editor' && selectedFile && (
        <PDFEditor
          file={selectedFile}
          onSave={(editedFile: FileItem) => {
            // Update file in the state
            setFiles(prevFiles =>
              prevFiles.map(file => (file.id === editedFile.id ? editedFile : file))
            );
            setSelectedFile(editedFile);
            setCurrentView('viewer');
          }}
          onCancel={() => setCurrentView('viewer')}
        />
      )}

      {currentView === 'signature' && selectedFile && (
        <SignatureWorkflow
          file={selectedFile}
          onBack={() => setCurrentView('viewer')}
          onComplete={(status: 'completed' | 'rejected') => {
            // Update file in the state with the new signature status
            const updatedFile = { ...selectedFile, signatureStatus: status };
            setFiles(prevFiles =>
              prevFiles.map(file => (file.id === updatedFile.id ? updatedFile : file))
            );
            setSelectedFile(updatedFile);
            setCurrentView('viewer');
          }}
        />
      )}
    </div>
  );
};

export default FilelockDriveApp;
