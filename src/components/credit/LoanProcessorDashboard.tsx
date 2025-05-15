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

interface LoanProcessorDashboardProps {
  viewMode: ViewMode;
}

const LoanProcessorDashboard: React.FC<LoanProcessorDashboardProps> = ({ viewMode }) => {
  // State for instrument type filter
  const [instrumentType, setInstrumentType] = useState<'all' | 'equipment' | 'realestate' | 'working_capital'>('all');

  // Sample data for document processing metrics
  const documentProcessingData = {
    all: [
      { name: 'Pending Review', value: 24 },
      { name: 'Awaiting Customer', value: 18 },
      { name: 'Verified', value: 45 },
      { name: 'Rejected', value: 7 }
    ],
    equipment: [
      { name: 'Pending Review', value: 12 },
      { name: 'Awaiting Customer', value: 8 },
      { name: 'Verified', value: 25 },
      { name: 'Rejected', value: 3 }
    ],
    realestate: [
      { name: 'Pending Review', value: 8 },
      { name: 'Awaiting Customer', value: 6 },
      { name: 'Verified', value: 15 },
      { name: 'Rejected', value: 2 }
    ],
    working_capital: [
      { name: 'Pending Review', value: 4 },
      { name: 'Awaiting Customer', value: 4 },
      { name: 'Verified', value: 5 },
      { name: 'Rejected', value: 2 }
    ]
  };

  // Sample processing time data by instrument type
  const processingTimeData = {
    all: [
      { name: 'Application Intake', equipment: 1.2, realestate: 1.8, working_capital: 0.8 },
      { name: 'Document Collection', equipment: 3.5, realestate: 5.2, working_capital: 2.1 },
      { name: 'Verification', equipment: 2.2, realestate: 3.5, working_capital: 1.5 },
      { name: 'Submission to Underwriting', equipment: 1.0, realestate: 1.2, working_capital: 0.7 }
    ],
    equipment: [
      { name: 'Title Verification', days: 1.5 },
      { name: 'Asset Valuation', days: 2.8 },
      { name: 'Vendor Confirmation', days: 1.7 },
      { name: 'Lien Documentation', days: 1.3 }
    ],
    realestate: [
      { name: 'Title Search', days: 2.5 },
      { name: 'Appraisal', days: 5.0 },
      { name: 'Environmental Review', days: 3.2 },
      { name: 'Zoning Verification', days: 2.0 }
    ],
    working_capital: [
      { name: 'Bank Statement Analysis', days: 1.2 },
      { name: 'Cash Flow Verification', days: 1.5 },
      { name: 'Business License Validation', days: 0.8 },
      { name: 'Tax Return Review', days: 2.0 }
    ]
  };

  // Applications at each stage by instrument type
  const applicationStageData = {
    all: [
      { name: 'New Applications', count: 32 },
      { name: 'Document Collection', count: 45 },
      { name: 'Verification', count: 28 },
      { name: 'Ready for Underwriting', count: 16 },
      { name: 'Returned for Info', count: 12 }
    ],
    equipment: [
      { name: 'New Applications', count: 17 },
      { name: 'Document Collection', count: 23 },
      { name: 'Verification', count: 14 },
      { name: 'Ready for Underwriting', count: 9 },
      { name: 'Returned for Info', count: 6 }
    ],
    realestate: [
      { name: 'New Applications', count: 8 },
      { name: 'Document Collection', count: 14 },
      { name: 'Verification', count: 9 },
      { name: 'Ready for Underwriting', count: 5 },
      { name: 'Returned for Info', count: 4 }
    ],
    working_capital: [
      { name: 'New Applications', count: 7 },
      { name: 'Document Collection', count: 8 },
      { name: 'Verification', count: 5 },
      { name: 'Ready for Underwriting', count: 2 },
      { name: 'Returned for Info', count: 2 }
    ]
  };

  // Simulated tasks based on instrument type
  const getTasks = (type: 'all' | 'equipment' | 'realestate' | 'working_capital') => {
    const commonTasks = [
      { id: 'task1', title: 'Review new application documents', priority: 'High', due: '2023-09-15', applicant: 'Global Manufacturing' },
      { id: 'task2', title: 'Follow up on missing bank statements', priority: 'Medium', due: '2023-09-16', applicant: 'City Properties LLC' },
      { id: 'task3', title: 'Verify business registration details', priority: 'Low', due: '2023-09-18', applicant: 'Coastal Services Inc.' }
    ];

    // Add instrument-specific tasks
    if (type === 'all' || type === 'equipment') {
      commonTasks.push({ 
        id: 'task-eq1', 
        title: 'Validate equipment specifications and valuation', 
        priority: 'High', 
        due: '2023-09-14', 
        applicant: 'Precision Manufacturing' 
      });
      commonTasks.push({ 
        id: 'task-eq2', 
        title: 'Request vendor invoice for financed equipment', 
        priority: 'Medium', 
        due: '2023-09-17', 
        applicant: 'Healthcare Solutions' 
      });
    }

    if (type === 'all' || type === 'realestate') {
      commonTasks.push({ 
        id: 'task-re1', 
        title: 'Review property appraisal report', 
        priority: 'High', 
        due: '2023-09-15', 
        applicant: 'Riverside Investments' 
      });
      commonTasks.push({ 
        id: 'task-re2', 
        title: 'Collect environmental assessment documents', 
        priority: 'Medium', 
        due: '2023-09-19', 
        applicant: 'Urban Development Corp' 
      });
    }

    if (type === 'all' || type === 'working_capital') {
      commonTasks.push({ 
        id: 'task-wc1', 
        title: 'Analyze last 6 months of cash flow', 
        priority: 'High', 
        due: '2023-09-14', 
        applicant: 'Sunrise Retail Group' 
      });
      commonTasks.push({ 
        id: 'task-wc2', 
        title: 'Verify accounts receivable documentation', 
        priority: 'Medium', 
        due: '2023-09-16', 
        applicant: 'Metro Services Inc.' 
      });
    }

    return commonTasks;
  };

  // Get chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // This is the main rendering logic for the Loan Processor Dashboard
  return (
    <div className="space-y-6">
      {/* Instrument Type Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-wrap items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Loan Processor Workflow</h3>
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

      {/* Macro View - High level overview */}
      {viewMode === 'macro' && (
        <>
          {/* Top metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500">Tasks Due Today</h3>
              <p className="text-3xl font-bold text-gray-900">7</p>
              <p className="text-sm text-gray-500 mt-1">3 high priority</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">Documents Processed</h3>
              <p className="text-3xl font-bold text-gray-900">124</p>
              <p className="text-sm text-green-600 mt-1">↑ 12% this week</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-500">Avg. Processing Time</h3>
              <p className="text-3xl font-bold text-gray-900">2.4 days</p>
              <p className="text-sm text-green-600 mt-1">↓ 0.5 days from last month</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500">Pending Documents</h3>
              <p className="text-3xl font-bold text-gray-900">38</p>
              <p className="text-sm text-yellow-600 mt-1">5 overdue</p>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Processing Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Document Status</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={documentProcessingData[instrumentType]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {documentProcessingData[instrumentType].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Processing Times Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Processing Time by {instrumentType === 'all' ? 'Instrument Type' : 'Document Type'} (Days)
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {instrumentType === 'all' ? (
                    <BarChart
                      data={processingTimeData.all}
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
                      <Legend />
                      <Bar dataKey="equipment" stackId="a" fill="#0088FE" name="Equipment & Vehicles" />
                      <Bar dataKey="realestate" stackId="a" fill="#00C49F" name="Real Estate" />
                      <Bar dataKey="working_capital" stackId="a" fill="#FFBB28" name="Working Capital" />
                    </BarChart>
                  ) : (
                    <BarChart
                      data={processingTimeData[instrumentType]}
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
                      <Legend />
                      <Bar dataKey="days" fill={
                        instrumentType === 'equipment' ? '#0088FE' : 
                        instrumentType === 'realestate' ? '#00C49F' : '#FFBB28'
                      } />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Application stages chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Applications by Stage</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationStageData[instrumentType]}
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
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Micro View - Task level details */}
      {viewMode === 'micro' && (
        <>
          {/* Task List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Your Tasks</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {getTasks(instrumentType).map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Application: <span className="font-medium">{task.applicant}</span>
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">Due: {task.due}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Process
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Request Info
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Checklist for each instrument type */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Required Documents for {
                  instrumentType === 'all' ? 'All Applications' :
                  instrumentType === 'equipment' ? 'Equipment & Vehicle Financing' :
                  instrumentType === 'realestate' ? 'Real Estate Financing' :
                  'Working Capital Financing'
                }
              </h3>
            </div>
            <div className="p-6">
              {/* Common documents for all types */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Standard Documents</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Business Application Form</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Business Registration/License</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Last 3 months of Business Bank Statements</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Most Recent Business Tax Return</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Personal Financial Statement</span>
                  </li>
                </ul>
              </div>

              {/* Equipment & Vehicle specific documents */}
              {(instrumentType === 'all' || instrumentType === 'equipment') && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Equipment & Vehicle Documents</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Equipment/Vehicle Specifications</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Vendor Quote/Invoice</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Proof of Insurance (if applicable)</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Real Estate specific documents */}
              {(instrumentType === 'all' || instrumentType === 'realestate') && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Real Estate Documents</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Property Details/Listing</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Property Appraisal</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Environmental Assessment</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Title Report</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Working Capital specific documents */}
              {(instrumentType === 'all' || instrumentType === 'working_capital') && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Working Capital Documents</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Last 6 months of Bank Statements</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Accounts Receivable Aging Report</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Accounts Payable Aging Report</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Profit & Loss Statement (YTD)</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoanProcessorDashboard; 