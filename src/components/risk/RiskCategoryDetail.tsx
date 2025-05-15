import React, { useState, useEffect } from 'react';
import { RiskCategory } from './RiskMapOptimized';
import { RiskMapType } from './RiskMapNavigator';
import useRiskCategoryData from '../../hooks/useRiskCategoryData';
import { MetricData } from '../../api/evaReportApi';

interface Range {
  min: number;
  max: number;
  label: string;
  status: 'good' | 'average' | 'negative';
}

interface MetricConfig {
  name: string;
  ranges: Range[];
  unit?: string;
  sourceOptions?: string[];
}

interface CategoryData {
  title: string;
  description: string;
  metrics: MetricData[];
}

interface RiskCategoryDetailProps {
  category: RiskCategory;
  score: number;
  transactionId?: string;
  riskMapType?: RiskMapType;
}

// Credit metrics with toggle between business and owner
const CREDIT_METRICS: Record<string, MetricData[]> = {
  business: [
    { name: 'Credit Score', value: '745', status: 'good', source: 'Equifax One Score', description: 'Range: 720-850 (Good)' },
    { name: 'Payment History', value: '0 missed payments', status: 'good', source: 'Experian', description: 'No missed payments in last 24 months' },
    { name: 'Credit Utilization', value: '26%', status: 'good', source: 'D&B', description: 'Less than 30% utilization' },
    { name: 'Public Records', value: '0 issues', status: 'good', source: 'LexisNexis', description: 'No public records found' },
    { name: 'Age of Credit History', value: '12 years', status: 'good', source: 'Paynet API', description: 'More than 10 years (Good)' },
    { name: 'Recent Inquiries', value: '1 inquiry', status: 'good', source: 'Equifax', description: 'Less than 2 inquiries in last 6 months' },
    { name: 'Types of Credit', value: '3 types', status: 'good', source: 'Experian', description: 'More than 2 types (Good)' },
    { name: 'Average Length of Credit', value: '8 years', status: 'average', source: 'Experian', description: '5-10 years (Average)' },
    { name: 'Payment Trends', value: '99.5% on time', status: 'good', source: 'Paynet API', description: 'More than 99% of payments on time' },
  ],
  owner: [
    { name: 'Credit Score', value: '710', status: 'average', source: 'TransUnion', description: 'Range: 650-719 (Average)' },
    { name: 'Payment History', value: '1 missed payment', status: 'average', source: 'Experian', description: '1-2 missed payments in last 24 months' },
    { name: 'Credit Utilization', value: '34%', status: 'average', source: 'Equifax', description: '30%-50% utilization (Average)' },
    { name: 'Public Records', value: '0 issues', status: 'good', source: 'LexisNexis', description: 'No public records found' },
    { name: 'Age of Credit History', value: '15 years', status: 'good', source: 'TransUnion', description: 'More than 10 years (Good)' },
    { name: 'Recent Inquiries', value: '3 inquiries', status: 'average', source: 'Experian', description: '2-5 inquiries in last 6 months' },
    { name: 'Types of Credit', value: '4 types', status: 'good', source: 'Equifax', description: 'More than 2 types (Good)' },
    { name: 'Average Length of Credit', value: '9 years', status: 'average', source: 'TransUnion', description: '5-10 years (Average)' },
    { name: 'Payment Trends', value: '98% on time', status: 'average', source: 'Experian', description: '97-99% of payments on time' },
  ]
};

// Capital metrics
const CAPITAL_METRICS: MetricData[] = [
  { name: 'Debt-to-Equity Ratio', value: '0.85', status: 'good', source: 'Financial Statements', description: 'Less than 1.0 (Good)' },
  { name: 'Current Ratio', value: '2.3', status: 'good', source: 'Balance Sheet', description: 'Greater than 2.0 (Good)' },
  { name: 'Quick Ratio', value: '1.2', status: 'good', source: 'Balance Sheet', description: 'Greater than 1.0 (Good)' },
  { name: 'Gross Margin', value: '42%', status: 'average', source: 'Income Statement', description: '30%-50% (Average)' },
  { name: 'Net Margin', value: '8%', status: 'average', source: 'Income Statement', description: '5%-15% (Average)' },
  { name: 'Return on Assets (ROA)', value: '7.5%', status: 'average', source: 'Financial Statements', description: '5%-10% (Average)' },
  { name: 'Return on Equity (ROE)', value: '12%', status: 'average', source: 'Financial Statements', description: '10%-15% (Average)' },
  { name: 'Interest Coverage Ratio', value: '4.2', status: 'average', source: 'Income Statement', description: '2-5 (Average)' },
  { name: 'EBITDA', value: '$245,000', status: 'good', source: 'Income Statement', description: 'Positive and increasing' },
];

