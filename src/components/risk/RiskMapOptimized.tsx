import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import ErrorBoundary, { LoadingFallback, SkeletonLoader } from '../common/ErrorBoundary';
import performanceMonitor from '../../utils/performance';

// Define types for risk categories and view modes
export type RiskCategory = 'credit' | 'capacity' | 'collateral' | 'capital' | 'conditions' | 'character' | 'all';
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
      <div className={`rounded-full h-24 w-24 flex items-center justify-center ring-4 ${ringColor} bg-white`}>
        <span className="text-3xl font-bold">{score.value}</span>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-700">{score.label}</span>
    </div>
  );
});

export const RiskMapOptimized: React.FC<RiskMapOptimizedProps> = ({ 
  transactionId,
  initialCategory = 'all',
  viewMode = 'standard'
}) => {
  const { currentTransaction, fetchTransactions, loading: contextLoading } = useWorkflow();
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>(initialCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState<Record<RiskCategory, boolean>>({
    credit: false,
    capacity: false,
    collateral: false,
    capital: false,
    conditions: false,
    character: false,
    all: false,
  });
  const [loadedCategories, setLoadedCategories] = useState<Set<RiskCategory>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [riskScores, setRiskScores] = useState<Record<RiskCategory, RiskScore>>({
    credit: { value: 0, label: 'Credit', color: '#4F46E5' },
    capacity: { value: 0, label: 'Capacity', color: '#10B981' },
    collateral: { value: 0, label: 'Collateral', color: '#F59E0B' },
    capital: { value: 0, label: 'Capital', color: '#3B82F6' },
    conditions: { value: 0, label: 'Conditions', color: '#8B5CF6' },
    character: { value: 0, label: 'Character', color: '#EC4899' },
    all: { value: 0, label: 'Overall', color: '#6366F1' },
  });
  
  const isTxIdProvided = Boolean(transactionId);
  const effectiveTransactionId = transactionId || currentTransaction?.id;
  
  // Memoize effective transaction data
  const effectiveTransaction = useMemo(() => {
    if (transactionId && currentTransaction?.id !== transactionId) {
      return null;
    }
    return currentTransaction;
  }, [transactionId, currentTransaction]);
  
  // Load risk data for a specific category with performance tracking
  const loadCategoryData = useCallback(async (category: RiskCategory) => {
    if (!effectiveTransactionId) {
      console.log('[RiskMapOptimized] No transaction ID available');
      setError('No transaction selected. Please select a transaction to view risk data.');
      return;
    }

    // If this category was already loaded, don't load it again
    if (loadedCategories.has(category)) {
      console.log(`[RiskMapOptimized] Category ${category} already loaded, skipping`);
      return;
    }
    
    console.log(`[RiskMapOptimized] Loading risk data for category ${category}, transaction ${effectiveTransactionId}`);
    
    // Set loading state only for this category
    setCategoryLoading(prev => ({
      ...prev,
      [category]: true
    }));
    
    setError(null);
    
    // Track performance
    const endTracking = performanceMonitor.monitorTransactionLoading();
    
    try {
      // In a real app, this would be an API call to get risk data
      // For demo purposes, we'll generate random scores
      const delay = category === 'all' ? 800 : 600; // Make certain categories load faster
      await new Promise(resolve => setTimeout(resolve, delay));
        
      // Generate consistent scores based on transaction ID
      const idHash = effectiveTransactionId.split('').reduce((a, b) => {
        return a + b.charCodeAt(0);
      }, 0);
      
      const generateScore = (base: number) => {
        return Math.min(100, Math.max(0, Math.floor(base + (Math.sin(idHash * base) * 15))));
      };
      
      // Only generate the score for this category (and "all" if needed)
      const newScores = { ...riskScores };
      
      if (category === 'all') {
        // Update all scores if loading the overview
        newScores.credit.value = generateScore(75);
        newScores.capacity.value = generateScore(82);
        newScores.collateral.value = generateScore(68);
        newScores.capital.value = generateScore(73);
        newScores.conditions.value = generateScore(88);
        newScores.character.value = generateScore(80);
        
        // Calculate overall score as average
        const sum = Object.keys(newScores)
          .filter(key => key !== 'all')
          .reduce((total, key) => total + newScores[key as RiskCategory].value, 0);
        
        const count = Object.keys(newScores).length - 1; // exclude 'all'
        newScores.all.value = Math.round(sum / count);
        
        // Mark all categories as loaded
        const allCategories = new Set(loadedCategories);
        Object.keys(newScores).forEach(key => {
          allCategories.add(key as RiskCategory);
        });
        setLoadedCategories(allCategories);
      } else {
        // Just update the selected category
        if (category !== 'all' as RiskCategory) {
          newScores[category].value = generateScore(
            category === 'credit' ? 75 :
            category === 'capacity' ? 82 :
            category === 'collateral' ? 68 :
            category === 'capital' ? 73 :
            category === 'conditions' ? 88 : 80
          );
        }
        
        // Mark this category as loaded
        setLoadedCategories(prev => new Set(prev).add(category));
      }
      
      setRiskScores(newScores);
      
      // End performance tracking
      endTracking();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[RiskMapOptimized] Error loading risk data: ${errorMessage}`, err);
      setError(`Failed to load risk data: ${errorMessage}`);
      
      // Track error
      performanceMonitor.trackError('risk_map_loading', errorMessage);
    } finally {
      // Clear loading state for this category
      setCategoryLoading(prev => ({
        ...prev,
        [category]: false
      }));
    }
  }, [effectiveTransactionId, loadedCategories, riskScores]);
  
  // Handle category selection with useCallback
  const handleCategorySelect = useCallback((category: RiskCategory) => {
    console.log(`[RiskMapOptimized] Selecting category: ${category}`);
    setSelectedCategory(category);
    
    // Load data for this category if it hasn't been loaded yet
    if (!loadedCategories.has(category)) {
      loadCategoryData(category);
    }
  }, [loadCategoryData, loadedCategories]);
  
  // Effect to load initial category data
  useEffect(() => {
    console.log('[RiskMapOptimized] Component mounted, initializing...');
    
    const init = async () => {
      if (!effectiveTransactionId && !contextLoading) {
        try {
          console.log('[RiskMapOptimized] No transaction selected, fetching transactions...');
          await fetchTransactions();
        } catch (err) {
          console.error('[RiskMapOptimized] Error fetching transactions:', err);
          setError('Failed to fetch transactions. Please try again.');
        }
      } else if (effectiveTransactionId) {
        // Load the initial category only
        loadCategoryData(initialCategory);
      }
    };
    
    init();
    
    // Cleanup
    return () => {
      console.log('[RiskMapOptimized] Component unmounting...');
    };
  }, [effectiveTransactionId, fetchTransactions, contextLoading, loadCategoryData, initialCategory]);
  
  // Effect to reload data when transaction changes
  useEffect(() => {
    if (effectiveTransactionId && loadedCategories.size > 0) {
      // Clear loaded categories and reload the current category when transaction changes
      setLoadedCategories(new Set());
      loadCategoryData(selectedCategory);
    }
  }, [effectiveTransactionId, loadCategoryData, selectedCategory]);
  
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
  
  // Check if the current category is loading
  const isCurrentCategoryLoading = categoryLoading[selectedCategory] || contextLoading;
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Risk Map</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => loadCategoryData(selectedCategory)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary
      onReset={() => {
        setError(null);
        loadCategoryData(selectedCategory);
      }}
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Risk Assessment {effectiveTransaction?.applicantData?.name ? `for ${effectiveTransaction.applicantData.name}` : ''}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
              <Suspense fallback={<SkeletonLoader rows={6} />}>
                <RiskMapNavigator 
                  onCategorySelect={handleCategorySelect}
                  selectedCategory={selectedCategory}
                />
              </Suspense>
            </div>
            
            <div className="md:col-span-3">
              <div className="bg-gray-50 p-6 rounded-lg">
                {isCurrentCategoryLoading ? (
                  // Show loading state only for the current category
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">
                        {selectedCategory === 'all' ? 'Overall Risk Profile' : `${selectedCategoryScore.label} Assessment`}
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