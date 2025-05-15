import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ViewMode } from './RoleBasedHeader';
import { BoltIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

interface SalesManagerDashboardProps {
  viewMode: ViewMode;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

// Sample data
const applicationStatusData = [
  { name: 'New Applications', value: 12 },
  { name: 'Documents Pending', value: 5 },
  { name: 'Under Review', value: 8 },
  { name: 'Approved', value: 15 },
  { name: 'Funded', value: 22 },
  { name: 'Rejected', value: 3 },
];

const applicationVolumeData = [
  { name: 'Week 1', count: 4 },
  { name: 'Week 2', count: 6 },
  { name: 'Week 3', count: 8 },
  { name: 'Week 4', count: 10 },
];

// Define types for Mira AI agent
interface ComplianceAlert {
  id: string;
  conversation: string;
  issue: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface CrossSellOpportunity {
  id: string;
  clientName: string;
  currentProduct: string;
  suggestedProduct: string;
  potentialRevenue: number;
  confidence: number;
  rationale: string;
}

const SalesManagerDashboard: React.FC<SalesManagerDashboardProps> = ({ viewMode }) => {
  // Add state for Mira Sales Agent features
  const [showMiraAgent, setShowMiraAgent] = useState(false);
  const [activeTab, setActiveTab] = useState<'compliance' | 'opportunities'>('compliance');
  
  // Sample compliance alerts
  const complianceAlerts: ComplianceAlert[] = [
    {
      id: 'ca-1',
      conversation: 'Sales call with Acme Industries',
      issue: 'Missing rate disclosure statement',
      suggestion: 'Include standardized rate disclosure in all initial discussions',
      severity: 'high',
      timestamp: '2023-09-12 14:30'
    },
    {
      id: 'ca-2',
      conversation: 'Email to Global Manufacturing',
      issue: 'Promotional language may not align with marketing guidelines',
      suggestion: 'Use approved template language for promotional offers',
      severity: 'medium',
      timestamp: '2023-09-11 09:15'
    },
    {
      id: 'ca-3',
      conversation: 'Follow-up with Horizon Tech',
      issue: 'Term details mentioned differ from official product offering',
      suggestion: 'Verify term details before communicating to prospects',
      severity: 'high',
      timestamp: '2023-09-10 16:45'
    },
  ];

  // Sample cross-sell opportunities
  const crossSellOpportunities: CrossSellOpportunity[] = [
    {
      id: 'cs-1',
      clientName: 'Acme Industries',
      currentProduct: 'Equipment Financing',
      suggestedProduct: 'Working Capital Line',
      potentialRevenue: 12500,
      confidence: 85,
      rationale: 'Seasonal business pattern indicates cash flow needs; mentioned expansion plans in last call'
    },
    {
      id: 'cs-2',
      clientName: 'Quantum Technologies',
      currentProduct: 'Commercial Real Estate',
      suggestedProduct: 'Equipment Financing',
      potentialRevenue: 75000,
      confidence: 92,
      rationale: 'Recent discussions about technology upgrades; tax benefits closing in Q4'
    },
    {
      id: 'cs-3',
      clientName: 'Mountain View Construction',
      currentProduct: 'Fleet Financing',
      suggestedProduct: 'Asset-Based Lending',
      potentialRevenue: 180000,
      confidence: 78,
      rationale: 'Large contracts secured for next 6 months; inventory financing could improve working capital'
    },
  ];

  // Function to render severity badge
  const renderSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Medium</span>;
      case 'low':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Low</span>;
    }
  };

  // Common component for tables
  const ApplicationTable = () => (
    <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {[1, 2, 3, 4, 5].map((item) => (
          <li key={item}>
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <div className="flex text-sm">
                    <p className="font-medium text-primary-600 truncate">Application #{item + 1000}</p>
                    <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                      - Acme Corporation
                    </p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">$125,000 - Equipment Finance</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex-shrink-0 sm:mt-0">
                  <div className="flex overflow-hidden">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item % 3 === 0 
                          ? 'bg-green-100 text-green-800'
                          : item % 3 === 1
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item % 3 === 0 
                        ? 'Approved'
                        : item % 3 === 1
                          ? 'Under Review'
                          : 'Documents Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-5 flex-shrink-0">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Function to render charts
  const renderCharts = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Weekly Application Volume</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={applicationVolumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Application Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={applicationStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {applicationStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main dashboard content - left 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          {/* Core metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
              <p className="text-3xl font-bold text-gray-900">65</p>
              <div className="mt-1 text-sm text-green-600">↑ 12.5% from last month</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
              <p className="text-3xl font-bold text-gray-900">32%</p>
              <div className="mt-1 text-sm text-green-600">↑ 4% from last month</div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
              <p className="text-3xl font-bold text-primary-600">$3.65M</p>
              <div className="mt-1 text-sm text-green-600">↑ 15.3% from last month</div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Applications</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {applicationStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Team performance */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">John Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8 (33%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1.2M</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sarah Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">18</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7 (39%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$950K</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Michael Chen</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 (33%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$850K</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lisa Rodriguez</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 (38%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$650K</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sales targets */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Targets</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Mira Sales Agent - right 1/3 */}
        <div className="xl:col-span-1 space-y-6">
          {/* Mira Sales Agent Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white rounded-full p-1">
                  <BoltIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">Mira Sales Agent</h3>
                  <p className="text-indigo-100 text-sm">AI Sales Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setShowMiraAgent(!showMiraAgent)}
                className="rounded-md bg-white bg-opacity-20 px-3 py-1.5 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              >
                {showMiraAgent ? 'Minimize' : 'Expand'}
              </button>
            </div>
            
            {showMiraAgent && (
              <div className="p-4">
                <div className="flex space-x-2 border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'compliance'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('compliance')}
                  >
                    <div className="flex items-center">
                      <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                      Compliance Monitoring
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'opportunities'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('opportunities')}
                  >
                    <div className="flex items-center">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                      Cross-Sell Opportunities
                    </div>
                  </button>
                </div>
                
                <div className="mt-4">
                  {activeTab === 'compliance' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Mira monitors communications for compliance issues and provides suggestions to improve interactions.
                      </p>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {complianceAlerts.map((alert) => (
                          <div key={alert.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-medium text-gray-900">{alert.conversation}</h4>
                              {renderSeverityBadge(alert.severity)}
                            </div>
                            <p className="mt-1 text-sm text-red-600">{alert.issue}</p>
                            <p className="mt-1 text-sm text-green-600 flex items-start">
                              <CheckCircleIcon className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                              <span>{alert.suggestion}</span>
                            </p>
                            <p className="mt-2 text-xs text-gray-500">{alert.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Mira identifies cross-selling opportunities based on client interactions and data analysis.
                      </p>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {crossSellOpportunities.map((opportunity) => (
                          <div key={opportunity.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{opportunity.clientName}</h4>
                              <span className="text-sm font-bold text-green-600">${opportunity.potentialRevenue.toLocaleString()}</span>
                            </div>
                            <div className="mt-1 grid grid-cols-2 gap-x-2 text-xs text-gray-500">
                              <div>Current: <span className="text-gray-900">{opportunity.currentProduct}</span></div>
                              <div>Opportunity: <span className="text-indigo-600 font-medium">{opportunity.suggestedProduct}</span></div>
                            </div>
                            <div className="mt-2 flex items-center">
                              <div className="text-xs text-gray-500 mr-2">Confidence:</div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-2 rounded-full ${
                                    opportunity.confidence > 80 ? 'bg-green-500' : 
                                    opportunity.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${opportunity.confidence}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-700">{opportunity.confidence}%</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-600">{opportunity.rationale}</p>
                            <div className="mt-3 flex justify-end">
                              <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                                Create Opportunity
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Recent activity feed */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root max-h-96 overflow-y-auto">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          <span className="text-white font-medium text-sm">JS</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">John Smith</div>
                          <p className="mt-0.5 text-sm text-gray-500">Created application</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>New application for Acme Industries</p>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <span className="text-white font-medium text-sm">JD</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Jane Doe</div>
                          <p className="mt-0.5 text-sm text-gray-500">Approved application</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Approved Quantum Technologies application</p>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">4 hours ago</div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center ring-8 ring-white">
                          <span className="text-white font-medium text-sm">RJ</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                          <p className="mt-0.5 text-sm text-gray-500">Requested documents</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Requested additional financial statements for Global Manufacturing</p>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center ring-8 ring-white">
                          <span className="text-white font-medium text-sm">EW</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Emily Wilson</div>
                          <p className="mt-0.5 text-sm text-gray-500">Updated credit score</p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>Updated credit score for Horizon Logistics application</p>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard; 