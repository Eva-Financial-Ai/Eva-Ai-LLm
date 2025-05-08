import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';
import ShieldVaultCore from './ShieldVaultCore';

// Loading state component
const VaultLoadingFallback = () => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-primary-600 px-6 py-4">
      <h2 className="text-white font-medium text-xl flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Shield Document Escrow Vault
      </h2>
    </div>
    <div className="p-6 flex justify-center items-center h-64">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading Shield Vault...</p>
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyVault = () => (
  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
    <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
    <p className="text-gray-500">There are no documents in the Shield Vault for this transaction.</p>
  </div>
);

// Error component
const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
    <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Something Went Wrong</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    <button 
      onClick={onRetry}
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm"
    >
      Try Again
    </button>
  </div>
);

// Props interface
interface ShieldVaultLoaderProps {
  documents: FileItem[];
  transactionId: string;
  transactionStatus: 'draft' | 'in_progress' | 'funded' | 'completed';
  userType: 'lender' | 'broker' | 'borrower' | 'vendor';
  collateralType?: string;
  requestType?: string;
  instrumentType?: string;
  onUpdateDocuments: (updatedDocuments: FileItem[]) => void;
}

/**
 * ShieldVaultLoader Component
 * 
 * This is a simplified loader that directly renders the ShieldVaultCore component
 * after validating inputs and handling loading states.
 */
const ShieldVaultLoader: React.FC<ShieldVaultLoaderProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Simulate loading for a brief period to avoid jarring UI changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle retry attempt
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Simulate a reload process
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Input validation
  if (!props.documents || !Array.isArray(props.documents)) {
    return <EmptyVault />;
  }
  
  if (props.documents.length === 0) {
    return <EmptyVault />;
  }
  
  if (!props.transactionId) {
    return (
      <ErrorDisplay 
        message="Missing transaction ID" 
        onRetry={handleRetry} 
      />
    );
  }

  // Handle loading state
  if (isLoading) {
    return <VaultLoadingFallback />;
  }
  
  // Handle error state
  if (hasError) {
    return (
      <ErrorDisplay
        message="Failed to load the Shield Vault"
        onRetry={handleRetry}
      />
    );
  }

  // Render the actual component
  try {
    return <ShieldVaultCore {...props} />;
  } catch (error) {
    console.error("Error rendering Shield Vault:", error);
    setHasError(true);
    return (
      <ErrorDisplay
        message="An error occurred while rendering the Shield Vault"
        onRetry={handleRetry}
      />
    );
  }
};

export default ShieldVaultLoader; 