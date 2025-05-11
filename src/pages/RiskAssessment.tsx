import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RiskAssessmentComponent from '../components/risk/RiskAssessment';
import { RiskMapEvaReport } from '../components/risk/RiskMapEvaReport';
import RiskMapSelector from '../components/risk/RiskMapSelector';
import RiskConfiguration from '../components/risk/RiskConfiguration';
import IntelligentDataOrchestrator from '../components/IntelligentDataOrchestrator';
import DocumentVerificationWrapper from '../components/DocumentVerificationWrapper';
import TransactionTimeMetrics from '../components/TransactionTimeMetrics';
import RiskAccordionItem from '../components/risk/RiskAccordionItem';
import RiskMetricsDisplay from '../components/risk/RiskMetricsDisplay';
import useTransactionStore from '../hooks/useTransactionStore';
import RiskAdvisorWrapper from '../components/risk/RiskAdvisorWrapper';
import TopNavigation from '../components/layout/TopNavigation';
import riskDecisionService, {
  HumanInLoopRequest,
  HardDeclineRequest,
  SoftDeclineRequest,
  PendingRequest as ApiPendingRequest,
} from '../api/riskDecisionService';
import { DECLINE_REASON_CODES, RECONSIDERATION_TIMELINES } from '../config';
import RiskLab from '../components/risk/RiskLab';
import EvaScore from '../components/risk/EvaScore';

// Risk metrics types for better TypeScript support
interface RiskExposure {
  name: string;
  value: number;
}

interface RegulatoryCompliance {
  keyPoints: string[];
  complianceCoverage: number;
  riskExposures: RiskExposure[];
}

interface LegalRecord {
  judgmentsCount: number;
  litigationRisk: number;
  recentCases: number;
  pendingLitigation: number;
}

interface BusinessAge {
  yearsInBusiness: number;
  industryPeerPercentile: number;
  stabilityRating: number;
  historicalConsistency: number;
}

interface Reputation {
  marketPerception: number;
  publicSentiment: number;
  customerSatisfaction: number;
  industryAwards: number;
}

interface Stability {
  cashFlowConsistency: number;
  revenueGrowth: number;
  employeeRetention: number;
  marketPositionStrength: number;
}

interface Metrics {
  complianceScore: number;
  regulatoryCompliance: RegulatoryCompliance;
  legalHistoryScore: number;
  legalRecord: LegalRecord;
  businessDurationScore: number;
  businessAge: BusinessAge;
  industryReputationScore: number;
  reputation: Reputation;
  businessStabilityScore: number;
  stability: Stability;
}

// Add interfaces for form data types
interface HumanInLoopFormData {
  reason: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

interface HardDeclineFormData {
  reason: string;
  comments: string;
}

interface SoftDeclineFormData {
  reason: string;
  stepsToOvercome: string;
  reconsiderationTimeline: string;
}

// Using the standard PendingRequest interface from the API
interface PendingRequest extends ApiPendingRequest {}

const RiskAssessment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use Zustand store instead of WorkflowContext
  const {
    currentTransaction,
    transactions,
    loading: storeLoading,
    error: storeError,
    fetchTransactions,
    setCurrentTransaction,
    advanceStage,
  } = useTransactionStore();

