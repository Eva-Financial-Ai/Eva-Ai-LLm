import React from 'react';
import { useLocation } from 'react-router-dom';
import RiskAdvisorChat from './RiskAdvisorChat';
import useTransactionStore from '../../hooks/useTransactionStore';

interface RiskAdvisorWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'mitigation' | 'benchmarking' | 'documentation' | 'general';
}

/**
 * Wrapper component for the Risk Advisor Chat that ensures proper context handling
 * This fixes the redirection issue by providing a dedicated component for Risk Advisor
 * that is separate from DocumentVerification
 */
const RiskAdvisorWrapper: React.FC<RiskAdvisorWrapperProps> = ({
  isOpen,
  onClose,
  mode = 'general',
}) => {
  const location = useLocation();
  const { currentTransaction } = useTransactionStore();

  // Only check for context if the component is explicitly opened (isOpen === true)
  // This prevents auto-opening when navigating to Risk pages
  const getInitialPrompt = () => {
    if (!isOpen) return undefined;
    
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const context = params.get('context');

      if (context === 'compliance') {
        return 'What are the regulatory compliance risks for this transaction?';
      } else if (context === 'financials') {
        return 'Analyze the financial statements for risk factors.';
      }
    }

    return undefined;
  };

  // Don't render anything if not explicitly opened
  if (!isOpen) return null;

  return (
    <RiskAdvisorChat
      isOpen={isOpen}
      onClose={onClose}
      mode={mode}
      initialPrompt={getInitialPrompt()}
    />
  );
};

export default RiskAdvisorWrapper;
