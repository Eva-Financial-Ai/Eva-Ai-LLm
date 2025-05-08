import React, { useState, useEffect, useCallback } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

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

interface SmartMatchToolProps {
  onMatchesGenerated?: (matches: DealStructureMatch[]) => void;
  initialFinancialProfile?: Partial<FinancialProfile>;
  loanAmount?: number;
  instrumentType?: string;
  onSelectMatch?: (match: DealStructureMatch) => void;
  className?: string;
}

const SmartMatchTool: React.FC<SmartMatchToolProps> = ({
  onMatchesGenerated,
  initialFinancialProfile,
  loanAmount = 0,
  instrumentType = '',
  onSelectMatch,
  className = ''
}) => {
  const { currentTransaction } = useWorkflow();
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
    collateralValue: initialFinancialProfile?.collateralValue || 0
  });
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchingParameters, setMatchingParameters] = useState<MatchingParameter[]>([
    { id: 'term', name: 'Term Length', value: 'medium', weight: 80 },
    { id: 'downPayment', name: 'Down Payment', value: 'standard', weight: 85 },
    { id: 'monthlyPayment', name: 'Monthly Payment', value: 'affordable', weight: 90 },
    { id: 'residualValue', name: 'Residual Value', value: 'low', weight: 60 },
    { id: 'rate', name: 'Interest Rate', value: 'competitive', weight: 75 }
  ]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Generate match options based on transaction data, financial profile and matching parameters
  const generateMatches = useCallback(() => {
    setIsLoading(true);
    
    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const transactionAmount = loanAmount || 
        (currentTransaction?.amount || 500000);
      
      // Get base rate based on credit score
      const getBaseRate = () => {
        const { creditScore } = financialProfile;
        if (creditScore >= 800) return 4.25;
        if (creditScore >= 750) return 4.75;
        if (creditScore >= 700) return 5.25;
        if (creditScore >= 650) return 5.75;
        if (creditScore >= 600) return 6.50;
        return 7.50;
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
        financialProfile.maxDownPayment > 0 ? financialProfile.maxDownPayment : transactionAmount * 0.2,
        financialProfile.cashOnHand > 0 ? financialProfile.cashOnHand * 0.8 : transactionAmount * 0.2
      );
      
      // Determine monthly budget - if not specified, estimate based on revenue
      const monthlyBudget = financialProfile.monthlyBudget > 0 ? 
        financialProfile.monthlyBudget : 
        (financialProfile.yearlyRevenue > 0 ? financialProfile.yearlyRevenue * 0.05 / 12 : transactionAmount * 0.025);
      
      // Function to calculate payment
      const calculatePayment = (principal: number, termMonths: number, annualRate: number, residualPercent = 0) => {
        const monthlyRate = annualRate / 100 / 12;
        const residualAmount = principal * (residualPercent / 100);
        const loanAmount = principal - residualAmount;
        return Math.round((loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths)));
      };
      
      // Option 1: Optimized for monthly payment affordability
      const affordableOption: DealStructureMatch = {
        id: 'match-affordable',
        name: 'Low Monthly Payment',
        matchScore: 0,
        term: financialProfile.preferredTerm > 0 ? 
          Math.max(financialProfile.preferredTerm, 60) : 
          (termPreference === 'long' ? 84 : 72),
        rate: baseRate + 0.25,
        downPayment: Math.round(maxDownPayment * 0.8),
        downPaymentPercent: Math.round((maxDownPayment * 0.8) / transactionAmount * 100),
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: Math.round(transactionAmount * 0.1),
        residualValuePercent: 10,
        instrumentType: instrumentType || 'equipment_finance',
        financingType: 'lease_to_own',
        recommendationReason: 'Optimized for lowest monthly payments while keeping down payment reasonable.',
        isCustom: false
      };
      
      // Calculate payment for affordable option
      affordableOption.monthlyPayment = calculatePayment(
        transactionAmount - affordableOption.downPayment,
        affordableOption.term,
        affordableOption.rate,
        affordableOption.residualValuePercent
      );
      
      // Calculate total interest
      affordableOption.totalInterest = (affordableOption.monthlyPayment * affordableOption.term) - 
        (transactionAmount - affordableOption.downPayment - affordableOption.residualValue);
      
      // Option 2: Balanced option
      const balancedOption: DealStructureMatch = {
        id: 'match-balanced',
        name: 'Balanced Solution',
        matchScore: 0,
        term: financialProfile.preferredTerm > 0 ? 
          financialProfile.preferredTerm : 
          (termPreference === 'medium' ? 60 : 48),
        rate: baseRate,
        downPayment: Math.round(maxDownPayment * 0.6),
        downPaymentPercent: Math.round((maxDownPayment * 0.6) / transactionAmount * 100),
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: Math.round(transactionAmount * 0.05),
        residualValuePercent: 5,
        instrumentType: instrumentType || 'equipment_finance',
        financingType: 'term_loan',
        recommendationReason: 'Balanced solution with moderate down payment and competitive rate.',
        isCustom: false
      };
      
      // Calculate payment for balanced option
      balancedOption.monthlyPayment = calculatePayment(
        transactionAmount - balancedOption.downPayment,
        balancedOption.term,
        balancedOption.rate,
        balancedOption.residualValuePercent
      );
      
      // Calculate total interest
      balancedOption.totalInterest = (balancedOption.monthlyPayment * balancedOption.term) - 
        (transactionAmount - balancedOption.downPayment - balancedOption.residualValue);
      
      // Option 3: Minimal down payment
      const minDownOption: DealStructureMatch = {
        id: 'match-min-down',
        name: 'Minimal Down Payment',
        matchScore: 0,
        term: financialProfile.preferredTerm > 0 ? 
          Math.min(financialProfile.preferredTerm, 48) : 
          (termPreference === 'short' ? 36 : 48),
        rate: baseRate + 0.5,
        downPayment: Math.round(transactionAmount * 0.05),
        downPaymentPercent: 5,
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: 0,
        residualValuePercent: 0,
        instrumentType: instrumentType || 'equipment_finance',
        financingType: 'term_loan',
        recommendationReason: 'Minimizes initial cash outlay with slightly higher monthly payments.',
        isCustom: false
      };
      
      // Calculate payment for minimal down option
      minDownOption.monthlyPayment = calculatePayment(
        transactionAmount - minDownOption.downPayment,
        minDownOption.term,
        minDownOption.rate,
        minDownOption.residualValuePercent
      );
      
      // Calculate total interest
      minDownOption.totalInterest = (minDownOption.monthlyPayment * minDownOption.term) - 
        (transactionAmount - minDownOption.downPayment - minDownOption.residualValue);
      
      // Option 4: Lowest total cost
      const lowestCostOption: DealStructureMatch = {
        id: 'match-lowest-cost',
        name: 'Lowest Total Cost',
        matchScore: 0,
        term: 36, // Shorter term minimizes interest
        rate: baseRate - 0.25, // Lower rate for shorter term
        downPayment: Math.round(maxDownPayment),
        downPaymentPercent: Math.round(maxDownPayment / transactionAmount * 100),
        monthlyPayment: 0, // To be calculated
        totalInterest: 0, // To be calculated
        residualValue: 0,
        residualValuePercent: 0,
        instrumentType: instrumentType || 'equipment_loan',
        financingType: 'term_loan',
        recommendationReason: 'Minimizes total financing cost with larger down payment and shorter term.',
        isCustom: false
      };
      
      // Calculate payment for lowest cost option
      lowestCostOption.monthlyPayment = calculatePayment(
        transactionAmount - lowestCostOption.downPayment,
        lowestCostOption.term,
        lowestCostOption.rate,
        lowestCostOption.residualValuePercent
      );
      
      // Calculate total interest
      lowestCostOption.totalInterest = (lowestCostOption.monthlyPayment * lowestCostOption.term) - 
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
          else if (termParam.value === 'medium' && match.term >= 48 && match.term <= 60) score += 10 * termWeight;
          else if (termParam.value === 'long' && match.term >= 72) score += 10 * termWeight;
          else score -= 5 * termWeight;
        }
        
        // Check if down payment is reasonable
        const downPaymentParam = matchingParameters.find(p => p.id === 'downPayment');
        if (downPaymentParam) {
          const downPaymentWeight = downPaymentParam.weight / 100;
          if (downPaymentParam.value === 'minimal' && match.downPaymentPercent <= 10) score += 10 * downPaymentWeight;
          else if (downPaymentParam.value === 'standard' && match.downPaymentPercent >= 10 && match.downPaymentPercent <= 20) score += 10 * downPaymentWeight;
          else if (downPaymentParam.value === 'substantial' && match.downPaymentPercent >= 20) score += 10 * downPaymentWeight;
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
      setSelectedMatchId(matchOptions[0].id);
      setIsLoading(false);
      setIsDoneMatching(true);
      
      // Notify parent component
      if (onMatchesGenerated) {
        onMatchesGenerated(matchOptions);
      }
    }, 2000);
  }, [currentTransaction, financialProfile, loanAmount, instrumentType, matchingParameters, onMatchesGenerated]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Update financial profile
  const handleFinancialProfileChange = (field: keyof FinancialProfile, value: number) => {
    setFinancialProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update matching parameter
  const handleParameterChange = (parameterId: string, field: 'value' | 'weight', newValue: string | number) => {
    setMatchingParameters(prev => 
      prev.map(param => 
        param.id === parameterId 
          ? { ...param, [field]: newValue } 
          : param
      )
    );
  };
  
  // Handle match selection
  const handleMatchSelect = (match: DealStructureMatch) => {
    setSelectedMatchId(match.id);
    if (onSelectMatch) {
      onSelectMatch(match);
    }
  };
  
  // Trigger match generation when component mounts or when key inputs change
  useEffect(() => {
    if (loanAmount > 0) {
      generateMatches();
    }
  }, [loanAmount, generateMatches]);
  
  // Get the selected match
  const selectedMatch = matches.find(m => m.id === selectedMatchId);
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">EVA AI Smart Match</h3>
          <div className="text-sm text-gray-500">
            {isDoneMatching ? `${matches.length} matches found` : 'Finding optimal matches...'}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Intelligent matching of deal structures based on borrower needs and preferences
        </p>
      </div>
      
      {/* Financial profile input */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Financial Profile</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="maxDownPayment" className="block text-sm font-medium text-gray-700">
              Maximum Down Payment
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="maxDownPayment"
                value={financialProfile.maxDownPayment || ''}
                onChange={(e) => handleFinancialProfileChange('maxDownPayment', parseFloat(e.target.value))}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700">
              Monthly Payment Budget
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="monthlyBudget"
                value={financialProfile.monthlyBudget || ''}
                onChange={(e) => handleFinancialProfileChange('monthlyBudget', parseFloat(e.target.value))}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="preferredTerm" className="block text-sm font-medium text-gray-700">
              Preferred Term (months)
            </label>
            <select
              id="preferredTerm"
              value={financialProfile.preferredTerm || ''}
              onChange={(e) => handleFinancialProfileChange('preferredTerm', parseInt(e.target.value))}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Select preferred term</option>
              <option value="12">12 months (1 year)</option>
              <option value="24">24 months (2 years)</option>
              <option value="36">36 months (3 years)</option>
              <option value="48">48 months (4 years)</option>
              <option value="60">60 months (5 years)</option>
              <option value="72">72 months (6 years)</option>
              <option value="84">84 months (7 years)</option>
              <option value="96">96 months (8 years)</option>
              <option value="120">120 months (10 years)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">
              Estimated Credit Score
            </label>
            <select
              id="creditScore"
              value={financialProfile.creditScore || ''}
              onChange={(e) => handleFinancialProfileChange('creditScore', parseInt(e.target.value))}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="800">Excellent (800+)</option>
              <option value="750">Very Good (750-799)</option>
              <option value="700">Good (700-749)</option>
              <option value="650">Fair (650-699)</option>
              <option value="600">Poor (600-649)</option>
              <option value="550">Very Poor (below 600)</option>
            </select>
          </div>
        </div>
        
        {/* Advanced options */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
          >
            <svg 
              className={`h-4 w-4 mr-1 transition-transform ${showAdvancedOptions ? 'transform rotate-90' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showAdvancedOptions ? 'Hide advanced options' : 'Show advanced options'}
          </button>
          
          {showAdvancedOptions && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="yearlyRevenue" className="block text-sm font-medium text-gray-700">
                  Annual Business Revenue
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="yearlyRevenue"
                    value={financialProfile.yearlyRevenue || ''}
                    onChange={(e) => handleFinancialProfileChange('yearlyRevenue', parseFloat(e.target.value))}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cashOnHand" className="block text-sm font-medium text-gray-700">
                  Available Cash on Hand
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="cashOnHand"
                    value={financialProfile.cashOnHand || ''}
                    onChange={(e) => handleFinancialProfileChange('cashOnHand', parseFloat(e.target.value))}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="collateralValue" className="block text-sm font-medium text-gray-700">
                  Available Collateral Value
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="collateralValue"
                    value={financialProfile.collateralValue || ''}
                    onChange={(e) => handleFinancialProfileChange('collateralValue', parseFloat(e.target.value))}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Matching parameters */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Priority Preferences</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Term preference */}
            <div>
              <label htmlFor="term-preference" className="block text-sm font-medium text-gray-700">
                Term Length
              </label>
              <select
                id="term-preference"
                value={matchingParameters.find(p => p.id === 'term')?.value || ''}
                onChange={(e) => handleParameterChange('term', 'value', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="short">Short Term</option>
                <option value="medium">Medium Term</option>
                <option value="long">Long Term</option>
              </select>
            </div>
            
            {/* Down payment preference */}
            <div>
              <label htmlFor="down-payment-preference" className="block text-sm font-medium text-gray-700">
                Down Payment
              </label>
              <select
                id="down-payment-preference"
                value={matchingParameters.find(p => p.id === 'downPayment')?.value || ''}
                onChange={(e) => handleParameterChange('downPayment', 'value', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="minimal">Minimal Down Payment</option>
                <option value="standard">Standard Down Payment</option>
                <option value="substantial">Substantial Down Payment</option>
              </select>
            </div>
            
            {/* Monthly payment preference */}
            <div>
              <label htmlFor="monthly-payment-preference" className="block text-sm font-medium text-gray-700">
                Monthly Payment
              </label>
              <select
                id="monthly-payment-preference"
                value={matchingParameters.find(p => p.id === 'monthlyPayment')?.value || ''}
                onChange={(e) => handleParameterChange('monthlyPayment', 'value', e.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="lowest">Lowest Possible</option>
                <option value="affordable">Affordable</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={generateMatches}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Matching...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Find Optimal Matches
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Match results */}
      {isDoneMatching && !isLoading && (
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Recommended Financing Options</h4>
          
          <div className="space-y-4">
            {matches.map(match => (
              <div 
                key={match.id}
                className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                  selectedMatchId === match.id 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleMatchSelect(match)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h5 className="text-base font-medium text-gray-900">{match.name}</h5>
                      <span 
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          match.matchScore >= 85 ? 'bg-green-100 text-green-800' :
                          match.matchScore >= 70 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {match.matchScore}% Match
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{match.recommendationReason}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{formatCurrency(match.monthlyPayment)}</div>
                    <div className="text-sm text-gray-500">per month</div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Term</div>
                    <div>{match.term} months</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Down Payment</div>
                    <div>{formatCurrency(match.downPayment)} ({match.downPaymentPercent}%)</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Rate</div>
                    <div>{match.rate.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Total Interest</div>
                    <div>{formatCurrency(match.totalInterest)}</div>
                  </div>
                </div>
                
                {/* Detailed view for selected match */}
                {selectedMatchId === match.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Financing Type</div>
                        <div className="capitalize">{match.financingType.replace(/_/g, ' ')}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Instrument Type</div>
                        <div className="capitalize">{match.instrumentType.replace(/_/g, ' ')}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Residual Value</div>
                        <div>{formatCurrency(match.residualValue)} ({match.residualValuePercent}%)</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Cost</div>
                        <div>{formatCurrency(match.downPayment + (match.monthlyPayment * match.term))}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                        onClick={() => {
                          // In a real app, this would select the structure and move to next step
                          if (onSelectMatch) {
                            onSelectMatch(match);
                          }
                        }}
                      >
                        Select This Structure
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="p-12 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900">EVA AI is analyzing optimal structures</h3>
          <p className="mt-2 text-sm text-gray-500">Considering 300+ financing variables and market conditions...</p>
        </div>
      )}
    </div>
  );
};

export default SmartMatchTool; 