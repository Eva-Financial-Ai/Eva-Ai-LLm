import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export interface TrackedAsset {
  id: string;
  name: string;
  type: string;
  value: number;
  datePressed: string;
  verificationStatus: 'pending' | 'in_progress' | 'verified' | 'rejected';
  blockchainNetwork?: string;
  verificationStep?: number;
  estimatedCompletionTime?: string;
  ownerName?: string;
}

interface AssetTrackingDashboardProps {
  assets: TrackedAsset[];
  onVerifyAsset?: (assetId: string) => void;
  onViewAssetDetails?: (assetId: string) => void;
}

const AssetTrackingDashboard: React.FC<AssetTrackingDashboardProps> = ({ 
  assets, 
  onVerifyAsset,
  onViewAssetDetails
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter assets based on verification status and search term
  const filteredAssets = assets.filter(asset => {
    const matchesFilter = filterStatus === 'all' || asset.verificationStatus === filterStatus;
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Sort assets by date (newest first) and then by verification status
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    // Sort by date (newest first)
    return new Date(b.datePressed).getTime() - new Date(a.datePressed).getTime();
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Pending Verification
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="mr-1.5 h-2 w-2 text-blue-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Verification In Progress
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Verification Failed
          </span>
        );
      default:
        return null;
    }
  };
  
  const getVerificationProgress = (asset: TrackedAsset) => {
    if (asset.verificationStatus !== 'in_progress' || !asset.verificationStep) {
      return null;
    }
    
    // Assuming 6 steps in verification process
    const totalSteps = 6;
    const progress = (asset.verificationStep / totalSteps) * 100;
    
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs">
          <span>Step {asset.verificationStep} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Asset Verification Dashboard</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Track and verify your pressed assets. Assets must be verified before they can be used.
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {sortedAssets.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try changing your search or filter criteria' 
              : 'Press a new asset to get started with verification'}
          </p>
          <div className="mt-6">
            <Link 
              to="/asset-press" 
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Press New Asset
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Pressed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center text-white font-bold">
                        {asset.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-primary-600" onClick={() => onViewAssetDetails?.(asset.id)}>
                          {asset.name}
                        </div>
                        {asset.ownerName && (
                          <div className="text-xs text-gray-500">
                            Owned by: {asset.ownerName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{asset.type.replace('_', ' ')}</div>
                    {asset.blockchainNetwork && (
                      <div className="text-xs text-gray-500">
                        Network: {asset.blockchainNetwork}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${asset.value.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(asset.datePressed).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(asset.datePressed).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {getStatusBadge(asset.verificationStatus)}
                      {getVerificationProgress(asset)}
                      {asset.estimatedCompletionTime && asset.verificationStatus === 'in_progress' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Est. completion: {asset.estimatedCompletionTime}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewAssetDetails?.(asset.id)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      View
                    </button>
                    {asset.verificationStatus === 'pending' && (
                      <button
                        onClick={() => onVerifyAsset?.(asset.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Start Verification
                      </button>
                    )}
                    {asset.verificationStatus === 'verified' && (
                      <span className="text-green-600">
                        <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetTrackingDashboard; 