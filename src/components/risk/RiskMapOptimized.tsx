import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import ErrorBoundary from '../common/ErrorBoundary';
import performanceMonitor from '../../utils/performance';
import { RiskMapType } from './RiskMapNavigator';
import { useRiskScores } from '../../hooks/useRiskCategoryData';

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
}

// Lazy-loaded components using React.lazy
const RiskScoreChart = React.lazy(() => import('./RiskScoreChart'));
const RiskCategoryDetail = React.lazy(() => import('./RiskCategoryDetail'));
const RiskMapNavigator = React.lazy(() => import('./RiskMapNavigator'));

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
}) => {
  const { currentTransaction, fetchTransactions, loading: contextLoading } = useWorkflow();
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>(initialCategory);
  const [riskMapType, setRiskMapType] = useState<RiskMapType>('unsecured');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-6">
              Risk Assessment{' '}
              {effectiveTransaction?.applicantData?.name
                ? `for ${effectiveTransaction.applicantData.name}`
                : ''}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                <Suspense fallback={<SkeletonLoader rows={6} />}>
                  <RiskMapNavigator
                    selectedCategory={selectedCategory as string}
                    onCategorySelect={handleCategorySelect}
                    riskMapType={riskMapType}
                    onRiskMapTypeChange={setRiskMapType}
                    activeView="standard"
                    onViewChange={() => {}}
                  />
                </Suspense>
              </div>

              <div className="md:col-span-3">
                <div className="bg-gray-50 p-6 rounded-lg">
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
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
              <Suspense fallback={<SkeletonLoader rows={6} />}>
                <RiskMapNavigator
                  selectedCategory={selectedCategory as string}
                  onCategorySelect={handleCategorySelect}
                  riskMapType={riskMapType}
                  onRiskMapTypeChange={setRiskMapType}
                  activeView="standard"
                  onViewChange={() => {}}
                />
              </Suspense>
            </div>

            <div className="md:col-span-3">
              <div className="bg-gray-50 p-6 rounded-lg">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RiskMapOptimized;
