import React, { useState, useEffect } from 'react';

// Define the possible loan types
export type LoanType = 'general' | 'equipment' | 'realestate';

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

// Component to display a company's risk score
interface RiskScoreProps {
  companyId: string;
  loanType: LoanType;
  onScoreGenerated?: (score: number) => void;
}

const RiskScoreDisplay: React.FC<RiskScoreProps> = ({ companyId, loanType, onScoreGenerated }) => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Simulate API call to get company scoring data
  useEffect(() => {
    setIsLoading(true);
    
    // Mock API delay
    const timer = setTimeout(() => {
      // Find company by ID or use a filtered list based on loan type
      let foundCompany = MOCK_COMPANIES.find(c => c.id === companyId);
      
      // If no specific company ID, find one matching the loan type
      if (!foundCompany && loanType) {
        foundCompany = MOCK_COMPANIES.find(c => c.loanType === loanType);
      }
      
      // If still no match, use the first company as default
      if (!foundCompany) {
        foundCompany = MOCK_COMPANIES[0];
      }
      
      setCompany(foundCompany);
      setIsLoading(false);
      
      // Notify parent component of the score
      if (onScoreGenerated && foundCompany) {
        onScoreGenerated(foundCompany.totalScore);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [companyId, loanType, onScoreGenerated]);

  // Generate styling based on score
  const getScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 70) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="ml-3 text-gray-600">Generating risk score...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (!company) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="text-center text-red-600">
          <p>Unable to generate risk score. Company data not found.</p>
        </div>
      </div>
    );
  }

  // Group criteria by category
  const criteriaByCategory: Record<RiskScoringCategory, ScoringCriterion[]> = {
    creditworthiness: company.criteria.filter(c => c.category === 'creditworthiness'),
    financial: company.criteria.filter(c => c.category === 'financial'),
    cashflow: company.criteria.filter(c => c.category === 'cashflow'),
    legal: company.criteria.filter(c => c.category === 'legal'),
    equipment: company.criteria.filter(c => c.category === 'equipment'),
    property: company.criteria.filter(c => c.category === 'property'),
    guarantors: company.criteria.filter(c => c.category === 'guarantors'),
  };

  // Render component
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Score header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{company.loanType} Loan Application</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <div className={`text-3xl font-bold ${getScoreColor(company.totalScore)}`}>
              {company.totalScore}
            </div>
            <div className="text-sm text-gray-500 ml-2">/ {company.maxPossibleScore}</div>
            
            <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(company.totalScore)} ${getScoreColor(company.totalScore)}`}>
              {company.totalScore >= 70 ? 'Low Risk' : 
               company.totalScore >= 50 ? 'Medium Risk' : 'High Risk'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Score summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Summary</h4>
        <p className="text-gray-700">{company.summary}</p>
        
        {company.recommendation && (
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Recommendation</h4>
            <p className="text-gray-700">{company.recommendation}</p>
          </div>
        )}
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 text-primary-600 hover:text-primary-800 font-medium flex items-center"
        >
          {showDetails ? 'Hide Details' : 'Show Detailed Scoring'}
          <svg className={`ml-1 h-5 w-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Detailed scoring */}
      {showDetails && (
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Detailed Scoring Factors</h4>
          
          {/* Creditworthiness section */}
          {criteriaByCategory.creditworthiness.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">1. Creditworthiness of the Borrower (CWB)</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.creditworthiness.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Financial Statements section */}
          {criteriaByCategory.financial.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">2. Financial Statements and Ratios (FSR)</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.financial.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Business Cash Flow section */}
          {criteriaByCategory.cashflow.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">3. Business Cash Flow (BCF)</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.cashflow.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Legal and Regulatory Compliance section */}
          {criteriaByCategory.legal.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">4. Legal and Regulatory Compliance (LRC)</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.legal.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Equipment Value and Type section - only for equipment loans */}
          {criteriaByCategory.equipment.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">5. Equipment Value and Type (EVT)</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.equipment.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Property/Financial Health section - only for real estate loans */}
          {criteriaByCategory.property.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">5. Property/Financial Health (PFH)</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.property.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Guarantors & Secondary Collateral section */}
          {criteriaByCategory.guarantors.length > 0 && (
            <div className="mb-6">
              <h5 className="text-md font-medium text-gray-900 mb-2">
                {criteriaByCategory.equipment.length > 0 || criteriaByCategory.property.length > 0 
                  ? '6. Guarantors & Secondary Collateral (GSC)' 
                  : '5. Guarantors & Secondary Collateral (GSC)'}
              </h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Point</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criteriaByCategory.guarantors.map(criterion => (
                      <tr key={criterion.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{criterion.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.value}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${criterion.outcome === 'good' ? 'bg-green-100 text-green-800' : 
                              criterion.outcome === 'average' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {criterion.outcome.charAt(0).toUpperCase() + criterion.outcome.slice(1)} ({criterion.points})
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{criterion.dataSource}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Scoring key */}
          <div className="mt-8 border-t border-gray-200 pt-4">
            <h5 className="text-md font-medium text-gray-900 mb-2">Scoring Key</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-green-100 mr-2"></span>
                <span className="text-sm text-gray-700">Good: +2 points</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-yellow-100 mr-2"></span>
                <span className="text-sm text-gray-700">Average: 0 points</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-red-100 mr-2"></span>
                <span className="text-sm text-gray-700">Negative: -1 point</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskScoreDisplay; 