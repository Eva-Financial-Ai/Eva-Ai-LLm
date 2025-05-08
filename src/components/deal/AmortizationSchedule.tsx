import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

interface AmortizationScheduleProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentData {
  paymentNumber: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
}

const AmortizationSchedule: React.FC<AmortizationScheduleProps> = ({ isOpen, onClose }) => {
  const { currentTransaction } = useWorkflow();
  
  const [amount, setAmount] = useState<number>(currentTransaction?.amount || 100000);
  const [rate, setRate] = useState<number>(5.99);
  const [term, setTerm] = useState<number>(60);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [amountFinanced, setAmountFinanced] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [currentDisplayPage, setCurrentDisplayPage] = useState<number>(1);
  const paymentsPerPage = 12;

  useEffect(() => {
    if (currentTransaction) {
      setAmount(currentTransaction.amount);
      setDownPayment(Math.round(currentTransaction.amount * 0.1)); // Default 10% down
    }
  }, [currentTransaction]);
  
  useEffect(() => {
    calculateAmortization();
  }, [amount, rate, term, downPayment]);
  
  const calculateAmortization = () => {
    const financed = amount - downPayment;
    setAmountFinanced(financed);
    
    if (financed <= 0 || term <= 0) {
      setPayments([]);
      setTotalInterest(0);
      setTotalPayments(0);
      setMonthlyPayment(0);
      return;
    }
    
    const monthlyRate = rate / 100 / 12;
    let payment: number;
    
    if (monthlyRate === 0) {
      // If rate is 0, simple division
      payment = financed / term;
    } else {
      // Standard amortization formula
      payment = (financed * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                (Math.pow(1 + monthlyRate, term) - 1);
    }
    
    setMonthlyPayment(payment);
    
    let balance = financed;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    const amortizationSchedule: PaymentData[] = [];
    
    for (let i = 1; i <= term; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = payment - interestPayment;
      
      totalPrincipalPaid += principalPayment;
      totalInterestPaid += interestPayment;
      balance -= principalPayment;
      
      // Handle potential floating point error on the last payment
      if (i === term) {
        const finalPrincipal = principalPayment + balance;
        balance = 0;
        
        amortizationSchedule.push({
          paymentNumber: i,
          payment: payment,
          principal: finalPrincipal,
          interest: interestPayment,
          balance: 0,
          totalPrincipal: totalPrincipalPaid + balance,
          totalInterest: totalInterestPaid
        });
      } else {
        amortizationSchedule.push({
          paymentNumber: i,
          payment: payment,
          principal: principalPayment,
          interest: interestPayment,
          balance: balance > 0 ? balance : 0,
          totalPrincipal: totalPrincipalPaid,
          totalInterest: totalInterestPaid
        });
      }
    }
    
    setPayments(amortizationSchedule);
    setTotalInterest(totalInterestPaid);
    setTotalPayments(financed + totalInterestPaid);
  };
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercent = (value: number): string => {
    return value.toFixed(2) + '%';
  };
  
  // Get payments for the current page
  const getCurrentPagePayments = () => {
    const startIndex = (currentDisplayPage - 1) * paymentsPerPage;
    return payments.slice(startIndex, startIndex + paymentsPerPage);
  };
  
  const totalPages = Math.ceil(payments.length / paymentsPerPage);
  
  // Page navigation
  const goToPage = (page: number) => {
    setCurrentDisplayPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Amortization Schedule</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Inputs */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Parameters</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Term (months)</label>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={term}
                  onChange={(e) => setTerm(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Down Payment ($)</label>
                <input
                  type="number"
                  min="0"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  ({amount > 0 ? ((downPayment / amount) * 100).toFixed(1) : 0}% of total)
                </div>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 mt-6">
                <h4 className="text-sm font-medium text-gray-700 uppercase mb-3">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount Financed:</span>
                    <span className="text-sm font-medium">{formatCurrency(amountFinanced)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interest Rate:</span>
                    <span className="text-sm font-medium">{formatPercent(rate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Term:</span>
                    <span className="text-sm font-medium">{term} months</span>
                  </div>
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-sm text-gray-800">Monthly Payment:</span>
                    <span className="text-sm">{formatCurrency(monthlyPayment)}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Principal:</span>
                      <span className="text-sm font-medium">{formatCurrency(amountFinanced)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Interest:</span>
                      <span className="text-sm font-medium">{formatCurrency(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium pt-1">
                      <span className="text-sm text-gray-800">Total Payments:</span>
                      <span className="text-sm">{formatCurrency(totalPayments)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Amortization Table */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Schedule</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentDisplayPage === 1}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                  >
                    First
                  </button>
                  <button
                    onClick={() => goToPage(currentDisplayPage - 1)}
                    disabled={currentDisplayPage === 1}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="px-2 py-1 text-sm">
                    Page {currentDisplayPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentDisplayPage + 1)}
                    disabled={currentDisplayPage === totalPages}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentDisplayPage === totalPages}
                    className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                  >
                    Last
                  </button>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Amount
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Principal
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Interest
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getCurrentPagePayments().map((payment) => (
                        <tr key={payment.paymentNumber} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {payment.paymentNumber}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(payment.payment)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(payment.principal)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(payment.interest)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatCurrency(payment.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Payment Breakdown Visualization */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 uppercase mb-3">Principal vs. Interest Breakdown</h4>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-5">
                      <div 
                        className="bg-primary-600 h-5 rounded-l-full"
                        style={{ width: `${(amountFinanced / totalPayments) * 100}%` }}
                      >
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-primary-600 rounded-full mr-1"></div>
                      <span>Principal: {formatCurrency(amountFinanced)} ({((amountFinanced / totalPayments) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-gray-200 rounded-full mr-1"></div>
                      <span>Interest: {formatCurrency(totalInterest)} ({((totalInterest / totalPayments) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-500">
            * This is an amortization estimate. Actual payments may vary based on closing date and other factors.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AmortizationSchedule; 