import React from 'react';
import { useWorkflow, Transaction } from '../contexts/WorkflowContext';
import useTransactionStore from '../hooks/useTransactionStore';

interface TransactionTimeMetricsProps {
  transactionId: string;
  compact?: boolean;
}

const TransactionTimeMetrics: React.FC<TransactionTimeMetricsProps> = ({ 
  transactionId,
  compact = false
}) => {
  const { 
    getTimeElapsedFormatted, 
    getTimeInStageFormatted
  } = useWorkflow();
  
  // Using the transaction store to get the current transaction
  const { transactions } = useTransactionStore();
  const currentTransaction = transactions.find(t => t.id === transactionId);

  if (!transactionId || !currentTransaction) {
    return null;
  }

  // Get formatted times for display
  const timeElapsed = getTimeElapsedFormatted(currentTransaction);
  const timeInStage = getTimeInStageFormatted(currentTransaction);
  const stageName = currentTransaction.currentStage.replace(/_/g, ' ');

  if (compact) {
    return (
      <div className="flex flex-col text-xs text-gray-500">
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Total: {timeElapsed}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Current stage: {timeInStage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Transaction Timeline</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Total time elapsed:</span>
          </div>
          <span className="text-sm font-medium">{timeElapsed}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-600">Time in {stageName}:</span>
          </div>
          <span className="text-sm font-medium">{timeInStage}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-200 mt-2">
          <div className="text-xs text-gray-500">
            Transaction started on {new Date(currentTransaction.createdAt || '').toLocaleDateString()} at {new Date(currentTransaction.createdAt || '').toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTimeMetrics; 