import React, { useState } from 'react';
import { XMarkIcon, CheckCircleIcon, CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// Define the pricing structure based on risk report type
const PRICING = {
  unsecured: {
    price: 300.00,
    title: 'Risk Score & Report/Map w/ Blended Biz & Personal Credit Scores - General Application Type - Not Collateralized',
  },
  equipment: {
    price: 335.00,
    title: 'Risk Score & Report/Map w/ Blended Biz & Personal Credit Scores - Equipment & Vehicles Application Type',
  },
  realestate: {
    price: 335.00,
    title: 'Risk Score & Report/Map w/ Blended Biz & Personal Credit Scores - Real Estate Application Type',
  }
};

// Available payment methods
const PAYMENT_METHODS = [
  { id: 'credits', name: 'Account Credits', icon: '💰', description: 'Use your pre-purchased credits' },
  { id: 'plaid_ach', name: 'ACH / Bank Transfer', icon: '🏦', description: 'Direct debit from your bank account' },
  { id: 'wire', name: 'Wire Transfer', icon: '🔄', description: 'Manual wire transfer to our account' },
  { id: 'coinbase', name: 'Coinbase (USDC)', icon: '₿', description: 'Pay with USDC stablecoin' }
];

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reportType: 'unsecured' | 'equipment' | 'realestate';
}

const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onSuccess, reportType }) => {
  const [availableCredits] = useState<number>(250);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credits');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get the price info for the selected report type
  const priceInfo = PRICING[reportType];
  
  // Calculate if user has enough credits
  const hasEnoughCredits = availableCredits >= priceInfo.price;
  
  // Handle payment method selection
  const handleSelectPaymentMethod = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setError(null);
  };
  
  // Handle payment submission
  const handleSubmitPayment = () => {
    setError(null);
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (selectedPaymentMethod === 'credits') {
        if (hasEnoughCredits) {
          // Deduct credits and confirm payment
          setPaymentConfirmed(true);
        } else {
          setError("Insufficient credits. Please purchase more credits or choose another payment method.");
        }
      } else {
        // For demo purposes, all other payment methods are successful
        setPaymentConfirmed(true);
      }
      
      setIsProcessing(false);
    }, 1500);
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <LockClosedIcon className="w-5 h-5 mr-2 text-primary-600" />
            Risk Report Paywall
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4">
          {paymentConfirmed ? (
            /* Success message */
            <div className="text-center py-10">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Successful</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your risk report is being generated and will be ready momentarily.
              </p>
              <div className="mt-6">
                <button
                  onClick={onSuccess}
                  className="w-full bg-primary-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none"
                >
                  Continue to Report
                </button>
              </div>
            </div>
          ) : (
            /* Payment form */
            <>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-md font-medium text-blue-800 mb-2">Report Details</h3>
                <p className="text-sm text-blue-700">{priceInfo.title}</p>
                <div className="mt-2 text-xl font-bold text-blue-900">${priceInfo.price.toFixed(2)}</div>
              </div>
              
              {/* Current Credits */}
              <div className="mb-6 flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <span className="text-sm text-gray-600">Your available credits:</span>
                  <span className="ml-2 font-semibold">${availableCredits.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => alert('Redirecting to credits purchase page...')} 
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  Buy More Credits
                </button>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                  {error}
                </div>
              )}
              
              {/* Payment Methods */}
              <h3 className="text-md font-medium text-gray-800 mb-3">Select Payment Method</h3>
              <div className="space-y-2 mb-6">
                {PAYMENT_METHODS.map(method => {
                  const isDisabled = method.id === 'credits' && !hasEnoughCredits;
                  
                  return (
                    <div 
                      key={method.id}
                      className={`p-3 border rounded-lg flex items-center cursor-pointer ${
                        isDisabled 
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' 
                          : selectedPaymentMethod === method.id
                            ? 'border-primary-300 bg-primary-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => !isDisabled && handleSelectPaymentMethod(method.id)}
                    >
                      <div className="flex-shrink-0 h-6 w-6 text-center mr-3">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">{method.name}</span>
                          {method.id === 'credits' && (
                            <span className={`text-sm ${hasEnoughCredits ? 'text-green-600' : 'text-red-600'}`}>
                              {hasEnoughCredits ? 'Sufficient Credits' : 'Insufficient Credits'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <div className="ml-3">
                        <div className={`h-5 w-5 rounded-full border ${
                          selectedPaymentMethod === method.id 
                            ? 'border-primary-500 bg-primary-500' 
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="h-3 w-3 m-1 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Payment button */}
              <button
                onClick={handleSubmitPayment}
                disabled={isProcessing || (selectedPaymentMethod === 'credits' && !hasEnoughCredits)}
                className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                  isProcessing || (selectedPaymentMethod === 'credits' && !hasEnoughCredits)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : selectedPaymentMethod === 'credits' ? (
                  <>Use Credits</>
                ) : (
                  <>Proceed with Payment</>
                )}
              </button>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <CreditCardIcon className="h-4 w-4 mr-1" />
            <span>Secure Payment Processing</span>
          </div>
          <div>
            Need help? <a href="#" className="text-primary-600 hover:underline">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal; 