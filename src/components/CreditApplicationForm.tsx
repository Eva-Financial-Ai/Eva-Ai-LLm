import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';
import SignatureCanvas from 'react-signature-canvas';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import NAICSSelector from './NAICSSelector';
import OwnerManager from './OwnerManager';
import { Owner } from './OwnerComponent';
import { v4 as uuidv4 } from 'uuid';
import AccountingSoftwareIntegration from './accounting/AccountingSoftwareIntegration';
import TaxReturnsUpload, {
  BusinessTaxReturnsState,
  OwnerTaxReturnsState,
} from './tax/TaxReturnsUpload';
import AddressVerificationModal from './AddressVerificationModal';
import DatabaseSearch, { BusinessRecord, OwnerRecord } from './DatabaseSearch';
import LienUCCManagement from './credit/LienUCCManagement';
import EnhancedAddressInput from './EnhancedAddressInput';

// Define types for Plaid-related data
interface PlaidAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
}

interface PlaidStatement {
  id: string;
  month: string;
  dateGenerated: string;
  url: string;
  accounts: string[];
  type?: string;
}

// Financial statements interface for accounting integrations
interface FinancialStatement {
  id: string;
  name: string;
  source: 'quickbooks' | 'netsuite' | 'upload';
  type: 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'income_statement';
  year: string;
  url: string;
}

// Define address suggestion interface
interface AddressSuggestion {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
  confidence?: number; // Add confidence score from API
  verified?: boolean; // Track if address has been verified
}

// Add money formatter function at top of file
const formatMoney = (value: string) => {
  // Remove non-digits
  const digits = value.replace(/\D/g, '');
  // Format with commas
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

const getTermOptionsForInstrument = (instrumentType: string) => {
  switch (instrumentType) {
    case 'equipment_finance':
    case 'equipment_lease':
      // Equipment financing/leasing: 1-10 years
      return [
        { value: '12', label: '12 months (1 year)' },
        { value: '24', label: '24 months (2 years)' },
        { value: '36', label: '36 months (3 years)' },
        { value: '48', label: '48 months (4 years)' },
        { value: '60', label: '60 months (5 years)' },
        { value: '72', label: '72 months (6 years)' },
        { value: '84', label: '84 months (7 years)' },
        { value: '96', label: '96 months (8 years)' },
        { value: '108', label: '108 months (9 years)' },
        { value: '120', label: '120 months (10 years)' },
        { value: 'other', label: 'Other' },
      ];

    case 'commercial_real_estate':
    case 'residential_real_estate':
    case 'mixed_use_real_estate':
      // Real estate: 30 days to 40 years
      return [
        { value: '1', label: '30 days (Bridge)' },
        { value: '3', label: '90 days (Short-term Bridge)' },
        { value: '6', label: '6 months (Bridge)' },
        { value: '12', label: '12 months (1 year)' },
        { value: '24', label: '24 months (2 years)' },
        { value: '36', label: '36 months (3 years)' },
        { value: '60', label: '5 years' },
        { value: '84', label: '7 years' },
        { value: '120', label: '10 years' },
        { value: '180', label: '15 years' },
        { value: '240', label: '20 years' },
        { value: '300', label: '25 years' },
        { value: '360', label: '30 years' },
        { value: '480', label: '40 years (Commercial Mortgage)' },
        { value: 'other', label: 'Other' },
      ];

    case 'accounts_receivable':
    case 'inventory_financing':
      // Short-term financing options
      return [
        { value: '1', label: '30 days' },
        { value: '2', label: '60 days' },
        { value: '3', label: '90 days' },
        { value: '6', label: '6 months' },
        { value: '12', label: '12 months (1 year)' },
      ];

    case 'business_line_of_credit':
      // Line of credit terms
      return [
        { value: '12', label: '12 months (1 year)' },
        { value: '24', label: '24 months (2 years)' },
        { value: '36', label: '36 months (3 years)' },
        { value: '60', label: '5 years' },
      ];

    case 'sba':
      // SBA loan terms
      return [
        { value: '84', label: '7 years (Working capital)' },
        { value: '120', label: '10 years (Equipment)' },
        { value: '240', label: '20 years (Real estate)' },
        { value: '300', label: '25 years (504 loan)' },
      ];

    default:
      // Default options
      return [
        { value: '12', label: '12 months (1 year)' },
        { value: '24', label: '24 months (2 years)' },
        { value: '36', label: '36 months (3 years)' },
        { value: '48', label: '48 months (4 years)' },
        { value: '60', label: '60 months (5 years)' },
        { value: '72', label: '72 months (6 years)' },
        { value: '84', label: '84 months (7 years)' },
        { value: '120', label: '10 years' },
        { value: 'other', label: 'Other' },
      ];
  }
};

// Add this EIN formatter function after the imports and before the component definition
const formatEin = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Format as XX-XXXXXXX
  if (digits.length <= 2) {
    return digits;
  } else {
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  }
};

// Add this validator
const isValidEin = (ein: string) => {
  // EIN format is XX-XXXXXXX where X is a digit
  const pattern = /^\d{2}-\d{7}$/;
  return pattern.test(ein);
};

// Add this after imports
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Create a comprehensive FormData interface to define all form fields
interface FormData {
  // Business Information
  businessType: string;
  businessName: string;
  dba: string;
  countyOfDba: string;
  businessAddress: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  businessEntityType: string;
  isPublicCompany: boolean;
  taxId: string;
  numberOfEmployees?: string;
  unknownEin?: boolean;
  businessEmail?: string;
  businessPhoneNumber?: string;

  // Owner Information
  owners: Owner[];

  // Loan Request
  requestedAmount: string;
  purpose: string;
  financialInstrument: string;
  preferredTerm: string;

  // Financial Information
  annualRevenue: string;
  monthlyExpenses: string;
  outstandingDebt: string;
  cashBalance: string;
  grossProfitMargin?: number;
  highProfitMarginAcknowledged?: boolean;

  // Revenue forecasts
  grossRevenue2024?: string;
  grossRevenue2025?: string;

  // Banking Information
  primaryBank: string;

  // Loan purpose details
  loanPurposeDescription: string;
  loanPurposeEntries: string[];

  // Integration data
  quickbooksConnected: boolean;
  netsuiteConnected: boolean;
  financialStatements: FinancialStatement[];
  plaidConnected: boolean;
  plaidAccounts: PlaidAccount[];
  plaidStatements: PlaidStatement[];

  // Tax returns
  businessTaxReturns: BusinessTaxReturnsState;

  // Other fields
  showOtherPurpose?: boolean;
  showOtherFinancialInstrument?: boolean;
  showOtherPreferredTerm?: boolean;
  ownerAddress?: string;
}

interface CreditApplicationFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
  businessType?: 'new' | 'existing';
}

