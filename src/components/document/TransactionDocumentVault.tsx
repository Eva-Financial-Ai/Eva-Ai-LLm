import React, { useState, useEffect } from 'react';
import useDocumentVault from '../../hooks/useDocumentVault';
import { FileItem } from './FilelockDriveApp';
import ShieldDocumentEscrowVault from './ShieldDocumentEscrowVault';
import { UserType } from '../../services/DocumentSecurityService';

interface TransactionDocumentVaultProps {
  transactionId: string;
  transactionStatus: 'draft' | 'in_progress' | 'pending_signatures' | 'funded' | 'completed';
  initialDocuments: FileItem[];
  userType: UserType;
  onDocumentsUpdate?: (updatedDocuments: FileItem[]) => void;
}

const TransactionDocumentVault: React.FC<TransactionDocumentVaultProps> = ({
  transactionId,
  transactionStatus,
  initialDocuments,
  userType,
  onDocumentsUpdate,
}) => {
  const [documents, setDocuments] = useState<FileItem[]>(initialDocuments);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<{
    recommendation: string;
    retentionPeriod: number;
    reasoning: string;
  } | null>(null);

  // Map transactionStatus to the format expected by ShieldDocumentEscrowVault
  const mapTransactionStatus = (
    status: string
  ): 'draft' | 'in_progress' | 'funded' | 'completed' => {
    if (status === 'pending_signatures') {
      return 'in_progress'; // Map pending_signatures to in_progress for the vault
    }
    return status as 'draft' | 'in_progress' | 'funded' | 'completed';
  };

  // Use the document vault hook to manage documents
  const [vaultState, vaultActions] = useDocumentVault({
    transactionId,
    initialDocuments: documents,
    userType,
    transactionStatus,
  });

  // Update documents when they change in the vault
  useEffect(() => {
    setDocuments(vaultState.documents);

    // Call parent callback if provided
    if (onDocumentsUpdate) {
      onDocumentsUpdate(vaultState.documents);
    }
  }, [vaultState.documents, onDocumentsUpdate]);

  // Handle document selection for AI recommendation
  const handleDocumentSelect = async (documentId: string) => {
    setSelectedDocument(documentId);
    setShowAIRecommendation(true);

    try {
      // Get AI recommendation
      const recommendation = await vaultActions.getAIRetentionProtocol(documentId);
      setAiRecommendation(recommendation);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      setAiRecommendation(null);
    }
  };

  // Format retention period for display
  const formatRetentionPeriod = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Shield Document Escrow Vault component */}
      <ShieldDocumentEscrowVault
        documents={documents}
        transactionId={transactionId}
        transactionStatus={mapTransactionStatus(transactionStatus)}
        userType={userType}
        onUpdateDocuments={updatedDocs => setDocuments(updatedDocs)}
      />

      {/* AI Recommendation Panel */}
      {showAIRecommendation && selectedDocument && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-white font-medium text-xl flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              EVA AI Retention Protocol
            </h2>
            <p className="text-indigo-100 mt-1">AI-recommended document retention analysis</p>
          </div>

          <div className="p-6">
            {aiRecommendation ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {documents.find(d => d.id === selectedDocument)?.name}
                    </h3>
                    <p className="text-sm text-gray-500">Document AI Analysis</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {aiRecommendation.recommendation}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">
                    Recommended Retention Period:
                  </h4>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    {formatRetentionPeriod(aiRecommendation.retentionPeriod)}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">AI Reasoning:</h4>
                  <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {aiRecommendation.reasoning}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <button
                      onClick={() => setShowAIRecommendation(false)}
                      className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Close
                    </button>

                    <div className="flex space-x-3 mt-3 sm:mt-0">
                      <button
                        onClick={() => {
                          // Apply AI recommendation
                          const doc = documents.find(d => d.id === selectedDocument);
                          if (doc) {
                            vaultActions.lockDocument(selectedDocument);
                          }
                          setShowAIRecommendation(false);
                        }}
                        className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      >
                        Apply Recommendation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
                <p className="mt-4 text-base text-gray-500">Analyzing document content...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Document List with AI Analysis button */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Transaction Documents</h3>
          <button
            onClick={() => vaultActions.lockAllDocuments()}
            disabled={vaultState.isLockingAll || documents.length === 0}
            className={`px-4 py-2 text-sm font-medium rounded-md
              ${
                vaultState.isLockingAll || documents.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
          >
            {vaultState.isLockingAll ? 'Processing...' : 'Lock All in Vault'}
          </button>
        </div>

        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {documents.map(document => (
              <li key={document.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {document.type === 'pdf' ? (
                        <svg
                          className="h-10 w-10 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : document.type === 'docx' ? (
                        <svg
                          className="h-10 w-10 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-10 w-10 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-gray-900">{document.name}</h4>
                      <p className="text-sm text-gray-500">
                        {document.size ? `${(document.size / 1024).toFixed(1)} KB` : 'Unknown size'}{' '}
                        •
                        {document.lastModified
                          ? new Date(document.lastModified).toLocaleDateString()
                          : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vaultState.lockedDocuments[document.id] ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg
                          className="-ml-0.5 mr-1.5 h-3 w-3 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Locked
                      </span>
                    ) : (
                      <button
                        onClick={() => vaultActions.lockDocument(document.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Lock Document
                      </button>
                    )}
                    <button
                      onClick={() => handleDocumentSelect(document.id)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg
                        className="-ml-0.5 mr-1.5 h-4 w-4 text-indigo-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                      AI Analysis
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {documents.length === 0 && (
              <li className="px-4 py-8 sm:px-6 text-center text-gray-500">
                No documents available
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionDocumentVault;
