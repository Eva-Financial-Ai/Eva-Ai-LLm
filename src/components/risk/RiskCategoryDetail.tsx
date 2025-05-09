import React, { useMemo } from 'react';
import { RiskCategory } from './RiskMapOptimized';

interface RiskCategoryDetailProps {
  category: RiskCategory;
  score: number;
  transactionId?: string;
}

interface RiskFactor {
  id: string;
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  value: number;
}

const RiskCategoryDetail: React.FC<RiskCategoryDetailProps> = ({
  category,
  score,
  transactionId,
}) => {
  // Generate consistent risk factors based on category and transaction ID
  const riskFactors = useMemo(() => {
    // In a real app, this would come from an API
    // Here we're generating deterministic "random" data based on the inputs
    const factors: Record<RiskCategory, RiskFactor[]> = {
      credit: [
        {
          id: 'payment-history',
          name: 'Payment History',
          impact: score > 70 ? 'positive' : 'negative',
          description: score > 70 ? 'Consistent on-time payments' : 'Late payment history detected',
          value: Math.min(100, Math.max(0, score + 5)),
        },
        {
          id: 'credit-utilization',
          name: 'Credit Utilization',
          impact: score > 60 ? 'positive' : 'negative',
          description: score > 60 ? 'Low utilization ratio' : 'High utilization ratio',
          value: Math.min(100, Math.max(0, score - 10)),
        },
        {
          id: 'credit-age',
          name: 'Credit Age',
          impact: score > 75 ? 'positive' : 'neutral',
          description: score > 75 ? 'Well-established credit history' : 'Limited credit history',
          value: Math.min(100, Math.max(0, score - 5)),
        },
      ],
      capacity: [
        {
          id: 'debt-service-ratio',
          name: 'Debt Service Ratio',
          impact: score > 70 ? 'positive' : 'negative',
          description:
            score > 70 ? 'Healthy debt service coverage' : 'Debt service coverage concerns',
          value: Math.min(100, Math.max(0, score + 2)),
        },
        {
          id: 'income-stability',
          name: 'Income Stability',
          impact: score > 65 ? 'positive' : 'neutral',
          description: score > 65 ? 'Stable income sources' : 'Variable income sources',
          value: Math.min(100, Math.max(0, score + 8)),
        },
        {
          id: 'cash-reserves',
          name: 'Cash Reserves',
          impact: score > 80 ? 'positive' : 'negative',
          description: score > 80 ? 'Strong liquidity position' : 'Limited cash reserves',
          value: Math.min(100, Math.max(0, score - 15)),
        },
      ],
      collateral: [
        {
          id: 'asset-value',
          name: 'Asset Value',
          impact: score > 70 ? 'positive' : 'neutral',
          description: score > 70 ? 'Strong asset valuation' : 'Asset valuation concerns',
          value: Math.min(100, Math.max(0, score + 10)),
        },
        {
          id: 'asset-liquidity',
          name: 'Asset Liquidity',
          impact: score > 60 ? 'neutral' : 'negative',
          description: score > 60 ? 'Moderate asset liquidity' : 'Low asset liquidity',
          value: Math.min(100, Math.max(0, score - 5)),
        },
        {
          id: 'lien-position',
          name: 'Lien Position',
          impact: score > 85 ? 'positive' : 'neutral',
          description: score > 85 ? 'First lien position' : 'Subordinate lien position',
          value: Math.min(100, Math.max(0, score + 5)),
        },
      ],
      capital: [
        {
          id: 'equity-ratio',
          name: 'Equity Ratio',
          impact: score > 75 ? 'positive' : 'negative',
          description: score > 75 ? 'Strong equity position' : 'Limited equity investment',
          value: Math.min(100, Math.max(0, score - 2)),
        },
        {
          id: 'net-worth',
          name: 'Net Worth',
          impact: score > 80 ? 'positive' : 'neutral',
          description: score > 80 ? 'Substantial net worth' : 'Moderate net worth',
          value: Math.min(100, Math.max(0, score + 5)),
        },
        {
          id: 'capital-reserves',
          name: 'Capital Reserves',
          impact: score > 70 ? 'positive' : 'negative',
          description: score > 70 ? 'Adequate capital reserves' : 'Limited capital reserves',
          value: Math.min(100, Math.max(0, score - 8)),
        },
      ],
      conditions: [
        {
          id: 'industry-trends',
          name: 'Industry Trends',
          impact: score > 70 ? 'positive' : 'neutral',
          description: score > 70 ? 'Favorable industry outlook' : 'Uncertain industry outlook',
          value: Math.min(100, Math.max(0, score + 15)),
        },
        {
          id: 'economic-conditions',
          name: 'Economic Conditions',
          impact: score > 65 ? 'neutral' : 'negative',
          description:
            score > 65 ? 'Stable economic environment' : 'Challenging economic environment',
          value: Math.min(100, Math.max(0, score - 10)),
        },
        {
          id: 'competitive-position',
          name: 'Competitive Position',
          impact: score > 75 ? 'positive' : 'neutral',
          description: score > 75 ? 'Strong market position' : 'Evolving market position',
          value: Math.min(100, Math.max(0, score + 5)),
        },
      ],
      character: [
        {
          id: 'management-experience',
          name: 'Management Experience',
          impact: score > 80 ? 'positive' : 'neutral',
          description:
            score > 80 ? 'Extensive industry experience' : 'Moderate industry experience',
          value: Math.min(100, Math.max(0, score + 10)),
        },
        {
          id: 'business-history',
          name: 'Business History',
          impact: score > 75 ? 'positive' : 'negative',
          description: score > 75 ? 'Established business history' : 'Limited operating history',
          value: Math.min(100, Math.max(0, score - 5)),
        },
        {
          id: 'reputation',
          name: 'Reputation',
          impact: score > 85 ? 'positive' : 'neutral',
          description: score > 85 ? 'Strong market reputation' : 'Developing market reputation',
          value: Math.min(100, Math.max(0, score + 0)),
        },
      ],
      all: [], // Not used for detail view
    };

    return factors[category] || [];
  }, [category, score]);

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'positive':
        return 'text-green-700 bg-green-100';
      case 'negative':
        return 'text-red-700 bg-red-100';
      case 'neutral':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getValueColor = (value: number): string => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Key Risk Factors</h3>

      <div className="space-y-6">
        {riskFactors.map(factor => (
          <div key={factor.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-base font-medium text-gray-900">{factor.name}</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(factor.impact)}`}
              >
                {factor.impact.charAt(0).toUpperCase() + factor.impact.slice(1)} Impact
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">{factor.description}</p>

            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className={`h-2 rounded-full ${getValueColor(factor.value)}`}
                  style={{ width: `${factor.value}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${getValueColor(factor.value)}`}>
                {factor.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <ul className="space-y-2 text-sm text-blue-800">
            {score < 60 && (
              <li className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Consider requesting additional documentation to address {category} concerns
              </li>
            )}

            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {score > 75
                ? `Take advantage of strong ${category} profile when structuring deal terms`
                : `Consider risk mitigation strategies for ${category} concerns`}
            </li>

            <li className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Schedule follow-up assessment in 90 days to review {category} profile changes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RiskCategoryDetail);