const CreditApplicationForm: React.FC<CreditApplicationFormProps> = ({
  onSubmit,
  initialData = {},
  businessType: parentBusinessType,
}) => {
  const navigate = useNavigate();
  const { addTransaction, loading, advanceStage } = useWorkflow();
  const { userRole } = React.useContext(UserContext);

  // Add form step navigation
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const formSteps = [
    { id: 1, name: 'Business Information' },
    { id: 2, name: 'Owner Information' },
    { id: 3, name: 'Loan Request' },
    { id: 4, name: 'Financial Information' },
    { id: 5, name: 'Banking & Accounting' },
    { id: 6, name: 'Documents & Signature' },
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Track if business is new or existing
  const [localBusinessType, setLocalBusinessType] = useState<'new' | 'existing'>(
    parentBusinessType || (initialData.businessName ? 'existing' : 'new')
  );
  const [showDatabaseSearch, setShowDatabaseSearch] = useState<boolean>(
    parentBusinessType === 'existing' || !!initialData.businessName
  );

  // Initialize businessType based on props
  useEffect(() => {
    if (parentBusinessType === 'existing') {
      setLocalBusinessType('existing');
      setShowDatabaseSearch(true);
    }
  }, [parentBusinessType]);

  // Initialize form data with business type set appropriately
  const initFormData = (): FormData => {
    const formBusinessType =
      localBusinessType === 'existing' ? 'existing_business' : 'new_business';

    return {
      // Business Type
      businessType: formBusinessType,

      // Business Information
      businessName: initialData?.businessName || '',
      dba: initialData?.dba || '',
      countyOfDba: initialData?.countyOfDba || '',
      businessAddress: initialData?.businessAddress || '',
      businessCity: initialData?.businessCity || '',
      businessState: initialData?.businessState || '',
      businessZip: initialData.businessZip || '',
      businessEntityType: initialData.businessType || '',
      isPublicCompany: initialData.isPublicCompany || false,
      taxId: initialData.taxId || '',
      numberOfEmployees: initialData.numberOfEmployees || '',
      unknownEin: initialData.unknownEin || false,
      businessEmail: initialData.businessEmail || '',
      businessPhoneNumber: initialData.businessPhoneNumber || '',

      // Owner Information
      owners: initialData.owners || [],

      // Loan Request
      requestedAmount: initialData.requestedAmount || '',
      purpose: initialData.purpose || '',
      financialInstrument: initialData.financialInstrument || '',
      preferredTerm: initialData.preferredTerm || '',

      // Financial Information
      annualRevenue: initialData.annualRevenue || '',
      monthlyExpenses: initialData.monthlyExpenses || '',
      outstandingDebt: initialData.outstandingDebt || '',
      cashBalance: initialData.cashBalance || '',
      grossProfitMargin: initialData.grossProfitMargin || 0,
      highProfitMarginAcknowledged: initialData.highProfitMarginAcknowledged || false,

      // Revenue forecasts
      grossRevenue2024: initialData.grossRevenue2024 || '',
      grossRevenue2025: initialData.grossRevenue2025 || '',

      // Banking Information
      primaryBank: initialData.primaryBank || '',

      // Loan purpose details
      loanPurposeDescription: initialData.loanPurposeDescription || '',
      loanPurposeEntries: initialData.loanPurposeEntries || [],

      // Integration data
      quickbooksConnected: initialData.quickbooksConnected || false,
      netsuiteConnected: initialData.netsuiteConnected || false,
      financialStatements: initialData.financialStatements || [],
      plaidConnected: initialData.plaidConnected || false,
      plaidAccounts: initialData.plaidAccounts || [],
      plaidStatements: initialData.plaidStatements || [],

      // Tax returns
      businessTaxReturns: initialData.businessTaxReturns || { files: [] },

      // Other fields
      showOtherPurpose: initialData.showOtherPurpose || false,
      showOtherFinancialInstrument: initialData.showOtherFinancialInstrument || false,
      showOtherPreferredTerm: initialData.showOtherPreferredTerm || false,
      ownerAddress: initialData.ownerAddress || '',
    };
  };

  const [formData, setFormData] = useState<FormData>(initFormData());

  // Update form when businessType changes externally
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      businessType: localBusinessType === 'existing' ? 'existing_business' : 'new_business',
    }));
  }, [localBusinessType]);

  // Handle application type change (radio button selection)
  const handleApplicationTypeChange = (type: string) => {
    // Update internal business type state
    const isExisting = type === 'existing_business';
    setLocalBusinessType(isExisting ? 'existing' : 'new');

    // Show/hide database search based on selection
    setShowDatabaseSearch(isExisting);

    // Update form data business type
    setFormData(prevData => ({
      ...prevData,
      businessType: type,
    }));

    // Dispatch event to notify parent component
    const event = new CustomEvent('business-type-changed', {
      detail: { type: isExisting ? 'existing' : 'new' },
    });
    document.dispatchEvent(event);

    // Reset business fields if switching to new business
    if (!isExisting) {
      setFormData(prevData => ({
        ...prevData,
        businessName: '',
        taxId: '',
        dba: '',
        businessAddress: '',
        businessCity: '',
        businessState: '',
        businessZip: '',
      }));
    }
  };

  // Listen for pre-fill events from parent components
  useEffect(() => {
    // Handler for set-business-existing event
    const handleSetBusinessExisting = (e: CustomEvent) => {
      // Update business type to existing
      setLocalBusinessType('existing');
      setShowDatabaseSearch(true);

      // If we have detailed business data in the event
      if (e.detail) {
        const { businessName, taxId, address, city, state, zipCode, email, phone } = e.detail;

        // Update form data with the business details
        setFormData(prevData => ({
          ...prevData,
          businessType: 'existing_business',
          businessName: businessName || prevData.businessName,
          taxId: taxId || prevData.taxId,
          businessAddress: address || prevData.businessAddress,
          businessCity: city || prevData.businessCity,
          businessState: state || prevData.businessState,
          businessZip: zipCode || prevData.businessZip,
          businessEmail: email || prevData.businessEmail,
          businessPhoneNumber: phone || prevData.businessPhoneNumber,
        }));
      }
    };

    // Handler for prefill-business-data event with all form data
    const handlePreFillData = (e: CustomEvent) => {
      if (e.detail) {
        console.log('Received pre-fill data:', e.detail);

        // Update the entire form with prefill data
        setFormData(prevData => ({
          ...prevData,
          ...e.detail,
          businessType: 'existing_business', // Ensure this is set correctly
        }));

        // Set business type to existing
        setLocalBusinessType('existing');
        setShowDatabaseSearch(true);
      }
    };

    // Register event listeners
    document.addEventListener('set-business-existing', handleSetBusinessExisting as EventListener);
    document.addEventListener('prefill-business-data', handlePreFillData as EventListener);

    // Cleanup function
    return () => {
      document.removeEventListener(
        'set-business-existing',
        handleSetBusinessExisting as EventListener
      );
      document.removeEventListener('prefill-business-data', handlePreFillData as EventListener);
    };
  }, []); // Empty dependency array since we want this effect to run once

  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [signatureTimestamp, setSignatureTimestamp] = useState('');
  const [verificationType, setVerificationType] = useState('self'); // 'self', 'request', 'blockchain'
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    timestamp?: string;
    blockchainTx?: string;
  } | null>(null);

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sigCanvas = useRef<SignatureCanvas>(null);

  // Plaid related state
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [isPlaidLoading, setIsPlaidLoading] = useState(false);
  const [statementPeriod, setStatementPeriod] = useState('6');

  // Address autocomplete state
  const [businessAddressSuggestions, setBusinessAddressSuggestions] = useState<AddressSuggestion[]>(
    []
  );
  const [ownerAddressSuggestions, setOwnerAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingBusinessAddress, setIsSearchingBusinessAddress] = useState(false);
  const [isSearchingOwnerAddress, setIsSearchingOwnerAddress] = useState(false);
  const [businessAddressInput, setBusinessAddressInput] = useState(
    initialData.businessAddress || ''
  );
  const [ownerAddressInput, setOwnerAddressInput] = useState(initialData.ownerAddress || '');

  // Address verification state
  const [showAddressVerificationModal, setShowAddressVerificationModal] = useState(false);
  const [addressToVerify, setAddressToVerify] = useState({
    type: 'business', // 'business' or 'owner'
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isVerified: false,
  });
  const [zipCodeConfirm, setZipCodeConfirm] = useState(''); // For separate zip code confirmation
  const [zipCodeError, setZipCodeError] = useState('');

  // Add a new state variable to track address verification status
  const [addressVerified, setAddressVerified] = useState(false);

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setHasSignature(false);
      setSignatureData('');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Special case for EIN/Tax ID
    if (name === 'taxId') {
      const formattedEin = formatEin(value);
      setFormData(prev => ({ ...prev, [name]: formattedEin }));
    }
    // Format money fields
    else if (
      [
        'requestedAmount',
        'annualRevenue',
        'monthlyExpenses',
        'outstandingDebt',
        'cashBalance',
      ].includes(name)
    ) {
      // Only keep digits for calculation but display with commas
      const digitsOnly = value.replace(/\D/g, '');
      const formatted = formatMoney(digitsOnly);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Special handling for "Other" option in dropdowns
    else if (name === 'purpose' && value === 'other') {
      setFormData(prev => ({ ...prev, [name]: value, showOtherPurpose: true }));
    } else if (name === 'financialInstrument' && value === 'other') {
      setFormData(prev => ({ ...prev, [name]: value, showOtherFinancialInstrument: true }));
    } else if (name === 'preferredTerm' && value === 'other') {
      setFormData(prev => ({ ...prev, [name]: value, showOtherPreferredTerm: true }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add this after handleInputChange function:
  const handleOwnersChange = (updatedOwners: Owner[]) => {
    setFormData(prev => ({ ...prev, owners: updatedOwners }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Business Information validation
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessAddress) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (!formData.businessCity) {
      newErrors.businessCity = 'City is required';
    }

    if (!formData.businessState) {
      newErrors.businessState = 'State is required';
    }

    if (!formData.businessZip) {
      newErrors.businessZip = 'ZIP code is required';
    }

    // Update taxId validation to check for unknownEin flag
    if (!formData.taxId && !formData.unknownEin) {
      newErrors.taxId = 'Tax ID/EIN is required';
    } else if (formData.taxId && !isValidEin(formData.taxId)) {
      newErrors.taxId = 'EIN must be in XX-XXXXXXX format';
    }

    if (!formData.businessEntityType) {
      newErrors.businessEntityType = 'Business entity type is required';
    }

    if (!formData.numberOfEmployees) {
      newErrors.numberOfEmployees = 'Number of employees is required';
    }

    // Validate County of DBA when required
    if (
      (formData.dba || formData.businessType === 'sole_proprietorship') &&
      !formData.countyOfDba
    ) {
      newErrors.countyOfDba =
        'County of Doing Business As is required when DBA is provided or business type is Sole Proprietorship';
    }
    // Owner Information validation
    if (!formData.owners || formData.owners.length === 0 || !formData.owners[0]) {
      newErrors.ownerMissing = 'At least one owner is required';
    } else {
      const primaryOwner = formData.owners[0];
      if (!primaryOwner.name) {
        newErrors.ownerName = 'Owner name is required';
      }

      if (!primaryOwner.ownershipPercentage) {
        newErrors.ownershipPercentage = 'Ownership percentage is required';
      } else if (
        parseFloat(primaryOwner.ownershipPercentage) < 0 ||
        parseFloat(primaryOwner.ownershipPercentage) > 100
      ) {
        newErrors.ownershipPercentage = 'Ownership percentage must be between 0 and 100';
      } else if (
        parseFloat(primaryOwner.ownershipPercentage) < 81 &&
        formData.owners.length === 1
      ) {
        newErrors.ownershipPercentage =
          'Primary owner has less than 81% ownership. Additional owners must be identified for compliance.';
      }

      // Check that total ownership percentage equals 100%
      const totalOwnership = formData.owners.reduce(
        (sum, owner) => sum + (parseFloat(owner.ownershipPercentage) || 0),
        0
      );
      if (Math.abs(totalOwnership - 100) > 0.01) {
        // Allow small rounding errors
        newErrors.totalOwnership = 'Total ownership percentage must equal 100%';
      }

      // Only validate SSN if not in broker view
      if (userRole !== 'broker' && userRole !== 'lender') {
        if (primaryOwner.type === 'individual' && !primaryOwner.ssn) {
          newErrors.ownerSsn = 'Social Security Number is required';
        }

        if (primaryOwner.type === 'business' && !primaryOwner.businessEin) {
          newErrors.businessEin = 'Business EIN is required';
        }

        if (primaryOwner.type === 'trust' && !primaryOwner.trustEin) {
          newErrors.trustEin = 'Trust EIN is required';
        }
      }

      if (!primaryOwner.address) {
        newErrors.ownerAddress = 'Owner address is required';
      }

      if (!primaryOwner.city) {
        newErrors.ownerCity = 'City is required';
      }

      if (!primaryOwner.state) {
        newErrors.ownerState = 'State is required';
      }

      if (!primaryOwner.zip) {
        newErrors.ownerZip = 'ZIP code is required';
      }

      if (!primaryOwner.phone) {
        newErrors.ownerPhone = 'Phone number is required';
      }

      if (!primaryOwner.email) {
        newErrors.ownerEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(primaryOwner.email)) {
        newErrors.ownerEmail = 'Email is invalid';
      }

      // Mobile phone required
      if (!primaryOwner.mobile) {
        newErrors.ownerMobile = 'Mobile phone number is required for KYC verification';
      }

      // Validate age >= 18 for all individual owners
      formData.owners.forEach((owner, index) => {
        if (owner.type === 'individual' && owner.dateOfBirth) {
          if (!isAtLeast18YearsOld(owner.dateOfBirth)) {
            newErrors[`owner${index}Age`] = 'Owner must be at least 18 years old to apply';
          }
        }
      });
    }

    // Loan Request validation
    if (!formData.requestedAmount) {
      newErrors.requestedAmount = 'Amount is required';
    } else if (
      isNaN(Number(formData.requestedAmount.replace(/,/g, ''))) ||
      Number(formData.requestedAmount.replace(/,/g, '')) <= 0
    ) {
      newErrors.requestedAmount = 'Please enter a valid amount';
    } else if (Number(formData.requestedAmount.replace(/,/g, '')) > 3000000000) {
      newErrors.requestedAmount = 'Maximum amount is $3 billion';
    }

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required';
    }

    if (!formData.preferredTerm) {
      newErrors.preferredTerm = 'Term is required';
    }

    // Financial Information validation
    if (!formData.annualRevenue) {
      newErrors.annualRevenue = 'Annual revenue is required';
    } else if (
      isNaN(Number(formData.annualRevenue.replace(/,/g, ''))) ||
      Number(formData.annualRevenue.replace(/,/g, '')) < 0
    ) {
      newErrors.annualRevenue = 'Please enter a valid amount';
    } else if (Number(formData.annualRevenue.replace(/,/g, '')) > 150000000000) {
      newErrors.annualRevenue = 'Maximum value is $150 billion';
    }

    // Banking Information validation
    if (!formData.primaryBank) {
      newErrors.primaryBank = 'Primary bank is required';
    }

    // Signature and agreement validation
    if (verificationType === 'self' && !hasSignature) {
      newErrors.signature = 'Signature is required';
    }

    if (!agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    // Add validation for public/private company
    if (formData.businessType !== 'sole_proprietorship' && formData.isPublicCompany === undefined) {
      newErrors.isPublicCompany = 'Please indicate if this is a public company';
    }

    // Update validation for split gross revenue fields
    if (!formData.grossRevenue2024) {
      newErrors.grossRevenue2024 = '2024 Revenue is required';
    } else if (isNaN(Number(formData.grossRevenue2024)) || Number(formData.grossRevenue2024) < 0) {
      newErrors.grossRevenue2024 = 'Please enter a valid amount';
    }

    if (!formData.grossRevenue2025) {
      newErrors.grossRevenue2025 = '2025 Revenue is required';
    } else if (isNaN(Number(formData.grossRevenue2025)) || Number(formData.grossRevenue2025) < 0) {
      newErrors.grossRevenue2025 = 'Please enter a valid amount';
    }

    // Monthly expenses validation
    if (
      formData.monthlyExpenses &&
      (isNaN(Number(formData.monthlyExpenses.replace(/,/g, ''))) ||
        Number(formData.monthlyExpenses.replace(/,/g, '')) < 0)
    ) {
      newErrors.monthlyExpenses = 'Please enter a valid amount';
    } else if (
      formData.monthlyExpenses &&
      Number(formData.monthlyExpenses.replace(/,/g, '')) > 150000000000
    ) {
      newErrors.monthlyExpenses = 'Maximum value is $150 billion';
    }

    // Outstanding debt validation
    if (
      formData.outstandingDebt &&
      (isNaN(Number(formData.outstandingDebt.replace(/,/g, ''))) ||
        Number(formData.outstandingDebt.replace(/,/g, '')) < 0)
    ) {
      newErrors.outstandingDebt = 'Please enter a valid amount';
    } else if (
      formData.outstandingDebt &&
      Number(formData.outstandingDebt.replace(/,/g, '')) > 150000000000
    ) {
      newErrors.outstandingDebt = 'Maximum value is $150 billion';
    }

    // Cash balance validation
    if (
      formData.cashBalance &&
      (isNaN(Number(formData.cashBalance.replace(/,/g, ''))) ||
        Number(formData.cashBalance.replace(/,/g, '')) < 0)
    ) {
      newErrors.cashBalance = 'Please enter a valid amount';
    } else if (
      formData.cashBalance &&
      Number(formData.cashBalance.replace(/,/g, '')) > 150000000000
    ) {
      newErrors.cashBalance = 'Maximum value is $150 billion';
    }

    // Gross profit margin validation
    if (
      formData.grossProfitMargin &&
      (isNaN(Number(formData.grossProfitMargin)) || Number(formData.grossProfitMargin) < 0)
    ) {
      newErrors.grossProfitMargin = 'Please enter a valid percentage';
    } else if (
      formData.grossProfitMargin &&
      Number(formData.grossProfitMargin) > 9000 &&
      !formData.highProfitMarginAcknowledged
    ) {
      newErrors.grossProfitMargin = 'Please acknowledge unusually high profit margin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureImage = sigCanvas.current.toDataURL('image/png');
      setSignatureData(signatureImage);
      setHasSignature(true);
      setSignatureTimestamp(new Date().toISOString());
    }
  };

  const handleSignatureEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      setHasSignature(true);
      saveSignature();
    }
  };

  const verifySignatureOnBlockchain = async () => {
    // Simulating blockchain verification
    setVerificationResult(null);

    // This would be an API call to your blockchain service
    setTimeout(() => {
      const mockBlockchainVerification = {
        verified: true,
        timestamp: new Date().toISOString(),
        blockchainTx: '0x' + Math.random().toString(16).substring(2, 30),
      };

      setVerificationResult(mockBlockchainVerification);
    }, 2000);
  };

  const sendForSignature = () => {
    if (validateForm()) {
      // In a real app, this would send email with signing link
      alert('Signature request sent to the applicant');
      setVerificationType('request');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (verificationType === 'self') {
        saveSignature();
      }

      // Create transaction data
      const transactionPayload = {
        type: 'credit_application',
        applicantData: {
          id: 'APP-' + Math.floor(Math.random() * 900000 + 100000),
          name: 'Test Applicant', // This would typically come from a user profile
          entityType: 'Corporation',
          industryCode: 'TECH-001',
        },
        amount: parseFloat(formData.requestedAmount) || 100000,
        details: {
          ...formData,
          signature: signatureData,
          signatureTimestamp,
          verificationType,
          verificationResult,
        },
        currentStage: 'document_collection' as const,
      };

      try {
        // Add the transaction to the workflow
        const result = await addTransaction(transactionPayload);

        const newTransactionId = result?.id || `tx-${Date.now()}`;
        setTransactionId(newTransactionId);
        setSubmitted(true);

        // Advance to risk assessment stage
        if (newTransactionId) {
          advanceStage(newTransactionId, 'risk_assessment');

          // Call the onSubmit callback with the data and transaction ID
          if (onSubmit) {
            onSubmit({
              ...formData,
              signature: signatureData,
              transactionId: newTransactionId,
            });
          } else {
            // If no callback provided, navigate to risk assessment
            setTimeout(() => {
              navigate('/risk-assessment');
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error submitting credit application:', error);
        setErrors(prev => ({ ...prev, submit: 'Failed to submit application' }));
      }
    }
  };

  // Function to handle Plaid connection
  const initializePlaid = async () => {
    setIsPlaidLoading(true);
    try {
      // In a real implementation, this would call your backend to generate a link token
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock link token generation
      setPlaidLinkToken('link-sandbox-mock-token-' + Math.random().toString(36).substring(2, 15));
      setIsPlaidLoading(false);
    } catch (error) {
      console.error('Error initializing Plaid:', error);
      setIsPlaidLoading(false);
    }
  };

  // Function to launch Plaid Link
  const openPlaidLink = () => {
    if (!plaidLinkToken) return;

    // In a real implementation, this would launch the Plaid Link UI
    // For now, simulating a successful connection
    setTimeout(() => {
      // Mock connected accounts
      const mockAccounts: PlaidAccount[] = [
        {
          id: 'acc1',
          name: 'Business Checking',
          type: 'checking',
          balance: 25430.21,
          institution: 'Chase',
        },
        {
          id: 'acc2',
          name: 'Business Savings',
          type: 'savings',
          balance: 158750.82,
          institution: 'Chase',
        },
        {
          id: 'acc3',
          name: 'Business Line of Credit',
          type: 'credit',
          balance: -15000,
          institution: 'Chase',
        },
      ];

      // Generate mock statements based on current date
      const today = new Date();
      const isPast15th = today.getDate() > 15;
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const mockStatements: PlaidStatement[] = [];

      // Last 6 months of statements
      for (let i = 0; i < parseInt(statementPeriod); i++) {
        const statementMonth = new Date(currentYear, currentMonth - i, 1);
        mockStatements.push({
          id: `stmt-${i}`,
          month: statementMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
          dateGenerated: new Date().toISOString(),
          url: '#',
          accounts: ['acc1', 'acc2'],
        });
      }

      // Add month-to-date if past 15th
      if (isPast15th) {
        mockStatements.unshift({
          id: 'stmt-mtd',
          month: `${today.toLocaleString('default', { month: 'long', year: 'numeric' })} (MTD)`,
          dateGenerated: new Date().toISOString(),
          url: '#',
          accounts: ['acc1', 'acc2'],
          type: 'mtd',
        });
      }

      setFormData(prev => ({
        ...prev,
        plaidConnected: true,
        plaidAccounts: mockAccounts,
        plaidStatements: mockStatements,
      }));
    }, 1500);
  };

  // Function to download a statement
  const downloadStatement = (statementId: string) => {
    alert(`In a real implementation, this would download the PDF for statement ID: ${statementId}`);
  };

  // Enhanced address search function using OpenStreetMap API
  const searchAddresses = async (query: string, isBusinessAddress: boolean) => {
    if (query.length < 3) {
      if (isBusinessAddress) {
        setBusinessAddressSuggestions([]);
      } else {
        setOwnerAddressSuggestions([]);
      }
      return;
    }

    if (isBusinessAddress) {
      setIsSearchingBusinessAddress(true);
    } else {
      setIsSearchingOwnerAddress(true);
    }

    try {
      // Using OpenStreetMap Nominatim API for address lookup
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&addressdetails=1&limit=5&countrycodes=us`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'EVA Credit Application (https://www.evaplatform.com)',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions');
      }

      const data = await response.json();

      // Transform OSM response into our suggestion format
      const suggestions: AddressSuggestion[] = data
        .map((item: any, index: number) => {
          const addr = item.address;
          let street = '';

          // Construct street address from OSM components
          if (addr.house_number && addr.road) {
            street = `${addr.house_number} ${addr.road}`;
          } else if (addr.road) {
            street = addr.road;
          } else if (addr.pedestrian) {
            street = addr.pedestrian;
          } else if (addr.neighbourhood) {
            street = addr.neighbourhood;
          }

          // Get city from various possible fields
          const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county || '';

          // Get state
          const state = addr.state_code || addr.state || '';

          // Get ZIP code
          const zipCode = addr.postcode || '';

          return {
            id: `osm-${index}-${item.place_id}`,
            address: street,
            city: city,
            state: state,
            zipCode: zipCode,
            fullAddress: item.display_name,
            confidence: parseFloat(item.importance) * 100, // OSM importance as confidence score
            verified: false,
          };
        })
        .filter(
          (item: AddressSuggestion) =>
            // Filter out suggestions without complete address information
            item.address && item.city && item.state && item.zipCode
        );

      if (isBusinessAddress) {
        setBusinessAddressSuggestions(suggestions);
        setIsSearchingBusinessAddress(false);
      } else {
        setOwnerAddressSuggestions(suggestions);
        setIsSearchingOwnerAddress(false);
      }
    } catch (error) {
      console.error('Error searching addresses:', error);

      // Fallback to mock suggestions if API fails
      const mockSuggestions: AddressSuggestion[] = [
        {
          id: '1',
          address: `${Math.floor(Math.random() * 1000) + 100} ${query} St`,
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} St, San Francisco, CA 94103`,
          confidence: 85,
          verified: false,
        },
        {
          id: '2',
          address: `${Math.floor(Math.random() * 1000) + 100} ${query} Ave`,
          city: 'Oakland',
          state: 'CA',
          zipCode: '94612',
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} Ave, Oakland, CA 94612`,
          confidence: 75,
          verified: false,
        },
      ];

      if (isBusinessAddress) {
        setBusinessAddressSuggestions(mockSuggestions);
        setIsSearchingBusinessAddress(false);
      } else {
        setOwnerAddressSuggestions(mockSuggestions);
        setIsSearchingOwnerAddress(false);
      }
    }
  };

  // Enhanced address selection handler with verification
  const handleAddressSelect = (suggestion: AddressSuggestion, isBusinessAddress: boolean) => {
    const currentState = isBusinessAddress
      ? formData.businessState
      : formData.owners[0]?.state || '';

    // Prepare address for verification
    setAddressToVerify({
      type: isBusinessAddress ? 'business' : 'owner',
      street: suggestion.address,
      city: suggestion.city,
      state: suggestion.state || currentState, // Preserve current state if not in suggestion
      zipCode: suggestion.zipCode,
      isVerified: false,
    });

    // Set zip code for confirmation
    setZipCodeConfirm(suggestion.zipCode);

    // Open verification modal
    setShowAddressVerificationModal(true);

    // Clear suggestions
    if (isBusinessAddress) {
      setBusinessAddressSuggestions([]);
    } else {
      setOwnerAddressSuggestions([]);
    }
  };

  // Handle address verification confirmation
  const handleAddressConfirm = () => {
    const isBusinessAddress = addressToVerify.type === 'business';

    // Update form data with verified address
    if (isBusinessAddress) {
      setFormData(prev => ({
        ...prev,
        businessAddress: addressToVerify.street,
        businessCity: addressToVerify.city,
        businessState: addressToVerify.state || prev.businessState, // Use existing state if not provided in verification
        businessZip: addressToVerify.zipCode,
      }));
      setBusinessAddressInput(addressToVerify.street);
      // Update the ZIP confirmation to match the verified ZIP
      setZipCodeConfirm(addressToVerify.zipCode);
      // Set address as verified
      setAddressVerified(true);
    } else {
      setFormData(prev => ({
        ...prev,
        ownerAddress: addressToVerify.street,
        ownerCity: addressToVerify.city,
        ownerState: addressToVerify.state || prev.owners[0]?.state || '', // Use existing state if not provided in verification
        ownerZip: addressToVerify.zipCode,
      }));
      setOwnerAddressInput(addressToVerify.street);
    }

    // Mark address as verified
    setAddressToVerify(prev => ({
      ...prev,
      isVerified: true,
    }));

    // Clear any ZIP code errors
    setZipCodeError('');

    // Close modal
    setShowAddressVerificationModal(false);
  };

  // Handle zip code confirmation
  const handleZipCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isBusinessAddress: boolean
  ) => {
    const { value } = e.target;
    setZipCodeConfirm(value);

    // Validate ZIP code format (5 digits or ZIP+4 format)
    const zipPattern = /^\d{5}(-\d{4})?$/;
    if (value && !zipPattern.test(value)) {
      setZipCodeError('Please enter a valid ZIP code (e.g., 12345 or 12345-6789)');
    } else {
      setZipCodeError('');
    }
  };

  // Handle manual address verification when user changes zip code and submits
  const handleManualAddressVerification = (isBusinessAddress: boolean) => {
    // Get current address values from form
    const street = isBusinessAddress ? formData.businessAddress : formData.owners[0]?.address || '';
    const city = isBusinessAddress ? formData.businessCity : formData.owners[0]?.city || '';
    const state = isBusinessAddress ? formData.businessState : formData.owners[0]?.state || '';

    // Prepare address for verification modal
    setAddressToVerify({
      type: isBusinessAddress ? 'business' : 'owner',
      street,
      city,
      state,
      zipCode: zipCodeConfirm,
      isVerified: false,
    });

    // Show verification modal
    setShowAddressVerificationModal(true);
  };

  // Add these functions after handleInputChange
  const addLoanPurposeEntry = () => {
    if (formData.loanPurposeDescription && formData.loanPurposeEntries.length < 9) {
      setFormData(prev => ({
        ...prev,
        loanPurposeEntries: [...prev.loanPurposeEntries, prev.loanPurposeDescription],
        loanPurposeDescription: '',
      }));
    }
  };

  const removeLoanPurposeEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      loanPurposeEntries: prev.loanPurposeEntries.filter((_, i) => i !== index),
    }));
  };

  // Add handlers for database search and pre-fill
  const handleBusinessSelection = (business: BusinessRecord) => {
    // Pre-fill business information
    setFormData((prevData: FormData): FormData => {
      // Create an owner with required fields from the Owner interface
      const newOwner: Owner = {
        id: 'owner-primary',
        type: 'individual',
        name: '',
        ownershipPercentage: '100',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        mobile: '', // Required by the Owner interface
        email: '',
        isComplete: false,
        notificationSent: false,
        files: [], // Required by the Owner interface
      };

      return {
        ...prevData,
        businessType: 'existing_business',
        businessName: business.businessName,
        dba: business.dba || '',
        businessAddress: business.address,
        businessCity: business.city,
        businessState: business.state,
        businessZip: business.zipCode,
        taxId: business.taxId,
        owners: business.owners?.length
          ? business.owners.map(o => ({
              ...newOwner,
              id: o.id,
              name: o.name,
              ownershipPercentage: o.ownershipPercentage || '100',
              email: o.email || '',
              address: o.address || '',
              city: o.city || '',
              state: o.state || '',
              zip: o.zip || '',
              phone: o.phone || '',
              mobile: o.phone || '', // Use phone as fallback
              files: [], // Required by the Owner interface
            }))
          : [newOwner],
      };
    });

    setLocalBusinessType('existing');
  };

  const handleSelectBusiness = (business: BusinessRecord) => {
    // Pre-fill business information
    setFormData(prevData => {
      // Create an owner with required fields from the Owner interface
      const newOwner: Owner = {
        id: 'owner-primary',
        type: 'individual',
        name: '',
        ownershipPercentage: '100',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        mobile: '',
        email: '',
        isComplete: false,
        notificationSent: false,
        files: [],
      };

      return {
        ...prevData,
        businessType: 'existing_business',
        businessName: business.businessName || '',
        dba: business.dba || '',
        businessAddress: business.address || '',
        businessCity: business.city || '',
        businessState: business.state || '',
        businessZip: business.zipCode || '',
        taxId: business.taxId || '',
        // Don't try to access nonexistent entityType property
        owners: business.owners?.length
          ? business.owners.map(o => ({
              ...newOwner,
              id: o.id,
              name: o.name,
              ownershipPercentage: o.ownershipPercentage || '100',
              email: o.email || '',
              address: o.address || '',
              city: o.city || '',
              state: o.state || '',
              zip: o.zip || '',
              phone: o.phone || '',
              mobile: o.phone || '', // Use phone as fallback
              files: [], // Required by the Owner interface
            }))
          : [newOwner],
      };
    });

    setLocalBusinessType('existing');
  };

  const handleSelectOwner = (owner: OwnerRecord) => {
    // Pre-fill owner information
    const updatedOwners = formData.owners.map(existingOwner =>
      existingOwner.id === 'owner-primary'
        ? {
            ...existingOwner,
            name: owner.name,
            address: owner.address || existingOwner.address,
            city: owner.city || existingOwner.city,
            state: owner.state || existingOwner.state,
            zip: owner.zip || existingOwner.zip,
            email: owner.email || existingOwner.email,
            phone: owner.phone || existingOwner.phone,
            mobile: owner.phone || existingOwner.mobile || '',
            ssn: owner.ssn || existingOwner.ssn,
          }
        : existingOwner
    );

    setFormData({
      ...formData,
      owners: updatedOwners,
    });
  };

  const handleNewBusiness = () => {
    setLocalBusinessType('new');
    setShowDatabaseSearch(false);
  };

  const handleNewOwner = () => {
    // Add a new owner with required fields
    setFormData(prevData => ({
      ...prevData,
      owners: [
        ...prevData.owners,
        {
          id: `owner-${uuidv4().substring(0, 8)}`,
          type: 'individual',
          name: '',
          ownershipPercentage: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          phone: '',
          mobile: '', // Required field for Owner
          email: '',
          isComplete: false,
          notificationSent: false,
          files: [], // Required field for Owner
        },
      ],
    }));
  };

  // Function to reset the form data
  const resetForm = () => {
    // Initialize form with default values
    const defaultFormData = initFormData();
    setFormData(defaultFormData);

    // Reset all form state
    setCurrentStep(1);
    setShowDatabaseSearch(false);
    setAddressVerified(false);
    setZipCodeConfirm('');
    setZipCodeError('');
    setBusinessAddressInput('');
    setOwnerAddressInput('');
    setBusinessAddressSuggestions([]);
    setOwnerAddressSuggestions([]);
    setIsSearchingBusinessAddress(false);
    setIsSearchingOwnerAddress(false);
    setAddressToVerify({
      type: 'business',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      isVerified: false,
    });

    // Reset local business type to default or parent provided value
    setLocalBusinessType(parentBusinessType || 'new');

    // Show success message
    alert('Form has been reset successfully.');
  };

  // Display success message after submission
  if (submitted && transactionId) {
    return (
      <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-green-700 mt-4">Application Submitted!</h2>
        <p className="mt-2 text-green-600">
          Your application has been successfully submitted and is being processed.
        </p>
        <p className="mt-1 text-green-600">Transaction ID: {transactionId}</p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/risk-assessment')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Continue to Risk Assessment
          </button>
        </div>
      </div>
    );
  }

  // Add handler functions for AccountingSoftwareIntegration
  const handleAccountingConnect = useCallback(
    (type: 'quickbooks' | 'netsuite') => {
      setTimeout(() => {
        const mockStatements: FinancialStatement[] = [];
        const currentYear = new Date().getFullYear();

        // Generate mock statements for demo
        if (type === 'quickbooks') {
          mockStatements.push(
            {
              id: 'qb-pl-' + (currentYear - 1),
              name: `Profit & Loss ${currentYear - 1}`,
              source: 'quickbooks',
              type: 'profit_loss',
              year: String(currentYear - 1),
              url: '#',
            },
            {
              id: 'qb-pl-' + (currentYear - 2),
              name: `Profit & Loss ${currentYear - 2}`,
              source: 'quickbooks',
              type: 'profit_loss',
              year: String(currentYear - 2),
              url: '#',
            },
            {
              id: 'qb-bs-' + (currentYear - 1),
              name: `Balance Sheet ${currentYear - 1}`,
              source: 'quickbooks',
              type: 'balance_sheet',
              year: String(currentYear - 1),
              url: '#',
            },
            {
              id: 'qb-bs-' + (currentYear - 2),
              name: `Balance Sheet ${currentYear - 2}`,
              source: 'quickbooks',
              type: 'balance_sheet',
              year: String(currentYear - 2),
              url: '#',
            }
          );
        } else {
          mockStatements.push(
            {
              id: 'ns-pl-' + (currentYear - 1),
              name: `Profit & Loss ${currentYear - 1}`,
              source: 'netsuite',
              type: 'profit_loss',
              year: String(currentYear - 1),
              url: '#',
            },
            {
              id: 'ns-pl-' + (currentYear - 2),
              name: `Profit & Loss ${currentYear - 2}`,
              source: 'netsuite',
              type: 'profit_loss',
              year: String(currentYear - 2),
              url: '#',
            },
            {
              id: 'ns-pl-' + (currentYear - 3),
              name: `Profit & Loss ${currentYear - 3}`,
              source: 'netsuite',
              type: 'profit_loss',
              year: String(currentYear - 3),
              url: '#',
            },
            {
              id: 'ns-bs-' + (currentYear - 1),
              name: `Balance Sheet ${currentYear - 1}`,
              source: 'netsuite',
              type: 'balance_sheet',
              year: String(currentYear - 1),
              url: '#',
            },
            {
              id: 'ns-bs-' + (currentYear - 2),
              name: `Balance Sheet ${currentYear - 2}`,
              source: 'netsuite',
              type: 'balance_sheet',
              year: String(currentYear - 2),
              url: '#',
            }
          );
        }

        setFormData({
          ...formData,
          ...(type === 'quickbooks' ? { quickbooksConnected: true } : { netsuiteConnected: true }),
          financialStatements: [...formData.financialStatements, ...mockStatements],
        });
      }, 1000);
    },
    [formData]
  );

  const handleAccountingDisconnect = useCallback(
    (type: 'quickbooks' | 'netsuite') => {
      setFormData({
        ...formData,
        ...(type === 'quickbooks' ? { quickbooksConnected: false } : { netsuiteConnected: false }),
        financialStatements: formData.financialStatements.filter(s => s.source !== type),
      });
    },
    [formData]
  );

  const handleFinancialStatementsUpload = useCallback(
    (files: FileList) => {
      // In a real app, this would upload files to the server
      // Here we're just creating mock entries
      const newStatements = Array.from(files).map(file => ({
        id: 'upload-' + uuidv4().substring(0, 8),
        name: file.name,
        source: 'upload' as const,
        type: file.name.toLowerCase().includes('balance')
          ? ('balance_sheet' as const)
          : ('profit_loss' as const),
        year: new Date().getFullYear().toString(),
        url: '#',
      }));

      setFormData({
        ...formData,
        financialStatements: [...formData.financialStatements, ...newStatements],
      });
    },
    [formData]
  );

  // Add handler functions for tax returns
  const handleBusinessTaxReturnsChange = useCallback(
    (data: BusinessTaxReturnsState) => {
      setFormData({
        ...formData,
        businessTaxReturns: data,
      });
    },
    [formData]
  );

  const handleOwnerTaxReturnsChange = useCallback(
    (ownerId: string, data: Partial<OwnerTaxReturnsState>) => {
      const updatedOwners = formData.owners.map(owner =>
        owner.id === ownerId ? { ...owner, ...data } : owner
      );

      setFormData({
        ...formData,
        owners: updatedOwners as Owner[],
      });
    },
    [formData]
  );

  const handleUploadBusinessTaxReturn = useCallback(
    (files: FileList) => {
      // In a real app, this would upload files to the server
      // Here we're just creating mock entries
      const newFiles = Array.from(files).map(file => ({
        id: uuidv4(),
        year: new Date().getFullYear().toString(),
        type: 'business' as const,
        fileName: file.name,
        fileUrl: '#',
        dateUploaded: new Date().toISOString(),
        fileSize: file.size,
      }));

      setFormData({
        ...formData,
        businessTaxReturns: {
          ...formData.businessTaxReturns,
          files: [...formData.businessTaxReturns.files, ...newFiles],
        },
      });
    },
    [formData]
  );

  const handleUploadOwnerTaxReturn = useCallback(
    (ownerId: string, files: FileList) => {
      // In a real app, this would upload files to the server
      // Here we're just creating mock entries
      const newFiles = Array.from(files).map(file => ({
        id: uuidv4(),
        year: new Date().getFullYear().toString(),
        type: 'personal' as const,
        ownerId,
        ownerName: formData.owners.find(o => o.id === ownerId)?.name,
        fileName: file.name,
        fileUrl: '#',
        dateUploaded: new Date().toISOString(),
        fileSize: file.size,
      }));

      const updatedOwners = formData.owners.map(owner =>
        owner.id === ownerId
          ? {
              ...owner,
              files: [...(owner.files || []), ...newFiles],
            }
          : owner
      );

      setFormData({
        ...formData,
        owners: updatedOwners as Owner[],
      });
    },
    [formData]
  );

  // Handler to simulate sending signature request to owner
  const handleSendNotificationToOwner = useCallback(
    (ownerId: string) => {
      console.log(`Simulating sending signature request to owner: ${ownerId}`);

      // Update the owner's status in the form data
      setFormData(prevData => {
        const updatedOwners = prevData.owners.map(owner =>
          owner.id === ownerId ? { ...owner, notificationSent: true } : owner
        );
        return { ...prevData, owners: updatedOwners };
      });

      // In a real app, you would trigger an API call here to send SMS/App notification
      alert(
        `Signature request sent to owner ID: ${ownerId}. They need to log in to complete their section.`
      );
    },
    [setFormData] // Dependency on setFormData to ensure stability
  );

  // Handle address input changes
  const handleAddressInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isBusinessAddress: boolean
  ) => {
    const { value } = e.target;

    if (isBusinessAddress) {
      setBusinessAddressInput(value);
      setFormData(prev => ({ ...prev, businessAddress: value }));
    } else {
      setOwnerAddressInput(value);
      setFormData(prev => ({ ...prev, ownerAddress: value }));
    }

    // Debounce address search
    const debounceTimer = setTimeout(() => {
      searchAddresses(value, isBusinessAddress);
    }, 300);

    return () => clearTimeout(debounceTimer);
  };

  // Render address fields with verification for business information step
  const renderBusinessAddressFields = () => {
    return (
      <>
        {/* Street Address */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessAddress">
            Business Street Address *
          </label>
          <div className="relative">
            <input
              type="text"
              id="businessAddress"
              name="businessAddress"
              value={businessAddressInput}
              onChange={e => handleAddressInputChange(e, true)}
              className={`block w-full rounded-md border ${errors.businessAddress ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              placeholder="Enter street address"
              required
            />
            {isSearchingBusinessAddress && (
              <div className="absolute right-3 top-2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-400"
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
              </div>
            )}
            {errors.businessAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
            )}
          </div>

          {/* Address suggestions dropdown */}
          {businessAddressSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {businessAddressSuggestions.map(suggestion => (
                  <li
                    key={suggestion.id}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => handleAddressSelect(suggestion, true)}
                  >
                    <div className="font-medium">{suggestion.address}</div>
                    <div className="text-gray-500 text-xs">
                      {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                    </div>
                    {suggestion.confidence && (
                      <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden w-full">
                        <div
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${Math.min(suggestion.confidence, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* City, State, and ZIP on one row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessCity">
            City *
          </label>
          <input
            type="text"
            id="businessCity"
            name="businessCity"
            value={formData.businessCity}
            onChange={handleInputChange}
            className={`block w-full rounded-md border ${errors.businessCity ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            required
          />
          {errors.businessCity && (
            <p className="mt-1 text-sm text-red-600">{errors.businessCity}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessState">
            State *
          </label>
          <select
            id="businessState"
            name="businessState"
            value={formData.businessState}
            onChange={handleInputChange}
            className={`block w-full rounded-md border ${errors.businessState ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            required
          >
            <option value="">Select State</option>
            {US_STATES.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
          {errors.businessState && (
            <p className="mt-1 text-sm text-red-600">{errors.businessState}</p>
          )}
        </div>

        {/* ZIP Code with confirmation - Enhanced version with verification status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="businessZip">
            ZIP Code *
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                id="businessZip"
                name="businessZip"
                value={formData.businessZip}
                onChange={handleInputChange}
                className={`block w-full rounded-md border ${errors.businessZip ? 'border-red-300' : addressVerified ? 'border-green-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Primary ZIP"
                required
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                id="businessZipConfirm"
                value={zipCodeConfirm}
                onChange={e => handleZipCodeChange(e, true)}
                className={`block w-full rounded-md border ${zipCodeError ? 'border-red-300' : addressVerified ? 'border-green-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Confirm ZIP"
              />
            </div>
            {addressVerified ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-green-50 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verified
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleManualAddressVerification(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                disabled={!zipCodeConfirm || !!zipCodeError}
              >
                Verify
              </button>
            )}
          </div>
          {errors.businessZip && <p className="mt-1 text-sm text-red-600">{errors.businessZip}</p>}
          {zipCodeError && <p className="mt-1 text-sm text-red-600">{zipCodeError}</p>}
          {formData.businessZip &&
            zipCodeConfirm &&
            formData.businessZip !== zipCodeConfirm &&
            !zipCodeError &&
            !addressVerified && (
              <p className="mt-1 text-sm text-yellow-600">
                ZIP codes don't match. Please verify your address.
              </p>
            )}
          {addressVerified && (
            <p className="mt-1 text-sm text-green-600">
              Address verified successfully. You can proceed to the next step.
            </p>
          )}
        </div>

        {/* Tax ID / EIN Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taxId">
            Tax ID / EIN *
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleInputChange}
              className={`block w-full rounded-md border ${errors.taxId ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              placeholder="XX-XXXXXXX"
              required={!formData.unknownEin}
              disabled={formData.unknownEin}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="unknownEin"
                name="unknownEin"
                checked={formData.unknownEin || false}
                onChange={e => {
                  const isChecked = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    unknownEin: isChecked,
                    taxId: isChecked ? '' : prev.taxId,
                  }));
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="unknownEin" className="ml-2 block text-sm text-gray-700">
                I do not know my EIN
              </label>
            </div>
          </div>
          {errors.taxId && <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>}
        </div>

        {/* Business Entity Type */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="businessEntityType"
          >
            Business Entity Type *
          </label>
          <select
            id="businessEntityType"
            name="businessEntityType"
            value={formData.businessEntityType}
            onChange={handleInputChange}
            className={`block w-full rounded-md border ${errors.businessEntityType ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            required
          >
            <option value="">Select Entity Type</option>
            <option value="llc">LLC</option>
            <option value="s-corp">S Corporation</option>
            <option value="c-corp">C Corporation</option>
            <option value="sole-proprietorship">Sole Proprietorship</option>
            <option value="trust">Trust</option>
            <option value="limited-partnership">Limited Partnership</option>
            <option value="public-company">Public Company</option>
          </select>
          {errors.businessEntityType && (
            <p className="mt-1 text-sm text-red-600">{errors.businessEntityType}</p>
          )}
        </div>
      </>
    );
  };

  // ... existing code ...

  // In the Step 1: Business Information section, replace the comment about including existing fields with:
  // {renderBusinessAddressFields()}

  // Add the AddressVerificationModal at the end of the form:
  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      {/* ... existing form content ... */}

      {/* Step 1: Business Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Pre-filled notification banner */}
          {initialData.businessName && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Pre-filled data:</span> Using existing business
                    information for <strong>{initialData.businessName}</strong>. The "Existing
                    Business" option has been automatically selected.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* New/Existing Business Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Business Type</h3>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div
                className={`flex-1 p-4 border rounded-lg cursor-pointer ${
                  localBusinessType === 'new'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setLocalBusinessType('new')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">New Business</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      I'm entering information for a new business not yet in the system
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      localBusinessType === 'new'
                        ? 'border-primary-500 bg-primary-100'
                        : 'border-gray-300'
                    }`}
                  >
                    {localBusinessType === 'new' && (
                      <div className="h-3 w-3 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 p-4 border rounded-lg cursor-pointer ${
                  localBusinessType === 'existing'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setLocalBusinessType('existing');
                  setShowDatabaseSearch(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">Existing Business</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Use information from an existing business in our database
                    </p>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                      localBusinessType === 'existing'
                        ? 'border-primary-500 bg-primary-100'
                        : 'border-gray-300'
                    }`}
                  >
                    {localBusinessType === 'existing' && (
                      <div className="h-3 w-3 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Search */}
          {showDatabaseSearch && (
            <DatabaseSearch
              onSelectBusiness={handleSelectBusiness}
              onSelectOwner={handleSelectOwner}
              onNewBusiness={handleNewBusiness}
              onNewOwner={handleNewOwner}
              currentEIN={formData.taxId}
            />
          )}

          {/* Business Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Business Information</h3>

            {/* Business Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="businessName"
                >
                  Business Legal Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border ${errors.businessName ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  required
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
                )}
              </div>

              {/* DBA */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dba">
                  DBA (if applicable)
                </label>
                <input
                  type="text"
                  id="dba"
                  name="dba"
                  value={formData.dba}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              {/* Add our enhanced address fields - now using a grid with 4 columns */}
              <div className="col-span-1 md:col-span-2">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="businessAddress"
                >
                  Business Street Address *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="businessAddress"
                    name="businessAddress"
                    value={businessAddressInput}
                    onChange={e => handleAddressInputChange(e, true)}
                    className={`block w-full rounded-md border ${errors.businessAddress ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="Enter street address"
                    required
                  />
                  {isSearchingBusinessAddress && (
                    <div className="absolute right-3 top-2">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-400"
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
                    </div>
                  )}
                  {errors.businessAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>
                  )}
                </div>

                {/* Address suggestions dropdown */}
                {businessAddressSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {businessAddressSuggestions.map(suggestion => (
                        <li
                          key={suggestion.id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                          onClick={() => handleAddressSelect(suggestion, true)}
                        >
                          <div className="font-medium">{suggestion.address}</div>
                          <div className="text-gray-500 text-xs">
                            {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                          </div>
                          {suggestion.confidence && (
                            <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden w-full">
                              <div
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${Math.min(suggestion.confidence, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* City, State, and ZIP in a grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 col-span-1 md:col-span-2">
                <div className="md:col-span-1">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="businessCity"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="businessCity"
                    name="businessCity"
                    value={formData.businessCity}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.businessCity ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    required
                  />
                  {errors.businessCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessCity}</p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="businessState"
                  >
                    State *
                  </label>
                  <select
                    id="businessState"
                    name="businessState"
                    value={formData.businessState}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.businessState ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    required
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(state => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  {errors.businessState && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessState}</p>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="businessZip"
                  >
                    ZIP Code *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      id="businessZip"
                      name="businessZip"
                      value={formData.businessZip}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border ${errors.businessZip ? 'border-red-300' : addressVerified ? 'border-green-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                      placeholder="ZIP"
                      required
                    />
                  </div>
                  {errors.businessZip && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessZip}</p>
                  )}
                </div>

                {/* Tax ID / EIN Field */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="taxId">
                    Tax ID / EIN *
                  </label>
                  <input
                    type="text"
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.taxId ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="XX-XXXXXXX"
                    required
                  />
                  {errors.taxId && <p className="mt-1 text-sm text-red-600">{errors.taxId}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ... rest of Step 1 ... */}
        </div>
      )}

      {/* Step 2: Owner Information */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Owner Information</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Please provide information about all owners with 20% or greater ownership interest
                in the business.
              </p>
            </div>

            <OwnerManager
              initialOwners={formData.owners || []}
              onChange={handleOwnersChange}
              includeCredit={false}
              requireMobile={true}
              userRole={userRole} // Pass userRole down
              onSendSignatureRequest={handleSendNotificationToOwner} // Pass the handler down
            />
          </div>
        </div>
      )}

      {/* Step 3: Loan Request */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Loan Request Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Requested Amount */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="requestedAmount"
                >
                  Requested Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="requestedAmount"
                    name="requestedAmount"
                    value={formData.requestedAmount}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.requestedAmount ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 pl-7 pr-12 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="0.00"
                    required
                  />
                </div>
                {errors.requestedAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.requestedAmount}</p>
                )}
              </div>

              {/* Financial Instrument */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="financialInstrument"
                >
                  Financial Instrument *
                </label>
                <select
                  id="financialInstrument"
                  name="financialInstrument"
                  value={formData.financialInstrument}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border ${errors.financialInstrument ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  required
                >
                  <option value="">Select Instrument</option>
                  <option value="term_loan">Term Loan</option>
                  <option value="line_of_credit">Line of Credit</option>
                  <option value="equipment_finance">Equipment Finance</option>
                  <option value="equipment_lease">Equipment Lease</option>
                  <option value="commercial_real_estate">Commercial Real Estate</option>
                  <option value="residential_real_estate">Residential Real Estate</option>
                  <option value="mixed_use_real_estate">Mixed Use Real Estate</option>
                  <option value="sba">SBA Loan</option>
                  <option value="accounts_receivable">Accounts Receivable Financing</option>
                  <option value="inventory_financing">Inventory Financing</option>
                  <option value="business_line_of_credit">Business Line of Credit</option>
                  <option value="other">Other</option>
                </select>
                {errors.financialInstrument && (
                  <p className="mt-1 text-sm text-red-600">{errors.financialInstrument}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Financial Information */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Financial Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Annual Revenue */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="annualRevenue"
                >
                  Annual Revenue *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="annualRevenue"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.annualRevenue ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 pl-7 pr-12 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="0.00"
                    required
                  />
                </div>
                {errors.annualRevenue && (
                  <p className="mt-1 text-sm text-red-600">{errors.annualRevenue}</p>
                )}
              </div>

              {/* Monthly Expenses */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor="monthlyExpenses"
                >
                  Monthly Expenses
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="monthlyExpenses"
                    name="monthlyExpenses"
                    value={formData.monthlyExpenses}
                    onChange={handleInputChange}
                    className={`block w-full rounded-md border ${errors.monthlyExpenses ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 pl-7 pr-12 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                    placeholder="0.00"
                  />
                </div>
                {errors.monthlyExpenses && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyExpenses}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Banking & Accounting */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <AccountingSoftwareIntegration
              quickbooksConnected={formData.quickbooksConnected}
              netsuiteConnected={formData.netsuiteConnected}
              financialStatements={formData.financialStatements}
              onConnect={handleAccountingConnect}
              onDisconnect={handleAccountingDisconnect}
              onUpload={handleFinancialStatementsUpload}
            />
          </div>

          {/* Plaid Integration */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Banking Information</h3>

            {/* Banking fields... */}
          </div>

          {/* Lien & UCC Management */}
          <LienUCCManagement
            businessId={
              formData.businessName
                ? formData.businessName.toLowerCase().replace(/\s+/g, '-')
                : undefined
            }
            businessName={formData.businessName}
          />
        </div>
      )}

      {/* Navigation Controls */}
      <div className="mt-8 flex justify-between items-center">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </button>
        )}

        <div className="ml-auto">
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={currentStep === 1 && !addressVerified}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                currentStep === 1 && !addressVerified
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {currentStep === 1 && !addressVerified ? 'Verify Address First' : 'Next Step'}
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-5 flex justify-between items-center">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Back
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Reset Form
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              {currentStep === 1 ? 'Start Application' : 'Continue'}
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>

      {/* Address Verification Modal */}
      <AddressVerificationModal
        isOpen={showAddressVerificationModal}
        address={{
          street: addressToVerify.street,
          city: addressToVerify.city,
          state: addressToVerify.state,
          zipCode: addressToVerify.zipCode,
        }}
        onConfirm={handleAddressConfirm}
        onEdit={() => setShowAddressVerificationModal(false)}
        onClose={() => setShowAddressVerificationModal(false)}
      />
    </form>
  );
};

export default CreditApplicationForm;
