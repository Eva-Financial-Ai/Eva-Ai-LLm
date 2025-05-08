import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

interface RiskFactor {
  id: string;
  name: string;
  score: number;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

interface CashFlowMetric {
  name: string;
  value: number;
  benchmark: number;
  status: 'good' | 'warning' | 'critical';
}

// Define risk tool types
type RiskTool = 'risk_assessment' | 'scenario_analysis' | 'fraud_detection' | 'compliance_check' | 'credit_scoring';

// Define scenario parameters interface
interface ScenarioParameters {
  interestRateChange: number;
  recessionImpact: number;
  industryDownturn: number;
  revenueDecrease: number;
  costIncrease: number;
  cashflowReduction: number;
}

const RiskAssessment = () => {
  const { currentTransaction } = useWorkflow();
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState(0);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [cashFlowMetrics, setCashFlowMetrics] = useState<CashFlowMetric[]>([]);
  const [activeTool, setActiveTool] = useState<RiskTool>('risk_assessment');
  
  // Scenario Analysis states (moved from the render function to the component level)
  const [scenarioType, setScenarioType] = useState<'economic' | 'industry' | 'custom'>('economic');
  const [parameters, setParameters] = useState<ScenarioParameters>({
    interestRateChange: 2.0,
    recessionImpact: 15.0,
    industryDownturn: 10.0,
    revenueDecrease: 20.0,
    costIncrease: 15.0,
    cashflowReduction: 25.0,
  });
  const [runningScenario, setRunningScenario] = useState(false);
  const [scenarioResults, setScenarioResults] = useState<any>(null);
  
  useEffect(() => {
    if (currentTransaction) {
      // Simulate API call for risk assessment - using shorter timeout
      setTimeout(() => {
        // Generate mock risk data based on transaction
        generateMockRiskData();
        setLoading(false);
      }, 800); // Reduced from 1500ms to 800ms for faster loading
    } else {
      // Generate default data even if no transaction is available
      generateMockRiskData();
      setLoading(false);
    }
  }, [currentTransaction]); // Simplified dependency
  
  const generateMockRiskData = () => {
    // Ensure we can still generate data even without a current transaction
    const transactionType = currentTransaction?.type || 'Finance Lease';
    const transactionAmount = currentTransaction?.amount || 250000;
    
    // Base score with some randomization
    const baseScore = transactionType === 'Finance Lease' ? 75 : 
                      transactionType === 'Equipment Loan' ? 70 :
                      transactionType === 'Working Capital' ? 65 : 60;
    
    // Adjust for transaction amount
    const amountFactor = Math.min(Math.max(transactionAmount / 1000000, 0), 10);
    const finalScore = Math.min(Math.max(Math.round(baseScore - amountFactor + (Math.random() * 10 - 5)), 0), 100);
    
    setOverallScore(finalScore);
    
    // Generate risk factors
    const mockRiskFactors: RiskFactor[] = [
      {
        id: 'risk-001',
        name: 'Industry Risk',
        score: Math.round(70 + (Math.random() * 20 - 10)),
        impact: 'medium',
        description: 'Risk associated with the applicant\'s industry sector.'
      },
      {
        id: 'risk-002',
        name: 'Financial Stability',
        score: Math.round(65 + (Math.random() * 30 - 15)),
        impact: 'high',
        description: 'Assessment of applicant\'s overall financial health and stability.'
      },
      {
        id: 'risk-003',
        name: 'Credit History',
        score: Math.round(75 + (Math.random() * 25 - 15)),
        impact: 'high',
        description: 'Based on historical payment behavior and credit utilization.'
      },
      {
        id: 'risk-004',
        name: 'Management Experience',
        score: Math.round(80 + (Math.random() * 20 - 10)),
        impact: 'medium',
        description: 'Assessment of the management team\'s experience and track record.'
      },
      {
        id: 'risk-005',
        name: 'Market Conditions',
        score: Math.round(60 + (Math.random() * 30 - 15)),
        impact: 'medium',
        description: 'Current market conditions affecting the applicant\'s business.'
      }
    ];
    
    setRiskFactors(mockRiskFactors);
    
    // Generate cash flow metrics
    const mockCashFlowMetrics: CashFlowMetric[] = [
      {
        name: 'Debt Service Coverage Ratio',
        value: 1.25 + (Math.random() * 1 - 0.3),
        benchmark: 1.25,
        status: Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'warning' : 'critical'
      },
      {
        name: 'Current Ratio',
        value: 1.5 + (Math.random() * 1 - 0.3),
        benchmark: 1.5,
        status: Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'warning' : 'critical'
      },
      {
        name: 'Operating Cash Flow Margin',
        value: 0.15 + (Math.random() * 0.1 - 0.05),
        benchmark: 0.15,
        status: Math.random() > 0.5 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical'
      },
      {
        name: 'Quick Ratio',
        value: 1.0 + (Math.random() * 0.5 - 0.2),
        benchmark: 1.0,
        status: Math.random() > 0.6 ? 'good' : Math.random() > 0.3 ? 'warning' : 'critical'
      }
    ];
    
    setCashFlowMetrics(mockCashFlowMetrics);
  };
  
  const handleParameterChange = (param: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  const runScenarioAnalysis = () => {
    setRunningScenario(true);
    setScenarioResults(null);
    
    // Simulate scenario analysis processing
    setTimeout(() => {
      // Generate mock scenario analysis results
      const results = {
        impactScore: Math.round(Math.random() * 40 + 30), // Score between 30-70
        debtServiceCoverageRatio: (Math.random() * 0.5 + 0.8).toFixed(2), // Between 0.8 and 1.3
        probabilityOfDefault: `${(Math.random() * 15 + 5).toFixed(1)}%`, // Between 5% and 20%
        solvencyRisk: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
        recommendedActions: [
          'Reduce variable expenses by 15%',
          'Restructure current debt obligations',
          'Increase cash reserves to 3 months of operating expenses',
          'Diversify revenue streams to reduce concentration risk'
        ],
        stressTestChartData: {
          labels: ['Current', 'Mild', 'Moderate', 'Severe'],
          datasets: [
            {
              name: 'DSCR',
              values: [1.48, 1.25, 1.10, 0.85]
            },
            {
              name: 'Liquidity Ratio',
              values: [1.57, 1.32, 1.15, 0.92]
            }
          ]
        }
      };
      
      setScenarioResults(results);
      setRunningScenario(false);
    }, 2000);
  };
  
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-600';
  };
  
  const getCashFlowStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'low': 
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Low Impact</span>;
      case 'medium': 
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Medium Impact</span>;
      case 'high': 
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">High Impact</span>;
      default:
        return null;
    }
  };

  // Render different tools based on active tool
  const renderActiveTool = () => {
    switch (activeTool) {
      case 'risk_assessment':
        return renderRiskAssessment();
      case 'scenario_analysis':
        return renderScenarioAnalysis();
      case 'fraud_detection':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fraud Detection</h3>
            <p className="text-gray-500">Advanced fraud detection and prevention tools will appear here.</p>
          </div>
        );
      case 'compliance_check':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Check</h3>
            <p className="text-gray-500">Regulatory compliance verification tools will appear here.</p>
          </div>
        );
      case 'credit_scoring':
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Scoring</h3>
            <p className="text-gray-500">Advanced AI credit scoring models will appear here.</p>
          </div>
        );
      default:
        return renderRiskAssessment();
    }
  };
  
  // Scenario Analysis tool render function that uses state from the component
  const renderScenarioAnalysis = () => {
    return (
      <div className="space-y-6">
        {/* Scenario Type Selection */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Scenario Analysis Tool</h3>
            <p className="text-sm text-gray-500">Evaluate the impact of different economic and industry scenarios on risk factors</p>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Scenario Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setScenarioType('economic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scenarioType === 'economic' 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Economic Downturn
                </button>
                <button
                  onClick={() => setScenarioType('industry')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scenarioType === 'industry' 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Industry Specific
                </button>
                <button
                  onClick={() => setScenarioType('custom')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    scenarioType === 'custom' 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Custom Scenario
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-800 mb-3">Scenario Parameters</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Interest Rate Change */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Interest Rate Change</label>
                    <span className="text-sm text-gray-500">{parameters.interestRateChange}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={parameters.interestRateChange}
                    onChange={(e) => handleParameterChange('interestRateChange', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>10%</span>
                  </div>
                </div>
                
                {/* Recession Impact */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Recession Impact</label>
                    <span className="text-sm text-gray-500">{parameters.recessionImpact}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={parameters.recessionImpact}
                    onChange={(e) => handleParameterChange('recessionImpact', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                </div>
                
                {/* Industry Downturn */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Industry Downturn</label>
                    <span className="text-sm text-gray-500">{parameters.industryDownturn}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={parameters.industryDownturn}
                    onChange={(e) => handleParameterChange('industryDownturn', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                  </div>
                </div>
                
                {/* Revenue Decrease */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Revenue Decrease</label>
                    <span className="text-sm text-gray-500">{parameters.revenueDecrease}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={parameters.revenueDecrease}
                    onChange={(e) => handleParameterChange('revenueDecrease', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
                
                {/* Cost Increase */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Cost Increase</label>
                    <span className="text-sm text-gray-500">{parameters.costIncrease}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={parameters.costIncrease}
                    onChange={(e) => handleParameterChange('costIncrease', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                </div>
                
                {/* Cash Flow Reduction */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Cash Flow Reduction</label>
                    <span className="text-sm text-gray-500">{parameters.cashflowReduction}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={parameters.cashflowReduction}
                    onChange={(e) => handleParameterChange('cashflowReduction', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={runScenarioAnalysis}
                  disabled={runningScenario}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    runningScenario ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {runningScenario ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running Analysis...
                    </span>
                  ) : (
                    'Run Scenario Analysis'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scenario Results */}
        {scenarioResults && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Scenario Analysis Results</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Impact Score</h4>
                  <div className="flex items-end">
                    <span className="text-2xl font-bold text-gray-900">{scenarioResults.impactScore}</span>
                    <span className={`ml-2 text-xs ${scenarioResults.impactScore > 50 ? 'text-red-600' : 'text-orange-600'}`}>
                      Moderate-High
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">DSCR Under Stress</h4>
                  <div className="flex items-end">
                    <span className="text-2xl font-bold text-gray-900">{scenarioResults.debtServiceCoverageRatio}x</span>
                    <span className={`ml-2 text-xs ${parseFloat(scenarioResults.debtServiceCoverageRatio) < 1.0 ? 'text-red-600' : 'text-yellow-600'}`}>
                      {parseFloat(scenarioResults.debtServiceCoverageRatio) < 1.0 ? 'Below Threshold' : 'Near Threshold'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Probability of Default</h4>
                  <div className="flex items-end">
                    <span className="text-2xl font-bold text-gray-900">{scenarioResults.probabilityOfDefault}</span>
                    <span className="ml-2 text-xs text-red-600">Increased</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-base font-medium text-gray-800 mb-3">Stress Test Results</h4>
                  
                  {/* This would be a chart in a real implementation */}
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Stress test chart would appear here</p>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scenarioResults.solvencyRisk === 'High' ? 'bg-red-100 text-red-800' :
                      scenarioResults.solvencyRisk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {scenarioResults.solvencyRisk} Solvency Risk
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="text-base font-medium text-gray-800 mb-3">Recommended Actions</h4>
                  
                  <ul className="space-y-2">
                    {scenarioResults.recommendedActions.map((action: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-primary-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-2 text-sm text-gray-700">{action}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Export Scenario Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Original risk assessment content
  const renderRiskAssessment = () => {
    // Handle debt service coverage ratio comparison safely
    const dscrMetric = cashFlowMetrics.find(m => m.name === 'Debt Service Coverage Ratio');
    const dscrValue = dscrMetric?.value || 0;
    const dscrBenchmark = dscrMetric?.benchmark || 0;
    const exceedsBenchmark = dscrValue > dscrBenchmark;

    return (
      <div className="space-y-6">
        {/* Overall Risk Score */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Overall Risk Assessment</h3>
          </div>
          
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 text-center sm:text-left">
                  <div className={`text-4xl sm:text-5xl font-bold ${getRiskColor(overallScore)}`}>
                    {overallScore}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Risk Score</div>
                </div>
                
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        overallScore >= 80 ? 'bg-green-500' : 
                        overallScore >= 65 ? 'bg-yellow-500' : 
                        overallScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${overallScore}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div>High Risk</div>
                    <div>Low Risk</div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Assessment: </span>
                    {overallScore >= 80 ? 'Low Risk - Favorable approval outlook' : 
                     overallScore >= 65 ? 'Medium Risk - Standard approval process' : 
                     overallScore >= 50 ? 'Elevated Risk - May require additional review' : 
                     'High Risk - Significant concerns present'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Risk Factors */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Key Risk Factors</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4 sm:p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))
            ) : (
              riskFactors.map(factor => (
                <div key={factor.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="text-base font-medium text-gray-900 mb-1">{factor.name}</h4>
                      <p className="text-sm text-gray-500">{factor.description}</p>
                    </div>
                    <div className="flex items-center sm:ml-4">
                      {getImpactBadge(factor.impact)}
                      <div className={`ml-3 text-xl font-bold ${getRiskColor(factor.score)}`}>
                        {factor.score}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Cash Flow Analysis */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Cash Flow Analysis</h3>
          </div>
          
          <div className="p-4 sm:p-6 overflow-x-auto">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Metric
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Benchmark
                      </th>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cashFlowMetrics.map((metric, index) => (
                      <tr key={index}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {metric.name}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {metric.value.toFixed(2)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {metric.benchmark.toFixed(2)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${getCashFlowStatusColor(metric.status)}`}>
                            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-primary-50">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">AI Risk Insights</h3>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-sm sm:prose max-w-none">
                <p>
                  Based on our AI analysis, this transaction presents 
                  <strong className={getRiskColor(overallScore)}>
                    {overallScore >= 80 ? ' low ' : 
                     overallScore >= 65 ? ' moderate ' : 
                     overallScore >= 50 ? ' elevated ' : ' high '}
                  </strong> 
                  risk. 
                </p>
                
                <p>
                  The {riskFactors.sort((a, b) => a.score - b.score)[0].name.toLowerCase()} is the most concerning factor, 
                  with potential implications for long-term repayment ability. We recommend additional 
                  verification of {Math.random() > 0.5 ? 'cash flow projections' : 'collateral valuation'} 
                  to mitigate this risk.
                </p>
                
                <p>
                  The cash flow analysis indicates that the debt service coverage ratio
                  {exceedsBenchmark ? ' exceeds ' : ' falls below '} 
                  our standard requirements, which {Math.random() > 0.5 ? 'supports' : 'may affect'} the approval recommendation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  if (!currentTransaction) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Please select a transaction first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* EVA Risk Tools Navigation */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-primary-50">
          <h3 className="text-lg font-medium text-gray-900">EVA Risk Tools</h3>
          <p className="text-sm text-gray-500 mt-1">
            Access your AI-powered risk assessment tools
          </p>
        </div>
        
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
          <button
            onClick={() => setActiveTool('risk_assessment')}
            className={`flex-none px-3 sm:px-6 py-3 text-sm font-medium border-b-2 ${
              activeTool === 'risk_assessment' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Risk Assessment
          </button>
          <button
            onClick={() => setActiveTool('scenario_analysis')}
            className={`flex-none px-3 sm:px-6 py-3 text-sm font-medium border-b-2 ${
              activeTool === 'scenario_analysis' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Scenario Analysis
          </button>
          <button
            onClick={() => setActiveTool('fraud_detection')}
            className={`flex-none px-3 sm:px-6 py-3 text-sm font-medium border-b-2 ${
              activeTool === 'fraud_detection' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fraud Detection
          </button>
          <button
            onClick={() => setActiveTool('compliance_check')}
            className={`flex-none px-3 sm:px-6 py-3 text-sm font-medium border-b-2 ${
              activeTool === 'compliance_check' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Compliance Check
          </button>
          <button
            onClick={() => setActiveTool('credit_scoring')}
            className={`flex-none px-3 sm:px-6 py-3 text-sm font-medium border-b-2 ${
              activeTool === 'credit_scoring' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Credit Scoring
          </button>
        </div>
      </div>
      
      {/* Render the active tool content */}
      {renderActiveTool()}
    </div>
  );
};

export default RiskAssessment; 