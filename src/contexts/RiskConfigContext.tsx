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

// Define risk configuration type
export type RiskConfigType = 'general' | 'real_estate' | 'equipment_vehicles';

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
  configType: RiskConfigType;
  setConfigType: React.Dispatch<React.SetStateAction<RiskConfigType>>;
  saveRiskConfiguration: () => Promise<boolean>;
  resetToDefaults: () => void;
  loadConfigForType: (type: RiskConfigType) => void;
}

// Create context with default values
const RiskConfigContext = createContext<RiskConfigContextType | undefined>(undefined);

// Default risk factors for general configuration
const defaultGeneralRiskFactors: RiskFactorWeight[] = [
  {
    id: 'creditWorthiness',
    name: 'Credit Worthiness',
    weight: 30,
    description: 'Credit history and payment performance of the borrower',
  },
  {
    id: 'financialStatements',
    name: 'Financial Statements And Ratios',
    weight: 20,
    description: 'Analysis of financial statements and key financial ratios',
  },
  {
    id: 'businessCashFlow',
    name: 'Business Cash Flow',
    weight: 20,
    description: 'Operational cash flow stability and debt service capability',
  },
  {
    id: 'legalRegulatory',
    name: 'Legal And Regulatory Compliance',
    weight: 20,
    description: 'Legal standing and regulatory compliance status',
  },
  {
    id: 'collateralCoverage',
    name: 'Collateral Coverage',
    weight: 10,
    description: 'Value and quality of underlying collateral assets',
  },
];

// Risk factors for real estate configuration
const realEstateRiskFactors: RiskFactorWeight[] = [
  {
    id: 'creditWorthiness',
    name: 'Creditworthiness Of The Borrower',
    weight: 40,
    description: 'Credit history and payment performance of the borrower',
  },
  {
    id: 'financialStatements',
    name: 'Financial Statements And Ratios',
    weight: 10,
    description: 'Analysis of financial statements and key financial ratios',
  },
  {
    id: 'businessCashFlow',
    name: 'Business Cash Flow',
    weight: 10,
    description: 'Operational cash flow stability and debt service capability',
  },
  {
    id: 'legalRegulatory',
    name: 'Legal And Regulatory Compliance',
    weight: 20,
    description: 'Legal standing and regulatory compliance status',
  },
  {
    id: 'realEstateValue',
    name: 'Real Estate Value',
    weight: 20,
    description: 'Valuation of the real estate property',
  },
];

