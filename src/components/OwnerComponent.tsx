import React, { useState, useEffect } from 'react';

export interface Owner {
  files: never[];
  id: string;
  type: 'individual' | 'business' | 'trust';
  name: string;
  ownershipPercentage: string;
  shares?: string; // Number of shares owned
  totalShares?: string; // Total company shares
  ssn?: string;
  businessEin?: string;
  trustEin?: string;
  dateOfBirth?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  mobile: string; // Mobile contact (required for KYC)
  businessPhone?: string; // Business phone (optional)
  email: string;
  isComplete: boolean;
  notificationSent: boolean;
  creditScore?: string; // Add credit score field

  // Individual owner fields
  title?: string; // Job title/position in company

  // Business owner fields
  businessFormationDate?: string;
  businessFormationState?: string;
  primaryContactName?: string;
  primaryContactTitle?: string;
  primaryContactEmail?: string;
  primaryContactPhone?: string;

  // Trust owner fields
  trustFormationDate?: string;
  trustState?: string;
  trusteeNames?: string[];
  trustBeneficiaries?: string[];
}

interface AddressSuggestion {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

interface OwnerComponentProps {
  owner: Owner;
  onChange: (updatedOwner: Owner) => void;
  onDelete: (ownerId: string) => void;
  isMainOwner?: boolean;
  isBrokerView?: boolean;
  includeCredit?: boolean; // Whether to show credit score field
  requireMobile?: boolean; // Whether mobile is required
}

const OwnerComponent: React.FC<OwnerComponentProps> = ({
  owner,
  onChange,
  onDelete,
  isMainOwner = false,
  isBrokerView = false,
  includeCredit = false,
  requireMobile = false,
}) => {
  const [addressInput, setAddressInput] = useState(owner.address || '');
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSharesInput, setShowSharesInput] = useState(false);

