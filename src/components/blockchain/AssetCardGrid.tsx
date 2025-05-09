import React, { useState, useEffect } from 'react';
import {
  Asset,
  AssetClass,
  AssetClassNames,
  VerificationStatus,
  PortfolioUserRole,
} from '../../types/AssetClassTypes';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';

interface AssetCardGridProps {
  assets: Asset[];
  onSelectAsset?: (asset: Asset) => void;
  portfolioRole?: PortfolioUserRole;
  className?: string;
}

export const AssetCardGrid: React.FC<AssetCardGridProps> = ({
  assets,
  onSelectAsset,
  portfolioRole = PortfolioUserRole.OWNER,
  className = '',
}) => {
  const { userType } = useUserType();
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);
  const [selectedClass, setSelectedClass] = useState<AssetClass | 'all'>('all');
  const [verificationFilter, setVerificationFilter] = useState<VerificationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('value');
  const [showFilters, setShowFilters] = useState(false);
  const [effectiveRole, setEffectiveRole] = useState<PortfolioUserRole>(portfolioRole);

  // Map user type to portfolio role if not explicitly provided
  useEffect(() => {
    if (userType) {
      switch (userType) {
        case UserType.BUSINESS:
          setEffectiveRole(PortfolioUserRole.OWNER);
          break;
        case UserType.BROKERAGE:
          setEffectiveRole(PortfolioUserRole.MANAGER);
          break;
        case UserType.LENDER:
          setEffectiveRole(PortfolioUserRole.SERVICER);
          break;
        case UserType.VENDOR:
          setEffectiveRole(PortfolioUserRole.VENDOR);
          break;
      }
    }
  }, [userType, portfolioRole]);

  // Get unique asset classes from the data
  const uniqueAssetClasses = Array.from(new Set(assets.map(asset => asset.assetClass))).sort();

  // Apply filters and sorting
  useEffect(() => {
    let result = [...assets];

    // Apply asset class filter
    if (selectedClass !== 'all') {
      result = result.filter(asset => asset.assetClass === selectedClass);
    }

    // Apply verification status filter
    if (verificationFilter !== 'all') {
      result = result.filter(asset => asset.blockchainVerification.status === verificationFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.financialData.marketValue - a.financialData.marketValue;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'performance':
          return (b.performance || 0) - (a.performance || 0);
        case 'date':
          return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
        default:
          return 0;
      }
    });

    setFilteredAssets(result);
  }, [assets, selectedClass, verificationFilter, sortBy]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get verification status color
  const getVerificationStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return 'bg-green-100 text-green-800';
      case VerificationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case VerificationStatus.UNVERIFIED:
        return 'bg-gray-100 text-gray-800';
      case VerificationStatus.FAILED:
        return 'bg-red-100 text-red-800';
    }
  };

  // Get asset class icon based on type
  const getAssetIcon = (assetClass: AssetClass) => {
    switch (assetClass) {
      case AssetClass.CASH_EQUIVALENTS:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case AssetClass.COMMERCIAL_PAPER_SECURED:
      case AssetClass.UNSECURED_COMMERCIAL_PAPER:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case AssetClass.GOVERNMENT_BONDS:
      case AssetClass.CORPORATE_BONDS:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        );
      case AssetClass.EQUITIES:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        );
      case AssetClass.REAL_ESTATE:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case AssetClass.EQUIPMENT:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        );
      case AssetClass.CRYPTO:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
            <circle cx="10" cy="14" r="5" strokeWidth={2} />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l-2 2m0 0l-2-2m2 2V9"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>

          <div className="ml-2">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value as AssetClass | 'all')}
              className="text-sm py-1.5 pl-3 pr-8 border border-gray-200 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Asset Classes</option>
              {uniqueAssetClasses.map(assetClass => (
                <option key={assetClass} value={assetClass}>
                  {AssetClassNames[assetClass as AssetClass]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm py-1.5 pl-3 pr-8 border border-gray-200 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="value">Value: High to Low</option>
            <option value="name">Name: A to Z</option>
            <option value="performance">Performance</option>
            <option value="date">Latest Updates</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium mb-3">Verification Status</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setVerificationFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-full ${verificationFilter === 'all' ? 'bg-primary-100 text-primary-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setVerificationFilter(VerificationStatus.VERIFIED)}
              className={`px-3 py-1.5 text-xs rounded-full ${verificationFilter === VerificationStatus.VERIFIED ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
            >
              Verified
            </button>
            <button
              onClick={() => setVerificationFilter(VerificationStatus.PENDING)}
              className={`px-3 py-1.5 text-xs rounded-full ${verificationFilter === VerificationStatus.PENDING ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setVerificationFilter(VerificationStatus.UNVERIFIED)}
              className={`px-3 py-1.5 text-xs rounded-full ${verificationFilter === VerificationStatus.UNVERIFIED ? 'bg-gray-300 text-gray-800 font-medium' : 'bg-gray-100 text-gray-700'}`}
            >
              Unverified
            </button>
          </div>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <div
            key={asset.id}
            onClick={() => onSelectAsset && onSelectAsset(asset)}
            className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg ${asset.performance && asset.performance > 0 ? 'bg-green-100' : 'bg-red-100'}`}
                  >
                    {getAssetIcon(asset.assetClass)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{asset.name}</h3>
                    <p className="text-xs text-gray-500">{AssetClassNames[asset.assetClass]}</p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 text-xs rounded-full ${getVerificationStatusColor(asset.blockchainVerification.status)}`}
                >
                  {asset.blockchainVerification.status.charAt(0).toUpperCase() +
                    asset.blockchainVerification.status.slice(1)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {formatCurrency(asset.financialData.marketValue)}
                  </p>
                  {asset.performance && (
                    <div
                      className={`text-xs font-medium ${asset.performance > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {asset.performance > 0 ? '+' : ''}
                      {asset.performance.toFixed(1)}%
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Last updated</p>
                  <p className="text-xs font-medium">
                    {new Date(asset.lastUpdate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action footer */}
            {effectiveRole !== PortfolioUserRole.VENDOR && (
              <div className="flex border-t border-gray-200 divide-x divide-gray-200">
                {asset.blockchainVerification.status !== VerificationStatus.VERIFIED && (
                  <button className="flex-1 py-2 text-xs font-medium text-primary-600 hover:bg-primary-50">
                    {asset.blockchainVerification.status === VerificationStatus.PENDING
                      ? 'Check Status'
                      : 'Verify Asset'}
                  </button>
                )}
                {asset.blockchainVerification.status === VerificationStatus.VERIFIED && (
                  <button className="flex-1 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    View Details
                  </button>
                )}
                {effectiveRole === PortfolioUserRole.OWNER && (
                  <button className="flex-1 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    Manage Asset
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAssets.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or add new assets to your portfolio.
          </p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      )}
    </div>
  );
};
