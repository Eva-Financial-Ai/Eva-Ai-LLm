import React from 'react';
import { useParams } from 'react-router-dom';
import { useWorkflow } from '../contexts/WorkflowContext';
import RiskDashboard from '../components/risk/RiskDashboard';
import PageLayout from '../components/layout/PageLayout';

const RiskAssessmentPage: React.FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { currentTransaction } = useWorkflow();
  
  // Use the URL parameter if available, otherwise use the current transaction
  const effectiveTransactionId = transactionId || currentTransaction?.id;

  return (
    <PageLayout title="Risk Assessment">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
          <p className="text-gray-600">
            View comprehensive risk analysis for the current transaction.
          </p>
        </div>
        
        <RiskDashboard transactionId={effectiveTransactionId} />
      </div>
    </PageLayout>
  );
};

export default RiskAssessmentPage; 