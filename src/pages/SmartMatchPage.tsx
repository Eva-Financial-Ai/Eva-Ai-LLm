import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartMatchTool, { DealStructureMatch } from '../components/deal/SmartMatchTool';
import CustomFinancialProfileModal, { FinancialProfile } from '../components/deal/CustomFinancialProfileModal';

const SmartMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    maxDownPayment: 0,
    preferredTerm: 60,
    monthlyBudget: 0,
    creditScore: 700,
    yearlyRevenue: 0,
    cashOnHand: 0,
    collateralValue: 0,
    debtToIncomeRatio: 0,
    operatingHistory: 0,
    existingLoanBalance: 0
  });
  const [loanAmount, setLoanAmount] = useState(500000);
  
  // Add event listener for the custom event
  useEffect(() => {
    const handleOpenModal = () => {
      setShowCustomModal(true);
    };
    
    window.addEventListener('openCustomFinancialProfileModal', handleOpenModal);
    
    return () => {
      window.removeEventListener('openCustomFinancialProfileModal', handleOpenModal);
    };
  }, []);
  
  const handleMatchesGenerated = (matches: DealStructureMatch[]) => {
    console.log('Matches generated:', matches);
  };
  
  const handleSelectMatch = (match: DealStructureMatch) => {
    // Navigate to transaction execution with the selected match
    navigate(`/transactions/new/execute`, {
      state: { 
        selectedMatch: match,
        amount: loanAmount,
        structureType: match.financingType,
        rate: match.rate
      }
    });
  };
  
  const handleCustomParametersClick = () => {
    setShowCustomModal(true);
  };
  
  const handleCustomModalClose = () => {
    setShowCustomModal(false);
  };
  
  const handleCustomProfileSubmit = (profile: FinancialProfile) => {
    setFinancialProfile(profile);
    setShowCustomModal(false);
    // You could trigger a refresh of matches here if needed
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Smart Matching</h1>
        <button
          onClick={() => navigate('/deal-structuring')}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back to Deal Structuring
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Find Your Perfect Match</h2>
          <p className="mt-1 text-sm text-gray-500">
            Our AI will recommend optimal financing options based on your financial profile and preferences.
          </p>
        </div>
        
        <SmartMatchTool 
          loanAmount={loanAmount} 
          initialFinancialProfile={financialProfile}
          onMatchesGenerated={handleMatchesGenerated}
          onSelectMatch={handleSelectMatch}
          className="w-full"
        />
      </div>
      
      {/* Custom Financial Profile Modal */}
      <CustomFinancialProfileModal
        isOpen={showCustomModal}
        onClose={handleCustomModalClose}
        onSubmit={handleCustomProfileSubmit}
        initialProfile={financialProfile}
        loanAmount={loanAmount}
      />
    </div>
  );
};

export default SmartMatchPage; 