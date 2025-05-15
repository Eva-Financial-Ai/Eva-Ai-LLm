import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import ErrorBoundary from '../common/ErrorBoundary';
import performanceMonitor from '../../utils/performance';
import { RiskMapType } from './RiskMapNavigator';
import { useRiskScores } from '../../hooks/useRiskCategoryData';
import { RiskCriteria } from './RiskCriteriaConfig';
import RiskReportPaywall from './RiskReportPaywall';
import riskMapService from './RiskMapService';

// Custom loading fallback component
const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-primary-600 text-lg">{message}</p>
    </div>
  );
};

// Simple skeleton loader
const SkeletonLoader = ({ rows = 3, className = '' }: { rows?: number; className?: string }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded mb-3"
          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
        ></div>
      ))}
    </div>
  );
};

// Define types for risk categories and view modes
export type RiskCategory =
  | 'all'
  | 'credit'
  | 'capacity'
  | 'collateral'
  | 'capital'
  | 'conditions'
  | 'character'
  | 'customer_retention';
export type ViewMode = 'standard' | 'detailed' | 'summary';

interface RiskScore {
  value: number;
  label: string;
  color: string;
}

interface RiskMapOptimizedProps {
  transactionId?: string;
  initialCategory?: RiskCategory;
  viewMode?: ViewMode;
  riskMapType?: RiskMapType;
  customCriteria?: RiskCriteria[];
}

// Lazy-loaded components using React.lazy
const RiskScoreChart = React.lazy(() => import('./RiskScoreChart'));
const RiskCategoryDetail = React.lazy(() => import('./RiskCategoryDetail'));

