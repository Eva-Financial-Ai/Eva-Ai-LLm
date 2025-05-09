import React from 'react';
import { motion } from 'framer-motion';

// Common Types
export interface DealOption {
  id: string;
  name: string;
  term: number; // in months
  rate: number; // as percentage
  payment: number;
  downPayment: number;
  residual: number; // as percentage
  score: number; // optimality score out of 100
}

export interface CustomRequest {
  term?: number;
  rate?: number;
  downPayment?: number;
  residual?: number;
  additionalNotes?: string;
}

// Utility functions extracted for reuse
export const calculatePayment = (
  amount: number,
  term: number,
  rate: number,
  downPayment: number = 0,
  residualPercent: number = 0
): number => {
  // Calculate loan amount after down payment and residual
  const residualAmount = amount * (residualPercent / 100);
  const loanAmount = amount - downPayment - residualAmount;

  // Convert annual interest rate to monthly
  const monthlyRate = rate / 100 / 12;

  // Calculate payment using the loan formula
  if (monthlyRate === 0) {
    return loanAmount / term;
  }

  const payment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term))) /
    (Math.pow(1 + monthlyRate, term) - 1);
  return Math.round(payment * 100) / 100;
};

export const getScoreColor = (score: number): string => {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-blue-100 text-blue-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Shared Loading Spinner Component for all deal structuring components
export const SharedLoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  submessage?: string;
}> = ({ size = 'md', message = 'Loading...', submessage }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div
        className={`${sizeClasses[size]} border-t-primary-600 border-primary-200 rounded-full animate-spin mb-4`}
        role="status"
      ></div>
      <h3 className="text-lg font-medium text-gray-900">{message}</h3>
      {submessage && <p className="mt-2 text-sm text-gray-500">{submessage}</p>}
    </div>
  );
};

// Enhanced and Optimized Loading Skeleton Component
export const DealOptionsSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-4"></div>
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between mb-3">
            <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded-md w-16"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-5 bg-gray-200 rounded-md"></div>
            <div className="h-5 bg-gray-200 rounded-md"></div>
            <div className="h-5 bg-gray-200 rounded-md"></div>
            <div className="h-5 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Smart Match Loading Skeleton with optimized rendering
export const SmartMatchSkeleton: React.FC = () => (
  <div className="animate-pulse rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <div className="h-7 bg-gray-200 rounded-md w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-5 bg-gray-200 rounded-md"></div>
          <div className="h-5 bg-gray-200 rounded-md"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-5 bg-gray-200 rounded-md"></div>
          <div className="h-5 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="h-32 bg-gray-200 rounded-md"></div>
        <div className="h-32 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  </div>
);

// Structure Editor Loading Skeleton with optimized rendering
export const StructureEditorSkeleton: React.FC = () => (
  <div className="animate-pulse rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200 flex justify-between">
      <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded-md w-16"></div>
    </div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
      <div className="space-y-3 mb-6">
        <div className="h-32 bg-gray-200 rounded-md"></div>
        <div className="h-32 bg-gray-200 rounded-md"></div>
      </div>
      <div className="flex justify-end space-x-2">
        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
        <div className="h-8 bg-gray-200 rounded-md w-24"></div>
      </div>
    </div>
  </div>
);

// Error Component
export const ErrorMessage: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error Loading Deal Options</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{message}</p>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Deal Option Card Component
export const DealOptionCard: React.FC<{
  option: DealOption;
  selected: boolean;
  onSelect: () => void;
}> = ({ option, selected, onSelect }) => {
  const scoreColor = getScoreColor(option.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border rounded-lg p-4 mb-4 transition-colors duration-200 ${
        selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreColor}`}
        >
          {option.score}/100
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
        <div>
          <span className="text-sm text-gray-500">Term:</span>{' '}
          <span className="font-medium">{option.term} months</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Rate:</span>{' '}
          <span className="font-medium">{option.rate.toFixed(2)}%</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Payment:</span>{' '}
          <span className="font-medium">{formatCurrency(option.payment)}/mo</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Down Payment:</span>{' '}
          <span className="font-medium">{formatCurrency(option.downPayment)}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500">Residual:</span>{' '}
          <span className="font-medium">{option.residual}%</span>
        </div>
      </div>

      <button
        className={`w-full py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
          selected
            ? 'border-transparent bg-primary-600 text-white hover:bg-primary-700'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={onSelect}
      >
        {selected ? 'Selected' : 'Select Option'}
      </button>
    </motion.div>
  );
};

// Custom Request Form Component
export const CustomRequestForm: React.FC<{
  customRequest: CustomRequest;
  onChange: (field: keyof CustomRequest, value: string | number) => void;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ customRequest, onChange, onSubmit, onCancel }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Request Custom Terms</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            Term (months)
          </label>
          <input
            type="number"
            id="term"
            value={customRequest.term || ''}
            onChange={e => onChange('term', parseInt(e.target.value) || 0)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. 48"
          />
        </div>

        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
            Rate (%)
          </label>
          <input
            type="number"
            id="rate"
            value={customRequest.rate || ''}
            onChange={e => onChange('rate', parseFloat(e.target.value) || 0)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. 5.25"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment ($)
          </label>
          <input
            type="number"
            id="downPayment"
            value={customRequest.downPayment || ''}
            onChange={e => onChange('downPayment', parseInt(e.target.value) || 0)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. 10000"
          />
        </div>

        <div>
          <label htmlFor="residual" className="block text-sm font-medium text-gray-700 mb-1">
            Residual (%)
          </label>
          <input
            type="number"
            id="residual"
            value={customRequest.residual || ''}
            onChange={e => onChange('residual', parseInt(e.target.value) || 0)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="e.g. 10"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          id="additionalNotes"
          value={customRequest.additionalNotes || ''}
          onChange={e => onChange('additionalNotes', e.target.value)}
          rows={3}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Any additional details or requirements..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

// Confirmation Message Component
export const ConfirmationMessage: React.FC<{
  title: string;
  message: string;
  onClose?: () => void;
}> = ({ title, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{message}</p>
          </div>
          {onClose && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Progress Checklist Component
export const ProgressChecklist: React.FC<{
  items: { id: string; text: string; isCompleted: boolean }[];
  onComplete: (itemId: string) => void;
}> = ({ items, onComplete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Completion Checklist</h3>
      <ul className="space-y-3">
        {items.map(item => (
          <li key={item.id} className="flex items-start">
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => onComplete(item.id)}
                className={`w-5 h-5 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  item.isCompleted ? 'bg-primary-600 text-white' : 'border border-gray-300 bg-white'
                }`}
              >
                {item.isCompleted && (
                  <svg className="w-3 h-3 mx-auto" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                  </svg>
                )}
              </button>
            </div>
            <span
              className={`ml-3 text-sm ${item.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Action Buttons Component
export const ActionButtons: React.FC<{
  primaryText: string;
  primaryAction: () => void;
  secondaryText?: string;
  secondaryAction?: () => void;
  primaryDisabled?: boolean;
}> = ({ primaryText, primaryAction, secondaryText, secondaryAction, primaryDisabled }) => {
  return (
    <div className="flex space-x-3">
      {secondaryText && secondaryAction && (
        <button
          type="button"
          onClick={secondaryAction}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {secondaryText}
        </button>
      )}
      <button
        type="button"
        onClick={primaryAction}
        disabled={primaryDisabled}
        className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          primaryDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        }`}
      >
        {primaryText}
      </button>
    </div>
  );
};