  const [showDataOrchestrator, setShowDataOrchestrator] = useState(false);
  const [showDocumentVerification, setShowDocumentVerification] = useState(false);
  const [showRiskMitigationStrategies, setShowRiskMitigationStrategies] = useState(false);
  const [showIndustryBenchmarking, setShowIndustryBenchmarking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'humanInLoop' | 'hardDecline' | 'softDecline' | null>(
    null
  );
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Form state hooks
  const [humanInLoopForm, setHumanInLoopForm] = useState<HumanInLoopFormData>({
    reason: 'additional_info',
    notes: '',
    priority: 'medium',
  });

  const [hardDeclineForm, setHardDeclineForm] = useState<HardDeclineFormData>({
    reason: 'credit_score',
    comments: '',
  });

  const [softDeclineForm, setSoftDeclineForm] = useState<SoftDeclineFormData>({
    reason: 'missing_documents',
    stepsToOvercome: '',
    reconsiderationTimeline: 'immediate',
  });

  // API request state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pending requests tracking
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  // Generate deterministic risk metrics based on transaction ID
  const generateMetrics = (transactionId: string): Metrics => {
    // Return baseline metrics if no transactionId
    if (!transactionId) {
      return {
        complianceScore: 70,
        regulatoryCompliance: {
          keyPoints: [],
          complianceCoverage: 70,
          riskExposures: [],
        },
        legalHistoryScore: 70,
        legalRecord: {
          judgmentsCount: 0,
          litigationRisk: 20,
          recentCases: 0,
          pendingLitigation: 0,
        },
        businessDurationScore: 70,
        businessAge: {
          yearsInBusiness: 5,
          industryPeerPercentile: 70,
          stabilityRating: 70,
          historicalConsistency: 70,
        },
        industryReputationScore: 70,
        reputation: {
          marketPerception: 70,
          publicSentiment: 70,
          customerSatisfaction: 70,
          industryAwards: 2,
        },
        businessStabilityScore: 70,
        stability: {
          cashFlowConsistency: 70,
          revenueGrowth: 70,
          employeeRetention: 70,
          marketPositionStrength: 70,
        },
      };
    }

    // Simple hash based on transactionId to produce deterministic pseudo-randomness
    const hash = transactionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Helper to create a deterministic number within a range
    const range = (min: number, max: number, seed: number) => min + (seed % (max - min + 1));

    const baseScore = range(70, 90, hash);

    return {
      complianceScore: range(baseScore - 5, baseScore + 5, hash + 1),
      regulatoryCompliance: {
        keyPoints: [
          'All required regulatory filings are up-to-date',
          'No significant compliance violations in past 24 months',
          'Industry-specific regulations properly addressed',
        ],
        complianceCoverage: range(80, 100, hash + 2),
        riskExposures: [
          { name: 'Regulatory Changes', value: range(10, 40, hash + 3) },
          { name: 'Reporting Gaps', value: range(5, 25, hash + 4) },
          { name: 'Compliance Process', value: range(5, 30, hash + 5) },
        ],
      },
      legalHistoryScore: range(baseScore - 10, baseScore + 5, hash + 6),
      legalRecord: {
        judgmentsCount: range(0, 3, hash + 7),
        litigationRisk: range(10, 50, hash + 8),
        recentCases: range(0, 2, hash + 9),
        pendingLitigation: range(0, 2, hash + 10),
      },
      businessDurationScore: range(baseScore - 5, baseScore + 10, hash + 11),
      businessAge: {
        yearsInBusiness: range(3, 20, hash + 12),
        industryPeerPercentile: range(60, 90, hash + 13),
        stabilityRating: range(70, 95, hash + 14),
        historicalConsistency: range(75, 95, hash + 15),
      },
      industryReputationScore: range(baseScore, baseScore + 15, hash + 16),
      reputation: {
        marketPerception: range(75, 95, hash + 17),
        publicSentiment: range(70, 95, hash + 18),
        customerSatisfaction: range(80, 95, hash + 19),
        industryAwards: range(0, 5, hash + 20),
      },
      businessStabilityScore: range(baseScore - 5, baseScore + 10, hash + 21),
      stability: {
        cashFlowConsistency: range(70, 95, hash + 22),
        revenueGrowth: range(60, 100, hash + 23),
        employeeRetention: range(65, 95, hash + 24),
        marketPositionStrength: range(60, 95, hash + 25),
      },
    };
  };

  useEffect(() => {
    // Load data and find appropriate transaction
    const loadData = async () => {
      try {
        // Start loading - only show loading indicators for new fetches, not for cached data
        const shouldShowLoadingIndicator = !currentTransaction || transactions.length === 0;

        if (shouldShowLoadingIndicator) {
          setIsLoading(true);
        }
        setError(null);

        // First check if we already have a valid current transaction
        if (currentTransaction?.id && currentTransaction.currentStage === 'risk_assessment') {
          console.log('Risk Assessment: Using existing transaction', currentTransaction);
          // Set metrics immediately for better UX
          setMetrics(generateMetrics(currentTransaction.id));

          // Only fetch new transactions if our cached list is empty
          if (transactions.length === 0) {
            fetchTransactions().catch(console.error);
          }
          setIsLoading(false);
          return;
        }

        // Start transaction fetch and immediately look for cached transactions in risk assessment
        const fetchPromise = fetchTransactions();

        // Optimistically check for a usable transaction in current cache
        const riskTransaction = transactions.find(
          (t: { currentStage: string }) => t.currentStage === 'risk_assessment'
        );
        if (riskTransaction) {
          console.log(
            'Risk Assessment: Found cached transaction in risk_assessment stage:',
            riskTransaction
          );
          setCurrentTransaction(riskTransaction);
          setMetrics(generateMetrics(riskTransaction.id));
          // Continue fetch in background but don't block UI
          fetchPromise.catch(console.error);
          setIsLoading(false);
          return;
        }

        // Wait for fetch to complete if we didn't find a transaction
        await fetchPromise;
        console.log('Risk Assessment: Fetched transactions, count:', transactions.length);

        // Find a transaction in risk_assessment stage
        const freshRiskTransaction = transactions.find(
          (t: { currentStage: string }) => t.currentStage === 'risk_assessment'
        );

        if (freshRiskTransaction) {
          console.log(
            'Risk Assessment: Found transaction in risk_assessment stage:',
            freshRiskTransaction
          );
          setCurrentTransaction(freshRiskTransaction);
          setMetrics(generateMetrics(freshRiskTransaction.id));
        } else {
          console.log('Risk Assessment: No transactions found in risk_assessment stage');
          setError(
            'No transactions in risk assessment stage. Please create or advance a transaction to risk assessment.'
          );
        }
      } catch (err) {
        console.error('Error loading risk assessment data:', err);
        setError('Failed to load risk assessment data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentTransaction, fetchTransactions, setCurrentTransaction, transactions]);

  // Check URL parameters to determine which modal to open
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const docParam = query.get('doc');
    const advisorParam = query.get('advisor');

    // Handle document verification opening
    if (docParam === 'verification') {
      setShowDocumentVerification(true);
    }

    // Handle risk advisor opening
    if (advisorParam === 'mitigation') {
      setShowRiskMitigationStrategies(true);
    } else if (advisorParam === 'benchmarking') {
      setShowIndustryBenchmarking(true);
    }

    // Clear the parameters from URL to prevent reopening on refresh
    if (docParam || advisorParam) {
      navigate('/risk-assessment', { replace: true });
    }
  }, [location.search, navigate]);

  // Modal handlers
  const handleOrchestratorOpen = () => setShowDataOrchestrator(true);
  const handleOrchestratorClose = () => setShowDataOrchestrator(false);
  const handleDocumentVerificationOpen = () => setShowDocumentVerification(true);
  const handleDocumentVerificationClose = () => setShowDocumentVerification(false);
  const handleRiskMitigationOpen = () => setShowRiskMitigationStrategies(true);
  const handleRiskMitigationClose = () => setShowRiskMitigationStrategies(false);
  const handleIndustryBenchmarkingOpen = () => setShowIndustryBenchmarking(true);
  const handleIndustryBenchmarkingClose = () => setShowIndustryBenchmarking(false);

  const goToNextStage = async () => {
    if (!currentTransaction) return;

    try {
      const nextStage = 'deal_structuring';
      await advanceStage(currentTransaction.id, nextStage);
      navigate('/deal-structuring');
    } catch (err) {
      console.error('Error advancing to next stage:', err);
      setError('Failed to advance to next stage. Please try again.');
    }
  };

  // Replace the mock API functions with real API calls

  const submitHumanInLoopRequest = async (
    data: HumanInLoopFormData,
    transactionId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const apiRequest: HumanInLoopRequest = {
        transactionId,
        reason: data.reason,
        notes: data.notes,
        priority: data.priority,
        requestedBy: userId,
      };

      const response = await riskDecisionService.requestHumanReview(apiRequest);

      if (response.success && response.data) {
        return true;
      }
      throw new Error(response.error || 'Failed to submit request');
    } catch (error) {
      console.error('Error submitting human-in-loop request:', error);
      throw error;
    }
  };

  const submitHardDecline = async (
    data: HardDeclineFormData,
    transactionId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const apiRequest: HardDeclineRequest = {
        transactionId,
        reason: data.reason,
        comments: data.comments,
        declinedBy: userId,
      };

      const response = await riskDecisionService.hardDeclineTransaction(apiRequest);

      if (response.success) {
        return true;
      }
      throw new Error(response.error || 'Failed to submit hard decline');
    } catch (error) {
      console.error('Error submitting hard decline:', error);
      throw error;
    }
  };

  const submitSoftDecline = async (
    data: SoftDeclineFormData,
    transactionId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      const apiRequest: SoftDeclineRequest = {
        transactionId,
        reason: data.reason,
        stepsToOvercome: data.stepsToOvercome,
        reconsiderationTimeline: data.reconsiderationTimeline,
        declinedBy: userId,
      };

      const response = await riskDecisionService.softDeclineTransaction(apiRequest);

      if (response.success) {
        return true;
      }
      throw new Error(response.error || 'Failed to submit soft decline');
    } catch (error) {
      console.error('Error submitting soft decline:', error);
      throw error;
    }
  };

  const fetchPendingRequests = async (transactionId: string): Promise<PendingRequest[]> => {
    try {
      const response = await riskDecisionService.getPendingRequests(transactionId);

      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  };

  // Replace the form submission handler with API integration
  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setApiError(null);

    try {
      if (!currentTransaction?.id) {
        throw new Error('No transaction selected');
      }

      // Just use a default user ID since we don't know the exact type structure
      const userId = 'current-user';

      let success = false;

      switch (modalType) {
        case 'humanInLoop':
          success = await submitHumanInLoopRequest(humanInLoopForm, currentTransaction.id, userId);
          break;
        case 'hardDecline':
          success = await submitHardDecline(hardDeclineForm, currentTransaction.id, userId);
          break;
        case 'softDecline':
          success = await submitSoftDecline(softDeclineForm, currentTransaction.id, userId);
          break;
      }

      if (success) {
        setShowModal(false);
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setApiError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the useEffect hook to fetch pending requests
  useEffect(() => {
    const loadPendingRequests = async () => {
      if (currentTransaction?.id) {
        try {
          const requests = await fetchPendingRequests(currentTransaction.id);
          setPendingRequests(requests);
        } catch (error) {
          console.error('Error loading pending requests:', error);
        }
      }
    };

    loadPendingRequests();
  }, [currentTransaction?.id]);

  // Render the accordion sections with detailed metrics
  const renderMetricsAccordions = () => {
    if (!metrics) return null;

    return (
      <div className="space-y-4">
        <RiskAccordionItem
          title="Compliance with Regulations"
          score={metrics.complianceScore}
          defaultOpen={true}
          metrics={[
            {
              label: 'Coverage',
              value: metrics.regulatoryCompliance.complianceCoverage,
              unit: '%',
            },
            {
              label: 'Risk Exposure',
              value: metrics.regulatoryCompliance.riskExposures[0]?.value || 0,
              unit: '/100',
            },
          ]}
        >
          <RiskMetricsDisplay metrics={metrics} category="compliance" />
        </RiskAccordionItem>

        <RiskAccordionItem
          title="Legal History"
          score={metrics.legalHistoryScore}
          metrics={[
            {
              label: 'Judgments',
              value: metrics.legalRecord.judgmentsCount,
            },
            {
              label: 'Litigation Risk',
              value: metrics.legalRecord.litigationRisk,
              unit: '%',
            },
            {
              label: 'Pending Cases',
              value: metrics.legalRecord.pendingLitigation,
            },
          ]}
        >
          <RiskMetricsDisplay metrics={metrics} category="legal" />
        </RiskAccordionItem>

        <RiskAccordionItem
          title="Business Duration"
          score={metrics.businessDurationScore}
          metrics={[
            {
              label: 'Years in Business',
              value: metrics.businessAge.yearsInBusiness,
              unit: ' yrs',
            },
            {
              label: 'Industry Percentile',
              value: metrics.businessAge.industryPeerPercentile,
              unit: '%',
            },
          ]}
        >
          <RiskMetricsDisplay metrics={metrics} category="duration" />
        </RiskAccordionItem>

        <RiskAccordionItem
          title="Industry Reputation"
          score={metrics.industryReputationScore}
          metrics={[
            {
              label: 'Market Perception',
              value: metrics.reputation.marketPerception,
              unit: '/100',
            },
            {
              label: 'Customer Satisfaction',
              value: metrics.reputation.customerSatisfaction,
              unit: '/100',
            },
          ]}
        >
          <RiskMetricsDisplay metrics={metrics} category="reputation" />
        </RiskAccordionItem>

        <RiskAccordionItem
          title="Business Stability"
          score={metrics.businessStabilityScore}
          metrics={[
            {
              label: 'Cash Flow Consistency',
              value: metrics.stability.cashFlowConsistency,
              unit: '/100',
            },
            {
              label: 'Revenue Growth',
              value: metrics.stability.revenueGrowth,
              unit: '/100',
            },
          ]}
        >
          <RiskMetricsDisplay metrics={metrics} category="stability" />
        </RiskAccordionItem>
      </div>
    );
  };

  // Use location to determine which tab should be active
  const getInitialTabFromPath = () => {
    const path = location.pathname;
    // First check for query parameter
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    
    if (tabParam) {
      // If tab param exists, use it directly
      if (['standard', 'report', 'lab', 'score'].includes(tabParam)) {
        return tabParam as 'standard' | 'report' | 'lab' | 'score';
      }
    }
    
    // Fall back to path-based determination
    if (path.includes('/risk-assessment/report')) return 'report';
    if (path.includes('/risk-assessment/lab')) return 'lab';
    if (path.includes('/risk-assessment/score')) return 'score';
    if (path.includes('/risk-assessment/standard')) return 'standard';
    return 'standard'; // Default tab
  };

  const [assessmentView, setAssessmentView] = useState<'standard' | 'report' | 'lab' | 'score'>(
    getInitialTabFromPath()
  );

  // Sync URL with selected tab
  useEffect(() => {
    const path =
      assessmentView === 'standard'
        ? '/risk-assessment/standard'
        : `/risk-assessment/${assessmentView}`;

    // Only navigate if the path is different to avoid unnecessary history entries
    if (location.pathname !== path) {
      navigate(path, { replace: true });
    }
  }, [assessmentView, navigate, location.pathname]);

  // Synchronize with URL changes (e.g., from sidebar navigation)
  useEffect(() => {
    const newView = getInitialTabFromPath();
    if (newView !== assessmentView) {
      setAssessmentView(newView);
    }
  }, [location.pathname, location.search]);

  // Loading state
  if (isLoading || storeLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-gray-500 mb-4">Loading risk assessment data...</div>
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || storeError) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-500 mb-4">{error || (storeError && storeError.message)}</div>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              fetchTransactions().finally(() => setIsLoading(false));
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!currentTransaction) {
    return (
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Automated risk analysis and credit evaluation
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">No active transaction selected.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Custom TopNavigation for this page */}
      <TopNavigation title="Risk Assessment" />

      {/* Section Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Risk Map Navigator</h1>
        <p className="text-gray-600">Comprehensive analysis of risk factors for this transaction</p>
      </div>

      {/* Assessment View Selector */}
      <div className="mb-6">
        {/* Assessment View Toggle */}
        <div className="inline-flex rounded-md shadow-sm w-full sm:w-auto" role="group">
          <button
            type="button"
            onClick={() => {
              setAssessmentView('standard');
              navigate('/risk-assessment/standard', { replace: true });
            }}
            className={`flex-1 sm:flex-auto px-3 py-2 text-sm font-medium border ${
              assessmentView === 'standard'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-l-md`}
            aria-current={assessmentView === 'standard' ? 'page' : undefined}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => {
              setAssessmentView('report');
              navigate('/risk-assessment/report', { replace: true });
            }}
            className={`flex-1 sm:flex-auto px-3 py-2 text-sm font-medium border ${
              assessmentView === 'report'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={assessmentView === 'report' ? 'page' : undefined}
          >
            Eva Risk Report
          </button>
          <button
            type="button"
            onClick={() => {
              setAssessmentView('lab');
              navigate('/risk-assessment/lab', { replace: true });
            }}
            className={`flex-1 sm:flex-auto px-3 py-2 text-sm font-medium border ${
              assessmentView === 'lab'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={assessmentView === 'lab' ? 'page' : undefined}
          >
            RiskLab
          </button>
          <button
            type="button"
            onClick={() => {
              setAssessmentView('score');
              navigate('/risk-assessment/score', { replace: true });
            }}
            className={`flex-1 sm:flex-auto px-3 py-2 text-sm font-medium border ${
              assessmentView === 'score'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            } rounded-r-md`}
            aria-current={assessmentView === 'score' ? 'page' : undefined}
          >
            Eva Score
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Risk Assessment Component */}
        <div className="lg:col-span-2">
          {/* Assessment content based on the selected view */}
          {assessmentView === 'standard' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">{renderMetricsAccordions()}</div>
            </div>
          )}

          {assessmentView === 'report' && <RiskMapSelector />}

          {assessmentView === 'lab' && <RiskLab />}

          {assessmentView === 'score' && <EvaScore />}
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Summary</h3>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="text-sm font-medium">{currentTransaction?.id || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Applicant</p>
                <p className="text-sm font-medium">
                  {currentTransaction?.applicantData?.name || 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Transaction Type</p>
                <p className="text-sm font-medium">{currentTransaction?.type || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-sm font-medium">
                  ${(currentTransaction?.amount || 0).toLocaleString()}
                </p>
              </div>

              {currentTransaction?.details?.purpose && (
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="text-sm font-medium">{currentTransaction.details.purpose}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => {
                    // Logic to approve and continue to deal structuring
                    navigate('/deal-structuring', {
                      state: { transactionId: currentTransaction?.id },
                    });
                  }}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve & Continue to Deal Structuring
                </button>

                <button
                  onClick={() => {
                    // Logic for human in the loop - request account manager call
                    setShowModal(true);
                    setModalType('humanInLoop');
                  }}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                >
                  Human in the Loop - Request Call
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      // Logic for hard decline
                      setShowModal(true);
                      setModalType('hardDecline');
                    }}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Hard Decline
                  </button>

                  <button
                    onClick={() => {
                      // Logic for soft decline
                      setShowModal(true);
                      setModalType('softDecline');
                    }}
                    className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                  >
                    Soft Decline
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for different actions */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalType === 'humanInLoop' && 'Request Account Manager Call'}
                    {modalType === 'hardDecline' && 'Hard Decline Transaction'}
                    {modalType === 'softDecline' && 'Soft Decline Transaction'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {apiError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                    {apiError}
                  </div>
                )}

                {modalType === 'humanInLoop' && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Request an account manager or processor to contact the applicant for
                      additional information.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Call
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={humanInLoopForm.reason}
                          onChange={e =>
                            setHumanInLoopForm(prev => ({ ...prev, reason: e.target.value }))
                          }
                        >
                          <option value="additional_info">Need Additional Information</option>
                          <option value="verify_identity">Verify Identity</option>
                          <option value="discuss_terms">Discuss Potential Terms</option>
                          <option value="explain_requirements">
                            Explain Documentation Requirements
                          </option>
                          <option value="other">Other Reason</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes for Account Manager
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Provide details about what the account manager should discuss..."
                          value={humanInLoopForm.notes}
                          onChange={e =>
                            setHumanInLoopForm(prev => ({ ...prev, notes: e.target.value }))
                          }
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="priority"
                              value="low"
                              className="h-4 w-4 text-primary-600 border-gray-300"
                              checked={humanInLoopForm.priority === 'low'}
                              onChange={() =>
                                setHumanInLoopForm(prev => ({ ...prev, priority: 'low' }))
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">Low</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="priority"
                              value="medium"
                              className="h-4 w-4 text-primary-600 border-gray-300"
                              checked={humanInLoopForm.priority === 'medium'}
                              onChange={() =>
                                setHumanInLoopForm(prev => ({ ...prev, priority: 'medium' }))
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">Medium</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="priority"
                              value="high"
                              className="h-4 w-4 text-primary-600 border-gray-300"
                              checked={humanInLoopForm.priority === 'high'}
                              onChange={() =>
                                setHumanInLoopForm(prev => ({ ...prev, priority: 'high' }))
                              }
                            />
                            <span className="ml-2 text-sm text-gray-700">High</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'hardDecline' && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Provide a reason for the hard decline. Hard declines cannot be overcome and
                      will require a new application.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Decline Reason
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={hardDeclineForm.reason}
                          onChange={e =>
                            setHardDeclineForm(prev => ({ ...prev, reason: e.target.value }))
                          }
                        >
                          <option value="credit_score">Insufficient Credit Score</option>
                          <option value="identity_verification">
                            Failed Identity Verification
                          </option>
                          <option value="compliance_issue">Compliance/Regulatory Issue</option>
                          <option value="fraud_risk">Suspected Fraud</option>
                          <option value="bankruptcy">Recent Bankruptcy</option>
                          <option value="other">Other Reason</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Comments
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Provide additional details about the decline reason..."
                          value={hardDeclineForm.comments}
                          onChange={e =>
                            setHardDeclineForm(prev => ({ ...prev, comments: e.target.value }))
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'softDecline' && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Provide a reason for the soft decline and steps the applicant can take to
                      overcome the issue.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Decline Reason
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={softDeclineForm.reason}
                          onChange={e =>
                            setSoftDeclineForm(prev => ({ ...prev, reason: e.target.value }))
                          }
                        >
                          <option value="missing_documents">Missing Documentation</option>
                          <option value="insufficient_income">
                            Insufficient Income Verification
                          </option>
                          <option value="time_in_business">Insufficient Time in Business</option>
                          <option value="collateral_issue">Collateral Valuation Issue</option>
                          <option value="debt_ratio">High Debt-to-Income Ratio</option>
                          <option value="other">Other Reason</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Steps to Overcome
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Describe what the applicant can do to overcome this issue..."
                          value={softDeclineForm.stepsToOvercome}
                          onChange={e =>
                            setSoftDeclineForm(prev => ({
                              ...prev,
                              stepsToOvercome: e.target.value,
                            }))
                          }
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reconsideration Timeline
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          value={softDeclineForm.reconsiderationTimeline}
                          onChange={e =>
                            setSoftDeclineForm(prev => ({
                              ...prev,
                              reconsiderationTimeline: e.target.value,
                            }))
                          }
                        >
                          <option value="immediate">Immediate - When Issues Resolved</option>
                          <option value="30days">After 30 Days</option>
                          <option value="60days">After 60 Days</option>
                          <option value="90days">After 90 Days</option>
                          <option value="custom">Custom Timeline</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </span>
                    ) : modalType === 'humanInLoop' ? (
                      'Request Call'
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success notification */}
          {showSuccessNotification && (
            <div className="fixed bottom-4 right-4 bg-green-50 shadow-lg rounded-lg p-4 z-10 border border-green-200 max-w-md">
              <div className="flex items-start">
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
                  <h3 className="text-sm font-medium text-green-800">Action Submitted</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your action has been submitted successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pending Requests Tracking Component */}
          {pendingRequests.length > 0 && (
            <div className="bg-white shadow rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                <button
                  onClick={() => setShowPendingRequests(!showPendingRequests)}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  {showPendingRequests ? 'Hide' : 'Show'}
                </button>
              </div>

              {showPendingRequests && (
                <div className="space-y-3">
                  {pendingRequests.map(request => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm font-medium">
                            {request.type === 'humanInLoop'
                              ? 'Account Manager Call'
                              : request.type === 'hardDecline'
                                ? 'Hard Decline'
                                : 'Soft Decline'}
                          </span>
                          <p className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'inProgress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {request.status === 'pending'
                            ? 'Pending'
                            : request.status === 'inProgress'
                              ? 'In Progress'
                              : 'Completed'}
                        </span>
                      </div>

                      {request.type === 'humanInLoop' && (
                        <div className="text-xs text-gray-600">
                          <p>
                            <span className="font-medium">Reason:</span>{' '}
                            {(request.data as HumanInLoopFormData).reason.replace(/_/g, ' ')}
                          </p>
                          <p>
                            <span className="font-medium">Priority:</span>{' '}
                            {(request.data as HumanInLoopFormData).priority}
                          </p>
                        </div>
                      )}

                      {/* View more button - could expand to show full details */}
                      <button className="mt-2 text-xs text-primary-600 hover:text-primary-800">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!showPendingRequests && (
                <div className="text-sm text-gray-500">
                  You have {pendingRequests.length} pending request
                  {pendingRequests.length > 1 ? 's' : ''}.
                </div>
              )}
            </div>
          )}

          {/* Show time metrics component */}
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Process Metrics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Current Stage</p>
                <p className="text-sm font-medium capitalize">
                  {currentTransaction.currentStage.replace(/_/g, ' ')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="text-sm font-medium">
                  {currentTransaction.createdAt
                    ? new Date(currentTransaction.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Risk Tier</p>
                <div className="mt-1">
                  {metrics && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full 
                      ${
                        metrics.complianceScore >= 80
                          ? 'bg-green-100 text-green-800'
                          : metrics.complianceScore >= 65
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {metrics.complianceScore >= 80
                        ? 'Low Risk'
                        : metrics.complianceScore >= 65
                          ? 'Medium Risk'
                          : 'High Risk'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI Risk Advisor</h3>
            <p className="text-sm text-gray-500 mb-4">
              Get intelligent insights on risk mitigation strategies
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <button
                onClick={handleRiskMitigationOpen}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Risk Mitigation
              </button>

              <button
                onClick={handleIndustryBenchmarkingOpen}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Industry Benchmarking
              </button>

              <button
                onClick={handleDocumentVerificationOpen}
                className="w-full flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg
                  className="mr-3 h-5 w-5 text-gray-400"
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
                Verify Documents
              </button>

              <button
                onClick={handleOrchestratorOpen}
                className="w-full col-span-1 sm:col-span-2 lg:col-span-1 flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
              >
                <svg
                  className="mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                Data Orchestrator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Orchestrator Modal */}
      {showDataOrchestrator && (
        <IntelligentDataOrchestrator
          isOpen={showDataOrchestrator}
          onClose={handleOrchestratorClose}
          transactionId={currentTransaction.id}
        />
      )}

      {/* Document Verification Modal */}
      {showDocumentVerification && (
        <DocumentVerificationWrapper
          isOpen={showDocumentVerification}
          onClose={handleDocumentVerificationClose}
        />
      )}

      {/* Risk Mitigation Modal */}
      {showRiskMitigationStrategies && (
        <RiskAdvisorWrapper
          isOpen={showRiskMitigationStrategies}
          onClose={handleRiskMitigationClose}
          mode="mitigation"
        />
      )}

      {/* Industry Benchmarking Modal */}
      {showIndustryBenchmarking && (
        <RiskAdvisorWrapper
          isOpen={showIndustryBenchmarking}
          onClose={handleIndustryBenchmarkingClose}
          mode="benchmarking"
        />
      )}
    </div>
  );
};

export default RiskAssessment;
