import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileItem } from './FilelockDriveApp';

interface FilelockBlockchainServiceProps {
  file: FileItem;
  onComplete: (updatedFile: FileItem) => void;
  onCancel: () => void;
}

// Document verification statuses
type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed';

// Shield Network Ledger record interface
interface ShieldNetworkRecord {
  recordId: string;
  fileHash: string;
  timestamp: string;
  blockchainTxId: string;
  documentMetadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    contentHash: string;
    lastModified: string;
    ocrVerified: boolean;
    sourceVerified: boolean;
    historyVerified: boolean;
  };
}

const FilelockBlockchainService: React.FC<FilelockBlockchainServiceProps> = ({
  file,
  onComplete,
  onCancel,
}) => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [verificationProgress, setVerificationProgress] = useState({
    ocr: 0,
    source: 0,
    history: 0,
    blockchain: 0,
  });
  const [verificationDetails, setVerificationDetails] = useState({
    ocrText: '',
    sourceConfidence: 0,
    historyEvents: [] as string[],
    blockchainTxId: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  // Simulate OCR processing and verification
  const processOCR = async () => {
    setVerificationStatus('in_progress');
    setIsProcessing(true);

    // Simulate OCR progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setVerificationProgress(prev => ({ ...prev, ocr: i }));
    }

    // Set OCR results - this would be actual OCR text in a real implementation
    setVerificationDetails(prev => ({
      ...prev,
      ocrText:
        'Document content extracted and analyzed. Content verified for authenticity and consistency.',
    }));

    return true;
  };

  // Simulate source verification
  const verifySource = async () => {
    // Simulate source verification progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setVerificationProgress(prev => ({ ...prev, source: i }));
    }

    // Set source verification confidence
    setVerificationDetails(prev => ({
      ...prev,
      sourceConfidence: 98,
    }));

    return true;
  };

  // Simulate document history verification
  const verifyHistory = async () => {
    // Simulate history verification progress
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(resolve => setTimeout(resolve, 180));
      setVerificationProgress(prev => ({ ...prev, history: i }));
    }

    // Set history events
    setVerificationDetails(prev => ({
      ...prev,
      historyEvents: [
        `Document created on ${new Date(file.createdAt).toLocaleString()}`,
        `Document last modified on ${new Date(file.lastModified).toLocaleString()}`,
        'Document metadata verified and consistent',
        'No signs of tampering detected',
      ],
    }));

    return true;
  };

  // Simulate blockchain transaction
  const processBlockchainTransaction = async () => {
    // Simulate blockchain transaction progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setVerificationProgress(prev => ({ ...prev, blockchain: i }));
    }

    // Generate mock transaction ID
    const txId = `txid_${uuidv4().substring(0, 8)}`;

    setVerificationDetails(prev => ({
      ...prev,
      blockchainTxId: txId,
    }));

    return txId;
  };

  // Handle the main verification process
  const handleLockFile = async () => {
    try {
      // Step 1: Process OCR
      const ocrSuccess = await processOCR();
      if (!ocrSuccess) {
        setVerificationStatus('failed');
        setIsProcessing(false);
        return;
      }

      // Step 2: Verify source
      const sourceSuccess = await verifySource();
      if (!sourceSuccess) {
        setVerificationStatus('failed');
        setIsProcessing(false);
        return;
      }

      // Step 3: Verify history
      const historySuccess = await verifyHistory();
      if (!historySuccess) {
        setVerificationStatus('failed');
        setIsProcessing(false);
        return;
      }

      // Step 4: Create blockchain record
      const txId = await processBlockchainTransaction();

      // Process complete - update status
      setVerificationStatus('verified');
      setIsProcessing(false);

      // Create a Shield Network record
      const shieldRecord: ShieldNetworkRecord = {
        recordId: uuidv4(),
        fileHash: `${file.id}_${Date.now()}_hash`,
        timestamp: new Date().toISOString(),
        blockchainTxId: txId,
        documentMetadata: {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size || 0,
          contentHash: `${file.id}_content_hash_${Date.now()}`,
          lastModified: file.lastModified,
          ocrVerified: true,
          sourceVerified: true,
          historyVerified: true,
        },
      };

      // Update the file with blockchain verification details
      const updatedFile: FileItem = {
        ...file,
        blockchainVerified: true,
        blockchainTxId: txId,
        // Add a version record for this verification
        versions: [
          ...(file.versions || []),
          {
            id: `v${(file.versions?.length || 0) + 1}`,
            timestamp: new Date().toISOString(),
            author: 'system',
          },
        ],
        // Add an activity record for this verification
        activity: [
          ...(file.activity || []),
          {
            type: 'blockchain_verified',
            timestamp: new Date().toISOString(),
            user: 'system',
            details: `Document locked and verified on Shield Network Ledger. Transaction ID: ${txId}`,
          },
        ],
      };

      // Call onComplete with the updated file
      onComplete(updatedFile);
    } catch (error) {
      console.error('Error during file verification and blockchain locking:', error);
      setVerificationStatus('failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-primary-600 px-6 py-4">
        <h2 className="text-white font-medium text-xl flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Shield Network Document Locking
        </h2>
        <p className="text-primary-100 mt-1">
          Verify, secure, and create an immutable record of your document
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 mr-4">
            {file.type === 'pdf' ? (
              <svg className="h-16 w-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
                <path d="M8.5 7a1 1 0 100 2h3a1 1 0 100-2h-3zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              </svg>
            ) : file.type === 'image' ? (
              <svg className="h-16 w-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-16 w-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
            <p className="text-sm text-gray-500">
              {file.type.toUpperCase()} •{' '}
              {file.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown size'} • Last modified:{' '}
              {new Date(file.lastModified).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Shield Network Ledger Benefits</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
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
              <span className="text-sm text-gray-700">
                Immutable document verification with blockchain technology
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
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
              <span className="text-sm text-gray-700">
                Advanced OCR extraction and content verification
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
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
              <span className="text-sm text-gray-700">
                Document source and history authentication
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
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
              <span className="text-sm text-gray-700">
                Tamper-proof verification for fraud prevention
              </span>
            </li>
          </ul>
        </div>

        {verificationStatus === 'pending' ? (
          <div className="text-center py-6">
            <button
              onClick={handleLockFile}
              className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Lock Document on Shield Network
            </button>
            <p className="mt-2 text-sm text-gray-500">
              This will create an immutable blockchain record of this document
            </p>
          </div>
        ) : verificationStatus === 'in_progress' ? (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Document Processing</h4>

            {/* OCR Verification */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  DocEasy AI OCR Verification
                </span>
                <span className="text-sm text-gray-500">{verificationProgress.ocr}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${verificationProgress.ocr}%` }}
                ></div>
              </div>
            </div>

            {/* Source Verification */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Source Authentication</span>
                <span className="text-sm text-gray-500">{verificationProgress.source}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${verificationProgress.source}%` }}
                ></div>
              </div>
            </div>

            {/* History Verification */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Document History Analysis</span>
                <span className="text-sm text-gray-500">{verificationProgress.history}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: `${verificationProgress.history}%` }}
                ></div>
              </div>
            </div>

            {/* Blockchain Processing */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Shield Network Ledger Registration
                </span>
                <span className="text-sm text-gray-500">{verificationProgress.blockchain}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${verificationProgress.blockchain}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center py-4">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-700"
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
              </div>
            </div>
          </div>
        ) : verificationStatus === 'verified' ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
              <svg
                className="h-10 w-10 text-green-600"
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
            </div>
            <h3 className="text-xl font-medium text-gray-900">Document Successfully Locked!</h3>
            <p className="text-sm text-gray-600">
              Your document has been verified and locked on the Shield Network Ledger.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4 text-left">
              <h4 className="font-medium text-purple-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Blockchain Verification
              </h4>
              <p className="text-sm text-purple-600 mt-1">
                Transaction ID: {verificationDetails.blockchainTxId}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                Verification Time: {new Date().toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
              className="mt-4 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 rounded-md"
            >
              {showAdvancedDetails ? 'Hide Details' : 'Show Verification Details'}
            </button>

            {showAdvancedDetails && (
              <div className="mt-4 space-y-4 text-left">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">OCR Verification</h5>
                  <p className="text-sm text-gray-700">{verificationDetails.ocrText}</p>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Source Authentication</h5>
                  <p className="text-sm text-gray-700">
                    Source verification confidence: {verificationDetails.sourceConfidence}%
                  </p>
                </div>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">Document History</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {verificationDetails.historyEvents.map((event, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-4 w-4 text-green-500 mr-2 mt-0.5"
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
                        {event}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() =>
                  onComplete({
                    ...file,
                    blockchainVerified: true,
                    blockchainTxId: verificationDetails.blockchainTxId,
                  })
                }
                className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Return to Document
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-2">
              <svg
                className="h-10 w-10 text-red-600"
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
            </div>
            <h3 className="text-xl font-medium text-gray-900">Verification Failed</h3>
            <p className="text-sm text-gray-600">
              There was an issue verifying your document. Please try again.
            </p>

            <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-4 justify-center">
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleLockFile}
                className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilelockBlockchainService;
