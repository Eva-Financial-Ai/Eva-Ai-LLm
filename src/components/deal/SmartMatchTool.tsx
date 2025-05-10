import React, { useState, useEffect, useCallback } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { useNavigate } from 'react-router-dom';
import { SharedLoadingSpinner, SmartMatchSkeleton } from './DealStructuringComponents';

interface MatchingParameter {
  id: string;
  name: string;
  value: string | number;
  weight: number; // 0-100, importance of this parameter in matching
}

interface FinancialProfile {
  maxDownPayment: number;
  preferredTerm: number; // in months
  monthlyBudget: number;
  creditScore: number;
  yearlyRevenue: number;
  cashOnHand: number;
  collateralValue: number;
  debtToIncomeRatio?: number;
  operatingHistory?: number; // in years
  existingLoanBalance?: number;
  industryType?: string;
  businessStructure?: string;
}

export interface DealStructureMatch {
  id: string;
  name: string;
  matchScore: number; // 0-100
  term: number; // in months
  rate: number; // percentage
  downPayment: number; // dollar amount
  downPaymentPercent: number; // percentage of total
  monthlyPayment: number;
  totalInterest: number;
  residualValue: number;
  residualValuePercent: number;
  instrumentType: string;
  financingType: string;
  recommendationReason: string;
  isCustom: boolean;
}

// Add user role type at the top of the component
export type UserRole = 'borrower' | 'broker' | 'lender' | 'vendor';

interface SmartMatchToolProps {
  onMatchesGenerated?: (matches: DealStructureMatch[]) => void;
  initialFinancialProfile?: Partial<FinancialProfile>;
  loanAmount?: number;
  instrumentType?: string;
  onSelectMatch?: (match: DealStructureMatch) => void;
  className?: string;
  userRole?: UserRole; // Add user role
}

