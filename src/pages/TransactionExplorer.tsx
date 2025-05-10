import React from 'react';
import TopNavigation from '../components/layout/TopNavigation';

const TransactionExplorer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction Explorer</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">
          This is a placeholder for the Transaction Explorer page. It will display a list of
          transactions and tools to explore them.
        </p>
      </div>
    </div>
  );
};

export default TransactionExplorer;
