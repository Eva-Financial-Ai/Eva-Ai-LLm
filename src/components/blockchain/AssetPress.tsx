import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EnhancedAssetDetails from './EnhancedAssetDetails';
import AssetVerificationDashboard from './AssetVerificationDashboard';

interface LienHolder {
  id: string;
  name: string;
  amount: number;
  position: number;
  dateAdded: string;
  documentUrl?: string;
}

interface FinancialData {
  originalPurchasePrice: number;
  currentMarketValue: number;
  debtAmount: number;
  yieldRate: number;
  depreciationRate: number;
  depreciationMethod: string;
}

interface Asset {
  id: string;
  name: string;
  type: 'real_estate' | 'equipment' | 'vehicle' | 'intellectual_property' | 'account_receivable' | 'inventory' | 'other';
  value: number;
  description: string;
  documents: string[];
  tokenId?: string;
  tokenizationStatus: 'pending' | 'in_progress' | 'completed' | 'failed';
  tokenizationDate?: Date;
  blockchainTxId?: string;
  blockchainNetwork: 'ethereum' | 'polygon' | 'avalanche' | 'solana' | 'hedera' | 'internal';
  metadataUri?: string;
  lienHolders: LienHolder[];
  financialData: FinancialData;
  verificationStatus: 'unverified' | 'in_progress' | 'verified';
  verificationStep?: number;
  dateCreated: string;
  dateVerified?: string;
}

interface AssetPressProps {
  userId: string;
  organizationId: string;
  onTokenizationComplete?: (asset: Asset) => void;
}

const assetTypes = [
  { id: 'real_estate', label: 'Real Estate' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'intellectual_property', label: 'Intellectual Property' },
  { id: 'account_receivable', label: 'Account Receivable' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'other', label: 'Other' }
];

const blockchainNetworks = [
  { id: 'ethereum', label: 'Ethereum', icon: '⟠', color: 'bg-purple-100 text-purple-800' },
  { id: 'polygon', label: 'Polygon', icon: '⬡', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'avalanche', label: 'Avalanche', icon: '🔺', color: 'bg-red-100 text-red-800' },
  { id: 'solana', label: 'Solana', icon: '◎', color: 'bg-teal-100 text-teal-800' },
  { id: 'hedera', label: 'Hedera', icon: 'ℏ', color: 'bg-blue-100 text-blue-800' },
  { id: 'internal', label: 'EVA Ledger (Private)', icon: '🔒', color: 'bg-gray-100 text-gray-800' },
];

