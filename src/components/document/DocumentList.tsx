import React, { useState, useRef, ChangeEvent } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { useNavigate } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'required' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt?: string;
  fileURL?: string; // Add this property to store file URL
}

const DocumentList = () => {
  const { currentTransaction, advanceStage } = useWorkflow();
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock document types based on transaction type
  const getRequiredDocuments = (): Document[] => {
    if (!currentTransaction) return [];

    const baseDocuments: Document[] = [
      {
        id: 'doc-001',
        name: 'Business Financial Statements',
        type: 'financial',
        status: 'required',
      },
      {
        id: 'doc-002',
        name: 'Tax Returns (Last 2 Years)',
        type: 'tax',
        status: 'required',
      },
      {
        id: 'doc-003',
        name: 'Bank Statements (Last 3 Months)',
        type: 'bank',
        status: 'uploaded',
        uploadedAt: '2023-05-02T10:30:00.000Z',
        fileURL: 'https://example.com/mock-bank-statement.pdf', // Mock URL for demonstration
      },
    ];

    // Add specific documents based on transaction type
    if (
      currentTransaction.type === 'Finance Lease' ||
      currentTransaction.type === 'Equipment Loan'
    ) {
      baseDocuments.push({
        id: 'doc-004',
        name: 'Equipment Invoice/Quote',
        type: 'invoice',
        status: 'required',
      });
    }

    if (currentTransaction.type === 'Commercial Mortgage') {
      baseDocuments.push({
        id: 'doc-005',
        name: 'Property Appraisal',
        type: 'appraisal',
        status: 'required',
      });
      baseDocuments.push({
        id: 'doc-006',
        name: 'Property Insurance',
        type: 'insurance',
        status: 'required',
      });
    }

    return baseDocuments;
  };

  const [documents, setDocuments] = useState<Document[]>(getRequiredDocuments());

  const uploadDocument = (docType: string) => {
    setSelectedDocType(docType);
    setSelectedFile(null); // Reset selected file
    setUploadModalOpen(true);
  };

  const viewDocument = (doc: Document) => {
    setViewingDocument(doc);
    setViewModalOpen(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = () => {
    // Simulate document upload
    if (selectedFile) {
      // Create a temporary URL for the selected file
      const fileURL = URL.createObjectURL(selectedFile);

      setDocuments(prev =>
        prev.map(doc =>
          doc.type === selectedDocType
            ? { ...doc, status: 'uploaded', uploadedAt: new Date().toISOString(), fileURL }
            : doc
        )
      );

      setUploadModalOpen(false);
      setSelectedFile(null);
    } else {
      alert('Please select a file to upload');
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'required':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Required
          </span>
        );
      case 'uploaded':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Uploaded
          </span>
        );
      case 'verified':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Add this function to handle continuing to the next step
  const handleConfirmAndContinue = () => {
    if (currentTransaction && !documents.some(d => d.status === 'required')) {
      setIsSubmitting(true);

      // Short delay to simulate processing
      setTimeout(() => {
        // Advance to risk assessment stage
        advanceStage(currentTransaction.id, 'risk_assessment');
        navigate('/risk-assessment');
        setIsSubmitting(false);
      }, 800);
    }
  };

  if (!currentTransaction) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Please select a transaction first</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload the following documents to proceed with your application
        </p>
      </div>

      <ul className="divide-y divide-gray-200">
        {documents.map(doc => (
          <li key={doc.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                <div className="mt-1">
                  {getStatusBadge(doc.status)}
                  {doc.uploadedAt && (
                    <span className="ml-2 text-xs text-gray-500">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {doc.status === 'required' && (
                  <button
                    onClick={() => uploadDocument(doc.type)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                  >
                    Upload
                  </button>
                )}

                {doc.status === 'uploaded' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewDocument(doc)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none"
                    >
                      View
                    </button>
                    <button
                      onClick={() => uploadDocument(doc.type)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Replace
                    </button>
                  </div>
                )}

                {doc.status === 'verified' && (
                  <button
                    onClick={() => viewDocument(doc)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none"
                  >
                    View
                  </button>
                )}

                {doc.status === 'rejected' && (
                  <button
                    onClick={() => uploadDocument(doc.type)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    Re-upload
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">
              {documents.filter(d => d.status === 'uploaded' || d.status === 'verified').length} of{' '}
              {documents.length} documents uploaded
            </span>
            {documents.every(d => d.status === 'uploaded' || d.status === 'verified') ? (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg
                  className="-ml-0.5 mr-1 h-3 w-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="4" r="3" />
                </svg>
                All documents uploaded
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg
                  className="-ml-0.5 mr-1 h-3 w-3 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 8 8"
                >
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {documents.length -
                  documents.filter(d => d.status === 'uploaded' || d.status === 'verified')
                    .length}{' '}
                more required
              </span>
            )}
          </div>

          <button
            onClick={handleConfirmAndContinue}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                documents.some(d => d.status === 'required') || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none'
              }`}
            disabled={documents.some(d => d.status === 'required') || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
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
                Processing...
              </span>
            ) : (
              'Confirm & Continue'
            )}
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Document</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <div className="text-sm text-gray-500">
                {documents.find(d => d.type === selectedDocType)?.name}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Hidden file input - controlled by the button below */}
                  <input
                    id="file-upload"
                    ref={fileInputRef}
                    name="file-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="text-sm text-gray-800 py-2 px-4 bg-gray-50 rounded-md">
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                      >
                        Upload a file
                      </button>
                      <p className="mt-1">or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 text-white rounded-md ${selectedFile ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Document Modal */}
      {viewModalOpen && viewingDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">{viewingDocument.name}</h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
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

            <div className="flex-1 overflow-hidden rounded-md border border-gray-300 bg-gray-100 min-h-[60vh]">
              {viewingDocument.fileURL ? (
                <iframe
                  src={viewingDocument.fileURL}
                  className="w-full h-full"
                  title={viewingDocument.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500">Document preview not available</p>
                    <p className="text-sm text-gray-400 mt-2">
                      This is a sample document viewer. In a real implementation, the actual
                      document would be displayed here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <span className="text-sm text-gray-500">
                  Uploaded on{' '}
                  {viewingDocument.uploadedAt
                    ? new Date(viewingDocument.uploadedAt).toLocaleDateString()
                    : 'Unknown date'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => window.open(viewingDocument.fileURL, '_blank')}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;
