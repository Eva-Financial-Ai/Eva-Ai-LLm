import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AssetClassification, {
  AssetClassType,
  ASSET_CLASSES,
} from '../components/blockchain/AssetClassification';
import BlockchainVerification, {
  BlockchainVerificationStatus,
} from '../components/blockchain/BlockchainVerification';
import TopNavigation from '../components/layout/TopNavigation';
import PressNewAssetModal from '../components/blockchain/PressNewAssetModal';
import { AssetClass } from '../types/AssetClassTypes';
import AssetTrackingDashboard, {
  TrackedAsset,
} from '../components/blockchain/AssetTrackingDashboard';

// Extend BlockchainVerificationStatus to include missing properties
interface ExtendedBlockchainVerificationStatus extends BlockchainVerificationStatus {
  verificationProgress?: {
    currentStep?: number;
    totalSteps?: number;
    estimatedCompletionTime?: string;
  };
}

// Define asset interface
interface Asset {
  id: string;
  name: string;
  type: AssetClassType;
  description: string;
  value: number;
  createdAt: string;
  blockchainStatus?: 'unverified' | 'pending' | 'verified';
  blockchainVerification?: ExtendedBlockchainVerificationStatus;
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
  const [activeTab, setActiveTab] = useState<'press' | 'manage' | 'verify'>('press');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [trackedAssets, setTrackedAssets] = useState<TrackedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [showPressModal, setShowPressModal] = useState(false);
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    type: 'real_estate',
    class: 'real_estate',
    description: '',
    value: 0,
    documents: [],
    metadata: {},
    ownership: [
      {
        owner: 'Your Company LLC',
        percentage: 100,
        since: new Date().toISOString().split('T')[0],
      },
    ],
    financialData: {
      marketValue: 0,
      originalPrice: 0,
      depreciationRate: 0,
      yield: 0,
      forecastingScore: 50,
    },
    regulatory: {
      taxTreatment: 'standard',
      complianceStatus: 'pending-review',
      complianceChecks: [],
    },
    lienStatus: {
      hasLien: false,
    },
    tracking: {
      liquidityRating: 5,
      riskAssessment: 'medium',
      utilizationRate: 0,
    },
    advancedFeatures: {
      blockchainVerified: false,
      aiPredictions: [],
    },
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
            occupancyRate: 95,
          },
          ownership: [
            {
              owner: 'Smith Holdings LLC',
              percentage: 100,
              since: '2020-03-15',
            },
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
              verificationTime: '42 seconds',
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
                to: '2020-03-15',
              },
            ],
            lienStatus: {
              hasLien: false,
            },
            verificationProgress: {
              currentStep: 6,
              totalSteps: 6,
              estimatedCompletionTime: 'Completed',
            },
          },
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
            condition: 'Excellent',
          },
          ownership: [
            {
              owner: 'Advanced Manufacturing Co',
              percentage: 100,
              since: '2021-08-10',
            },
          ],
          lienStatus: {
            hasLien: true,
            lienHolder: 'First Equipment Finance',
            lienAmount: 425000,
            lienDate: '2021-08-10',
            uccFilingNumber: 'UCC-21-78563-A',
          },
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
            faceValue: 1000000,
          },
          ownership: [
            {
              owner: 'Retirement Fund LLC',
              percentage: 100,
              since: '2023-05-15',
            },
          ],
        },
      ];

      setAssets(mockAssets);
      setLoading(false);
    }, 1500);
  }, []);

  // Fetch initial assets when component mounts
  useEffect(() => {
    // Simulate API call to fetch assets
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Convert assets to tracked assets for the tracking dashboard
    const convertedAssets: TrackedAsset[] = assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      value: asset.value,
      datePressed: asset.createdAt,
      verificationStatus: mapBlockchainStatus(asset.blockchainStatus),
      blockchainNetwork: asset.blockchainVerification?.network || 'polygon',
      verificationStep: asset.blockchainVerification?.verificationProgress?.currentStep,
      estimatedCompletionTime:
        asset.blockchainVerification?.verificationProgress?.estimatedCompletionTime,
      ownerName: asset.ownership[0]?.owner,
    }));

    setTrackedAssets(convertedAssets);
  }, [assets]);

  // Filter assets based on search term
  const filteredAssets = assets.filter(
    asset =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to map blockchainStatus to TrackedAsset verificationStatus
  const mapBlockchainStatus = (
    status?: 'unverified' | 'pending' | 'verified'
  ): 'pending' | 'in_progress' | 'verified' | 'rejected' => {
    switch (status) {
      case 'verified':
        return 'verified';
      case 'pending':
        return 'in_progress';
      case 'unverified':
        return 'pending';
      default:
        return 'pending';
    }
  };

  // Handle asset class selection
  const handleAssetClassSelect = (assetClass: AssetClassType) => {
    setSelectedAssetClass(assetClass);
    setNewAsset({
      ...newAsset,
      type: assetClass,
      metadata: {},
    });
  };

  // Handle blockchain verification
  const handleVerifyAsset = async (asset: Asset): Promise<ExtendedBlockchainVerificationStatus> => {
    // Simulate blockchain verification
    return new Promise(resolve => {
      setTimeout(() => {
        const verification: ExtendedBlockchainVerificationStatus = {
          isVerified: true,
          transactionHash:
            '0x' +
            Array(64)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join(''),
          blockNumber: Math.floor(Math.random() * 10000000) + 10000000,
          timestamp: new Date().toISOString(),
          network: 'ethereum',
          proofOfWork: {
            difficulty: Math.floor(Math.random() * 10) + 15,
            nonce:
              '0x' +
              Array(20)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join(''),
            hashRate: Math.floor(Math.random() * 500) + 100 + ' MH/s',
            verificationTime: Math.floor(Math.random() * 60) + 20 + ' seconds',
          },
          ownershipHistory: [
            {
              owner: asset.ownership[0].owner,
              stake: asset.ownership[0].percentage,
              from: asset.ownership[0].since,
            },
          ],
          lienStatus: asset.lienStatus
            ? {
                hasLien: asset.lienStatus.hasLien,
                lienHolder: asset.lienStatus.lienHolder,
                lienAmount: asset.lienStatus.lienAmount,
                lienDate: asset.lienStatus.lienDate,
                lienExpiration: new Date(new Date().setFullYear(new Date().getFullYear() + 5))
                  .toISOString()
                  .split('T')[0],
                uccFilingNumber: asset.lienStatus.uccFilingNumber,
              }
            : {
                hasLien: false,
              },
          verificationProgress: {
            currentStep: 6,
            totalSteps: 6,
            estimatedCompletionTime: 'Completed',
          },
        };

        // Update asset with verification
        const updatedAssets = assets.map(a => {
          if (a.id === asset.id) {
            return {
              ...a,
              blockchainStatus: 'verified' as const,
              blockchainVerification: verification,
            };
          }
          return a;
        });

        setAssets(updatedAssets);
        resolve(verification);
      }, 3000);
    });
  };

  // Handle starting verification for an asset
  const handleStartVerification = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    // Update asset status to 'pending'
    const updatedAssets = [...assets]; // Create a new array
    const assetIndex = updatedAssets.findIndex(a => a.id === assetId);

    if (assetIndex !== -1) {
      updatedAssets[assetIndex] = {
        ...updatedAssets[assetIndex],
        blockchainStatus: 'pending',
      };
      setAssets(updatedAssets);

      // Start verification process (simulate with timeout)
      setTimeout(() => {
        handleVerifyAsset(asset)
          .then(verification => {
            // Update asset with verification results
            const verifiedAssets = [...assets]; // Create a new array
            const assetIndex = verifiedAssets.findIndex(a => a.id === assetId);

            if (assetIndex !== -1) {
              verifiedAssets[assetIndex] = {
                ...verifiedAssets[assetIndex],
                blockchainStatus: 'verified',
                blockchainVerification: verification,
                advancedFeatures: {
                  ...verifiedAssets[assetIndex].advancedFeatures,
                  blockchainVerified: true,
                },
              };
              setAssets(verifiedAssets);
            }
          })
          .catch(error => {
            console.error('Verification failed:', error);
            const failedAssets = [...assets]; // Create a new array
            const assetIndex = failedAssets.findIndex(a => a.id === assetId);

            if (assetIndex !== -1) {
              failedAssets[assetIndex] = {
                ...failedAssets[assetIndex],
                blockchainStatus: 'unverified', // Use valid enum value
              };
              setAssets(failedAssets);
            }
          });
      }, 1000);
    }
  };

  // Handle asset creation
  const handleCreateAsset = () => {
    if (!newAsset.name || newAsset.value === undefined || newAsset.value <= 0) {
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
          ownerID: 'USER-' + uuidv4().slice(0, 8),
        },
      ],
      financialData: {
        marketValue: newAsset.value || 0,
        originalPrice: newAsset.financialData?.originalPrice || newAsset.value || 0,
        depreciationRate:
          newAsset.financialData?.depreciationRate ||
          getDefaultDepreciationRate(newAsset.type as AssetClassType),
        depreciationMethod:
          newAsset.financialData?.depreciationMethod ||
          getDefaultDepreciationMethod(newAsset.type as AssetClassType),
        yield: newAsset.financialData?.yield || 0,
        forecastingScore: newAsset.financialData?.forecastingScore || 50,
      },
      regulatory: {
        taxTreatment: newAsset.regulatory?.taxTreatment || 'standard',
        complianceStatus: 'pending-review',
        complianceChecks: [],
      },
      lienStatus: {
        hasLien: newAsset.lienStatus?.hasLien || false,
        lienHolder: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.lienHolder : undefined,
        lienAmount: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.lienAmount : undefined,
        lienDate: newAsset.lienStatus?.hasLien ? newAsset.lienStatus.lienDate : undefined,
        uccFilingNumber: newAsset.lienStatus?.hasLien
          ? newAsset.lienStatus.uccFilingNumber
          : undefined,
      },
      tracking: {
        location: newAsset.tracking?.location || '',
        liquidityRating: newAsset.tracking?.liquidityRating || 5,
        riskAssessment: newAsset.tracking?.riskAssessment || 'medium',
        utilizationRate: newAsset.tracking?.utilizationRate || 0,
      },
      advancedFeatures: {
        blockchainVerified: false,
        aiPredictions: [],
      },
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
      ownership: [
        {
          owner: 'Your Company LLC',
          percentage: 100,
          since: new Date().toISOString().split('T')[0],
        },
      ],
      financialData: {
        marketValue: 0,
        originalPrice: 0,
        depreciationRate: 0,
        yield: 0,
        forecastingScore: 50,
      },
      regulatory: {
        taxTreatment: 'standard',
        complianceStatus: 'pending-review',
      },
      lienStatus: {
        hasLien: false,
      },
      tracking: {
        liquidityRating: 5,
        riskAssessment: 'medium',
      },
      advancedFeatures: {
        blockchainVerified: false,
      },
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
  const getDefaultDepreciationMethod = (
    assetType: AssetClassType
  ): 'straight-line' | 'declining-balance' | 'MACRS' | 'none' => {
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

  // Handler for pressing assets with the new modal
  const handlePressAsset = async (assetData: any) => {
    try {
      // Convert from the new format to the existing format
      const newPressedAsset: Asset = {
        id: 'asset-' + uuidv4().slice(0, 8),
        name: assetData.name,
        type: assetData.assetClass as AssetClassType,
        class: assetData.assetClass as AssetClassType,
        description: assetData.description || '',
        value: assetData.marketValue || 0,
        createdAt: new Date().toISOString(),
        blockchainStatus: 'pending',
        documents: assetData.documents || [],
        metadata: { ...assetData },
        ownership: [
          {
            owner: 'Your Company LLC',
            percentage: 100,
            since: new Date().toISOString().split('T')[0],
          },
        ],
        // Map other fields from assetData to the Asset structure
        financialData: {
          marketValue: assetData.marketValue || 0,
          originalPrice: assetData.originalPurchasePrice || assetData.marketValue || 0,
          depreciationRate:
            assetData.depreciationRate ||
            getDefaultDepreciationRate(assetData.assetClass as AssetClassType),
          depreciationMethod: getDefaultDepreciationMethod(assetData.assetClass as AssetClassType),
          yield: 0,
          forecastingScore: 50,
        },
        regulatory: {
          taxTreatment: 'standard',
          complianceStatus: 'pending-review',
          complianceChecks: [],
        },
        lienStatus: {
          hasLien: false,
        },
        tracking: {
          liquidityRating: 5,
          riskAssessment: 'medium',
          utilizationRate: 0,
        },
        advancedFeatures: {
          blockchainVerified: false,
          smartContractAddress: assetData.blockchainNetwork
            ? `0x${Math.random().toString(16).substring(2, 42)}`
            : undefined,
          aiPredictions: [],
        },
      };

      // Simulate blockchain pressing (tokenization) process
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Add to the assets array
      setAssets(prev => [newPressedAsset, ...prev]);

      // Simulate verification completion after 5 seconds
      setTimeout(() => {
        setAssets(prev =>
          prev.map(a =>
            a.id === newPressedAsset.id
              ? {
                  ...a,
                  blockchainStatus: 'verified',
                  advancedFeatures: {
                    ...a.advancedFeatures,
                    blockchainVerified: true,
                  },
                }
              : a
          )
        );
      }, 5000);

      return newPressedAsset;
    } catch (error) {
      console.error('Error pressing asset:', error);
      throw error;
    }
  };

  // Handle viewing asset details
  const handleViewAssetDetails = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setSelectedAsset(asset);
      // Additional logic for displaying asset details
    }
  };

  // Render tabs
  const renderPressTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Asset Press</h2>

        <button
          onClick={() => setShowPressModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Press New Asset
        </button>
      </div>

      <div className="bg-amber-50 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">Important Information</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                Assets must complete verification before they can be used in the platform. After
                pressing, you can track verification progress in the "Manage & Track" tab.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <svg
            className="animate-spin mx-auto h-8 w-8 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-sm text-gray-500">Loading assets...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by pressing your first asset.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowPressModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Press New Asset
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Value
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ownership
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Blockchain Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map(asset => {
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
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {asset.description}
                            </div>
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
                            {owner.owner}{' '}
                            <span className="text-xs text-gray-400">({owner.percentage}%)</span>
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

      {/* Press New Asset Modal */}
      {showPressModal && (
        <PressNewAssetModal
          isOpen={showPressModal}
          onClose={() => setShowPressModal(false)}
          onPress={handlePressAsset}
        />
      )}
    </div>
  );

  const renderManageTrackTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <AssetTrackingDashboard
        assets={trackedAssets}
        onVerifyAsset={handleStartVerification}
        onViewAssetDetails={handleViewAssetDetails}
      />
    </div>
  );

  const renderVerifyTab = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Verification Records</h3>
        <p className="mt-1 text-sm text-gray-500">
          View blockchain verification records for your assets.
        </p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Asset Press</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('press')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'press'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Press Assets
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage & Track
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'verify'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verification & Records
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'press' && renderPressTab()}
      {activeTab === 'manage' && renderManageTrackTab()}
      {activeTab === 'verify' && renderVerifyTab()}
    </div>
  );
};

export default EnhancedAssetPress;