  // Format SSN
  const formatSsn = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    }
  };

  // Format EIN
  const formatEin = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) {
      return digits;
    } else {
      return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
    }
  };

  // Format phone number
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle SSN formatting
    if (name === 'ssn') {
      const formattedSsn = formatSsn(value);
      onChange({ ...owner, [name]: formattedSsn });
      return;
    }

    // Handle EIN formatting
    if (name === 'businessEin' || name === 'trustEin') {
      const formattedEin = formatEin(value);
      onChange({ ...owner, [name]: formattedEin });
      return;
    }

    // Handle phone formatting
    if (name === 'phone' || name === 'mobile' || name === 'businessPhone') {
      const formattedPhone = formatPhone(value);
      onChange({ ...owner, [name]: formattedPhone });
      return;
    }

    // Handle owner type change
    if (name === 'type') {
      // Ensure the value is one of the allowed types before updating state
      const newType = value as 'individual' | 'business' | 'trust';
      if (['individual', 'business', 'trust'].includes(newType)) {
        // Clear type-specific fields when type changes
        const updatedOwner = { ...owner, type: newType };

        if (newType === 'individual') {
          delete updatedOwner.businessEin;
          delete updatedOwner.trustEin;
          delete updatedOwner.businessFormationDate;
          delete updatedOwner.businessFormationState;
          delete updatedOwner.primaryContactName;
          delete updatedOwner.primaryContactTitle;
          delete updatedOwner.primaryContactEmail;
          delete updatedOwner.primaryContactPhone;
          delete updatedOwner.trustFormationDate;
          delete updatedOwner.trustState;
          delete updatedOwner.trusteeNames;
          delete updatedOwner.trustBeneficiaries;
        } else if (newType === 'business') {
          delete updatedOwner.ssn;
          delete updatedOwner.dateOfBirth;
          delete updatedOwner.trustEin;
          delete updatedOwner.title;
          delete updatedOwner.trustFormationDate;
          delete updatedOwner.trustState;
          delete updatedOwner.trusteeNames;
          delete updatedOwner.trustBeneficiaries;
        } else if (newType === 'trust') {
          delete updatedOwner.ssn;
          delete updatedOwner.dateOfBirth;
          delete updatedOwner.businessEin;
          delete updatedOwner.title;
          delete updatedOwner.businessFormationDate;
          delete updatedOwner.businessFormationState;
          delete updatedOwner.primaryContactName;
          delete updatedOwner.primaryContactTitle;
          delete updatedOwner.primaryContactEmail;
          delete updatedOwner.primaryContactPhone;
        }

        onChange(updatedOwner);
      }
      return;
    }

    onChange({ ...owner, [name]: value });
  };

  // Search for address
  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsSearchingAddress(true);

    try {
      // In a real implementation, this would call a geocoding API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock address suggestions
      const mockSuggestions: AddressSuggestion[] = [
        {
          id: '1',
          address: `${Math.floor(Math.random() * 1000) + 100} ${query} St`,
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} St, San Francisco, CA 94103`,
        },
        {
          id: '2',
          address: `${Math.floor(Math.random() * 1000) + 100} ${query} Ave`,
          city: 'Oakland',
          state: 'CA',
          zipCode: '94612',
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} Ave, Oakland, CA 94612`,
        },
        {
          id: '3',
          address: `${Math.floor(Math.random() * 1000) + 100} ${query} Blvd`,
          city: 'San Jose',
          state: 'CA',
          zipCode: '95112',
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} Blvd, San Jose, CA 95112`,
        },
      ];

      setAddressSuggestions(mockSuggestions);
      setIsSearchingAddress(false);
    } catch (error) {
      console.error('Error searching addresses:', error);
      setIsSearchingAddress(false);
    }
  };

  // Handle address input changes
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setAddressInput(value);
    onChange({ ...owner, address: value });

    // Debounce address search
    const debounceTimer = setTimeout(() => {
      searchAddresses(value);
    }, 300);

    return () => clearTimeout(debounceTimer);
  };

  // Handle address selection
  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    onChange({
      ...owner,
      address: suggestion.address,
      city: suggestion.city,
      state: suggestion.state,
      zip: suggestion.zipCode,
    });

    setAddressInput(suggestion.address);
    setAddressSuggestions([]);
  };

  // Toggle between percentage and shares
  const toggleSharesInput = () => {
    setShowSharesInput(!showSharesInput);
  };

  // Add age validation function
  const isAtLeast18YearsOld = (dateString: string): boolean => {
    if (!dateString) return true; // If no date, don't block (we'll validate required separately)

    const birthDate = new Date(dateString);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birth month/day hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  };

  // Handle input change for date of birth to include age validation
  useEffect(() => {
    if (owner.dateOfBirth && !isAtLeast18YearsOld(owner.dateOfBirth)) {
      setErrors(prev => ({ ...prev, dateOfBirth: 'Owner must be at least 18 years old to apply' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
  }, [owner.dateOfBirth]);

  // Helper to render ID field based on owner type
  const renderIdentificationField = () => {
    if (owner.type === 'individual') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-light-text-secondary mb-1">
              Social Security Number*
              {isBrokerView && (
                <span className="text-xs font-normal ml-1 text-risk-orange-300">
                  (Optional for broker)
                </span>
              )}
            </label>
            <input
              type="text"
              name="ssn"
              value={owner.ssn || ''}
              onChange={handleInputChange}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
              required={!isBrokerView}
            />
            {errors.ssn && <p className="text-risk-red text-sm mt-1">{errors.ssn}</p>}
            <p className="text-xs text-light-text-secondary mt-1">Format: XXX-XX-XXXX</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-light-text-secondary mb-1">
              Date of Birth*
              {isBrokerView && (
                <span className="text-xs font-normal ml-1 text-risk-orange-300">
                  (Optional for broker)
                </span>
              )}
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={owner.dateOfBirth || ''}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
              required={!isBrokerView}
            />
            {errors.dateOfBirth && (
              <p className="text-risk-red text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>
        </>
      );
    } else if (owner.type === 'business') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-light-text-secondary mb-1">
            Business EIN*
            {isBrokerView && (
              <span className="text-xs font-normal ml-1 text-risk-orange-300">
                (Optional for broker)
              </span>
            )}
          </label>
          <input
            type="text"
            name="businessEin"
            value={owner.businessEin || ''}
            onChange={handleInputChange}
            placeholder="XX-XXXXXXX"
            maxLength={10}
            className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            required={!isBrokerView}
          />
          {errors.businessEin && <p className="text-risk-red text-sm mt-1">{errors.businessEin}</p>}
          <p className="text-xs text-light-text-secondary mt-1">Format: XX-XXXXXXX</p>
        </div>
      );
    } else if (owner.type === 'trust') {
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-light-text-secondary mb-1">
            Trust EIN*
            {isBrokerView && (
              <span className="text-xs font-normal ml-1 text-risk-orange-300">
                (Optional for broker)
              </span>
            )}
          </label>
          <input
            type="text"
            name="trustEin"
            value={owner.trustEin || ''}
            onChange={handleInputChange}
            placeholder="XX-XXXXXXX"
            maxLength={10}
            className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            required={!isBrokerView}
          />
          {errors.trustEin && <p className="text-risk-red text-sm mt-1">{errors.trustEin}</p>}
          <p className="text-xs text-light-text-secondary mt-1">Format: XX-XXXXXXX</p>
        </div>
      );
    }

    return null;
  };

  // Render phone fields based on owner type
  const renderPhoneFields = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-light-text-secondary mb-1">
            Mobile Phone Number* <span className="text-xs text-blue-600">(Required for KYC)</span>
          </label>
          <input
            type="tel"
            name="mobile"
            value={owner.mobile || ''}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
            className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            required={requireMobile}
          />
          {errors.mobile && <p className="text-risk-red text-sm mt-1">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text-secondary mb-1">
            Business Phone <span className="text-xs text-gray-400">(Optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={owner.phone || ''}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
            className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    );
  };

  // Render ownership fields with percentage or shares option
  const renderOwnershipFields = () => {
    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-light-text-secondary">Ownership*</label>
          <button
            type="button"
            onClick={toggleSharesInput}
            className="text-xs text-primary-600 hover:text-primary-700 focus:outline-none"
          >
            {showSharesInput ? 'Enter as percentage' : 'Enter as shares'}
          </button>
        </div>

        {showSharesInput ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-light-text-secondary mb-1">
                Number of Shares
              </label>
              <input
                type="number"
                name="shares"
                value={owner.shares || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs text-light-text-secondary mb-1">
                Total Company Shares
              </label>
              <input
                type="number"
                name="totalShares"
                value={owner.totalShares || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                min="0"
              />
              {parseInt(owner.shares || '0') > parseInt(owner.totalShares || '0') &&
                owner.totalShares &&
                parseInt(owner.totalShares) > 0 && (
                  <p className="text-risk-red text-xs mt-1">Shares cannot exceed total shares</p>
                )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="number"
              name="ownershipPercentage"
              value={owner.ownershipPercentage || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
              min="0"
              max="100"
              required
            />
            <span className="absolute right-3 top-2 text-light-text-secondary">%</span>
            {errors.ownershipPercentage && (
              <p className="text-risk-red text-sm mt-1">{errors.ownershipPercentage}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Add credit score field
  const renderCreditScore = () => {
    if (!includeCredit) return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-light-text-secondary mb-1">
          Credit Score
        </label>
        <select
          name="creditScore"
          value={owner.creditScore || ''}
          onChange={handleInputChange}
          className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select Credit Score Range</option>
          <option value="excellent">Excellent (750+)</option>
          <option value="good">Good (700-749)</option>
          <option value="fair">Fair (650-699)</option>
          <option value="poor">Poor (600-649)</option>
          <option value="bad">Bad (below 600)</option>
          <option value="unknown">I don't know</option>
        </select>
      </div>
    );
  };

  // Add individual-specific fields
  const renderIndividualFields = () => {
    if (owner.type !== 'individual') return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-light-text-secondary mb-1">
          Title/Position
        </label>
        <input
          type="text"
          name="title"
          value={owner.title || ''}
          onChange={handleInputChange}
          placeholder="e.g. CEO, CFO, Manager"
          className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    );
  };

  // Add business owner specific fields
  const renderBusinessFields = () => {
    if (owner.type !== 'business') return null;

    return (
      <>
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
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
                Business entity owners must provide a primary contact person who will serve as a
                personal guarantor for the credit application.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-1">
              Formation Date
            </label>
            <input
              type="date"
              name="businessFormationDate"
              value={owner.businessFormationDate || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-1">
              State of Formation
            </label>
            <select
              name="businessFormationState"
              value={owner.businessFormationState || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select State</option>
              {/* Add all US states here */}
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              {/* ... remaining states */}
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="text-sm font-medium text-light-text-secondary mb-3">
            Primary Contact Information
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-1">
                Contact Name*
              </label>
              <input
                type="text"
                name="primaryContactName"
                value={owner.primaryContactName || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-1">
                Contact Title
              </label>
              <input
                type="text"
                name="primaryContactTitle"
                value={owner.primaryContactTitle || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-1">
                Contact Email*
              </label>
              <input
                type="email"
                name="primaryContactEmail"
                value={owner.primaryContactEmail || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light-text-secondary mb-1">
                Contact Phone*
              </label>
              <input
                type="tel"
                name="primaryContactPhone"
                value={owner.primaryContactPhone || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  // Add trust owner specific fields
  const renderTrustFields = () => {
    if (owner.type !== 'trust') return null;

    return (
      <>
        <div className="mb-4 p-4 bg-yellow-50 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Trust owners typically require a personal guarantor for
                credit applications. Please be prepared to provide personal financial information
                for the trustee(s).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-1">
              Trust Formation Date
            </label>
            <input
              type="date"
              name="trustFormationDate"
              value={owner.trustFormationDate || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-text-secondary mb-1">
              Trust State
            </label>
            <select
              name="trustState"
              value={owner.trustState || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select State</option>
              {/* Add all US states here */}
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              {/* ... remaining states */}
              <option value="WY">Wyoming</option>
            </select>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-light-border p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3
          className={`text-lg font-medium ${isMainOwner ? 'text-primary-700' : 'text-light-text'}`}
        >
          {isMainOwner
            ? 'Primary Owner'
            : `Additional Owner ${owner.type === 'individual' ? '' : '(Entity)'}`}
        </h3>

        {!isMainOwner && (
          <button
            type="button"
            onClick={() => onDelete(owner.id)}
            className="text-risk-red hover:text-risk-red-dark"
            aria-label="Delete owner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-light-text-secondary mb-1">
            Owner Type*
          </label>
          <select
            name="type"
            value={owner.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="individual">Individual</option>
            <option value="business">Business Entity</option>
            <option value="trust">Trust</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-light-text-secondary mb-1">
            {owner.type === 'individual'
              ? 'Full Legal Name'
              : owner.type === 'business'
                ? 'Business Legal Name'
                : 'Trust Name'}
            *
          </label>
          <input
            type="text"
            name="name"
            value={owner.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
            required
          />
          {errors.name && <p className="text-risk-red text-sm mt-1">{errors.name}</p>}
        </div>
      </div>

      {renderOwnershipFields()}

      {renderIdentificationField()}

      {renderIndividualFields()}

      {renderBusinessFields()}

      {renderTrustFields()}

      {renderCreditScore()}

      <div className="mb-4">
        <label className="block text-sm font-medium text-light-text-secondary mb-1">
          Contact Information
        </label>
        <div className="space-y-4">
          <div className="address-section">
            <div className="mb-2">
              <input
                type="text"
                placeholder="Street Address"
                value={addressInput}
                onChange={handleAddressInputChange}
                className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                required
              />
              {errors.address && <p className="text-risk-red text-sm mt-1">{errors.address}</p>}

              {/* Address autocomplete suggestions */}
              {addressSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-light-border max-h-60 overflow-auto">
                  {addressSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="p-2 hover:bg-light-bg cursor-pointer"
                      onClick={() => handleAddressSelect(suggestion)}
                    >
                      {suggestion.fullAddress}
                    </div>
                  ))}
                </div>
              )}

              {isSearchingAddress && (
                <div className="mt-1 text-sm text-light-text-secondary">
                  Searching for addresses...
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={owner.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                {errors.city && <p className="text-risk-red text-sm mt-1">{errors.city}</p>}
              </div>
              <div className="col-span-1">
                <select
                  name="state"
                  value={owner.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">State</option>
                  {/* Add all US states here */}
                  <option value="AL">AL</option>
                  <option value="AK">AK</option>
                  {/* ... more states ... */}
                </select>
                {errors.state && <p className="text-risk-red text-sm mt-1">{errors.state}</p>}
              </div>
              <div className="col-span-1">
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP"
                  value={owner.zip}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                {errors.zip && <p className="text-risk-red text-sm mt-1">{errors.zip}</p>}
              </div>
            </div>
          </div>

          {renderPhoneFields()}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={owner.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-light-border rounded-md text-light-text bg-white focus:ring-primary-500 focus:border-primary-500"
              required
            />
            {errors.email && <p className="text-risk-red text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerComponent;
