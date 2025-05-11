import React, { useState, useEffect, useMemo } from 'react';
import { useUserType } from '../contexts/UserTypeContext';
import { UserContext } from '../contexts/UserContext';
import { UserType } from '../types/UserTypes';
import { Asset, AssetClass, PortfolioUserRole, VerificationStatus } from '../types/AssetClassTypes';
import { AssetCardGrid } from '../components/blockchain/AssetCardGrid';
import TopNavigation from '../components/layout/TopNavigation';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';

// Define the AssetClassNames mapping
const AssetClassNames: Record<AssetClass, string> = {
  [AssetClass.CASH_EQUIVALENTS]: 'Cash & Cash Equivalents',
  [AssetClass.COMMERCIAL_PAPER_SECURED]: 'Commercial Paper (Secured)',
  [AssetClass.GOVERNMENT_BONDS]: 'Government Bonds',
  [AssetClass.CORPORATE_BONDS]: 'Corporate Bonds',
  [AssetClass.EQUITIES]: 'Equities',
  [AssetClass.MUTUAL_FUNDS]: 'Mutual Funds / ETFs',
  [AssetClass.REAL_ESTATE]: 'Real Estate',
  [AssetClass.COMMODITIES]: 'Commodities',
  [AssetClass.CRYPTO]: 'Cryptocurrency & Blockchain',
  [AssetClass.DERIVATIVES]: 'Derivatives',
  [AssetClass.PRIVATE_EQUITY]: 'Private Equity / VC',
  [AssetClass.FOREX]: 'Forex',
  [AssetClass.EQUIPMENT]: 'Equipment & Machinery',
  [AssetClass.VEHICLES]: 'Motor Vehicles & Aircraft',
  [AssetClass.UNSECURED_COMMERCIAL_PAPER]: 'Unsecured Commercial Paper',
  [AssetClass.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
  [AssetClass.DIGITAL_ASSETS]: 'Digital Assets (Non-Crypto)',
  [AssetClass.OTHER]: 'Other Assets',
};

// Build comprehensive mock data based on our asset classes
const generateMockAssets = (): Asset[] => {
  const assetClasses = Object.values(AssetClass);
  const mockAssets: Asset[] = [];

  // Helper to generate random date in the last 30 days
  const getRandomDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date.toISOString();
  };

  // Generate 2-3 assets for each class
  assetClasses.forEach(assetClass => {
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 assets per class

    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * 5000000) + 100000; // $100k to $5M
      const performance = Math.random() * 20 - 10; // -10% to +10%
      const risk = Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low';

      // Different verification statuses with weight toward unverified/pending
      const verificationStatus =
        Math.random() > 0.7
          ? VerificationStatus.VERIFIED
          : Math.random() > 0.5
            ? VerificationStatus.PENDING
            : VerificationStatus.UNVERIFIED;

      mockAssets.push({
        id: uuidv4(),
        assetID: `SHIELD-${Math.floor(Math.random() * 900000) + 100000}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: getAssetName(assetClass),
        assetClass,
        assetSubclass: getAssetSubclass(assetClass),
        description: `This is a mock ${assetClass.replace('_', ' ')} asset used for demonstration purposes.`,

        financialData: {
          marketValue: value,
          originalValue: value * (Math.random() * 0.4 + 0.8), // 80-120% of current value
          yield: Math.random() * 10, // 0-10% yield
          depreciationRate: Math.random() * 25, // 0-25% depreciation rate
          forecastingScore: Math.floor(Math.random() * 60) + 40, // 40-100 score
        },

        risk: risk as 'Low' | 'Medium' | 'High',
        performance: performance,
        performanceTrend: Math.random() * 4 - 2, // -2% to +2%

        ownership: [
          {
            owner: getOwnerName(),
            percentage: 100,
            since: new Date(
              new Date().setFullYear(new Date().getFullYear() - Math.floor(Math.random() * 3))
            ).toISOString(),
          },
        ],

        lienStatus: {
          hasLien: Math.random() > 0.7,
          lienHolder: Math.random() > 0.7 ? 'First National Bank' : undefined,
          lienAmount: Math.random() > 0.7 ? value * 0.6 : undefined,
        },

        trackingInfo: {
          liquidityRating: Math.floor(Math.random() * 10) + 1, // 1-10
          utilizationRate: Math.floor(Math.random() * 100), // 0-100%
          location: Math.random() > 0.5 ? '123 Main St, New York, NY' : undefined,
        },

        blockchainVerification: {
          status: verificationStatus,
          transactionHash:
            verificationStatus !== VerificationStatus.UNVERIFIED
              ? `0x${Math.random().toString(36).substring(2, 38)}`
              : undefined,
          verificationDate:
            verificationStatus === VerificationStatus.VERIFIED ? getRandomDate() : undefined,
          ledgerType: 'shield_ledger',
        },

        lastUpdate: getRandomDate(),
        dateCreated: new Date(
          new Date().setMonth(new Date().getMonth() - Math.floor(Math.random() * 12))
        ).toISOString(),
      });
    }
  });

  return mockAssets;
};

// Helper to generate appropriate asset names
const getAssetName = (assetClass: AssetClass): string => {
  switch (assetClass) {
    case AssetClass.CASH_EQUIVALENTS:
      return ['High-Yield Savings', 'Money Market Fund', 'T-Bill Portfolio'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.COMMERCIAL_PAPER_SECURED:
      return ['Secured Commercial Paper', 'Asset-Backed CP', 'Collateralized Notes'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.GOVERNMENT_BONDS:
      return ['Treasury Bond Portfolio', 'Municipal Bond Fund', 'Government Securities'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.CORPORATE_BONDS:
      return ['Corporate Bond Portfolio', 'Investment Grade Bonds', 'High-Yield Bond Fund'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.EQUITIES:
      return ['Blue Chip Stock Portfolio', 'Growth Stock Fund', 'Dividend Stock Holdings'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.MUTUAL_FUNDS:
      return ['Vanguard Index Fund', 'Fidelity Growth Fund', 'Balanced ETF Portfolio'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.REAL_ESTATE:
      return ['Commercial Property', 'Residential Apartments', 'Industrial Complex'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.COMMODITIES:
      return ['Gold Holdings', 'Agricultural Futures', 'Oil & Gas Reserves'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.CRYPTO:
      return ['Bitcoin Holdings', 'Ethereum Portfolio', 'Diversified Crypto Fund'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.DERIVATIVES:
      return ['Options Portfolio', 'Futures Contracts', 'Interest Rate Swaps'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.PRIVATE_EQUITY:
      return ['Venture Capital Fund', 'Private Equity Stake', 'Startup Investment'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.FOREX:
      return ['Foreign Currency Holdings', 'Multi-Currency Account', 'FOREX Trading Account'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.EQUIPMENT:
      return ['Manufacturing Equipment', 'Industrial Machinery', 'Medical Equipment'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.VEHICLES:
      return ['Commercial Fleet', 'Aircraft Lease', 'Heavy Equipment Fleet'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.UNSECURED_COMMERCIAL_PAPER:
      return ['Unsecured CP Portfolio', 'Short-Term Notes', 'Corporate Promissory Notes'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.INTELLECTUAL_PROPERTY:
      return ['Patent Portfolio', 'Trademark Rights', 'Copyright Holdings'][
        Math.floor(Math.random() * 3)
      ];
    case AssetClass.DIGITAL_ASSETS:
      return ['Digital Media Rights', 'SaaS License Portfolio', 'NFT Collection'][
        Math.floor(Math.random() * 3)
      ];
    default:
      return 'Miscellaneous Asset';
  }
};

// Helper to generate appropriate asset subclasses
const getAssetSubclass = (assetClass: AssetClass): string => {
  switch (assetClass) {
    case AssetClass.REAL_ESTATE:
      return ['Commercial', 'Residential', 'Industrial', 'Mixed-Use'][
        Math.floor(Math.random() * 4)
      ];
    case AssetClass.EQUIPMENT:
      return ['Manufacturing', 'Medical', 'Office', 'Construction'][Math.floor(Math.random() * 4)];
    case AssetClass.VEHICLES:
      return ['Trucks', 'Aircraft', 'Marine', 'Construction'][Math.floor(Math.random() * 4)];
    default:
      return '';
  }
};

// Helper to generate owner names
const getOwnerName = (): string => {
  const names = [
    'Atlas Holdings LLC',
    'Pinnacle Investments',
    'Meridian Capital Partners',
    'Quantum Asset Management',
    'Global Financial Trust',
    'Summit Ventures',
    'Excelsior Group',
    'Strategic Wealth Partners',
    'Harbor Portfolio Advisors',
    'Insight Capital Management',
  ];
  return names[Math.floor(Math.random() * names.length)];
};

// Component that shows a dashboard/overview of all portfolio assets
export const PortfolioNavigatorPage: React.FC = () => {
  const { userType } = useUserType();
  const { userRole } = React.useContext(UserContext);
  const [activeTab, setActiveTab] = useState('assets');
  const [mockAssets] = useState<Asset[]>(generateMockAssets());
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [portfolioRole, setPortfolioRole] = useState<PortfolioUserRole>(PortfolioUserRole.OWNER);
  const [portfolioSettings, setPortfolioSettings] = useState({
    currency: 'USD',
    riskTolerance: 'medium',
    targetReturn: 8.5,
    notifications: {
      performanceAlerts: true,
      riskLevelChanges: true,
      marketUpdates: false,
    },
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [verifiedValue, setVerifiedValue] = useState(0);
  const [pendingValue, setPendingValue] = useState(0);
  const [unverifiedValue, setUnverifiedValue] = useState(0);

  // Map user type to portfolio role
  useEffect(() => {
    if (userType) {
      switch (userType) {
        case UserType.BUSINESS:
          setPortfolioRole(PortfolioUserRole.OWNER);
          break;
        case UserType.BROKERAGE:
          setPortfolioRole(PortfolioUserRole.MANAGER);
          break;
        case UserType.LENDER:
          setPortfolioRole(PortfolioUserRole.SERVICER);
          break;
        case UserType.VENDOR:
          setPortfolioRole(PortfolioUserRole.VENDOR);
          break;
      }
    } else if (userRole) {
      // Fallback to UserContext if UserType not available
      switch (userRole) {
        case 'borrower':
          setPortfolioRole(PortfolioUserRole.OWNER);
          break;
        case 'broker':
          setPortfolioRole(PortfolioUserRole.MANAGER);
          break;
        case 'lender':
          setPortfolioRole(PortfolioUserRole.SERVICER);
          break;
        case 'vendor':
          setPortfolioRole(PortfolioUserRole.VENDOR);
          break;
      }
    }
  }, [userType, userRole]);

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock assets
      const mockAssets = generateMockAssets();
      setAssets(mockAssets);
      
      // Calculate portfolio totals
      calculatePortfolioTotals(mockAssets);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Calculate portfolio value totals
  const calculatePortfolioTotals = (assets: Asset[]) => {
    let total = 0;
    let verified = 0;
    let pending = 0;
    let unverified = 0;
    
    assets.forEach(asset => {
      const value = asset.financialData.marketValue;
      total += value;
      
      if (asset.blockchainVerification?.status === VerificationStatus.VERIFIED) {
        verified += value;
      } else if (asset.blockchainVerification?.status === VerificationStatus.PENDING) {
        pending += value;
      } else {
        unverified += value;
      }
    });
    
    setTotalValue(total);
    setVerifiedValue(verified);
    setPendingValue(pending);
    setUnverifiedValue(unverified);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle asset selection
  const handleSelectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssetDetails(true);
  };

  // Handle saving portfolio settings
  const handleSaveSettings = () => {
    // In a real application, this would call an API to save the settings
    alert('Portfolio settings saved successfully');
  };

  // Handle portfolio settings changes
  const handleSettingChange = (setting: string, value: any) => {
    if (setting.includes('.')) {
      const [parent, child] = setting.split('.');
      setPortfolioSettings({
        ...portfolioSettings,
        [parent]: {
          ...((portfolioSettings[parent as keyof typeof portfolioSettings] as Record<
            string,
            any
          >) || {}),
          [child]: value,
        },
      });
    } else {
      setPortfolioSettings({
        ...portfolioSettings,
        [setting]: value,
      });
    }
  };

  // Add a new asset to the portfolio
  const handleAddNewAsset = (newAsset: Partial<Asset>) => {
    // In a real application, this would send the data to an API
    // For now, we'll just show an alert to indicate success
    alert('New asset added to your portfolio!');
    setShowNewAssetModal(false);
  };

  // Calculate portfolio summary
  const portfolioSummary = useMemo(() => {
    const total = mockAssets.reduce((sum, asset) => sum + asset.financialData.marketValue, 0);
    const verified = mockAssets.filter(
      a => a.blockchainVerification.status === VerificationStatus.VERIFIED
    );
    const pending = mockAssets.filter(
      a => a.blockchainVerification.status === VerificationStatus.PENDING
    );
    const unverified = mockAssets.filter(
      a => a.blockchainVerification.status === VerificationStatus.UNVERIFIED
    );

    return {
      totalValue: total,
      verifiedValue: verified.reduce((sum, asset) => sum + asset.financialData.marketValue, 0),
      pendingValue: pending.reduce((sum, asset) => sum + asset.financialData.marketValue, 0),
      unverifiedValue: unverified.reduce((sum, asset) => sum + asset.financialData.marketValue, 0),
      assetCount: mockAssets.length,
      verifiedCount: verified.length,
      pendingCount: pending.length,
      unverifiedCount: unverified.length,
    };
  }, [mockAssets]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const positivePerformers = mockAssets.filter(a => a.performance && a.performance > 0);
    const averagePerformance =
      mockAssets.reduce((sum, asset) => sum + (asset.performance || 0), 0) / mockAssets.length;

    return {
      averagePerformance,
      positivePerformerCount: positivePerformers.length,
      positivePerformerPercentage: (positivePerformers.length / mockAssets.length) * 100,
    };
  }, [mockAssets]);

  // Show loading spinner if data is still loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-700">Loading Portfolio Navigator...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TopNavigation title="Portfolio Navigator" />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Navigator</h1>
          <p className="text-gray-600">Manage and analyze your asset portfolio</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowNewAssetModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Asset
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Settings
          </button>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-lg mb-8">
        <p className="text-blue-700">
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          You are viewing this portfolio as a <strong>Portfolio Owner</strong>. You have full access to manage and verify all assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-500 font-medium">Total Portfolio Value</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
          <p className="text-sm text-gray-600">{assets.length} total assets</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-500 font-medium">Verified Assets</h2>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(verifiedValue)}</p>
          <p className="text-sm text-gray-600">{assets.filter(a => a.blockchainVerification?.status === VerificationStatus.VERIFIED).length} assets on Shield Ledger</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-500 font-medium">Pending Verification</h2>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(pendingValue)}</p>
          <p className="text-sm text-gray-600">{assets.filter(a => a.blockchainVerification?.status === VerificationStatus.PENDING).length} assets in process</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-500 font-medium">Unverified Assets</h2>
          <p className="text-3xl font-bold text-gray-600">{formatCurrency(unverifiedValue)}</p>
          <p className="text-sm text-gray-600">{assets.filter(a => a.blockchainVerification?.status === VerificationStatus.UNVERIFIED).length} assets need verification</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">All Portfolio Assets</h2>
        <div className="flex">
          <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-l hover:bg-gray-50">
            All Asset Classes
          </button>
          <button className="px-3 py-1 bg-white border-t border-b border-gray-300 text-gray-700 hover:bg-gray-50">
            Value: High to Low
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-r hover:bg-gray-50">
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map(asset => (
          <div key={asset.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{asset.name}</h3>
                <div className={`px-2 py-1 rounded text-xs font-medium 
                  ${asset.blockchainVerification?.status === VerificationStatus.VERIFIED 
                    ? 'bg-green-100 text-green-800' 
                    : asset.blockchainVerification?.status === VerificationStatus.PENDING 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'}`}>
                  {asset.blockchainVerification?.status || 'UNVERIFIED'}
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{asset.assetClass} • {asset.assetSubclass || 'General'}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500">Market Value</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(asset.financialData.marketValue)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Performance</p>
                  <p className={`text-sm font-medium ${(asset.performance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(asset.performance || 0) >= 0 ? '+' : ''}{(asset.performance || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between">
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">Risk:</span>
                <span className={`text-xs font-medium ${
                  asset.risk === 'Low' ? 'text-green-600' : 
                  asset.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>{asset.risk}</span>
              </div>
              <Link to="/portfolio-wallet" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Details Modal */}
      {showAssetDetails && selectedAsset && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {selectedAsset.name}
                      </h3>

                      <div
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedAsset.blockchainVerification.status ===
                          VerificationStatus.VERIFIED
                            ? 'bg-green-100 text-green-800'
                            : selectedAsset.blockchainVerification.status ===
                                VerificationStatus.PENDING
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedAsset.blockchainVerification.status}
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Asset Class:</span>
                        <span className="text-sm font-medium">
                          {selectedAsset.assetClass.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Market Value:</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(selectedAsset.financialData.marketValue)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Performance:</span>
                        <span
                          className={`text-sm font-medium ${
                            selectedAsset.performance && selectedAsset.performance > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {selectedAsset.performance
                            ? (selectedAsset.performance > 0 ? '+' : '') +
                              selectedAsset.performance.toFixed(2) +
                              '%'
                            : 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Risk Rating:</span>
                        <span
                          className={`text-sm font-medium ${
                            selectedAsset.risk === 'Low'
                              ? 'text-green-600'
                              : selectedAsset.risk === 'Medium'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {selectedAsset.risk}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date Created:</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedAsset.dateCreated).toLocaleDateString()}
                        </span>
                      </div>

                      {selectedAsset.ownership.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Primary Owner:</span>
                          <span className="text-sm font-medium">
                            {selectedAsset.ownership[0].owner}
                          </span>
                        </div>
                      )}

                      {selectedAsset.lienStatus && selectedAsset.lienStatus.hasLien && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Lien Status:</span>
                          <span className="text-sm font-medium text-yellow-600">
                            Has lien ({selectedAsset.lienStatus.lienHolder})
                          </span>
                        </div>
                      )}

                      {selectedAsset.blockchainVerification.transactionHash && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Blockchain TX:</span>
                          <span className="text-sm font-medium text-blue-600 truncate ml-2 max-w-[200px]">
                            {selectedAsset.blockchainVerification.transactionHash.substring(0, 10)}
                            ...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedAsset.blockchainVerification.status !== VerificationStatus.VERIFIED &&
                  portfolioRole !== PortfolioUserRole.VENDOR && (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {selectedAsset.blockchainVerification.status === VerificationStatus.PENDING
                        ? 'Check Verification Status'
                        : 'Verify on Shield Ledger'}
                    </button>
                  )}
                <button
                  type="button"
                  onClick={() => setShowAssetDetails(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Asset Modal */}
      {showNewAssetModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Asset</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asset Name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="e.g., Commercial Real Estate Bond"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asset Class
                        </label>
                        <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                          {Object.values(AssetClass).map(assetClass => (
                            <option key={assetClass} value={assetClass}>
                              {AssetClassNames[assetClass]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asset Subclass
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="e.g., Commercial Office, Industrial Machinery"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Market Value
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="text"
                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Risk Level
                        </label>
                        <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          rows={3}
                          placeholder="Enter a description of this asset..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleAddNewAsset({})}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Asset
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAssetModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioNavigatorPage;
