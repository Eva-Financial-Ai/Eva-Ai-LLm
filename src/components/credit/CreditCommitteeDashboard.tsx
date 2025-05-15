import React, { useState } from 'react';
import { ViewMode } from './RoleBasedHeader';

// Chart components (commented imports to avoid TypeScript errors if not properly set up)
// @ts-ignore
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

interface CreditCommitteeDashboardProps {
  viewMode: ViewMode;
}

const CreditCommitteeDashboard: React.FC<CreditCommitteeDashboardProps> = ({ viewMode }) => {
  // State for instrument type filter
  const [instrumentType, setInstrumentType] = useState<'all' | 'equipment' | 'realestate' | 'working_capital'>('all');

  // Sample data for decision metrics
  const decisionMetricsData = {
    all: [
      { name: 'Approved', value: 156 },
      { name: 'Approved with Conditions', value: 72 },
      { name: 'Rejected', value: 38 },
      { name: 'Pending Decision', value: 25 }
    ],
    equipment: [
      { name: 'Approved', value: 86 },
      { name: 'Approved with Conditions', value: 32 },
      { name: 'Rejected', value: 18 },
      { name: 'Pending Decision', value: 11 }
    ],
    realestate: [
      { name: 'Approved', value: 42 },
      { name: 'Approved with Conditions', value: 26 },
      { name: 'Rejected', value: 12 },
      { name: 'Pending Decision', value: 8 }
    ],
    working_capital: [
      { name: 'Approved', value: 28 },
      { name: 'Approved with Conditions', value: 14 },
      { name: 'Rejected', value: 8 },
      { name: 'Pending Decision', value: 6 }
    ]
  };

  // Sample approval rates by instrument type (monthly)
  const approvalRatesData = [
    { month: 'Jan', equipment: 82, realestate: 78, working_capital: 75 },
    { month: 'Feb', equipment: 85, realestate: 76, working_capital: 73 },
    { month: 'Mar', equipment: 88, realestate: 80, working_capital: 78 },
    { month: 'Apr', equipment: 84, realestate: 81, working_capital: 76 },
    { month: 'May', equipment: 86, realestate: 79, working_capital: 74 },
    { month: 'Jun', equipment: 89, realestate: 82, working_capital: 77 }
  ];

  // Credit risk distribution based on instrument type
  const riskDistributionData = {
    all: [
      { name: 'Low Risk (A)', value: 42 },
      { name: 'Medium-Low Risk (B)', value: 35 },
      { name: 'Medium Risk (C)', value: 18 },
      { name: 'Medium-High Risk (D)', value: 12 },
      { name: 'High Risk (E)', value: 5 }
    ],
    equipment: [
      { name: 'Low Risk (A)', value: 25 },
      { name: 'Medium-Low Risk (B)', value: 18 },
      { name: 'Medium Risk (C)', value: 9 },
      { name: 'Medium-High Risk (D)', value: 5 },
      { name: 'High Risk (E)', value: 2 }
    ],
    realestate: [
      { name: 'Low Risk (A)', value: 12 },
      { name: 'Medium-Low Risk (B)', value: 10 },
      { name: 'Medium Risk (C)', value: 6 },
      { name: 'Medium-High Risk (D)', value: 4 },
      { name: 'High Risk (E)', value: 1 }
    ],
    working_capital: [
      { name: 'Low Risk (A)', value: 5 },
      { name: 'Medium-Low Risk (B)', value: 7 },
      { name: 'Medium Risk (C)', value: 3 },
      { name: 'Medium-High Risk (D)', value: 3 },
      { name: 'High Risk (E)', value: 2 }
    ]
  };

  // Decision duration by instrument type (average days)
  const decisionTimeData = [
    { 
      type: 'Equipment & Vehicles', 
      avgTime: 3.2, 
      details: [
        { complexity: 'Low Complexity', days: 2.5 },
        { complexity: 'Medium Complexity', days: 3.8 },
        { complexity: 'High Complexity', days: 5.2 }
      ]
    },
    { 
      type: 'Real Estate', 
      avgTime: 5.8, 
      details: [
        { complexity: 'Low Complexity', days: 4.0 },
        { complexity: 'Medium Complexity', days: 6.5 },
        { complexity: 'High Complexity', days: 8.2 }
      ]
    },
    { 
      type: 'Working Capital', 
      avgTime: 2.4, 
      details: [
        { complexity: 'Low Complexity', days: 1.8 },
        { complexity: 'Medium Complexity', days: 2.6 },
        { complexity: 'High Complexity', days: 3.5 }
      ]
    }
  ];

  // Pending applications for review based on instrument type
  const getPendingApplications = (type: 'all' | 'equipment' | 'realestate' | 'working_capital') => {
    const allApplications = [
      { 
        id: 'app-1001', 
        borrower: 'Industrial Manufacturers Inc', 
        type: 'equipment', 
        amount: 450000, 
        requestDate: '2023-09-12', 
        underwriterScore: 82, 
        riskRating: 'B',
        collateralValue: 525000,
        ltv: 0.86,
        dscr: 1.35,
        industry: 'Manufacturing'
      },
      {
        id: 'app-1002',
        borrower: 'Urban Property Holdings',
        type: 'realestate',
        amount: 2800000,
        requestDate: '2023-09-10',
        underwriterScore: 78,
        riskRating: 'B',
        collateralValue: 3500000,
        ltv: 0.80,
        dscr: 1.25,
        industry: 'Real Estate'
      },
      {
        id: 'app-1003',
        borrower: 'Metro Retail Group',
        type: 'working_capital',
        amount: 175000,
        requestDate: '2023-09-13',
        underwriterScore: 74,
        riskRating: 'C',
        collateralValue: 0,
        ltv: 0,
        dscr: 1.15,
        industry: 'Retail'
      },
      {
        id: 'app-1004',
        borrower: 'Healthcare Solutions Ltd',
        type: 'equipment',
        amount: 680000,
        requestDate: '2023-09-08',
        underwriterScore: 85,
        riskRating: 'A',
        collateralValue: 820000,
        ltv: 0.83,
        dscr: 1.48,
        industry: 'Healthcare'
      },
      {
        id: 'app-1005',
        borrower: 'Coastal Properties LLC',
        type: 'realestate',
        amount: 3250000,
        requestDate: '2023-09-05',
        underwriterScore: 76,
        riskRating: 'B',
        collateralValue: 4000000,
        ltv: 0.81,
        dscr: 1.22,
        industry: 'Hospitality'
      },
      {
        id: 'app-1006',
        borrower: 'Tech Innovations Inc',
        type: 'working_capital',
        amount: 350000,
        requestDate: '2023-09-11',
        underwriterScore: 72,
        riskRating: 'C',
        collateralValue: 0,
        ltv: 0,
        dscr: 1.10,
        industry: 'Technology'
      }
    ];

    if (type === 'all') {
      return allApplications;
    }

    return allApplications.filter(app => app.type === type);
  };

  // Get chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Get risk colors
  const getRiskColor = (riskRating: string) => {
    switch(riskRating) {
      case 'A': return 'text-green-600';
      case 'B': return 'text-teal-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      case 'E': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Render the main Credit Committee Dashboard
  return (
    <div className="space-y-6">
      {/* Instrument Type Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Credit Committee Decisions</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setInstrumentType('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                instrumentType === 'all'
                  ? 'bg-primary-100 text-primary-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setInstrumentType('equipment')}
              className={`px-3 py-1 text-sm rounded-md ${
                instrumentType === 'equipment'
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Equipment & Vehicles
            </button>
            <button
              onClick={() => setInstrumentType('realestate')}
              className={`px-3 py-1 text-sm rounded-md ${
                instrumentType === 'realestate'
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Real Estate
            </button>
            <button
              onClick={() => setInstrumentType('working_capital')}
              className={`px-3 py-1 text-sm rounded-md ${
                instrumentType === 'working_capital'
                  ? 'bg-yellow-100 text-yellow-800 font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Working Capital
            </button>
          </div>
        </div>
      </div>

      {/* Macro View - Overview and stats */}
      {viewMode === 'macro' && (
        <>
          {/* Top metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500">Pending Decisions</h3>
              <p className="text-3xl font-bold text-gray-900">
                {decisionMetricsData[instrumentType].find(item => item.name === 'Pending Decision')?.value || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Awaiting committee review</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">Approval Rate</h3>
              <p className="text-3xl font-bold text-gray-900">
                {(() => {
                  const total = decisionMetricsData[instrumentType].reduce((sum, item) => sum + item.value, 0);
                  const approved = decisionMetricsData[instrumentType]
                    .filter(item => item.name === 'Approved' || item.name === 'Approved with Conditions')
                    .reduce((sum, item) => sum + item.value, 0);
                  return total ? Math.round((approved / total) * 100) : 0;
                })()}%
              </p>
              <p className="text-sm text-green-600 mt-1">↑ 4% from last quarter</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500">Avg. Decision Time</h3>
              <p className="text-3xl font-bold text-gray-900">
                {instrumentType === 'all' 
                  ? (decisionTimeData.reduce((sum, item) => sum + item.avgTime, 0) / decisionTimeData.length).toFixed(1)
                  : instrumentType === 'equipment'
                    ? decisionTimeData[0].avgTime
                    : instrumentType === 'realestate'
                      ? decisionTimeData[1].avgTime
                      : decisionTimeData[2].avgTime
                } days
              </p>
              <p className="text-sm text-green-600 mt-1">↓ 0.4 days improvement</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500">Total Value Reviewed</h3>
              <p className="text-3xl font-bold text-gray-900">
                {(() => {
                  const apps = getPendingApplications(instrumentType);
                  return `$${(apps.reduce((sum, app) => sum + app.amount, 0) / 1000000).toFixed(1)}M`;
                })()}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Last 30 days</p>
            </div>
          </div>

          {/* Decision metrics chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Decision Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={decisionMetricsData[instrumentType]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {decisionMetricsData[instrumentType].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Approval Rates by Type (%)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={approvalRatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Approval Rate']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="equipment" 
                      stroke="#0088FE" 
                      name="Equipment" 
                      activeDot={{ r: 8 }}
                      strokeWidth={instrumentType === 'equipment' || instrumentType === 'all' ? 2 : 0.5}
                      opacity={instrumentType === 'equipment' || instrumentType === 'all' ? 1 : 0.3}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="realestate" 
                      stroke="#00C49F" 
                      name="Real Estate"
                      strokeWidth={instrumentType === 'realestate' || instrumentType === 'all' ? 2 : 0.5}
                      opacity={instrumentType === 'realestate' || instrumentType === 'all' ? 1 : 0.3}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="working_capital" 
                      stroke="#FFBB28" 
                      name="Working Capital"
                      strokeWidth={instrumentType === 'working_capital' || instrumentType === 'all' ? 2 : 0.5}
                      opacity={instrumentType === 'working_capital' || instrumentType === 'all' ? 1 : 0.3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Credit Risk Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Risk Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskDistributionData[instrumentType]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Applications">
                    {riskDistributionData[instrumentType].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#10B981' : index === 1 ? '#3B82F6' : index === 2 ? '#F59E0B' : index === 3 ? '#F97316' : '#EF4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Micro View - Individual applications */}
      {viewMode === 'micro' && (
        <>
          {/* Applications awaiting decision */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Pending Credit Committee Review</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Underwriter Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {instrumentType === 'working_capital' ? 'DSCR' : 'LTV'}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPendingApplications(instrumentType).map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {application.borrower}
                            </div>
                            <div className="text-sm text-gray-500">
                              {application.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.type === 'equipment' ? 'bg-blue-100 text-blue-800' :
                          application.type === 'realestate' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.type === 'equipment' ? 'Equipment' :
                           application.type === 'realestate' ? 'Real Estate' :
                           'Working Capital'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${application.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getRiskColor(application.riskRating)}`}>
                          {application.riskRating}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          application.underwriterScore >= 80 ? 'text-green-600' :
                          application.underwriterScore >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {application.underwriterScore}/100
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.type === 'working_capital' 
                          ? application.dscr 
                          : `${(application.ltv * 100).toFixed(1)}%`
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.industry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            Approve
                          </button>
                          <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                            Conditions
                          </button>
                          <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Decision Parameters by Instrument Type */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Credit Parameters for {
                  instrumentType === 'all' ? 'All Instruments' :
                  instrumentType === 'equipment' ? 'Equipment & Vehicle Financing' :
                  instrumentType === 'realestate' ? 'Real Estate Financing' :
                  'Working Capital Financing'
                }
              </h3>
            </div>
            <div className="p-6">
              {instrumentType === 'all' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {decisionTimeData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">{item.type}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Decision Time:</span>
                          <span className="font-medium">{item.avgTime} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Required LTV:</span>
                          <span className="font-medium">
                            {item.type === 'Equipment & Vehicles' ? '≤ 85%' : 
                             item.type === 'Real Estate' ? '≤ 80%' : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Required DSCR:</span>
                          <span className="font-medium">
                            {item.type === 'Working Capital' ? '≥ 1.2' : '≥ 1.25'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min. Credit Score:</span>
                          <span className="font-medium">
                            {item.type === 'Equipment & Vehicles' ? '680' : 
                             item.type === 'Real Estate' ? '700' : '650'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {instrumentType === 'equipment' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-blue-900 mb-2">Equipment & Vehicle Financing Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2">Primary Criteria</h5>
                        <ul className="space-y-1 text-blue-800">
                          <li className="flex justify-between">
                            <span>Maximum LTV:</span>
                            <span className="font-medium">85%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Minimum DSCR:</span>
                            <span className="font-medium">1.25</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Equipment Useful Life:</span>
                            <span className="font-medium">≥ 1.5x Loan Term</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Minimum Credit Score:</span>
                            <span className="font-medium">680</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Maximum Loan Term:</span>
                            <span className="font-medium">84 months</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-800 mb-2">Secondary Considerations</h5>
                        <ul className="space-y-1 text-blue-800">
                          <li className="flex justify-between">
                            <span>New vs. Used Equipment:</span>
                            <span className="font-medium">New: +5 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Industry Risk Factor:</span>
                            <span className="font-medium">±10 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Business Time in Operation:</span>
                            <span className="font-medium">≥ 2 years preferred</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Vendor Reliability Score:</span>
                            <span className="font-medium">±5 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Equipment Collateral Value:</span>
                            <span className="font-medium">High/Medium/Low</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {instrumentType === 'realestate' && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-green-900 mb-2">Real Estate Financing Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-800 mb-2">Primary Criteria</h5>
                        <ul className="space-y-1 text-green-800">
                          <li className="flex justify-between">
                            <span>Maximum LTV:</span>
                            <span className="font-medium">80%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Minimum DSCR:</span>
                            <span className="font-medium">1.25</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Property Condition:</span>
                            <span className="font-medium">Good to Excellent</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Minimum Credit Score:</span>
                            <span className="font-medium">700</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Maximum Loan Term:</span>
                            <span className="font-medium">30 years</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-800 mb-2">Secondary Considerations</h5>
                        <ul className="space-y-1 text-green-800">
                          <li className="flex justify-between">
                            <span>Property Type:</span>
                            <span className="font-medium">±15 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Market Vacancy Rate:</span>
                            <span className="font-medium">±10 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Lease Terms:</span>
                            <span className="font-medium">±10 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Environmental Assessment:</span>
                            <span className="font-medium">Pass/Conditional/Fail</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Location Quality:</span>
                            <span className="font-medium">A/B/C/D Rating</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {instrumentType === 'working_capital' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-yellow-900 mb-2">Working Capital Financing Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-yellow-800 mb-2">Primary Criteria</h5>
                        <ul className="space-y-1 text-yellow-800">
                          <li className="flex justify-between">
                            <span>Minimum DSCR:</span>
                            <span className="font-medium">1.20</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Maximum Debt-to-Income:</span>
                            <span className="font-medium">50%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Cash Flow Stability:</span>
                            <span className="font-medium">≤ 15% variance</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Minimum Credit Score:</span>
                            <span className="font-medium">650</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Maximum Loan Term:</span>
                            <span className="font-medium">36 months</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-yellow-800 mb-2">Secondary Considerations</h5>
                        <ul className="space-y-1 text-yellow-800">
                          <li className="flex justify-between">
                            <span>Industry Risk Factor:</span>
                            <span className="font-medium">±15 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Business Age:</span>
                            <span className="font-medium">±10 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Revenue Growth Rate:</span>
                            <span className="font-medium">±10 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Customer Concentration:</span>
                            <span className="font-medium">±5 score</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Account Receivable Quality:</span>
                            <span className="font-medium">A/B/C Rating</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreditCommitteeDashboard; 