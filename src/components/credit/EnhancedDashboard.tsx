import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AreaChart,
  Area,
} from 'recharts';

// Define role types
type UserRole = 
  | 'sales_manager' 
  | 'loan_processor' 
  | 'credit_underwriter' 
  | 'credit_committee' 
  | 'portfolio_manager'
  | 'portfolio_servicer'
  | 'portfolio_monitor'
  | 'developer'
  | 'admin';

// Define view mode
type ViewMode = 'macro' | 'micro';

interface EnhancedDashboardProps {
  userRole?: UserRole;
  initialViewMode?: ViewMode;
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

const approvalTrendData = [
  { date: 'Jan', applications: 65, approvals: 45 },
  { date: 'Feb', applications: 78, approvals: 52 },
  { date: 'Mar', applications: 82, approvals: 56 },
  { date: 'Apr', applications: 70, approvals: 48 },
  { date: 'May', applications: 92, approvals: 64 },
  { date: 'Jun', applications: 88, approvals: 61 },
];

const conversionRateData = [
  { name: 'Application → Documents', rate: 85 },
  { name: 'Documents → Review', rate: 75 },
  { name: 'Review → Approval', rate: 62 },
  { name: 'Approval → Funding', rate: 95 },
];

const industryAmountData = [
  { name: 'Manufacturing', amount: 1250000 },
  { name: 'Technology', amount: 980000 },
  { name: 'Healthcare', amount: 720000 },
  { name: 'Retail', amount: 560000 },
  { name: 'Construction', amount: 890000 },
];

const riskDistributionData = [
  { name: 'Low Risk', value: 32 },
  { name: 'Moderate Risk', value: 45 },
  { name: 'High Risk', value: 23 },
];

// Enhanced Dashboard Component
const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ 
  userRole = 'sales_manager',
  initialViewMode = 'macro'
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [activeMetricTab, setActiveMetricTab] = useState('overview');

  // Statistics
  const totalApplications = 65;
  const pendingDocuments = 22;
  const approvedApplications = 15;
  const totalValue = 3650000;
  const riskScore = 78;
  
