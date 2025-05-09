import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../contexts/WorkflowContext';

const RiskAssessmentLink: React.FC = () => {
  const navigate = useNavigate();
  const { navigateToRiskAssessment } = useWorkflow();

  const handleRiskAssessmentClick = () => {
    console.log('Navigating to risk assessment');

    // Use the context function to find/set appropriate transaction
    const transaction = navigateToRiskAssessment();

    if (transaction) {
      // Navigate to risk assessment page
      navigate('/risk-assessment');
    } else {
      // No suitable transaction found
      alert(
        'No suitable transaction found for risk assessment. Please create a new transaction first.'
      );
    }
  };

  return (
    <button
      onClick={handleRiskAssessmentClick}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium"
    >
      Risk Assessment
    </button>
  );
};

export default RiskAssessmentLink;
