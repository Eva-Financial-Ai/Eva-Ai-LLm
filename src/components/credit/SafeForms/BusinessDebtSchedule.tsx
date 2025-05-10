import React, { useState } from 'react';

interface DebtItem {
  id: string;
  creditorName: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  collateral: string;
  origDate: string;
  maturityDate: string;
  currentStatus: 'current' | 'past-due' | 'paid-off';
}

interface BusinessDebtScheduleProps {
  onSubmit: (data: DebtItem[]) => void;
  onSave: (data: DebtItem[]) => void;
}

const BusinessDebtSchedule: React.FC<BusinessDebtScheduleProps> = ({ onSubmit, onSave }) => {
  const [debtItems, setDebtItems] = useState<DebtItem[]>([
    {
      id: '1',
      creditorName: '',
      originalAmount: 0,
      currentBalance: 0,
      interestRate: 0,
      monthlyPayment: 0,
      collateral: '',
      origDate: '',
      maturityDate: '',
      currentStatus: 'current',
    },
  ]);

  const addDebtItem = () => {
    const newItem: DebtItem = {
      id: `${debtItems.length + 1}`,
      creditorName: '',
      originalAmount: 0,
      currentBalance: 0,
      interestRate: 0,
      monthlyPayment: 0,
      collateral: '',
      origDate: '',
      maturityDate: '',
      currentStatus: 'current',
    };
    setDebtItems([...debtItems, newItem]);
  };

  const removeDebtItem = (idToRemove: string) => {
    if (debtItems.length > 1) {
      setDebtItems(debtItems.filter(item => item.id !== idToRemove));
    }
  };

  const updateDebtItem = (id: string, field: keyof DebtItem, value: any) => {
    setDebtItems(debtItems.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const getTotalCurrentBalance = () => {
    return debtItems.reduce((sum, item) => sum + item.currentBalance, 0);
  };

  const getTotalMonthlyPayment = () => {
    return debtItems.reduce((sum, item) => sum + item.monthlyPayment, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Business Debt Schedule</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-700">
          List all business debts including loans, lines of credit, credit cards, and other
          financial obligations. This information helps us understand your current debt service and
          financial commitments.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Creditor Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Original Amount
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Current Balance
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Interest Rate
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Monthly Payment
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collateral
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Origination Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Maturity Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {debtItems.map((debt, index) => (
              <tr key={debt.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={debt.creditorName}
                    onChange={e => updateDebtItem(debt.id, 'creditorName', e.target.value)}
                    placeholder="Bank/Lender name"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md pl-5 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={debt.originalAmount || ''}
                      onChange={e =>
                        updateDebtItem(debt.id, 'originalAmount', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md pl-5 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={debt.currentBalance || ''}
                      onChange={e =>
                        updateDebtItem(debt.id, 'currentBalance', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      max="100"
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={debt.interestRate || ''}
                      onChange={e =>
                        updateDebtItem(debt.id, 'interestRate', parseFloat(e.target.value) || 0)
                      }
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">%</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md pl-5 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={debt.monthlyPayment || ''}
                      onChange={e =>
                        updateDebtItem(debt.id, 'monthlyPayment', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={debt.collateral}
                    onChange={e => updateDebtItem(debt.id, 'collateral', e.target.value)}
                    placeholder="If secured"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={debt.origDate}
                    onChange={e => updateDebtItem(debt.id, 'origDate', e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={debt.maturityDate}
                    onChange={e => updateDebtItem(debt.id, 'maturityDate', e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <select
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={debt.currentStatus}
                    onChange={e =>
                      updateDebtItem(
                        debt.id,
                        'currentStatus',
                        e.target.value as 'current' | 'past-due' | 'paid-off'
                      )
                    }
                  >
                    <option value="current">Current</option>
                    <option value="past-due">Past Due</option>
                    <option value="paid-off">Paid Off</option>
                  </select>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => removeDebtItem(debt.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={debtItems.length === 1}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={2} className="px-4 py-2 text-sm font-medium text-right">
                Total
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-medium">${getTotalCurrentBalance().toFixed(2)}</div>
              </td>
              <td></td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-medium">${getTotalMonthlyPayment().toFixed(2)}</div>
              </td>
              <td colSpan={5}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={addDebtItem}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-sm font-medium">Add Debt Item</span>
        </button>
      </div>

      <div className="mt-6 mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Debt-to-Income Ratio Calculation
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Annual Business Revenue ($)</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Annual Revenue"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Annual Debt Service ($)</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={getTotalMonthlyPayment() * 12}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Supporting Documents (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload loan statements</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="mt-6">
        <div className="flex items-start">
          <input
            id="certification"
            type="checkbox"
            className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="certification" className="ml-2 text-sm text-gray-700">
            I certify that the information provided in this business debt schedule is true,
            accurate, and complete to the best of my knowledge.
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => onSave(debtItems)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => onSubmit(debtItems)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BusinessDebtSchedule;
