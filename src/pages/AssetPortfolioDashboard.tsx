import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TopNavigation from '../components/layout/TopNavigation';
import { ASSET_CLASSES, AssetClassType } from '../components/blockchain/AssetClassification';

// Define asset interface
interface Asset {
  id: string;
  name: string;
  type: string;
  category: string;
  value: number;
  acquisitionDate: string;
  lastValuationDate: string;
  performanceMetrics: {
    roi: number;
    yieldRate: number;
    growthRate: number;
    riskScore: number;
  };
  location?: string;
  ownership: {
    entity: string;
    percentage: number;
  }[];
  linkedLoans?: {
    id: string;
    amount: number;
    interestRate: number;
    term: number;
    startDate: string;
    status: string;
  }[];
}

// Add these interfaces before the Asset interface
interface Portfolio {
  id: string;
  name: string;
  assetClass: AssetClassType;
  description?: string;
  createdAt: string;
  assets: Asset[];
}

// Mock data for portfolio dashboard
const mockAssets: Asset[] = [
  {
    id: uuidv4(),
    name: 'Commercial Office Building',
    type: 'real_estate',
    category: 'Commercial',
    value: 3750000,
    acquisitionDate: '2020-06-15',
    lastValuationDate: '2023-09-30',
    performanceMetrics: {
      roi: 8.2,
      yieldRate: 6.5,
      growthRate: 4.3,
      riskScore: 25,
    },
    location: 'Downtown Financial District',
    ownership: [
      { entity: 'Capital Holdings LLC', percentage: 100 }
    ],
    linkedLoans: [
      {
        id: uuidv4(),
        amount: 2250000,
        interestRate: 4.5,
        term: 240,
        startDate: '2020-07-01',
        status: 'active'
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Manufacturing Equipment Bundle',
    type: 'equipment',
    category: 'Industrial',
    value: 1250000,
    acquisitionDate: '2022-03-10',
    lastValuationDate: '2023-10-15',
    performanceMetrics: {
      roi: 12.5,
      yieldRate: 0,
      growthRate: -5.2,
      riskScore: 40,
    },
    ownership: [
      { entity: 'Manufacturing Operations Inc', percentage: 100 }
    ],
    linkedLoans: [
      {
        id: uuidv4(),
        amount: 950000,
        interestRate: 5.2,
        term: 60,
        startDate: '2022-03-15',
        status: 'active'
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Logistics Fleet Vehicles',
    type: 'vehicles',
    category: 'Transportation',
    value: 875000,
    acquisitionDate: '2021-11-22',
    lastValuationDate: '2023-08-30',
    performanceMetrics: {
      roi: 6.8,
      yieldRate: 0,
      growthRate: -12.5,
      riskScore: 35,
    },
    ownership: [
      { entity: 'FastTrack Logistics LLC', percentage: 100 }
    ],
    linkedLoans: [
      {
        id: uuidv4(),
        amount: 700000,
        interestRate: 4.8,
        term: 48,
        startDate: '2021-12-01',
        status: 'active'
      }
    ]
  },
  {
    id: uuidv4(),
    name: 'Technology Patent Portfolio',
    type: 'intellectual_property',
    category: 'IP & Digital',
    value: 1500000,
    acquisitionDate: '2019-05-18',
    lastValuationDate: '2023-07-15',
    performanceMetrics: {
      roi: 22.5,
      yieldRate: 18.2,
      growthRate: 15.3,
      riskScore: 55,
    },
    ownership: [
      { entity: 'Innovation Ventures', percentage: 75 },
      { entity: 'Tech Founders Group', percentage: 25 }
    ],
    linkedLoans: []
  },
  {
    id: uuidv4(),
    name: 'Corporate Bond Portfolio',
    type: 'corporate_bonds',
    category: 'Fixed Income',
    value: 2250000,
    acquisitionDate: '2022-01-10',
    lastValuationDate: '2023-11-01',
    performanceMetrics: {
      roi: 5.4,
      yieldRate: 5.8,
      growthRate: 0.8,
      riskScore: 15,
    },
    ownership: [
      { entity: 'Secure Investments Ltd', percentage: 100 }
    ],
    linkedLoans: []
  },
];

const AssetPortfolioDashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalValue: 0,
    totalDebt: 0,
    weightedRiskScore: 0,
    averageROI: 0,
    assetAllocation: {} as Record<string, number>
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'analytics' | 'risk' | 'transactions'>('overview');
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('1y');
  const [assetView, setAssetView] = useState<'macro' | 'micro'>('macro');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  
  // New state for portfolio management
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState<{
    name: string;
    assetClass: AssetClassType;
    description: string;
  }>({
    name: '',
    assetClass: 'real_estate',
    description: '',
  });

  // Add a new modal for adding assets
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [newAsset, setNewAsset] = useState<{
    name: string;
    category: string;
    value: number;
    description?: string;
    specificFields: Record<string, string>;
  }>({
    name: '',
    category: '',
    value: 0,
    description: '',
    specificFields: {}
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Create default portfolio using mock assets
      const defaultPortfolio: Portfolio = {
        id: 'default-portfolio',
        name: 'Main Investment Portfolio',
        assetClass: 'real_estate',
        description: 'Primary investment portfolio with diversified assets',
        createdAt: new Date().toISOString(),
        assets: mockAssets
      };
      
      setPortfolios([defaultPortfolio]);
      setSelectedPortfolio('default-portfolio');
      setAssets(mockAssets);
      setLoading(false);
      
      // Calculate portfolio metrics
      calculatePortfolioMetrics(mockAssets);
    }, 1000);
  }, []);

  // Update when selected portfolio changes
  useEffect(() => {
    if (selectedPortfolio && portfolios.length > 0) {
      const portfolio = portfolios.find(p => p.id === selectedPortfolio);
      if (portfolio) {
        setAssets(portfolio.assets);
        calculatePortfolioMetrics(portfolio.assets);
      }
    }
  }, [selectedPortfolio, portfolios]);

  const calculatePortfolioMetrics = (assetList: Asset[]) => {
    // Calculate total portfolio value
    const totalValue = assetList.reduce((sum, asset) => sum + asset.value, 0);
    
    // Calculate total debt
    const totalDebt = assetList.reduce((sum, asset) => 
      sum + (asset.linkedLoans?.reduce((loanSum, loan) => loanSum + loan.amount, 0) || 0), 0);
    
    // Calculate weighted risk score
    const weightedRiskScore = assetList.reduce((sum, asset) => 
      sum + (asset.performanceMetrics.riskScore * (asset.value / totalValue)), 0);
    
    // Calculate average ROI (weighted by asset value)
    const averageROI = assetList.reduce((sum, asset) => 
      sum + (asset.performanceMetrics.roi * (asset.value / totalValue)), 0);
    
    // Calculate asset allocation by category
    const assetAllocation = assetList.reduce((allocation, asset) => {
      if (!allocation[asset.category]) {
        allocation[asset.category] = 0;
      }
      allocation[asset.category] += asset.value / totalValue * 100;
      return allocation;
    }, {} as Record<string, number>);
    
    setPortfolioMetrics({
      totalValue,
      totalDebt,
      weightedRiskScore,
      averageROI,
      assetAllocation
    });
  };

  // Function to handle creating a new portfolio
  const handleCreatePortfolio = () => {
    const newPortfolioObj: Portfolio = {
      id: `portfolio-${uuidv4().slice(0, 8)}`,
      name: newPortfolio.name,
      assetClass: newPortfolio.assetClass,
      description: newPortfolio.description,
      createdAt: new Date().toISOString(),
      assets: [] // Start with empty assets
    };
    
    setPortfolios([...portfolios, newPortfolioObj]);
    setSelectedPortfolio(newPortfolioObj.id);
    setShowCreatePortfolioModal(false);
    
    // Reset form
    setNewPortfolio({
      name: '',
      assetClass: 'real_estate',
      description: '',
    });
  };

  // Get the currently selected portfolio
  const getCurrentPortfolio = (): Portfolio | undefined => {
    return portfolios.find(p => p.id === selectedPortfolio);
  };

  // Handle adding a new asset to the current portfolio
  const handleAddAsset = (newAsset: Asset) => {
    if (!selectedPortfolio) return;
    
    // Create a copy of portfolios
    const updatedPortfolios = [...portfolios];
    const portfolioIndex = updatedPortfolios.findIndex(p => p.id === selectedPortfolio);
    
    if (portfolioIndex !== -1) {
      // Add the new asset to the selected portfolio
      updatedPortfolios[portfolioIndex].assets.push(newAsset);
      setPortfolios(updatedPortfolios);
      
      // Update the assets state
      setAssets(updatedPortfolios[portfolioIndex].assets);
      
      // Recalculate metrics
      calculatePortfolioMetrics(updatedPortfolios[portfolioIndex].assets);
    }
  };

  // Function to handle creating a new asset
  const handleCreateAsset = () => {
    if (!selectedPortfolio || !newAsset.name || newAsset.value <= 0) return;
    
    // Create a new asset with the form data
    const asset: Asset = {
      id: uuidv4(),
      name: newAsset.name,
      type: getCurrentPortfolio()?.assetClass || 'real_estate',
      category: newAsset.category,
      value: newAsset.value,
      acquisitionDate: new Date().toISOString(),
      lastValuationDate: new Date().toISOString(),
      performanceMetrics: {
        roi: 0, // Initial ROI
        yieldRate: 0,
        growthRate: 0,
        riskScore: 30 // Default risk score
      },
      ownership: [
        { entity: 'Primary Owner', percentage: 100 }
      ]
    };
    
    // Add the asset to the current portfolio
    handleAddAsset(asset);
    setShowAddAssetModal(false);
    
    // Reset the form
    setNewAsset({
      name: '',
      category: '',
      value: 0,
      description: '',
      specificFields: {}
    });
  };

  // Initialize specificFields when asset class changes
  useEffect(() => {
    if (getCurrentPortfolio()) {
      const fields = getAssetClassFields(getCurrentPortfolio()?.assetClass || 'real_estate');
      const initialSpecificFields: Record<string, string> = {};
      fields.forEach(field => {
        initialSpecificFields[field] = '';
      });
      
      setNewAsset(prev => ({
        ...prev,
        specificFields: initialSpecificFields
      }));
    }
  }, [getCurrentPortfolio]);

  // New functions for transactions
  const getTransactionsForAsset = (assetId: string) => {
    // This would fetch transactions from an API in a real implementation
    return [
      {
        id: uuidv4(),
        assetId,
        type: 'Acquisition',
        date: '2022-05-12',
        amount: 125000,
        description: 'Initial acquisition',
        status: 'completed'
      },
      {
        id: uuidv4(),
        assetId,
        type: 'Valuation Update',
        date: '2022-11-15',
        amount: 138000,
        description: 'Quarterly valuation',
        status: 'completed'
      },
      {
        id: uuidv4(),
        assetId,
        type: 'Maintenance',
        date: '2023-02-28',
        amount: -12500,
        description: 'Annual maintenance',
        status: 'completed'
      },
      {
        id: uuidv4(),
        assetId,
        type: 'Income',
        date: '2023-06-30',
        amount: 32000,
        description: 'Quarterly dividend',
        status: 'completed'
      },
    ];
  };

  const allTransactions = assets.flatMap(asset => 
    getTransactionsForAsset(asset.id).map(tx => ({
      ...tx,
      assetName: asset.name,
      assetCategory: asset.category
    }))
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  // Get the asset class specific fields
  const getAssetClassFields = (assetType: AssetClassType) => {
    const assetClass = ASSET_CLASSES.find(ac => ac.id === assetType);
    return assetClass ? assetClass.dataFields : [];
  };

  const currentPortfolio = getCurrentPortfolio();
  const assetClassFields = currentPortfolio ? getAssetClassFields(currentPortfolio.assetClass) : [];

  return (
    <div className="container mx-auto px-4 py-6">
      <TopNavigation title="Asset Portfolio Dashboard" />
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Portfolio Manager</h1>
            <p className="text-gray-600">Comprehensive view of your asset portfolio</p>
          </div>
          <div className="flex space-x-3">
            {/* Portfolio selector dropdown */}
            <div className="relative">
              <select
                value={selectedPortfolio || ''}
                onChange={(e) => setSelectedPortfolio(e.target.value)}
                className="bg-white rounded-md shadow border border-gray-300 py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {portfolios.map(portfolio => (
                  <option key={portfolio.id} value={portfolio.id}>
                    {portfolio.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Add New Portfolio button */}
            <button
              onClick={() => setShowCreatePortfolioModal(true)}
              className="bg-primary-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-700"
            >
              Add Portfolio
            </button>
            
            {/* Macro/Micro view toggle */}
            <div className="bg-white rounded-md shadow flex">
              <button
                onClick={() => setAssetView('macro')}
                className={`px-4 py-2 text-sm ${
                  assetView === 'macro' 
                  ? 'bg-primary-100 text-primary-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
                } rounded-l-md transition-colors`}
              >
                Macro View
              </button>
              <button
                onClick={() => setAssetView('micro')}
                className={`px-4 py-2 text-sm ${
                  assetView === 'micro' 
                  ? 'bg-primary-100 text-primary-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
                } rounded-r-md transition-colors`}
              >
                Micro View
              </button>
            </div>
          </div>
        </div>
        
        {/* Display current portfolio information */}
        {currentPortfolio && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="mr-2">Asset Class:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {ASSET_CLASSES.find(ac => ac.id === currentPortfolio.assetClass)?.name || currentPortfolio.assetClass}
            </span>
            {currentPortfolio.description && (
              <span className="ml-4">{currentPortfolio.description}</span>
            )}
          </div>
        )}
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
          <p className="text-2xl font-bold text-gray-800">${portfolioMetrics.totalValue.toLocaleString()}</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="text-green-500 flex">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              5.2%
            </span>
            <span className="text-gray-500 ml-2">vs. last quarter</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Loan-to-Value Ratio</h3>
          <p className="text-2xl font-bold text-gray-800">
            {((portfolioMetrics.totalDebt / portfolioMetrics.totalValue) * 100).toFixed(1)}%
          </p>
          <div className="mt-1 flex items-center text-sm">
            <span className="text-red-500 flex">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              1.8%
            </span>
            <span className="text-gray-500 ml-2">vs. last quarter</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Portfolio ROI</h3>
          <p className="text-2xl font-bold text-gray-800">{portfolioMetrics.averageROI.toFixed(1)}%</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="text-green-500 flex">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              0.7%
            </span>
            <span className="text-gray-500 ml-2">vs. last quarter</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Risk Score</h3>
          <p className="text-2xl font-bold text-gray-800">{portfolioMetrics.weightedRiskScore.toFixed(0)}/100</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="text-gray-500 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              Low Risk
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Portfolio Overview
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assets'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('assets')}
          >
            Asset Details
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaction Explorer
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Performance Analytics
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'risk'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('risk')}
          >
            Risk Assessment
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Allocation Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4">
                  {/* This would be a chart in a real implementation */}
                  <div className="w-48 h-48 rounded-full border-8 border-primary-500 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border-8 border-l-gray-200 border-r-gray-200 border-t-yellow-400 border-b-green-400 transform rotate-45"></div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{assets.length}</div>
                      <div className="text-gray-500 text-sm">Assets</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-2">
                    {Object.entries(portfolioMetrics.assetAllocation).map(([category, percentage]) => (
                      <div key={category} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            category === 'Commercial' ? 'bg-primary-500' : 
                            category === 'Industrial' ? 'bg-yellow-400' : 
                            category === 'Transportation' ? 'bg-green-400' : 
                            category === 'IP & Digital' ? 'bg-red-400' : 
                            'bg-purple-400'
                          } mr-2`}></div>
                          <span className="text-sm text-gray-700">{category}</span>
                        </div>
                        <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Diversification Score</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Performance */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Portfolio Performance</h3>
                <div className="flex space-x-2">
                  {['1m', '3m', '6m', '1y', 'all'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeframe(period as any)}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        timeframe === period
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {period.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-64 w-full">
                {/* This would be a chart in a real implementation */}
                <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Performance Chart Placeholder</p>
                </div>
              </div>
            </div>

            {/* NEW: ROI Analysis */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Return on Investment Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">ROI by Asset Category</h4>
                  <div className="h-52 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Bar Chart Placeholder</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">ROI vs Risk Score</h4>
                  <div className="h-52 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Scatter Plot Placeholder</p>
                  </div>
                </div>
              </div>
            </div>

            {/* NEW: Shareholder Value */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Shareholder Value Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h4 className="text-sm font-medium text-gray-700">Total Shareholder Return</h4>
                  <p className="text-2xl font-bold text-gray-800 mt-2">11.4%</p>
                  <div className="mt-1 flex items-center text-sm">
                    <span className="text-green-500 flex">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      2.3%
                    </span>
                    <span className="text-gray-500 ml-2">vs. last year</span>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-gray-700">Economic Value Added</h4>
                  <p className="text-2xl font-bold text-gray-800 mt-2">$235,000</p>
                  <div className="mt-1 flex items-center text-sm">
                    <span className="text-green-500 flex">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      15.2%
                    </span>
                    <span className="text-gray-500 ml-2">vs. last quarter</span>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h4 className="text-sm font-medium text-gray-700">Return on Equity</h4>
                  <p className="text-2xl font-bold text-gray-800 mt-2">18.7%</p>
                  <div className="mt-1 flex items-center text-sm">
                    <span className="text-green-500 flex">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      3.1%
                    </span>
                    <span className="text-gray-500 ml-2">vs. industry avg.</span>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Shareholder Value Trend (Chart Placeholder)</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Assets Quick View */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Assets Overview</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {assets.slice(0, 4).map((asset) => (
                  <div key={asset.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{asset.name}</h4>
                        <p className="text-sm text-gray-500">{asset.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${asset.value.toLocaleString()}</p>
                        <p className={`text-sm ${
                          asset.performanceMetrics.roi > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {asset.performanceMetrics.roi > 0 ? '+' : ''}{asset.performanceMetrics.roi}% ROI
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50 rounded-b-lg">
                <button
                  onClick={() => setActiveTab('assets')}
                  className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                >
                  View all assets
                </button>
              </div>
            </div>
            
            {/* Portfolio Health */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Health</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Liquidity Ratio</span>
                    <span className="text-sm font-medium text-green-600">Good</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Debt Coverage</span>
                    <span className="text-sm font-medium text-yellow-600">Moderate</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Asset Quality</span>
                    <span className="text-sm font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Growth Potential</span>
                    <span className="text-sm font-medium text-green-600">Strong</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Overall Health Score</span>
                  <span className="text-lg font-bold text-green-600">85/100</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your portfolio health is excellent. Consider optimizing debt coverage to further improve financial stability.
                </p>
              </div>
            </div>

            {/* NEW: Market Benchmarks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Market Benchmarks</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">S&P 500</span>
                    <span className="text-sm font-medium text-green-600">+2.8%</span>
                  </div>
                  <div className="h-8 bg-gray-50 rounded"></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">Your Portfolio</span>
                    <span className="text-sm font-medium text-green-600">+5.4%</span>
                  </div>
                  <div className="h-8 bg-gray-50 rounded"></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700">Industry Average</span>
                    <span className="text-sm font-medium text-red-600">-0.7%</span>
                  </div>
                  <div className="h-8 bg-gray-50 rounded"></div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Your portfolio is outperforming the market by <span className="font-medium text-green-600">+2.6%</span> and industry average by <span className="font-medium text-green-600">+6.1%</span>.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'assets' && assetView === 'macro' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Asset Inventory</h3>
              <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm font-medium"
                onClick={() => setShowAddAssetModal(true)}>
                Add New Asset
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acquisition Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedAsset(asset)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{asset.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${asset.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex text-sm ${
                        asset.performanceMetrics.roi >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.performanceMetrics.roi > 0 ? '+' : ''}{asset.performanceMetrics.roi}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              asset.performanceMetrics.riskScore < 30 ? 'bg-green-500' : 
                              asset.performanceMetrics.riskScore < 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${asset.performanceMetrics.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{asset.performanceMetrics.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(asset.acquisitionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                      <button className="text-gray-600 hover:text-gray-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'assets' && assetView === 'micro' && (
        <div className="space-y-6">
          {assets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assets</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding an asset to your portfolio.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Asset
                </button>
              </div>
            </div>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">{asset.name}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                      {asset.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Current Value</h4>
                      <p className="text-xl font-bold text-gray-800">${asset.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">ROI</h4>
                      <p className={`text-xl font-bold ${asset.performanceMetrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.performanceMetrics.roi > 0 ? '+' : ''}{asset.performanceMetrics.roi}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Risk Score</h4>
                      <div className="flex items-center">
                        <div className="w-24 h-3 bg-gray-200 rounded-full mr-2">
                          <div 
                            className={`h-3 rounded-full ${
                              asset.performanceMetrics.riskScore < 30 ? 'bg-green-500' : 
                              asset.performanceMetrics.riskScore < 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${asset.performanceMetrics.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-bold text-gray-800">{asset.performanceMetrics.riskScore}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Asset class specific fields */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">{currentPortfolio?.assetClass.replace('_', ' ')} Specific Fields</h4>
                      <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                        {assetClassFields.map((field, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{field}</span>
                            <span className="text-sm font-medium">
                              {/* Simulate values for demo */}
                              {field === 'Interest Rate' ? '4.5%' : 
                               field === 'Coupon Rate' ? '3.2%' :
                               field === 'Credit Rating' ? 'AAA' :
                               field === 'Maturity Date' ? '2028-05-15' :
                               field === 'Territory' ? 'North America' :
                               field === 'Serial Number' ? 'SN12345678' :
                               field === 'Acquisition Date' ? new Date(asset.acquisitionDate).toLocaleDateString() :
                               'Data not available'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Rest of the component remains unchanged */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Ownership Structure</h4>
                      <div className="space-y-3">
                        {asset.ownership.map((owner, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{owner.entity}</span>
                            <span className="text-sm font-medium">{owner.percentage}%</span>
                          </div>
                        ))}
                      </div>
                      
                      {asset.linkedLoans && asset.linkedLoans.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Linked Loans</h4>
                          <div className="space-y-3">
                            {asset.linkedLoans.map(loan => (
                              <div key={loan.id} className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">${loan.amount.toLocaleString()} at {loan.interestRate}%</span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                  {loan.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* NEW: Transaction Explorer */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
                <div className="flex space-x-3">
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
                    <option>All Transaction Types</option>
                    <option>Acquisition</option>
                    <option>Valuation Update</option>
                    <option>Maintenance</option>
                    <option>Income</option>
                  </select>
                  <select className="rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50">
                    <option>All Assets</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTransactions.map((transaction) => (
                    <tr 
                      key={transaction.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedTransaction === transaction.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedTransaction(transaction.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{transaction.assetName}</div>
                        <div className="text-xs text-gray-500">{transaction.assetCategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${transaction.type === 'Acquisition' ? 'bg-blue-100 text-blue-800' : 
                           transaction.type === 'Valuation Update' ? 'bg-green-100 text-green-800' :
                           transaction.type === 'Maintenance' ? 'bg-red-100 text-red-800' :
                           'bg-purple-100 text-purple-800'}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {selectedTransaction && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Transaction ID</h4>
                  <p className="text-gray-900 font-mono">{selectedTransaction}</p>
                  
                  <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">Financial Impact</h4>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Financial Impact Chart</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Related Documents</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    <li className="py-2 flex justify-between">
                      <span className="text-primary-600 hover:text-primary-800">Transaction Receipt</span>
                      <span className="text-xs text-gray-500">PDF, 245KB</span>
                    </li>
                    <li className="py-2 flex justify-between">
                      <span className="text-primary-600 hover:text-primary-800">Valuation Report</span>
                      <span className="text-xs text-gray-500">PDF, 1.2MB</span>
                    </li>
                    <li className="py-2 flex justify-between">
                      <span className="text-primary-600 hover:text-primary-800">Contract Amendment</span>
                      <span className="text-xs text-gray-500">DOCX, 78KB</span>
                    </li>
                  </ul>
                  
                  <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">Audit Log</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">2023-07-12 14:32</p>
                      <p>Transaction recorded by John Smith</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">2023-07-12 15:47</p>
                      <p>Transaction verified by Finance Dept</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analytics</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive analysis of your portfolio's performance across different dimensions.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">ROI by Asset Class (Chart Placeholder)</p>
              </div>
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Performance Trends (Chart Placeholder)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Performance Comparison</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Initial Investment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual ROI</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benchmark Diff</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets.map((asset) => {
                    // Calculate sample metrics for demo
                    const initialValue = asset.value / (1 + asset.performanceMetrics.growthRate/100);
                    const totalReturn = asset.value - initialValue;
                    const benchmarkDiff = asset.performanceMetrics.roi - 5.2; // Assuming 5.2% is the benchmark
                    
                    return (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${asset.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${initialValue.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${asset.performanceMetrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {asset.performanceMetrics.roi > 0 ? '+' : ''}{asset.performanceMetrics.roi}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${benchmarkDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {benchmarkDiff > 0 ? '+' : ''}{benchmarkDiff.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Risk Assessment</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive analysis of risk factors across your portfolio.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Risk Heatmap (Chart Placeholder)</p>
              </div>
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Risk Exposure by Category (Chart Placeholder)</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Risk Factors</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Market Risk</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Interest Rate Sensitivity</span>
                      <span className="text-sm font-medium text-yellow-600">Moderate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Equity Market Exposure</span>
                      <span className="text-sm font-medium text-red-600">High</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Credit Risk</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Default Probability</span>
                      <span className="text-sm font-medium text-green-600">Low</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Counterparty Exposure</span>
                      <span className="text-sm font-medium text-green-600">Low</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Liquidity Risk</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Asset Liquidity</span>
                      <span className="text-sm font-medium text-yellow-600">Moderate</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">Cash Flow Stability</span>
                      <span className="text-sm font-medium text-green-600">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">Risk Advisory</h4>
                    <p className="text-sm text-yellow-700">
                      Your portfolio has moderate exposure to interest rate changes. Consider hedging strategies or diversifying into fixed-income assets with varied maturity profiles to mitigate potential impact from rate fluctuations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Feedback Chatbot */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>

      {/* Create Portfolio Modal */}
      {showCreatePortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Portfolio</h3>
              <button 
                onClick={() => setShowCreatePortfolioModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="portfolio-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Name*
                </label>
                <input
                  type="text"
                  id="portfolio-name"
                  value={newPortfolio.name}
                  onChange={(e) => setNewPortfolio({...newPortfolio, name: e.target.value})}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="My Investment Portfolio"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="asset-class" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Class*
                </label>
                <select
                  id="asset-class"
                  value={newPortfolio.assetClass}
                  onChange={(e) => setNewPortfolio({...newPortfolio, assetClass: e.target.value as AssetClassType})}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  {ASSET_CLASSES.map(assetClass => (
                    <option key={assetClass.id} value={assetClass.id}>
                      {assetClass.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  This determines the specific fields and logic for assets in this portfolio
                </p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Description of this portfolio's purpose and goals"
                />
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleCreatePortfolio}
                  disabled={!newPortfolio.name || !newPortfolio.assetClass}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    !newPortfolio.name || !newPortfolio.assetClass
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  Create Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Asset to Portfolio</h3>
              <button 
                onClick={() => setShowAddAssetModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="asset-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Name*
                </label>
                <input
                  type="text"
                  id="asset-name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Commercial Property"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="asset-category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <input
                  type="text"
                  id="asset-category"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({...newAsset, category: e.target.value})}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Commercial, Residential, etc."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="asset-value" className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Value*
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="asset-value"
                    value={newAsset.value || ''}
                    onChange={(e) => setNewAsset({...newAsset, value: parseFloat(e.target.value) || 0})}
                    className="w-full rounded-md border border-gray-300 shadow-sm pl-7 pr-12 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="asset-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="asset-description"
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Brief description of the asset"
                />
              </div>
              
              {/* Asset class specific fields */}
              {currentPortfolio && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 border-b pb-2">
                    {ASSET_CLASSES.find(ac => ac.id === currentPortfolio.assetClass)?.name} Specific Fields
                  </h4>
                  <div className="space-y-3 mt-3">
                    {assetClassFields.map((field) => (
                      <div key={field}>
                        <label htmlFor={`field-${field}`} className="block text-sm font-medium text-gray-700 mb-1">
                          {field}
                        </label>
                        <input
                          type="text"
                          id={`field-${field}`}
                          value={newAsset.specificFields[field] || ''}
                          onChange={(e) => {
                            const updatedFields = {...newAsset.specificFields, [field]: e.target.value};
                            setNewAsset({...newAsset, specificFields: updatedFields});
                          }}
                          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <button
                  onClick={handleCreateAsset}
                  disabled={!newAsset.name || newAsset.value <= 0 || !newAsset.category}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    !newAsset.name || newAsset.value <= 0 || !newAsset.category
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  Add Asset to Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetPortfolioDashboard; 