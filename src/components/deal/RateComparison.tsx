import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

interface RateComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample lender data
interface LenderRate {
  id: string;
  name: string;
  baseRate: number;
  termAdjustments: Record<number, number>;
  creditTierAdjustments: Record<string, number>;
  downPaymentAdjustments: Record<number, number>;
}

const RateComparison: React.FC<RateComparisonProps> = ({ isOpen, onClose }) => {
  const { currentTransaction } = useWorkflow();

  const [amount, setAmount] = useState<number>(currentTransaction?.amount || 100000);
  const [term, setTerm] = useState<number>(60);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [creditTier, setCreditTier] = useState<string>('excellent');
  const [selectedLenders, setSelectedLenders] = useState<string[]>([
    'lender1',
    'lender2',
    'lender3',
  ]);

  // Sample rate data for different lenders
  const lenderRates: LenderRate[] = [
    {
      id: 'lender1',
      name: 'Premier Finance',
      baseRate: 5.49,
      termAdjustments: { 24: -0.5, 36: -0.25, 48: 0, 60: 0.25, 72: 0.5, 84: 0.75 },
      creditTierAdjustments: { excellent: -0.5, good: 0, fair: 1.5, poor: 3.0 },
      downPaymentAdjustments: { 0: 0.25, 10: 0, 20: -0.25, 30: -0.5 },
    },
    {
      id: 'lender2',
      name: 'Business Capital Corp',
      baseRate: 5.75,
      termAdjustments: { 24: -0.75, 36: -0.5, 48: -0.25, 60: 0, 72: 0.25, 84: 0.5 },
      creditTierAdjustments: { excellent: -0.75, good: -0.25, fair: 1.0, poor: 2.5 },
      downPaymentAdjustments: { 0: 0.5, 10: 0.25, 20: 0, 30: -0.25 },
    },
    {
      id: 'lender3',
      name: 'Industrial Funding',
      baseRate: 5.25,
      termAdjustments: { 24: -0.25, 36: 0, 48: 0.25, 60: 0.5, 72: 0.75, 84: 1.0 },
      creditTierAdjustments: { excellent: -0.25, good: 0.25, fair: 1.75, poor: 3.5 },
      downPaymentAdjustments: { 0: 0.5, 10: 0.25, 20: 0, 30: -0.25 },
    },
    {
      id: 'lender4',
      name: 'Alliance Financial',
      baseRate: 5.99,
      termAdjustments: { 24: -0.5, 36: -0.25, 48: 0, 60: 0.25, 72: 0.5, 84: 0.75 },
      creditTierAdjustments: { excellent: -1.0, good: -0.5, fair: 0.75, poor: 2.25 },
      downPaymentAdjustments: { 0: 0.25, 10: 0, 20: -0.25, 30: -0.5 },
    },
    {
      id: 'lender5',
      name: 'CrossCountry Equipment',
      baseRate: 5.35,
      termAdjustments: { 24: -0.35, 36: -0.1, 48: 0.15, 60: 0.4, 72: 0.65, 84: 0.9 },
      creditTierAdjustments: { excellent: -0.6, good: 0, fair: 1.25, poor: 2.75 },
      downPaymentAdjustments: { 0: 0.3, 10: 0.1, 20: -0.1, 30: -0.3 },
    },
  ];

  useEffect(() => {
    if (currentTransaction) {
      setAmount(currentTransaction.amount);
      setDownPayment(Math.round(currentTransaction.amount * 0.1)); // Default 10% down
    }
  }, [currentTransaction]);

  const getEffectiveRate = (lender: LenderRate): number => {
    // Find the nearest term adjustment
    const termOptions = Object.keys(lender.termAdjustments)
      .map(Number)
      .sort((a, b) => a - b);
    let closestTerm = termOptions[0];
    for (const t of termOptions) {
      if (Math.abs(t - term) < Math.abs(closestTerm - term)) {
        closestTerm = t;
      }
    }

    // Find the nearest down payment adjustment
    const downPaymentOptions = Object.keys(lender.downPaymentAdjustments)
      .map(Number)
      .sort((a, b) => a - b);
    let closestDP = downPaymentOptions[0];
    const downPaymentPercent = (downPayment / amount) * 100;
    for (const dp of downPaymentOptions) {
      if (Math.abs(dp - downPaymentPercent) < Math.abs(closestDP - downPaymentPercent)) {
        closestDP = dp;
      }
    }

    // Calculate effective rate
    return (
      lender.baseRate +
      lender.termAdjustments[closestTerm] +
      lender.creditTierAdjustments[creditTier] +
      lender.downPaymentAdjustments[closestDP]
    );
  };

  const calculatePayment = (rate: number): number => {
    const amountFinanced = amount - downPayment;

    if (amountFinanced <= 0 || term <= 0) {
      return 0;
    }

    const monthlyRate = rate / 100 / 12;

    if (monthlyRate === 0) {
      return amountFinanced / term;
    } else {
      return (
        (amountFinanced * monthlyRate * Math.pow(1 + monthlyRate, term)) /
        (Math.pow(1 + monthlyRate, term) - 1)
      );
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return value.toFixed(2) + '%';
  };

  const handleLenderToggle = (lenderId: string) => {
    setSelectedLenders(prev =>
      prev.includes(lenderId) ? prev.filter(id => id !== lenderId) : [...prev, lenderId]
    );
  };

  const getComparisons = () => {
    return lenderRates
      .filter(lender => selectedLenders.includes(lender.id))
      .map(lender => {
        const rate = getEffectiveRate(lender);
        const payment = calculatePayment(rate);
        const totalInterest = payment * term - (amount - downPayment);
        const totalCost = payment * term + downPayment;

        return {
          lender,
          rate,
          payment,
          totalInterest,
          totalCost,
        };
      })
      .sort((a, b) => a.payment - b.payment); // Sort by payment amount
  };

  if (!isOpen) return null;

  const comparisons = getComparisons();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Rate Comparison</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Inputs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financing Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Term (months)</label>
                <select
                  value={term}
                  onChange={e => setTerm(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                  <option value={60}>60 months</option>
                  <option value={72}>72 months</option>
                  <option value={84}>84 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Down Payment ($)</label>
                <input
                  type="number"
                  min="0"
                  value={downPayment}
                  onChange={e => setDownPayment(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  ({amount > 0 ? ((downPayment / amount) * 100).toFixed(1) : 0}% of total)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Credit Tier</label>
                <select
                  value={creditTier}
                  onChange={e => setCreditTier(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="excellent">Excellent (720+)</option>
                  <option value="good">Good (680-719)</option>
                  <option value="fair">Fair (640-679)</option>
                  <option value="poor">Poor (below 640)</option>
                </select>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Lenders
                </label>
                <div className="space-y-2">
                  {lenderRates.map(lender => (
                    <label key={lender.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLenders.includes(lender.id)}
                        onChange={() => handleLenderToggle(lender.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{lender.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Comparison Results */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lender Comparison</h3>

              {comparisons.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">
                    Please select at least one lender to compare rates.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rate Comparison Chart */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 uppercase mb-3">
                      Interest Rate Comparison
                    </h4>
                    <div className="space-y-3">
                      {comparisons.map(({ lender, rate }) => (
                        <div key={lender.id} className="flex items-center">
                          <div className="w-32 text-sm">{lender.name}</div>
                          <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                            <div
                              className="h-full bg-primary-600"
                              style={{ width: `${Math.min(100, rate * 5)}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-right text-sm font-medium">
                            {formatPercent(rate)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Comparison */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 uppercase mb-3">
                      Monthly Payment Comparison
                    </h4>
                    <div className="space-y-3">
                      {comparisons.map(({ lender, payment }) => (
                        <div key={lender.id} className="flex items-center">
                          <div className="w-32 text-sm">{lender.name}</div>
                          <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                            <div
                              className="h-full bg-green-600"
                              style={{
                                width: `${(payment / comparisons[comparisons.length - 1].payment) * 90}%`,
                              }}
                            ></div>
                          </div>
                          <div className="w-24 text-right text-sm font-medium">
                            {formatCurrency(payment)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Comparison Table */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-x-auto">
                    <h4 className="text-sm font-medium text-gray-700 uppercase mb-3">
                      Detailed Comparison
                    </h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lender
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rate
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monthly Payment
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Interest
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {comparisons.map(({ lender, rate, payment, totalInterest, totalCost }) => (
                          <tr key={lender.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {lender.name}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                              {formatPercent(rate)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium">
                              {formatCurrency(payment)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                              {formatCurrency(totalInterest)}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                              {formatCurrency(totalCost)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
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

export default RateComparison;
