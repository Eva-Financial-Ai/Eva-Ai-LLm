import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DocumentVerificationSystem from './DocumentVerificationSystem';
import useTransactionStore from '../hooks/useTransactionStore';
import { Transition } from '@headlessui/react';

// Define NavigateFunction type similar to react-router's
type NavigateFunction = (to: string, options?: any) => void;

// Import or define the UserData interface to match DocumentVerificationSystem
interface UserData {
  applicantType: 'individual' | 'business';
  businessName?: string;
  businessType?: string;
  taxId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  annualRevenue?: string;
  annualIncome?: string;
  yearsInBusiness?: string;
  creditScore?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  loanAmount?: string;
  loanPurpose?: string;
  loanTerm?: string;
  collateral?: string;
  hasESignature?: boolean;
  signatureDate?: string;
  agreeToTerms?: boolean;
}

interface DocumentVerificationWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  transactionId?: string;
  onVerificationComplete?: (result: { success: boolean; documentId?: string }) => void;
  initialError?: string | null;
  redirectOnSuccess?: boolean;
  navigate?: NavigateFunction;
}

/**
 * Enhanced DocumentVerificationWrapper component
 * 
 * This wrapper component handles:
 * 1. Transaction context
 * 2. Error states
 * 3. Loading states
 * 4. Success redirection
 * 5. Proper cleanup on unmount
 */
const DocumentVerificationWrapper: React.FC<DocumentVerificationWrapperProps> = ({
  isOpen,
  onClose,
  documentId,
  transactionId: initialTransactionId,
  onVerificationComplete,
  initialError,
  redirectOnSuccess = false,
  navigate
}) => {
  const location = useLocation();
  const { currentTransaction, loading: transactionLoading, error: transactionError } = useTransactionStore();
  
  const [error, setError] = useState<string | null>(initialError || null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionId, setTransactionId] = useState<string | null>(initialTransactionId || null);
  const [userData, setUserData] = useState<UserData>({
    applicantType: 'business',
    businessName: 'Acme LLC',
    taxId: '12-3456789',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@acme.com',
    phone: '(555) 123-4567',
    streetAddress: '123 Business Ave',
    city: 'Enterprise',
    state: 'CA',
    zipCode: '94105',
    annualRevenue: '$2,500,000',
    yearsInBusiness: '5',
    loanAmount: '$250,000',
    loanPurpose: 'Equipment financing'
  });
  
  // Determine if we should use a document ID from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const docIdFromParams = params.get('documentId');
    
    if (docIdFromParams) {
      setTransactionId(docIdFromParams);
    }
  }, [location.search]);
  
  // Set up transaction ID and handle loading states
  useEffect(() => {
    setIsLoading(true);
    
    // Priority order for transaction ID:
    // 1. Explicitly provided documentId prop
    // 2. URL parameter
    // 3. Current transaction from context
    // 4. Fallback ID
    
    if (documentId) {
      setTransactionId(documentId);
      setIsLoading(false);
    } else if (transactionId) {
      // We already have a transaction ID from URL params
      setIsLoading(false);
    } else if (currentTransaction?.id) {
      setTransactionId(currentTransaction.id);
      setIsLoading(false);
    } else if (transactionLoading) {
      // Wait for transaction to load
      setIsLoading(true);
    } else {
      // No transaction found, use fallback
      setTransactionId("DOC-FALLBACK");
      setIsLoading(false);
      
      // Only show error if transaction loading has completed
      if (!transactionLoading && !documentId) {
        setError("No active transaction found. Document verification may have limited functionality.");
      }
    }
    
    // Handle transaction errors
    if (transactionError && !documentId) {
      setError(`Error loading transaction: ${transactionError.message}`);
    }
  }, [currentTransaction, documentId, transactionId, transactionLoading, transactionError]);
  
  // Custom close handler to clean up URL params if needed
  const handleClose = () => {
    // Remove URL parameters when closing
    if (navigate && (location.search && location.search.includes('documentId') || location.search.includes('doc=verification'))) {
      navigate(location.pathname, { replace: true });
    }
    
    // Call the parent onClose handler
    onClose();
  };
  
  // Handle verification completion - could redirect to another page
  const handleVerificationComplete = (result: { success: boolean; documentId?: string }) => {
    if (result.success && redirectOnSuccess && navigate) {
      // Example: redirect to transaction details or confirmation page
      navigate(`/transactions/details/${result.documentId || transactionId}`);
    }
    
    // Close the verification window
    handleClose();
  };
  
  const handleUserDataChange = (newData: any) => {
    setUserData(newData);
  };
  
  if (!isOpen) return null;
  
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
            <p className="text-center mt-4">Loading document verification...</p>
          </div>
        </div>
      ) : (
        <DocumentVerificationSystem
          isOpen={isOpen}
          onClose={handleClose}
          documentId={documentId || transactionId || "DOC-FALLBACK"}
          userData={userData}
          onUserDataChange={handleUserDataChange}
          onVerificationComplete={handleVerificationComplete}
          initialError={error}
        />
      )}
    </Transition>
  );
};

export default DocumentVerificationWrapper; 