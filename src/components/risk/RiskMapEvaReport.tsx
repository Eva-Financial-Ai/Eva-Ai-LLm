import React, { useState, useEffect, Suspense } from 'react';
import useTransactionStore from '../../hooks/useTransactionStore';

type RiskCategory = 'character' | 'capacity' | 'collateral' | 'capital' | 'conditions' | 'credit';
type CreditSectionView = 'all' | 'business' | 'owner';

// Add these types for the credit scoring models
type PersonalCreditModel = 'FICO' | 'Vantage2' | 'Vantage3' | 'Vantage4' | 'Vantage5' | 'Vantage6' | 'Vantage8' | 'Vantage9';
type BusinessCreditModel = 'PayNetMasterScore' | 'EquifaxCommercialOne' | 'EquifaxDelinquency' | 'EquifaxBusinessFailure' | 'ExperianIntelliScore' | 'LexisNexisBusinessID';

interface RiskMapEvaReportProps {
  transactionId?: string;
  creditSectionView?: CreditSectionView;
}

interface RiskScore {
  business: number;
  owner: number;
  total: number;
}

interface RatioData {
  name: string;
  value: number | string;
  benchmark: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
}

// Loading skeleton component
const RiskMapLoadingSkeleton = () => (
  <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
    <div className="h-12 bg-gray-200 border-b border-gray-200"></div>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 w-48 rounded-md"></div>
        <div className="h-6 bg-gray-200 w-24 rounded-full"></div>
      </div>
      <div className="h-16 bg-gray-200 w-full rounded-md"></div>
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="h-6 bg-gray-200 w-36 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-40 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-36 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="h-6 bg-gray-200 w-40 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-40 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Category loading skeleton component - smaller for tab-specific loading
const CategoryLoadingSkeleton = () => (
  <div className="animate-pulse mt-4">
    <div className="h-6 bg-gray-200 w-48 rounded-md mb-6"></div>
    <div className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="h-6 bg-gray-200 w-36 rounded-md mb-4"></div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
            <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 w-40 rounded-md"></div>
            <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error state component
const RiskMapError = ({ message }: { message: string }) => (
  <div className="bg-white shadow rounded-lg p-6 text-center">
    <div className="text-risk-red mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-gray-700">{message}</p>
  </div>
);

export const RiskMapEvaReport: React.FC<RiskMapEvaReportProps> = ({ transactionId, creditSectionView }) => {
  const { currentTransaction, loading, error: storeError, fetchTransactions } = useTransactionStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('credit');
  const [selectedCreditView, setSelectedCreditView] = useState<CreditSectionView>(creditSectionView || 'business');
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState<Record<string, boolean>>({
    credit: false,
    capacity: false,
    character: false,
    collateral: false,
    capital: false,
    conditions: false
  });
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [personalCreditModel, setPersonalCreditModel] = useState<PersonalCreditModel>('FICO');
  const [businessCreditModel, setBusinessCreditModel] = useState<BusinessCreditModel>('PayNetMasterScore');
  const [showKYBModal, setShowKYBModal] = useState(false);
  const [kybVerificationStatus, setKybVerificationStatus] = useState<'pending' | 'verified' | 'unverified' | null>(null);
  const [maxLoadingTime] = useState(5000); // 5 seconds maximum loading time

  // Effect to update selectedCreditView when creditSectionView prop changes
  useEffect(() => {
    if (creditSectionView) {
      setSelectedCreditView(creditSectionView);
    }
  }, [creditSectionView]);

  // Effect to ensure we start with credit category selected and load it
  useEffect(() => {
    setSelectedCategory('credit');
    // We'll load the credit category when transaction is ready
  }, []);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        console.log('RiskMapEvaReport: Loading timeout reached');
        setIsLoading(false);
        if (!error && !currentTransaction) {
          setError('Loading timed out. No transaction data available in risk_assessment stage.');
        }
      }, maxLoadingTime);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, maxLoadingTime, error, currentTransaction]);

  // Effect to initialize data and handle loading state - optimized
  useEffect(() => {
    const loadData = async () => {
      try {
        // Only set loading if really needed
        if (!currentTransaction && loading) {
          console.log('RiskMapEvaReport: Setting loading to true - waiting for transaction');
          setIsLoading(true);
        }
        
        setError(null);
        
        // If we still don't have a transaction, try to fetch one
        if (!currentTransaction && !loading) {
          console.log('RiskMapEvaReport: No current transaction, fetching transactions...');
          setIsLoading(true);
          await fetchTransactions();
          
          // Log what we got after fetching
          console.log('RiskMapEvaReport: Fetched transactions, current transaction:', 
            useTransactionStore.getState().currentTransaction);
        }
        
        // After fetching, if we still don't have a transaction, show appropriate message
        if (!currentTransaction && !loading) {
          console.warn('RiskMapEvaReport: No transaction data available after fetch');
          
          // Check if there are any transactions in risk_assessment stage
          const allTransactions = useTransactionStore.getState().transactions;
          const riskTransaction = allTransactions.find(t => t.currentStage === 'risk_assessment');
          
          if (riskTransaction) {
            console.log('RiskMapEvaReport: Found a risk_assessment transaction, setting as current:', riskTransaction.id);
            useTransactionStore.getState().setCurrentTransaction(riskTransaction);
          } else {
            console.error('RiskMapEvaReport: No transactions in risk_assessment stage');
            setError('No transaction found in the risk assessment stage. Please create one first.');
          }
        }
        
        if (currentTransaction) {
          console.log('RiskMapEvaReport: Current transaction loaded successfully:', currentTransaction.id);
          console.log('RiskMapEvaReport: Risk profile data:', currentTransaction.riskProfile);
          
          // Load the initial category (credit)
          loadCategoryData('credit');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading risk map data:", err);
        setError("Failed to load risk map data. Please try again.");
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentTransaction, loading, fetchTransactions]);

  // Add handling for store errors
  useEffect(() => {
    if (storeError) {
      setError(`Transaction store error: ${storeError.message}`);
      setIsLoading(false);
    }
  }, [storeError]);

  // Categories for the risk map report - memoized to avoid re-renders
  const categories = React.useMemo(() => [
    { id: 'credit', name: 'Credit Worthiness' },
    { id: 'capacity', name: 'Capacity Analysis' },
    { id: 'character', name: 'Character Assessment' },
    { id: 'collateral', name: 'Collateral Evaluation' },
    { id: 'capital', name: 'Capital Structure' },
    { id: 'conditions', name: 'Market Conditions' }
  ], []);

  // Function to load data for a specific category
  const loadCategoryData = (category: string) => {
    // If this category is already loaded, don't reload it
    if (loadedCategories.has(category)) {
      console.log(`RiskMapEvaReport: Category ${category} already loaded, skipping`);
      return;
    }

    console.log(`RiskMapEvaReport: Loading data for category ${category}`);
    
    // Set loading state for this specific category
    setCategoriesLoading(prev => ({
      ...prev,
      [category]: true
    }));

    // Simulate an API call with a slight delay - in real app this would be an actual API call
    setTimeout(() => {
      // Mark this category as loaded
      setLoadedCategories(prev => new Set(Array.from(prev).concat([category])));
      
      // Clear loading state for this category
      setCategoriesLoading(prev => ({
        ...prev,
        [category]: false
      }));
      
      console.log(`RiskMapEvaReport: Finished loading data for category ${category}`);
    }, 600);
  };

  // Handle category selection with lazy loading
  const handleCategorySelect = (category: string) => {
    console.log(`RiskMapEvaReport: Selecting category: ${category}`);
    setSelectedCategory(category);
    
    // Load data for this category if it hasn't been loaded yet
    if (!loadedCategories.has(category)) {
      loadCategoryData(category);
    }
  };

  // Direct reference to credit section handling for easier access
  const showCreditSection = selectedCategory === 'credit';

  // Get the score based on selected credit model
  const getPersonalCreditScore = (model: PersonalCreditModel) => {
    // In a real application, these would be fetched from an API
    switch(model) {
      case 'FICO': return { 
        score: 765, 
        max: 850, 
        rating: 'Excellent',
        ficoId: 234568,
        keyFactors: [
          { name: 'Payment History', value: 'Excellent', description: 'On-time payments: 100%' },
          { name: 'Credit Utilization', value: '12%', description: 'Low utilization improves score' },
          { name: 'Account Age', value: '15 years', description: 'Average age of accounts' },
          { name: 'Recent Inquiries', value: '1', description: 'New credit inquiries in past 12 months' }
        ]
      };
      case 'Vantage2': return { 
        score: 748, 
        max: 990, 
        rating: 'Good',
        ficoId: null,
        keyFactors: [
          { name: 'Payment History', value: 'Good', description: 'On-time payments: 98%' },
          { name: 'Credit Age & Type', value: 'Very Good', description: 'Diverse credit mix' },
          { name: 'Credit Utilization', value: '15%', description: 'Good utilization ratio' },
          { name: 'Total Balances', value: 'Moderate', description: 'Moderate total debt burden' }
        ]
      };
      case 'Vantage3': return { 
        score: 712, 
        max: 850, 
        rating: 'Good',
        ficoId: null,
        keyFactors: [
          { name: 'Payment History', value: 'Good', description: '1 late payment in 24 months' },
          { name: 'Age & Type of Credit', value: 'Good', description: 'Diverse credit portfolio' },
          { name: 'Credit Utilization', value: '18%', description: 'Good utilization ratio' },
          { name: 'New Credit', value: 'Excellent', description: 'Limited new accounts' }
        ]
      };
      case 'Vantage4': return { 
        score: 780, 
        max: 850, 
        rating: 'Excellent',
        ficoId: null,
        keyFactors: [
          { name: 'Payment History', value: 'Excellent', description: 'No late payments' },
          { name: 'Credit Depth', value: 'Excellent', description: 'Long credit history' },
          { name: 'Credit Utilization', value: '8%', description: 'Very low utilization' },
          { name: 'Recent Behavior', value: 'Very Good', description: 'Limited recent inquiries' }
        ]
      };
      case 'Vantage5': return { 
        score: 751, 
        max: 850, 
        rating: 'Good',
        ficoId: null,
        keyFactors: [
          { name: 'Payment History', value: 'Very Good', description: 'Strong payment record' },
          { name: 'Credit Utilization', value: '14%', description: 'Good utilization ratio' },
          { name: 'Credit Age', value: 'Good', description: '8 years average' },
          { name: 'Credit Mix', value: 'Good', description: 'Good mix of credit types' }
        ]
      };
      case 'Vantage6': return { 
        score: 761, 
        max: 850, 
        rating: 'Very Good',
        ficoId: null,
        keyFactors: [
          { name: 'Payment History', value: 'Very Good', description: 'Consistent payments' },
          { name: 'Credit Age', value: 'Very Good', description: 'Mature credit profile' },
          { name: 'Credit Utilization', value: '11%', description: 'Low utilization ratio' },
          { name: 'Account Mix', value: 'Good', description: 'Diverse credit accounts' }
        ]
      };
      case 'Vantage8': return { 
        score: 773, 
        max: 850, 
        rating: 'Excellent',
        ficoId: null,
        keyFactors: [
          { name: 'Payment History', value: 'Excellent', description: 'Perfect payment record' },
          { name: 'Credit Mix', value: 'Excellent', description: 'Optimal credit diversity' },
          { name: 'Credit Utilization', value: '7%', description: 'Very low utilization' },
          { name: 'Recent Applications', value: 'Very Good', description: 'Few recent applications' }
        ]
      };
      case 'Vantage9': return { 
        score: 755, 
        max: 850, 
        rating: 'Very Good',
        ficoId: null,
        keyFactors: [
          { name: 'Payment Behavior', value: 'Very Good', description: 'Strong payment performance' },
          { name: 'Duration of Credit', value: 'Good', description: 'Established history' },
          { name: 'Credit Utilization', value: '13%', description: 'Good utilization ratio' },
          { name: 'Credit Seeking', value: 'Very Good', description: 'Limited new credit' }
        ]
      };
      default: return { 
        score: 765, 
        max: 850, 
        rating: 'Excellent',
        ficoId: 234568,
        keyFactors: [
          { name: 'Payment History', value: 'Excellent', description: 'On-time payments: 100%' },
          { name: 'Credit Utilization', value: '12%', description: 'Low utilization improves score' },
          { name: 'Account Age', value: '15 years', description: 'Average age of accounts' },
          { name: 'Recent Inquiries', value: '1', description: 'New credit inquiries in past 12 months' }
        ]
      };
    }
  };

  // Get the score based on selected business credit model
  const getBusinessCreditScore = (model: BusinessCreditModel) => {
    // In a real application, these would be fetched from an API
    switch(model) {
      case 'PayNetMasterScore': return { score: 82, max: 100, rating: 'Strong', description: 'PayNet MasterScore v2 measures the likelihood of serious delinquency over 24 months' };
      case 'EquifaxCommercialOne': return { score: 78, max: 100, rating: 'Good', description: 'Commercial One Score predicts the likelihood of severe delinquency' };
      case 'EquifaxDelinquency': return { score: 71, max: 100, rating: 'Moderate', description: 'Delinquency Score predicts the likelihood of severe delinquency' };
      case 'EquifaxBusinessFailure': return { score: 88, max: 100, rating: 'Low Risk', description: 'Business Failure Score predicts the likelihood of business failure' };
      case 'ExperianIntelliScore': return { score: 76, max: 100, rating: 'Good', description: 'Intelliscore Plus is a statistically based credit-risk model' };
      case 'LexisNexisBusinessID': return { score: 91, max: 100, rating: 'Very Low Risk', description: 'Business InstantID provides comprehensive business verification' };
      default: return { score: 82, max: 100, rating: 'Strong', description: 'PayNet MasterScore v2 measures the likelihood of serious delinquency over 24 months' };
    }
  };

  // KYB Request handler
  const handleKYBRequest = () => {
    setShowKYBModal(true);
  };

  // KYB Verification handler
  const verifyKYBOnChain = () => {
    // In a real application, this would verify the data on a private blockchain
    setKybVerificationStatus('verified');
    setShowKYBModal(false);
  };

  // Format the model name for display
  const formatModelName = (model: string) => {
    if (model.startsWith('Vantage')) {
      return `VantageScore ${model.replace('Vantage', '')}`;
    }
    
    switch(model) {
      case 'PayNetMasterScore': return 'PayNet MasterScore';
      case 'EquifaxCommercialOne': return 'Equifax Commercial One';
      case 'EquifaxDelinquency': return 'Equifax Delinquency Score';
      case 'EquifaxBusinessFailure': return 'Equifax Business Failure';
      case 'ExperianIntelliScore': return 'Experian IntelliScore';
      case 'LexisNexisBusinessID': return 'LexisNexis Business InstantID';
      default: return model;
    }
  };

  // Get the current credit score details
  const personalScore = getPersonalCreditScore(personalCreditModel);
  const businessScore = getBusinessCreditScore(businessCreditModel);

  // Modified render for the credit section
  const renderCreditSection = () => {
    if (selectedCategory !== 'credit') return null;

    return (
      <div className="space-y-6">
        {/* Credit Score Summary - Quick Overview */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h4 className="font-medium text-gray-800 mb-4 text-center">Credit Score Summary</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 border border-blue-100 rounded-lg bg-blue-50">
              <h5 className="text-sm text-gray-500 mb-1">Business Credit</h5>
              <div className="inline-flex items-center justify-center">
                <span className="text-3xl font-bold text-primary-600">{businessScore.score}</span>
                <span className="text-lg text-gray-500 ml-1">/{businessScore.max}</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-600">{businessScore.rating}</div>
            </div>
            <div className="text-center p-4 border border-purple-100 rounded-lg bg-purple-50">
              <h5 className="text-sm text-gray-500 mb-1">Owner Credit</h5>
              <div className="inline-flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">{personalScore.score}</span>
                <span className="text-lg text-gray-500 ml-1">/{personalScore.max}</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-600">{personalScore.rating}</div>
            </div>
          </div>
        </div>

        {/* Credit View Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Credit Tabs">
              <button
                className={`w-1/3 py-3 px-1 text-center border-b-2 ${
                  selectedCreditView === 'all' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
                } font-medium text-sm transition-colors duration-200`}
                onClick={() => setSelectedCreditView('all')}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Overview
                </span>
              </button>
              <button
                className={`w-1/3 py-3 px-1 text-center border-b-2 ${
                  selectedCreditView === 'business' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
                } font-medium text-sm transition-colors duration-200`}
                onClick={() => setSelectedCreditView('business')}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Business Credit
                </span>
              </button>
              <button
                className={`w-1/3 py-3 px-1 text-center border-b-2 ${
                  selectedCreditView === 'owner' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
                } font-medium text-sm transition-colors duration-200`}
                onClick={() => setSelectedCreditView('owner')}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Owner Credit
                </span>
              </button>
            </nav>
          </div>
        </div>

        {/* Business Credit Report Section */}
        {(selectedCreditView === 'all' || selectedCreditView === 'business') && (
          <div className={`${selectedCreditView === 'all' ? 'mb-8' : ''} bg-white p-4 rounded-lg border ${selectedCreditView === 'business' ? 'border-blue-300 shadow-md' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Business Credit Report
              </h4>

              {/* Model selector for business credit */}
              <div className="flex items-center">
                <label htmlFor="businessCreditModel" className="block text-sm font-medium text-gray-700 mr-2">
                  Model:
                </label>
                <select
                  id="businessCreditModel"
                  name="businessCreditModel"
                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={businessCreditModel}
                  onChange={(e) => setBusinessCreditModel(e.target.value as BusinessCreditModel)}
                >
                  <option value="PayNetMasterScore">PayNet MasterScore</option>
                  <option value="EquifaxCommercialOne">Equifax Commercial One</option>
                  <option value="EquifaxDelinquency">Equifax Delinquency Score</option>
                  <option value="EquifaxBusinessFailure">Equifax Business Failure</option>
                  <option value="ExperianIntelliScore">Experian IntelliScore</option>
                  <option value="LexisNexisBusinessID">LexisNexis Business InstantID</option>
                </select>
              </div>
            </div>

            {/* Business credit score visualization */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="mb-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm text-gray-500">Current Score</span>
                    <h5 className="text-3xl font-bold text-blue-700">{businessScore.score}</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Model</span>
                    <span className="text-sm font-medium text-gray-700">{formatModelName(businessCreditModel)}</span>
                  </div>
                </div>
              </div>

              {/* Score visualization */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {businessScore.rating}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {businessScore.score}/{businessScore.max}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div style={{ width: `${(businessScore.score / businessScore.max) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2">{businessScore.description}</p>
            </div>

            {/* KYB Verification Section */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Know Your Business (KYB) Verification
              </h5>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verify business identity and ownership structure</p>
                  <div className="mt-2">
                    {kybVerificationStatus === 'verified' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Verified on Private Chain
                      </span>
                    ) : kybVerificationStatus === 'pending' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Verification Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-gray-400" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!kybVerificationStatus && (
                    <button
                      onClick={handleKYBRequest}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Request KYB
                    </button>
                  )}
                  {kybVerificationStatus === 'pending' && (
                    <button
                      onClick={verifyKYBOnChain}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Verify on Chain
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Business Credit Factors */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Key Credit Factors</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Payment History</span>
                    <span className="text-sm font-medium text-green-600">Excellent</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">No late payments in past 24 months</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Credit Utilization</span>
                    <span className="text-sm font-medium text-green-600">Low</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Using 25% of available credit</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Business Age</span>
                    <span className="text-sm font-medium text-green-600">7+ Years</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Established business history</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Industry Risk</span>
                    <span className="text-sm font-medium text-yellow-600">Moderate</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Manufacturing sector with moderate risk</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Owner Credit Report Section */}
        {(selectedCreditView === 'all' || selectedCreditView === 'owner') && (
          <div className={`bg-white p-4 rounded-lg border ${selectedCreditView === 'owner' ? 'border-purple-300 shadow-md' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner Credit Report
              </h4>

              {/* Model selector for personal credit */}
              <div className="flex items-center">
                <label htmlFor="personalCreditModel" className="block text-sm font-medium text-gray-700 mr-2">
                  Model:
                </label>
                <select
                  id="personalCreditModel"
                  name="personalCreditModel"
                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={personalCreditModel}
                  onChange={(e) => setPersonalCreditModel(e.target.value as PersonalCreditModel)}
                >
                  <option value="FICO">FICO Score</option>
                  <option value="Vantage2">VantageScore 2.0</option>
                  <option value="Vantage3">VantageScore 3.0</option>
                  <option value="Vantage4">VantageScore 4.0</option>
                  <option value="Vantage5">VantageScore 5.0</option>
                  <option value="Vantage6">VantageScore 6.0</option>
                  <option value="Vantage8">VantageScore 8.0</option>
                  <option value="Vantage9">VantageScore 9.0</option>
                </select>
              </div>
            </div>

            {/* Personal credit score visualization */}
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <div className="mb-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-sm text-gray-500">Current Score</span>
                    <h5 className="text-3xl font-bold text-purple-700">{personalScore.score}</h5>
                    {personalScore.ficoId && (
                      <span className="text-xs text-gray-500">FICO ID: {personalScore.ficoId}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block">Model</span>
                    <span className="text-sm font-medium text-gray-700">{formatModelName(personalCreditModel)}</span>
                  </div>
                </div>
              </div>

              {/* Score visualization */}
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                      {personalScore.rating}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-600">
                      {personalScore.score}/{personalScore.max}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                  <div style={{ width: `${(personalScore.score / personalScore.max) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-5 gap-2 text-center text-xs">
                <div className="bg-red-100 rounded p-1">Poor<br/>300-549</div>
                <div className="bg-orange-100 rounded p-1">Fair<br/>550-649</div>
                <div className="bg-yellow-100 rounded p-1">Good<br/>650-699</div>
                <div className="bg-green-100 rounded p-1">Very Good<br/>700-799</div>
                <div className="bg-teal-100 rounded p-1">Excellent<br/>800-850</div>
              </div>
            </div>

            {/* Personal Credit Factors */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Key Credit Factors</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalScore.keyFactors.map((factor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between">
                      <span className="text-sm font-medium">{factor.name}</span>
                      <span className="text-sm font-medium text-green-600">{factor.value}</span>
                  </div>
                    <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                </div>
                ))}
                  </div>
            </div>
          </div>
        )}

        {/* KYB Request Modal */}
        {showKYBModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Request Know Your Business (KYB) Verification</h3>
                <button 
                  onClick={() => setShowKYBModal(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-4">
                  KYB verification helps establish the legitimacy of a business by verifying its ownership structure, registration status, and other key details.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Legal Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="Horizon Manufacturing Inc."
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID (EIN)</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="XX-XXXXXXX" 
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State of Incorporation</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      defaultValue="Delaware"
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setShowKYBModal(false)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setKybVerificationStatus('pending');
                    setShowKYBModal(false);
                  }}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Submit KYB Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render content function with category-specific loading states
  const renderContent = () => {
    if (isLoading || (!currentTransaction && loading)) {
      return <RiskMapLoadingSkeleton />;
    }

    if (error) {
      return <RiskMapError message={error} />;
    }

    if (!currentTransaction) {
      return <RiskMapError message="No transaction data available." />;
    }

    // Check if the selected category is still loading
    const isCategoryLoading = categoriesLoading[selectedCategory];

    // If this specific category is loading, show the category loading skeleton
    if (isCategoryLoading) {
      return <CategoryLoadingSkeleton />;
    }

    // Main content is rendered when data is available
    return (
      <>
        {/* Report header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Eva Risk Report
          </h2>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
            89% Match
          </span>
        </div>

        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>}>
          {/* Credit Analysis Section */}
          {selectedCategory === 'credit' && renderCreditSection()}

          {/* Capacity Analysis Section */}
          {selectedCategory === 'capacity' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capacity Analysis</h3>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Cash Flow Analysis</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Current Ratios</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Debt Service Coverage Ratio</span>
                        <span className="text-sm font-medium text-green-600">1.65</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Ratio</span>
                        <span className="text-sm font-medium text-green-600">1.8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Quick Ratio</span>
                        <span className="text-sm font-medium text-green-600">1.2</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Operating Cash Flow</span>
                        <span className="text-sm font-medium text-green-600">$420,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cash Flow Margin</span>
                        <span className="text-sm font-medium text-green-600">18%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Free Cash Flow</span>
                        <span className="text-sm font-medium text-green-600">$325,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Financial Stability Assessment</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Revenue Stability</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">3-Year Revenue Growth</span>
                        <span className="text-sm font-medium text-green-600">15.2% CAGR</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Revenue Diversification</span>
                        <span className="text-sm font-medium text-yellow-600">Moderate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Customer Concentration</span>
                        <span className="text-sm font-medium text-yellow-600">28% Top Client</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Cost Structure</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Fixed-to-Variable Ratio</span>
                        <span className="text-sm font-medium text-green-600">40:60</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Operating Leverage</span>
                        <span className="text-sm font-medium text-green-600">Moderate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Break-even Point</span>
                        <span className="text-sm font-medium text-green-600">62% of Current Revenue</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Character Assessment Section */}
          {selectedCategory === 'character' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Character Assessment</h3>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Management Experience</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Industry Experience</h5>
                      <p className="text-sm text-gray-500">Leadership team has 15+ years average experience in manufacturing sector</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Prior Success</h5>
                      <p className="text-sm text-gray-500">CEO previously grew similar business by 200% over 5-year period</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Management Turnover</h5>
                      <p className="text-sm text-gray-500">CFO position has seen 2 changes in past 3 years</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Reputation & Integrity</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Regulatory Compliance</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Regulatory Actions</span>
                        <span className="text-sm font-medium text-green-600">None</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Compliance History</span>
                        <span className="text-sm font-medium text-green-600">Strong</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Environmental Compliance</span>
                        <span className="text-sm font-medium text-green-600">100%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Market Reputation</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Customer Reviews</span>
                        <span className="text-sm font-medium text-green-600">4.7/5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Industry Standing</span>
                        <span className="text-sm font-medium text-green-600">Top Quartile</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Vendor Relationships</span>
                        <span className="text-sm font-medium text-green-600">Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Collateral Evaluation Section */}
          {selectedCategory === 'collateral' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Collateral Evaluation</h3>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Asset Valuation</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Equipment & Machinery</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Value (Book)</span>
                        <span className="text-sm font-medium text-gray-900">$2,450,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Market Value (Est.)</span>
                        <span className="text-sm font-medium text-gray-900">$1,850,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Age</span>
                        <span className="text-sm font-medium text-yellow-600">6.2 years</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Real Estate</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Property Value</span>
                        <span className="text-sm font-medium text-gray-900">$3,200,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">LTV Ratio</span>
                        <span className="text-sm font-medium text-green-600">58%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Location Quality</span>
                        <span className="text-sm font-medium text-green-600">Prime Industrial</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Collateral Quality Assessment</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Marketability</h5>
                      <p className="text-sm text-gray-500">Equipment is industry-standard with strong secondary market</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Title & Encumbrances</h5>
                      <p className="text-sm text-gray-500">Clean title on all major assets, no prior liens</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Insurance Coverage</h5>
                      <p className="text-sm text-gray-500">Full replacement coverage with reputable carriers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Capital Structure Section */}
          {selectedCategory === 'capital' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Capital Structure</h3>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Debt & Equity Analysis</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Leverage Metrics</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Debt-to-Equity Ratio</span>
                        <span className="text-sm font-medium text-green-600">1.8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Debt-to-EBITDA</span>
                        <span className="text-sm font-medium text-yellow-600">3.2</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Interest Coverage Ratio</span>
                        <span className="text-sm font-medium text-green-600">4.5</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Capital Sources</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Equity Investment</span>
                        <span className="text-sm font-medium text-gray-900">$4,200,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Senior Debt</span>
                        <span className="text-sm font-medium text-gray-900">$6,800,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Subordinated Debt</span>
                        <span className="text-sm font-medium text-gray-900">$950,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Projected Capital Structure</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Debt Service Impact</h5>
                      <p className="text-sm text-gray-500">New financing increases annual debt service by $180,000, well within coverage capacity</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Capital Allocation</h5>
                      <p className="text-sm text-gray-500">75% allocated to equipment acquisition, 25% to working capital</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Future Fundraising</h5>
                      <p className="text-sm text-gray-500">Expansion plans indicate potential equity round in 18-24 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Conditions Section */}
          {selectedCategory === 'conditions' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Market Conditions</h3>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Industry Analysis</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Sector Health</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Industry Growth Rate</span>
                        <span className="text-sm font-medium text-green-600">8.2% YoY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Market Concentration</span>
                        <span className="text-sm font-medium text-yellow-600">Moderate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Sector Volatility</span>
                        <span className="text-sm font-medium text-green-600">Low</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Competitive Position</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Market Share</span>
                        <span className="text-sm font-medium text-gray-900">4.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Relative Market Position</span>
                        <span className="text-sm font-medium text-green-600">Strong Regional</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Competitive Advantage</span>
                        <span className="text-sm font-medium text-green-600">Technological Edge</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-4">Economic Environment</h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Regional Economic Health</h5>
                      <p className="text-sm text-gray-500">Strong job growth in primary market (5.1% YoY) with favorable wage trends</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Regulatory Environment</h5>
                      <p className="text-sm text-gray-500">Pending legislation may impact import costs for raw materials by Q3</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h5 className="text-sm font-medium text-gray-700">Supply Chain Stability</h5>
                      <p className="text-sm text-gray-500">Multiple sourcing relationships mitigate disruption risk</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Suspense>

        {/* Credit Information Alert - show when not on credit section */}
        {!showCreditSection && (
          <div className="fixed bottom-4 right-4 bg-blue-50 shadow-lg rounded-lg p-4 z-10 border border-blue-200 max-w-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Credit Information Available</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Credit worthiness information is available. Click the Credit Worthiness tab to view.</p>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('credit')}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-md hover:bg-blue-200"
                  >
                    View Credit Information
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`py-4 px-6 text-sm font-medium ${
                selectedCategory === category.id
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
              {categoriesLoading[category.id] && (
                <span className="ml-2 inline-block h-3 w-3 rounded-full bg-primary-200 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}; 