import React, { useState, useEffect } from 'react';
import { QrCodeIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface CoinbaseUSDCPaymentProps {
  amount: number; // Payment amount in USD
  onSuccess: () => void;
  onCancel: () => void;
}

const CoinbaseUSDCPayment: React.FC<CoinbaseUSDCPaymentProps> = ({ amount, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 minutes in seconds
  const [isCopied, setIsCopied] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  
  // Format the countdown timer
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Mock function to generate a USDC payment address
  const generatePaymentAddress = () => {
    setIsLoading(true);
    
    // Simulate API call to generate a payment address
    setTimeout(() => {
      setPaymentAddress('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7');
      setIsLoading(false);
    }, 1500);
  };
  
  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(paymentAddress);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  // Check if payment was received
  const checkPaymentStatus = () => {
    setIsCheckingPayment(true);
    
    // Simulate checking payment status
    setTimeout(() => {
      // For demo purposes, always succeed
      onSuccess();
      setIsCheckingPayment(false);
    }, 2000);
  };
  
  // Initialize the payment address on component mount
  useEffect(() => {
    generatePaymentAddress();
  }, []);
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isLoading) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    }
  }, [timeLeft, isLoading]);
  
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Pay with USDC
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Send exactly <span className="font-semibold">{amount.toFixed(2)} USDC</span> to the address below. Payment must be received within the time limit.
      </p>
      
      {isLoading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-8 w-8 border-2 border-primary-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Time remaining:</span>
              <span className={`font-medium ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <div className="flex justify-center mb-4">
              {/* This would be a real QR code in production */}
              <div className="w-48 h-48 bg-white p-2 border border-gray-300 rounded-md flex items-center justify-center">
                <QrCodeIcon className="h-32 w-32 text-gray-400" />
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">USDC Payment Address:</label>
              <div className="flex">
                <input
                  type="text"
                  value={paymentAddress}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-l-md text-sm"
                />
                <button
                  onClick={copyAddressToClipboard}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  title="Copy to clipboard"
                >
                  <ClipboardDocumentIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {isCopied && (
                <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Only send USDC on the Ethereum network to this address. Other tokens or networks may result in lost funds.
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm text-gray-500 mb-4">
              After sending the payment, click the button below to check if it has been received.
            </p>
            
            <div className="flex justify-between">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              
              <button
                onClick={checkPaymentStatus}
                disabled={isCheckingPayment}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                  isCheckingPayment ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isCheckingPayment ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </div>
                ) : (
                  'I\'ve Sent the Payment'
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinbaseUSDCPayment; 