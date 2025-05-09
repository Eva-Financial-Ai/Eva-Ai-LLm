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
      const newOwner: Owner = {
        id: `owner-${Date.now()}`,
        type: newOwnerType,
        name: '',
        ownershipPercentage: '',
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

  // Modal for adding a new owner
  const AddOwnerModal = () => {
    if (!showAddOwnerModal) return null;

    const handleOwnerTypeChange = (type: 'individual' | 'business' | 'trust') => {
      setNewOwnerType(type);
    };

    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={() => setShowAddOwnerModal(false)}
          ></div>

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Add Additional Owner
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Adding an additional owner is necessary for businesses with multiple owners.
                      Each owner with 20% or more ownership must be included in the application.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-md mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Each additional owner will need to provide their personal information
                            for the application.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Type
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        <div
                          onClick={() => handleOwnerTypeChange('individual')}
                          className={`flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${newOwnerType === 'individual' ? 'ring-2 ring-primary-500 border-primary-500' : ''}`}
                        >
                          <div className="flex-shrink-0">
                            <input
                              type="radio"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              checked={newOwnerType === 'individual'}
                              onChange={() => {}}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">Individual (Person)</h4>
                            <p className="text-sm text-gray-500">
                              Natural person who owns part of the business. Requires personal
                              identification and contact information.
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => handleOwnerTypeChange('business')}
                          className={`flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${newOwnerType === 'business' ? 'ring-2 ring-primary-500 border-primary-500' : ''}`}
                        >
                          <div className="flex-shrink-0">
                            <input
                              type="radio"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              checked={newOwnerType === 'business'}
                              onChange={() => {}}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">Business Entity</h4>
                            <p className="text-sm text-gray-500">
                              Company, LLC, or corporation that owns part of the business. Requires
                              EIN and primary contact.
                            </p>
                          </div>
                        </div>

                        <div
                          onClick={() => handleOwnerTypeChange('trust')}
                          className={`flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${newOwnerType === 'trust' ? 'ring-2 ring-primary-500 border-primary-500' : ''}`}
                        >
                          <div className="flex-shrink-0">
                            <input
                              type="radio"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                              checked={newOwnerType === 'trust'}
                              onChange={() => {}}
                            />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">Trust</h4>
                            <p className="text-sm text-gray-500">
                              Legal entity that holds assets for beneficiaries. Will require
                              personal guarantor information from trustees for credit approval.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={e => {
                  e.preventDefault();
                  console.log('Add Owner button clicked');
                  addOwner();
                }}
              >
                Add Owner
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-light-border shadow-sm px-4 py-2 bg-white text-base font-medium text-light-text hover:bg-light-bg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowAddOwnerModal(false)}
              >
                Cancel
              </button>
            </div>
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
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="space-y-1">
          <div>
            <span className="text-sm text-light-text-secondary mr-2">Total Ownership:</span>
            <span
              className={`font-medium ${totalOwnership > 100 ? 'text-risk-red' : totalOwnership === 100 ? 'text-success-green' : 'text-light-text'}`}
            >
              {totalOwnership}%
            </span>
            {totalOwnership > 100 && (
              <span className="text-xs text-risk-red ml-2">(Cannot exceed 100%)</span>
            )}
            {totalOwnership < 100 && totalOwnership > 0 && (
              <span className="text-xs text-yellow-500 ml-2">
                ({100 - totalOwnership}% remaining)
              </span>
            )}
          </div>

          {totalShares > 0 && (
            <div>
              <span className="text-sm text-light-text-secondary mr-2">Total Shares:</span>
              <span className="font-medium text-light-text">{totalShares.toLocaleString()}</span>
            </div>
          )}
        </div>

        <button
          onClick={e => {
            e.preventDefault();
            console.log('Opening add owner modal');
            setShowAddOwnerModal(true);
          }}
          className="w-full flex items-center justify-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            className="h-5 w-5 mr-2"
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
