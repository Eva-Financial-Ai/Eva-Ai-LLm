import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../contexts/WorkflowContext';
import FilelockDriveApp from '../components/document/FilelockDriveApp';
import PageLayout from '../components/layout/PageLayout';

// Example prompt templates for document-related questions
const DOC_PROMPTS = {
  FAQ: 'What documents are typically required for an equipment loan application?',
  GUIDE: 'How should I prepare financial statements for a business loan application?',
  ANALYSIS: 'Can you analyze if the provided documentation is sufficient for approval?',
};

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const { currentTransaction, advanceStage } = useWorkflow();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(
      'Documents page mounted, currentTransaction:',
      currentTransaction ? 'exists' : 'null'
    );
  }, [currentTransaction]);

  const handleContinue = () => {
    if (currentTransaction) {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        advanceStage(currentTransaction.id, 'risk_assessment');
        navigate('/risk-assessment');
        setIsLoading(false);
      }, 500);
    }
  };

  // Helper function to trigger a specific chat prompt
  const triggerChatPrompt = (promptType: keyof typeof DOC_PROMPTS) => {
    // Create a custom event to communicate with the AIChatAdvisor component
    const event = new CustomEvent('eva-ai-prompt', {
      detail: { prompt: DOC_PROMPTS[promptType] },
    });
    window.dispatchEvent(event);
  };

  return (
    <PageLayout title="Filelock Drive">
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <FilelockDriveApp />
        </div>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">AI Document Assistant</h2>
          <p className="text-sm text-gray-500 mb-4">
            Get help with document preparation and verification from EVA AI
          </p>

          <div className="space-y-3">
            <button
              onClick={() => triggerChatPrompt('FAQ')}
              className="w-full flex items-center justify-between p-3 text-left text-sm rounded-md border hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Document FAQ</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={() => triggerChatPrompt('GUIDE')}
              className="w-full flex items-center justify-between p-3 text-left text-sm rounded-md border hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
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
                <span>Document Guide</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={() => triggerChatPrompt('ANALYSIS')}
              className="w-full flex items-center justify-between p-3 text-left text-sm rounded-md border hover:bg-gray-50"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span>AI Document Analysis</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {currentTransaction && (
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              {isLoading ? 'Loading...' : 'Continue to Risk Assessment'}
            </button>
          )}

          {!currentTransaction && (
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Documents;
