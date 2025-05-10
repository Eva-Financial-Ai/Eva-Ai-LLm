import React, { useState } from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}

interface ApplicationProgress {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
  lastSaved?: string;
}

interface SimplifiedBorrowerInterfaceProps {
  userName?: string;
  applicationId?: string;
  onSave?: () => void;
  onSubmit?: () => void;
}

const SimplifiedBorrowerInterface: React.FC<SimplifiedBorrowerInterfaceProps> = ({
  userName = 'User',
  applicationId = 'APP-12345',
  onSave,
  onSubmit,
}) => {
  // Application steps
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'company',
      title: 'Company Information',
      description: 'Basic details about your business',
      isComplete: true,
      isCurrent: false,
    },
    {
      id: 'financing',
      title: 'Financing Needs',
      description: 'Tell us about your financing requirements',
      isComplete: true,
      isCurrent: false,
    },
    {
      id: 'owners',
      title: 'Ownership Information',
      description: 'Details about business owners and guarantors',
      isComplete: false,
      isCurrent: true,
    },
    {
      id: 'financials',
      title: 'Financial Statements',
      description: 'Upload your business financial documents',
      isComplete: false,
      isCurrent: false,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your application before submission',
      isComplete: false,
      isCurrent: false,
    },
  ]);

  // Application progress
  const [progress, setProgress] = useState<ApplicationProgress>({
    currentStep: 3,
    totalSteps: 5,
    percentComplete: 40,
    lastSaved: new Date().toLocaleString(),
  });

  // Documents status
  const [documents, setDocuments] = useState([
    { id: 'doc1', name: 'Bank Statements', status: 'uploaded', required: true },
    { id: 'doc2', name: 'Business Tax Returns', status: 'uploaded', required: true },
    { id: 'doc3', name: 'Profit & Loss Statement', status: 'pending', required: true },
    { id: 'doc4', name: 'Balance Sheet', status: 'pending', required: true },
    { id: 'doc5', name: 'Business Plan', status: 'optional', required: false },
  ]);

  // Application summary
  const [summary, setSummary] = useState({
    companyName: 'Acme Enterprises',
    industry: 'Manufacturing',
    yearsInBusiness: 3,
    requestedAmount: 250000,
    purpose: 'Equipment Purchase',
    term: 60, // months
  });

  // Move to the next step
  const handleNextStep = () => {
    const currentIndex = steps.findIndex(step => step.isCurrent);
    if (currentIndex < steps.length - 1) {
      const updatedSteps = steps.map((step, index) => {
        if (index === currentIndex) {
          return { ...step, isComplete: true, isCurrent: false };
        }
        if (index === currentIndex + 1) {
          return { ...step, isCurrent: true };
        }
        return step;
      });

      setSteps(updatedSteps);
      setProgress({
        ...progress,
        currentStep: progress.currentStep + 1,
        percentComplete: Math.min(
          100,
          Math.round(((progress.currentStep + 1) / progress.totalSteps) * 100)
        ),
        lastSaved: new Date().toLocaleString(),
      });
    }
  };

  // Move to the previous step
  const handlePreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.isCurrent);
    if (currentIndex > 0) {
      const updatedSteps = steps.map((step, index) => {
        if (index === currentIndex) {
          return { ...step, isCurrent: false };
        }
        if (index === currentIndex - 1) {
          return { ...step, isCurrent: true };
        }
        return step;
      });

      setSteps(updatedSteps);
      setProgress({
        ...progress,
        currentStep: progress.currentStep - 1,
        percentComplete: Math.max(
          0,
          Math.round(((progress.currentStep - 1) / progress.totalSteps) * 100)
        ),
        lastSaved: new Date().toLocaleString(),
      });
    }
  };

  // Save application
  const handleSave = () => {
    setProgress({
      ...progress,
      lastSaved: new Date().toLocaleString(),
    });

    onSave?.();
  };

  // Submit application
  const handleSubmit = () => {
    onSubmit?.();
  };

  // Calculate remaining required documents
  const remainingRequiredDocs = documents.filter(
    doc => doc.status === 'pending' && doc.required
  ).length;

  // Get the current step content
  const getCurrentStepContent = () => {
    const currentStep = steps.find(step => step.isCurrent);
    if (!currentStep) return null;

    switch (currentStep.id) {
      case 'company':
        return (
          <div className="text-center text-gray-500">
            Company information form would appear here
          </div>
        );
      case 'financing':
        return (
          <div className="text-center text-gray-500">Financing needs form would appear here</div>
        );
      case 'owners':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ownership Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Full Name
                </label>
                <input
                  type="text"
                  id="ownerName"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title/Position
                </label>
                <input
                  type="text"
                  id="title"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="CEO"
                />
              </div>
              <div>
                <label htmlFor="ownership" className="block text-sm font-medium text-gray-700 mb-1">
                  Ownership Percentage
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="ownership"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-1">
                    Social Security Number
                  </label>
                  <span className="text-xs text-gray-500">Required for credit check</span>
                </div>
                <input
                  type="text"
                  id="ssn"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="XXX-XX-XXXX"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Home Address
                </label>
                <textarea
                  id="address"
                  rows={2}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your home address"
                ></textarea>
              </div>
              <div className="flex items-center mt-2">
                <input
                  id="guarantor"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="guarantor" className="ml-2 block text-sm text-gray-700">
                  This person will be a loan guarantor
                </label>
              </div>
              <div className="bg-blue-50 rounded-md p-3 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Credit Check Authorization
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        By providing this information, you authorize us to perform a soft credit
                        check which will not affect the owner's credit score.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {}}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Another Owner
                </button>
                <div>
                  <span className="text-sm text-gray-500">2 of 4 owners added</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'financials':
        return (
          <div className="text-center text-gray-500">
            Financial documents upload form would appear here
          </div>
        );
      case 'review':
        return (
          <div className="text-center text-gray-500">
            Application review and summary would appear here
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Application header */}
      <div className="bg-white shadow rounded-lg mb-5">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Business Financing Application
              </h1>
              <p className="mt-1 text-sm text-gray-500">Application ID: {applicationId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="text-md font-medium text-gray-900">{userName}</p>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-900">
                Application Progress ({progress.percentComplete}%)
              </div>
              <div className="text-sm text-gray-500">
                {progress.lastSaved && `Last saved: ${progress.lastSaved}`}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress.percentComplete}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Left sidebar - application steps */}
        <div className="w-full md:w-1/4">
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Steps</h2>
            <ol className="relative border-l border-gray-300 ml-3 space-y-6">
              {steps.map((step, index) => (
                <li key={step.id} className="mb-6 ml-6">
                  <span
                    className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white 
                    ${step.isComplete ? 'bg-green-500' : step.isCurrent ? 'bg-blue-500' : 'bg-gray-200'}`}
                  >
                    {step.isComplete ? (
                      <svg
                        className="w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">{index + 1}</span>
                    )}
                  </span>
                  <h3
                    className={`font-medium ${step.isCurrent ? 'text-blue-500' : 'text-gray-900'}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Application summary */}
          <div className="bg-white shadow rounded-lg p-5 mt-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Summary</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Company Name</div>
                <div className="font-medium">{summary.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Industry</div>
                <div className="font-medium">{summary.industry}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Years in Business</div>
                <div className="font-medium">{summary.yearsInBusiness} years</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Requested Amount</div>
                <div className="font-medium">${summary.requestedAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Purpose</div>
                <div className="font-medium">{summary.purpose}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Term</div>
                <div className="font-medium">{summary.term} months</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-2/4">
          {/* Current step content */}
          {getCurrentStepContent()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handlePreviousStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={steps[0].isCurrent}
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Previous
            </button>
            <div>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Save
              </button>
              {steps[steps.length - 1].isCurrent ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Application
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <svg
                    className="ml-2 -mr-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar - help and documents */}
        <div className="w-full md:w-1/4">
          {/* Next Steps guidance */}
          <div className="bg-white shadow rounded-lg p-5 mb-5">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Complete the required information for all business owners with 20% or greater
                    ownership.
                  </p>
                </div>
              </div>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-600">Complete business information</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-600">Specify financing needs</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-blue-600 font-medium">
                  Add all business owners (in progress)
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-500">Upload financial documents</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-500">Review and submit</span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Need Help?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Our team is here to assist you with your application.
              </p>
              <div className="mt-2">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          {/* Document status */}
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  remainingRequiredDocs === 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {remainingRequiredDocs === 0 ? 'Complete' : `${remainingRequiredDocs} Required`}
              </span>
            </div>

            <ul className="space-y-3">
              {documents.map(doc => (
                <li
                  key={doc.id}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    {doc.status === 'uploaded' ? (
                      <svg
                        className="h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : doc.status === 'pending' ? (
                      <svg
                        className="h-5 w-5 text-yellow-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="ml-2 text-sm text-gray-700">{doc.name}</span>
                    {doc.required ? (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    ) : (
                      <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      ${doc.status === 'uploaded' ? 'border-green-300 text-green-700' : ''}
                    `}
                  >
                    {doc.status === 'uploaded' ? 'View' : 'Upload'}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <div className="text-sm font-medium text-gray-900 mb-2">Document Upload Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${(documents.filter(d => d.status === 'uploaded').length / documents.length) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {documents.filter(d => d.status === 'uploaded').length} of {documents.length}{' '}
                documents uploaded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedBorrowerInterface;
