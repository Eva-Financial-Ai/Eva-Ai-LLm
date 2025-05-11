import React, { useState, useEffect, useContext } from 'react';
import { Owner } from './OwnerComponent';
import OwnerComponent from './OwnerComponent';
import { UserContext } from '../contexts/UserContext';

interface OwnerManagerProps {
  initialOwners: Owner[];
  onChange: (owners: Owner[]) => void;
  includeCredit?: boolean;
  requireMobile?: boolean;
}

const OwnerManager: React.FC<OwnerManagerProps> = ({
  initialOwners,
  onChange,
  includeCredit = false,
  requireMobile = false,
}) => {
  const [owners, setOwners] = useState<Owner[]>(initialOwners);
  const [showAddOwnerModal, setShowAddOwnerModal] = useState(false);
  const [totalOwnership, setTotalOwnership] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [newOwnerType, setNewOwnerType] = useState<'individual' | 'business' | 'trust'>(
    'individual'
  );
  const [activeOwnerIndex, setActiveOwnerIndex] = useState(0);
  const { userRole } = useContext(UserContext);

  const isBrokerView = userRole === 'broker' || userRole === 'lender';

  // Calculate total ownership percentage
  useEffect(() => {
    const total = owners.reduce((sum, owner) => {
      return sum + (parseFloat(owner.ownershipPercentage) || 0);
    }, 0);

    const shares = owners.reduce((sum, owner) => {
      return sum + (parseInt(owner.shares || '0') || 0);
    }, 0);

    setTotalOwnership(total);
    setTotalShares(shares);
  }, [owners]);

  // Update parent component when owners change
  useEffect(() => {
    onChange(owners);
  }, [owners, onChange]);

  // Handle owner update
  const handleOwnerChange = (updatedOwner: Owner) => {
    setOwners(prevOwners =>
      prevOwners.map(owner => (owner.id === updatedOwner.id ? updatedOwner : owner))
    );
  };

  // Handle owner deletion
  const handleOwnerDelete = (ownerId: string) => {
    setOwners(prevOwners => prevOwners.filter(owner => owner.id !== ownerId));
    if (activeOwnerIndex >= owners.length - 1) {
      setActiveOwnerIndex(Math.max(0, owners.length - 2));
    }
  };

  // Add a new owner
  const addOwner = () => {
    console.log('addOwner function called with type:', newOwnerType);

    try {
      // Check if adding another owner would make sense based on current ownership
      if (totalOwnership >= 100) {
        alert('Total ownership already equals or exceeds 100%. Please adjust existing ownership percentages before adding another owner.');
        return;
      }

      // Calculate suggested ownership percentage based on what's remaining
      const suggestedOwnership = totalOwnership < 100 
        ? Math.min(20, 100 - totalOwnership) 
        : 0;
      
      // Create a new owner object with better defaults
      const newOwner: Owner = {
        id: `owner-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: newOwnerType,
        name: '',
        ownershipPercentage: suggestedOwnership.toString(),
        files: [],
        shares: '0',
        totalShares: '0',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        mobile: '',
        businessPhone: '',
        email: '',
        isComplete: false,
        notificationSent: false,

        // Initialize type-specific fields based on owner type
        ...(newOwnerType === 'business'
          ? {
              businessEin: '',
              businessFormationDate: '',
              businessFormationState: '',
              primaryContactName: '',
              primaryContactTitle: '',
              primaryContactEmail: '',
              primaryContactPhone: '',
            }
          : newOwnerType === 'trust'
            ? {
                trustEin: '',
                trustFormationDate: '',
                trustState: '',
                trusteeNames: [],
              }
            : {
                ssn: '',
                dateOfBirth: '',
                title: '',
              }),
      };

      console.log('Created new owner object:', newOwner);

      const newOwners = [...owners, newOwner];
      setOwners(newOwners);
      setActiveOwnerIndex(newOwners.length - 1);
      setShowAddOwnerModal(false);

      console.log('Owner added successfully, new owner count:', newOwners.length);
    } catch (error) {
      console.error('Error adding owner:', error);
      alert('An error occurred while adding the owner. Please try again.');
    }
  };

  // Get type label for owner type
  const getOwnerTypeLabel = (type: 'individual' | 'business' | 'trust'): string => {
    switch (type) {
      case 'individual':
        return 'Person';
      case 'business':
        return 'Business';
      case 'trust':
        return 'Trust';
      default:
        return type;
    }
  };

  // Get color classes for owner type
  const getOwnerTypeClasses = (type: 'individual' | 'business' | 'trust'): string => {
    switch (type) {
      case 'individual':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'business':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'trust':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Check if owner has required fields filled out
  const isOwnerComplete = (owner: Owner): boolean => {
    // Common required fields for all owner types
    const hasCommonFields = 
      owner.name.trim() !== '' && 
      owner.ownershipPercentage.trim() !== '' && 
      owner.address.trim() !== '' && 
      owner.city.trim() !== '' && 
      owner.state.trim() !== '' && 
      owner.zip.trim() !== '' && 
      owner.phone.trim() !== '' && 
      owner.email.trim() !== '';
      
    // Check type-specific required fields
    if (owner.type === 'individual') {
      return hasCommonFields && 
        !!owner.ssn && 
        owner.ssn.trim().length >= 9 && 
        !!owner.dateOfBirth;
    } else if (owner.type === 'business') {
      return hasCommonFields && 
        !!owner.businessEin && 
        owner.businessEin.trim().length >= 9 && 
        !!owner.primaryContactName && 
        !!owner.primaryContactEmail;
    } else if (owner.type === 'trust') {
      return hasCommonFields && 
        !!owner.trustEin && 
        owner.trustEin.trim().length >= 9 && 
        !!owner.trustFormationDate && 
        !!owner.trustState;
    }
    
    return false;
  };
  
  // Update owner complete status
  const updateOwnerCompleteStatus = (ownerId: string) => {
    const owner = owners.find(o => o.id === ownerId);
    if (!owner) return;
    
    const isComplete = isOwnerComplete(owner);
    if (owner.isComplete !== isComplete) {
      handleOwnerChange({
        ...owner,
        isComplete
      });
    }
  };
  
  // Run completeness check on active owner
  useEffect(() => {
    if (owners.length > 0 && activeOwnerIndex >= 0 && activeOwnerIndex < owners.length) {
      updateOwnerCompleteStatus(owners[activeOwnerIndex].id);
    }
  }, [owners, activeOwnerIndex]);

  // Modal for adding a new owner
  const AddOwnerModal = () => {
    if (!showAddOwnerModal) return null;
    
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const handleOwnerTypeChange = (type: 'individual' | 'business' | 'trust') => {
      setNewOwnerType(type);
    };
    
    const validateAndSubmit = () => {
      setHasAttemptedSubmit(true);
      const errors: string[] = [];
      
      // Validate based on current total ownership
      if (totalOwnership >= 100) {
        errors.push("Total ownership already at 100%. Please adjust existing owner percentages first.");
      }
      
      if (errors.length === 0) {
        console.log('Adding owner with type:', newOwnerType);
        addOwner();
        setHasAttemptedSubmit(false);
        setFormErrors([]);
      } else {
        setFormErrors(errors);
      }
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 md:mx-auto">
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Add Additional Owner</h3>
              <button 
                onClick={() => {
                  setShowAddOwnerModal(false);
                  setHasAttemptedSubmit(false);
                  setFormErrors([]);
                }}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Modal body */}
          <div className="px-6 py-4">
            {/* Validation errors */}
            {hasAttemptedSubmit && formErrors.length > 0 && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Please correct the following:</h3>
                    <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                      {formErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Adding an additional owner is necessary for businesses with multiple owners.
              Each owner with 20% or more ownership must be included in the application.
            </p>

            <div className="bg-blue-50 rounded-md p-4 mb-6 flex">
              <div className="flex-shrink-0 text-blue-500">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Each additional owner will need to provide their personal information for the application.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Type
              </label>
              
              <div className="space-y-3">
                {/* Individual option */}
                <label 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    newOwnerType === 'individual' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="ownerType"
                    value="individual"
                    checked={newOwnerType === 'individual'}
                    onChange={() => handleOwnerTypeChange('individual')}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Individual (Person)</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Natural person who owns part of the business. Requires personal identification and contact information.
                    </p>
                  </div>
                </label>
                
                {/* Business option */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    newOwnerType === 'business'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="ownerType"
                    value="business"
                    checked={newOwnerType === 'business'}
                    onChange={() => handleOwnerTypeChange('business')}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Business Entity</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Company, LLC, or corporation that owns part of the business. Requires EIN and primary contact.
                    </p>
                  </div>
                </label>
                
                {/* Trust option */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    newOwnerType === 'trust'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="ownerType"
                    value="trust"
                    checked={newOwnerType === 'trust'}
                    onChange={() => handleOwnerTypeChange('trust')}
                    className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Trust</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Legal entity that holds assets for beneficiaries. Will require personal guarantor information from trustees for credit approval.
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            {totalOwnership >= 100 && (
              <div className="bg-yellow-50 p-4 mb-4 flex">
                <div className="flex-shrink-0 text-yellow-400">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Total ownership already at {totalOwnership}%. You may need to redistribute ownership percentages to add another owner.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal footer */}
          <div className="border-t border-gray-200 flex items-center justify-end p-4 space-x-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => {
                setShowAddOwnerModal(false);
                setHasAttemptedSubmit(false);
                setFormErrors([]);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
              onClick={validateAndSubmit}
            >
              Add Owner
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Owner navigation tabs */}
      {owners.length > 0 && (
        <div className="mb-4 border-b border-light-border">
          <nav className="flex flex-wrap -mb-px" aria-label="Owner navigation">
            {owners.map((owner, index) => (
              <button
                key={owner.id}
                onClick={() => setActiveOwnerIndex(index)}
                className={`mr-2 py-2 px-3 text-sm font-medium border-b-2 focus:outline-none whitespace-nowrap flex items-center ${
                  activeOwnerIndex === index
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-light-text-secondary hover:text-light-text hover:border-light-border'
                }`}
                aria-current={activeOwnerIndex === index ? 'page' : undefined}
                title={`${owner.type === 'individual' ? 'Individual' : owner.type === 'business' ? 'Business Entity' : 'Trust'} Owner${index === 0 ? ' (Primary)' : ''}`}
              >
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs ${getOwnerTypeClasses(owner.type)}`}
                >
                  {owner.type.charAt(0).toUpperCase()}
                </span>
                <span className="truncate max-w-[100px] md:max-w-xs">
                  {owner.name || (index === 0 ? 'Primary Owner' : `Owner ${index + 1}`)}
                </span>
                <span className="ml-1.5 text-xs text-light-text-secondary">
                  {owner.ownershipPercentage}%
                </span>
                {/* Completion status indicator */}
                {owner.isComplete ? (
                  <span className="ml-2 text-green-500" title="Complete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                ) : (
                  <span className="ml-2 text-yellow-500" title="Incomplete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Active owner component */}
      {owners.length > 0 && (
        <OwnerComponent
          owner={owners[activeOwnerIndex]}
          onChange={handleOwnerChange}
          onDelete={owners.length > 1 && activeOwnerIndex > 0 ? handleOwnerDelete : () => {}}
          isMainOwner={activeOwnerIndex === 0}
          isBrokerView={isBrokerView}
          includeCredit={includeCredit}
          requireMobile={requireMobile}
        />
      )}

      {/* Ownership summary */}
      <div className="flex flex-col mb-6 p-4 rounded-lg border bg-white shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Ownership Summary</h3>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Total Ownership</span>
            <span 
              className={`text-sm font-medium ${
                totalOwnership > 100 
                  ? 'text-red-600' 
                  : totalOwnership === 100 
                    ? 'text-green-600' 
                    : totalOwnership >= 95 
                      ? 'text-yellow-600' 
                      : 'text-gray-600'
              }`}
            >
              {totalOwnership}%
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                totalOwnership > 100 
                  ? 'bg-red-500' 
                  : totalOwnership === 100 
                    ? 'bg-green-500' 
                    : totalOwnership >= 95 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(totalOwnership, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Status message */}
        {totalOwnership > 100 && (
          <div className="p-3 bg-red-50 border border-red-100 rounded text-sm text-red-800 mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p>Total ownership exceeds 100%. Please adjust ownership percentages to total exactly 100%.</p>
              </div>
            </div>
          </div>
        )}
        
        {totalOwnership === 100 && (
          <div className="p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800 mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p>Perfect! Ownership distribution equals exactly 100%.</p>
              </div>
            </div>
          </div>
        )}
        
        {totalOwnership < 100 && totalOwnership > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800 mb-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p>
                  <span className="font-medium">{100 - totalOwnership}%</span> of ownership remains to be allocated.
                  {totalOwnership < 80 && (
                    <span className="block mt-1">
                      All owners with 20% or more ownership must be included for compliance.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">
              {owners.length} {owners.length === 1 ? 'owner' : 'owners'} added
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAddOwnerModal(true)}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="h-4 w-4 mr-1.5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Owner
          </button>
        </div>
      </div>

      {/* Owner type guide */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-light-text-secondary mb-2">Owner Types Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-white rounded border border-light-border">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs bg-primary-100 text-primary-800 border border-primary-200">
                I
              </span>
              <span className="font-medium">Individual</span>
            </div>
            <p className="text-xs text-light-text-secondary">
              A natural person who owns part of the business. Requires personal identification and
              contact information.
            </p>
          </div>

          <div className="p-3 bg-white rounded border border-light-border">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs bg-blue-100 text-blue-800 border border-blue-200">
                B
              </span>
              <span className="font-medium">Business</span>
            </div>
            <p className="text-xs text-light-text-secondary">
              A company, corporation, or LLC that owns part of the business. Requires EIN and
              primary contact information.
            </p>
          </div>

          <div className="p-3 bg-white rounded border border-light-border">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                T
              </span>
              <span className="font-medium">Trust</span>
            </div>
            <p className="text-xs text-light-text-secondary">
              A legal entity that holds assets. Will require personal guarantor information from
              trustees for credit approval.
            </p>
          </div>
        </div>
      </div>

      {/* Render modal */}
      <AddOwnerModal />
    </div>
  );
};

export default OwnerManager;
