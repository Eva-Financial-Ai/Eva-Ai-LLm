import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useRiskConfig } from '../../contexts/RiskConfigContext';
import PaywallModal from './PaywallModal';
import { DEFAULT_RANGES, RiskRange } from './RiskRangesConfigEditor';

// Define the possible loan types
export type LoanType = 'general' | 'equipment' | 'realestate';

// Map between loan type and risk config type for context integration
export const mapLoanTypeToConfigType = (loanType: LoanType) => {
  switch (loanType) {
    case 'equipment':
      return 'equipment_vehicles';
    case 'realestate':
      return 'real_estate';
    default:
      return 'general';
  }
};

// Map loan type to report type for PaywallModal
export const mapLoanTypeToReportType = (loanType: LoanType): 'unsecured' | 'equipment' | 'realestate' => {
  switch (loanType) {
    case 'equipment':
      return 'equipment';
    case 'realestate':
      return 'realestate';
    default:
      return 'unsecured';
  }
};

// Define the risk category types
export type RiskScoringCategory = 
  | 'creditworthiness' 
  | 'financial' 
  | 'cashflow' 
  | 'legal' 
  | 'equipment' 
  | 'property' 
  | 'guarantors';

// Define the possible scoring outcomes
export type ScoringOutcome = 'good' | 'average' | 'negative';

// Define the individual criteria items
export interface ScoringCriterion {
  id: string;
  name: string;
  category: RiskScoringCategory;
  value: string | number;
  outcome: ScoringOutcome;
  points: number;
  dataSource: string;
}

// Define the complete company scoring profile
export interface CompanyProfile {
  id: string;
  name: string;
  loanType: LoanType;
  totalScore: number;
  maxPossibleScore: number;
  criteria: ScoringCriterion[];
  summary?: string;
  recommendation?: string;
}

