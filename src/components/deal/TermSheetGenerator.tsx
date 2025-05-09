import React, { useState, useEffect } from 'react';
import DocumentGenerationService, {
  DealParticipants,
  ParticipantInfo,
  TermSheetData,
  TermSheetDocument,
} from '../../services/DocumentGenerationService';
import DocumentTrackingService from '../../services/DocumentTrackingService';
import { v4 as uuidv4 } from 'uuid';

interface TermSheetGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  termSheetData: TermSheetData;
  onComplete: (document: TermSheetDocument) => void;
}

const TermSheetGenerator: React.FC<TermSheetGeneratorProps> = ({
  isOpen,
  onClose,
  termSheetData,
  onComplete,
}) => {
  // State
  const [step, setStep] = useState<'participants' | 'generating' | 'complete' | 'error'>(
    'participants'
  );
  const [participants, setParticipants] = useState<DealParticipants>({
    borrower: {
      id: uuidv4(),
      name: termSheetData.borrowerName || '',
      email: termSheetData.borrowerEmail || '',
      role: 'borrower',
    },
  });
  const [processingSteps, setProcessingSteps] = useState({
    generating: { status: 'pending', message: 'Generating term sheet PDF' },
    uploading: { status: 'pending', message: 'Uploading to Filelock secure vault' },
    signatures: { status: 'pending', message: 'Preparing e-signature request' },
    verification: { status: 'pending', message: 'Setting up KYC/KYB verification' },
  });
  const [hasBroker, setHasBroker] = useState(!!termSheetData.brokerName);
  const [hasVendor, setHasVendor] = useState(!!termSheetData.vendorName);
  const [guarantorsCount, setGuarantorsCount] = useState(0);
  const [assetSellersCount, setAssetSellersCount] = useState(0);
  const [termSheetDocument, setTermSheetDocument] = useState<TermSheetDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle participant input change
  const handleParticipantChange = (
    role: keyof DealParticipants,
    field: keyof ParticipantInfo,
    value: string,
    index?: number
  ) => {
    if (role === 'borrower' || role === 'broker' || role === 'vendor') {
      setParticipants(prev => ({
        ...prev,
        [role]: {
          ...(prev[role] || { id: uuidv4(), role: role as ParticipantInfo['role'] }),
          [field]: value,
        },
      }));
    } else if ((role === 'guarantors' || role === 'assetSellers') && typeof index === 'number') {
      setParticipants(prev => {
        const currentList = prev[role] || [];
        const newList = [...currentList];

        if (!newList[index]) {
          newList[index] = {
            id: uuidv4(),
            name: '',
            email: '',
            role: role === 'guarantors' ? 'guarantor' : 'asset_seller',
          };
        }

        newList[index] = { ...newList[index], [field]: value };

        return {
          ...prev,
          [role]: newList,
        };
      });
    }
  };

  // Add/remove guarantors or asset sellers
  const handleAddParticipant = (type: 'guarantors' | 'assetSellers') => {
    if (type === 'guarantors') {
      setGuarantorsCount(prev => prev + 1);
    } else {
      setAssetSellersCount(prev => prev + 1);
    }
  };

  const handleRemoveParticipant = (type: 'guarantors' | 'assetSellers', index: number) => {
    setParticipants(prev => {
      const currentList = prev[type] || [];
      const newList = [...currentList];
      newList.splice(index, 1);

      return {
        ...prev,
        [type]: newList,
      };
    });

    if (type === 'guarantors') {
      setGuarantorsCount(prev => prev - 1);
    } else {
      setAssetSellersCount(prev => prev - 1);
    }
  };

  // Generate the term sheet and start the workflow
  const handleGenerateTermSheet = async () => {
    try {
      setStep('generating');

      // Update each processing step with a delay to simulate the workflow
      setProcessingSteps(prev => ({
        ...prev,
        generating: { ...prev.generating, status: 'in_progress' },
      }));

      // Prepare participants list
      const completeParticipants: DealParticipants = {
        borrower: participants.borrower,
      };

      if (hasBroker && participants.broker?.name && participants.broker?.email) {
        completeParticipants.broker = participants.broker;
      }

      if (hasVendor && participants.vendor?.name && participants.vendor?.email) {
        completeParticipants.vendor = participants.vendor;
      }

      if (guarantorsCount > 0 && participants.guarantors?.length) {
        completeParticipants.guarantors = participants.guarantors.filter(g => g?.name && g?.email);
      }

      if (assetSellersCount > 0 && participants.assetSellers?.length) {
        completeParticipants.assetSellers = participants.assetSellers.filter(
          s => s?.name && s?.email
        );
      }

      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingSteps(prev => ({
        ...prev,
        generating: { ...prev.generating, status: 'complete' },
        uploading: { ...prev.uploading, status: 'in_progress' },
      }));

      // Simulate Filelock upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProcessingSteps(prev => ({
        ...prev,
        uploading: { ...prev.uploading, status: 'complete' },
        signatures: { ...prev.signatures, status: 'in_progress' },
      }));

      // Simulate e-signature setup
      await new Promise(resolve => setTimeout(resolve, 1800));
      setProcessingSteps(prev => ({
        ...prev,
        signatures: { ...prev.signatures, status: 'complete' },
        verification: { ...prev.verification, status: 'in_progress' },
      }));

      // Simulate KYC/KYB setup
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProcessingSteps(prev => ({
        ...prev,
        verification: { ...prev.verification, status: 'complete' },
      }));

      // Create the actual term sheet document through the service
      const document = await DocumentGenerationService.createTermSheetWorkflow(
        termSheetData,
        completeParticipants
      );

      // Register the document with the tracking service
      DocumentTrackingService.registerDocument(document);

      // Simulate random status updates for demo purposes
      DocumentTrackingService.simulateStatusUpdates(document.id);

      setTermSheetDocument(document);
      setStep('complete');
      onComplete(document);
    } catch (err) {
      console.error('Error generating term sheet:', err);
      setError('An error occurred while generating the term sheet. Please try again.');
      setStep('error');
    }
  };

  // Create participant form inputs for each role
  const renderParticipantInputs = () => {
    return (
      <div className="space-y-6">
        {/* Borrower (always required) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Borrower (Required)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="borrower-name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="borrower-name"
                value={participants.borrower?.name || ''}
                onChange={e => handleParticipantChange('borrower', 'name', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="borrower-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="borrower-email"
                value={participants.borrower?.email || ''}
                onChange={e => handleParticipantChange('borrower', 'email', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                required
              />
            </div>
          </div>
        </div>

        {/* Broker (optional) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Broker</h4>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has-broker"
                checked={hasBroker}
                onChange={e => setHasBroker(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="has-broker" className="ml-2 text-sm text-gray-500">
                Include broker
              </label>
            </div>
          </div>

          {hasBroker && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="broker-name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="broker-name"
                  value={participants.broker?.name || ''}
                  onChange={e => handleParticipantChange('broker', 'name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required={hasBroker}
                />
              </div>
              <div>
                <label htmlFor="broker-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="broker-email"
                  value={participants.broker?.email || ''}
                  onChange={e => handleParticipantChange('broker', 'email', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required={hasBroker}
                />
              </div>
            </div>
          )}
        </div>

        {/* Vendor (optional) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Vendor</h4>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has-vendor"
                checked={hasVendor}
                onChange={e => setHasVendor(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="has-vendor" className="ml-2 text-sm text-gray-500">
                Include vendor
              </label>
            </div>
          </div>

          {hasVendor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vendor-name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="vendor-name"
                  value={participants.vendor?.name || ''}
                  onChange={e => handleParticipantChange('vendor', 'name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required={hasVendor}
                />
              </div>
              <div>
                <label htmlFor="vendor-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="vendor-email"
                  value={participants.vendor?.email || ''}
                  onChange={e => handleParticipantChange('vendor', 'email', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required={hasVendor}
                />
              </div>
            </div>
          )}
        </div>

        {/* Guarantors (optional, multiple) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Guarantors</h4>
            <button
              type="button"
              onClick={() => handleAddParticipant('guarantors')}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none"
            >
              Add Guarantor
            </button>
          </div>

          {Array.from({ length: guarantorsCount }).map((_, index) => (
            <div
              key={`guarantor-${index}`}
              className="mb-4 last:mb-0 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium text-gray-700">Guarantor #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant('guarantors', index)}
                  className="text-xs text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`guarantor-${index}-name`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id={`guarantor-${index}-name`}
                    value={participants.guarantors?.[index]?.name || ''}
                    onChange={e =>
                      handleParticipantChange('guarantors', 'name', e.target.value, index)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`guarantor-${index}-email`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id={`guarantor-${index}-email`}
                    value={participants.guarantors?.[index]?.email || ''}
                    onChange={e =>
                      handleParticipantChange('guarantors', 'email', e.target.value, index)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {guarantorsCount === 0 && <p className="text-sm text-gray-500">No guarantors added.</p>}
        </div>

        {/* Asset Sellers (optional, multiple) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Asset Sellers</h4>
            <button
              type="button"
              onClick={() => handleAddParticipant('assetSellers')}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none"
            >
              Add Asset Seller
            </button>
          </div>

          {Array.from({ length: assetSellersCount }).map((_, index) => (
            <div
              key={`seller-${index}`}
              className="mb-4 last:mb-0 border-t border-gray-100 pt-4 first:border-t-0 first:pt-0"
            >
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium text-gray-700">Asset Seller #{index + 1}</h5>
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant('assetSellers', index)}
                  className="text-xs text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`seller-${index}-name`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id={`seller-${index}-name`}
                    value={participants.assetSellers?.[index]?.name || ''}
                    onChange={e =>
                      handleParticipantChange('assetSellers', 'name', e.target.value, index)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor={`seller-${index}-email`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id={`seller-${index}-email`}
                    value={participants.assetSellers?.[index]?.email || ''}
                    onChange={e =>
                      handleParticipantChange('assetSellers', 'email', e.target.value, index)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {assetSellersCount === 0 && (
            <p className="text-sm text-gray-500">No asset sellers added.</p>
          )}
        </div>
      </div>
    );
  };

  // Render the processing status with step indicators
  const renderProcessingStatus = () => {
    return (
      <div className="space-y-6 py-4">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              className="animate-spin h-12 w-12 text-primary-600"
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
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Generating Term Sheet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we prepare your term sheet and set up the e-signature process.
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(processingSteps).map(([key, step]) => (
            <div key={key} className="flex items-center">
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                ${
                  step.status === 'pending'
                    ? 'bg-gray-200'
                    : step.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-green-100 text-green-600'
                }`}
              >
                {step.status === 'pending' && (
                  <span className="text-gray-500">
                    {Object.keys(processingSteps).indexOf(key) + 1}
                  </span>
                )}
                {step.status === 'in_progress' && (
                  <svg
                    className="animate-spin h-5 w-5"
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
                )}
                {step.status === 'complete' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    step.status === 'pending'
                      ? 'text-gray-500'
                      : step.status === 'in_progress'
                        ? 'text-gray-900'
                        : 'text-gray-900'
                  }`}
                >
                  {step.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render completion screen with next steps
  const renderComplete = () => {
    return (
      <div className="text-center py-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Term Sheet Created Successfully</h3>
        <p className="mt-1 text-sm text-gray-500">
          Your term sheet has been generated and sent for signatures.
        </p>

        <div className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Next Steps:</h4>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>All participants will receive an email with instructions to sign the document</li>
            <li>Each signer will need to complete KYC verification before signing</li>
            <li>Business entities will also need to complete KYB verification</li>
            <li>Once all verifications and signatures are complete, funding can proceed</li>
          </ol>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            Close and Continue
          </button>
        </div>
      </div>
    );
  };

  // Render error screen
  const renderError = () => {
    return (
      <div className="text-center py-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error Generating Term Sheet</h3>
        <p className="mt-1 text-sm text-red-600">
          {error || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="mt-6 flex justify-center space-x-3">
          <button
            type="button"
            onClick={() => setStep('participants')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Main render function
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={step !== 'generating' ? onClose : undefined}
        ></div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full lg:max-w-2xl">
          {/* Header */}
          <div className="bg-primary-700 px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-white">
              {step === 'participants'
                ? 'Generate Term Sheet'
                : step === 'generating'
                  ? 'Processing'
                  : step === 'complete'
                    ? 'Complete'
                    : 'Error'}
            </h3>
            {step !== 'generating' && (
              <button type="button" className="text-white hover:text-gray-200" onClick={onClose}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {step === 'participants' && renderParticipantInputs()}
            {step === 'generating' && renderProcessingStatus()}
            {step === 'complete' && renderComplete()}
            {step === 'error' && renderError()}
          </div>

          {/* Footer */}
          {step === 'participants' && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleGenerateTermSheet}
                disabled={!participants.borrower?.name || !participants.borrower?.email}
              >
                Generate & Send for Signature
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermSheetGenerator;
