import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../contexts/WorkflowContext';
import { FinancialProfile } from '../components/deal/CustomFinancialProfileModal';
import { DealStructureMatch, UserRole } from '../components/deal/SmartMatchTool';
import SmartMatchTool from '../components/deal/SmartMatchTool';
import CustomFinancialProfileModal from '../components/deal/CustomFinancialProfileModal';
import SmartMatchHeader from '../components/deal/SmartMatchHeader';

const SmartMatchPage: React.FC = () => {
  const { currentTransaction } = useWorkflow();
  const navigate = useNavigate();

  // Get loan amount from the current transaction or default to 100000
  const loanAmount = currentTransaction?.amount || 100000;

  // Default financial profile
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    maxDownPayment: loanAmount * 0.2, // 20% down payment
    preferredTerm: 60, // 5 years (60 months)
    monthlyBudget: loanAmount / 48, // Rough estimate for monthly payment
    creditScore: 720,
    yearlyRevenue: loanAmount * 3, // 3x the loan amount
    cashOnHand: loanAmount * 0.3, // 30% of the loan amount
    collateralValue: loanAmount * 1.25, // 125% of the loan amount
  });

  // State for custom profile modal
  const [showCustomModal, setShowCustomModal] = useState(false);

  // State for user view
  const [currentView, setCurrentView] = useState<UserRole>('borrower');

  // State for matches
  const [matches, setMatches] = useState<DealStructureMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<DealStructureMatch | null>(null);

  // Handle matches being generated
  const handleMatchesGenerated = (generatedMatches: DealStructureMatch[]) => {
    setMatches(generatedMatches);
    console.log('Matches generated:', generatedMatches);
  };

  // Handle match selection
  const handleSelectMatch = (match: DealStructureMatch) => {
    setSelectedMatch(match);
    console.log('Selected match:', match);
  };

  // Handle custom profile modal
  const handleCustomModalOpen = () => {
    setShowCustomModal(true);
  };

  const handleCustomModalClose = () => {
    setShowCustomModal(false);
  };

  const handleCustomProfileSubmit = (profile: FinancialProfile) => {
    setFinancialProfile(profile);
    setShowCustomModal(false);
    console.log('Updated financial profile:', profile);
  };

  // Handle view change
  const handleViewChange = (view: string) => {
    setCurrentView(view as UserRole);
    console.log('View changed to:', view);
  };

  return (
    <div className="container mx-auto py-0">
      <SmartMatchHeader onViewChange={handleViewChange} initialView={currentView} />

      <div className="px-4 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Find Your Perfect Match</h2>
            <p className="mt-1 text-sm text-gray-500">
              Our AI will recommend optimal financing options based on your financial profile and
              preferences.
            </p>
          </div>

          <SmartMatchTool
            loanAmount={loanAmount}
            initialFinancialProfile={financialProfile}
            onMatchesGenerated={handleMatchesGenerated}
            onSelectMatch={handleSelectMatch}
            className="w-full"
            userRole={currentView}
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
    </div>
  );
};

export default SmartMatchPage;