// Memo-wrapped ScoreDisplay to prevent unnecessary re-renders
const ScoreDisplay = React.memo(({ score }: { score: RiskScore }) => {
  // Calculate styles based on score
  const ringColor = useMemo(() => {
    if (score.value >= 80) return 'ring-green-500';
    if (score.value >= 60) return 'ring-blue-500';
    if (score.value >= 40) return 'ring-yellow-500';
    return 'ring-red-500';
  }, [score.value]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full h-24 w-24 flex items-center justify-center ring-4 ${ringColor} bg-white`}
      >
        <span className="text-3xl font-bold">{score.value}</span>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{score.label}</span>
    </div>
  );
});

export const RiskMapOptimized: React.FC<RiskMapOptimizedProps> = ({
  transactionId,
  initialCategory = 'all',
  viewMode = 'standard',
  riskMapType: propRiskMapType,
  customCriteria = []
}) => {
  const { currentTransaction, fetchTransactions, loading: contextLoading } = useWorkflow();
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>(initialCategory);
  const [riskMapType, setRiskMapType] = useState<RiskMapType>(propRiskMapType || 'unsecured');
  const [activeViewMode, setActiveViewMode] = useState<ViewMode>(viewMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [reportPurchased, setReportPurchased] = useState(false);
  
  console.log(`[RiskMapOptimized] Rendering with category: ${initialCategory}, viewMode: ${viewMode}, type: ${riskMapType}`);
  
  // Update local state when props change
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);
  
  useEffect(() => {
    setActiveViewMode(viewMode);
  }, [viewMode]);
  
  useEffect(() => {
    if (propRiskMapType) {
      setRiskMapType(propRiskMapType);
    }
  }, [propRiskMapType]);
  
  // Use our new hook for fetching risk scores
  const { loading: scoresLoading, error: scoresError, scores: apiScores } = useRiskScores(
    transactionId || currentTransaction?.id
  );
  
  // Define default colors for risk categories
  const categoryColors: Record<RiskCategory, string> = {
    credit: '#4F46E5',
    capacity: '#10B981',
    collateral: '#F59E0B',
    capital: '#3B82F6',
    conditions: '#8B5CF6',
    character: '#EC4899',
    all: '#6366F1',
    customer_retention: '#059669'
  };

  // Convert API scores to RiskScore objects with labels and colors
  const riskScores: Record<RiskCategory, RiskScore> = useMemo(() => {
    const result: Record<string, RiskScore> = {} as any;
    
    // Get the categories we need to create scores for
    const categories: RiskCategory[] = [
      'credit', 
      'capacity', 
      'collateral', 
      'capital', 
      'conditions', 
      'character', 
      'all', 
      'customer_retention'
    ];
    
    // Create score objects for each category
    categories.forEach(category => {
      result[category] = {
        value: apiScores?.[category] || 0,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        color: categoryColors[category]
      };
    });
    
    return result;
  }, [apiScores, categoryColors]);

  const isTxIdProvided = Boolean(transactionId);
  const effectiveTransactionId = transactionId || currentTransaction?.id;

  // Memoize effective transaction data
  const effectiveTransaction = useMemo(() => {
    if (transactionId && currentTransaction?.id !== transactionId) {
      return null;
    }
    return currentTransaction;
  }, [transactionId, currentTransaction]);

  // Handle category selection with useCallback
  const handleCategorySelect = useCallback(
    (category: RiskCategory) => {
      console.log(`[RiskMapOptimized] Selecting category: ${category}`);
      setSelectedCategory(category);
    },
    []
  );

  // Effect to initialize data when component mounts
  useEffect(() => {
    console.log('[RiskMapOptimized] Component mounted, initializing...');

    const init = async () => {
      if (!effectiveTransactionId && !contextLoading) {
        try {
          console.log('[RiskMapOptimized] No transaction selected, fetching transactions...');
          setIsLoading(true);
          await fetchTransactions();
          setIsLoading(false);
        } catch (err) {
          console.error('[RiskMapOptimized] Error fetching transactions:', err);
          setError('Failed to fetch transactions. Please try again.');
          setIsLoading(false);
        }
      }
    };

    init();

    // Cleanup
    return () => {
      console.log('[RiskMapOptimized] Component unmounting...');
    };
  }, [
    effectiveTransactionId,
    fetchTransactions,
    contextLoading
  ]);

  // Handle errors from the scores hook
  useEffect(() => {
    if (scoresError) {
      setError(scoresError);
    }
  }, [scoresError]);

  // Memoized category score
  const selectedCategoryScore = useMemo(() => {
    return riskScores[selectedCategory];
  }, [riskScores, selectedCategory]);

  // Memoized chart data
  const chartData = useMemo(() => {
    return Object.keys(riskScores)
      .filter(key => key !== 'all')
      .map(key => ({
        label: riskScores[key as RiskCategory].label,
        value: riskScores[key as RiskCategory].value,
        color: riskScores[key as RiskCategory].color,
      }));
  }, [riskScores]);

  // Determine if we're in a loading state
  const loading = isLoading || contextLoading || scoresLoading;

  // New function to determine status for a criterion
  const getCriterionStatus = (criterionId: string, value: number | string) => {
    // Find matching criterion in custom criteria
    const criterion = customCriteria.find(c => c.id === criterionId);
    
    if (!criterion) return { status: 'average', label: 'Average' };
    
    // Check which range the value falls into
    for (const range of criterion.ranges) {
      // For numeric values
      if (typeof value === 'number' && typeof range.min === 'number' && typeof range.max === 'number') {
        if (value >= range.min && value <= range.max) {
          return { status: range.status, label: range.label, points: range.points };
        }
      } 
      // For string values, exact match with min (for simplicity)
      else if (typeof value === 'string' && value === range.min) {
        return { status: range.status, label: range.label, points: range.points };
      }
    }
    
    return { status: 'average', label: 'Average' };
  };

  // Enhance the summary view to display configured criteria
  const renderSummaryView = () => {
    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      );
    }

    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Risk Assessment Summary
        </h3>
        
        <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
          <div className="mr-4">
            <ScoreDisplay score={riskScores.all} />
          </div>
          <div>
            <h4 className="font-medium">Overall Score</h4>
            <p className="text-sm text-gray-600">Based on all risk factors</p>
          </div>
        </div>
        
        {/* Display criteria summary table with configured ranges */}
        <div className="mt-6">
          <h4 className="font-medium mb-4">Risk Assessment Criteria</h4>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Data Point</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Good</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Average</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Negative</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Current Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customCriteria.length > 0 ? (
                  // Group criteria by category for better display using array methods instead of Set directly
                  Array.from(new Set(customCriteria.map(c => c.category))).map(category => (
                    <React.Fragment key={category}>
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-4 py-2 text-sm font-medium text-gray-700">
                          {category}
                        </td>
                      </tr>
                      {customCriteria
                        .filter(c => c.category === category)
                        .map((criterion) => {
                          // For demo purposes: random value that might be within the ranges
                          const randomValue = typeof criterion.ranges[0].min === 'number' 
                            ? Math.floor(Math.random() * 100) 
                            : criterion.ranges[Math.floor(Math.random() * criterion.ranges.length)].min;
                          
                          const valueStatus = getCriterionStatus(criterion.id, randomValue);
                          
                          return (
                            <tr key={criterion.id}>
                              <td className="px-4 py-2 text-sm text-gray-500">{category}</td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{criterion.name}</td>
                              <td className="px-4 py-2 text-sm text-green-600">
                                {criterion.ranges.find(r => r.status === 'good')?.min} - {criterion.ranges.find(r => r.status === 'good')?.max}
                              </td>
                              <td className="px-4 py-2 text-sm text-yellow-600">
                                {criterion.ranges.find(r => r.status === 'average')?.min} - {criterion.ranges.find(r => r.status === 'average')?.max}
                              </td>
                              <td className="px-4 py-2 text-sm text-red-600">
                                {criterion.ranges.find(r => r.status === 'negative')?.min} - {criterion.ranges.find(r => r.status === 'negative')?.max}
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{randomValue}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  valueStatus.status === 'good' ? 'bg-green-100 text-green-800' :
                                  valueStatus.status === 'average' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {valueStatus.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-sm text-gray-500 text-center">
                      No custom criteria configured. Use the "Configure Criteria" button to set up risk assessment criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Check if report is purchased on mount
  useEffect(() => {
    const checkReportAccess = () => {
      const isPurchased = riskMapService.isReportPurchased(
        transactionId || currentTransaction?.id || '',
        riskMapType
      );
      setReportPurchased(isPurchased);
    };
    
    checkReportAccess();
  }, [transactionId, currentTransaction, riskMapType]);

  // Handle purchase completion
  const handlePurchaseComplete = () => {
    setShowPaywall(false);
    setReportPurchased(true);
  };

  // Modify the renderContent function to include the paywall check
  const renderContent = () => {
    // If the report hasn't been purchased, render a preview with paywall
    if (!reportPurchased && !loading) {
      return (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="h-10 w-10 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Full Risk Report Available</h3>
            <p className="text-gray-600 mb-6">
              Purchase this report to view detailed risk analysis, scores, and recommendations.
            </p>
            <button
              onClick={() => setShowPaywall(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
            >
              Purchase Report
            </button>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      );
    }
    
    switch (activeViewMode) {
      case 'summary':
        return renderSummaryView();
        
      case 'detailed':
        return (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                {selectedCategory === 'all'
                  ? 'Detailed Risk Profile Analysis'
                  : `Detailed ${selectedCategoryScore.label} Assessment`}
              </h3>

              <ScoreDisplay score={selectedCategoryScore} />
            </div>

            <div className="mt-6">
              <Suspense fallback={<LoadingFallback message="Loading chart data..." />}>
                <RiskScoreChart data={chartData} selectedCategory={selectedCategory} />
              </Suspense>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <Suspense fallback={<SkeletonLoader rows={8} className="mt-4" />}>
                <RiskCategoryDetail
                  category={selectedCategory}
                  score={selectedCategoryScore.value}
                  transactionId={effectiveTransactionId}
                  riskMapType={riskMapType}
                />
              </Suspense>
            </div>
          </>
        );
        
      default: // standard view
        return (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                {selectedCategory === 'all'
                  ? 'Overall Risk Profile'
                  : `${selectedCategoryScore.label} Assessment`}
              </h3>

              <ScoreDisplay score={selectedCategoryScore} />
            </div>

            <div className="mt-6">
              <Suspense fallback={<LoadingFallback message="Loading chart data..." />}>
                <RiskScoreChart data={chartData} selectedCategory={selectedCategory} />
              </Suspense>
            </div>

            {selectedCategory !== 'all' && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <Suspense fallback={<SkeletonLoader rows={8} className="mt-4" />}>
                  <RiskCategoryDetail
                    category={selectedCategory}
                    score={selectedCategoryScore.value}
                    transactionId={effectiveTransactionId}
                    riskMapType={riskMapType}
                  />
                </Suspense>
              </div>
            )}
          </>
        );
    }
  };

  // Render error state
  if (error) {
    return (
      <ErrorBoundary
        fallback={
          <div className="bg-white shadow rounded-lg overflow-hidden p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Error Loading Risk Assessment
            </h2>
            <p className="text-red-500 mb-4">
              There was a problem loading the risk assessment data.
            </p>
            <button
              onClick={() => {
                setError(null);
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Try Again
            </button>
          </div>
        }
      >
        <div className="p-6">
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error}
              </p>
              <button
                onClick={() => {
                  setError(null);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Error Loading Risk Assessment</h2>
          <p className="text-red-500 mb-4">There was a problem loading the risk assessment data.</p>
          <button
            onClick={() => {
              setError(null);
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      }
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Risk Assessment{' '}
            {effectiveTransaction?.applicantData?.name
              ? `for ${effectiveTransaction.applicantData.name}`
              : ''}
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Payment Paywall */}
      {showPaywall && (
        <RiskReportPaywall
          riskMapType={riskMapType}
          onPurchaseComplete={handlePurchaseComplete}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </ErrorBoundary>
  );
};

export default RiskMapOptimized;