// Mock company data with different profiles
const MOCK_COMPANIES: CompanyProfile[] = [
  {
    id: 'comp-1',
    name: 'Acme Manufacturing Inc.',
    loanType: 'equipment',
    totalScore: 78,
    maxPossibleScore: 100,
    criteria: [
      // Creditworthiness of the Borrower (CWB)
      {
        id: 'cwb-1',
        name: 'Credit Score',
        category: 'creditworthiness',
        value: 760,
        outcome: 'good',
        points: 2,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-2',
        name: 'Payment History',
        category: 'creditworthiness',
        value: '0 missed payments',
        outcome: 'good',
        points: 2,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-3',
        name: 'Public Records',
        category: 'creditworthiness',
        value: '0 issues',
        outcome: 'good',
        points: 2,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-4',
        name: 'Age of Credit History',
        category: 'creditworthiness',
        value: '12 years',
        outcome: 'good',
        points: 2,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-5',
        name: 'Recent Inquiries',
        category: 'creditworthiness',
        value: '1 inquiry',
        outcome: 'good',
        points: 2,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      
      // Financial Statements and Ratios (FSR)
      {
        id: 'fsr-1',
        name: 'Debt-to-Equity Ratio',
        category: 'financial',
        value: 1.2,
        outcome: 'good',
        points: 2,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      {
        id: 'fsr-2',
        name: 'Current Ratio',
        category: 'financial',
        value: 2.5,
        outcome: 'good',
        points: 2,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      {
        id: 'fsr-3',
        name: 'Quick Ratio',
        category: 'financial',
        value: 1.2,
        outcome: 'average',
        points: 0,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      
      // Business Cash Flow (BCF)
      {
        id: 'bcf-1',
        name: 'Operating Cash Flow',
        category: 'cashflow',
        value: '7% annual increase',
        outcome: 'good',
        points: 2,
        dataSource: 'OCR of Borrower Uploaded Statement of Cash Flows'
      },
      {
        id: 'bcf-2',
        name: 'Cash Conversion Cycle',
        category: 'cashflow',
        value: '25 days',
        outcome: 'good',
        points: 2,
        dataSource: 'OCR of Borrower Uploaded Statement of Cash Flows'
      },
      
      // Legal and Regulatory Compliance (LRC)
      {
        id: 'lrc-1',
        name: 'Legal History',
        category: 'legal',
        value: 'Clean',
        outcome: 'good',
        points: 2,
        dataSource: 'PitchPoint CRS API or PubRec'
      },
      {
        id: 'lrc-2',
        name: 'Regulatory Audits',
        category: 'legal',
        value: 'Clean (compliant)',
        outcome: 'good',
        points: 2,
        dataSource: 'PitchPoint CRS API or PubRec'
      },
      
      // Equipment Value and Type (EVT)
      {
        id: 'evt-1',
        name: 'Equipment Type Demand',
        category: 'equipment',
        value: 'High demand / Essential',
        outcome: 'good',
        points: 2,
        dataSource: 'EquipmentWatch API or User Input'
      },
      {
        id: 'evt-2',
        name: 'Equipment Life',
        category: 'equipment',
        value: 'New (0-1 yr)',
        outcome: 'good',
        points: 2,
        dataSource: 'EquipmentWatch API or User Input'
      },
      {
        id: 'evt-3',
        name: 'Resale Value',
        category: 'equipment',
        value: 'High (above average)',
        outcome: 'good',
        points: 2,
        dataSource: 'EquipmentWatch API or User Input'
      }
    ],
    summary: 'Acme Manufacturing Inc. demonstrates strong creditworthiness with an excellent payment history and solid financial ratios. The company has robust cash flow and is legally compliant. The equipment being financed has high market demand and good resale value.',
    recommendation: 'Recommended for approval with favorable terms based on strong credit profile and equipment value.'
  },
  {
    id: 'comp-2',
    name: 'Smithson Properties LLC',
    loanType: 'realestate',
    totalScore: 65,
    maxPossibleScore: 100,
    criteria: [
      // Creditworthiness of the Borrower (CWB)
      {
        id: 'cwb-1',
        name: 'Credit Score',
        category: 'creditworthiness',
        value: 680,
        outcome: 'average',
        points: 0,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-2',
        name: 'Payment History',
        category: 'creditworthiness',
        value: '1 missed payment',
        outcome: 'average',
        points: 0,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-3',
        name: 'Public Records',
        category: 'creditworthiness',
        value: '1 minor issue',
        outcome: 'average',
        points: 0,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      
      // Financial Statements and Ratios (FSR)
      {
        id: 'fsr-1',
        name: 'Debt-to-Equity Ratio',
        category: 'financial',
        value: 2.1,
        outcome: 'average',
        points: 0,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      {
        id: 'fsr-2',
        name: 'Current Ratio',
        category: 'financial',
        value: 1.7,
        outcome: 'average',
        points: 0,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      
      // Property/Financial Health (PFH)
      {
        id: 'pfh-1',
        name: 'LTV Ratio',
        category: 'property',
        value: '68%',
        outcome: 'average',
        points: 0,
        dataSource: 'Pubrec Property Data API'
      },
      {
        id: 'pfh-2',
        name: 'Debt Service Coverage',
        category: 'property',
        value: '1.25x',
        outcome: 'average',
        points: 0,
        dataSource: 'OCR of Borrower Uploaded Inc Stat + Model Calculation'
      },
      {
        id: 'pfh-3',
        name: 'Occupancy Rate',
        category: 'property',
        value: '92%',
        outcome: 'good',
        points: 2,
        dataSource: 'Borrower Input or Property Data API'
      },
      {
        id: 'pfh-4',
        name: 'Property Class',
        category: 'property',
        value: 'Class B',
        outcome: 'average',
        points: 0,
        dataSource: 'Borrower Input from loan app + Property Data API'
      }
    ],
    summary: 'Smithson Properties LLC shows moderate creditworthiness with an acceptable payment history and average financial ratios. The property being financed has a reasonable LTV ratio and good occupancy rate, which supports loan serviceability.',
    recommendation: 'Approval recommended with standard terms based on average risk profile. Consider requiring additional collateral or guarantor to strengthen application.'
  },
  {
    id: 'comp-3',
    name: 'TechStart Innovation Inc.',
    loanType: 'general',
    totalScore: 45,
    maxPossibleScore: 100,
    criteria: [
      // Creditworthiness of the Borrower (CWB)
      {
        id: 'cwb-1',
        name: 'Credit Score',
        category: 'creditworthiness',
        value: 620,
        outcome: 'negative',
        points: -1,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      {
        id: 'cwb-2',
        name: 'Payment History',
        category: 'creditworthiness',
        value: '4 missed payments',
        outcome: 'negative',
        points: -1,
        dataSource: 'Equifax One Score, PayNet API, Duns & Bradstreet'
      },
      
      // Financial Statements and Ratios (FSR)
      {
        id: 'fsr-1',
        name: 'Debt-to-Equity Ratio',
        category: 'financial',
        value: 3.1,
        outcome: 'negative',
        points: -1,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      {
        id: 'fsr-2',
        name: 'Current Ratio',
        category: 'financial',
        value: 0.8,
        outcome: 'negative',
        points: -1,
        dataSource: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
      },
      
      // Business Cash Flow (BCF)
      {
        id: 'bcf-1',
        name: 'Operating Cash Flow',
        category: 'cashflow',
        value: '-2% annual decrease',
        outcome: 'negative',
        points: -1,
        dataSource: 'OCR of Borrower Uploaded Statement of Cash Flows'
      },
      
      // Guarantors & Secondary Collateral (GSC)
      {
        id: 'gsc-1',
        name: 'Guarantors',
        category: 'guarantors',
        value: 2,
        outcome: 'good',
        points: 2,
        dataSource: 'Borrower Credit Application user input'
      },
      {
        id: 'gsc-2',
        name: 'Pledged Secondary Collaterals',
        category: 'guarantors',
        value: 2,
        outcome: 'good',
        points: 2,
        dataSource: 'Borrower Credit Application user input'
      }
    ],
    summary: 'TechStart Innovation Inc. has below average creditworthiness with multiple missed payments and weak financial ratios. The company shows negative cash flow trends which presents increased risk. The application is strengthened by multiple guarantors and secondary collateral.',
    recommendation: 'Consider for conditional approval with increased rates/fees to account for higher risk profile. Require robust guarantor support and additional collateral verification.'
  }
];

// Blackjack-style scoring function
export const calculateScore = (criteria: ScoringCriterion[]): number => {
  let totalScore = 0;
  criteria.forEach(item => {
    if (item.outcome === 'good') {
      totalScore += 2; // +2 points for good outcomes
    } else if (item.outcome === 'average') {
      totalScore += 0; // 0 points for average outcomes
    } else if (item.outcome === 'negative') {
      totalScore -= 1; // -1 point for negative outcomes
    }
  });
  
  // Normalize score to be out of 100
  const maxPossiblePoints = criteria.length * 2; // Maximum possible if all criteria are "good"
  return Math.round((totalScore / maxPossiblePoints) * 100);
};

// Score calculation inputs
interface ScoreInputs {
  creditScore: number;
  paymentHistory: string;
  timeInBusiness: number;
  debtServiceCoverageRatio: number;
  loanToValueRatio?: number;
  equipmentAge?: number; 
  equipmentType?: string;
  propertyType?: string;
  propertyLocation?: string;
}

// Import necessary components
import { DEFAULT_RANGES as DefaultRanges } from './RiskRangesConfigEditor';

// Define the score categories
const SCORE_CATEGORIES = {
  creditworthiness: {
    weight: { general: 40, equipment: 40, realestate: 40 },
    label: 'Creditworthiness Of The Borrower (CWB)'
  },
  financial: {
    weight: { general: 20, equipment: 15, realestate: 15 },
    label: 'Financial Statements And Ratios (FSR)'
  },
  cashflow: {
    weight: { general: 20, equipment: 15, realestate: 15 },
    label: 'Business Cash Flow (BCF)'
  },
  legal: {
    weight: { general: 20, equipment: 10, realestate: 10 },
    label: 'Legal And Regulatory Compliance (LRC)'
  },
  equipment: {
    weight: { general: 0, equipment: 20, realestate: 0 },
    label: 'Equipment Value and Type (EVT)'
  },
  property: {
    weight: { general: 0, equipment: 0, realestate: 20 },
    label: 'Real Estate (EVT)'
  }
};

// Sample credit score thresholds
const CREDIT_SCORE_THRESHOLDS = {
  positive: 800,
  average: 700,
  negative: 600
};

// Updated Props for the component
interface RiskScoreDisplayProps {
  companyId: string;
  loanType: LoanType;
  initialInputs?: Partial<ScoreInputs>;
  customRanges?: {[key: string]: RiskRange[]};
  customWeights?: {[key: string]: number};
}

// Extract the score gauge into a memoized component
const ScoreGauge = memo(({ 
  score, 
  maxScore = 100, 
  getProgressBarColor, 
  getScoreColor 
}: {
  score: number;
  maxScore?: number;
  getProgressBarColor: (value: number) => string;
  getScoreColor: (value: number) => string;
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getProgressBarColor(score)}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${339.292 * (score / maxScore)}, 339.292`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
      </div>
    </div>
  );
});

// Extract the category score component
const CategoryScoreCard = memo(({ 
  category, 
  score, 
  maxScore, 
  weight, 
  getScoreColor 
}: {
  category: string;
  score: number;
  maxScore: number;
  weight: number;
  getScoreColor: (value: number) => string;
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700">{category}</h4>
        <span className="text-xs text-gray-500">{weight}% Weight</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-full mr-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                score >= 80 ? 'bg-green-500' : score >= 65 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(score / maxScore) * 100}%` }}
            ></div>
          </div>
        </div>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
    </div>
  );
});

// Extract score parameter input component
const ScoreParameterInput = memo(({
  label,
  value,
  min,
  max,
  step,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
});

const RiskScoreDisplay: React.FC<RiskScoreDisplayProps> = ({ 
  companyId,
  loanType = 'general',
  initialInputs,
  customRanges,
  customWeights
}) => {
  // Use the properly typed risk config context
  const riskConfig = useRiskConfig();
  
  // Set up state for score calculation inputs
  const [inputs, setInputs] = useState<ScoreInputs>({
    creditScore: initialInputs?.creditScore || 850,
    paymentHistory: initialInputs?.paymentHistory || '1-2 Missed payment',
    timeInBusiness: initialInputs?.timeInBusiness || 5,
    debtServiceCoverageRatio: initialInputs?.debtServiceCoverageRatio || 1.5,
    loanToValueRatio: initialInputs?.loanToValueRatio || 75,
    equipmentAge: initialInputs?.equipmentAge || 2,
    equipmentType: initialInputs?.equipmentType || 'Machinery',
    propertyType: initialInputs?.propertyType || 'Commercial',
    propertyLocation: initialInputs?.propertyLocation || 'Urban'
  });

  // State for calculated scores
  const [scores, setScores] = useState({
    creditworthiness: 0,
    financial: 0,
    cashflow: 0,
    legal: 0,
    equipment: 0,
    property: 0,
    total: 0
  });
  
  // State for paywall modal
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  
  // Get weights based on loan type and custom weights
  const getWeights = () => {
    const defaultWeights = {
      creditworthiness: SCORE_CATEGORIES.creditworthiness.weight[loanType],
      financial: SCORE_CATEGORIES.financial.weight[loanType],
      cashflow: SCORE_CATEGORIES.cashflow.weight[loanType],
      legal: SCORE_CATEGORIES.legal.weight[loanType],
      equipment: SCORE_CATEGORIES.equipment.weight[loanType],
      property: SCORE_CATEGORIES.property.weight[loanType]
    };
    
    // If custom weights are provided, merge them with default weights
    if (customWeights) {
      return { ...defaultWeights, ...customWeights };
    }
    
    return defaultWeights;
  };

  // Calculate scores when inputs or loan type changes
  useEffect(() => {
    if (hasAccess) {
      calculateScores();
    }
  }, [inputs, loanType, customRanges, customWeights, hasAccess]);
  
  // Check access when component mounts
  useEffect(() => {
    // Check if the user has credits in localStorage
    const availableCredits = localStorage.getItem('availableCredits');
    if (availableCredits && parseInt(availableCredits) > 0) {
      setHasAccess(true);
    } else {
      // Check if we should show the paywall
      const hasSeenPaywall = localStorage.getItem('hasSeenPaywall');
      if (!hasSeenPaywall) {
        setTimeout(() => {
          setShowPaywallModal(true);
          localStorage.setItem('hasSeenPaywall', 'true');
        }, 1000);
      }
    }
  }, []);

  // Calculate scores based on inputs and loan type
  const calculateScores = () => {
    // Calculate individual category scores
    const creditworthinessScore = calculateCreditworthinessScore();
    const financialScore = calculateFinancialScore();
    const cashflowScore = calculateCashflowScore();
    const legalScore = calculateLegalScore();
    const equipmentScore = loanType === 'equipment' ? calculateEquipmentScore() : 0;
    const propertyScore = loanType === 'realestate' ? calculatePropertyScore() : 0;

    // Get weights based on loan type and custom weights
    const weights = getWeights();

    // Apply weights
    const weightedCreditScore = creditworthinessScore * (weights.creditworthiness / 100);
    const weightedFinancialScore = financialScore * (weights.financial / 100);
    const weightedCashflowScore = cashflowScore * (weights.cashflow / 100);
    const weightedLegalScore = legalScore * (weights.legal / 100);
    const weightedEquipmentScore = equipmentScore * (weights.equipment / 100);
    const weightedPropertyScore = propertyScore * (weights.property / 100);

    // Calculate total score
    const totalScore = 
      weightedCreditScore + 
      weightedFinancialScore + 
      weightedCashflowScore + 
      weightedLegalScore + 
      weightedEquipmentScore + 
      weightedPropertyScore;

    // Update scores state
    setScores({
      creditworthiness: creditworthinessScore,
      financial: financialScore,
      cashflow: cashflowScore,
      legal: legalScore,
      equipment: equipmentScore,
      property: propertyScore,
      total: Math.round(totalScore)
    });
  };
  
  // Evaluate a value against custom ranges
  const evaluateRange = (
    value: number, 
    category: string, 
    metricId: string, 
    defaultOutcome: 'good' | 'average' | 'negative' = 'average'
  ): {outcome: 'good' | 'average' | 'negative', points: number} => {
    // Get the custom ranges for this category if available
    const categoryRanges = customRanges?.[category];
    const metricRange = categoryRanges?.find(range => range.id === metricId);
    
    // If no custom range is found, use defaults
    if (!metricRange) {
      const defaultCategoryRanges = DefaultRanges[category]?.metrics;
      const defaultMetricRange = defaultCategoryRanges?.find(range => range.id === metricId);
      
      if (!defaultMetricRange) {
        return { outcome: defaultOutcome, points: defaultOutcome === 'good' ? 2 : defaultOutcome === 'average' ? 1 : 0 };
      }
      
      // Evaluate against default range
      if (value >= defaultMetricRange.good.min && value <= defaultMetricRange.good.max) {
        return { outcome: 'good', points: defaultMetricRange.points.good };
      } else if (value >= defaultMetricRange.average.min && value <= defaultMetricRange.average.max) {
        return { outcome: 'average', points: defaultMetricRange.points.average };
      } else if (value >= defaultMetricRange.negative.min && value <= defaultMetricRange.negative.max) {
        return { outcome: 'negative', points: defaultMetricRange.points.negative };
      }
      
      return { outcome: defaultOutcome, points: defaultOutcome === 'good' ? 2 : defaultOutcome === 'average' ? 1 : 0 };
    }
    
    // Evaluate against custom range
    if (value >= metricRange.good.min && value <= metricRange.good.max) {
      return { outcome: 'good', points: metricRange.points.good };
    } else if (value >= metricRange.average.min && value <= metricRange.average.max) {
      return { outcome: 'average', points: metricRange.points.average };
    } else if (value >= metricRange.negative.min && value <= metricRange.negative.max) {
      return { outcome: 'negative', points: metricRange.points.negative };
    }
    
    return { outcome: defaultOutcome, points: metricRange.points[defaultOutcome] };
  };

  // Calculate creditworthiness score using custom ranges
  const calculateCreditworthinessScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;
    
    // Score based on credit score
    const creditScoreResult = evaluateRange(inputs.creditScore, 'creditworthiness', 'credit-score');
    totalPoints += creditScoreResult.points;
    maxPoints += 2; // Maximum possible points
    
    // Score based on payment history (string to number conversion)
    let paymentMissed = 0;
    if (inputs.paymentHistory === '1-2 Missed payment') {
      paymentMissed = 1;
    } else if (inputs.paymentHistory === '3+ Missed payment') {
      paymentMissed = 3;
    }
    
    const paymentHistoryResult = evaluateRange(paymentMissed, 'creditworthiness', 'payment-history');
    totalPoints += paymentHistoryResult.points;
    maxPoints += 2;
    
    // Score based on time in business
    const businessAgeResult = evaluateRange(inputs.timeInBusiness, 'creditworthiness', 'credit-history-age');
    totalPoints += businessAgeResult.points;
    maxPoints += 2;
    
    // Normalize to 0-100 scale
    return Math.round((totalPoints / maxPoints) * 100);
  };

  // Calculate financial score
  const calculateFinancialScore = () => {
    // For demonstration purposes
    // In a real app this would use evaluateRange for each financial metric
    return 85;
  };

  // Calculate cashflow score
  const calculateCashflowScore = () => {
    let totalPoints = 0;
    let maxPoints = 0;
    
    // Score based on debt service coverage ratio
    const dscResult = evaluateRange(inputs.debtServiceCoverageRatio, 'cashflow', 'cash-flow-coverage');
    totalPoints += dscResult.points;
    maxPoints += 2;
    
    // Normalize to 0-100 scale
    return Math.round((totalPoints / maxPoints) * 100);
  };

  // Calculate legal score
  const calculateLegalScore = () => {
    // For demonstration purposes
    return 90;
  };

  // Calculate equipment score
  const calculateEquipmentScore = () => {
    if (inputs.equipmentAge === undefined) return 0;
    
    let totalPoints = 0;
    let maxPoints = 0;
    
    // Score based on equipment age
    const equipmentAgeResult = evaluateRange(inputs.equipmentAge, 'equipment', 'equipment-age');
    totalPoints += equipmentAgeResult.points;
    maxPoints += 2;
    
    // Score based on equipment type (convert string to numeric value)
    let equipmentTypeValue = 2; // Default to moderate demand
    if (inputs.equipmentType === 'Machinery' || inputs.equipmentType === 'Technology') {
      equipmentTypeValue = 3; // High demand
    } else if (inputs.equipmentType === 'Specialized' || inputs.equipmentType === 'Niche') {
      equipmentTypeValue = 1; // Low demand
    }
    
    const equipmentTypeResult = evaluateRange(equipmentTypeValue, 'equipment', 'equipment-type');
    totalPoints += equipmentTypeResult.points;
    maxPoints += 2;
    
    // Normalize to 0-100 scale
    return Math.round((totalPoints / maxPoints) * 100);
  };

  // Calculate property score
  const calculatePropertyScore = () => {
    if (inputs.loanToValueRatio === undefined) return 0;
    
    let totalPoints = 0;
    let maxPoints = 0;
    
    // Score based on LTV ratio
    const ltvResult = evaluateRange(inputs.loanToValueRatio, 'property', 'ltv-ratio');
    totalPoints += ltvResult.points;
    maxPoints += 2;
    
    // Score based on debt service coverage ratio for real estate
    const dscResult = evaluateRange(inputs.debtServiceCoverageRatio, 'property', 'debt-service-coverage');
    totalPoints += dscResult.points;
    maxPoints += 2;
    
    // Normalize to 0-100 scale
    return Math.round((totalPoints / maxPoints) * 100);
  };

  // Handle paywall success
  const handlePaywallSuccess = () => {
    setHasAccess(true);
    setShowPaywallModal(false);
    calculateScores();
  };

  // Function to get proper report type for paywall display
  const getPaywallReportType = (): 'unsecured' | 'equipment' | 'realestate' => {
    return mapLoanTypeToReportType(loanType);
  };

  // Memoize functions that don't change often
  const getScoreColor = useCallback((value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 65) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const getProgressBarColor = useCallback((value: number) => {
    if (value >= 80) return '#10B981'; // green-500
    if (value >= 65) return '#F59E0B'; // yellow-500
    return '#EF4444'; // red-500
  }, []);

  const getTitle = useCallback(() => {
    switch (loanType) {
      case 'equipment':
        return 'Equipment Financing Credit Assessment';
      case 'realestate':
        return 'Commercial Real Estate Credit Assessment';
      default:
        return 'Credit Worthiness Assessment';
    }
  }, [loanType]);

  // Use memoized value for weights
  const weights = useMemo(() => getWeights(), [loanType, customWeights]);

  // Instead of using the memoized result from calculateScores, let's create our own scores object
  // that we know has the right structure
  const calculatedScores = useMemo(() => {
    // Call the original calculation function if it returns a proper object
    const scores = calculateScores();
    
    // If scores is not the expected object (e.g., it returns void), create a fallback object with default values
    if (typeof scores !== 'object' || scores === null) {
      return {
        creditworthiness: 0,
        financial: 0,
        cashflow: 0,
        legal: 0,
        equipment: 0,
        property: 0,
        total: 0
      };
    }
    
    return scores;
  }, [inputs, weights, customRanges]);

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{getTitle()}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPaywallModal(true)}
            className="px-3 py-1 text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md font-medium"
          >
            Run Full Analysis
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-5">
        {hasAccess ? (
          <>
            {/* Overall score */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex items-center">
              <div className="mr-4">
                <div className={`text-4xl font-bold ${getScoreColor(calculatedScores.total)}`}>
                  {calculatedScores.total}
                </div>
                <div className="text-sm text-gray-500">Overall Score</div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getProgressBarColor(calculatedScores.total)}`} 
                    style={{ width: `${calculatedScores.total}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            
            {/* Use the memoized ScoreGauge component */}
            <ScoreGauge 
              score={calculatedScores.total} 
              getProgressBarColor={getProgressBarColor} 
              getScoreColor={getScoreColor}
            />
            
            {/* Category scores */}
            <div className="mt-6 px-6 pb-6">
              {Object.entries(SCORE_CATEGORIES).map(([key, info]) => {
                const categoryKey = key as keyof typeof calculatedScores;
                const categoryScore = calculatedScores[categoryKey] || 0;
                
                // Skip categories with zero weight
                if (weights[categoryKey] === 0) return null;
                
                return (
                  <CategoryScoreCard
                    key={key}
                    category={info.label}
                    score={categoryScore}
                    maxScore={100}
                    weight={weights[categoryKey]}
                    getScoreColor={getScoreColor}
                  />
                );
              })}
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                onClick={() => {
                  // This would download a PDF report in a real app
                  alert('Downloading detailed risk assessment report...');
                }}
              >
                Download Full Report
              </button>
              <button
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                onClick={() => setShowPaywallModal(true)}
              >
                Add More Credits
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Risk Assessment Locked</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              Purchase credits to access detailed risk assessment reports and scoring for your business.
            </p>
            <button
              onClick={() => setShowPaywallModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Purchase Credits
            </button>
          </div>
        )}
      </div>
      
      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onSuccess={handlePaywallSuccess}
        reportType={getPaywallReportType()}
      />
      
      {/* Use ScoreParameterInput for interactive inputs */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adjust Risk Parameters</h3>
        
        <ScoreParameterInput
          label="Credit Score"
          value={inputs.creditScore}
          min={300}
          max={850}
          step={10}
          onChange={(val) => setInputs({...inputs, creditScore: val})}
        />
        
        <ScoreParameterInput
          label="Time in Business (Years)"
          value={inputs.timeInBusiness}
          min={0}
          max={20}
          step={1}
          onChange={(val) => setInputs({...inputs, timeInBusiness: val})}
        />
        
        <ScoreParameterInput
          label="Debt Service Coverage Ratio"
          value={inputs.debtServiceCoverageRatio}
          min={0}
          max={3}
          step={0.1}
          onChange={(val) => setInputs({...inputs, debtServiceCoverageRatio: val})}
        />
        
        {loanType === 'realestate' && (
          <ScoreParameterInput
            label="Loan-to-Value Ratio (%)"
            value={inputs.loanToValueRatio || 75}
            min={50}
            max={100}
            step={1}
            onChange={(val) => setInputs({...inputs, loanToValueRatio: val})}
          />
        )}
        
        {loanType === 'equipment' && (
          <ScoreParameterInput
            label="Equipment Age (Years)"
            value={inputs.equipmentAge || 0}
            min={0}
            max={15}
            step={1}
            onChange={(val) => setInputs({...inputs, equipmentAge: val})}
          />
        )}
      </div>
    </div>
  );
};

export default RiskScoreDisplay; 