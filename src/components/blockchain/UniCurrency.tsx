import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faSearch,
  faFilter,
  faInfoCircle,
  faLandmark,
  faCopyright,
  faMoneyBillWave,
  faFileAlt,
  faCogs,
  faCoins,
  faCompass,
  faChartLine,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
// Bitcoin icon is in the brand icons
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';

interface AssetCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  assets: Asset[];
  isExpanded?: boolean;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  tags: string[];
  isVerified: boolean;
  marketCap?: number;
  liquidity?: number;
  volatility?: number;
  performance?: number;
}

const UniCurrency: React.FC = () => {
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('marketCap');
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch this data from an API
    const mockData: AssetCategory[] = [
      {
        id: 'fiat',
        name: 'Fiat Currencies',
        description: 'Government-issued legal tender (e.g., USD, EUR, JPY)',
        icon: <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500" />,
        isExpanded: true,
        assets: [
          {
            id: 'usd',
            name: 'US Dollar',
            symbol: 'USD',
            type: 'fiat',
            tags: ['High Liquidity', 'Reserve Currency'],
            isVerified: true,
            marketCap: 0,
            liquidity: 100,
            volatility: 5,
            performance: 2,
          },
          {
            id: 'eur',
            name: 'Euro',
            symbol: 'EUR',
            type: 'fiat',
            tags: ['High Liquidity', 'Reserve Currency'],
            isVerified: true,
            marketCap: 0,
            liquidity: 98,
            volatility: 6,
            performance: 0,
          },
          {
            id: 'jpy',
            name: 'Japanese Yen',
            symbol: 'JPY',
            type: 'fiat',
            tags: ['High Liquidity', 'Safe Haven'],
            isVerified: true,
            marketCap: 0,
            liquidity: 95,
            volatility: 7,
            performance: -1,
          },
        ],
      },
      {
        id: 'gov-debt',
        name: 'Government and Other Asset-Backed Debt Instruments',
        description:
          'Fixed-income investments backed by governmental credit or tangible/intangible assets',
        icon: <FontAwesomeIcon icon={faLandmark} className="text-blue-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'us-treasury',
            name: 'US Treasury Bond',
            symbol: 'USTB',
            type: 'gov-debt',
            tags: ['Government-Backed', 'Low Risk'],
            isVerified: true,
            marketCap: 0,
            liquidity: 92,
            volatility: 10,
            performance: 3,
          },
          {
            id: 'muni-bond',
            name: 'Municipal Bond',
            symbol: 'MUNI',
            type: 'gov-debt',
            tags: ['Government-Backed', 'Tax Advantaged'],
            isVerified: true,
            marketCap: 0,
            liquidity: 75,
            volatility: 15,
            performance: 4,
          },
          {
            id: 'mbs',
            name: 'Mortgage-Backed Security',
            symbol: 'MBS',
            type: 'asset-backed',
            tags: ['Asset-Backed', 'Real Estate'],
            isVerified: true,
            marketCap: 0,
            liquidity: 78,
            volatility: 20,
            performance: 5,
          },
        ],
      },
      {
        id: 'equity',
        name: 'Equities and Shares',
        description: 'Ownership stakes in companies and funds',
        icon: <FontAwesomeIcon icon={faChartLine} className="text-purple-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'aapl',
            name: 'Apple Inc.',
            symbol: 'AAPL',
            type: 'stock',
            tags: ['Tech', 'Blue Chip'],
            isVerified: true,
            marketCap: 2700000000000,
            liquidity: 98,
            volatility: 25,
            performance: 15,
          },
          {
            id: 'voo',
            name: 'Vanguard S&P 500 ETF',
            symbol: 'VOO',
            type: 'etf',
            tags: ['Index Fund', 'Diversified'],
            isVerified: true,
            marketCap: 290000000000,
            liquidity: 95,
            volatility: 20,
            performance: 10,
          },
        ],
      },
      {
        id: 'commodity',
        name: 'Commodities and Commodity-Backed Assets',
        description: 'Physical goods or tokens linked to real-world commodities',
        icon: <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'gold',
            name: 'Gold',
            symbol: 'XAU',
            type: 'commodity',
            tags: ['Precious Metal', 'Safe Haven'],
            isVerified: true,
            marketCap: 0,
            liquidity: 90,
            volatility: 15,
            performance: 8,
          },
          {
            id: 'oil',
            name: 'Crude Oil',
            symbol: 'OIL',
            type: 'commodity',
            tags: ['Energy', 'Industrial'],
            isVerified: true,
            marketCap: 0,
            liquidity: 85,
            volatility: 30,
            performance: 5,
          },
        ],
      },
      {
        id: 'hybrid',
        name: 'Hybrid Assets',
        description: 'Instruments blending multiple characteristics',
        icon: <FontAwesomeIcon icon={faCompass} className="text-indigo-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'gold-token',
            name: 'Gold-Backed Token',
            symbol: 'GBT',
            type: 'hybrid',
            tags: ['Gold-Backed', 'Digital'],
            isVerified: true,
            marketCap: 1000000000,
            liquidity: 70,
            volatility: 20,
            performance: 7,
          },
          {
            id: 'convertible',
            name: 'Convertible Bond',
            symbol: 'CBOND',
            type: 'hybrid',
            tags: ['Debt', 'Equity Option'],
            isVerified: true,
            marketCap: 0,
            liquidity: 65,
            volatility: 25,
            performance: 9,
          },
        ],
      },
      {
        id: 'crypto',
        name: 'Cryptocurrencies (Validated)',
        description: 'Vetted digital currencies operating on blockchain technology',
        icon: <FontAwesomeIcon icon={faBitcoin} className="text-orange-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'btc',
            name: 'Bitcoin',
            symbol: 'BTC',
            type: 'crypto',
            tags: ['Store of Value', 'Decentralized'],
            isVerified: true,
            marketCap: 800000000000,
            liquidity: 95,
            volatility: 60,
            performance: 20,
          },
          {
            id: 'eth',
            name: 'Ethereum',
            symbol: 'ETH',
            type: 'crypto',
            tags: ['Smart Contract', 'DeFi'],
            isVerified: true,
            marketCap: 300000000000,
            liquidity: 90,
            volatility: 70,
            performance: 15,
          },
          {
            id: 'usdt',
            name: 'Tether',
            symbol: 'USDT',
            type: 'stablecoin',
            tags: ['Stablecoin', 'USD-Pegged'],
            isVerified: true,
            marketCap: 80000000000,
            liquidity: 99,
            volatility: 2,
            performance: 0,
          },
        ],
      },
      {
        id: 'collateralized',
        name: 'Collateralized Assets',
        description: 'Financial instruments supported by underlying collateral',
        icon: <FontAwesomeIcon icon={faShieldAlt} className="text-red-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'cdos',
            name: 'Collateralized Debt Obligation',
            symbol: 'CDO',
            type: 'collateralized',
            tags: ['Structured Product', 'Debt-Backed'],
            isVerified: true,
            marketCap: 0,
            liquidity: 60,
            volatility: 35,
            performance: 7,
          },
          {
            id: 'tokenized-re',
            name: 'Tokenized Real Estate',
            symbol: 'TRE',
            type: 'collateralized',
            tags: ['Real Estate', 'Fractional'],
            isVerified: true,
            marketCap: 5000000000,
            liquidity: 50,
            volatility: 20,
            performance: 12,
          },
        ],
      },
      {
        id: 'licensing',
        name: 'Licensing, Leasing, and Intellectual Property-Based Assets',
        description: 'Contracts granting rights to use assets or IP',
        icon: <FontAwesomeIcon icon={faCopyright} className="text-teal-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'music-rights',
            name: 'Music Royalty Fund',
            symbol: 'MRF',
            type: 'ip-based',
            tags: ['Royalties', 'IP-Backed'],
            isVerified: true,
            marketCap: 2000000000,
            liquidity: 45,
            volatility: 15,
            performance: 10,
          },
          {
            id: 'equipment-lease',
            name: 'Equipment Leasing Trust',
            symbol: 'ELT',
            type: 'leasing',
            tags: ['Leasing Contracts', 'Equipment-Backed'],
            isVerified: true,
            marketCap: 1500000000,
            liquidity: 40,
            volatility: 18,
            performance: 8,
          },
        ],
      },
      {
        id: 'derivatives',
        name: 'Secondary Market and Derivatives',
        description: 'Financial products derived from other assets or indexes',
        icon: <FontAwesomeIcon icon={faFileAlt} className="text-gray-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'sp500-futures',
            name: 'S&P 500 Futures',
            symbol: 'ES',
            type: 'futures',
            tags: ['Derivative', 'Index'],
            isVerified: true,
            marketCap: 0,
            liquidity: 92,
            volatility: 25,
            performance: 9,
          },
          {
            id: 'options',
            name: 'Options Contracts',
            symbol: 'OPT',
            type: 'options',
            tags: ['Derivative', 'Leverage'],
            isVerified: true,
            marketCap: 0,
            liquidity: 85,
            volatility: 50,
            performance: 12,
          },
        ],
      },
      {
        id: 'ai-pools',
        name: 'AI-Driven Staking Pools and Managed Portfolios',
        description: 'Automated funds that dynamically allocate assets to optimize yield and risk',
        icon: <FontAwesomeIcon icon={faCogs} className="text-cyan-500" />,
        isExpanded: false,
        assets: [
          {
            id: 'stable-yield',
            name: 'Stable Yield AI Pool',
            symbol: 'SYAI',
            type: 'ai-pool',
            tags: ['AI-Managed', 'Low Risk'],
            isVerified: true,
            marketCap: 3000000000,
            liquidity: 80,
            volatility: 10,
            performance: 7,
          },
          {
            id: 'growth-portfolio',
            name: 'Growth AI Portfolio',
            symbol: 'GAPI',
            type: 'ai-pool',
            tags: ['AI-Managed', 'Growth'],
            isVerified: true,
            marketCap: 2500000000,
            liquidity: 75,
            volatility: 30,
            performance: 15,
          },
        ],
      },
    ];

    setCategories(mockData);
    setIsLoading(false);
  }, []);

  const toggleCategoryExpand = (categoryId: string) => {
    setCategories(
      categories.map(category =>
        category.id === categoryId ? { ...category, isExpanded: !category.isExpanded } : category
      )
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const toggleVerifiedFilter = () => {
    setShowOnlyVerified(!showOnlyVerified);
  };

  const filteredCategories = categories.map(category => {
    const filteredAssets = category.assets.filter(asset => {
      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Tag filters
      const matchesTags =
        activeFilters.length === 0 ||
        activeFilters.some(filter => asset.tags.includes(filter) || asset.type === filter);

      // Verified filter
      const matchesVerified = !showOnlyVerified || asset.isVerified;

      return matchesSearch && matchesTags && matchesVerified;
    });

    // Sort assets
    const sortedAssets = [...filteredAssets].sort((a, b) => {
      if (sortOption === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'liquidity') {
        return (b.liquidity || 0) - (a.liquidity || 0);
      } else if (sortOption === 'volatility') {
        return (a.volatility || 0) - (b.volatility || 0);
      } else if (sortOption === 'performance') {
        return (b.performance || 0) - (a.performance || 0);
      } else {
        // marketCap
        return (b.marketCap || 0) - (a.marketCap || 0);
      }
    });

    return {
      ...category,
      assets: sortedAssets,
    };
  });

  const allTags = Array.from(
    new Set(
      categories.flatMap(category => category.assets.flatMap(asset => [...asset.tags, asset.type]))
    )
  );

  const renderVerificationBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        Unverified
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">UniCurrency Asset Classes</h1>

      {/* Search, Filter, and Sort Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search assets, symbols, or tags..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="marketCap">Sort by Market Cap</option>
              <option value="name">Sort by Name</option>
              <option value="liquidity">Sort by Liquidity</option>
              <option value="volatility">Sort by Volatility</option>
              <option value="performance">Sort by Performance</option>
            </select>

            <button
              type="button"
              onClick={toggleVerifiedFilter}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                showOnlyVerified
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700'
              }`}
            >
              Verified Only
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center text-sm text-gray-600">
            <FontAwesomeIcon icon={faFilter} className="mr-1" />
            <span>Filters:</span>
          </div>

          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleFilter(tag)}
              className={`inline-flex items-center px-2.5 py-1.5 border text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                activeFilters.includes(tag)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}

          {activeFilters.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilters([])}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Categories and Assets List */}
      <div className="space-y-6">
        {filteredCategories.map(category => (
          <div key={category.id} className="border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => toggleCategoryExpand(category.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{category.icon}</span>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                {category.assets.length > 0 && (
                  <span className="text-sm text-gray-500">({category.assets.length})</span>
                )}
              </div>

              <div className="flex items-center">
                <div className="group relative mr-2">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  />
                  <div className="absolute right-0 w-64 bg-white p-2 rounded shadow-lg text-sm text-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
                    {category.description}
                  </div>
                </div>
                {category.isExpanded ? (
                  <FontAwesomeIcon icon={faChevronUp} />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} />
                )}
              </div>
            </button>

            {category.isExpanded && category.assets.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Asset
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Symbol
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tags
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Metrics
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {category.assets.map(asset => (
                      <tr key={asset.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{asset.symbol}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{asset.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {asset.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <div>
                                Liquidity:{' '}
                                <span className="font-medium">{asset.liquidity || 0}/100</span>
                              </div>
                              <div>
                                Volatility:{' '}
                                <span className="font-medium">{asset.volatility || 0}/100</span>
                              </div>
                              <div>
                                Performance:{' '}
                                <span
                                  className={`font-medium ${(asset.performance || 0) > 0 ? 'text-green-600' : (asset.performance || 0) < 0 ? 'text-red-600' : ''}`}
                                >
                                  {(asset.performance || 0) > 0 ? '+' : ''}
                                  {asset.performance || 0}%
                                </span>
                              </div>
                              {(asset.marketCap || 0) > 0 && (
                                <div>
                                  Mkt Cap:{' '}
                                  <span className="font-medium">
                                    ${((asset.marketCap || 0) / 1_000_000_000).toFixed(1)}B
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderVerificationBadge(asset.isVerified)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {category.isExpanded && category.assets.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No assets match your current filters in this category.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendations Section */}
      <div className="mt-8 border border-blue-200 bg-blue-50 rounded-md p-4">
        <h2 className="text-lg font-medium text-blue-800 mb-2 flex items-center">
          <FontAwesomeIcon icon={faCogs} className="mr-2" />
          AI Portfolio Recommendations
        </h2>
        <p className="text-sm text-blue-600 mb-3">
          Based on current market conditions and your browsing history, our AI suggests the
          following allocations:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
            <h3 className="font-medium text-gray-800">Low Risk</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>Government Bonds: 40%</li>
              <li>Stable Fiat: 30%</li>
              <li>Verified Stablecoins: 20%</li>
              <li>IP-Backed Securities: 10%</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
            <h3 className="font-medium text-gray-800">Balanced</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>Blue-chip Equities: 30%</li>
              <li>Government Bonds: 25%</li>
              <li>Commodities: 20%</li>
              <li>Validated Crypto: 15%</li>
              <li>Leasing Contracts: 10%</li>
            </ul>
          </div>
          <div className="bg-white p-3 rounded shadow-sm border border-blue-100">
            <h3 className="font-medium text-gray-800">Growth</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>Tech Equities: 35%</li>
              <li>Validated Crypto: 25%</li>
              <li>Tokenized Real Estate: 15%</li>
              <li>IP Royalty Funds: 15%</li>
              <li>Commodity-Backed Tokens: 10%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniCurrency;
