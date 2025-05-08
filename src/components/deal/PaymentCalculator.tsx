import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

export interface PaymentCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
}

const PaymentCalculator: React.FC<PaymentCalculatorProps> = ({ 
  isOpen,
  onClose,
  initialAmount = 100000
}) => {
  const { currentTransaction } = useWorkflow();
  
  const [amount, setAmount] = useState<number>(initialAmount);
  const [rate, setRate] = useState<number>(5.5);
  const [term, setTerm] = useState<number>(60);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [residualValue, setResidualValue] = useState<number>(0);
  const [payment, setPayment] = useState<number>(0);
  
  useEffect(() => {
    if (currentTransaction) {
      setAmount(currentTransaction.amount);
      setDownPayment(Math.round(currentTransaction.amount * 0.1)); // Default 10% down
    }
  }, [currentTransaction]);
  
  useEffect(() => {
    calculatePayment();
  }, [amount, rate, term, downPayment, residualValue]);
  
  const calculatePayment = () => {
    const loanAmount = amount - downPayment;
    const residualAmount = amount * (residualValue / 100);
    const amountToFinance = loanAmount - residualAmount;
    
    // Monthly interest rate
    const monthlyRate = rate / 100 / 12;
    
    // Calculate payment using formula: P = (PV * r) / (1 - (1 + r)^-n)
    // Where: P = payment, PV = present value, r = rate per period, n = number of periods
    if (monthlyRate === 0) {
      // Simple division if rate is 0
      setPayment(amountToFinance / term);
    } else {
      const payment = (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
      setPayment(payment);
    }
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const getPaymentBreakdown = (): { principal: number; interest: number }[] => {
    const breakdown: { principal: number; interest: number }[] = [];
    let remainingBalance = amount - downPayment - (amount * (residualValue / 100));
    const monthlyRate = rate / 100 / 12;
    
    for (let i = 0; i < Math.min(term, 36); i++) { // Show up to 36 months for UI simplicity
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = payment - interestPayment;
      
      breakdown.push({
        principal: principalPayment,
        interest: interestPayment
      });
      
      remainingBalance -= principalPayment;
    }
    
    return breakdown;
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Payment Calculator</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term (months)
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value={12}>12 months (1 year)</option>
                <option value={24}>24 months (2 years)</option>
                <option value={36}>36 months (3 years)</option>
                <option value={48}>48 months (4 years)</option>
                <option value={60}>60 months (5 years)</option>
                <option value={72}>72 months (6 years)</option>
                <option value={84}>84 months (7 years)</option>
                <option value={96}>96 months (8 years)</option>
                <option value={108}>108 months (9 years)</option>
                <option value={120}>120 months (10 years)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Down Payment
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Math.max(0, Math.min(amount, Number(e.target.value))))}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Residual Value (%)
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="1"
                  value={residualValue}
                  onChange={(e) => setResidualValue(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-md">
            <h4 className="text-base font-medium text-gray-900 mb-2">Payment Details</h4>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Payment:</span>
              <span className="text-lg font-bold text-primary-600">{formatCurrency(payment)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Total Amount Financed:</span>
              <span className="font-medium">{formatCurrency(amount - downPayment)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Total Payments:</span>
              <span className="font-medium">{formatCurrency(payment * term)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-medium">{formatCurrency((payment * term) - (amount - downPayment - (amount * (residualValue / 100))))}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalculator; 