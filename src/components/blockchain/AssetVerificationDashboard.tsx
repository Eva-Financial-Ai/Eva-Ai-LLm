import React, { useState, useEffect } from 'react';

export interface Asset {
  id: string;
  name: string;
  type: string;
  value: number;
  verificationStatus: 'unverified' | 'in_progress' | 'verified';
  verificationStep?: number;
  verificationProgress?: number;
  dateCreated: string;
  dateVerified?: string;
}

interface AssetVerificationDashboardProps {
  assets: Asset[];
  onSelectAsset: (asset: Asset) => void;
  className?: string;
}

const AssetVerificationDashboard: React.FC<AssetVerificationDashboardProps> = ({ 
  assets,
  onSelectAsset,
  className = ''
}) => {
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<'all' | 'unverified' | 'in_progress' | 'verified'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter assets based on verification status and search term
  useEffect(() => {
    let result = [...assets];
    
    // Apply verification status filter
    if (filter !== 'all') {
      result = result.filter(asset => asset.verificationStatus === filter);
    }
    
    // Apply search term filter if one exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        asset => 
          asset.name.toLowerCase().includes(term) || 
          asset.type.toLowerCase().includes(term)
      );
    }
    
    setFilteredAssets(result);
  }, [assets, filter, searchTerm]);

  // Format currency with dollar sign and commas
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get status badge for verification status
  const getStatusBadge = (status: Asset['verificationStatus'], step?: number) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="mr-1 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
            </svg>
            Verified
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="mr-1 h-3 w-3 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Step {step || '?'} of 6
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unverified
          </span>
        );
    }
  };

  // Calculate verification progress
  const getVerificationProgress = (asset: Asset) => {
    if (asset.verificationStatus === 'verified') return 100;
    if (asset.verificationStatus === 'unverified') return 0;
    
    // If we have a specific progress value, use that
    if (asset.verificationProgress !== undefined) return asset.verificationProgress;
    
    // Otherwise, calculate based on verification step
    if (asset.verificationStep) {
      return Math.round((asset.verificationStep / 6) * 100);
    }
    
    return 0;
  };

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Asset Verification Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track the Shield 44 Protocol verification process for all your assets
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'unverified' ? 'bg-gray-200 text-gray-800' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('unverified')}
            >
              Unverified
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('in_progress')}
            >
              In Progress
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${filter === 'verified' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
              onClick={() => setFilter('verified')}
            >
              Verified
            </button>
          </div>
          
          <div className="relative md:w-64">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search assets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Asset Grid */}
      <div className="p-6">
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => {
              const progress = getVerificationProgress(asset);
              
              return (
                <div 
                  key={asset.id}
                  className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                  onClick={() => onSelectAsset(asset)}
                >
                  {/* Shield Badge Icon for verified assets */}
                  {asset.verificationStatus === 'verified' && (
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{asset.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 capitalize">{asset.type}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">{formatCurrency(asset.value)}</p>
                    
                    <div className="mt-3">
                      {getStatusBadge(asset.verificationStatus, asset.verificationStep)}
                    </div>
                    
                    {/* Progress bar */}
                    {asset.verificationStatus !== 'unverified' && (
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${asset.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {asset.verificationStatus === 'verified' 
                              ? 'Completed' 
                              : asset.verificationStatus === 'in_progress' 
                                ? `Step ${asset.verificationStep || '?'} of 6` 
                                : 'Not started'}
                          </p>
                          <p className="text-xs text-gray-500">{progress}%</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Created: {new Date(asset.dateCreated).toLocaleDateString()}</span>
                        {asset.dateVerified && (
                          <span>Verified: {new Date(asset.dateVerified).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== 'all' 
                ? `No ${filter} assets match your search criteria.` 
                : "You haven't created any assets yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetVerificationDashboard; 