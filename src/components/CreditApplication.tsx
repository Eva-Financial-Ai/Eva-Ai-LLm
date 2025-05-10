import React, { useState, useContext, Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { useWorkflow } from '../contexts/WorkflowContext';
import {
  DocumentRequirementsService,
  ApplicationType,
  DocumentRequirement,
} from '../services/DocumentRequirements';
import { FilelockIntegrationService } from '../services/FilelockIntegrationService';

// Lazy load components to improve initial loading performance
const SafeForms = lazy(() => import('./credit/SafeForms'));
const FinancialStatements = lazy(() => import('./credit/FinancialStatements'));
const BusinessTaxReturns = lazy(() => import('./credit/BusinessTaxReturns'));
const DocumentRequirementsList = lazy(() => import('./credit/DocumentRequirementsList'));

// Fallback loading component
const LoadingFallback = () => (
  <div className="flex justify-center items-center p-12">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-12 w-12 rounded-full bg-primary-100 mb-4"></div>
      <div className="h-4 w-48 bg-primary-100 rounded mb-3"></div>
      <div className="h-3 w-32 bg-primary-100 rounded"></div>
    </div>
  </div>
);

// Application forms to types mapping
const applicationFormTypes: Record<string, ApplicationType> = {
  'Equipment Finance Application': 'equipment_finance',
  'Working Capital Application': 'working_capital',
  'Commercial Real Estate Application': 'commercial_real_estate',
  'General Credit Application': 'business_information',
};

const CreditApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('application');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] = useState<ApplicationType | null>(
    null
  );
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([]);
  const [requestedDocuments, setRequestedDocuments] = useState(false);
  const [documentProgress, setDocumentProgress] = useState(0);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);

  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const { currentTransaction } = useWorkflow();

  // Simulate initialization to prevent abrupt loading issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle application type selection
  const handleApplicationTypeSelect = (formName: string) => {
    const appType =
      applicationFormTypes[formName] ||
      DocumentRequirementsService.getApplicationTypeFromFormName(formName);

    if (appType) {
      setSelectedApplicationType(appType);

      // Get document requirements for this application type
      const requirements = DocumentRequirementsService.getRequiredDocuments(appType);
      setDocumentRequirements(requirements);

      // Calculate progress
      const progress = DocumentRequirementsService.getDocumentProgress(requirements);
      setDocumentProgress(progress);
    }
  };

  // Handle automatic document request when application type is selected
  useEffect(() => {
    if (selectedApplicationType && !requestedDocuments && currentTransaction?.id) {
      // Request documents from the Filelock system
      const requestDocuments = async () => {
        const result = await FilelockIntegrationService.requestDocuments({
          applicationType: selectedApplicationType,
          transactionId: currentTransaction.id,
          borrowerId: currentTransaction.applicantData?.id,
          requestNote: `Documents required for ${selectedApplicationType.replace('_', ' ')} application`,
          expiryDays: 14,
        });

        if (result.success) {
          setRequestedDocuments(true);
          console.log(`Document request created: ${result.requestId}`);
        }
      };

      requestDocuments();
    }
  }, [selectedApplicationType, requestedDocuments, currentTransaction]);

  // Handle document requirements update
  const handleDocumentRequirementsChange = (requirements: DocumentRequirement[]) => {
    setDocumentRequirements(requirements);

    // Calculate progress
    const progress = DocumentRequirementsService.getDocumentProgress(requirements);
    setDocumentProgress(progress);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Application saved successfully!');
    }, 500);
  };

  const handleSubmit = () => {
    // Check if all required documents are provided
    if (documentRequirements.length > 0) {
      const allDocumentsProvided =
        DocumentRequirementsService.areAllRequiredDocumentsProvided(documentRequirements);

      if (!allDocumentsProvided) {
        setShowRequirementsModal(true);
        return;
      }
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Application submitted successfully!');
      navigate('/auto-originations');
    }, 500);
  };

  // Placeholder component for Asset Sellers tab
  const AssetSellers = () => (
    <div className="py-8 text-center">
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Asset Seller Information</h3>
      <p className="mt-1 text-sm text-gray-500">
        This section allows you to capture information about asset sellers.
      </p>
    </div>
  );

  // Placeholder component for Brokers & Originators tab
  const BrokersOriginators = () => (
    <div className="py-8 text-center">
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Brokers & Originators Information</h3>
      <p className="mt-1 text-sm text-gray-500">
        This section allows you to capture information about brokers and originators.
      </p>
    </div>
  );

  if (!isInitialized) {
    return <LoadingFallback />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Origination Creator Tool</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => handleTabChange('application')}
            className={`${
              activeTab === 'application'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            disabled={isLoading}
          >
            Application
          </button>
          <button
            onClick={() => handleTabChange('financial')}
            className={`${
              activeTab === 'financial'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            disabled={isLoading}
          >
            Financial Statements
          </button>
          <button
            onClick={() => handleTabChange('taxes')}
            className={`${
              activeTab === 'taxes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            disabled={isLoading}
          >
            Tax Returns
          </button>
          <button
            onClick={() => handleTabChange('asset_sellers')}
            className={`${
              activeTab === 'asset_sellers'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            disabled={isLoading}
          >
            Asset Sellers
          </button>
          <button
            onClick={() => handleTabChange('documents')}
            className={`${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg relative`}
            disabled={isLoading}
          >
            Required Documents
            {documentRequirements.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800">
                {documentProgress}%
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('brokers_originators')}
            className={`${
              activeTab === 'brokers_originators'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
            disabled={isLoading}
          >
            Brokers & Originators
          </button>
        </nav>
      </div>

      {/* Tab Content with Error Boundary and Suspense */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'application' && (
            <SafeForms
              userType={userContext?.userRole || 'borrower'}
              requestMode={false}
              onApplicationFormSelected={handleApplicationTypeSelect}
            />
          )}

          {activeTab === 'financial' && (
            <FinancialStatements userType={userContext?.userRole || 'borrower'} />
          )}

          {activeTab === 'taxes' && <BusinessTaxReturns />}

          {activeTab === 'asset_sellers' && <AssetSellers />}

          {activeTab === 'documents' && selectedApplicationType && (
            <DocumentRequirementsList
              applicationType={selectedApplicationType}
              onDocumentStatusChange={handleDocumentRequirementsChange}
            />
          )}

          {activeTab === 'brokers_originators' && <BrokersOriginators />}

          {activeTab === 'documents' && !selectedApplicationType && (
            <div className="py-12 text-center">
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
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No application type selected
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Please select an application type in the Application tab first.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleTabChange('application')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go to Application
                </button>
              </div>
            </div>
          )}
        </Suspense>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-md text-gray-700 ${
            isLoading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
          } focus:outline-none transition-colors duration-150`}
        >
          {isLoading ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-3 border border-transparent shadow-sm text-lg font-medium rounded-md text-white ${
            isLoading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
          } focus:outline-none transition-colors duration-150`}
        >
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>

      {/* Missing Documents Modal */}
      {showRequirementsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-yellow-600"
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
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Missing Required Documents
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Your application is missing required documents. Please upload all required
                    documents before submitting.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => {
                  setShowRequirementsModal(false);
                  handleTabChange('documents');
                }}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                View Required Documents
              </button>
              <button
                type="button"
                onClick={() => setShowRequirementsModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditApplication;
