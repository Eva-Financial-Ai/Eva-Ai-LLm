import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Asset, AssetClass, VerificationStatus } from '../types/AssetClassTypes';
import { v4 as uuidv4 } from 'uuid';

// Asset Marketplace types
interface AssetListing {
  id: string;
  asset: Asset;
  listingDate: string;
  askingPrice: number;
  seller: string;
  description: string;
  status: 'active' | 'pending' | 'sold';
}

// Trading types
interface TradeOffer {
  id: string;
  assetId: string;
  offerAmount: number;
  offeredBy: string;
  offerDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expiryDate: string;
}

const PortfolioWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'wallet' | 'trade' | 'marketplace'>(
    location.pathname === '/asset-marketplace' ? 'marketplace' : 'wallet'
  );
  const [assets, setAssets] = useState<Asset[]>([]);
  const [marketplaceListings, setMarketplaceListings] = useState<AssetListing[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1235789.45);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'sell' | 'buy' | 'addAsset' | 'detail'>('detail');
  
  // Simulate loading the data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock assets
      const mockAssets = generateMockAssets();
      setAssets(mockAssets);
      
      // Generate mock marketplace listings
      const mockListings = generateMockListings(mockAssets);
      setMarketplaceListings(mockListings);
      
      // Generate mock trade offers
      const mockOffers = generateMockOffers(mockAssets);
      setTradeOffers(mockOffers);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Helper function to format currency
  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };
  
  // Generate mock assets (simplified for brevity)
  const generateMockAssets = (): Asset[] => {
    // For brevity, returning a simplified version with just a few assets
    return [
      {
        id: uuidv4(),
        assetID: `SHIELD-${Math.floor(Math.random() * 900000) + 100000}`,
        name: 'Balanced ETF Portfolio',
        assetClass: AssetClass.MUTUAL_FUNDS,
        assetSubclass: 'ETF',
        description: 'A balanced portfolio of ETFs tracking various market indices.',
        financialData: {
          marketValue: 4580906,
          originalValue: 4100000,
          yield: 3.2,
          depreciationRate: 0,
          forecastingScore: 85,
        },
        risk: 'Low',
        performance: 7.8,
        performanceTrend: 0.5,
        ownership: [
          {
            owner: 'You',
            percentage: 100,
            since: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(),
          },
        ],
        lienStatus: {
          hasLien: false,
        },
        trackingInfo: {
          liquidityRating: 9,
          utilizationRate: 100,
        },
        blockchainVerification: {
          status: VerificationStatus.VERIFIED,
          transactionHash: `0x${Math.random().toString(36).substring(2, 38)}`,
          verificationDate: new Date().toISOString(),
          ledgerType: 'shield_ledger',
        },
        lastUpdate: new Date().toISOString(),
        dateCreated: new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString(),
      },
      {
        id: uuidv4(),
        assetID: `SHIELD-${Math.floor(Math.random() * 900000) + 100000}`,
        name: 'Commercial Property',
        assetClass: AssetClass.REAL_ESTATE,
        assetSubclass: 'Commercial',
        description: 'A commercial property in downtown business district.',
        financialData: {
          marketValue: 3750000,
          originalValue: 3200000,
          yield: 4.5,
          depreciationRate: 2.5,
          forecastingScore: 78,
        },
        risk: 'Medium',
        performance: 6.2,
        performanceTrend: 0.3,
        ownership: [
          {
            owner: 'You',
            percentage: 100,
            since: new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString(),
          },
        ],
        lienStatus: {
          hasLien: true,
          lienHolder: 'First National Bank',
          lienAmount: 1500000,
        },
        trackingInfo: {
          liquidityRating: 5,
          utilizationRate: 80,
          location: '120 Business Ave, Chicago, IL',
        },
        blockchainVerification: {
          status: VerificationStatus.VERIFIED,
          transactionHash: `0x${Math.random().toString(36).substring(2, 38)}`,
          verificationDate: new Date().toISOString(),
          ledgerType: 'shield_ledger',
        },
        lastUpdate: new Date().toISOString(),
        dateCreated: new Date(new Date().setMonth(new Date().getMonth() - 36)).toISOString(),
      },
      {
        id: uuidv4(),
        assetID: `SHIELD-${Math.floor(Math.random() * 900000) + 100000}`,
        name: 'Crypto Holdings',
        assetClass: AssetClass.CRYPTO,
        assetSubclass: '',
        description: 'A portfolio of various cryptocurrencies including BTC, ETH, and others.',
        financialData: {
          marketValue: 850000,
          originalValue: 600000,
          yield: 0,
          depreciationRate: 0,
          forecastingScore: 65,
        },
        risk: 'High',
        performance: 25.4,
        performanceTrend: 2.1,
        ownership: [
          {
            owner: 'You',
            percentage: 100,
            since: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString(),
          },
        ],
        lienStatus: {
          hasLien: false,
        },
        trackingInfo: {
          liquidityRating: 8,
          utilizationRate: 100,
        },
        blockchainVerification: {
          status: VerificationStatus.VERIFIED,
          transactionHash: `0x${Math.random().toString(36).substring(2, 38)}`,
          verificationDate: new Date().toISOString(),
          ledgerType: 'shield_ledger',
        },
        lastUpdate: new Date().toISOString(),
        dateCreated: new Date(new Date().setMonth(new Date().getMonth() - 10)).toISOString(),
      },
    ];
  };
  
  // Generate mock marketplace listings
  const generateMockListings = (assets: Asset[]): AssetListing[] => {
    // Create a mix of listings from your assets and external assets
    const listings: AssetListing[] = [];
    
    // Add some external listings
    listings.push({
      id: uuidv4(),
      asset: {
        id: uuidv4(),
        assetID: `SHIELD-${Math.floor(Math.random() * 900000) + 100000}`,
        name: 'Corporate Bond Portfolio',
        assetClass: AssetClass.CORPORATE_BONDS,
        assetSubclass: 'Investment Grade',
        description: 'A diversified portfolio of corporate bonds from blue-chip companies.',
        financialData: {
          marketValue: 2750000,
          originalValue: 2500000,
          yield: 4.8,
          depreciationRate: 0,
          forecastingScore: 82,
        },
        risk: 'Medium',
        performance: 5.1,
        performanceTrend: 0.2,
        ownership: [
          {
            owner: 'Atlas Investments LLC',
            percentage: 100,
            since: new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString(),
          },
        ],
        lienStatus: {
          hasLien: false,
        },
        trackingInfo: {
          liquidityRating: 7,
          utilizationRate: 100,
        },
        blockchainVerification: {
          status: VerificationStatus.VERIFIED,
          transactionHash: `0x${Math.random().toString(36).substring(2, 38)}`,
          verificationDate: new Date().toISOString(),
          ledgerType: 'shield_ledger',
        },
        lastUpdate: new Date().toISOString(),
        dateCreated: new Date(new Date().setMonth(new Date().getMonth() - 24)).toISOString(),
      },
      listingDate: new Date().toISOString(),
      askingPrice: 2800000,
      seller: 'Atlas Investments LLC',
      description: 'Corporate bond portfolio with stable returns. Investment grade rating.',
      status: 'active',
    });
    
    return listings;
  };
  
  // Generate mock trade offers
  const generateMockOffers = (assets: Asset[]): TradeOffer[] => {
    // Create some mock trade offers for your assets
    const offers: TradeOffer[] = [];
    
    if (assets.length > 0) {
      // Add a pending offer for your first asset
      offers.push({
        id: uuidv4(),
        assetId: assets[0].id,
        offerAmount: assets[0].financialData.marketValue * 0.95, // 95% of value
        offeredBy: 'Pinnacle Investments',
        offerDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        status: 'pending',
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      });
    }
    
    return offers;
  };

  // Handle asset details view
  const handleViewAssetDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalType('detail');
    setShowModal(true);
  };

  // Handle selling an asset on the marketplace
  const handleSellAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setModalType('sell');
    setShowModal(true);
  };

  // Handle buying an asset from the marketplace
  const handleBuyAsset = (listing: AssetListing) => {
    setSelectedAsset(listing.asset);
    setModalType('buy');
    setShowModal(true);
  };

  // Calculate total portfolio value
  const getTotalPortfolioValue = () => {
    return assets.reduce((total, asset) => total + asset.financialData.marketValue, 0);
  };

  // Get pending offers count
  const getPendingOffersCount = () => {
    return tradeOffers.filter(offer => offer.status === 'pending').length;
  };

  // Render Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg text-gray-700">Loading Portfolio Wallet...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Wallet</h1>
      <p className="text-gray-600 mb-6">Manage, trade, and market your assets on the Shield Network</p>
      
      {/* Wallet Overview Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-blue-100">Total Portfolio Value</p>
            <h2 className="text-3xl font-bold">{formatCurrency(getTotalPortfolioValue())}</h2>
          </div>
          <div>
            <p className="text-blue-100">Cash Balance</p>
            <h2 className="text-2xl font-bold">{formatCurrency(walletBalance)}</h2>
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button 
            className="bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg text-sm font-medium"
            onClick={() => setModalType('addAsset')}
          >
            Add Asset
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 py-2 px-4 rounded-lg text-sm font-medium">
            Transfer
          </button>
          {getPendingOffersCount() > 0 && (
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center">
              <span className="mr-1">Pending Offers</span>
              <span className="bg-white text-yellow-500 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {getPendingOffersCount()}
              </span>
            </button>
          )}
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'wallet'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Assets
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'trade'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trade
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'marketplace'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Asset Marketplace
          </button>
        </nav>
      </div>
      
      {/* My Assets Tab Content */}
      {activeTab === 'wallet' && (
        <div className="grid grid-cols-1 gap-6">
          {assets.map(asset => (
            <div key={asset.id} className="bg-white rounded-lg shadow p-6 transition transform hover:shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{asset.name}</h3>
                  <p className="text-gray-500 text-sm">{asset.assetClass} • {asset.assetSubclass}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(asset.financialData.marketValue)}</p>
                  <p className={`text-sm font-medium ${(asset.performance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(asset.performance || 0) >= 0 ? '+' : ''}{(asset.performance || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="flex mt-4 pt-4 border-t border-gray-100 justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Risk:</span>{' '}
                    <span 
                      className={`${
                        asset.risk === 'Low' 
                          ? 'text-green-600' 
                          : asset.risk === 'Medium' 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                      }`}
                    >
                      {asset.risk}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Liquidity:</span> {asset.trackingInfo.liquidityRating}/10
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewAssetDetails(asset)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleSellAsset(asset)}
                    className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Sell/Trade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Trading Tab Content */}
      {activeTab === 'trade' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trading Dashboard</h2>
          
          {/* Pending Offers Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Pending Offers</h3>
            {tradeOffers.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {tradeOffers.map(offer => {
                  const asset = assets.find(a => a.id === offer.assetId);
                  if (!asset) return null;
                  
                  return (
                    <div key={offer.id} className="py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{asset.name}</p>
                          <p className="text-sm text-gray-500">
                            Offer from {offer.offeredBy} • Expires in {Math.ceil((new Date(offer.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(offer.offerAmount)}</p>
                          <p className="text-sm text-gray-500">
                            {((offer.offerAmount / asset.financialData.marketValue) * 100 - 100).toFixed(1)}% {offer.offerAmount > asset.financialData.marketValue ? 'above' : 'below'} market value
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2 justify-end">
                        <button className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-700 rounded-md">
                          Decline
                        </button>
                        <button className="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md">
                          Counter
                        </button>
                        <button className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md">
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No pending offers at this time.</p>
            )}
          </div>
          
          {/* Trade History Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Trade History</h3>
            <p className="text-gray-500 italic">No recent trades.</p>
          </div>
        </div>
      )}
      
      {/* Marketplace Tab Content */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Asset Marketplace</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {marketplaceListings.map(listing => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{listing.asset.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {listing.asset.assetClass} • Listed by {listing.seller}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">{listing.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(listing.askingPrice)}</p>
                      <p className="text-xs text-gray-500">Market Value: {formatCurrency(listing.asset.financialData.marketValue)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.asset.blockchainVerification.status === VerificationStatus.VERIFIED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {listing.asset.blockchainVerification.status === VerificationStatus.VERIFIED ? 'Verified' : 'Pending'}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Listed {new Date(listing.listingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBuyAsset(listing)}
                      className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                    >
                      Details & Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {marketplaceListings.length === 0 && (
              <p className="text-gray-500 italic text-center py-10">No listings available at this time.</p>
            )}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-2">List Your Assets</h3>
            <p className="text-blue-700 mb-4">Place your verified assets on the Shield Network marketplace.</p>
            <button 
              onClick={() => setActiveTab('wallet')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Go to My Assets
            </button>
          </div>
        </div>
      )}
      
      {/* Asset Details Modal */}
      {showModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                {modalType === 'detail' && 'Asset Details'}
                {modalType === 'sell' && 'Sell Asset'}
                {modalType === 'buy' && 'Buy Asset'}
                {modalType === 'addAsset' && 'Add New Asset'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Asset Detail View */}
              {modalType === 'detail' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Asset Name</h4>
                      <p className="text-lg font-semibold">{selectedAsset.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Asset ID</h4>
                      <p className="text-lg font-medium font-mono">{selectedAsset.assetID}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Asset Class</h4>
                      <p className="text-lg">{selectedAsset.assetClass}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Asset Value</h4>
                      <p className="text-lg font-semibold">{formatCurrency(selectedAsset.financialData.marketValue)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-700">{selectedAsset.description}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-3">Financial Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Original Value</p>
                        <p className="font-medium">{formatCurrency(selectedAsset.financialData.originalValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Yield</p>
                        <p className="font-medium">{selectedAsset.financialData.yield}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Performance</p>
                        <p className={`font-medium ${(selectedAsset.performance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(selectedAsset.performance || 0) >= 0 ? '+' : ''}{(selectedAsset.performance || 0).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Risk Rating</p>
                        <p className={`font-medium ${
                          selectedAsset.risk === 'Low' 
                            ? 'text-green-600' 
                            : selectedAsset.risk === 'Medium' 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                        }`}>
                          {selectedAsset.risk}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-blue-900 mb-3">Blockchain Verification</h4>
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedAsset.blockchainVerification.status === VerificationStatus.VERIFIED
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedAsset.blockchainVerification.status === VerificationStatus.VERIFIED ? 'Verified on Shield Ledger' : 'Verification Pending'}
                      </span>
                    </div>
                    {selectedAsset.blockchainVerification.status !== VerificationStatus.VERIFIED && (
                      <button 
                        onClick={() => {
                          // Simulate verification process
                          // Generate a mock transaction hash
                          const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
                          
                          // Update the selected asset
                          setSelectedAsset({
                            ...selectedAsset,
                            blockchainVerification: {
                              ...selectedAsset.blockchainVerification,
                              status: VerificationStatus.VERIFIED,
                              transactionHash: txHash,
                              verificationDate: new Date().toISOString()
                            }
                          });
                          
                          // Also update the asset in the assets array
                          const updatedAssets = assets.map(asset => 
                            asset.id === selectedAsset.id 
                              ? {
                                  ...asset,
                                  blockchainVerification: {
                                    ...asset.blockchainVerification,
                                    status: VerificationStatus.VERIFIED,
                                    transactionHash: txHash,
                                    verificationDate: new Date().toISOString()
                                  }
                                }
                              : asset
                          );
                          setAssets(updatedAssets);
                          
                          // Show success notification
                          alert('Asset successfully verified on Shield Ledger!');
                        }}
                        className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
                      >
                        Verify on Shield Ledger
                      </button>
                    )}
                    {selectedAsset.blockchainVerification.transactionHash && (
                      <div className="text-sm">
                        <p className="text-blue-700">Transaction Hash:</p>
                        <p className="font-mono text-blue-800 break-all">{selectedAsset.blockchainVerification.transactionHash}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3 justify-end">
                    <button 
                      onClick={() => {
                        setModalType('sell');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Sell/Trade This Asset
                    </button>
                  </div>
                </div>
              )}
              
              {/* Sell Asset View */}
              {modalType === 'sell' && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2">{selectedAsset.name}</h4>
                    <p className="text-gray-700 mb-4">{selectedAsset.description}</p>
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700">Current Market Value:</span>
                      <span className="font-semibold">{formatCurrency(selectedAsset.financialData.marketValue)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-6">
                    <h4 className="text-lg font-medium mb-4">Listing Options</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asking Price
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="text"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          defaultValue={selectedAsset.financialData.marketValue.toLocaleString()}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description for Marketplace
                      </label>
                      <textarea
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        defaultValue={selectedAsset.description}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Listing Duration
                      </label>
                      <select
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <h4 className="text-lg font-medium mb-4">Shield Network Marketplace</h4>
                    <p className="text-sm text-gray-700 mb-4">
                      By listing your asset on the Shield Network Marketplace, you agree to the Terms & Conditions.
                      A 2.5% fee will be charged on successful sales.
                    </p>
                    
                    <div className="flex space-x-3 justify-end">
                      <button 
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          setShowModal(false);
                          // Here we would submit the listing to the marketplace
                          // For demo we'll just show a success notification
                          alert('Asset listed on Shield Network marketplace!');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        List on Marketplace
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Buy Asset View */}
              {modalType === 'buy' && (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2">{selectedAsset.name}</h4>
                    <p className="text-gray-700 mb-4">{selectedAsset.description}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Asking Price:</span>
                        <span className="text-xl font-bold">
                          {formatCurrency(selectedAsset.financialData.marketValue * 1.02)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-700">Market Value:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedAsset.financialData.marketValue)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        This asset has been verified on the Shield Network blockchain ledger.
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 py-6">
                    <h4 className="text-lg font-medium mb-4">Purchase Options</h4>
                    
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <input
                          id="purchase-full"
                          name="purchase-type"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="purchase-full" className="ml-3 text-sm font-medium text-gray-700">
                          Full Purchase
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="purchase-offer"
                          name="purchase-type"
                          type="radio"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor="purchase-offer" className="ml-3 text-sm font-medium text-gray-700">
                          Make an Offer
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                      <h5 className="font-medium text-yellow-800 mb-2">Payment Method</h5>
                      <p className="text-sm text-yellow-700">
                        You will use your Shield Network wallet balance for this purchase.
                        Current balance: {formatCurrency(walletBalance)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 justify-end">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setShowModal(false);
                        // Here we would process the purchase
                        // For demo we'll just show a success notification
                        alert('Purchase successful! Asset added to your portfolio.');
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Confirm Purchase
                    </button>
                  </div>
                </div>
              )}
              
              {/* Add Asset View */}
              {modalType === 'addAsset' && (
                <div>
                  <p className="text-gray-700 mb-6">
                    Add a new asset to your Shield Network portfolio. Once added, you can verify it on the blockchain
                    for enhanced security and traceability.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Name
                      </label>
                      <input
                        type="text"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter asset name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Asset Class
                      </label>
                      <select
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select asset class</option>
                        <option value="MUTUAL_FUNDS">Mutual Funds / ETFs</option>
                        <option value="REAL_ESTATE">Real Estate</option>
                        <option value="CRYPTO">Cryptocurrency</option>
                        <option value="EQUITIES">Equities</option>
                        <option value="CORPORATE_BONDS">Corporate Bonds</option>
                        <option value="COMMODITIES">Commodities</option>
                      </select>
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
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter a description of the asset"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Level
                      </label>
                      <select
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 justify-end">
                    <button 
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setShowModal(false);
                        // Here we would add the asset
                        // For demo we'll just show a success notification
                        alert('Asset added to your portfolio!');
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Add Asset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioWalletPage; 