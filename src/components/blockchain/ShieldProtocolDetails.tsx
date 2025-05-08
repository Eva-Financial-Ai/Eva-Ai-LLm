import React from 'react';

interface ShieldVerification {
  id: string;
  type: 'proof_of_cash' | 'proof_of_debt' | 'proof_of_asset' | 'proof_of_license';
  status: 'pending' | 'in_progress' | 'verified' | 'failed';
  verifiedAt?: string;
  verifiedBy?: string;
  details: Record<string, any>;
}

interface ShieldProtocolDetailsProps {
  verifications: {
    proofOfCash: ShieldVerification;
    proofOfDebt: ShieldVerification;
    proofOfAsset?: ShieldVerification;
    proofOfLicense: ShieldVerification;
  };
  blockchainRecordId?: string;
}

const ShieldProtocolDetails: React.FC<ShieldProtocolDetailsProps> = ({ 
  verifications, 
  blockchainRecordId 
}) => {
  // Helper function to render verification status badge
  const renderStatusBadge = (status: string) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'verified' ? 'bg-green-100 text-green-800' :
        status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
        status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">44 Shield Authentication Protocol</h3>
          {blockchainRecordId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Verified On-Chain
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Immutable verification records for transaction integrity
        </p>
      </div>
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proof of Cash */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900">1. Proof of Cash</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Verification of funds availability and source
                </p>
              </div>
              {renderStatusBadge(verifications.proofOfCash.status)}
            </div>
            
            <div className="mt-3 text-xs">
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Plaid verification for source of funds
                </span>
              </div>
              
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  KYC from authorized employee/manager
                </span>
              </div>
              
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  One-time password authorization for release
                </span>
              </div>
              
              {verifications.proofOfCash.verifiedBy && (
                <div className="mt-2 text-gray-500">
                  Verified by: {verifications.proofOfCash.verifiedBy}
                </div>
              )}
            </div>
          </div>
          
          {/* Proof of Debt */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900">2. Proof of Debt</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Verification of debt recipient details
                </p>
              </div>
              {renderStatusBadge(verifications.proofOfDebt.status)}
            </div>
            
            <div className="mt-3 text-xs">
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  KYC verification of borrower identity
                </span>
              </div>
              
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  KYB business verification (if applicable)
                </span>
              </div>
              
              {verifications.proofOfDebt.details.debtType && (
                <div className="flex items-start mb-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Debt Type: {verifications.proofOfDebt.details.debtType.replace('_', ' ')}
                  </span>
                </div>
              )}
              
              {verifications.proofOfDebt.verifiedBy && (
                <div className="mt-2 text-gray-500">
                  Verified by: {verifications.proofOfDebt.verifiedBy}
                </div>
              )}
            </div>
          </div>
          
          {/* Proof of Asset (if applicable) */}
          {verifications.proofOfAsset && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">3. Proof of Asset</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Verification of asset and lien status
                  </p>
                </div>
                {renderStatusBadge(verifications.proofOfAsset.status)}
              </div>
              
              <div className="mt-3 text-xs">
                <div className="flex items-start mb-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Ownership verification
                  </span>
                </div>
                
                <div className="flex items-start mb-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    Lien-free certification
                  </span>
                </div>
                
                {verifications.proofOfAsset.details.assetValue && (
                  <div className="flex items-start mb-1">
                    <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Asset Value: ${verifications.proofOfAsset.details.assetValue.toLocaleString()}
                    </span>
                  </div>
                )}
                
                {verifications.proofOfAsset.verifiedBy && (
                  <div className="mt-2 text-gray-500">
                    Verified by: {verifications.proofOfAsset.verifiedBy}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Proof of License */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-sm font-medium text-gray-900">4. Proof of License</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Verification of broker/originator credentials
                </p>
              </div>
              {renderStatusBadge(verifications.proofOfLicense.status)}
            </div>
            
            <div className="mt-3 text-xs">
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  KYC identity verification
                </span>
              </div>
              
              <div className="flex items-start mb-1">
                <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  KYB business verification
                </span>
              </div>
              
              {verifications.proofOfLicense.details.licenseNumber && (
                <div className="flex items-start mb-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    License: {verifications.proofOfLicense.details.licenseNumber}
                  </span>
                </div>
              )}
              
              {verifications.proofOfLicense.verifiedBy && (
                <div className="mt-2 text-gray-500">
                  Verified by: {verifications.proofOfLicense.verifiedBy}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {blockchainRecordId && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-sm font-medium">Blockchain Verification</p>
                <p className="text-xs text-gray-500">Record ID: {blockchainRecordId}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShieldProtocolDetails; 