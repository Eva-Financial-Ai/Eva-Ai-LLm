import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface FinancialProfile {
  maxDownPayment: number;
  preferredTerm: number; // in months
  monthlyBudget: number;
  creditScore: number;
  yearlyRevenue: number;
  cashOnHand: number;
  collateralValue: number;
  debtToIncomeRatio?: number;
  operatingHistory?: number; // in years
  existingLoanBalance?: number;
  industryType?: string;
  businessStructure?: string;
}

interface CustomFinancialProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: FinancialProfile) => void;
  initialProfile: FinancialProfile;
  loanAmount: number;
}

const CustomFinancialProfileModal: React.FC<CustomFinancialProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialProfile,
  loanAmount,
}) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FinancialProfile>(initialProfile);

  const handleChange = (field: keyof FinancialProfile, value: string | number) => {
    setProfile({
      ...profile,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const handleSendCreditApplication = () => {
    navigate('/credit-application', {
      state: {
        prefilledData: {
          requestedAmount: loanAmount,
          preferredTerm: profile.preferredTerm,
          creditScore: profile.creditScore,
          businessRevenue: profile.yearlyRevenue,
        },
      },
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Custom Financial Profile</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="maxDownPayment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Maximum Down Payment
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="maxDownPayment"
                  value={profile.maxDownPayment || ''}
                  onChange={e => handleChange('maxDownPayment', e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="monthlyBudget"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Monthly Payment Budget
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="monthlyBudget"
                  value={profile.monthlyBudget || ''}
                  onChange={e => handleChange('monthlyBudget', e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="yearlyRevenue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Annual Business Revenue
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="yearlyRevenue"
                  value={profile.yearlyRevenue || ''}
                  onChange={e => handleChange('yearlyRevenue', e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="cashOnHand" className="block text-sm font-medium text-gray-700 mb-1">
                Available Cash on Hand
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="cashOnHand"
                  value={profile.cashOnHand || ''}
                  onChange={e => handleChange('cashOnHand', e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="existingLoanBalance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Existing Loan Balance
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="existingLoanBalance"
                  value={profile.existingLoanBalance || ''}
                  onChange={e => handleChange('existingLoanBalance', e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="collateralValue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available Collateral Value
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="collateralValue"
                  value={profile.collateralValue || ''}
                  onChange={e => handleChange('collateralValue', e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="preferredTerm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Term (months)
              </label>
              <select
                id="preferredTerm"
                value={profile.preferredTerm || ''}
                onChange={e => handleChange('preferredTerm', parseInt(e.target.value))}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="12">12 months (1 year)</option>
                <option value="24">24 months (2 years)</option>
                <option value="36">36 months (3 years)</option>
                <option value="48">48 months (4 years)</option>
                <option value="60">60 months (5 years)</option>
                <option value="72">72 months (6 years)</option>
                <option value="84">84 months (7 years)</option>
                <option value="96">96 months (8 years)</option>
                <option value="120">120 months (10 years)</option>
              </select>
            </div>

            <div>
              <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Credit Score
              </label>
              <select
                id="creditScore"
                value={profile.creditScore || ''}
                onChange={e => handleChange('creditScore', parseInt(e.target.value))}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="800">Excellent (800+)</option>
                <option value="750">Very Good (750-799)</option>
                <option value="700">Good (700-749)</option>
                <option value="650">Fair (650-699)</option>
                <option value="600">Poor (600-649)</option>
                <option value="550">Very Poor (below 600)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="debtToIncomeRatio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Debt-to-Income Ratio (%)
              </label>
              <input
                type="number"
                id="debtToIncomeRatio"
                value={profile.debtToIncomeRatio || ''}
                onChange={e => handleChange('debtToIncomeRatio', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label
                htmlFor="operatingHistory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Operating History (years)
              </label>
              <input
                type="number"
                id="operatingHistory"
                value={profile.operatingHistory || ''}
                onChange={e => handleChange('operatingHistory', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label
                htmlFor="industryType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Industry Type
              </label>
              <select
                id="industryType"
                value={profile.industryType || ''}
                onChange={e => handleChange('industryType', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Select Industry</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="construction">Construction</option>
                <option value="professional_services">Professional Services</option>
                <option value="food_service">Food Service</option>
                <option value="transportation">Transportation</option>
                <option value="agriculture">Agriculture</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="businessStructure"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Business Structure
              </label>
              <select
                id="businessStructure"
                value={profile.businessStructure || ''}
                onChange={e => handleChange('businessStructure', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Select Structure</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="s_corporation">S Corporation</option>
                <option value="c_corporation">C Corporation</option>
                <option value="non_profit">Non-Profit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendCreditApplication}
              className="px-4 py-2 border border-primary-300 shadow-sm text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none"
            >
              Continue to Credit Application
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Generate Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomFinancialProfileModal;
