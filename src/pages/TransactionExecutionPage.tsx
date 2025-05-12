import React, { useState } from 'react';
import TransactionExecution from '../components/document/TransactionExecution';
import { useParams } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';

const TransactionExecutionPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <div className="pl-20 sm:pl-72 w-full">
      <div className="container mx-auto px-2 py-6 max-w-full">
        <TopNavigation 
          title="Transaction Execution" 
          currentTransactionId={transactionId || 'TX-123'} 
        />
        
        <div className="bg-white shadow rounded-lg p-4 mb-4 w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Transaction Execution</h1>
          <p className="text-gray-600 mb-4">Generate, sign, and securely store transaction documents on blockchain.</p>
          
          <TransactionExecution transactionId={transactionId} />
        </div>
      </div>
    </div>
  );
};

export default TransactionExecutionPage;
