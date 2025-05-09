import React from 'react';
import { Metrics } from '../../types/transaction';

interface RiskMetricsDisplayProps {
  metrics: Metrics;
  category: 'compliance' | 'legal' | 'duration' | 'reputation' | 'stability';
}

const RiskMetricsDisplay: React.FC<RiskMetricsDisplayProps> = ({ metrics, category }) => {
  // Helper functions for styling
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 65) return 'bg-yellow-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getPercentileClass = (percentile: number): string => {
    if (percentile >= 80) return 'bg-green-500';
    if (percentile >= 60) return 'bg-yellow-500';
    if (percentile >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Render specific content based on the category
  const renderCategoryContent = () => {
    switch (category) {
      case 'compliance':
        return (
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Compliance Points</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {metrics.regulatoryCompliance.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Compliance Coverage</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="h-2.5 rounded-full bg-green-500"
                    style={{ width: `${metrics.regulatoryCompliance.complianceCoverage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {metrics.regulatoryCompliance.complianceCoverage}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Exposures</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {metrics.regulatoryCompliance.riskExposures.map((risk, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">{risk.name}</div>
                    <div className="flex items-end mt-1">
                      <span className="text-lg font-semibold">{risk.value}</span>
                      <span className="text-xs text-gray-500 ml-1">/ 100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'legal':
        return (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Judgments Count</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.legalRecord.judgmentsCount}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Litigation Risk</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.legalRecord.litigationRisk}%
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Recent Cases</div>
                <div className="text-lg font-semibold mt-1">{metrics.legalRecord.recentCases}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Pending Litigation</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.legalRecord.pendingLitigation}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
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
                <p className="text-sm text-blue-700">
                  {metrics.legalRecord.judgmentsCount === 0 &&
                  metrics.legalRecord.pendingLitigation === 0
                    ? "No legal judgments or pending litigation found. This is a positive indicator for the applicant's legal standing."
                    : `Applicant has ${metrics.legalRecord.judgmentsCount} judgment(s) and ${metrics.legalRecord.pendingLitigation} pending litigation case(s). Review details for potential impact on credit decision.`}
                </p>
              </div>
            </div>
          </div>
        );

      case 'duration':
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Years in Business</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.businessAge.yearsInBusiness} years
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Industry Peer Percentile</div>
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className={`h-2.5 rounded-full ${getPercentileClass(metrics.businessAge.industryPeerPercentile)}`}
                        style={{ width: `${metrics.businessAge.industryPeerPercentile}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {metrics.businessAge.industryPeerPercentile}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Stability Rating</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.businessAge.stabilityRating}/100
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Historical Consistency</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.businessAge.historicalConsistency}/100
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
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
                <p className="text-sm text-blue-700">
                  {metrics.businessAge.yearsInBusiness >= 5
                    ? `With ${metrics.businessAge.yearsInBusiness} years in business, the applicant demonstrates established market presence and operational resilience.`
                    : `At ${metrics.businessAge.yearsInBusiness} years in business, the applicant is relatively new in the market. Consider additional performance indicators to assess stability.`}
                </p>
              </div>
            </div>
          </div>
        );

      case 'reputation':
        return (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Market Perception</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">
                    {metrics.reputation.marketPerception}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Public Sentiment</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">
                    {metrics.reputation.publicSentiment}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Customer Satisfaction</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">
                    {metrics.reputation.customerSatisfaction}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Industry Awards</div>
                <div className="text-lg font-semibold mt-1">
                  {metrics.reputation.industryAwards}
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-500 mt-0.5 mr-2"
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
                <p className="text-sm text-green-700">
                  {metrics.reputation.customerSatisfaction >= 80
                    ? 'High customer satisfaction indicates strong market positioning and reliable product/service delivery.'
                    : 'Customer satisfaction metrics suggest room for improvement, which may affect business growth potential.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'stability':
        return (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Cash Flow Consistency</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">
                    {metrics.stability.cashFlowConsistency}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Revenue Growth</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">{metrics.stability.revenueGrowth}</span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Employee Retention</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">
                    {metrics.stability.employeeRetention}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-500">Market Position Strength</div>
                <div className="flex items-end mt-1">
                  <span className="text-lg font-semibold">
                    {metrics.stability.marketPositionStrength}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/ 100</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-blue-500 mt-0.5 mr-2"
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
                <p className="text-sm text-blue-700">
                  {metrics.stability.cashFlowConsistency >= 75 &&
                  metrics.stability.revenueGrowth >= 70
                    ? 'Strong cash flow consistency and revenue growth indicate a stable business with positive trajectory.'
                    : 'Cash flow patterns and revenue metrics suggest potential volatility. Consider implementing risk mitigation measures.'}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>No metrics available for this category.</div>;
    }
  };

  return <div className="space-y-4">{renderCategoryContent()}</div>;
};

export default RiskMetricsDisplay;
