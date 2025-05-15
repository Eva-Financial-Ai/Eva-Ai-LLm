import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RiskMapNavigator, { RiskMapType, RISK_MAP_VIEWS as IMPORTED_RISK_MAP_VIEWS } from './RiskMapNavigator';
import OrganizationSelector, { Organization } from './OrganizationSelector';
import { RiskCategory } from './RiskMapOptimized';
import RiskLabConfigurator from './RiskLabConfigurator';
import RiskScoreDisplay from './RiskScoringModel';
import PaywallModal from './PaywallModal';
import { RiskRange } from './RiskRangesConfigEditor';
import riskMapService from './RiskMapService';

// Extend the imported RISK_MAP_VIEWS with additional views
export const RISK_MAP_VIEWS = {
  ...IMPORTED_RISK_MAP_VIEWS,
  DASHBOARD: 'dashboard',
  CONFIGURATION: 'configuration'
};

// Define the LoanType to match the expected type in RiskLabConfigurator and RiskScoreDisplay
export type LoanType = 'general' | 'equipment' | 'realestate';

// Reusing service methods instead of local implementations
const mapRiskMapTypeToLoanType = (type: RiskMapType): LoanType => {
  return riskMapService.mapRiskMapTypeToLoanType(type) as LoanType;
};
const mapLoanTypeToRiskMapType = riskMapService.mapLoanTypeToRiskMapType;

// Update the interface for MOCK_CREDIT_DATA
interface CreditDataItem {
  title: string;
  label?: string; // Add optional label property
  description: string;
  metrics: { name: string; value: string; status: string; }[];
  score: number;
}

// Update MOCK_CREDIT_DATA type
const MOCK_CREDIT_DATA: Record<string, CreditDataItem> = {
  all: {
    title: 'Overall Risk Profile',
    label: 'Overall', // Add label property
    description: 'Comprehensive assessment of all risk categories',
    metrics: [
      { name: 'Aggregate Score', value: '92/100', status: 'good' },
      { name: 'Risk Factors', value: '2 minor', status: 'good' },
      { name: 'Recommended Action', value: 'Approve', status: 'good' },
    ],
    score: 92
  },
  credit: {
    title: 'Credit Risk',
    label: 'Credit', // Add label property
    description: 'Assessment of credit history and payment behavior',
    metrics: [
      { name: 'Business Credit Score', value: '85/100', status: 'good' },
      { name: 'Personal Credit Score', value: '750', status: 'good' },
      { name: 'Payment History', value: '98% on-time', status: 'good' },
      { name: 'Derogatory Marks', value: 'None', status: 'good' },
      { name: 'Credit Utilization', value: '32%', status: 'average' },
      { name: 'Recent Inquiries', value: '3 in last 6mo', status: 'average' },
    ],
    score: 88
  },
  capacity: {
    title: 'Repayment Capacity',
    label: 'Capacity', // Add label property
    description: 'Ability to meet financial obligations',
    metrics: [
      { name: 'Debt Service Coverage', value: '1.35x', status: 'average' },
      { name: 'Revenue Growth', value: '+12% YoY', status: 'good' },
      { name: 'Profit Margin', value: '8.5%', status: 'average' },
      { name: 'Cash Reserves', value: '45 days', status: 'average' },
      { name: 'Existing Debt', value: '$350,000', status: 'average' },
      { name: 'Industry Benchmark', value: 'Above Avg', status: 'good' },
    ],
    score: 82
  },
  capital: {
    title: 'Capital Structure',
    label: 'Capital', // Add label property
    description: 'Assessment of business equity and investments',
    metrics: [
      { name: 'Owner Investment', value: '$250,000', status: 'good' },
      { name: 'Equity Ratio', value: '35%', status: 'good' },
      { name: 'Working Capital', value: '$125,000', status: 'good' },
      { name: 'Asset Quality', value: 'High', status: 'good' },
      { name: 'Liquidity Ratio', value: '1.8', status: 'good' },
      { name: 'Capital Reserves', value: 'Adequate', status: 'average' },
    ],
    score: 90
  },
  collateral: {
    title: 'Collateral Value',
    label: 'Collateral', // Add label property
    description: 'Assessment of assets pledged as security',
    metrics: [
      { name: 'Collateral Value', value: '$550,000', status: 'good' },
      { name: 'Loan-to-Value', value: '65%', status: 'average' },
      { name: 'Collateral Type', value: 'Mixed Assets', status: 'average' },
      { name: 'Liquidity', value: 'Medium', status: 'average' },
      { name: 'Depreciation Risk', value: 'Low', status: 'good' },
      { name: 'Control Verification', value: 'Confirmed', status: 'good' },
    ],
    score: 85
  },
  conditions: {
    title: 'Market Conditions',
    label: 'Conditions', // Add label property
    description: 'Economic and industry-specific factors',
    metrics: [
      { name: 'Industry Outlook', value: 'Positive', status: 'good' },
      { name: 'Market Growth', value: '+8% YoY', status: 'good' },
      { name: 'Competitive Position', value: 'Strong', status: 'good' },
      { name: 'Regulatory Risk', value: 'Low', status: 'good' },
      { name: 'Economic Indicators', value: 'Favorable', status: 'good' },
      { name: 'Sensitivity Analysis', value: 'Low Risk', status: 'good' },
    ],
    score: 94
  },
  character: {
    title: 'Management Assessment',
    label: 'Character', // Add label property
    description: 'Evaluation of business management and history',
    metrics: [
      { name: 'Time in Business', value: '7 years', status: 'good' },
      { name: 'Management Experience', value: '12+ years', status: 'good' },
      { name: 'Legal Issues', value: 'None', status: 'good' },
      { name: 'Reputation', value: 'Excellent', status: 'good' },
      { name: 'Transparency', value: 'High', status: 'good' },
      { name: 'Industry Network', value: 'Well Connected', status: 'good' },
    ],
    score: 95
  }
};

