import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { ViewMode } from './RoleBasedHeader';

interface CreditUnderwriterDashboardProps {
  viewMode: ViewMode;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

// Sample data
const riskDistributionData = [
  { name: 'Low Risk', value: 32 },
  { name: 'Moderate Risk', value: 45 },
  { name: 'High Risk', value: 23 },
];

const creditScoreDistributionData = [
  { name: '550-599', value: 5 },
  { name: '600-649', value: 12 },
  { name: '650-699', value: 25 },
  { name: '700-749', value: 35 },
  { name: '750-799', value: 18 },
  { name: '800+', value: 5 },
];

const approvalTrendData = [
  { date: 'Jan', applications: 65, approvals: 45, rejections: 20 },
  { date: 'Feb', applications: 78, approvals: 52, rejections: 26 },
  { date: 'Mar', applications: 82, approvals: 56, rejections: 26 },
  { date: 'Apr', applications: 70, approvals: 48, rejections: 22 },
  { date: 'May', applications: 92, approvals: 64, rejections: 28 },
  { date: 'Jun', applications: 88, approvals: 61, rejections: 27 },
];

const CreditUnderwriterDashboard: React.FC<CreditUnderwriterDashboardProps> = ({ viewMode }) => {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);

  // Function to render risk analysis charts
  const renderMacroView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
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

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Credit Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={creditScoreDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Approval vs. Rejection Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={approvalTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="applications" stroke="#8884d8" />
            <Line type="monotone" dataKey="approvals" stroke="#4caf50" />
            <Line type="monotone" dataKey="rejections" stroke="#f44336" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Top Reasons for Rejection
        </h3>
        <div className="space-y-4">
          {[
            { reason: 'Insufficient Credit History', percentage: 35 },
            { reason: 'High Debt-to-Income Ratio', percentage: 28 },
            { reason: 'Recent Negative Credit Events', percentage: 18 },
            { reason: 'Inadequate Cash Flow', percentage: 12 },
            { reason: 'Other', percentage: 7 },
          ].map((item) => (
            <div key={item.reason}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{item.reason}</span>
                <span className="text-sm font-medium text-gray-700">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Function to render applications waiting for review
  const renderMicroView = () => {
    // Sample applications
    const applicationsForReview = [
      { id: 'app-1001', borrower: 'Acme Industries LLC', amount: 125000, type: 'Equipment Finance', score: 710, status: 'Under Review', riskCategory: 'Medium' },
      { id: 'app-1002', borrower: 'Global Manufacturing', amount: 250000, type: 'Commercial Real Estate', score: 760, status: 'Under Review', riskCategory: 'Low' },
      { id: 'app-1003', borrower: 'Quantum Tech Inc', amount: 75000, type: 'Working Capital', score: 680, status: 'Under Review', riskCategory: 'Medium' },
      { id: 'app-1004', borrower: 'Sunrise Retail', amount: 50000, type: 'Equipment Finance', score: 620, status: 'Documents Pending', riskCategory: 'High' },
      { id: 'app-1005', borrower: 'Horizon Logistics Corp', amount: 180000, type: 'Commercial Auto', score: 690, status: 'Under Review', riskCategory: 'Medium' },
    ];

    // Selected application detail
    const selectedAppDetails = selectedApplication
      ? applicationsForReview.find(app => app.id === selectedApplication)
      : null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Applications for Review</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Sorted by priority</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {applicationsForReview.map((app) => (
                <li 
                  key={app.id}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedApplication === app.id ? 'bg-gray-50 border-l-4 border-primary-500' : ''}`}
                  onClick={() => setSelectedApplication(app.id)}
                >
                  <div className="px-4 py-4">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-primary-600">{app.borrower}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          app.riskCategory === 'Low' 
                            ? 'bg-green-100 text-green-800'
                            : app.riskCategory === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {app.riskCategory} Risk
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="flex">
                        <span className="text-sm text-gray-500">${app.amount.toLocaleString()}</span>
                        <span className="mx-1 text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{app.type}</span>
                      </div>
                      <div className="text-sm font-medium">
                        Score: {app.score}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedAppDetails ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Application Details
                  </h3>
                  <div className="flex space-x-3">
                    <button className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium">
                      Reject
                    </button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm font-medium">
                      Request Docs
                    </button>
                  </div>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Application {selectedAppDetails.id}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <h3 className="text-sm font-medium text-gray-500">Business Information</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      <p className="font-medium">{selectedAppDetails.borrower}</p>
                      <p>123 Business Ave, Suite 456</p>
                      <p>San Francisco, CA 94107</p>
                      <p>Business Type: LLC</p>
                      <p>Time in Business: 5 years</p>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <h3 className="text-sm font-medium text-gray-500">Financial Details</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      <p>Annual Revenue: $3,500,000</p>
                      <p>Monthly Cash Flow: $125,000</p>
                      <p>Current Debt: $450,000</p>
                      <p>Loan Request: ${selectedAppDetails.amount.toLocaleString()}</p>
                      <p>Loan Type: {selectedAppDetails.type}</p>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <h3 className="text-sm font-medium text-gray-500">Credit Information</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      <p>Credit Score: {selectedAppDetails.score}</p>
                      <p>Risk Category: {selectedAppDetails.riskCategory}</p>
                      <p>Debt-to-Income Ratio: 32%</p>
                      <p>Previous Loans: 2</p>
                      <p>Payment History: Good</p>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <h3 className="text-sm font-medium text-gray-500">EVA Analysis</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      <p>EVA Score: 82</p>
                      <p>Recommendation: Approve</p>
                      <p>Confidence Level: High</p>
                      <p>Similar Approved: 37</p>
                      <p>Similar Rejected: 5</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">Documents Status</h3>
                  <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {[
                      { name: 'Business License', status: 'Verified' },
                      { name: 'Financial Statements', status: 'Verified' },
                      { name: 'Tax Returns', status: 'Pending' },
                      { name: 'Bank Statements', status: 'Verified' },
                      { name: 'Owner ID', status: 'Verified' },
                      { name: 'Insurance Documents', status: 'Missing' },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center">
                        <div 
                          className={`flex-shrink-0 h-5 w-5 rounded-full ${
                            doc.status === 'Verified' 
                              ? 'bg-green-500' 
                              : doc.status === 'Pending' 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`} 
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center h-full">
              <svg 
                className="w-12 h-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No application selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select an application from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return viewMode === 'macro' ? renderMacroView() : renderMicroView();
};

export default CreditUnderwriterDashboard; 