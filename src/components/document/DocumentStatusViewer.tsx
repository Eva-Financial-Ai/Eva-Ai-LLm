import React, { useState, useEffect } from 'react';
import { TermSheetDocument } from '../../services/DocumentGenerationService';
import DocumentTrackingService, {
  DocumentStatusUpdate,
  DocumentTrackingResult,
} from '../../services/DocumentTrackingService';

interface DocumentStatusViewerProps {
  documentId: string;
  onClose: () => void;
}

const DocumentStatusViewer: React.FC<DocumentStatusViewerProps> = ({ documentId, onClose }) => {
  const [trackingResult, setTrackingResult] = useState<DocumentTrackingResult | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load document status on mount and set up refresh interval
  useEffect(() => {
    const loadDocumentStatus = () => {
      try {
        const result = DocumentTrackingService.getDocumentStatus(documentId);
        setTrackingResult(result);
        setLoading(false);
      } catch (err) {
        console.error('Error loading document status:', err);
        setError('Failed to load document status. Please try again.');
        setLoading(false);
      }
    };

    // Initial load
    loadDocumentStatus();

    // Set up refresh interval (every 5 seconds)
    const interval = window.setInterval(loadDocumentStatus, 5000);
    setRefreshInterval(interval);

    // Clean up interval on unmount
    return () => {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [documentId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Get status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'signed':
      case 'verified':
      case 'fully_signed':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'partially_signed':
      case 'pending_signatures':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Loading document status...</span>
      </div>
    );
  }

  if (error || !trackingResult) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-700">{error || 'Document not found or unavailable.'}</p>
        <button
          onClick={onClose}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Close
        </button>
      </div>
    );
  }

  const { document, statusUpdates, isFundingEligible, pendingItems, completedItems } =
    trackingResult;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Document Status</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Document Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Document Name</p>
            <p className="font-medium">{document.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-medium">{document.transactionId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created Date</p>
            <p className="font-medium">{formatDate(document.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expires On</p>
            <p className="font-medium">{formatDate(document.expiresAt)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Status</p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(document.status)}`}
              >
                {document.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              {isFundingEligible && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ready for Funding
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Participant Status */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-medium text-gray-900 mb-3">Participant Status</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Participant
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Signature
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  KYC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  KYB
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {document.participants.map(participant => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                    <div className="text-sm text-gray-500">{participant.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">
                      {participant.role.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(participant.signatureStatus || 'pending')}`}
                    >
                      {(participant.signatureStatus || 'pending')
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(participant.kycStatus || 'pending')}`}
                    >
                      {(participant.kycStatus || 'pending')
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {participant.role !== 'borrower' ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(participant.kybStatus || 'pending')}`}
                      >
                        {(participant.kybStatus || 'pending')
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending and Completed Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4 border-b border-gray-200">
        {/* Pending Items */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Pending Items</h3>
          {pendingItems.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No pending items</p>
          ) : (
            <ul className="space-y-2">
              {pendingItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Completed Items */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Completed Items</h3>
          {completedItems.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No completed items yet</p>
          ) : (
            <ul className="space-y-2">
              {completedItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="px-6 py-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">Activity Log</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-56 overflow-y-auto">
          {statusUpdates.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No activity recorded yet</p>
          ) : (
            <div className="space-y-3">
              {statusUpdates
                .map((update, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`${
                        update.updateType === 'signature'
                          ? 'bg-blue-100'
                          : update.updateType === 'kyc'
                            ? 'bg-purple-100'
                            : update.updateType === 'kyb'
                              ? 'bg-indigo-100'
                              : 'bg-gray-100'
                      } rounded-full p-1 mr-3 flex-shrink-0`}
                    >
                      {update.updateType === 'signature' ? (
                        <svg
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      ) : update.updateType === 'kyc' ? (
                        <svg
                          className="h-4 w-4 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                      ) : update.updateType === 'kyb' ? (
                        <svg
                          className="h-4 w-4 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4 text-gray-600"
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
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{update.message}</p>
                      <p className="text-xs text-gray-500">{formatDate(update.updatedAt)}</p>
                    </div>
                  </div>
                ))
                .reverse()}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Close
        </button>
        {document.status === 'fully_signed' && isFundingEligible && (
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Proceed to Funding
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentStatusViewer;
