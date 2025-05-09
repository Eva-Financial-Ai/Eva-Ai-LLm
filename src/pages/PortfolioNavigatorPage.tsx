import React, { useState, useEffect, useMemo } from 'react';
import { useUserType } from '../contexts/UserTypeContext';
import { UserContext } from '../contexts/UserContext';
import { UserType } from '../types/UserTypes';
import { Asset, AssetClass, PortfolioUserRole, VerificationStatus } from '../types/AssetClassTypes';
import { AssetCardGrid } from '../components/blockchain/AssetCardGrid';
import TopNavigation from '../components/layout/TopNavigation';
import { v4 as uuidv4 } from 'uuid';

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

  return (
    <div className="container mx-auto px-4 py-6">
      <TopNavigation title="Portfolio Navigator" />

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Portfolio Navigator</h1>
            <p className="text-gray-600">Manage and analyze your asset portfolio</p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            {/* Add Asset Button */}
            <button
              onClick={() => setShowNewAssetModal(true)}
              className="mr-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              Add Asset
            </button>

            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setActiveTab('assets')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  activeTab === 'assets'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Assets
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  activeTab === 'settings'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Display role-based view message */}
        <div className="bg-blue-50 p-4 mb-6 rounded-lg border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                You are viewing this portfolio as a{' '}
                <span className="font-bold">
                  {portfolioRole === PortfolioUserRole.OWNER
                    ? 'Portfolio Owner'
                    : portfolioRole === PortfolioUserRole.MANAGER
                      ? 'Portfolio Manager'
                      : portfolioRole === PortfolioUserRole.SERVICER
                        ? 'Asset Servicer'
                        : 'Vendor'}
                </span>
                .
                {portfolioRole === PortfolioUserRole.OWNER &&
                  ' You have full access to manage and verify all assets.'}
                {portfolioRole === PortfolioUserRole.MANAGER &&
                  ' You can manage portfolio composition and initiate verification.'}
                {portfolioRole === PortfolioUserRole.SERVICER &&
                  ' You can view and verify serviceable assets.'}
                {portfolioRole === PortfolioUserRole.VENDOR &&
                  ' You have limited view access to certain asset classes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        {activeTab === 'assets' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(portfolioSummary.totalValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {portfolioSummary.assetCount} total assets
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Verified Assets</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(portfolioSummary.verifiedValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {portfolioSummary.verifiedCount} assets on Shield Ledger
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(portfolioSummary.pendingValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {portfolioSummary.pendingCount} assets in process
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Unverified Assets</h3>
                <p className="text-2xl font-bold text-gray-600">
                  {formatCurrency(portfolioSummary.unverifiedValue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {portfolioSummary.unverifiedCount} assets need verification
                </p>
              </div>
            </div>

            {/* Asset Grid Component */}
            <AssetCardGrid
              assets={mockAssets}
              onSelectAsset={handleSelectAsset}
              portfolioRole={portfolioRole}
            />

            {/* Floating Add Asset Button for Mobile */}
            <div className="md:hidden fixed bottom-6 right-6">
              <button
                onClick={() => setShowNewAssetModal(true)}
                className="h-14 w-14 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
              </button>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Average Performance</h3>
                <p
                  className={`text-2xl font-bold ${performanceMetrics.averagePerformance > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {performanceMetrics.averagePerformance > 0 ? '+' : ''}
                  {performanceMetrics.averagePerformance.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Portfolio average</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Positive Performers</h3>
                <p className="text-2xl font-bold text-green-600">
                  {performanceMetrics.positivePerformerCount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {performanceMetrics.positivePerformerPercentage.toFixed(1)}% of portfolio
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Verification Rate</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {((portfolioSummary.verifiedCount / portfolioSummary.assetCount) * 100).toFixed(
                    1
                  )}
                  %
                </p>
                <p className="text-xs text-gray-500 mt-1">Assets verified on blockchain</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
              <svg
                className="h-16 w-16 text-gray-400 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Advanced analytics coming soon
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Our team is building more powerful analytics tools for your portfolio.
              </p>
              <button
                onClick={() => setShowNewAssetModal(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                Add New Asset
              </button>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Portfolio Settings</h3>
              <p className="text-gray-600 mb-4">
                Configure your portfolio settings and preferences.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default currency
                  </label>
                  <select
                    className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={portfolioSettings.currency}
                    onChange={e => handleSettingChange('currency', e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk tolerance
                  </label>
                  <select
                    className="block w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={portfolioSettings.riskTolerance}
                    onChange={e => handleSettingChange('riskTolerance', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target return
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      className="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="8.5"
                      min="0"
                      max="100"
                      step="0.1"
                      value={portfolioSettings.targetReturn}
                      onChange={e =>
                        handleSettingChange('targetReturn', parseFloat(e.target.value))
                      }
                    />
                    <span className="ml-2">%</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mt-8 mb-4">Notifications</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="performance-alerts"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={portfolioSettings.notifications.performanceAlerts}
                    onChange={e =>
                      handleSettingChange('notifications.performanceAlerts', e.target.checked)
                    }
                  />
                  <label htmlFor="performance-alerts" className="ml-2 block text-sm text-gray-700">
                    Performance alerts
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="risk-level-changes"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={portfolioSettings.notifications.riskLevelChanges}
                    onChange={e =>
                      handleSettingChange('notifications.riskLevelChanges', e.target.checked)
                    }
                  />
                  <label htmlFor="risk-level-changes" className="ml-2 block text-sm text-gray-700">
                    Risk level changes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="market-updates"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={portfolioSettings.notifications.marketUpdates}
                    onChange={e =>
                      handleSettingChange('notifications.marketUpdates', e.target.checked)
                    }
                  />
                  <label htmlFor="market-updates" className="ml-2 block text-sm text-gray-700">
                    Market updates
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSaveSettings}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
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
