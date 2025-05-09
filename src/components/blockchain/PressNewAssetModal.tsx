import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AssetClass, AssetClassNames } from '../../types/AssetClassTypes';
import AssetClassificationGrid from './AssetClassificationGrid';
import AssetForm from './AssetForm';
import BlockchainVerificationOptions from './BlockchainVerificationOptions';
import { v4 as uuidv4 } from 'uuid';
import { AssetClassType } from './AssetClassification';

// Add type assertion to make AssetClassType compatible with AssetClass
type CompatibleAssetClass = AssetClassType & AssetClass;

interface PressNewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPress: (assetData: any) => Promise<any>;
}

// Step management for the form process
type FormStep = 'classification' | 'details' | 'verification' | 'review';

const PressNewAssetModal: React.FC<PressNewAssetModalProps> = ({ isOpen, onClose, onPress }) => {
  const [selectedAssetClass, setSelectedAssetClass] = useState<CompatibleAssetClass | null>(null);
  const [currentStep, setCurrentStep] = useState<FormStep>('classification');
  const [formData, setFormData] = useState<any>({
    id: uuidv4(),
    name: '',
    assetType: '',
    marketValue: 0,
    dateCreated: new Date().toISOString(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockchainNetwork, setBlockchainNetwork] = useState('polygon');
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  if (!isOpen) return null;

  const handleAssetClassSelect = (assetClass: CompatibleAssetClass) => {
    setSelectedAssetClass(assetClass);
    setFormData(prev => ({
      ...prev,
      assetClass: assetClass,
    }));
    // Move to next step
    setCurrentStep('details');
  };

  const handleFormChange = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNextStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('verification');
    } else if (currentStep === 'verification') {
      setCurrentStep('review');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('classification');
      setSelectedAssetClass(null);
    } else if (currentStep === 'verification') {
      setCurrentStep('details');
    } else if (currentStep === 'review') {
      setCurrentStep('verification');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await onPress({
        ...formData,
        blockchainNetwork,
        verificationStatus: 'pending', // All new assets start with pending verification
      });
      setIsSubmitting(false);
      setShowVerificationInfo(true);
    } catch (error) {
      console.error('Error pressing asset:', error);
      setIsSubmitting(false);
    }
  };

  // Function to render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'classification':
        return (
          <AssetClassificationGrid
            onSelect={handleAssetClassSelect as (assetClass: AssetClass) => void}
            selectedAsset={selectedAssetClass as AssetClass | null}
          />
        );
      case 'details':
        return (
          <AssetForm
            assetType={selectedAssetClass ? (selectedAssetClass as AssetClass) : AssetClass.OTHER}
            formData={formData}
            onChange={handleFormChange}
          />
        );
      case 'verification':
        return (
          <BlockchainVerificationOptions
            assetType={selectedAssetClass ? (selectedAssetClass as AssetClass) : AssetClass.OTHER}
            onChange={handleFormChange}
          />
        );
      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Review Your Asset</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium">{formData.name}</h4>
              <p className="text-sm text-gray-600">
                Type: {selectedAssetClass ? AssetClassNames[selectedAssetClass as AssetClass] : ''}
              </p>
              <p className="text-sm text-gray-600">
                Value: ${formData.marketValue?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Blockchain: {blockchainNetwork}</p>
              {formData.description && (
                <p className="text-sm text-gray-600 mt-2">{formData.description}</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40"
          onClick={onClose}
          variants={overlayVariants}
        />

        <motion.div
          className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
          variants={modalVariants}
        >
          {/* Modal header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {currentStep === 'classification' && 'Select Asset Classification'}
              {currentStep === 'details' && 'Asset Information'}
              {currentStep === 'verification' && 'Blockchain Verification'}
              {currentStep === 'review' && 'Review & Submit'}
            </h2>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-1 w-full bg-gray-200 rounded-full">
            <div
              className="h-1 rounded-full bg-indigo-600 transition-all duration-300"
              style={{
                width:
                  currentStep === 'classification'
                    ? '25%'
                    : currentStep === 'details'
                      ? '50%'
                      : currentStep === 'verification'
                        ? '75%'
                        : '100%',
              }}
            ></div>
          </div>

          {/* Modal content */}
          <div className="mb-6">{renderStepContent()}</div>

          {/* Modal footer */}
          <div className="flex justify-between">
            <button
              onClick={currentStep === 'classification' ? onClose : handlePrevStep}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              {currentStep === 'classification' ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={currentStep === 'review' ? handleSubmit : handleNextStep}
              disabled={currentStep === 'classification' || isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md
                ${currentStep === 'review' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                ${currentStep === 'classification' || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
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
              ) : currentStep === 'review' ? (
                'Press Asset'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PressNewAssetModal;