const SmartMatchTool: React.FC<SmartMatchToolProps> = ({
  onMatchesGenerated,
  initialFinancialProfile,
  loanAmount = 0,
  instrumentType = '',
  onSelectMatch,
  className = '',
  userRole: initialUserRole = 'borrower', // Default to borrower
}) => {
  const { currentTransaction } = useWorkflow();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDoneMatching, setIsDoneMatching] = useState(false);
  const [matches, setMatches] = useState<DealStructureMatch[]>([]);
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    maxDownPayment: initialFinancialProfile?.maxDownPayment || 0,
    preferredTerm: initialFinancialProfile?.preferredTerm || 60,
    monthlyBudget: initialFinancialProfile?.monthlyBudget || 0,
    creditScore: initialFinancialProfile?.creditScore || 700,
    yearlyRevenue: initialFinancialProfile?.yearlyRevenue || 0,
    cashOnHand: initialFinancialProfile?.cashOnHand || 0,
    collateralValue: initialFinancialProfile?.collateralValue || 0,
  });
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchingParameters, setMatchingParameters] = useState<MatchingParameter[]>([
    { id: 'term', name: 'Term Length', value: 'medium', weight: 80 },
    { id: 'downPayment', name: 'Down Payment', value: 'standard', weight: 85 },
    { id: 'monthlyPayment', name: 'Monthly Payment', value: 'affordable', weight: 90 },
    { id: 'residualValue', name: 'Residual Value', value: 'low', weight: 60 },
    { id: 'rate', name: 'Interest Rate', value: 'competitive', weight: 75 },
  ]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'verify' | 'criteria' | 'suggestions' | 'analytics' | 'speed'
  >('suggestions');
  const [dialogTab, setDialogTab] = useState<'single' | 'list'>('single');
  const [userRole, setUserRole] = useState<UserRole>(initialUserRole);

  // Add sample data for different matches based on the image
  const [mockMatches, setMockMatches] = useState<
    Array<{
      id: string;
      dealName: string;
      riskMapLink: string;
      matchRate: number;
      riskScore: number;
      actions?: string;
    }>
  >([
    {
      id: '1',
      dealName: 'Sage Technologies',
      riskMapLink: 'Hakan Isler',
      matchRate: 90,
      riskScore: 88,
    },
    {
      id: '2',
      dealName: 'Malhi Trucking LLC',
      riskMapLink: 'Hakan Isler',
      matchRate: 87,
      riskScore: 72,
    },
    {
      id: '3',
      dealName: 'Aroma 360 LLC',
      riskMapLink: 'Hakan Isler',
      matchRate: 86,
      riskScore: 32,
    },
    { id: '4', dealName: 'Apple', riskMapLink: 'Hakan Isler', matchRate: 85, riskScore: 55 },
    {
      id: '5',
      dealName: 'Cosmetic Pool Repairs',
      riskMapLink: 'Hakan Isler',
      matchRate: 83,
      riskScore: 55,
    },
    {
      id: '6',
      dealName: 'L & N Costume Service',
      riskMapLink: 'Hakan Isler',
      matchRate: 81,
      riskScore: 88,
    },
    {
      id: '7',
      dealName: 'Sage Technologies',
      riskMapLink: 'Hakan Isler',
      matchRate: 77,
      riskScore: 72,
    },
    {
      id: '8',
      dealName: 'Sage Technologies',
      riskMapLink: 'Hakan Isler',
      matchRate: 74,
      riskScore: 72,
    },
    {
      id: '9',
      dealName: 'Sage Technologies',
      riskMapLink: 'Hakan Isler',
      matchRate: 45,
      riskScore: 72,
    },
    {
      id: '10',
      dealName: 'Sage Technologies',
      riskMapLink: 'Hakan Isler',
      matchRate: 33,
      riskScore: 72,
    },
  ]);

  // Function to handle user role change
  const handleUserRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  // Function to handle view RiskMap
  const handleViewRiskMap = (riskMapLink: string) => {
    console.log('Viewing risk map for', riskMapLink);
    // In a real implementation, this would navigate to the risk map view
  };

  // Function to handle match actions
  const handleMatchAction = (dealId: string, action: 'accept' | 'decline' | 'request-docs') => {
    console.log(`Action ${action} on deal ${dealId}`);
    // In a real implementation, this would trigger appropriate actions
  };

  // Generate match options based on transaction data, financial profile and matching parameters
  const generateMatches = useCallback(() => {
    setIsLoading(true);

    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const transactionAmount = loanAmount || currentTransaction?.amount || 500000;

      // Get base rate based on credit score
      const getBaseRate = () => {
        const { creditScore } = financialProfile;
        if (creditScore >= 800) return 4.25;
        if (creditScore >= 750) return 4.75;
        if (creditScore >= 700) return 5.25;
        if (creditScore >= 650) return 5.75;
        if (creditScore >= 600) return 6.5;
        return 7.5;
      };

      // Adjust based on term preference (parameter weight)
      const termParam = matchingParameters.find(p => p.id === 'term');
      const termPreference = termParam?.value || 'medium';
      const termWeight = termParam?.weight || 50;

      // Generate matching options
      const matchOptions: DealStructureMatch[] = [];
      const baseRate = getBaseRate();

      // Determine maximum down payment based on cash on hand and preferred max
      const maxDownPayment = Math.min(
        financialProfile.maxDownPayment > 0
          ? financialProfile.maxDownPayment
          : transactionAmount * 0.2,
        financialProfile.cashOnHand > 0
          ? financialProfile.cashOnHand * 0.8
          : transactionAmount * 0.2
      );

      // Determine monthly budget - if not specified, estimate based on revenue
      const monthlyBudget =
        financialProfile.monthlyBudget > 0
          ? financialProfile.monthlyBudget
          : financialProfile.yearlyRevenue > 0
            ? (financialProfile.yearlyRevenue * 0.05) / 12
            : transactionAmount * 0.025;

      // Function to calculate payment
      const calculatePayment = (
        principal: number,
        termMonths: number,
        annualRate: number,
        residualPercent = 0
      ) => {
        const monthlyRate = annualRate / 100 / 12;
        const residualAmount = principal * (residualPercent / 100);
        const loanAmount = principal - residualAmount;
        return Math.round(
          (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))
        );
      };

      // Option 1: Optimized for monthly payment affordability
      const affordableOption: DealStructureMatch = {
        id: 'match-affordable',
        name: 'Low Monthly Payment',
        matchScore: 0,
        term:
          financialProfile.preferredTerm > 0
            ? Math.max(financialProfile.preferredTerm, 60)
            : termPreference === 'long'
              ? 84
              : 72,
        rate: baseRate + 0.25,
        downPayment: Math.round(maxDownPayment * 0.8),
        downPaymentPercent: Math.round(((maxDownPayment * 0.8) / transactionAmount) * 100),
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: Math.round(transactionAmount * 0.1),
        residualValuePercent: 10,
        instrumentType: instrumentType || 'equipment_finance',
        financingType: 'lease_to_own',
        recommendationReason:
          'Optimized for lowest monthly payments while keeping down payment reasonable.',
        isCustom: false,
      };

      // Calculate payment for affordable option
      affordableOption.monthlyPayment = calculatePayment(
        transactionAmount - affordableOption.downPayment,
        affordableOption.term,
        affordableOption.rate,
        affordableOption.residualValuePercent
      );

      // Calculate total interest
      affordableOption.totalInterest =
        affordableOption.monthlyPayment * affordableOption.term -
        (transactionAmount - affordableOption.downPayment - affordableOption.residualValue);

      // Option 2: Balanced option
      const balancedOption: DealStructureMatch = {
        id: 'match-balanced',
        name: 'Balanced Solution',
        matchScore: 0,
        term:
          financialProfile.preferredTerm > 0
            ? financialProfile.preferredTerm
            : termPreference === 'medium'
              ? 60
              : 48,
        rate: baseRate,
        downPayment: Math.round(maxDownPayment * 0.6),
        downPaymentPercent: Math.round(((maxDownPayment * 0.6) / transactionAmount) * 100),
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: Math.round(transactionAmount * 0.05),
        residualValuePercent: 5,
        instrumentType: instrumentType || 'equipment_finance',
        financingType: 'term_loan',
        recommendationReason: 'Balanced solution with moderate down payment and competitive rate.',
        isCustom: false,
      };

      // Calculate payment for balanced option
      balancedOption.monthlyPayment = calculatePayment(
        transactionAmount - balancedOption.downPayment,
        balancedOption.term,
        balancedOption.rate,
        balancedOption.residualValuePercent
      );

      // Calculate total interest
      balancedOption.totalInterest =
        balancedOption.monthlyPayment * balancedOption.term -
        (transactionAmount - balancedOption.downPayment - balancedOption.residualValue);

      // Option 3: Minimal down payment
      const minDownOption: DealStructureMatch = {
        id: 'match-min-down',
        name: 'Minimal Down Payment',
        matchScore: 0,
        term:
          financialProfile.preferredTerm > 0
            ? Math.min(financialProfile.preferredTerm, 48)
            : termPreference === 'short'
              ? 36
              : 48,
        rate: baseRate + 0.5,
        downPayment: Math.round(transactionAmount * 0.05),
        downPaymentPercent: 5,
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: 0,
        residualValuePercent: 0,
        instrumentType: instrumentType || 'equipment_finance',
        financingType: 'term_loan',
        recommendationReason:
          'Minimizes initial cash outlay with slightly higher monthly payments.',
        isCustom: false,
      };

      // Calculate payment for minimal down option
      minDownOption.monthlyPayment = calculatePayment(
        transactionAmount - minDownOption.downPayment,
        minDownOption.term,
        minDownOption.rate,
        minDownOption.residualValuePercent
      );

      // Calculate total interest
      minDownOption.totalInterest =
        minDownOption.monthlyPayment * minDownOption.term -
        (transactionAmount - minDownOption.downPayment - minDownOption.residualValue);

      // Option 4: Lowest total cost
      const lowestCostOption: DealStructureMatch = {
        id: 'match-lowest-cost',
        name: 'Lowest Total Cost',
        matchScore: 0,
        term: 36, // Shorter term minimizes interest
        rate: baseRate - 0.25, // Lower rate for shorter term
        downPayment: Math.round(maxDownPayment),
        downPaymentPercent: Math.round((maxDownPayment / transactionAmount) * 100),
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: 0,
        residualValuePercent: 0,
        instrumentType: instrumentType || 'equipment_loan',
        financingType: 'term_loan',
        recommendationReason:
          'Minimizes total financing cost with larger down payment and shorter term.',
        isCustom: false,
      };

      // Calculate payment for lowest cost option
      lowestCostOption.monthlyPayment = calculatePayment(
        transactionAmount - lowestCostOption.downPayment,
        lowestCostOption.term,
        lowestCostOption.rate,
        lowestCostOption.residualValuePercent
      );

      // Calculate total interest
      lowestCostOption.totalInterest =
        lowestCostOption.monthlyPayment * lowestCostOption.term -
        (transactionAmount - lowestCostOption.downPayment - lowestCostOption.residualValue);

      // Add options to matches array
      matchOptions.push(affordableOption, balancedOption, minDownOption, lowestCostOption);

      // Calculate match scores
      matchOptions.forEach(match => {
        // Start with base score of 70
        let score = 70;

        // Check if monthly payment is within budget
        if (financialProfile.monthlyBudget > 0) {
          const paymentRatio = match.monthlyPayment / financialProfile.monthlyBudget;
          if (paymentRatio <= 0.8) score += 10;
          else if (paymentRatio <= 1.0) score += 5;
          else if (paymentRatio <= 1.2) score -= 5;
          else score -= 10;
        }

        // Check if term matches preference
        const termParam = matchingParameters.find(p => p.id === 'term');
        if (termParam) {
          const termWeight = termParam.weight / 100;
          if (termParam.value === 'short' && match.term <= 36) score += 10 * termWeight;
          else if (termParam.value === 'medium' && match.term >= 48 && match.term <= 60)
            score += 10 * termWeight;
          else if (termParam.value === 'long' && match.term >= 72) score += 10 * termWeight;
          else score -= 5 * termWeight;
        }

        // Check if down payment is reasonable
        const downPaymentParam = matchingParameters.find(p => p.id === 'downPayment');
        if (downPaymentParam) {
          const downPaymentWeight = downPaymentParam.weight / 100;
          if (downPaymentParam.value === 'minimal' && match.downPaymentPercent <= 10)
            score += 10 * downPaymentWeight;
          else if (
            downPaymentParam.value === 'standard' &&
            match.downPaymentPercent >= 10 &&
            match.downPaymentPercent <= 20
          )
            score += 10 * downPaymentWeight;
          else if (downPaymentParam.value === 'substantial' && match.downPaymentPercent >= 20)
            score += 10 * downPaymentWeight;
          else score -= 5 * downPaymentWeight;
        }

        // Adjust score based on instrument type match
        if (instrumentType && match.instrumentType === instrumentType) {
          score += 5;
        }

        // Ensure score is within 0-100 range
        match.matchScore = Math.min(100, Math.max(0, score));
      });

      // Sort by match score
      matchOptions.sort((a, b) => b.matchScore - a.matchScore);

      // Set the matches
      setMatches(matchOptions);
      setSelectedMatchId(matchOptions.length > 0 ? matchOptions[0].id : null); // Handle empty matchOptions
      setIsLoading(false);
      setIsDoneMatching(true);

      // Notify parent component
      if (onMatchesGenerated) {
        onMatchesGenerated(matchOptions);
      }
    }, 2000);
  }, [
    currentTransaction,
    financialProfile,
    loanAmount,
    instrumentType,
    matchingParameters,
    onMatchesGenerated,
  ]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Update financial profile
  const handleFinancialProfileChange = (field: keyof FinancialProfile, value: string | number) => {
    setFinancialProfile(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value,
    }));
  };

  // Update matching parameter
  const handleParameterChange = (
    parameterId: string,
    field: 'value' | 'weight',
    newValue: string | number
  ) => {
    setMatchingParameters(prev =>
      prev.map(param => (param.id === parameterId ? { ...param, [field]: newValue } : param))
    );
  };

  // Handle match selection
  const handleMatchSelect = (match: DealStructureMatch) => {
    setSelectedMatchId(match.id);
    if (onSelectMatch) {
      onSelectMatch(match);
    }
  };

  // Navigate to transaction execution page with selected match
  const handleSelectStructure = (match: DealStructureMatch) => {
    // Close the dialog first
    setSelectedMatchId(null);

    // Then navigate to the transaction execution page
    navigate(`/transactions/new/execute`, {
      state: {
        selectedMatch: match,
        amount: loanAmount || currentTransaction?.amount || 0,
        structureType: match.financingType,
        rate: match.rate,
      },
    });
  };

  // Navigate to the custom dashboard
  const handleNavigateToCustomDashboard = () => {
    // Close the dialog first
    setSelectedMatchId(null);

    // Instead of navigating, we'll now trigger a custom modal in the parent
    if (window.dispatchEvent) {
      // Create a custom event that the parent component can listen to
      const event = new CustomEvent('openCustomFinancialProfileModal');
      window.dispatchEvent(event);
    }
  };

  // Navigate to credit application with pre-filled data
  const handleSendCreditApplication = () => {
    // Close the dialog first
    setSelectedMatchId(null);

    navigate('/credit-application', {
      state: {
        prefilledData: {
          requestedAmount: loanAmount || currentTransaction?.amount || 0,
          preferredTerm: financialProfile.preferredTerm,
          creditScore: financialProfile.creditScore,
          businessRevenue: financialProfile.yearlyRevenue,
          debtToIncomeRatio: financialProfile.debtToIncomeRatio,
          operatingHistory: financialProfile.operatingHistory,
          collateralValue: financialProfile.collateralValue,
        },
      },
    });
  };

  // Trigger match generation when component mounts or when key inputs change
  useEffect(() => {
    if (loanAmount > 0) {
      generateMatches();
    }
  }, [loanAmount, generateMatches]);

  // Get the selected match
  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  // Update state to track elapsed time
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout | null>(null);

  // Start the timer when match dialog is opened
  useEffect(() => {
    if (selectedMatchId) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        setElapsedTime(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
      setTimeInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      setElapsedTime(0);
      if (timeInterval) {
        clearInterval(timeInterval);
        setTimeInterval(null);
      }
    }
  }, [selectedMatchId]);

  // Update the renderMatchDialog function to include the new tab navigation
  const renderMatchDialog = () => {
    // Only show if there's a selected match
    if (!selectedMatchId) return null;

    const match = matches.find(m => m.id === selectedMatchId);
    if (!match) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
          {/* Header with top navigation from main component - without icons */}
          <div className="bg-black text-white">
            {/* Match tabs navigation */}
            <div className="flex overflow-x-auto">
              <button
                className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'verify' ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setActiveTab('verify')}
              >
                Match Verify
              </button>
              <button
                className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'criteria' ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setActiveTab('criteria')}
              >
                Match Criteria
              </button>
              <button
                className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'suggestions' ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setActiveTab('suggestions')}
              >
                Match Suggestions
              </button>
              <button
                className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'analytics' ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Match Analytics
              </button>
              <button
                className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'speed' ? 'bg-white text-black' : 'bg-black text-white'}`}
                onClick={() => setActiveTab('speed')}
              >
                Speed Match
              </button>
            </div>
          </div>

          {/* Dialog view tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setDialogTab('single')}
                className={`px-4 py-3 ${dialogTab === 'single' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Single View
              </button>
              <button
                onClick={() => setDialogTab('list')}
                className={`px-4 py-3 ${dialogTab === 'list' ? 'border-b-2 border-primary-500 text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Matches List
              </button>
            </div>
          </div>

          {/* Content based on selected dialog tab */}
          {dialogTab === 'single' ? (
            <div className="p-6">
              {/* Borrower tag and avatar */}
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="text-white bg-red-500 text-xs font-bold px-2 py-1 rounded absolute -top-1 -left-1">
                    BORROWER
                  </div>
                  <div className="w-24 h-24 bg-blue-500 rounded-lg flex items-center justify-center text-white text-4xl font-bold">
                    {match.name.charAt(0)}
                  </div>
                </div>

                <div className="ml-4">
                  <div className="text-xs text-gray-500 mb-1">BEST MATCH</div>
                  <h3 className="text-xl font-semibold text-gray-900">{match.name}</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    Commercial property refinance opportunity
                  </div>

                  {/* Organization details */}
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <div className="font-medium text-gray-500">Industry:</div>
                      <div>Real Estate</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Location:</div>
                      <div>Seattle, WA</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Established:</div>
                      <div>2003</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Amount:</div>
                      <div>${match.downPayment.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Term:</div>
                      <div>{match.term} months</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Credit:</div>
                      <div>750 (Excellent)</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Project Type:</div>
                      <div>Refinance</div>
                    </div>
                  </div>
                </div>

                {/* Match percentage */}
                <div className="ml-auto mr-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100 text-green-600 font-bold text-lg border-4 border-green-400">
                    {match.matchScore}%
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Match Rate</div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Financial Overview</h4>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-sm">Total Loan</div>
                    <div className="font-semibold mt-1">${match.downPayment.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-sm">Monthly Payment</div>
                    <div className="font-semibold mt-1">
                      ${match.monthlyPayment.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-gray-500 text-sm">Total Interest</div>
                    <div className="font-semibold mt-1">
                      ${match.totalInterest.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <div className="text-sm text-gray-500">Time: {elapsedTime}s</div>
                    <div className="text-sm text-gray-500">Source: ?</div>
                    <div className="text-sm text-gray-500">Match Rate: {match.matchScore}%</div>
                  </div>
                  <div className="flex justify-between space-x-4">
                    <button
                      onClick={() => handleMatchResponse('hard-no')}
                      className="flex-1 px-4 py-2 rounded-full text-red-700 bg-red-100 hover:bg-red-200 font-medium text-center"
                    >
                      Hard No
                    </button>
                    <button
                      onClick={() => handleMatchResponse('soft-no')}
                      className="flex-1 px-4 py-2 rounded-full text-orange-700 bg-orange-100 hover:bg-orange-200 font-medium text-center"
                    >
                      Soft No
                    </button>
                    <button
                      onClick={() => handleMatchResponse('soft-match')}
                      className="flex-1 px-4 py-2 rounded-full text-yellow-700 bg-yellow-100 hover:bg-yellow-200 font-medium text-center"
                    >
                      Soft Match
                    </button>
                    <button
                      onClick={() => handleMatchResponse('hard-match')}
                      className="flex-1 px-4 py-2 rounded-full text-green-700 bg-green-100 hover:bg-green-200 font-medium text-center"
                    >
                      Hard Match
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">All Matches</h3>
              <div className="space-y-4">
                {matches.map(match => (
                  <div
                    key={match.id}
                    className={`border rounded-lg p-4 flex items-center justify-between ${selectedMatchId === match.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                    onClick={() => {
                      setSelectedMatchId(match.id);
                      setDialogTab('single');
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        {match.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{match.name}</h4>
                        <p className="text-sm text-gray-500">
                          ${match.downPayment.toLocaleString()} - {match.term} months
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-100 text-green-600 font-bold text-sm border-2 border-green-400">
                        {match.matchScore}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              onClick={() => {
                console.log('Canceling match dialog');
                setSelectedMatchId(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <div className="space-x-3">
              <button
                onClick={() => {
                  console.log('Sending credit application');
                  handleSendCreditApplication();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Credit Application
              </button>
              <button
                onClick={() => {
                  console.log('Selecting structure');
                  handleSelectStructure(match);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Select This Structure
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modify the renderMatchResults function to display the tabular view
  const renderMatchResults = () => {
    if (matches.length === 0) {
      return (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Adjust your financial profile and matching parameters to generate matches.
          </p>
        </div>
      );
    }

    // For demo purposes, use the mockMatches data
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Match Suggestions</h2>
            <p className="mt-1 text-sm text-gray-500">View and manage your matched opportunities</p>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Got to RiskMap Dashboard
            </a>
          </div>
        </div>

        {/* User role tabs - Borrower, Broker, Lender, Vendor */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-3 ${userRole === 'broker' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => handleUserRoleChange('broker')}
          >
            Broker View
          </button>
          <button
            className={`px-4 py-3 ${userRole === 'lender' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => handleUserRoleChange('lender')}
          >
            Lender View
          </button>
          <button
            className={`px-4 py-3 ${userRole === 'borrower' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => handleUserRoleChange('borrower')}
          >
            Borrower View
          </button>
          <button
            className={`px-4 py-3 ${userRole === 'vendor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => handleUserRoleChange('vendor')}
          >
            Smart Match Process Flow
          </button>
        </div>

        {/* Table of matches */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Deal Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider"
                >
                  LINK TO RISKMAP
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider"
                >
                  MATCH RATE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider"
                >
                  RISK SCORE
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-900 uppercase tracking-wider"
                >
                  MATCH ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMatches.map(match => {
                // Determine color based on match rate
                let matchRateColor = 'text-green-500';
                if (match.matchRate < 50) matchRateColor = 'text-red-500';
                else if (match.matchRate < 80) matchRateColor = 'text-yellow-500';

                // Determine color based on risk score
                let riskScoreColor = 'text-green-500';
                if (match.riskScore < 50) riskScoreColor = 'text-red-500';
                else if (match.riskScore < 70) riskScoreColor = 'text-yellow-500';

                return (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                      {match.dealName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => handleViewRiskMap(match.riskMapLink)}
                      >
                        {match.riskMapLink}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`${matchRateColor} font-medium`}>{match.matchRate}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className={`${riskScoreColor} font-medium`}>{match.riskScore}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="p-1 rounded hover:bg-green-100 text-green-600"
                          onClick={() => handleMatchAction(match.id, 'accept')}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                          onClick={() => handleMatchAction(match.id, 'decline')}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1 rounded hover:bg-blue-100 text-blue-600"
                          onClick={() => handleMatchAction(match.id, 'request-docs')}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Add function to handle match responses
  const handleMatchResponse = (response: 'hard-no' | 'soft-no' | 'soft-match' | 'hard-match') => {
    // In a real implementation, this would send the response to the backend
    console.log(`Match response: ${response} for match ID: ${selectedMatchId}`);

    // If it's a match, select the structure
    if (response === 'hard-match' && selectedMatchId) {
      const match = matches.find(m => m.id === selectedMatchId);
      if (match) {
        // Close the dialog
        setSelectedMatchId(null);

        // Then process the match if needed
        if (onSelectMatch) {
          onSelectMatch(match);
        }

        // Auto-navigate to structure editor
        handleSelectStructure(match);
      }
    } else {
      // For other responses, just close the dialog
      setSelectedMatchId(null);
    }
  };

  const renderTabNavigation = () => {
    return (
      <div className="bg-black text-white mb-4">
        {/* Second row with tab navigation - removed icons */}
        <div className="flex overflow-x-auto">
          <button
            className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'verify' ? 'bg-white text-black' : 'bg-black text-white'}`}
            onClick={() => setActiveTab('verify')}
          >
            Match Verify
          </button>
          <button
            className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'criteria' ? 'bg-white text-black' : 'bg-black text-white'}`}
            onClick={() => setActiveTab('criteria')}
          >
            Match Criteria
          </button>
          <button
            className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'suggestions' ? 'bg-white text-black' : 'bg-black text-white'}`}
            onClick={() => setActiveTab('suggestions')}
          >
            Match Suggestions
          </button>
          <button
            className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'analytics' ? 'bg-white text-black' : 'bg-black text-white'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Match Analytics
          </button>
          <button
            className={`whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-medium ${activeTab === 'speed' ? 'bg-white text-black' : 'bg-black text-white'}`}
            onClick={() => setActiveTab('speed')}
          >
            Speed Match
          </button>
        </div>
      </div>
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'verify':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Match Verification</h3>
            <p className="text-gray-600 mb-4">
              Verify potential matches based on compliance and eligibility criteria.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Compliance Check</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                      ✓
                    </span>
                    KYC Verification Complete
                  </li>
                  <li className="flex items-center">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                      ✓
                    </span>
                    AML Screening Passed
                  </li>
                  <li className="flex items-center">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                      ✓
                    </span>
                    Business Entity Verified
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Eligibility Check</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                      ✓
                    </span>
                    Credit Score: Excellent (750+)
                  </li>
                  <li className="flex items-center">
                    <span className="h-5 w-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-2">
                      !
                    </span>
                    Business Age: 2 years (Minimum: 2 years)
                  </li>
                  <li className="flex items-center">
                    <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2">
                      ✓
                    </span>
                    Annual Revenue: $1.2M
                  </li>
                </ul>
              </div>
            </div>

            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Run Full Verification
            </button>
          </div>
        );
      case 'criteria':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Match Criteria Settings</h3>
            <p className="text-gray-600 mb-4">
              Configure the parameters used for matching borrowers with lenders.
            </p>

            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Financial Parameters</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Amount Range
                    </label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option>$100K - $500K</option>
                      <option>$500K - $1M</option>
                      <option>$1M - $5M</option>
                      <option>$5M+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Term
                    </label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option>Short Term (1-3 years)</option>
                      <option>Medium Term (3-7 years)</option>
                      <option>Long Term (7+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interest Rate Sensitivity
                    </label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option>High (Lowest rate priority)</option>
                      <option>Medium</option>
                      <option>Low (Flexible on rate)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Credit Score
                    </label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option>Excellent (750+)</option>
                      <option>Good (700-749)</option>
                      <option>Fair (650-699)</option>
                      <option>Poor (below 650)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Industry & Purpose</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry Types
                    </label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option>All Industries</option>
                      <option>Real Estate</option>
                      <option>Manufacturing</option>
                      <option>Technology</option>
                      <option>Healthcare</option>
                      <option>Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loan Purpose
                    </label>
                    <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option>All Purposes</option>
                      <option>Expansion</option>
                      <option>Equipment Purchase</option>
                      <option>Working Capital</option>
                      <option>Refinance</option>
                      <option>Acquisition</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Save Criteria
              </button>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Match Analytics</h3>
            <p className="text-gray-600 mb-4">
              View performance metrics and analytics for your matches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Matches</div>
                <div className="text-2xl font-bold">127</div>
                <div className="text-xs text-green-600 mt-1">↑ 12% from last month</div>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Acceptance Rate</div>
                <div className="text-2xl font-bold">68%</div>
                <div className="text-xs text-green-600 mt-1">↑ 5% from last month</div>
              </div>
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Avg. Match Quality</div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-xs text-red-600 mt-1">↓ 2% from last month</div>
              </div>
            </div>

            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Match Conversion Funnel</h4>
              <div className="h-20 bg-gray-100 w-full relative mb-4">
                <div className="absolute inset-0 flex">
                  <div className="bg-green-500 h-full" style={{ width: '75%' }}></div>
                  <div className="bg-yellow-500 h-full" style={{ width: '15%' }}></div>
                  <div className="bg-red-500 h-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <div>
                  <div className="font-medium">Matched (75%)</div>
                  <div className="text-gray-600">95 matches</div>
                </div>
                <div>
                  <div className="font-medium">In Progress (15%)</div>
                  <div className="text-gray-600">19 matches</div>
                </div>
                <div>
                  <div className="font-medium">Rejected (10%)</div>
                  <div className="text-gray-600">13 matches</div>
                </div>
              </div>
            </div>

            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Download Full Report
            </button>
          </div>
        );
      case 'speed':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Speed Match</h3>
            <p className="text-gray-600 mb-4">Quick matching for time-sensitive opportunities.</p>

            <div className="border rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Express Match Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Needed By</label>
                  <input
                    type="date"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                    <option>High - 24 hours</option>
                    <option>Medium - 3 days</option>
                    <option>Low - 7 days</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Speed Match Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Speed matches prioritize quick connections over optimal fit. You may receive
                    fewer options, but will get results within your timeframe.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex-1">
                Start Speed Match (3 min)
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex-1">
                Schedule For Later
              </button>
            </div>
          </div>
        );
      case 'suggestions':
      default:
        // The default view is the match results
        return isLoading ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <SharedLoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-gray-500">Finding optimal financing solutions...</p>
          </div>
        ) : isDoneMatching ? (
          renderMatchResults()
        ) : (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Profile</h3>

              {/* Existing profile inputs */}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={generateMatches}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Generate Matches
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {renderTabNavigation()}

      {renderActiveTabContent()}

      {/* Render the match dialog overlay */}
      {renderMatchDialog()}
    </div>
  );
};

export default SmartMatchTool;
