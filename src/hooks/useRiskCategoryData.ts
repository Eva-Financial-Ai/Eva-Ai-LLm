import { useState, useEffect } from 'react';
import { RiskCategory } from '../components/risk/RiskMapOptimized';
import { RiskMapType } from '../components/risk/RiskMapNavigator';
import evaReportApi, { CategoryData, MetricData } from '../api/evaReportApi';

interface RiskCategoryDataState {
  loading: boolean;
  error: string | null;
  data: CategoryData | null;
}

/**
 * Custom hook for fetching risk category data from the EVA report API
 */
export function useRiskCategoryData(
  transactionId: string | undefined,
  category: RiskCategory,
  riskMapType: RiskMapType = 'unsecured'
): RiskCategoryDataState {
  const [state, setState] = useState<RiskCategoryDataState>({
    loading: false,
    error: null,
    data: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Don't fetch if no transaction ID is provided
      if (!transactionId) {
        if (isMounted) {
          setState({
            loading: false,
            error: 'No transaction ID provided',
            data: null,
          });
        }
        return;
      }

      if (isMounted) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      try {
        const categoryData = await evaReportApi.fetchCategoryData(
          transactionId,
          category,
          riskMapType
        );

        if (isMounted) {
          setState({
            loading: false,
            error: null,
            data: categoryData,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            loading: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            data: null,
          });
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [transactionId, category, riskMapType]);

  return state;
}

/**
 * Custom hook for fetching all risk category scores
 */
export function useRiskScores(transactionId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<RiskCategory, number> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchScores = async () => {
      if (!transactionId) {
        if (isMounted) {
          setError('No transaction ID provided');
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const riskScores = await evaReportApi.fetchRiskScores(transactionId);
        
        if (isMounted) {
          setScores(riskScores);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'An unknown error occurred');
          setLoading(false);
        }
      }
    };

    fetchScores();

    return () => {
      isMounted = false;
    };
  }, [transactionId]);

  return { loading, error, scores };
}

export default useRiskCategoryData; 