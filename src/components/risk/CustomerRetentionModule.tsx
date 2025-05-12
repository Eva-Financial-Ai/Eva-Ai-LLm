import React, { useState } from 'react';
import { Organization } from './OrganizationSelector';

// Sample retention data
const SAMPLE_RETENTION_DATA = {
  overallRetentionRate: 87,
  churnRate: 13,
  netRetentionRevenue: 108,
  averageCustomerLifespan: 4.2,
  customerSegments: [
    { name: 'Enterprise', retentionRate: 94, churnRisk: 'low', value: 'high' },
    { name: 'Mid-Market', retentionRate: 86, churnRisk: 'medium', value: 'medium' },
    { name: 'Small Business', retentionRate: 78, churnRisk: 'high', value: 'low' },
  ],
  atRiskCustomers: [
    { id: 'cust1', name: 'Acme Corp', segment: 'Enterprise', riskScore: 65, lastEngagement: '14 days ago' },
    { id: 'cust2', name: 'Globex Solutions', segment: 'Mid-Market', riskScore: 48, lastEngagement: '30+ days ago' },
    { id: 'cust3', name: 'Smith & Co', segment: 'Small Business', riskScore: 38, lastEngagement: '45+ days ago' },
    { id: 'cust4', name: 'Northern Systems', segment: 'Mid-Market', riskScore: 52, lastEngagement: '21 days ago' },
  ],
  retentionStrategies: [
    { id: 'strat1', name: 'Executive Engagement', effectiveness: 'high', targetSegment: 'Enterprise' },
    { id: 'strat2', name: 'Quarterly Business Reviews', effectiveness: 'medium', targetSegment: 'All' },
    { id: 'strat3', name: 'Product Training Sessions', effectiveness: 'high', targetSegment: 'Mid-Market' },
    { id: 'strat4', name: 'Loyalty Program', effectiveness: 'medium', targetSegment: 'Small Business' },
    { id: 'strat5', name: 'Personalized Outreach', effectiveness: 'high', targetSegment: 'At-Risk' },
  ]
};

interface CustomerRetentionModuleProps {
  organization?: Organization;
}

const CustomerRetentionModule: React.FC<CustomerRetentionModuleProps> = ({
  organization
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'at-risk' | 'strategies'>('overview');

  // Get color based on retention rate
  const getRetentionColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 80) return 'text-blue-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get badge style based on risk level
  const getRiskBadgeStyle = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get badge style based on effectiveness
  const getEffectivenessBadgeStyle = (effectiveness: string) => {
    switch (effectiveness.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render Overview Tab
  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Overall Retention Rate</h3>
        <p className={`text-3xl font-bold ${getRetentionColor(SAMPLE_RETENTION_DATA.overallRetentionRate)}`}>
          {SAMPLE_RETENTION_DATA.overallRetentionRate}%
        </p>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${SAMPLE_RETENTION_DATA.overallRetentionRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Churn Rate</h3>
        <p className={`text-3xl font-bold ${SAMPLE_RETENTION_DATA.churnRate < 15 ? 'text-green-600' : 'text-red-600'}`}>
          {SAMPLE_RETENTION_DATA.churnRate}%
        </p>
        <p className="text-sm text-gray-500 mt-2">Annual customer loss rate</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Net Retention Revenue</h3>
        <p className={`text-3xl font-bold ${SAMPLE_RETENTION_DATA.netRetentionRevenue > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
          {SAMPLE_RETENTION_DATA.netRetentionRevenue}%
        </p>
        <p className="text-sm text-gray-500 mt-2">Year-over-year revenue retention</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Avg. Customer Lifespan</h3>
        <p className="text-3xl font-bold text-gray-900">
          {SAMPLE_RETENTION_DATA.averageCustomerLifespan} <span className="text-lg">years</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">Average relationship duration</p>
      </div>
    </div>
  );

  // Render Segments Tab
  const renderSegmentsTab = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Segment
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Retention Rate
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Churn Risk
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {SAMPLE_RETENTION_DATA.customerSegments.map((segment, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{segment.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${getRetentionColor(segment.retentionRate)}`}>
                  {segment.retentionRate}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeStyle(segment.churnRisk)}`}>
                  {segment.churnRisk.charAt(0).toUpperCase() + segment.churnRisk.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize">{segment.value}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-primary-600 hover:text-primary-900">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render At-Risk Customers Tab
  const renderAtRiskTab = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Customers at Risk</h3>
        <p className="text-sm text-gray-500 mt-1">
          Customers with higher likelihood of churn requiring attention
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {SAMPLE_RETENTION_DATA.atRiskCustomers.map(customer => (
          <li key={customer.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{customer.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Segment: {customer.segment}</p>
                <p className="text-xs text-gray-500">Last Engagement: {customer.lastEngagement}</p>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-xs text-gray-500 mb-1">Risk Score</div>
                  <div className={`text-sm font-medium ${customer.riskScore < 50 ? 'text-red-600' : customer.riskScore < 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {customer.riskScore}
                  </div>
                </div>
                <button className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-md hover:bg-primary-700">
                  Intervention
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Render Strategies Tab
  const renderStrategiesTab = () => (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Retention Strategies</h3>
          <p className="text-sm text-gray-500 mt-1">
            Active approaches to maintain and grow customer relationships
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
          Create Strategy
        </button>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_RETENTION_DATA.retentionStrategies.map(strategy => (
          <div key={strategy.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-md font-medium text-gray-900">{strategy.name}</h4>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEffectivenessBadgeStyle(strategy.effectiveness)}`}>
                {strategy.effectiveness.charAt(0).toUpperCase() + strategy.effectiveness.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Target: {strategy.targetSegment}</p>
            <div className="flex justify-end space-x-2">
              <button className="px-3 py-1 bg-white border border-gray-300 text-xs text-gray-700 font-medium rounded-md hover:bg-gray-50">
                Edit
              </button>
              <button className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 text-xs font-medium rounded-md hover:bg-primary-100">
                Execute
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="customer-retention-module">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customer Retention
          {organization && <span className="text-lg font-normal ml-2 text-gray-600">for {organization.name}</span>}
        </h2>
        <p className="text-gray-600">
          Monitor and improve customer retention metrics and strategies
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('segments')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'segments'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Segments
            </button>
            <button
              onClick={() => setActiveTab('at-risk')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'at-risk'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              At-Risk Customers
            </button>
            <button
              onClick={() => setActiveTab('strategies')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'strategies'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Retention Strategies
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'segments' && renderSegmentsTab()}
        {activeTab === 'at-risk' && renderAtRiskTab()}
        {activeTab === 'strategies' && renderStrategiesTab()}
      </div>
    </div>
  );
};

export default CustomerRetentionModule; 