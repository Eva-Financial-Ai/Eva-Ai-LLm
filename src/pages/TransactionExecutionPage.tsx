import React from 'react';
import TransactionExecution from '../components/document/TransactionExecution';
import { useParams } from 'react-router-dom';

const TransactionExecutionPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <TransactionExecution transactionId={transactionId} />
    </div>
  );
};

export default TransactionExecutionPage;
