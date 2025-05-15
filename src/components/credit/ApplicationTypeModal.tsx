import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ApplicationTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ApplicationType = 'general' | 'equipment' | 'real-estate';
type EntryMethod = 'manual' | 'send-link';
type RecipientType = 'vendor' | 'borrower' | 'broker';

const ApplicationTypeModal: React.FC<ApplicationTypeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'type' | 'method'>('type');
  const [selectedType, setSelectedType] = useState<ApplicationType | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<EntryMethod | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientType | null>(null);

  if (!isOpen) return null;

  const handleTypeSelect = (type: ApplicationType) => {
    setSelectedType(type);
    setStep('method');
  };

  const handleMethodSelect = (method: EntryMethod) => {
    setSelectedMethod(method);
    if (method === 'manual') {
      // Navigate to the appropriate application form with the selected type
      navigate(`/credit-application?type=${selectedType}&method=manual`);
      onClose();
    }
  };

  const handleRecipientSelect = (recipient: RecipientType) => {
    setSelectedRecipient(recipient);
    // Navigate or handle API call to send the link to the selected recipient
    navigate(`/credit-application?type=${selectedType}&method=send-link&recipient=${recipient}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'type' ? 'Select Application Type' : 'Select Entry Method'}
            </h2>
            <button
              onClick={onClose}
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
        </div>

        <div className="p-6">
          {step === 'type' ? (
            <>
              <p className="mb-4 text-gray-600">
                Select the type of application to start the SAFE credit process.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleTypeSelect('general')}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">General</h4>
                    <p className="mt-1 text-sm text-gray-500">For general funding and working capital</p>
                  </div>
                </button>
                <button
                  onClick={() => handleTypeSelect('equipment')}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">Equipment & Vehicles</h4>
                    <p className="mt-1 text-sm text-gray-500">For equipment finance and vehicle purchases</p>
                  </div>
                </button>
                <button
                  onClick={() => handleTypeSelect('real-estate')}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">Real Estate</h4>
                    <p className="mt-1 text-sm text-gray-500">For commercial real estate financing</p>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-gray-600">
                How would you like to proceed with this {selectedType?.replace('-', ' ')} application?
              </p>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <button
                  onClick={() => handleMethodSelect('manual')}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">Manual Entry</h4>
                    <p className="mt-1 text-sm text-gray-500">Fill out the application form directly (e-signature)</p>
                  </div>
                </button>
                <button
                  onClick={() => handleMethodSelect('send-link')}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">Send Link Directly</h4>
                    <p className="mt-1 text-sm text-gray-500">Send a link for the applicant to complete</p>
                  </div>
                </button>
              </div>

              {selectedMethod === 'send-link' && (
                <>
                  <p className="mb-4 text-gray-600">Select recipient:</p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRecipientSelect('vendor')}
                      className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="text-left">
                        <h4 className="text-lg font-medium text-gray-900">Vendor</h4>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRecipientSelect('borrower')}
                      className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="text-left">
                        <h4 className="text-lg font-medium text-gray-900">Borrower</h4>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRecipientSelect('broker')}
                      className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="text-left">
                        <h4 className="text-lg font-medium text-gray-900">Broker</h4>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTypeModal; 