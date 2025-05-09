import React from 'react';
import { useNavigate } from 'react-router-dom';

export const DealProgressCard: React.FC = () => {
  const navigate = useNavigate();

  // Mock application data
  const applicationData = {
    id: 'APP-123456',
    status: 'Document Collection',
    nextStep: 'Upload Financial Statements',
    progress: 30,
    steps: [
      { name: 'Application Submitted', status: 'completed' },
      { name: 'Initial Review', status: 'completed' },
      { name: 'Document Collection', status: 'current' },
      { name: 'Credit Analysis', status: 'upcoming' },
      { name: 'Decision', status: 'upcoming' },
      { name: 'Funding', status: 'upcoming' },
    ],
    requiredDocuments: [
      { name: 'Identity Verification', status: 'completed' },
      { name: 'Business Registration', status: 'completed' },
      { name: 'Financial Statements', status: 'pending' },
      { name: 'Tax Returns', status: 'pending' },
      { name: 'Bank Statements', status: 'pending' },
    ],
  };

  // Handle continue button click
  const handleContinueApplication = () => {
    navigate(`/credit-application?appId=${applicationData.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Application</h2>
            <p className="mt-1 text-sm text-gray-500">Application ID: {applicationData.id}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {applicationData.status}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Application Progress</span>
            <span className="text-sm font-medium text-gray-700">{applicationData.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${applicationData.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Next Steps</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
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
                <p className="text-sm text-yellow-700">{applicationData.nextStep}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Application Progress</h3>
            <ol className="relative border-l border-gray-200 ml-3">
              {applicationData.steps.map((step, index) => (
                <li key={index} className="mb-6 ml-6">
                  <span
                    className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white ${
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : step.status === 'current'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                    }`}
                  >
                    {step.status === 'completed' && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    )}
                    {step.status === 'current' && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </span>
                  <h3
                    className={`font-medium ${
                      step.status === 'completed'
                        ? 'text-green-500'
                        : step.status === 'current'
                          ? 'text-blue-500'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </h3>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Required Documents</h3>
            <ul className="space-y-3">
              {applicationData.requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-center">
                  {doc.status === 'completed' ? (
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-yellow-500 mr-2"
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
                  )}
                  <span className="text-gray-700">{doc.name}</span>
                  {doc.status === 'pending' && (
                    <button className="ml-auto text-xs text-blue-600 hover:text-blue-800">
                      Upload
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex justify-end">
        <button
          onClick={handleContinueApplication}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Continue Application
        </button>
      </div>
    </div>
  );
};