  // Get role display name
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'sales_manager': return 'Sales & Relationship Manager';
      case 'loan_processor': return 'Loan Processor';
      case 'credit_underwriter': return 'Credit Underwriter & Analyst';
      case 'credit_committee': return 'Credit Committee';
      case 'portfolio_manager': return 'Portfolio Manager';
      case 'portfolio_servicer': return 'Portfolio Navigator Servicer';
      case 'portfolio_monitor': return 'Portfolio Navigator Monitoring';
      case 'developer': return 'Developer';
      case 'admin': return 'System Root Admin';
      default: return 'User';
    }
  };

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    // In a real app, this might be an API call
    console.log(`Changing role to ${role}`);
    window.location.href = `?role=${role}`;
  };

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Render header with title and role switcher
  const renderHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getRoleDisplayName(userRole)} Dashboard</h1>
        <p className="text-gray-600 mt-1">
          {viewMode === 'macro' 
            ? 'High-level overview of your organization performance' 
            : 'Detailed view of individual applications and metrics'}
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
        {/* View Mode Toggle */}
        <div className="flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => handleViewModeChange('macro')}
            className={`${
              viewMode === 'macro'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          >
            Macro View
          </button>
          <button
            type="button"
            onClick={() => handleViewModeChange('micro')}
            className={`${
              viewMode === 'micro'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          >
            Micro View
          </button>
        </div>
        
        {/* Role Selector */}
        <select
          className="form-select rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          defaultValue={userRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        >
          <option value="sales_manager">Sales & Relationship Manager</option>
          <option value="loan_processor">Loan Processor</option>
          <option value="credit_underwriter">Credit Underwriter & Analyst</option>
          <option value="credit_committee">Credit Committee</option>
          <option value="portfolio_manager">Portfolio Manager</option>
          <option value="portfolio_servicer">Portfolio Navigator Servicer</option>
          <option value="portfolio_monitor">Portfolio Navigator Monitoring</option>
          <option value="developer">Developer</option>
          <option value="admin">System Root Admin</option>
        </select>
        
        {/* New Origination Button */}
        <button
          onClick={() => navigate('/credit-application')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Origination
        </button>
      </div>
    </div>
  );

  // Render stats cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
        <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
        <div className="mt-1 text-sm text-green-600">↑ 12.5% from last month</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
        <h3 className="text-sm font-medium text-gray-500">Pending Documents</h3>
        <p className="text-3xl font-bold text-gray-900">{pendingDocuments}</p>
        <div className="mt-1 text-sm text-red-600">↑ 3.2% from last month</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500">Approved</h3>
        <p className="text-3xl font-bold text-green-600">{approvedApplications}</p>
        <div className="mt-1 text-sm text-green-600">↑ 7.8% from last month</div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
        <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
        <p className="text-3xl font-bold text-primary-600">${totalValue.toLocaleString()}</p>
        <div className="mt-1 text-sm text-green-600">↑ 15.3% from last month</div>
      </div>
    </div>
  );
  
  // Render metric tabs
  const renderMetricTabs = () => (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          {['overview', 'performance', 'financial', 'risk'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMetricTab(tab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeMetricTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        {renderMetricsByTab()}
      </div>
    </div>
  );
  
  // Render metrics based on selected tab
  const renderMetricsByTab = () => {
    switch (activeMetricTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
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

            <div className="bg-white p-4 rounded-lg border border-gray-200">
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
        
      case 'performance':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Application to Approval Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={approvalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#8884d8" />
                  <Line type="monotone" dataKey="approvals" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Pipeline Conversion Rates</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={conversionRateData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={value => [`${value}%`, 'Conversion Rate']} />
                  <Bar dataKey="rate" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
        
      case 'financial':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Origination Amount by Industry
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={industryAmountData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={value => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Cumulative Origination Value
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={approvalTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="approvals"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
        
      case 'risk':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#4caf50' : index === 1 ? '#ff9800' : '#f44336'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">EVA Risk Score Trend</h3>
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative h-44 w-44">
                  {/* Risk Score Gauge */}
                  <svg viewBox="0 0 120 120" className="h-44 w-44">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="12"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={riskScore >= 80 ? "#4caf50" : riskScore >= 60 ? "#ff9800" : "#f44336"}
                      strokeWidth="12"
                      strokeDasharray="339.292"
                      strokeDashoffset={(339.292 * (100 - riskScore)) / 100}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{riskScore}</span>
                    <span className="text-sm text-gray-500">EVA Score</span>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm font-medium text-green-600">↑ 4.5% from last quarter</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render role-specific content
  const renderRoleSpecificContent = () => {
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

    // Render specific dashboard layouts based on role
    switch (userRole) {
      case 'sales_manager':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {viewMode === 'macro' ? renderMetricTabs() : <ApplicationTable />}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Sales Targets</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Q3 Goal', target: '$4.5M', current: '$3.2M', percent: 71 },
                    { name: 'Monthly', target: '$1.5M', current: '$1.1M', percent: 73 },
                    { name: 'Weekly', target: '$375K', current: '$220K', percent: 59 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {item.current} / {item.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full" 
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Recent Activity</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {[
                      { id: 1, action: 'Created application', user: 'John Smith', time: '2 hours ago' },
                      { id: 2, action: 'Approved application', user: 'Jane Doe', time: '4 hours ago' },
                      { id: 3, action: 'Requested documents', user: 'Robert Johnson', time: '1 day ago' },
                      { id: 4, action: 'Updated credit score', user: 'Emily Wilson', time: '1 day ago' },
                    ].map((item, itemIdx) => (
                      <li key={item.id}>
                        <div className="relative pb-8">
                          {itemIdx !== 3 ? (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div>
                              <div className="relative px-1">
                                <div className="h-8 w-8 bg-primary-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                  <svg 
                                    className="h-5 w-5 text-primary-600" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth="2" 
                                      d="M12 4v16m8-8H4" 
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <a href="#" className="font-medium text-gray-900">
                                    {item.user}
                                  </a>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {item.action} · {item.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              {renderMetricTabs()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="enhanced-dashboard p-6">
      {renderHeader()}
      {renderStatsCards()}
      {renderRoleSpecificContent()}
    </div>
  );
};

export default EnhancedDashboard; 