import React, { useState, useEffect } from 'react';

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
  type: string;
  description: string;
  value: number;
  documents: string[];
  lienHolders: LienHolder[];
  financialData: FinancialData;
  verificationStatus: 'unverified' | 'in_progress' | 'verified';
  blockchainTxId?: string;
  verificationStep?: number;
}

interface EnhancedAssetDetailsProps {
  asset: Asset | null;
  onClose: () => void;
  onVerify: (asset: Asset) => void;
}

// The maximum percentage allowed for validation
const MAX_PERCENTAGE = 9000;
// Maximum number of lien positions allowed
const MAX_LIEN_POSITIONS = 9;

const EnhancedAssetDetails: React.FC<EnhancedAssetDetailsProps> = ({ asset, onClose, onVerify }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationSteps, setVerificationSteps] = useState<string[]>([
    'Initializing Shield 44 Protocol',
    'Verifying asset ownership documentation',
    'Validating financial data',
    'Confirming lien positions',
    'Recording on Shield Trust Ledger',
    'Publishing verification badge'
  ]);
  const [newLienHolder, setNewLienHolder] = useState<Partial<LienHolder>>({
    name: '',
    amount: 0,
    position: 1
  });
  const [showAddLienForm, setShowAddLienForm] = useState(false);

  // Format currency with dollar sign and commas
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Validate percentage is not over MAX_PERCENTAGE
  const validatePercentage = (value: number) => {
    return value <= MAX_PERCENTAGE;
  };

  // Get next available lien position
  useEffect(() => {
    if (asset && asset.lienHolders.length > 0) {
      const maxPosition = Math.max(...asset.lienHolders.map(lien => lien.position));
      setNewLienHolder(prev => ({...prev, position: maxPosition + 1}));
    } else {
      setNewLienHolder(prev => ({...prev, position: 1}));
    }
  }, [asset, showAddLienForm]);

  // Handle the verification process
  const handleVerify = () => {
    if (!asset) return;
    
    setIsVerifying(true);
    setVerificationStep(1);
    
    // Simulate verification steps with delays
    const runVerification = async () => {
      // Step 1 is already shown immediately
      
      // Wait 1-2 seconds between steps to simulate processing
      for (let i = 2; i <= verificationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        setVerificationStep(i);
      }
      
      // Complete verification after all steps
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update asset verification status
      if (onVerify) {
        const updatedAsset = {
          ...asset,
          verificationStatus: 'verified' as const,
          verificationStep: verificationSteps.length
        };
        onVerify(updatedAsset);
      }
      
      setIsVerifying(false);
    };
    
    runVerification();
  };

  // Handle adding a new lien holder
  const handleAddLienHolder = () => {
    if (!asset || !newLienHolder.name || !newLienHolder.amount) return;
    
    const newLien: LienHolder = {
      id: `lien-${Date.now()}`,
      name: newLienHolder.name,
      amount: newLienHolder.amount,
      position: newLienHolder.position || asset.lienHolders.length + 1,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    // This would normally update through an API - here we just log it
    console.log('Adding new lien holder:', newLien);
    
    // Reset form
    setNewLienHolder({
      name: '',
      amount: 0,
      position: (asset.lienHolders.length + 2) <= MAX_LIEN_POSITIONS ? asset.lienHolders.length + 2 : MAX_LIEN_POSITIONS
    });
    setShowAddLienForm(false);
  };

  // Get risk level based on number of lien holders
  const getLienRiskLevel = (count: number) => {
    if (count === 0) return { text: 'No Risk', color: 'text-green-600' };
    if (count === 1) return { text: 'Low Risk', color: 'text-blue-600' };
    if (count <= 3) return { text: 'Medium Risk', color: 'text-yellow-600' };
    if (count <= 6) return { text: 'High Risk', color: 'text-orange-600' };
    return { text: 'Very High Risk', color: 'text-red-600' };
  };

  if (!asset) return null;

  // Get lien risk for current asset
  const lienRisk = getLienRiskLevel(asset.lienHolders.length);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">Asset Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Asset Header with Shield Verification Badge */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center">
              <h4 className="text-xl font-bold text-gray-900">{asset.name}</h4>
              {asset.verificationStatus === 'verified' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="mr-1 h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                  </svg>
                  Shield Verified
                </span>
              )}
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(asset.value)}</span>
            </div>
          </div>
        </div>
        
        {/* Verification Status */}
        {asset.verificationStatus !== 'verified' && !isVerifying && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This asset is not yet verified on the Shield Trust Ledger. Verification is required to participate in the commercial paper market.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Verification Process */}
        {isVerifying && (
          <div className="mb-6 bg-blue-50 rounded-lg p-4">
            <h4 className="text-lg font-medium text-blue-900 mb-3">Shield 44 Protocol Verification</h4>
            <div className="space-y-4">
              {verificationSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex items-center ${index + 1 <= verificationStep ? 'text-blue-700' : 'text-gray-400'}`}
                >
                  <div className={`flex-shrink-0 h-5 w-5 relative ${index + 1 < verificationStep ? 'text-green-500' : index + 1 === verificationStep ? 'text-blue-500' : 'text-gray-300'}`}>
                    {index + 1 < verificationStep ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : index + 1 === verificationStep ? (
                      <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <span className="h-5 w-5 flex items-center justify-center rounded-full border-2 border-gray-300 text-xs">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <p className="ml-3 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Financial Data Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Original Purchase Price</p>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {formatCurrency(asset.financialData.originalPurchasePrice)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Market Value</p>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {formatCurrency(asset.financialData.currentMarketValue)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Yield (%)</p>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {asset.financialData.yieldRate}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Depreciation Method</p>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {asset.financialData.depreciationMethod}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Depreciation Rate (%)</p>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {asset.financialData.depreciationRate}%
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Debt</p>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {formatCurrency(asset.financialData.debtAmount)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Lien Holders Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h4 className="text-lg font-medium text-gray-900">Lien Holders</h4>
              {asset.lienHolders.length > 0 && (
                <span className={`ml-3 text-sm font-medium ${lienRisk.color}`}>
                  {lienRisk.text} ({asset.lienHolders.length}/{MAX_LIEN_POSITIONS} positions)
                </span>
              )}
            </div>
            <button
              onClick={() => setShowAddLienForm(true)}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
              disabled={asset.lienHolders.length >= MAX_LIEN_POSITIONS}
            >
              Add Lien Holder
            </button>
          </div>
          
          {asset.lienHolders.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Position</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Lien Holder</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date Added</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {asset.lienHolders.map((lien) => (
                    <tr key={lien.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{lien.position}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lien.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(lien.amount)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lien.dateAdded}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {lien.documentUrl && (
                          <a href={lien.documentUrl} className="text-blue-600 hover:text-blue-900" target="_blank" rel="noopener noreferrer">View Doc</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No lien holders registered for this asset.</p>
          )}
          
          {/* Add Lien Holder Form */}
          {showAddLienForm && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h5 className="text-md font-medium text-gray-900 mb-4">Add New Lien Holder</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="lien-name" className="block text-sm font-medium text-gray-700">Lien Holder Name</label>
                  <input
                    type="text"
                    id="lien-name"
                    value={newLienHolder.name}
                    onChange={(e) => setNewLienHolder({...newLienHolder, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="lien-amount" className="block text-sm font-medium text-gray-700">Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="lien-amount"
                      value={newLienHolder.amount || ''}
                      onChange={(e) => setNewLienHolder({...newLienHolder, amount: parseFloat(e.target.value)})}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-7 pr-12 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lien-position" className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="number"
                    id="lien-position"
                    value={newLienHolder.position || ''}
                    onChange={(e) => setNewLienHolder({...newLienHolder, position: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    min="1"
                    max={MAX_LIEN_POSITIONS}
                  />
                  <p className="mt-1 text-xs text-gray-500">Maximum {MAX_LIEN_POSITIONS} positions allowed</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddLienForm(false)}
                  className="px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddLienHolder}
                  className="px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  disabled={!newLienHolder.name || !newLienHolder.amount}
                >
                  Add Lien Holder
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Asset Description */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-500">{asset.description}</p>
        </div>
        
        {/* Documents Section */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Asset Documents</h4>
          {asset.documents.length > 0 ? (
            <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
              {asset.documents.map((doc, index) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">{doc}</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">View</a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No documents attached to this asset.</p>
          )}
        </div>
        
        {/* Tracking & Location Information */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Tracking & Location Information</h4>
          <div>
            <label htmlFor="asset-location" className="block text-sm font-medium text-gray-700">Asset Location</label>
            <input
              type="text"
              id="asset-location"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter physical location of asset"
            />
            <p className="mt-1 text-xs text-gray-500">Specify the physical address or storage location of this asset</p>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Close
          </button>
          
          {asset.verificationStatus !== 'verified' && !isVerifying && (
            <button
              onClick={handleVerify}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Start Shield 44 Verification
            </button>
          )}
          
          {asset.verificationStatus === 'verified' && (
            <button
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none flex items-center"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Enter Commercial Paper Market
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAssetDetails; 