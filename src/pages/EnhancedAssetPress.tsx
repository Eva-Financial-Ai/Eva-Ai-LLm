import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AssetClassification, { AssetClassType, ASSET_CLASSES } from '../components/blockchain/AssetClassification';
import BlockchainVerification, { BlockchainVerificationStatus } from '../components/blockchain/BlockchainVerification';
import TopNavigation from '../components/layout/TopNavigation';

// Define asset interface
interface Asset {
  id: string;
  name: string;
  type: AssetClassType;
  description: string;
  value: number;
  createdAt: string;
  blockchainStatus?: 'unverified' | 'pending' | 'verified';
  blockchainVerification?: BlockchainVerificationStatus;
  documents: string[];
  metadata: Record<string, any>;
  
  // Identification
  assetID?: string; // Additional unique identifier conforming to Shield ID standards
  class: AssetClassType; // Already exists as 'type'
  subclass?: string; // More granular classification
  
  // Ownership structure
  ownership: {
    owner: string;
    percentage: number;
    since: string;
    organizationID?: string; // Organization identifier
    ownerID?: string; // Individual owner identifier
  }[];
  
  // Financial data
  financialData?: {
    marketValue: number; // Current market value
    originalPrice?: number; // Original acquisition price
    depreciationRate?: number; // Annual depreciation rate
    depreciationMethod?: 'straight-line' | 'declining-balance' | 'MACRS' | 'none';
    yield?: number; // Current yield percentage
    forecastingScore?: number; // AI-generated forecasting score (1-100)
  };
  
  // Regulatory & Compliance
  regulatory?: {
    taxTreatment?: string; // Tax classification
    complianceStatus?: 'compliant' | 'non-compliant' | 'pending-review';
    complianceChecks?: {
      name: string;
      status: 'passed' | 'failed' | 'pending';
      date: string;
    }[];
  };
  
  // Lien status tracking
  lienStatus?: {
    hasLien: boolean;
    lienHolder?: string;
    lienAmount?: number;
    lienDate?: string;
    uccFilingNumber?: string;
    expirationDate?: string;
    automaticRenewal?: boolean;
  };
  
  // Tracking & Utilization
  tracking?: {
    location?: string;
    gpsCoordinates?: { lat: number; lng: number };
    liquidityRating?: number; // 1-10 scale
    riskAssessment?: 'low' | 'medium' | 'high';
    maintenanceRecords?: {
      date: string;
      description: string;
      cost: number;
    }[];
    utilizationRate?: number; // Percentage of usage/capacity
  };
  
  // Blockchain & AI Features
  advancedFeatures?: {
    blockchainVerified: boolean;
    smartContractAddress?: string;
    aiPredictions?: {
      predictedValue: number;
      timeframe: string;
      confidence: number;
    }[];
    lastAiAnalysisDate?: string;
  };
}

