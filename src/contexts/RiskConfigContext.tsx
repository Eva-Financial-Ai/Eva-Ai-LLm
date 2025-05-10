import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our risk configuration
export interface RiskFactorWeight {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface RiskLevel {
  id: string;
  level: string;
  description: string;
  color: string;
}

interface RiskConfigContextType {
  riskFactors: RiskFactorWeight[];
  setRiskFactors: React.Dispatch<React.SetStateAction<RiskFactorWeight[]>>;
  collateralCoverage: number;
  setCollateralCoverage: React.Dispatch<React.SetStateAction<number>>;
  guarantorStrength: number;
  setGuarantorStrength: React.Dispatch<React.SetStateAction<number>>;
  riskAppetite: number;
  setRiskAppetite: React.Dispatch<React.SetStateAction<number>>;
  riskAppetiteLevels: RiskLevel[];
  saveRiskConfiguration: () => Promise<boolean>;
  resetToDefaults: () => void;
}

// Create context with default values
const RiskConfigContext = createContext<RiskConfigContextType | undefined>(undefined);

// Default risk factors
const defaultRiskFactors: RiskFactorWeight[] = [
  {
    id: 'creditWorthiness',
    name: 'Credit Worthiness',
    weight: 30,
    description: 'Credit history and payment performance of the borrower',
  },
  {
    id: 'assetsValue',
    name: 'Assets Value',
    weight: 25,
    description: 'Value and quality of underlying collateral assets',
  },
  {
    id: 'cashFlowStrength',
    name: 'Cash Flow Strength',
    weight: 20,
    description: 'Operational cash flow stability and debt service capability',
  },
  {
    id: 'industryOutlook',
    name: 'Industry Outlook',
    weight: 15,
    description: 'Current and projected market conditions for the industry',
  },
  {
    id: 'managementExperience',
    name: 'Management Experience',
    weight: 10,
    description: 'Experience and track record of the management team',
  },
];

// Default risk levels
const defaultRiskAppetiteLevels: RiskLevel[] = [
  {
    id: 'conservative',
    level: 'Conservative',
    description:
      'Prioritizes capital preservation. Seek deals with strong collateral, excellent credit profiles, and stable industries. Minimize potential for loss at the expense of higher returns.',
    color: 'bg-blue-500',
  },
  {
    id: 'moderate',
    level: 'Moderate',
    description:
      'Balanced approach to risk and return. Accept moderate credit risk with adequate collateral. Will consider growing industries with some volatility if compensated by higher returns.',
    color: 'bg-green-500',
  },
  {
    id: 'balanced',
    level: 'Balanced-Plus',
    description:
      'Slightly higher risk tolerance with emphasis on optimizing portfolio returns. Consider deals with good but not perfect credit and growth-oriented businesses.',
    color: 'bg-yellow-500',
  },
  {
    id: 'aggressive',
    level: 'Aggressive',
    description:
      'Emphasizes growth and higher returns. Willing to accept elevated credit risk, less stable cash flows, and higher concentrations for opportunity of enhanced returns.',
    color: 'bg-orange-500',
  },
  {
    id: 'veryAggressive',
    level: 'Very Aggressive',
    description:
      'Maximizes return potential. Open to early-stage ventures, turnaround situations, and emerging markets. Accepts higher default probability for potential of significant upside.',
    color: 'bg-red-500',
  },
];

// Provider component
export const RiskConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [riskFactors, setRiskFactors] = useState<RiskFactorWeight[]>(defaultRiskFactors);
  const [collateralCoverage, setCollateralCoverage] = useState<number>(100);
  const [guarantorStrength, setGuarantorStrength] = useState<number>(50);
  const [riskAppetite, setRiskAppetite] = useState<number>(50);
  const [riskAppetiteLevels] = useState<RiskLevel[]>(defaultRiskAppetiteLevels);

  // Function to save risk configuration to API/storage
  const saveRiskConfiguration = async (): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to save the configuration
      // For now, we'll just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for persistence between sessions
      localStorage.setItem('eva_risk_factors', JSON.stringify(riskFactors));
      localStorage.setItem('eva_collateral_coverage', JSON.stringify(collateralCoverage));
      localStorage.setItem('eva_guarantor_strength', JSON.stringify(guarantorStrength));
      localStorage.setItem('eva_risk_appetite', JSON.stringify(riskAppetite));

      return true;
    } catch (error) {
      console.error('Failed to save risk configuration:', error);
      return false;
    }
  };

  // Function to reset configuration to defaults
  const resetToDefaults = () => {
    setRiskFactors(defaultRiskFactors);
    setCollateralCoverage(100);
    setGuarantorStrength(50);
    setRiskAppetite(50);

    // Clear stored values
    localStorage.removeItem('eva_risk_factors');
    localStorage.removeItem('eva_collateral_coverage');
    localStorage.removeItem('eva_guarantor_strength');
    localStorage.removeItem('eva_risk_appetite');
  };

  // Load saved configuration from localStorage on mount
  React.useEffect(() => {
    const loadSavedConfig = () => {
      try {
        const savedFactors = localStorage.getItem('eva_risk_factors');
        const savedCoverage = localStorage.getItem('eva_collateral_coverage');
        const savedGuarantorStrength = localStorage.getItem('eva_guarantor_strength');
        const savedAppetite = localStorage.getItem('eva_risk_appetite');

        if (savedFactors) setRiskFactors(JSON.parse(savedFactors));
        if (savedCoverage) setCollateralCoverage(JSON.parse(savedCoverage));
        if (savedGuarantorStrength) setGuarantorStrength(JSON.parse(savedGuarantorStrength));
        if (savedAppetite) setRiskAppetite(JSON.parse(savedAppetite));
      } catch (error) {
        console.error('Error loading saved risk configuration:', error);
        // If there's an error, fall back to defaults
        resetToDefaults();
      }
    };

    loadSavedConfig();
  }, []);

  return (
    <RiskConfigContext.Provider
      value={{
        riskFactors,
        setRiskFactors,
        collateralCoverage,
        setCollateralCoverage,
        guarantorStrength,
        setGuarantorStrength,
        riskAppetite,
        setRiskAppetite,
        riskAppetiteLevels,
        saveRiskConfiguration,
        resetToDefaults,
      }}
    >
      {children}
    </RiskConfigContext.Provider>
  );
};

// Custom hook to use the risk configuration context
export const useRiskConfig = () => {
  const context = useContext(RiskConfigContext);
  if (context === undefined) {
    throw new Error('useRiskConfig must be used within a RiskConfigProvider');
  }
  return context;
};

export default RiskConfigContext;