// Sample transaction data
const SAMPLE_TRANSACTION = {
  id: 'TX-12246',
  applicantData: {
    name: 'ABC Corp',
    type: 'Working Capital',
    amount: 100000,
    purpose: 'Expansion'
  }
};

interface ModularRiskNavigatorProps {
  initialCategory?: RiskCategory;
  initialView?: string;
  initialRiskMapType?: RiskMapType;
  onViewChange?: (view: string) => void;
  onRiskMapTypeChange?: (type: RiskMapType) => void;
}

const ModularRiskNavigator: React.FC<ModularRiskNavigatorProps> = ({
  initialCategory = 'all',
  initialView = RISK_MAP_VIEWS.STANDARD,
  initialRiskMapType = 'unsecured',
  onViewChange,
  onRiskMapTypeChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>(initialCategory);
  const [activeView, setActiveView] = useState<string>(initialView);
  const [riskMapType, setRiskMapType] = useState<RiskMapType>(initialRiskMapType);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loanType, setLoanType] = useState<LoanType>(mapRiskMapTypeToLoanType(initialRiskMapType));
  
  // Add parameter sets for different risk types
  const [riskParameters, setRiskParameters] = useState({
    // Default parameters for unsecured
    loanAmount: 150000,
    loanTerm: 60,
    interestRate: 8.5,
    applicantCreditScore: 720,
    // Added parameters for equipment
    equipmentType: '',
    equipmentValue: 0,
    equipmentAge: 0,
    // Added parameters for real estate
    propertyType: '',
    propertyValue: 0,
    ltvRatio: 0,
    propertyLocation: '',
  });
  
  // Add state for custom ranges and weights
  const [customRanges, setCustomRanges] = useState<{[key: string]: RiskRange[]}>({});
  const [customWeights, setCustomWeights] = useState<{[key: string]: number}>({});
  
  // Update local state when props change
  useEffect(() => {
    console.log(`initialView changed to: ${initialView}`);
    setActiveView(initialView);
  }, [initialView]);
  
  useEffect(() => {
    console.log(`initialRiskMapType changed to: ${initialRiskMapType}`);
    setRiskMapType(initialRiskMapType);
  }, [initialRiskMapType]);
  
  // Extract the risk map type from URL query parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const typeParam = queryParams.get('type') as RiskMapType | null;
    
    if (typeParam && ['unsecured', 'equipment', 'realestate'].includes(typeParam)) {
      setRiskMapType(typeParam);
      
      // Also update the loan type for RiskLab
      const newLoanType: LoanType = 
        typeParam === 'equipment' ? 'equipment' : 
        typeParam === 'realestate' ? 'realestate' : 
        'general';
      
      setLoanType(newLoanType);
    }
  }, [location.search]);
  
  // Handle category selection from sidebar
  const handleCategorySelect = (category: RiskCategory) => {
    setSelectedCategory(category);
  };
  
  // Handle risk map type change
  const handleRiskMapTypeChange = (type: RiskMapType) => {
    console.log(`Risk map type changing to: ${type}`);
    setRiskMapType(type);
    
    // Adjust loan type for RiskLab based on risk map type
    const newLoanType: LoanType = 
      type === 'equipment' ? 'equipment' : 
      type === 'realestate' ? 'realestate' : 
      'general';
    
    setLoanType(newLoanType);
    
    // Update URL with new type if appropriate
    if (!onRiskMapTypeChange) {
      // If no parent handler, we need to update the URL ourselves
      const currentPath = location.pathname;
      const queryParams = new URLSearchParams(location.search);
      queryParams.set('type', type);
      
      navigate(`${currentPath}?${queryParams.toString()}`, { replace: true });
    }
    
    // Notify parent component if callback provided
    if (onRiskMapTypeChange) {
      onRiskMapTypeChange(type);
    }
    
    // If currently in RiskLab view, ensure the RiskLab shows the right loan type
    if (activeView === RISK_MAP_VIEWS.LAB) {
      // Force a re-render of the RiskLab component by triggering a state change
      setActiveView(prev => {
        setTimeout(() => setActiveView(RISK_MAP_VIEWS.LAB), 10);
        return 'refresh';
      });
    }
  };
  
  // Handle view change
  const handleViewChange = (view: string) => {
    console.log(`View changing to: ${view}`);
    setActiveView(view);
    
    // Notify parent component if callback provided
    if (onViewChange) {
      onViewChange(view);
    } else {
      // Navigate to the appropriate URL based on view
      const basePath = '/risk-assessment';
      let newPath = '';
      
      // Include the risk map type as a query parameter
      const typeParam = riskMapType ? `?type=${riskMapType}` : '';
      
      switch (view) {
        case RISK_MAP_VIEWS.STANDARD:
          newPath = `${basePath}${typeParam}`;
          break;
        case RISK_MAP_VIEWS.REPORT:
          newPath = `${basePath}/report${typeParam}`;
          break;
        case RISK_MAP_VIEWS.LAB:
          newPath = `${basePath}/lab${typeParam}`;
          break;
        case RISK_MAP_VIEWS.SCORE:
          newPath = `${basePath}/score${typeParam}`;
          break;
        default:
          newPath = `${basePath}${typeParam}`;
      }
      
      navigate(newPath, { replace: true });
    }
  };
  
  // Handle organization selection
  const handleOrganizationChange = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  // Handle parameter change
  const handleParameterChange = (paramName: string, value: any) => {
    setRiskParameters({
      ...riskParameters,
      [paramName]: value
    });
  };
  
  // Update parameters when risk type changes
  useEffect(() => {
    if (riskMapType === 'equipment') {
      // Set default parameters for equipment financing
      setRiskParameters(prev => ({
        ...prev,
        equipmentType: 'Machinery',
        equipmentValue: 200000,
        equipmentAge: 2,
        loanAmount: 160000,
        loanTerm: 48,
      }));
    } else if (riskMapType === 'realestate') {
      // Set default parameters for real estate financing
      setRiskParameters(prev => ({
        ...prev,
        propertyType: 'Commercial',
        propertyValue: 750000,
        ltvRatio: 75,
        propertyLocation: 'Urban',
        loanAmount: 562500, // 75% of property value
        loanTerm: 240, // 20 years
      }));
    } else {
      // Default parameters for unsecured
      setRiskParameters(prev => ({
        ...prev,
        loanAmount: 150000,
        loanTerm: 60,
        interestRate: 8.5,
        applicantCreditScore: 720,
      }));
    }
  }, [riskMapType]);
  
  // Render risk parameter inputs based on risk type
  const renderRiskParameters = () => {
    const commonParameters = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount ($)
          </label>
          <input
            type="number"
            value={riskParameters.loanAmount}
            onChange={(e) => handleParameterChange('loanAmount', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Term (months)
          </label>
          <input
            type="number"
            value={riskParameters.loanTerm}
            onChange={(e) => handleParameterChange('loanTerm', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={riskParameters.interestRate}
            onChange={(e) => handleParameterChange('interestRate', parseFloat(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Applicant Credit Score
          </label>
          <input
            type="number"
            value={riskParameters.applicantCreditScore}
            onChange={(e) => handleParameterChange('applicantCreditScore', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </>
    );
    
    // Equipment-specific parameters
    if (riskMapType === 'equipment') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {commonParameters}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Type
            </label>
            <select
              value={riskParameters.equipmentType}
              onChange={(e) => handleParameterChange('equipmentType', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Machinery">Machinery</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Technology">Technology Equipment</option>
              <option value="Medical">Medical Equipment</option>
              <option value="Construction">Construction Equipment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Value ($)
            </label>
            <input
              type="number"
              value={riskParameters.equipmentValue}
              onChange={(e) => handleParameterChange('equipmentValue', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Age (years)
            </label>
            <input
              type="number"
              value={riskParameters.equipmentAge}
              onChange={(e) => handleParameterChange('equipmentAge', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
      );
    }
    
    // Real estate-specific parameters
    if (riskMapType === 'realestate') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {commonParameters}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type
            </label>
            <select
              value={riskParameters.propertyType}
              onChange={(e) => handleParameterChange('propertyType', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Commercial">Commercial Building</option>
              <option value="Industrial">Industrial</option>
              <option value="Retail">Retail Space</option>
              <option value="Office">Office Building</option>
              <option value="MultiFamily">Multi-Family Residential</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Value ($)
            </label>
            <input
              type="number"
              value={riskParameters.propertyValue}
              onChange={(e) => handleParameterChange('propertyValue', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LTV Ratio (%)
            </label>
            <input
              type="number"
              value={riskParameters.ltvRatio}
              onChange={(e) => handleParameterChange('ltvRatio', parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Location
            </label>
            <select
              value={riskParameters.propertyLocation}
              onChange={(e) => handleParameterChange('propertyLocation', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="Urban">Urban</option>
              <option value="Suburban">Suburban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>
        </div>
      );
    }
    
    // Default for unsecured
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {commonParameters}
      </div>
    );
  };

  // Add state for Paywall modal
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(riskMapService.getAvailableCredits());
  
  // Effect to listen for custom events from child components
  useEffect(() => {
    // Handler for the custom event
    const handleOpenPaywall = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.type) {
        // Update riskMapType if provided in the event
        if (customEvent.detail.type !== riskMapType) {
          setRiskMapType(customEvent.detail.type);
        }
      }
      // Show the paywall
      showPaywall();
    };
    
    // Add event listener
    document.addEventListener('openPaywall', handleOpenPaywall);
    
    // Clean up
    return () => {
      document.removeEventListener('openPaywall', handleOpenPaywall);
    };
  }, [riskMapType]);

  // Periodic check for credit updates
  useEffect(() => {
    // Initialize credits
    setAvailableCredits(riskMapService.getAvailableCredits());
    
    // Check periodically
    const interval = setInterval(() => {
      const currentCredits = riskMapService.getAvailableCredits();
      if (currentCredits !== availableCredits) {
        setAvailableCredits(currentCredits);
      }
    }, 2000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [availableCredits]);

  // Function to show the paywall
  const showPaywall = () => {
    console.log("Opening paywall modal for report type:", riskMapType);
    setIsPaywallOpen(true);
  };
  
  // Function to handle report generation after payment
  const handleGenerateReport = () => {
    console.log("Payment successful, generating report");
    
    // Close the paywall
    setIsPaywallOpen(false);
    
    // Change to report view
    handleViewChange(RISK_MAP_VIEWS.REPORT);
  };

  // Update the renderContent function to ensure the paywall is properly triggered
  const renderContent = () => {
    switch (activeView) {
      case RISK_MAP_VIEWS.DASHBOARD:
        return renderDashboard();
      case RISK_MAP_VIEWS.CONFIGURATION:
        return renderConfiguration();
      case RISK_MAP_VIEWS.REPORT:
        // Check for credits before showing the report
        const creditsCount = riskMapService.getAvailableCredits();
        
        if (creditsCount <= 0) {
          // No credits, show paywall instead
          setTimeout(() => showPaywall(), 100); // Small delay to ensure state is updated correctly
          return (
            <div className="p-6 text-center">
              <p className="text-lg text-gray-600">Generating report...</p>
            </div>
          );
        }
        
        // Has credits, use a credit and show the report
        riskMapService.useCredit();
        setAvailableCredits(riskMapService.getAvailableCredits());
        
        return (
          <RiskScoreDisplay 
            companyId="demo" 
            loanType={loanType} 
            customRanges={customRanges}
            customWeights={customWeights}
          />
        );
      case RISK_MAP_VIEWS.LAB:
        return (
          <RiskLabConfigurator 
            loanType={loanType} 
            onLoanTypeChange={(type) => {
              // When loan type changes in RiskLab, update the risk map type as well
              const newRiskMapType = riskMapService.mapLoanTypeToRiskMapType(type);
              if (onRiskMapTypeChange) {
                onRiskMapTypeChange(newRiskMapType);
              }
            }}
          />
        );
      default:
        return renderDashboard();
    }
  };

  // Add renderDashboard function
  const renderDashboard = () => {
    // Render metric cards for the selected category
    const renderMetricCards = () => {
      // For "all" category, show a summary of all categories
      if (selectedCategory === 'all') {
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(MOCK_CREDIT_DATA).map(([key, data]) => (
              <div 
                key={key}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{data.title}</h4>
                  <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                    data.score >= 90 ? 'bg-green-100 text-green-800' : 
                    data.score >= 80 ? 'bg-blue-100 text-blue-800' : 
                    data.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {data.score}/100
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{data.description}</p>
                <div className="space-y-1">
                  {data.metrics.slice(0, 2).map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{metric.name}</span>
                      <span className={`${
                        metric.status === 'good' ? 'text-green-600' : 
                        metric.status === 'average' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>{metric.value}</span>
                    </div>
                  ))}
                  <button className="text-xs text-primary-600 hover:text-primary-800 mt-2">
                    View all metrics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      }
      
      // Show detailed view for selected category
      const selectedData = MOCK_CREDIT_DATA[selectedCategory as keyof typeof MOCK_CREDIT_DATA];
      
      if (!selectedData) return null;
      
      return (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-medium text-gray-900">{selectedData.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedData.description}</p>
            </div>
            <div className={`text-2xl font-bold px-3 py-2 rounded-lg ${
              selectedData.score >= 90 ? 'bg-green-100 text-green-800' : 
              selectedData.score >= 80 ? 'bg-blue-100 text-blue-800' : 
              selectedData.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {selectedData.score}
              <span className="text-xs font-normal">/100</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Key Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedData.metrics.map((metric, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border ${
                    metric.status === 'good' ? 'border-green-200 bg-green-50' : 
                    metric.status === 'average' ? 'border-yellow-200 bg-yellow-50' : 
                    'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="text-xs text-gray-500">{metric.name}</div>
                  <div className={`text-sm font-medium ${
                    metric.status === 'good' ? 'text-green-700' : 
                    metric.status === 'average' ? 'text-yellow-700' : 
                    'text-red-700'
                  }`}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Analysis</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                {selectedCategory === 'credit' && 'The applicant demonstrates excellent credit history with a strong payment record and responsible use of available credit.'}
                {selectedCategory === 'capacity' && 'Revenue trends show consistent growth and the business has demonstrated ability to service existing debt obligations.'}
                {selectedCategory === 'capital' && 'The applicant has significant equity investment in the business with strong asset quality.'}
                {selectedCategory === 'collateral' && 'The provided collateral adequately secures the requested loan amount with reasonable liquidation value.'}
                {selectedCategory === 'conditions' && 'Current market conditions are favorable for the industry with positive growth projections.'}
                {selectedCategory === 'character' && 'Management team has proven track record and excellent industry reputation.'}
              </p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div 
        className="bg-white rounded-lg shadow border border-gray-200 p-6 transition-opacity duration-300 ease-in-out" 
        key={`content-${activeView}-${selectedCategory}-${riskMapType}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              Risk Assessment for {selectedOrganization?.name || SAMPLE_TRANSACTION.applicantData.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Currently viewing: <strong className="capitalize">{selectedCategory}</strong> category in <strong>{riskMapType}</strong> risk map
            </p>
          </div>
          
          {selectedOrganization && (
            <div className="bg-blue-50 text-blue-700 p-2 rounded-md text-sm mt-2 md:mt-0">
              <span className="font-medium">Risk Score:</span> {selectedOrganization.riskScore}
            </div>
          )}
        </div>
        
        <div className="animate-fade-in">
          {renderMetricCards()}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Eva AI Analysis</h3>
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                <p>
                  Based on the {selectedCategory} analysis, this application shows 
                  {selectedCategory === 'all' 
                    ? ' strong performance across all major credit factors with minimal risk indicators.'
                    : MOCK_CREDIT_DATA[selectedCategory as keyof typeof MOCK_CREDIT_DATA]?.score >= 90
                      ? ' excellent metrics with no significant concerns.'
                      : MOCK_CREDIT_DATA[selectedCategory as keyof typeof MOCK_CREDIT_DATA]?.score >= 80
                        ? ' strong metrics with minor considerations to review.'
                        : ' acceptable metrics with some areas requiring additional verification.'}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Actions & Recommendations</h3>
              <div className="space-y-3">
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800">AI Recommendation</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    {selectedCategory === 'all' 
                      ? 'Approve with standard terms based on excellent overall profile.'
                      : MOCK_CREDIT_DATA[selectedCategory as keyof typeof MOCK_CREDIT_DATA]?.score >= 90
                        ? 'Approve with favorable terms based on excellent metrics.'
                        : MOCK_CREDIT_DATA[selectedCategory as keyof typeof MOCK_CREDIT_DATA]?.score >= 80
                          ? 'Approve with standard terms after verification.'
                          : 'Request additional documentation for further review.'}
                  </p>
                </div>
                
                <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-800">Compliance Check</h4>
                  <p className="text-sm text-green-600 mt-1">
                    All {selectedCategory} criteria are within regulatory guidelines.
                  </p>
                </div>
                
                <div className="mt-4">
                  <button 
                    className="w-full bg-primary-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-700 transition duration-150"
                    onClick={showPaywall}
                  >
                    Generate Risk Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the renderContent function to include the risk parameters in the configuration view
  const renderConfiguration = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Risk Lab Configuration</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Assessment Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              className={`text-sm px-4 py-2 rounded-md ${
                riskMapType === 'unsecured' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleRiskMapTypeChange('unsecured')}
            >
              Unsecured Financing
            </button>
            <button
              className={`text-sm px-4 py-2 rounded-md ${
                riskMapType === 'equipment' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleRiskMapTypeChange('equipment')}
            >
              Equipment Financing
            </button>
            <button
              className={`text-sm px-4 py-2 rounded-md ${
                riskMapType === 'realestate' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleRiskMapTypeChange('realestate')}
            >
              Real Estate Financing
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Risk Parameters</h3>
          {renderRiskParameters()}
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-800 mb-3">Risk Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.keys(MOCK_CREDIT_DATA).map(category => (
              <button
                key={category}
                className={`text-sm px-4 py-2 rounded-md ${
                  selectedCategory === category 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCategorySelect(category as RiskCategory)}
              >
                {category === 'all' ? 'All Categories' : MOCK_CREDIT_DATA[category as keyof typeof MOCK_CREDIT_DATA]?.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button 
            className="bg-primary-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-700 transition duration-150"
            onClick={() => handleViewChange(RISK_MAP_VIEWS.DASHBOARD)}
          >
            Apply Configuration
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="modular-risk-navigator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar with risk navigator */}
        <div className="lg:col-span-3">
          <RiskMapNavigator 
            selectedCategory={selectedCategory as string}
            onCategorySelect={handleCategorySelect}
            riskMapType={riskMapType}
            onRiskMapTypeChange={handleRiskMapTypeChange}
            activeView={activeView}
            onViewChange={handleViewChange}
            key={`navigator-${activeView}`}
          />
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-9" key={`content-wrapper-${activeView}-${selectedCategory}`}>
          {renderContent()}
        </div>
      </div>
      
      {/* Paywall Modal */}
      {isPaywallOpen && (
        <PaywallModal 
          isOpen={isPaywallOpen}
          onClose={() => setIsPaywallOpen(false)}
          onSuccess={handleGenerateReport}
          reportType={riskMapType}
        />
      )}
    </div>
  );
};

export default ModularRiskNavigator; 