const EnhancedAssetPress: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'tokenize' | 'manage' | 'verify'>('tokenize');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    type: 'real_estate',
    class: 'real_estate',
    description: '',
    value: 0,
    documents: [],
    metadata: {},
    ownership: [{
      owner: 'Your Company LLC',
      percentage: 100,
      since: new Date().toISOString().split('T')[0]
    }],
    financialData: {
      marketValue: 0,
      originalPrice: 0,
      depreciationRate: 0,
      yield: 0,
      forecastingScore: 50
    },
    regulatory: {
      taxTreatment: 'standard',
      complianceStatus: 'pending-review',
      complianceChecks: []
    },
    lienStatus: {
      hasLien: false
    },
    tracking: {
      liquidityRating: 5,
      riskAssessment: 'medium',
      utilizationRate: 0
    },
    advancedFeatures: {
      blockchainVerified: false,
      aiPredictions: []
    }
  });
  const [selectedAssetClass, setSelectedAssetClass] = useState<AssetClassType>('real_estate');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockAssets: Asset[] = [
        {
          id: 'asset-' + uuidv4().slice(0, 8),
          name: 'Downtown Office Building',
          type: 'real_estate',
          class: 'real_estate',
          description: 'Commercial office space in downtown financial district',
          value: 2450000,
          createdAt: new Date().toISOString(),
          blockchainStatus: 'verified',
          documents: ['deed.pdf', 'appraisal.pdf', 'inspection.pdf'],
          metadata: {
            location: '123 Financial St',
            squareFeet: 12500,
            yearBuilt: 2012,
            occupancyRate: 95
          },
          ownership: [
            {
              owner: 'Smith Holdings LLC',
              percentage: 100,
              since: '2020-03-15'
            }
          ],
          blockchainVerification: {
            isVerified: true,
            transactionHash: '0x7a65d8e0f8c059ac4c9ea931fe629c386014ff459568d9fe40f354cc810edcfa',
            blockNumber: 14582366,
            timestamp: '2023-02-18T14:32:21Z',
            network: 'ethereum',
            proofOfWork: {
              difficulty: 18,
              nonce: '0x7a65d8e0f8c059ac4c9ea',
              hashRate: '280 MH/s',
              verificationTime: '42 seconds'
            },
            ownershipHistory: [
              {
                owner: 'Smith Holdings LLC',
                stake: 100,
                from: '2020-03-15',
              },
              {
                owner: 'JMD Properties Inc',
                stake: 100,
                from: '2015-06-22',
                to: '2020-03-15'
              }
            ],
            lienStatus: {
              hasLien: false
            }
          }
        },
        {
          id: 'asset-' + uuidv4().slice(0, 8),
          name: 'Manufacturing Equipment Bundle',
          type: 'equipment',
          class: 'equipment',
          description: 'CNC machines, industrial lathes, and automated assembly equipment',
          value: 750000,
          createdAt: new Date().toISOString(),
          blockchainStatus: 'verified',
          documents: ['invoice.pdf', 'warranty.pdf', 'specs.pdf'],
          metadata: {
            manufacturer: 'Industrial Machines Inc',
            quantity: 15,
            yearManufactured: 2021,
            condition: 'Excellent'
          },
          ownership: [
            {
              owner: 'Advanced Manufacturing Co',
              percentage: 100,
              since: '2021-08-10'
            }
          ],
          lienStatus: {
            hasLien: true,
            lienHolder: 'First Equipment Finance',
            lienAmount: 425000,
            lienDate: '2021-08-10',
            uccFilingNumber: 'UCC-21-78563-A'
          }
        },
        {
          id: 'asset-' + uuidv4().slice(0, 8),
          name: 'Treasury Bond Portfolio',
          type: 'government_bonds',
          class: 'government_bonds',
          description: '10-Year Treasury Notes',
          value: 1000000,
          createdAt: new Date().toISOString(),
          blockchainStatus: 'unverified',
          documents: ['statement.pdf'],
          metadata: {
            issuer: 'U.S. Treasury',
            maturityDate: '2033-05-15',
            couponRate: 3.5,
            faceValue: 1000000
          },
          ownership: [
            {
              owner: 'Retirement Fund LLC',
              percentage: 100,
              since: '2023-05-15'
            }
          ]
        }
      ];
      
      setAssets(mockAssets);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle asset class selection
  const handleAssetClassSelect = (assetClass: AssetClassType) => {
    setSelectedAssetClass(assetClass);
    setNewAsset({
      ...newAsset,
      type: assetClass,
      metadata: {}
    });
  };
  
  // Handle blockchain verification
  const handleVerifyAsset = async (asset: Asset): Promise<BlockchainVerificationStatus> => {
    // Simulate blockchain verification
    return new Promise((resolve) => {
      setTimeout(() => {
        const verification: BlockchainVerificationStatus = {
          isVerified: true,
          transactionHash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
          blockNumber: Math.floor(Math.random() * 10000000) + 10000000,
          timestamp: new Date().toISOString(),
          network: 'ethereum',
          proofOfWork: {
            difficulty: Math.floor(Math.random() * 10) + 15,
            nonce: '0x' + Array(20).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            hashRate: Math.floor(Math.random() * 500) + 100 + ' MH/s',
            verificationTime: Math.floor(Math.random() * 60) + 20 + ' seconds'
          },
          ownershipHistory: [
            {
              owner: asset.ownership[0].owner,
              stake: asset.ownership[0].percentage,
              from: asset.ownership[0].since,
            }
          ],
          lienStatus: asset.lienStatus ? {
            hasLien: asset.lienStatus.hasLien,
            lienHolder: asset.lienStatus.lienHolder,
            lienAmount: asset.lienStatus.lienAmount,
            lienDate: asset.lienStatus.lienDate,
            lienExpiration: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
            uccFilingNumber: asset.lienStatus.uccFilingNumber
          } : {
            hasLien: false
          }
        };
        
        // Update asset with verification
        const updatedAssets = assets.map(a => {
          if (a.id === asset.id) {
            return {
              ...a,
              blockchainStatus: 'verified' as const,
              blockchainVerification: verification
            };
          }
          return a;
        });
        
        setAssets(updatedAssets);
        resolve(verification);
      }, 3000);
    });
  };
  
  // Handle asset creation
  const handleCreateAsset = () => {
    if (!newAsset.name || (newAsset.value === undefined || newAsset.value <= 0)) {
      // Handle validation error
      return;
    }
    
    const assetClass = ASSET_CLASSES.find(ac => ac.id === newAsset.type);
    
    const asset: Asset = {
      id: 'asset-' + uuidv4().slice(0, 8),
      assetID: 'SHIELD-' + Date.now().toString().slice(-6) + '-' + uuidv4().slice(0, 4),
      name: newAsset.name,
      type: newAsset.type as AssetClassType,
      class: newAsset.type as AssetClassType,
      subclass: newAsset.subclass || ASSET_CLASSES.find(ac => ac.id === newAsset.type)?.name || '',
      description: newAsset.description || '',
      value: newAsset.value || 0,
      createdAt: new Date().toISOString(),
      blockchainStatus: 'unverified',
      documents: newAsset.documents || [],
      metadata: newAsset.metadata || {},
      ownership: newAsset.ownership || [
        {
          owner: 'Your Company LLC', // This would normally come from user context
          percentage: 100,
          since: new Date().toISOString().split('T')[0],
          organizationID: 'ORG-' + uuidv4().slice(0, 8),
          ownerID: 'USER-' + uuidv4().slice(0, 8)
        }
      ],
      financialData: {
        marketValue: newAsset.value || 0,
        originalPrice: newAsset.financialData?.originalPrice || newAsset.value || 0,
        depreciationRate: newAsset.financialData?.depreciationRate || getDefaultDepreciationRate(newAsset.type as AssetClassType),
        depreciationMethod: newAsset.financialData?.depreciationMethod || getDefaultDepreciationMethod(newAsset.type as AssetClassType),
        yield: newAsset.financialData?.yield || 0,
        forecastingScore: newAsset.financialData?.forecastingScore || 50
      },
      regulatory: {
        taxTreatment: newAsset.regulatory?.taxTreatment || 'standard',
        complianceStatus: 'pending-review',
        complianceChecks: []
      },
      lienStatus: {
        hasLien: newAsset.lienStatus?.hasLien || false,
        lienHolder: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.lienHolder : undefined,
        lienAmount: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.lienAmount : undefined,
        lienDate: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.lienDate : undefined,
        uccFilingNumber: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.uccFilingNumber : undefined
      },
      tracking: {
        location: newAsset.tracking?.location || '',
        liquidityRating: newAsset.tracking?.liquidityRating || 5,
        riskAssessment: newAsset.tracking?.riskAssessment || 'medium',
        utilizationRate: newAsset.tracking?.utilizationRate || 0
      },
      advancedFeatures: {
        blockchainVerified: false,
        aiPredictions: []
      }
    };
    
    setAssets([...assets, asset]);
    setShowTokenizeModal(false);
    setNewAsset({
      name: '',
      type: 'real_estate',
      class: 'real_estate',
      description: '',
      value: 0,
      documents: [],
      metadata: {},
      ownership: [{
        owner: 'Your Company LLC',
        percentage: 100,
        since: new Date().toISOString().split('T')[0]
      }],
      financialData: {
        marketValue: 0,
        originalPrice: 0,
        depreciationRate: 0,
        yield: 0,
        forecastingScore: 50
      },
      regulatory: {
        taxTreatment: 'standard',
        complianceStatus: 'pending-review'
      },
      lienStatus: {
        hasLien: false
      },
      tracking: {
        liquidityRating: 5,
        riskAssessment: 'medium'
      },
      advancedFeatures: {
        blockchainVerified: false
      }
    });
  };
  
  // Helper function to get default depreciation rate based on asset type
  const getDefaultDepreciationRate = (assetType: AssetClassType): number => {
    switch (assetType) {
      case 'real_estate':
        return 2.5; // Approximately 2.5% for 39-year commercial property
      case 'equipment':
        return 20; // 5-year property (20% per year under MACRS)
      case 'vehicles':
        return 20; // 5-year property (20% per year under MACRS)
      case 'intellectual_property':
        return 6.67; // 15-year amortization (approx 6.67% per year)
      case 'digital_assets':
        return 33.33; // 3-year amortization (33.33% per year)
      default:
        return 0; // Most financial assets don't depreciate by default
    }
  };

  // Helper function to get default depreciation method based on asset type
  const getDefaultDepreciationMethod = (assetType: AssetClassType): 'straight-line' | 'declining-balance' | 'MACRS' | 'none' => {
    switch (assetType) {
      case 'real_estate':
        return 'straight-line';
      case 'equipment':
        return 'MACRS';
      case 'vehicles':
        return 'MACRS';
      case 'intellectual_property':
        return 'straight-line';
      case 'digital_assets':
        return 'straight-line';
      default:
        return 'none';
    }
  };
  
  // Render tabs
  const renderTokenizeTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Asset Tokenization</h2>
        <button
          onClick={() => setShowTokenizeModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md shadow hover:bg-primary-700 transition-colors"
        >
          Tokenize New Asset
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto bg-primary-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Comprehensive Asset Management Platform</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Digitize, verify, and manage your assets with blockchain-based security.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-medium">18 Asset Classes</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Structured data for every asset type from real estate to digital assets
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium">Blockchain Verification</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Proof of work consensus for immutable ownership records
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Why Tokenize Your Assets?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time asset visibility and tracking across your organization</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Tamper-proof verification of ownership history and lien status</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Simplified regulatory compliance with standardized data structures</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Streamlined Asset Management</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive 18-category asset classification system</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI-driven document analysis and data extraction</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Real-time UCC lien status tracking and monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure, private blockchain verification with Proof of Work</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={() => setShowTokenizeModal(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-md shadow hover:bg-primary-700 transition-colors"
            >
              Start Tokenizing Your Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderManageTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Manage Tokenized Assets</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search assets..."
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-500">Loading assets...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No assets found</h3>
          {searchTerm ? (
            <p className="mt-1 text-gray-500">No assets match your search criteria. Try different keywords.</p>
          ) : (
            <p className="mt-1 text-gray-500">You haven't tokenized any assets yet. Get started by creating your first asset.</p>
          )}
          {!searchTerm && (
            <button
              onClick={() => setShowTokenizeModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Tokenize Your First Asset
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ownership</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blockchain Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => {
                  const assetClass = ASSET_CLASSES.find(ac => ac.id === asset.type);
                  
                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            {assetClass?.icon}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{asset.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assetClass?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${asset.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {asset.ownership.map((owner, index) => (
                          <div key={index}>
                            {owner.owner} <span className="text-xs text-gray-400">({owner.percentage}%)</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {asset.blockchainStatus === 'verified' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : asset.blockchainStatus === 'pending' ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setActiveTab('verify');
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {asset.blockchainStatus === 'verified' ? 'View Details' : 'Verify'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderVerifyTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Asset Verification & Records</h2>
        <button
          onClick={() => setActiveTab('manage')}
          className="text-primary-600 hover:text-primary-900 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Assets
        </button>
      </div>
      
      {selectedAsset ? (
        <BlockchainVerification 
          asset={selectedAsset}
          verificationStatus={selectedAsset.blockchainVerification}
          onVerify={() => handleVerifyAsset(selectedAsset)}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Asset Selected</h3>
          <p className="mt-1 text-gray-500">Select an asset from the Manage tab to view or verify it on the blockchain.</p>
          <button
            onClick={() => setActiveTab('manage')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            View Assets
          </button>
        </div>
      )}
    </div>
  );
  
  // New asset modal
  const renderTokenizeModal = () => {
    if (!showTokenizeModal) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tokenize New Asset</h2>
            <button
              onClick={() => setShowTokenizeModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <AssetClassification
            selectedClass={selectedAssetClass}
            onSelectClass={handleAssetClassSelect}
          />
          
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asset Name
                </label>
                <input
                  type="text"
                  value={newAsset.name || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter asset name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Value (USD)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={newAsset.value || ''}
                    onChange={(e) => setNewAsset({ ...newAsset, value: parseFloat(e.target.value) })}
                    className="block w-full pl-7 pr-12 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newAsset.description || ''}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter asset description"
                  rows={3}
                />
              </div>
            </div>
            
            {/* Class-Specific Information - Enhanced to show real fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Class-Specific Information
              </h4>
              
              {/* Financial Data */}
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Financial Data</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Original Purchase Price
                    </label>
                    <input
                      type="number"
                      value={newAsset.financialData?.originalPrice || ''}
                      onChange={(e) => setNewAsset({
                        ...newAsset,
                        financialData: {
                          ...newAsset.financialData,
                          marketValue: newAsset.financialData?.marketValue || 0,
                          originalPrice: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Enter original price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Yield (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newAsset.financialData?.yield || ''}
                      onChange={(e) => setNewAsset({
                        ...newAsset,
                        financialData: {
                          ...newAsset.financialData,
                          marketValue: newAsset.financialData?.marketValue || 0,
                          yield: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Enter yield percentage"
                    />
                  </div>
                </div>
                
                {/* Show depreciation fields only for depreciable assets */}
                {(['real_estate', 'equipment', 'vehicles', 'intellectual_property', 'digital_assets'].includes(selectedAssetClass)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Depreciation Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newAsset.financialData?.depreciationRate || getDefaultDepreciationRate(selectedAssetClass)}
                        onChange={(e) => setNewAsset({
                          ...newAsset,
                          financialData: {
                            ...newAsset.financialData,
                            marketValue: newAsset.financialData?.marketValue || 0,
                            depreciationRate: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        placeholder="Enter depreciation rate"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Depreciation Method
                      </label>
                      <select
                        value={newAsset.financialData?.depreciationMethod || getDefaultDepreciationMethod(selectedAssetClass)}
                        onChange={(e) => setNewAsset({
                          ...newAsset,
                          financialData: {
                            ...newAsset.financialData,
                            marketValue: newAsset.financialData?.marketValue || 0,
                            depreciationMethod: e.target.value as 'straight-line' | 'declining-balance' | 'MACRS' | 'none'
                          }
                        })}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      >
                        <option value="straight-line">Straight Line</option>
                        <option value="declining-balance">Declining Balance</option>
                        <option value="MACRS">MACRS</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Ownership Information */}
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Ownership Information</h5>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={newAsset.ownership?.[0]?.owner || ''}
                    onChange={(e) => {
                      const updatedOwnership = [...(newAsset.ownership || [])];
                      if (updatedOwnership.length === 0) {
                        updatedOwnership.push({
                          owner: e.target.value,
                          percentage: 100,
                          since: new Date().toISOString().split('T')[0]
                        });
                      } else {
                        updatedOwnership[0] = {
                          ...updatedOwnership[0],
                          owner: e.target.value
                        };
                      }
                      setNewAsset({
                        ...newAsset,
                        ownership: updatedOwnership
                      });
                    }}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Enter owner name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ownership Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newAsset.ownership?.[0]?.percentage || 100}
                      onChange={(e) => {
                        const updatedOwnership = [...(newAsset.ownership || [])];
                        if (updatedOwnership.length === 0) {
                          updatedOwnership.push({
                            owner: 'Your Company LLC',
                            percentage: parseFloat(e.target.value) || 100,
                            since: new Date().toISOString().split('T')[0]
                          });
                        } else {
                          updatedOwnership[0] = {
                            ...updatedOwnership[0],
                            percentage: parseFloat(e.target.value) || 100
                          };
                        }
                        setNewAsset({
                          ...newAsset,
                          ownership: updatedOwnership
                        });
                      }}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                      placeholder="Enter ownership percentage"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ownership Since
                    </label>
                    <input
                      type="date"
                      value={newAsset.ownership?.[0]?.since || new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        const updatedOwnership = [...(newAsset.ownership || [])];
                        if (updatedOwnership.length === 0) {
                          updatedOwnership.push({
                            owner: 'Your Company LLC',
                            percentage: 100,
                            since: e.target.value
                          });
                        } else {
                          updatedOwnership[0] = {
                            ...updatedOwnership[0],
                            since: e.target.value
                          };
                        }
                        setNewAsset({
                          ...newAsset,
                          ownership: updatedOwnership
                        });
                      }}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Lien Status */}
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-700">Lien Information</h5>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      id="hasLien"
                      checked={newAsset.lienStatus?.hasLien || false}
                      onChange={(e) => setNewAsset({
                        ...newAsset,
                        lienStatus: {
                          ...newAsset.lienStatus,
                          hasLien: e.target.checked
                        }
                      })}
                      className="sr-only"
                    />
                    <label
                      htmlFor="hasLien"
                      className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                        newAsset.lienStatus?.hasLien ? 'bg-primary-600' : ''
                      }`}
                    >
                      <span
                        className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                          newAsset.lienStatus?.hasLien ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                {newAsset.lienStatus?.hasLien && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Lien Holder
                        </label>
                        <input
                          type="text"
                          value={newAsset.lienStatus?.lienHolder || ''}
                          onChange={(e) => setNewAsset({
                            ...newAsset,
                            lienStatus: {
                              ...newAsset.lienStatus,
                              hasLien: newAsset.lienStatus?.hasLien || false,
                              lienHolder: e.target.value
                            }
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="Enter lien holder name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Lien Amount
                        </label>
                        <input
                          type="number"
                          value={newAsset.lienStatus?.lienAmount || ''}
                          onChange={(e) => setNewAsset({
                            ...newAsset,
                            lienStatus: {
                              ...newAsset.lienStatus,
                              hasLien: newAsset.lienStatus?.hasLien || false,
                              lienAmount: parseFloat(e.target.value) || 0
                            }
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="Enter lien amount"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Lien Date
                        </label>
                        <input
                          type="date"
                          value={newAsset.lienStatus?.lienDate || ''}
                          onChange={(e) => setNewAsset({
                            ...newAsset,
                            lienStatus: {
                              ...newAsset.lienStatus,
                              hasLien: newAsset.lienStatus?.hasLien || false,
                              lienDate: e.target.value
                            }
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          UCC Filing Number
                        </label>
                        <input
                          type="text"
                          value={newAsset.lienStatus?.uccFilingNumber || ''}
                          onChange={(e) => setNewAsset({
                            ...newAsset,
                            lienStatus: {
                              ...newAsset.lienStatus,
                              hasLien: newAsset.lienStatus?.hasLien || false,
                              uccFilingNumber: e.target.value
                            }
                          })}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="Enter UCC filing number"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Regulatory Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h5 className="text-sm font-medium text-gray-700 mb-3">Regulatory Information</h5>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tax Treatment
                  </label>
                  <select
                    value={newAsset.regulatory?.taxTreatment || 'standard'}
                    onChange={(e) => setNewAsset({
                      ...newAsset,
                      regulatory: {
                        ...newAsset.regulatory,
                        taxTreatment: e.target.value
                      }
                    })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="tax-exempt">Tax Exempt</option>
                    <option value="tax-deferred">Tax Deferred</option>
                    <option value="accelerated-depreciation">Accelerated Depreciation</option>
                    <option value="capital-gains">Capital Gains</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* This would normally include class-specific fields */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Tracking & Location Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Asset Location
                  </label>
                  <input
                    type="text"
                    value={newAsset.tracking?.location || ''}
                    onChange={(e) => setNewAsset({
                      ...newAsset,
                      tracking: {
                        ...newAsset.tracking,
                        location: e.target.value
                      }
                    })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="Enter asset location"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Liquidity Rating (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={newAsset.tracking?.liquidityRating || 5}
                    onChange={(e) => setNewAsset({
                      ...newAsset,
                      tracking: {
                        ...newAsset.tracking,
                        liquidityRating: parseInt(e.target.value)
                      }
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low Liquidity</span>
                    <span>High Liquidity</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Risk Assessment
                </label>
                <div className="flex space-x-4 mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={newAsset.tracking?.riskAssessment === 'low'}
                      onChange={() => setNewAsset({
                        ...newAsset,
                        tracking: {
                          ...newAsset.tracking,
                          riskAssessment: 'low'
                        }
                      })}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Low</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={newAsset.tracking?.riskAssessment === 'medium'}
                      onChange={() => setNewAsset({
                        ...newAsset,
                        tracking: {
                          ...newAsset.tracking,
                          riskAssessment: 'medium'
                        }
                      })}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Medium</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={newAsset.tracking?.riskAssessment === 'high'}
                      onChange={() => setNewAsset({
                        ...newAsset,
                        tracking: {
                          ...newAsset.tracking,
                          riskAssessment: 'high'
                        }
                      })}
                      className="form-radio h-4 w-4 text-primary-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">High</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTokenizeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAsset}
                className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700"
                disabled={!newAsset.name || (newAsset.value === undefined || newAsset.value <= 0)}
              >
                Create Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <TopNavigation title="Asset Press" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Asset Press</h1>
        <p className="text-gray-600">Tokenize your assets on the blockchain</p>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tokenize'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('tokenize')}
          >
            Tokenize Assets
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('manage')}
          >
            Manage & Track
          </button>
          <button
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verify'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('verify')}
          >
            Verification & Records
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'tokenize' && renderTokenizeTab()}
      {activeTab === 'manage' && renderManageTab()}
      {activeTab === 'verify' && renderVerifyTab()}
      
      {/* Modals */}
      {renderTokenizeModal()}
    </div>
  );
};

export default EnhancedAssetPress; 