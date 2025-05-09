import React, { useState } from 'react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'vendor' | 'broker' | 'other';
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
}

interface DocumentRequest {
  id: string;
  recipients: Recipient[];
  documents: DocumentType[];
  deadline: Date | null;
  message: string;
  status: 'pending' | 'partially_completed' | 'completed';
  sentAt: Date;
  completionPercentage: number;
}

interface DocumentRequestTrackerProps {
  transactionId: string;
  onNewRequest: () => void;
  onViewUploads: (requestId: string) => void;
  onResendRequest: (requestId: string) => void;
}

const DocumentRequestTracker: React.FC<DocumentRequestTrackerProps> = ({
  transactionId,
  onNewRequest,
  onViewUploads,
  onResendRequest,
}) => {
  // In a real application, this data would be fetched from an API
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([
    {
      id: 'req-001',
      recipients: [
        { id: 'rec-001', name: 'John Smith', email: 'john@acmecorp.com', role: 'owner' },
        {
          id: 'rec-003',
          name: 'Capital Brokers Inc',
          email: 'agent@capitalbrokers.com',
          role: 'broker',
        },
      ],
      documents: [
        {
          id: 'doc-001',
          name: 'Business Financial Statements',
          description: 'Last 2 years of financial statements',
        },
        { id: 'doc-002', name: 'Tax Returns', description: 'Last 2 years of business tax returns' },
      ],
      deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
      message: 'Please provide these documents for our underwriting process.',
      status: 'partially_completed',
      sentAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      completionPercentage: 50,
    },
    {
      id: 'req-002',
      recipients: [
        {
          id: 'rec-002',
          name: 'Acme Equipment LLC',
          email: 'vendor@acmeequipment.com',
          role: 'vendor',
        },
      ],
      documents: [
        {
          id: 'doc-004',
          name: 'Equipment Invoice/Quote',
          description: 'Detailed invoice for equipment',
        },
        { id: 'doc-008', name: 'Vendor W-9', description: 'W-9 form from equipment vendor' },
      ],
      deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
      message: 'Need these documents to finalize the equipment loan.',
      status: 'pending',
      sentAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      completionPercentage: 0,
    },
  ]);

  // This function will be called when a new request is successfully sent
  const addDocumentRequest = (
    newRequest: Omit<DocumentRequest, 'id' | 'status' | 'sentAt' | 'completionPercentage'>
  ) => {
    const request: DocumentRequest = {
      ...newRequest,
      id: `req-${Date.now()}`,
      status: 'pending',
      sentAt: new Date(),
      completionPercentage: 0,
    };

    setDocumentRequests([...documentRequests, request]);
  };

  const getStatusBadge = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'partially_completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Partially Completed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Document Requests</h3>
        <button
          onClick={onNewRequest}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Request
        </button>
      </div>

      {documentRequests.length > 0 ? (
        <div className="overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requested Documents
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Recipients
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Deadline
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentRequests.map(request => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{request.documents.length} document(s)</div>
                    <div className="text-gray-500">
                      {request.documents.map(doc => doc.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {request.recipients.map(recipient => (
                        <div key={recipient.id} className="flex items-center">
                          <span
                            className={`inline-flex mr-2 h-2 w-2 rounded-full ${
                              recipient.role === 'owner'
                                ? 'bg-blue-400'
                                : recipient.role === 'vendor'
                                  ? 'bg-green-400'
                                  : recipient.role === 'broker'
                                    ? 'bg-purple-400'
                                    : 'bg-gray-400'
                            }`}
                          ></span>
                          <span>{recipient.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.deadline
                      ? new Date(request.deadline).toLocaleDateString()
                      : 'No deadline'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${request.completionPercentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-500">{request.completionPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewUploads(request.id)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      View Uploads
                    </button>
                    <button
                      onClick={() => onResendRequest(request.id)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Resend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No document requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new document request.
          </p>
          <div className="mt-6">
            <button
              onClick={onNewRequest}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Document Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRequestTracker;
