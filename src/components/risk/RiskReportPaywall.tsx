import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import riskMapService from './RiskMapService';
import { RiskMapType } from './RiskMapNavigator';

interface PackageOption {
  id: string;
  name: string;
  creditCount: number;
  price: number;
  discount?: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface RiskReportPaywallProps {
  riskMapType: RiskMapType;
  onPurchaseComplete: () => void;
  onClose?: () => void;
}

const RiskReportPaywall: React.FC<RiskReportPaywallProps> = ({ 
  riskMapType, 
  onPurchaseComplete,
  onClose
}) => {
  const { currentTransaction } = useWorkflow();
  const [availableCredits, setAvailableCredits] = useState<number>(0);
  const [selectedPackage, setSelectedPackage] = useState<string>('single');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credits');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Get transaction ID
  const transactionId = currentTransaction?.id || 'unknown';
  
  // Package options
  const packageOptions: PackageOption[] = [
    { id: 'single', name: 'Single Report', creditCount: 1, price: 350.00 },
    { id: 'standard', name: 'Standard (5 Credits)', creditCount: 5, price: 1750.00, discount: 15 },
    { id: 'premium', name: 'Premium (30 Credits)', creditCount: 30, price: 9000.00, discount: 20 }
  ];
  
  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'credits', 
      name: 'Account Credits', 
      icon: '💰', 
      description: 'Use your pre-purchased credits',
      disabled: availableCredits < 1,
      disabledReason: 'Insufficient Credits'
    },
    { 
      id: 'ach', 
      name: 'ACH / Bank Transfer', 
      icon: '🏦', 
      description: 'Direct debit from your bank account' 
    },
    { 
      id: 'wire', 
      name: 'Wire Transfer', 
      icon: '🔄', 
      description: 'Manual wire transfer to our account' 
    },
    { 
      id: 'coinbase', 
      name: 'Coinbase (USDC)', 
      icon: '₿', 
      description: 'Pay with USDC stablecoin' 
    }
  ];
  
  // Calculate the base price for the selected package
  const selectedPackageOption = packageOptions.find(pkg => pkg.id === selectedPackage);
  const basePrice = selectedPackageOption?.price || 0;
  const discount = selectedPackageOption?.discount || 0;
  const discountAmount = (basePrice * discount) / 100;
  const finalPrice = basePrice - discountAmount;
  const perReportPrice = basePrice / (selectedPackageOption?.creditCount || 1);
  
  // Fetch available credits on mount
  useEffect(() => {
    const credits = riskMapService.getAvailableCredits();
    setAvailableCredits(credits);
  }, []);

  // Handle package selection
  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  // Process payment
  const handleProceedWithPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      if (selectedPaymentMethod === 'credits') {
        // Use credits for purchase
        if (availableCredits < 1) {
          throw new Error('Insufficient credits');
        }
        
        // Purchase the report with credits
        const success = riskMapService.purchaseReport(transactionId, riskMapType);
        
        if (success) {
          // Update available credits
          const newCredits = riskMapService.getAvailableCredits();
          setAvailableCredits(newCredits);
          
          setSuccessMessage('Report purchased successfully!');
          setTimeout(() => {
            onPurchaseComplete();
          }, 1000);
        } else {
          throw new Error('Failed to apply credits to purchase');
        }
      } else {
        // Process payment through external service
        // In a real implementation, this would call a payment API
        
        // Simulate a payment process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo, we'll assume payment is successful and add credits
        const creditsToAdd = selectedPackageOption?.creditCount || 1;
        riskMapService.addCredits(creditsToAdd);
        
        // Then use one credit to purchase the report
        const success = riskMapService.purchaseReport(transactionId, riskMapType);
        
        if (success) {
          // Update available credits
          const newCredits = riskMapService.getAvailableCredits();
          setAvailableCredits(newCredits);
          
          setSuccessMessage('Payment successful! Report purchased.');
          setTimeout(() => {
            onPurchaseComplete();
          }, 1000);
        } else {
          throw new Error('Payment processed but failed to apply credits');
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during payment processing');
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine if we should enable the payment button
  const isPaymentButtonEnabled = !isProcessing && 
    (selectedPaymentMethod !== 'credits' || availableCredits >= 1);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Risk Report Paywall</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Report Details</h3>
          <p className="text-sm text-gray-600">
            Risk Score & Report/Map w/ Blended Biz & Personal Credit Scores - {riskMapType.charAt(0).toUpperCase() + riskMapType.slice(1)} Application Type
          </p>
          <div className="text-xl font-bold mt-2">$300.00</div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Credit Package</h3>
          <div className="space-y-3">
            {packageOptions.map(pkg => (
              <div 
                key={pkg.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedPackage === pkg.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                }`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-gray-600">{pkg.creditCount} credits</div>
                  </div>
                  <div className="text-right">
                    {pkg.discount ? (
                      <>
                        <div className="font-medium">-{pkg.discount}%</div>
                        <div className="text-sm text-gray-600 line-through">${pkg.price.toFixed(2)}</div>
                        <div className="font-medium">${(pkg.price * (1 - pkg.discount/100)).toFixed(2)}</div>
                      </>
                    ) : (
                      <div className="font-medium">${pkg.price.toFixed(2)}</div>
                    )}
                  </div>
                </div>
                {pkg.discount && (
                  <div className="text-xs text-green-600 mt-1">
                    Save ${discountAmount.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Per report: ${perReportPrice.toFixed(2)}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-600">
              Your available credits: {availableCredits}
            </div>
            <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
              Buy More Credits
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                className={`w-full flex items-center p-3 border rounded-lg text-left ${
                  method.disabled
                    ? 'cursor-not-allowed bg-gray-50 border-gray-300 opacity-70'
                    : selectedPaymentMethod === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                }`}
                onClick={() => !method.disabled && handlePaymentMethodSelect(method.id)}
                disabled={method.disabled}
              >
                <span className="text-xl mr-3">{method.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-600">
                    {method.disabled ? method.disabledReason : method.description}
                  </div>
                </div>
                {selectedPaymentMethod === method.id && (
                  <div className="ml-3 text-primary-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            {successMessage}
          </div>
        )}
        
        <button
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isPaymentButtonEnabled
              ? 'bg-primary-600 hover:bg-primary-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleProceedWithPayment}
          disabled={!isPaymentButtonEnabled || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed with Payment'
          )}
        </button>
        
        <div className="text-xs text-gray-500 text-center mt-4">
          Secure Payment Processing
        </div>
        <div className="text-xs text-gray-500 text-center mt-1">
          Need help? <a href="#" className="text-primary-600 hover:text-primary-700">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default RiskReportPaywall; 