const AssetPress: React.FC<AssetPressProps> = ({ userId, organizationId, onTokenizationComplete }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerificationDashboard, setShowVerificationDashboard] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    type: 'real_estate',
    value: 0,
    description: '',
    documents: [],
    tokenizationStatus: 'pending',
    blockchainNetwork: 'polygon',
    lienHolders: [],
    financialData: {
      originalPurchasePrice: 0,
      currentMarketValue: 0,
      debtAmount: 0,
      yieldRate: 0,
      depreciationRate: 2.5,
      depreciationMethod: 'MACRS'
    },
    verificationStatus: 'unverified',
    dateCreated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [networkFees, setNetworkFees] = useState<{[key: string]: number}>({
    ethereum: 0.0032,
    polygon: 0.0005,
    avalanche: 0.0008,
    solana: 0.00002,
    hedera: 0.0001,
    internal: 0,
  });
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [showRiskAdvisor, setShowRiskAdvisor] = useState(false);

  // Simulate asset loading from API
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockAssets: Asset[] = [
          {
            id: uuidv4(),
            name: 'Commercial Building - 123 Main St',
            type: 'real_estate',
            value: 1750000,
            description: 'Three-story commercial building in downtown district',
            documents: ['deed.pdf', 'appraisal.pdf', 'inspection.pdf'],
            tokenId: 'TKN-RE-78945',
            tokenizationStatus: 'completed',
            tokenizationDate: new Date('2023-11-15'),
            blockchainTxId: '0x7834f874389fa98989fdea9844893a88dea9348934893a8',
            blockchainNetwork: 'polygon',
            metadataUri: 'ipfs://Qm98374893a98d9a8sd7a9s87d9as87d9a87d9a8s7d9',
            lienHolders: [],
            financialData: {
              originalPurchasePrice: 1750000,
              currentMarketValue: 1750000,
              debtAmount: 0,
              yieldRate: 0,
              depreciationRate: 2.5,
              depreciationMethod: 'MACRS'
            },
            verificationStatus: 'verified',
            dateCreated: '2023-10-15T12:00:00Z'
          },
          {
            id: uuidv4(),
            name: 'CNC Manufacturing Equipment',
            type: 'equipment',
            value: 350000,
            description: 'Haas VF-2SS CNC Vertical Machining Center with accessories',
            documents: ['invoice.pdf', 'specs.pdf'],
            tokenizationStatus: 'pending',
            blockchainNetwork: 'ethereum',
            lienHolders: [],
            financialData: {
              originalPurchasePrice: 350000,
              currentMarketValue: 350000,
              debtAmount: 0,
              yieldRate: 0,
              depreciationRate: 2.5,
              depreciationMethod: 'MACRS'
            },
            verificationStatus: 'unverified',
            dateCreated: '2023-11-05T10:30:00Z'
          },
          {
            id: uuidv4(),
            name: 'Fleet Vehicles (5 Delivery Vans)',
            type: 'vehicle',
            value: 225000,
            description: 'Five 2022 Ford Transit delivery vans with custom storage systems',
            documents: ['titles.pdf', 'insurance.pdf'],
            tokenizationStatus: 'in_progress',
            blockchainNetwork: 'avalanche',
            lienHolders: [],
            financialData: {
              originalPurchasePrice: 225000,
              currentMarketValue: 225000,
              debtAmount: 0,
              yieldRate: 0,
              depreciationRate: 2.5,
              depreciationMethod: 'MACRS'
            },
            verificationStatus: 'in_progress',
            dateCreated: '2023-12-01T15:45:00Z'
          }
        ];
        
        setAssets(mockAssets);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setIsLoading(false);
      }
    };
    
    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewAsset = () => {
    if (!newAsset.name || !newAsset.value || newAsset.value <= 0) return;
    
    // Create a new asset with the form data
    const asset: Asset = {
      id: `asset-${Date.now().toString()}`,
      name: newAsset.name || '',
      type: newAsset.type || 'real_estate',
      value: newAsset.value || 0,
      description: newAsset.description || '',
      documents: uploadedFiles.map(file => file.name),
      tokenizationStatus: 'pending',
      blockchainNetwork: newAsset.blockchainNetwork || 'polygon',
      lienHolders: [],
      financialData: {
        originalPurchasePrice: newAsset.financialData?.originalPurchasePrice || newAsset.value || 0,
        currentMarketValue: newAsset.financialData?.currentMarketValue || newAsset.value || 0,
        debtAmount: newAsset.financialData?.debtAmount || 0,
        yieldRate: newAsset.financialData?.yieldRate || 0,
        depreciationRate: newAsset.financialData?.depreciationRate || 2.5,
        depreciationMethod: newAsset.financialData?.depreciationMethod || 'MACRS'
      },
      verificationStatus: 'unverified',
      dateCreated: new Date().toISOString()
    };
    
    // Add the asset to state
    setAssets([...assets, asset]);
    setShowTokenizeModal(false);
    
    // Reset form
    setNewAsset({
      name: '',
      type: 'real_estate',
      value: 0,
      description: '',
      documents: [],
      tokenizationStatus: 'pending',
      blockchainNetwork: 'polygon',
      lienHolders: [],
      financialData: {
        originalPurchasePrice: 0,
        currentMarketValue: 0,
        debtAmount: 0,
        yieldRate: 0,
        depreciationRate: 2.5,
        depreciationMethod: 'MACRS'
      },
      verificationStatus: 'unverified',
      dateCreated: new Date().toISOString()
    });
    setUploadedFiles([]);
    
    // Start Shield 44 Protocol verification by showing the dashboard
    setShowVerificationDashboard(true);
    
    // Auto-start verification process for the new asset
    setTimeout(() => {
      startVerification(asset);
    }, 1000);
  };
  
  // Add function to start the verification process
  const startVerification = (asset: Asset) => {
    // Update asset status to in_progress
    const updatedAssets = assets.map(a => {
      if (a.id === asset.id) {
        return {
          ...a,
          verificationStatus: 'in_progress' as const,
          verificationStep: 1
        };
      }
      return a;
    });
    
    setAssets(updatedAssets);
    
    // Simulate verification steps
    let step = 1;
    const totalSteps = 6;
    
    const interval = setInterval(() => {
      step++;
      
      if (step <= totalSteps) {
        // Update progress
        setAssets(prevAssets => prevAssets.map(a => {
          if (a.id === asset.id) {
            return {
              ...a,
              verificationStep: step
            };
          }
          return a;
        }));
      } else {
        // Verification complete
        setAssets(prevAssets => prevAssets.map(a => {
          if (a.id === asset.id) {
            return {
              ...a,
              verificationStatus: 'verified' as const,
              verificationStep: totalSteps,
              dateVerified: new Date().toISOString()
            };
          }
          return a;
        }));
        
        clearInterval(interval);
      }
    }, 2000); // Update every 2 seconds
  };
  
  // Handle asset verification from detailed view
  const handleAssetVerify = (asset: Asset) => {
    // Make sure we update the asset with complete properties 
    const updatedAsset: Asset = {
      ...asset,
      verificationStatus: 'in_progress',
      verificationStep: 1,
      // Add required properties if they're missing
      description: asset.description || '',
      documents: asset.documents || [],
      tokenizationStatus: asset.tokenizationStatus || 'pending',
      blockchainNetwork: asset.blockchainNetwork || 'internal',
      lienHolders: asset.lienHolders || [],
      dateCreated: asset.dateCreated || new Date().toISOString()
    };
    
    setAssets(prevAssets => prevAssets.map(a => 
      a.id === asset.id ? updatedAsset : a
    ));
    setSelectedAsset(updatedAsset);
    setShowVerificationDashboard(true);
  };
  
  // Handle selecting an asset from the dashboard
  const handleSelectAsset = (dashboardAsset: {
    id: string;
    name: string;
    type: string;
    value: number;
    verificationStatus: 'unverified' | 'in_progress' | 'verified';
    verificationStep?: number;
    dateCreated: string;
    dateVerified?: string;
  }) => {
    // Find the full asset from our internal assets array
    const fullAsset = assets.find(a => a.id === dashboardAsset.id);
    
    if (fullAsset) {
      setSelectedAsset(fullAsset);
    }
  };

  const handleTokenize = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsTokenizing(true);
    
    // Simulate tokenization process
    setTimeout(() => {
      const updatedAssets = assets.map(a => {
        if (a.id === asset.id) {
          const tokenizedAsset: Asset = {
            ...a,
            tokenizationStatus: 'completed' as const,
            tokenId: `TKN-${a.type.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 90000) + 10000}`,
            tokenizationDate: new Date(),
            blockchainTxId: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            metadataUri: `ipfs://Qm${Array(44).fill(0).map(() => Math.random().toString(36).substring(2, 15)).join('')}`,
            lienHolders: [],
            financialData: {
              originalPurchasePrice: a.value,
              currentMarketValue: a.value,
              debtAmount: 0,
              yieldRate: 0,
              depreciationRate: 2.5,
              depreciationMethod: 'MACRS'
            },
            verificationStatus: 'verified'
          };
          return tokenizedAsset;
        }
        return a;
      });
      
      setAssets(updatedAssets);
      setIsTokenizing(false);
      
      // Find the updated asset
      const tokenizedAsset = updatedAssets.find(a => a.id === asset.id);
      if (tokenizedAsset && onTokenizationComplete) {
        onTokenizationComplete(tokenizedAsset);
      }
      
      setShowSuccessModal(true);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setUploadedFiles([...uploadedFiles, ...files]);
      
      // Simulate file upload to blockchain storage
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  const getNetworkBadge = (network: Asset['blockchainNetwork']) => {
    const networkInfo = blockchainNetworks.find(n => n.id === network);
    if (!networkInfo) return null;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${networkInfo.color}`}>
        <span className="mr-1">{networkInfo.icon}</span>
        {networkInfo.label}
      </span>
    );
  };

  const getStatusBadge = (status: Asset['tokenizationStatus']) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return null;
    }
  };

  const handleViewDocument = (documentName: string) => {
    setViewingDocument(documentName);
  };

  // Adapter function to ensure Asset type compatibility with AssetVerificationDashboard component
  const adaptAssetsForVerificationDashboard = (assets: Asset[]) => {
    return assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      value: asset.value,
      verificationStatus: asset.verificationStatus,
      verificationStep: asset.verificationStep,
      dateCreated: asset.dateCreated,
      dateVerified: asset.dateVerified
    }));
  };

  return (
    <div className="space-y-6">
      {/* Title and top buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Asset Press</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowVerificationDashboard(!showVerificationDashboard)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {showVerificationDashboard ? 'View List' : 'View Verification Dashboard'}
          </button>
          <button
            onClick={() => setShowRiskAdvisor(!showRiskAdvisor)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="mr-1.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Risk Advisor
          </button>
          <button
            onClick={() => setShowTokenizeModal(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Create New Asset
          </button>
        </div>
      </div>

      {/* Shield Trust Ledger Introduction */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-blue-900">Shield Trust Ledger</h3>
            <p className="mt-1 text-sm text-blue-700">
              Rebuild trust in financial institutions by verifying debt, cash, assets, and lien licenses through our Shield 44 Protocol.
            </p>
            <p className="mt-2 text-sm text-blue-600">
              After verification, your assets will receive a Shield Verified Badge and can be fractionalized for participation in the commercial paper market.
            </p>
          </div>
        </div>
      </div>

      {/* Show either Verification Dashboard or Asset List */}
      {showVerificationDashboard ? (
        <AssetVerificationDashboard
          assets={adaptAssetsForVerificationDashboard(assets)}
          onSelectAsset={handleSelectAsset}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Your Assets</h3>
            <div className="relative max-w-xs">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        
          {assets.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Asset Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Verification Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Blockchain Network</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {asset.name}
                        {asset.verificationStatus === 'verified' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <svg className="mr-0.5 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                              <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 capitalize">
                        {assetTypes.find(type => type.id === asset.type)?.label || asset.type}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">${asset.value.toLocaleString()}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {asset.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Shield Verified
                          </span>
                        )}
                        {asset.verificationStatus === 'in_progress' && (
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying (Step {asset.verificationStep || '?'})
                          </span>
                        )}
                        {asset.verificationStatus === 'unverified' && (
                          <span className="inline-flex items-center">
                            <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Not Verified
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {getNetworkBadge(asset.blockchainNetwork)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {asset.verificationStatus === 'unverified' && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => startVerification(asset)}
                          >
                            Verify
                          </button>
                        )}
                        <button 
                          className="ml-4 text-primary-600 hover:text-primary-900"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
              <h3 className="text-sm font-medium text-gray-900">Loading assets...</h3>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new asset.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowTokenizeModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Asset
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* New Asset Modal */}
      {showTokenizeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Tokenize New Asset</h3>
              <button
                onClick={() => setShowTokenizeModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Asset Name</label>
                <input
                  type="text"
                  id="name"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Asset Type</label>
                <select
                  id="type"
                  value={newAsset.type}
                  onChange={(e) => setNewAsset({...newAsset, type: e.target.value as Asset['type']})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  {assetTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Asset Value with Money Format */}
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-gray-700">Asset Value (USD)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="value"
                    value={newAsset.value || ''}
                    onChange={(e) => setNewAsset({...newAsset, value: parseFloat(e.target.value), 
                      financialData: {
                        ...newAsset.financialData,
                        originalPurchasePrice: parseFloat(e.target.value),
                        currentMarketValue: parseFloat(e.target.value),
                        debtAmount: newAsset.financialData?.debtAmount || 0,
                        yieldRate: newAsset.financialData?.yieldRate || 0,
                        depreciationRate: newAsset.financialData?.depreciationRate || 2.5,
                        depreciationMethod: newAsset.financialData?.depreciationMethod || 'MACRS'
                      }
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              
              {/* Financial Data Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Financial Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {/* Original Purchase Price */}
                  <div>
                    <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Purchase Price</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="originalPrice"
                        value={newAsset.financialData?.originalPurchasePrice || ''}
                        onChange={(e) => setNewAsset({...newAsset, 
                          financialData: {
                            ...newAsset.financialData as FinancialData,
                            originalPurchasePrice: parseFloat(e.target.value)
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {/* Current Market Value */}
                  <div>
                    <label htmlFor="currentMarketValue" className="block text-sm font-medium text-gray-700">Current Market Value</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="currentMarketValue"
                        value={newAsset.financialData?.currentMarketValue || ''}
                        onChange={(e) => setNewAsset({...newAsset, 
                          financialData: {
                            ...newAsset.financialData as FinancialData,
                            currentMarketValue: parseFloat(e.target.value)
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {/* Debt Amount */}
                  <div>
                    <label htmlFor="debtAmount" className="block text-sm font-medium text-gray-700">Debt Amount</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="debtAmount"
                        value={newAsset.financialData?.debtAmount || ''}
                        onChange={(e) => setNewAsset({...newAsset, 
                          financialData: {
                            ...newAsset.financialData as FinancialData,
                            debtAmount: parseFloat(e.target.value)
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {/* Yield Rate */}
                  <div>
                    <label htmlFor="yieldRate" className="block text-sm font-medium text-gray-700">Yield Rate (%)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="yieldRate"
                        value={newAsset.financialData?.yieldRate || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          // Validate percentage doesn't exceed 9000%
                          if (value <= 9000) {
                            setNewAsset({...newAsset, 
                              financialData: {
                                ...newAsset.financialData as FinancialData,
                                yieldRate: value
                              }
                            });
                          }
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.0"
                        step="0.1"
                        max="9000"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Maximum 9000%</p>
                  </div>
                  
                  {/* Depreciation Method */}
                  <div>
                    <label htmlFor="depreciationMethod" className="block text-sm font-medium text-gray-700">Depreciation Method</label>
                    <select
                      id="depreciationMethod"
                      value={newAsset.financialData?.depreciationMethod || ''}
                      onChange={(e) => setNewAsset({...newAsset, 
                        financialData: {
                          ...newAsset.financialData as FinancialData,
                          depreciationMethod: e.target.value
                        }
                      })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="MACRS">MACRS</option>
                      <option value="Straight Line">Straight Line</option>
                      <option value="Double Declining">Double Declining</option>
                      <option value="Units of Production">Units of Production</option>
                      <option value="Sum of Years Digits">Sum of Years Digits</option>
                    </select>
                  </div>
                  
                  {/* Depreciation Rate */}
                  <div>
                    <label htmlFor="depreciationRate" className="block text-sm font-medium text-gray-700">Depreciation Rate (%)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        id="depreciationRate"
                        value={newAsset.financialData?.depreciationRate || ''}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          // Validate percentage doesn't exceed 9000%
                          if (value <= 9000) {
                            setNewAsset({...newAsset, 
                              financialData: {
                                ...newAsset.financialData as FinancialData,
                                depreciationRate: value
                              }
                            });
                          }
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0.0"
                        step="0.1"
                        max="9000"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Maximum 9000%</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label htmlFor="network" className="block text-sm font-medium text-gray-700">Blockchain Network</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {blockchainNetworks.map((network) => (
                    <div 
                      key={network.id}
                      className={`border rounded-md p-3 cursor-pointer flex items-center ${
                        newAsset.blockchainNetwork === network.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setNewAsset({...newAsset, blockchainNetwork: network.id as Asset['blockchainNetwork']})}
                    >
                      <span className="text-xl mr-2">{network.icon}</span>
                      <div>
                        <h4 className="text-sm font-medium">{network.label}</h4>
                        <p className="text-xs text-gray-500">
                          Fee: {networkFees[network.id]} {network.id === 'internal' ? 'USD' : network.id.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ownership Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="relative flex border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        id="owner-individual"
                        name="owner-type"
                        type="radio"
                        defaultChecked
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    <label htmlFor="owner-individual" className="ml-3 flex flex-col cursor-pointer">
                      <span className="block text-sm font-medium text-gray-700">Individual</span>
                      <span className="block text-xs text-gray-500">Natural person who owns part of the business</span>
                    </label>
                  </div>
                  
                  <div className="relative flex border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        id="owner-business"
                        name="owner-type"
                        type="radio"
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    <label htmlFor="owner-business" className="ml-3 flex flex-col cursor-pointer">
                      <span className="block text-sm font-medium text-gray-700">Business Entity</span>
                      <span className="block text-xs text-gray-500">Company, LLC, or corporation</span>
                    </label>
                  </div>
                  
                  <div className="relative flex border rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        id="owner-trust"
                        name="owner-type"
                        type="radio"
                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                    </div>
                    <label htmlFor="owner-trust" className="ml-3 flex flex-col cursor-pointer">
                      <span className="block text-sm font-medium text-gray-700">Trust</span>
                      <span className="block text-xs text-gray-500">Legal entity that holds assets for beneficiaries</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Asset Documents</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                        <span>Upload files</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          multiple
                          className="sr-only" 
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB each</p>
                  </div>
                </div>
                
                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
                    <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              className="font-medium text-red-600 hover:text-red-500"
                              onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {isUploading && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full w-3/4"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">75%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Uploading to decentralized storage...</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTokenizeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewAsset}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                disabled={!newAsset.name || typeof newAsset.value !== 'number' || newAsset.value <= 0}
              >
                Create Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tokenization Process Modal */}
      {isTokenizing && selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tokenizing Asset</h3>
              <p className="mt-2 text-sm text-gray-500">
                Creating a digital token for "{selectedAsset.name}" on the {blockchainNetworks.find(n => n.id === selectedAsset.blockchainNetwork)?.label} network.
              </p>
              <p className="mt-4 text-xs text-gray-500">Please do not close this window...</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedAsset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Asset Successfully Tokenized</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your asset "{selectedAsset.name}" has been successfully tokenized on the blockchain.
              </p>
              
              <div className="mt-4 bg-gray-50 rounded-md p-4 text-left">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-gray-500">Token ID:</div>
                  <div className="col-span-2 font-mono text-gray-900 truncate">
                    {assets.find(a => a.id === selectedAsset.id)?.tokenId}
                  </div>
                  
                  <div className="text-gray-500">Transaction:</div>
                  <div className="col-span-2 font-mono text-gray-900 truncate">
                    {assets.find(a => a.id === selectedAsset.id)?.blockchainTxId}
                  </div>
                  
                  <div className="text-gray-500">Created:</div>
                  <div className="col-span-2 text-gray-900">
                    {assets.find(a => a.id === selectedAsset.id)?.tokenizationDate?.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Use EnhancedAssetDetails component */}
      {selectedAsset && !isTokenizing && !showSuccessModal && (
        <EnhancedAssetDetails 
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onVerify={() => handleAssetVerify(selectedAsset)}
        />
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full h-4/5 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {viewingDocument}
              </h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden bg-gray-100 p-2">
              {viewingDocument.toLowerCase().endsWith('.pdf') ? (
                <div className="w-full h-full flex items-center justify-center">
                  <iframe 
                    src={`https://docs.google.com/viewer?embedded=true&url=https://example.com/files/${viewingDocument}`} 
                    className="w-full h-full border-0"
                    title={viewingDocument}
                  />
                </div>
              ) : viewingDocument.toLowerCase().match(/\.(jpe?g|png|gif|bmp)$/i) ? (
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <img 
                    src={`/mock-files/${viewingDocument}`} 
                    alt={viewingDocument} 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8 text-center">
                  <div>
                    <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">File Preview Unavailable</h4>
                    <p className="text-gray-500 mb-4">This file type cannot be previewed directly in the browser.</p>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                      Download File
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingDocument(null)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Risk Advisor */}
      {showRiskAdvisor && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg border-l border-gray-200 z-40 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">AI Risk Advisor</h3>
              <button 
                onClick={() => setShowRiskAdvisor(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Get intelligent insights on risk mitigation strategies
            </p>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-white shadow overflow-hidden rounded-md">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900">Risk Mitigation</span>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">Asset diversification strategy validated</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">Concentration risk detected in equipment assets</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-sm text-gray-700">Consider additional insurance coverage</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden rounded-md">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium text-gray-900">Industry Benchmarking</span>
                </div>
              </div>
              <div className="p-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none w-full justify-center"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  Run Data Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetPress; 