// Capacity metrics (cash flow)
const CAPACITY_METRICS: MetricData[] = [
  { name: 'Operating Cash Flow', value: '+6.8% annual increase', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 5% annual increase (Good)' },
  { name: 'Free Cash Flow', value: '+4.5%', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 3% (Good)' },
  { name: 'Cash Flow Coverage Ratio', value: '1.65', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 1.5 (Good)' },
  { name: 'Cash Conversion Cycle', value: '28 days', status: 'good', source: 'Financial Statements', description: 'Less than 30 days (Good)' },
  { name: 'Days Sales Outstanding', value: '32 days', status: 'average', source: 'Financial Statements', description: '30-60 days (Average)' },
  { name: 'Days Payable Outstanding', value: '65 days', status: 'good', source: 'Financial Statements', description: 'Greater than 60 days (Good)' },
  { name: 'Days Inventory Outstanding', value: '34 days', status: 'average', source: 'Financial Statements', description: '30-60 days (Average)' },
  { name: 'Working Capital', value: '$175,000', status: 'good', source: 'Balance Sheet', description: 'Greater than $100,000 (Good)' },
  { name: 'Cash Flow Volatility', value: '4.2% annual change', status: 'good', source: 'Cash Flow Statement', description: 'Less than 5% annual change (Good)' },
];

// Character metrics (legal and regulatory)
const CHARACTER_METRICS: MetricData[] = [
  { name: 'Compliance History', value: '0 Issues', status: 'good', source: 'Regulatory Records', description: 'No compliance issues identified' },
  { name: 'Legal Disputes', value: 'No Disputes', status: 'good', source: 'Public Records', description: 'No legal disputes found' },
  { name: 'Licensing Requirements', value: 'Met (compliant)', status: 'good', source: 'Regulatory Database', description: 'All licensing requirements are met' },
  { name: 'Industry-Specific Regulations', value: 'Compliant', status: 'good', source: 'Regulatory Audit', description: 'Fully compliant with industry regulations' },
  { name: 'Regulatory Audits', value: 'Clean (compliant)', status: 'good', source: 'Audit Reports', description: 'Clean audit reports with no issues' },
  { name: 'Business Age', value: '8 years', status: 'average', source: 'Business Registration', description: '5-10 years in business' },
  { name: 'Management Experience', value: '12+ years', status: 'good', source: 'Management Profiles', description: 'Extensive industry experience' },
  { name: 'Reputation', value: 'Excellent', status: 'good', source: 'Industry References', description: 'Strong reputation in the industry' },
  { name: 'Transparency', value: 'High', status: 'good', source: 'Documentation Quality', description: 'High level of transparency in documentation' },
];

// Conditions metrics (market and industry)
const CONDITIONS_METRICS: MetricData[] = [
  { name: 'Industry Growth Rate', value: '+5.8% annually', status: 'good', source: 'Industry Reports', description: 'Strong industry growth trend' },
  { name: 'Market Stability', value: 'Stable', status: 'good', source: 'Economic Indicators', description: 'Market shows stable growth patterns' },
  { name: 'Competitive Position', value: 'Strong', status: 'good', source: 'Market Analysis', description: 'Business has strong competitive position' },
  { name: 'Economic Outlook', value: 'Positive', status: 'good', source: 'Economic Forecasts', description: 'Positive economic indicators for next 12-24 months' },
  { name: 'Regulatory Changes', value: 'No significant changes', status: 'good', source: 'Regulatory Tracking', description: 'No major regulatory changes expected' },
  { name: 'Technology Impact', value: 'Positive adoption', status: 'good', source: 'Technology Assessment', description: 'Positive technology impact on business model' },
  { name: 'Supply Chain Stability', value: 'Stable', status: 'good', source: 'Supply Chain Analysis', description: 'Stable supply chain with no disruptions' },
  { name: 'Customer Segment Health', value: 'Strong', status: 'good', source: 'Market Research', description: 'Strong health indicators in customer segments' },
  { name: 'Geopolitical Factors', value: 'Low impact', status: 'good', source: 'Risk Assessment', description: 'Low impact from geopolitical factors' },
];

// Equipment-specific metrics
const EQUIPMENT_METRICS: MetricData[] = [
  { name: 'Equipment Type Demand', value: 'High demand', status: 'good', source: 'EquipmentWatch', description: 'Essential equipment with high demand' },
  { name: 'Equipment Age', value: '1.5 years', status: 'good', source: 'Purchase Records', description: 'New/Recent (0-2.66 years)' },
  { name: 'Resale Value', value: '85% of purchase price', status: 'good', source: 'EquipmentWatch', description: 'High resale value above industry average' },
  { name: 'Depreciation Rate', value: '8 years', status: 'good', source: 'IRS Guidelines', description: 'Favorable depreciation schedule (>6 years)' },
  { name: 'Replacement Cost', value: '$225,000', status: 'good', source: 'Machine Trader API', description: 'Higher than average replacement cost' },
  { name: 'Utilization Rate', value: '85%', status: 'good', source: 'Operation Records', description: 'High utilization rate (>80%)' },
  { name: 'Maintenance Costs', value: 'Below Average', status: 'good', source: 'Maintenance Records', description: 'Lower than average maintenance costs' },
  { name: 'Equipment Condition', value: 'Excellent', status: 'good', source: 'Inspection Report', description: 'Equipment is in excellent condition' },
  { name: 'Manufacturer Reputation', value: 'Top Tier', status: 'good', source: 'Industry Analysis', description: 'Equipment from reputable manufacturer' },
];

// Real Estate-specific metrics
const REALESTATE_METRICS: MetricData[] = [
  { name: 'Loan-to-Value Ratio', value: '62%', status: 'good', source: 'Appraisal Report', description: 'Less than 65% (Good)' },
  { name: 'Debt Service Coverage', value: '1.35x', status: 'good', source: 'Financial Statements', description: 'Greater than 1.25x (Good)' },
  { name: 'Occupancy Rate', value: '97%', status: 'good', source: 'Rent Roll', description: 'Greater than 95% (Good)' },
  { name: 'Property Class', value: 'Class A', status: 'good', source: 'Property Assessment', description: 'Top-tier property classification' },
  { name: 'Loan Rate Type', value: 'Fixed Rate Term', status: 'good', source: 'Loan Application', description: 'Stable fixed rate financing' },
  { name: 'Liens & Foreclosures', value: 'No liens or foreclosures', status: 'good', source: 'Public Records', description: 'Clean title with no encumbrances' },
  { name: 'Average Lease Term', value: '3.5 years', status: 'good', source: 'Lease Agreements', description: 'Strong lease terms (>1 year)' },
  { name: 'Property Location', value: 'Prime Location', status: 'good', source: 'Market Analysis', description: 'Property in high-demand location' },
  { name: 'Building Condition', value: 'Excellent', status: 'good', source: 'Property Inspection', description: 'Building in excellent condition' },
];

// Default metric configurations
const DEFAULT_METRIC_CONFIGS: Record<string, MetricConfig[]> = {
  creditScore: [
    {
      name: 'Credit Score',
      ranges: [
        { min: 800, max: 850, label: 'Excellent', status: 'good' },
        { min: 720, max: 799, label: 'Good', status: 'good' },
        { min: 650, max: 719, label: 'Average', status: 'average' },
        { min: 580, max: 649, label: 'Below Average', status: 'average' },
        { min: 300, max: 579, label: 'Poor', status: 'negative' }
      ],
      sourceOptions: ['Equifax', 'Experian', 'TransUnion', 'FICO', 'D&B']
    }
  ],
  revenue: [
    {
      name: 'Gross Revenue',
      ranges: [
        { min: 3000000, max: 100000000, label: 'Excellent', status: 'good' },
        { min: 1000000, max: 2999999, label: 'Good', status: 'good' },
        { min: 500000, max: 999999, label: 'Average', status: 'average' },
        { min: 100000, max: 499999, label: 'Below Average', status: 'average' },
        { min: 0, max: 99999, label: 'Poor', status: 'negative' }
      ],
      unit: '$'
    }
  ],
  debtToEquity: [
    {
      name: 'Debt-to-Equity Ratio',
      ranges: [
        { min: 0, max: 0.5, label: 'Excellent', status: 'good' },
        { min: 0.5, max: 1.0, label: 'Good', status: 'good' },
        { min: 1.0, max: 1.5, label: 'Average', status: 'average' },
        { min: 1.5, max: 2.0, label: 'Below Average', status: 'average' },
        { min: 2.0, max: 10, label: 'Poor', status: 'negative' }
      ]
    }
  ]
};

// Main component function
const RiskCategoryDetail: React.FC<RiskCategoryDetailProps> = ({ 
  category, 
  score, 
  transactionId,
  riskMapType = 'unsecured'
}) => {
  const [creditView, setCreditView] = useState<'business' | 'owner'>('business');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [showConfigurator, setShowConfigurator] = useState<boolean>(false);
  const [activeConfig, setActiveConfig] = useState<string>('');
  const [metricConfigs, setMetricConfigs] = useState<Record<string, MetricConfig[]>>(DEFAULT_METRIC_CONFIGS);
  
  // Use the custom hook to fetch data
  const { loading, error, data } = useRiskCategoryData(transactionId, category, riskMapType);

  // Get the status color class based on status
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to handle updating a range in the configurator
  const handleRangeUpdate = (configKey: string, rangeIndex: number, field: keyof Range, value: string | number) => {
    const updatedConfigs = { ...metricConfigs };
    if (updatedConfigs[configKey]) {
      // Find the metric to update
      const metricIndex = updatedConfigs[configKey].findIndex(m => m.name === activeConfig);
      if (metricIndex !== -1) {
        // Type cast value if it's a number
        const parsedValue = field === 'min' || field === 'max' 
          ? Number(value) 
          : value;
        
        // Update the specific field in a type-safe way
        if (field === 'min' || field === 'max') {
          updatedConfigs[configKey][metricIndex].ranges[rangeIndex][field] = parsedValue as number;
        } else if (field === 'label') {
          updatedConfigs[configKey][metricIndex].ranges[rangeIndex][field] = parsedValue as string;
        } else if (field === 'status') {
          updatedConfigs[configKey][metricIndex].ranges[rangeIndex][field] = parsedValue as 'good' | 'average' | 'negative';
        }
        
        setMetricConfigs(updatedConfigs);
      }
    }
  };

  // Function to add new range to configurator
  const addRange = (configKey: string) => {
    const updatedConfigs = { ...metricConfigs };
    if (updatedConfigs[configKey]) {
      const metricIndex = updatedConfigs[configKey].findIndex(m => m.name === activeConfig);
      if (metricIndex !== -1) {
        const ranges = updatedConfigs[configKey][metricIndex].ranges;
        const lastRange = ranges[ranges.length - 1];
        const newRange = { 
          min: lastRange.min - 100, 
          max: lastRange.min - 1, 
          label: 'New Range', 
          status: 'average' as 'good' | 'average' | 'negative'
        };
        updatedConfigs[configKey][metricIndex].ranges.push(newRange);
        setMetricConfigs(updatedConfigs);
      }
    }
  };

  // Function to remove a range from configurator
  const removeRange = (configKey: string, rangeIndex: number) => {
    const updatedConfigs = { ...metricConfigs };
    if (updatedConfigs[configKey]) {
      const metricIndex = updatedConfigs[configKey].findIndex(m => m.name === activeConfig);
      if (metricIndex !== -1 && updatedConfigs[configKey][metricIndex].ranges.length > 1) {
        updatedConfigs[configKey][metricIndex].ranges.splice(rangeIndex, 1);
        setMetricConfigs(updatedConfigs);
      }
    }
  };

  // Determine if this category supports toggling between business and owner
  const supportsToggle = category === 'credit';
  
  // Filter metrics if data is available and agency filter is set
  const filteredMetrics = data && data.metrics ? 
    (agencyFilter === 'all' 
      ? data.metrics 
      : data.metrics.filter(metric => metric.source?.includes(agencyFilter)))
    // Apply business/owner filter for credit category if needed
    .filter(metric => {
      // If we're not in credit category or we don't have a business/owner view, show all
      if (category !== 'credit') return true;
      
      // For credit data, only show metrics relevant to the selected view
      if (creditView === 'business') {
        return !metric.name.toLowerCase().includes('owner') && 
               !metric.name.toLowerCase().includes('personal');
      } else { // 'owner' view
        return metric.name.toLowerCase().includes('owner') || 
               metric.name.toLowerCase().includes('personal') ||
               // Some metrics apply to both - include them in both views
               !metric.name.toLowerCase().includes('business');
      }
    })
    : [];

  // Get unique agencies for filtering
  const agencies = data?.metrics
    .map(metric => metric.source)
    .filter((source, index, self) => 
      source && self.indexOf(source) === index
    ) as string[] || [];

  // Return loading state
  if (loading) {
    return (
      <div className="risk-category-detail">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Return error state
  if (error) {
    return (
      <div className="risk-category-detail">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // If no data is available, show a placeholder
  if (!data) {
    return (
      <div className="risk-category-detail">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">There is no data available for this category. Please try another category or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="risk-category-detail">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-medium text-gray-900">{data.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{data.description}</p>
          </div>
          
          <button
            onClick={() => setShowConfigurator(!showConfigurator)}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded hover:bg-blue-200"
          >
            {showConfigurator ? 'Hide Configurator' : 'Configure Ranges'}
          </button>
        </div>
        
        {/* Toggle buttons for business vs. owner */}
        {supportsToggle && (
          <div className="mt-4 flex space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                creditView === 'business'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setCreditView('business')}
            >
              Business Credit
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                creditView === 'owner'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setCreditView('owner')}
            >
              Owner Credit
            </button>
          </div>
        )}
        
        {/* Agency filter dropdown */}
        {agencies.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Agency
            </label>
            <select
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
              className="block w-full sm:w-auto py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="all">All Agencies</option>
              {agencies.map((agency, index) => (
                <option key={index} value={agency}>
                  {agency}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Configurator panel */}
      {showConfigurator && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-lg font-medium mb-4">Customize Metric Ranges</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metric Type
              </label>
              <select
                value={activeConfig}
                onChange={(e) => setActiveConfig(e.target.value)}
                className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">Select a metric</option>
                {Object.keys(metricConfigs).map(key => (
                  metricConfigs[key].map(config => (
                    <option key={config.name} value={config.name}>{config.name}</option>
                  ))
                ))}
              </select>
            </div>
          </div>
          
          {activeConfig && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h5 className="font-medium">{activeConfig} Ranges</h5>
                <button
                  onClick={() => {
                    const configKey = Object.keys(metricConfigs).find(key => 
                      metricConfigs[key].some(config => config.name === activeConfig)
                    );
                    if (configKey) addRange(configKey);
                  }}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded hover:bg-green-200"
                >
                  Add Range
                </button>
              </div>
              
              {Object.keys(metricConfigs).map(configKey => (
                metricConfigs[configKey]
                  .filter(config => config.name === activeConfig)
                  .map(config => (
                    <div key={config.name} className="space-y-3">
                      {config.ranges.map((range, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 border border-gray-200 rounded-md bg-white">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Min</label>
                            <input
                              type="number"
                              value={range.min}
                              onChange={(e) => handleRangeUpdate(configKey, index, 'min', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Max</label>
                            <input
                              type="number"
                              value={range.max}
                              onChange={(e) => handleRangeUpdate(configKey, index, 'max', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                            <input
                              type="text"
                              value={range.label}
                              onChange={(e) => handleRangeUpdate(configKey, index, 'label', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                            <select
                              value={range.status}
                              onChange={(e) => handleRangeUpdate(configKey, index, 'status', e.target.value as 'good' | 'average' | 'negative')}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="good">Good</option>
                              <option value="average">Average</option>
                              <option value="negative">Negative</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => removeRange(configKey, index)}
                              className="p-2 text-red-600 hover:text-red-800"
                              title="Remove Range"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Display the metrics */}
      <div className="space-y-6">
        {filteredMetrics.map((metric, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">{metric.name}</h4>
                <p className="text-sm text-gray-500">{metric.description}</p>
                {metric.source && (
                  <p className="text-xs text-gray-400 mt-1">Source: {metric.source}</p>
                )}
              </div>
              <div className={`ml-4 px-3 py-1 rounded-full border ${getStatusColorClass(metric.status)}`}>
                <span className="text-sm font-medium">{metric.value}</span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMetrics.length === 0 && !loading && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-gray-700">No metrics available. {agencyFilter !== 'all' ? 'Try changing the agency filter.' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCategoryDetail;
