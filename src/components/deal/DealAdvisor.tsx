import React, { useState, useEffect } from 'react';
import PaymentCalculator from './PaymentCalculator';
import RateComparison from './RateComparison';
import AmortizationSchedule from './AmortizationSchedule';
import { useWorkflow } from '../../contexts/WorkflowContext';

export interface DealAdvisorProps {
  className?: string;
}

const DealAdvisor: React.FC<DealAdvisorProps> = ({ className = '' }) => {
  const { currentTransaction, loading: transactionLoading } = useWorkflow();
  const [showPaymentCalculator, setShowPaymentCalculator] = useState(false);
  const [showRateComparison, setShowRateComparison] = useState(false);
  const [showAmortizationSchedule, setShowAmortizationSchedule] = useState(false);
  const [showSmartMatchingChat, setShowSmartMatchingChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);

  // Initialize the component and handle loading states
  useEffect(() => {
    console.log('DealAdvisor component initializing...');

    const initializeAdvisor = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Wait for transaction data to be available
        if (transactionLoading) {
          console.log('Waiting for transaction data...');
          return; // Will re-run when transactionLoading changes
        }

        // Check if we have transaction data
        if (!currentTransaction) {
          console.log('No transaction data available for DealAdvisor');
          setError('Please select a transaction to access advisor tools');
        } else {
          console.log('Transaction data loaded for DealAdvisor:', currentTransaction.id);
        }
      } catch (err) {
        console.error('Error initializing DealAdvisor:', err);
        setError('Failed to initialize deal advisor tools');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAdvisor();
  }, [currentTransaction, transactionLoading]);

  // Handle Smart Matching chat
  const handleSmartMatchingClick = () => {
    // Initialize chat with welcome message
    setChatMessages([
      {
        role: 'assistant',
        content:
          'Welcome to Smart Matching! I can help you find the perfect financing structure for your needs. Let me ask you a few questions to get started.',
      },
      {
        role: 'assistant',
        content: 'What type of asset are you looking to finance?',
      },
    ]);

    setShowSmartMatchingChat(true);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-5"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-medium text-gray-900 mb-2">AI Deal Advisor</h3>
      <p className="text-sm text-gray-500 mb-4">
        Get intelligent insights on optimal deal structures
      </p>

      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => setShowPaymentCalculator(true)}
            className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Payment Calculator
          </button>

          <button
            onClick={() => setShowRateComparison(true)}
            className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Rate Comparison
          </button>

          <button
            onClick={() => setShowAmortizationSchedule(true)}
            className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Amortization Schedule
          </button>

          <button
            onClick={handleSmartMatchingClick}
            className="w-full flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            <svg
              className="mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            Smart Matching Assistant
          </button>
        </div>
      )}

      {/* Modals */}
      {currentTransaction && (
        <>
          <PaymentCalculator
            isOpen={showPaymentCalculator}
            onClose={() => setShowPaymentCalculator(false)}
            initialAmount={currentTransaction?.amount || 0}
          />

          <RateComparison
            isOpen={showRateComparison}
            onClose={() => setShowRateComparison(false)}
          />

          <AmortizationSchedule
            isOpen={showAmortizationSchedule}
            onClose={() => setShowAmortizationSchedule(false)}
          />

          {/* Smart Matching Chat Interface */}
          {showSmartMatchingChat && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Smart Matching Assistant</h3>
                  <button
                    onClick={() => setShowSmartMatchingChat(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  {chatMessages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`inline-block px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-gray-200">
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const input = e.currentTarget.elements.namedItem(
                        'chat-input'
                      ) as HTMLInputElement;
                      const message = input.value.trim();

                      if (message) {
                        // Add user message
                        setChatMessages(prev => [...prev, { role: 'user', content: message }]);

                        // Simulate AI response (in a real app, this would call an API)
                        setTimeout(() => {
                          setChatMessages(prev => [
                            ...prev,
                            {
                              role: 'assistant',
                              content:
                                'Thank you for sharing that information. Based on your needs, I recommend exploring equipment leasing options with terms between 48-60 months. Would you like me to match you with optimal financing structures?',
                            },
                          ]);
                        }, 1000);

                        // Clear input
                        input.value = '';
                      }
                    }}
                    className="flex space-x-2"
                  >
                    <input
                      type="text"
                      name="chat-input"
                      placeholder="Type your message..."
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DealAdvisor;