// Risk factors for equipment & vehicles configuration
const equipmentVehiclesRiskFactors: RiskFactorWeight[] = [
  {
    id: 'creditWorthiness',
    name: 'Creditworthiness Of The Borrower',
    weight: 40,
    description: 'Credit history and payment performance of the borrower',
  },
  {
    id: 'financialStatements',
    name: 'Financial Statements And Ratios',
    weight: 20,
    description: 'Analysis of financial statements and key financial ratios',
  },
  {
    id: 'businessCashFlow',
    name: 'Business Cash Flow',
    weight: 20,
    description: 'Operational cash flow stability and debt service capability',
  },
  {
    id: 'legalRegulatory',
    name: 'Legal And Regulatory Compliance',
    weight: 20,
    description: 'Legal standing and regulatory compliance status',
  },
  {
    id: 'equipmentValue',
    name: 'Equipment Value and Type',
    weight: 20,
    description: 'Valuation and classification of equipment or vehicles',
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
  const [riskFactors, setRiskFactors] = useState<RiskFactorWeight[]>(defaultGeneralRiskFactors);
  const [collateralCoverage, setCollateralCoverage] = useState<number>(100);
  const [guarantorStrength, setGuarantorStrength] = useState<number>(50);
  const [riskAppetite, setRiskAppetite] = useState<number>(50);
  const [riskAppetiteLevels] = useState<RiskLevel[]>(defaultRiskAppetiteLevels);
  const [configType, setConfigType] = useState<RiskConfigType>('general');

  // Function to load configuration based on type
  const loadConfigForType = (type: RiskConfigType) => {
    setConfigType(type);

    switch (type) {
      case 'general':
        setRiskFactors(defaultGeneralRiskFactors);
        break;
      case 'real_estate':
        setRiskFactors(realEstateRiskFactors);
        break;
      case 'equipment_vehicles':
        setRiskFactors(equipmentVehiclesRiskFactors);
        break;
      default:
        setRiskFactors(defaultGeneralRiskFactors);
    }

    // Try to load saved configuration for this type from localStorage
    try {
      const savedFactors = localStorage.getItem(`eva_risk_factors_${type}`);
      const savedCoverage = localStorage.getItem(`eva_collateral_coverage_${type}`);
      const savedGuarantorStrength = localStorage.getItem(`eva_guarantor_strength_${type}`);
      const savedAppetite = localStorage.getItem(`eva_risk_appetite_${type}`);

      if (savedFactors) setRiskFactors(JSON.parse(savedFactors));
      if (savedCoverage) setCollateralCoverage(JSON.parse(savedCoverage));
      if (savedGuarantorStrength) setGuarantorStrength(JSON.parse(savedGuarantorStrength));
      if (savedAppetite) setRiskAppetite(JSON.parse(savedAppetite));
    } catch (error) {
      console.error(`Error loading saved risk configuration for ${type}:`, error);
    }
  };

  // Function to save risk configuration to API/storage
  const saveRiskConfiguration = async (): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to save the configuration
      // For now, we'll just simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for persistence between sessions with config type
      localStorage.setItem(`eva_risk_factors_${configType}`, JSON.stringify(riskFactors));
      localStorage.setItem(
        `eva_collateral_coverage_${configType}`,
        JSON.stringify(collateralCoverage)
      );
      localStorage.setItem(
        `eva_guarantor_strength_${configType}`,
        JSON.stringify(guarantorStrength)
      );
      localStorage.setItem(`eva_risk_appetite_${configType}`, JSON.stringify(riskAppetite));

      // Also save the current config type
      localStorage.setItem('eva_current_config_type', configType);

      return true;
    } catch (error) {
      console.error('Failed to save risk configuration:', error);
      return false;
    }
  };

  // Function to reset configuration to defaults
  const resetToDefaults = () => {
    switch (configType) {
      case 'general':
        setRiskFactors(defaultGeneralRiskFactors);
        break;
      case 'real_estate':
        setRiskFactors(realEstateRiskFactors);
        break;
      case 'equipment_vehicles':
        setRiskFactors(equipmentVehiclesRiskFactors);
        break;
      default:
        setRiskFactors(defaultGeneralRiskFactors);
    }

    setCollateralCoverage(100);
    setGuarantorStrength(50);
    setRiskAppetite(50);

    // Clear stored values for this config type
    localStorage.removeItem(`eva_risk_factors_${configType}`);
    localStorage.removeItem(`eva_collateral_coverage_${configType}`);
    localStorage.removeItem(`eva_guarantor_strength_${configType}`);
    localStorage.removeItem(`eva_risk_appetite_${configType}`);
  };

  // Load saved configuration from localStorage on mount
  React.useEffect(() => {
    try {
      // Try to load the saved config type
      const savedConfigType = localStorage.getItem('eva_current_config_type') as RiskConfigType;

      if (
        savedConfigType &&
        ['general', 'real_estate', 'equipment_vehicles'].includes(savedConfigType)
      ) {
        loadConfigForType(savedConfigType);
      } else {
        // Default to general if no saved type
        loadConfigForType('general');
      }
    } catch (error) {
      console.error('Error loading saved risk configuration:', error);
      // If there's an error, fall back to defaults
      loadConfigForType('general');
    }
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
        configType,
        setConfigType,
        saveRiskConfiguration,
        resetToDefaults,
        loadConfigForType,
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
