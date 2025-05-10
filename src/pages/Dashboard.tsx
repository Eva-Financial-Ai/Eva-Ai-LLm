import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowStage } from '../contexts/WorkflowContext';
import TransactionTimeMetrics from '../components/TransactionTimeMetrics';
import RiskAssessmentLink from '../components/RiskAssessmentLink';
import useTransactionStore from '../hooks/useTransactionStore';
import TopNavigation from '../components/layout/TopNavigation';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useWorkflow } from '../contexts/WorkflowContext';
import { useUserType } from '../contexts/UserTypeContext';
import { PermissionGuard } from '../components/PermissionGuard';
import { PermissionLevel, UserType } from '../types/UserTypes';
import { DueDiligenceProgress, Trend } from '../components/dashboard/DueDiligenceProgress';
import { DealsTable } from '../components/dashboard/DealsTable';
import { MetricCard } from '../components/dashboard/MetricCard';
import { CreditScoreGauge } from '../components/dashboard/CreditScoreGauge';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { QuickFilters } from '../components/dashboard/QuickFilters';
import { DealProgressCard } from '../components/dashboard/DealProgressCard';
import DynamicDashboard from '../components/dashboard/DynamicDashboard';
import { DealActivityFilter } from '../components/dashboard/ActivityFilter';
import { mockActivities } from '../api/mockData';
import { FundingTrendsChart } from '../components/dashboard/FundingTrendsChart';
import DashboardService from '../services/DashboardService';
// Import our new component
import DemoModeSwitcherPanel from '../components/DemoModeSwitcherPanel';

// Register Chart.js components
Chart.register(...registerables);

// Transaction status colors
const statusColors: Record<WorkflowStage, { bg: string; text: string }> = {
  document_collection: { bg: 'bg-blue-100', text: 'text-blue-800' },
  risk_assessment: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  deal_structuring: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  approval_decision: { bg: 'bg-purple-100', text: 'text-purple-800' },
  document_execution: { bg: 'bg-green-100', text: 'text-green-800' },
  post_closing: { bg: 'bg-gray-100', text: 'text-gray-800' },
};

// Enhanced Mock Data with Deal Types
enum DealType {
  EQUIPMENT_VEHICLES = 'Equipment & Vehicles',
  REAL_ESTATE = 'Real Estate',
  GENERAL = 'General Funding',
}

// Mock transaction data
const mockTransactions = [
  {
    id: 'TX-12345',
    name: 'Equipment Financing - QRS Manufacturing',
    amount: 250000,
    date: '2023-04-15',
    status: 'Document Collection',
    statusColor: 'blue',
    progress: 20,
    type: DealType.EQUIPMENT_VEHICLES,
    assignee: {
      name: 'Alex Morgan',
      avatar: '/avatars/user1.jpg',
    },
  },
  {
    id: 'TX-12346',
    name: 'Working Capital - ABC Corp',
    amount: 100000,
    date: '2023-04-10',
    status: 'Risk Assessment',
    statusColor: 'yellow',
    progress: 40,
    type: DealType.GENERAL,
    assignee: {
      name: 'Jamie Smith',
      avatar: '/avatars/user2.jpg',
    },
  },
  {
    id: 'TX-12347',
    name: 'Real Estate - XYZ Properties',
    amount: 750000,
    date: '2023-04-05',
    status: 'Deal Structuring',
    statusColor: 'purple',
    progress: 60,
    type: DealType.REAL_ESTATE,
    assignee: {
      name: 'Taylor Jones',
      avatar: '/avatars/user3.jpg',
    },
  },
  {
    id: 'TX-12348',
    name: 'Expansion Loan - LMN Enterprises',
    amount: 500000,
    date: '2023-03-28',
    status: 'Document Execution',
    statusColor: 'green',
    progress: 80,
    type: DealType.GENERAL,
    assignee: {
      name: 'Riley Johnson',
      avatar: '/avatars/user4.jpg',
    },
  },
  {
    id: 'TX-12349',
    name: 'Inventory Financing - EFG Retail',
    amount: 175000,
    date: '2023-03-20',
    status: 'Funding',
    statusColor: 'indigo',
    progress: 90,
    type: DealType.EQUIPMENT_VEHICLES,
    assignee: {
      name: 'Casey Wilson',
      avatar: '/avatars/user5.jpg',
    },
  },
];

// Mock metrics data
const mockMetrics = {
  activeDeals: 12,
  dealVolume: 2750000,
  avgProcessingTime: 18.5,
  completedDeals: 8,
  monthlyChange: 25, // 25% increase
  riskScore: 72,
};

// Mock due diligence data with proper Trend type
const mockDueDiligence = [
  { category: 'Financial', completed: 8, total: 10, trend: 'up' as Trend },
  { category: 'Legal', completed: 5, total: 6, trend: 'stable' as Trend },
  { category: 'Operational', completed: 7, total: 12, trend: 'down' as Trend },
  { category: 'Market', completed: 4, total: 8, trend: 'up' as Trend },
  { category: 'Management', completed: 6, total: 6, trend: 'up' as Trend },
];

// Enhanced mock chart data with deal types
const mockChartDataByMonth = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Equipment & Vehicles',
      data: [350000, 580000, 420000, 620000, 790000, 680000],
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // green
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Real Estate',
      data: [650000, 980000, 820000, 1100000, 1350000, 1250000],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'General Funding',
      data: [200000, 340000, 260000, 480000, 560000, 570000],
      backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

// Mock chart data by year quarters
const mockChartDataByQuarter = {
  labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023'],
  datasets: [
    {
      label: 'Equipment & Vehicles',
      data: [1350000, 1580000, 1720000, 1950000, 2100000, 2250000],
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // green
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Real Estate',
      data: [2450000, 2580000, 2620000, 2800000, 3100000, 3250000],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'General Funding',
      data: [800000, 940000, 1060000, 1180000, 1250000, 1350000],
      backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

// Mock chart data by year
const mockChartDataByYear = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Equipment & Vehicles',
      data: [4500000, 5200000, 4800000, 6100000, 7200000, 8100000],
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // green
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Real Estate',
      data: [8200000, 8900000, 8100000, 9500000, 10500000, 12000000],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'General Funding',
      data: [3100000, 3400000, 3200000, 3800000, 4200000, 4600000],
      backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

// Create user type-specific dashboard components
const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewApplication = () => {
    navigate('/credit-application');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
      <div className="lg:col-span-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Dashboard</h2>
          <button
            onClick={handleNewApplication}
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
        <DealProgressCard />
      </div>
      <div className="lg:col-span-3">
        <MetricCard
          title="My Loan Status"
          value="Document Collection"
          subtitle="Next: Financial Review"
          trend={{ direction: 'up', value: '5%', text: 'faster than average' }}
          icon="/icons/document-collection.svg"
          color="blue"
        />
      </div>
      <div className="lg:col-span-3">
        <MetricCard
          title="Estimated Time to Decision"
          value="7 Days"
          subtitle="Based on current progress"
          trend={{ direction: 'down', value: '3 days', text: 'faster than similar loans' }}
          icon="/icons/clock.svg"
          color="green"
        />
      </div>
    </div>
  );
};

const VendorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MetricCard
            title="Listed Assets"
            value="14"
            subtitle="Active inventory items"
            trend={{ direction: 'up', value: '3', text: 'from last month' }}
            icon="/icons/inventory.svg"
            color="green"
          />
        </div>
        <div className="lg:col-span-3">
          <MetricCard
            title="Pending Approvals"
            value="5"
            subtitle="Equipment financing requests"
            trend={{ direction: 'up', value: '2', text: 'new requests this week' }}
            icon="/icons/pending.svg"
            color="blue"
          />
        </div>
        <div className="lg:col-span-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Inventory</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Equipment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Interest
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        CNC Milling Machine Model X500
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Manufacturing</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$125,000</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3 inquiries
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Industrial Conveyor System
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Logistics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$78,500</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Financing Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1 application
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Commercial Kitchen Equipment Package
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Food Service</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$95,750</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      5 inquiries
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Manage Inventory →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <RecentActivities activities={mockActivities} />
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Financing Options to Offer</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Equipment Leasing</h4>
                  <span className="text-green-600 text-sm font-medium">High demand</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Offer flexible leasing terms with options to buy at end of term.
                </p>
                <div className="mt-3">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Create offering →
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Equipment Financing</h4>
                  <span className="text-blue-600 text-sm font-medium">Medium demand</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Direct sale with financing options through our partner lenders.
                </p>
                <div className="mt-3">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Create offering →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LenderDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNewDeal = () => {
    navigate('/credit-application');
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lender Dashboard</h2>
        <button
          onClick={handleCreateNewDeal}
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
      {/* Key metrics row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-3">
          <MetricCard
            title="Active Deals"
            value={mockMetrics.activeDeals.toString()}
            subtitle="Current Month"
            trend={{ direction: 'up', value: '3', text: 'from last month' }}
            icon="/icons/deal-flow.svg"
            color="blue"
          />
        </div>
        <div className="lg:col-span-3">
          <MetricCard
            title="Deal Volume"
            value={`$${(mockMetrics.dealVolume / 1000000).toFixed(1)}M`}
            subtitle="Current Pipeline"
            trend={{
              direction: 'up',
              value: `${mockMetrics.monthlyChange}%`,
              text: 'month over month',
            }}
            icon="/icons/dollar.svg"
            color="green"
          />
        </div>
        <div className="lg:col-span-3">
          <MetricCard
            title="Avg. Processing Time"
            value={`${mockMetrics.avgProcessingTime} days`}
            subtitle="From application to funding"
            trend={{ direction: 'down', value: '2.5 days', text: 'improvement' }}
            icon="/icons/clock.svg"
            color="indigo"
          />
        </div>
        <div className="lg:col-span-3">
          <MetricCard
            title="Completed Deals"
            value={mockMetrics.completedDeals.toString()}
            subtitle="Current Month"
            trend={{ direction: 'stable', value: '', text: 'on target' }}
            icon="/icons/checkmark.svg"
            color="purple"
          />
        </div>
      </div>

      {/* Risk and Portfolio analytics section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Risk Distribution</h3>
          <div className="flex justify-between mb-4">
            <div className="text-center px-4">
              <div className="text-sm text-gray-500">Low Risk</div>
              <div className="mt-1 text-xl font-bold text-green-600">32%</div>
              <div className="mt-1 text-xs text-gray-500">↑ 5% since last quarter</div>
            </div>
            <div className="text-center px-4">
              <div className="text-sm text-gray-500">Medium Risk</div>
              <div className="mt-1 text-xl font-bold text-yellow-500">45%</div>
              <div className="mt-1 text-xs text-gray-500">↓ 3% since last quarter</div>
            </div>
            <div className="text-center px-4">
              <div className="text-sm text-gray-500">High Risk</div>
              <div className="mt-1 text-xl font-bold text-red-500">18%</div>
              <div className="mt-1 text-xs text-gray-500">↓ 2% since last quarter</div>
            </div>
            <div className="text-center px-4">
              <div className="text-sm text-gray-500">Critical</div>
              <div className="mt-1 text-xl font-bold text-gray-800">5%</div>
              <div className="mt-1 text-xs text-gray-500">No change</div>
            </div>
          </div>

          {/* Risk progress bars */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Equipment & Vehicles</span>
                <span className="font-medium">Low Risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Real Estate</span>
                <span className="font-medium">Medium Risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Working Capital</span>
                <span className="font-medium">High Risk</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>

          {/* Risk alert indicators */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center text-red-600">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm font-medium">3 deals require immediate risk review</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Performance</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Current Yield</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">7.8%</div>
              <div className="text-xs text-green-600 mt-1">↑ 0.3% from previous quarter</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Delinquency Rate</div>
              <div className="text-2xl font-bold text-green-600 mt-1">1.2%</div>
              <div className="text-xs text-green-600 mt-1">↓ 0.5% from industry average</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Revenue / Deal</div>
              <div className="text-2xl font-bold text-gray-700 mt-1">$42.5K</div>
              <div className="text-xs text-blue-600 mt-1">On target for Q3</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Approval Rate</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">68%</div>
              <div className="text-xs text-yellow-600 mt-1">↓ 3% from target</div>
            </div>
          </div>

          {/* Industry exposure chart */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Industry Exposure</h4>
            <div className="flex items-center space-x-1">
              <div className="h-4 bg-blue-500 rounded-l-full" style={{ width: '35%' }}></div>
              <div className="h-4 bg-green-500" style={{ width: '25%' }}></div>
              <div className="h-4 bg-yellow-500" style={{ width: '15%' }}></div>
              <div className="h-4 bg-indigo-500" style={{ width: '15%' }}></div>
              <div className="h-4 bg-red-500 rounded-r-full" style={{ width: '10%' }}></div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 mr-1 rounded-sm"></div>
                <span>Manufacturing (35%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                <span>Real Estate (25%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 mr-1 rounded-sm"></div>
                <span>Healthcare (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-indigo-500 mr-1 rounded-sm"></div>
                <span>Technology (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
                <span>Retail (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Due Diligence and Deal tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Due Diligence Status</h3>
          <DueDiligenceProgress title="Upcoming Deal Reviews" categories={mockDueDiligence} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Deals Pending Decision</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deal ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Borrower
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Risk Score
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    TX-12345
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    QRS Manufacturing
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$250,000</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      82 - Low Risk
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    Final Review
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    TX-12347
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    XYZ Properties
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$750,000</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      68 - Medium Risk
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    Committee Review
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    TX-12348
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    LMN Enterprises
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$500,000</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      45 - High Risk
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    Additional Info Needed
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Funding Trends Chart */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <FundingTrendsChart />
      </div>
    </div>
  );
};

// Create a wrapper component for DealActivityFilter with the correct props
const DashboardActivityFilter: React.FC<{
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}> = ({ activeFilter, onFilterChange }) => {
  // We're removing this component as requested
  return null;
};

// Move BrokerageDashboard component to after all the required component definitions
// It will be defined later in the file after LenderPerformanceMetricsEnhanced, CommissionForecastEnhanced, and DealStatusOverviewEnhanced

/**
 * Dashboard Page Component
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();
  const { transactions, loading: workflowLoading } = useWorkflow();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Ensure userType has a fallback value
  const currentUserType = userType || UserType.BUSINESS;
  const userTypeString = currentUserType.toString().toLowerCase();

  const [dashboardData, setDashboardData] = useState<any>({
    transactions: [],
    activities: [],
    metrics: {
      activeDeals: 0,
      dealVolume: 0,
      avgProcessingTime: 0,
      completedDeals: 0,
    },
  });

  const [dueDiligence, setDueDiligence] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add new state variables near the top of the component
  const [selectedLenderFilter, setSelectedLenderFilter] = useState<string>('all');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('thisMonth');

  // Fetch dashboard data based on user role
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching dashboard data for user type: ${userTypeString}`);

        // Mock data based on user type - in a real application, you would fetch from a backend
        let mockData;

        // Generate different mock data based on user type
        switch (currentUserType) {
          case UserType.BUSINESS:
            mockData = {
              transactions: mockTransactions.filter(t => t.type === DealType.GENERAL),
              activities: mockActivities.filter(a => a.userType === UserType.BUSINESS),
              metrics: {
                activeDeals: 2,
                dealVolume: 850000,
                avgProcessingTime: 18.5,
                completedDeals: 3,
              },
            };
            break;

          case UserType.VENDOR:
            mockData = {
              transactions: mockTransactions.filter(t => t.type === DealType.EQUIPMENT_VEHICLES),
              activities: mockActivities.filter(a => a.userType === UserType.VENDOR),
              metrics: {
                activeDeals: 8,
                dealVolume: 1750000,
                avgProcessingTime: 14.2,
                completedDeals: 12,
              },
            };
            break;

          case UserType.BROKERAGE:
            // For brokers, we'll use actual components instead of mock data
            mockData = {
              transactions: [],
              activities: [],
              metrics: {
                activeDeals: 8,
                dealVolume: 3250000,
                avgProcessingTime: 16.8,
                completedDeals: 7,
              },
            };
            break;

          case UserType.LENDER:
            mockData = {
              transactions: mockTransactions,
              activities: mockActivities.filter(a => a.userType === UserType.LENDER),
              metrics: {
                activeDeals: 24,
                dealVolume: 5750000,
                avgProcessingTime: 12.3,
                completedDeals: 18,
              },
            };
            break;

          default:
            mockData = {
              transactions: mockTransactions,
              activities: mockActivities,
              metrics: mockMetrics,
            };
        }

        // Set dashboard data with the appropriate mock data
        setDashboardData(mockData);

        // Generate appropriate due diligence data
        const ddData = [...mockDueDiligence];
        if (currentUserType === UserType.LENDER) {
          // Lenders see more completed items
          ddData.forEach(item => {
            if (item.completed < item.total) {
              item.completed += 1;
            }
          });
        } else if (currentUserType === UserType.BROKERAGE) {
          // Brokers see different trends
          ddData.forEach(item => {
            if (item.trend === 'down') {
              item.trend = 'stable';
            } else if (item.trend === 'stable') {
              item.trend = 'up';
            }
          });
        }

        setDueDiligence(ddData);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(`Failed to load dashboard data for ${userTypeString} view. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUserType, userTypeString]); // Re-fetch when user type changes

  // Handle starting a new deal
  const handleStartNewDeal = () => {
    navigate('/credit-application');
  };

  // Filter activities based on the selected filter
  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all' || !dashboardData.activities) {
      return dashboardData.activities || [];
    }

    return (dashboardData.activities || []).filter((activity: any) => {
      const typeMapping: Record<string, UserType> = {
        borrower: UserType.BUSINESS,
        vendor: UserType.VENDOR,
        broker: UserType.BROKERAGE,
        lender: UserType.LENDER,
      };

      return activity.userType === typeMapping[activeFilter];
    });
  }, [activeFilter, dashboardData.activities]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Add a retry function
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);

    // Simulate fetching data again
    setTimeout(() => {
      try {
        // Use the same mock data generation based on user type
        let mockData;

        switch (currentUserType) {
          case UserType.BUSINESS:
            mockData = {
              transactions: mockTransactions.filter(t => t.type === DealType.GENERAL),
              activities: mockActivities.filter(a => a.userType === UserType.BUSINESS),
              metrics: {
                activeDeals: 2,
                dealVolume: 850000,
                avgProcessingTime: 18.5,
                completedDeals: 3,
              },
            };
            break;

          case UserType.VENDOR:
            mockData = {
              transactions: mockTransactions.filter(t => t.type === DealType.EQUIPMENT_VEHICLES),
              activities: mockActivities.filter(a => a.userType === UserType.VENDOR),
              metrics: {
                activeDeals: 8,
                dealVolume: 1750000,
                avgProcessingTime: 14.2,
                completedDeals: 12,
              },
            };
            break;

          case UserType.BROKERAGE:
            mockData = {
              transactions: mockTransactions.filter(t => t.status === 'Deal Structuring'),
              activities: mockActivities.filter(a => a.userType === UserType.BROKERAGE),
              metrics: {
                activeDeals: 15,
                dealVolume: 3250000,
                avgProcessingTime: 16.8,
                completedDeals: 7,
              },
            };
            break;

          case UserType.LENDER:
            mockData = {
              transactions: mockTransactions,
              activities: mockActivities.filter(a => a.userType === UserType.LENDER),
              metrics: {
                activeDeals: 24,
                dealVolume: 5750000,
                avgProcessingTime: 12.3,
                completedDeals: 18,
              },
            };
            break;

          default:
            mockData = {
              transactions: mockTransactions,
              activities: mockActivities,
              metrics: mockMetrics,
            };
        }

        setDashboardData(mockData);
        setDueDiligence(mockDueDiligence);
        setIsLoading(false);
      } catch (err) {
        console.error('Error retrying data fetch:', err);
        setError(`Failed to load dashboard data for ${userTypeString} view. Please try again.`);
        setIsLoading(false);
      }
    }, 800);
  };

  // Function to handle user type switching - replaces the buttons in the grid
  const handleUserTypeSwitch = (newUserType: string | UserType) => {
    let userTypeValue: UserType;

    if (typeof newUserType === 'string') {
      // Convert string to UserType enum
      switch (newUserType) {
        case 'borrower':
          userTypeValue = UserType.BUSINESS;
          break;
        case 'vendor':
          userTypeValue = UserType.VENDOR;
          break;
        case 'broker':
          userTypeValue = UserType.BROKERAGE;
          break;
        case 'lender':
          userTypeValue = UserType.LENDER;
          break;
        default:
          userTypeValue = UserType.BUSINESS;
      }
    } else {
      // It's already a UserType enum value
      userTypeValue = newUserType;
    }

    setUserType(userTypeValue);

    // Save to localStorage for persistence
    if (userTypeValue === UserType.BUSINESS) {
      localStorage.setItem('userRole', 'borrower');
    } else if (userTypeValue === UserType.VENDOR) {
      localStorage.setItem('userRole', 'vendor');
    } else if (userTypeValue === UserType.BROKERAGE) {
      localStorage.setItem('userRole', 'broker');
    } else if (userTypeValue === UserType.LENDER) {
      localStorage.setItem('userRole', 'lender');
    }

    // Refresh the dashboard data
    setIsLoading(true);
  };

  // Remove the old EnhancedUserTypeSwitcher component
  const EnhancedUserTypeSwitcher: React.FC = () => {
    const userTypeOptions = [
      {
        value: UserType.BUSINESS,
        label: 'Business (Borrower)',
        description: 'Companies seeking financing for equipment, real estate, or operations',
      },
      {
        value: UserType.VENDOR,
        label: 'Vendor (Asset Seller)',
        description: 'Equipment manufacturers, dealers, and private party sellers',
      },
      {
        value: UserType.BROKERAGE,
        label: 'Broker/Originator',
        description: 'Loan brokers and originators connecting borrowers with lenders',
      },
      {
        value: UserType.LENDER,
        label: 'Lender/Lessor',
        description: 'Direct lenders, banks, and companies holding assets for lease',
      },
    ];

    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex items-center mb-2 md:mb-0">
            <svg
              className="h-5 w-5 text-blue-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm font-medium text-blue-700">Demo Mode: Switch User Type</span>
          </div>
          <div className="md:ml-auto space-y-2 md:space-y-0 flex flex-col md:flex-row md:space-x-3">
            {userTypeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleUserTypeSwitch(option.value)}
                className={`px-3 py-2 rounded-md text-sm flex flex-col items-center ${
                  currentUserType === option.value
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{option.label}</span>
                {currentUserType === option.value && (
                  <span className="text-xs mt-1 text-blue-100">{option.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Each user type represents a different stakeholder in the credit origination process.
          Switch between them to see customized dashboards and workflows.
        </p>
      </div>
    );
  };

  // Add the getUserTypeString function
  const getUserTypeString = (userType: UserType): string => {
    switch (userType) {
      case UserType.BUSINESS:
        return 'borrower';
      case UserType.VENDOR:
        return 'vendor';
      case UserType.BROKERAGE:
        return 'broker';
      case UserType.LENDER:
        return 'lender';
      default:
        return 'borrower';
    }
  };

  // Function to handle creating a new transaction based on user type
  const handleCreateNewTransaction = () => {
    switch (currentUserType) {
      case UserType.BUSINESS:
        // Borrowers create credit applications
        navigate('/credit-application');
        break;
      case UserType.VENDOR:
        // Vendors now go directly to credit application instead of showing dialog
        navigate('/credit-application');
        break;
      case UserType.BROKERAGE:
        // Show dialog with options to pre-fill for a borrower or create new deal structure
        showNewDealDialog('broker');
        break;
      case UserType.LENDER:
        // Show dialog with options to pre-fill for a borrower or create funding opportunity
        showNewDealDialog('lender');
        break;
      default:
        navigate('/credit-application');
    }
  };

  // New function to show a dialog with options based on user type
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [dealDialogType, setDealDialogType] = useState<'vendor' | 'broker' | 'lender'>('broker');

  const showNewDealDialog = (type: 'vendor' | 'broker' | 'lender') => {
    setDealDialogType(type);
    setShowDealDialog(true);
  };

  // Dialog component for new deal options
  const NewDealDialog = () => {
    if (!showDealDialog) return null;

    // Map options based on dialog type
    const options = {
      vendor: [
        {
          title: 'Pre-fill Application for Borrower',
          description: 'Pre-fill a credit application and send to a borrower',
          action: () => {
            // Clear any previous state and navigate with prefill mode
            setTimeout(() => {
              navigate('/credit-application?mode=prefill');
            }, 100);
          },
        },
        {
          title: 'List New Equipment',
          description: 'Add new equipment to your inventory for sale or financing',
          action: () => navigate('/asset-listing', { state: { isNew: true } }),
        },
      ],
      broker: [
        {
          title: 'Pre-fill Application for Borrower',
          description: 'Pre-fill a credit application and send to a borrower',
          action: () => {
            // Clear any previous state and navigate with prefill mode
            setTimeout(() => {
              navigate('/credit-application?mode=prefill');
            }, 100);
          },
        },
        {
          title: 'Create New Deal Structure',
          description: 'Structure a new deal with multiple parties from your network',
          action: () =>
            navigate('/deal-structuring', {
              state: { isNew: true, type: 'origination', withContacts: true },
            }),
        },
      ],
      lender: [
        {
          title: 'Pre-fill Application for Borrower',
          description: 'Pre-fill a credit application and send to a borrower',
          action: () => {
            // Clear any previous state and navigate with prefill mode
            setTimeout(() => {
              navigate('/credit-application?mode=prefill');
            }, 100);
          },
        },
        {
          title: 'Create Funding Opportunity',
          description: 'Structure a new funding opportunity',
          action: () =>
            navigate('/deal-structuring', {
              state: { isNew: true, type: 'funding', withContacts: true },
            }),
        },
      ],
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Transaction</h3>
            <button
              onClick={() => setShowDealDialog(false)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {options[dealDialogType].map((option, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setShowDealDialog(false);
                  option.action();
                }}
              >
                <h4 className="text-md font-medium text-gray-900">{option.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add a new component for the enhanced Lender Performance Metrics
  const LenderPerformanceMetricsEnhanced = () => {
    // Mock lenders data
    const lenders = [
      { id: 'all', name: 'All Lenders' },
      { id: 'firstCapital', name: 'First Capital Bank' },
      { id: 'equipmentFinance', name: 'Equipment Finance Co.' },
      { id: 'regionalLeasing', name: 'Regional Leasing Corp' },
      { id: 'midwestBank', name: 'Midwest Bank & Trust' },
      { id: 'commercialFinanciers', name: 'Commercial Financiers Inc.' },
    ];

    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Lender Performance Metrics</h3>

          {/* Filter options */}
          <div className="flex space-x-2">
            <select
              value={selectedLenderFilter}
              onChange={e => setSelectedLenderFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {lenders.map(lender => (
                <option key={lender.id} value={lender.id}>
                  {lender.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  LENDER
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  SUBMISSION TO BOOK
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  APPROVAL TO ACCEPT
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACCEPT TO FUND
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">First Capital Bank</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  78% <span className="text-green-500">↑</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  92% <span className="text-green-500">↑</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  95% <span className="text-green-500">↑</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <button className="text-primary-600 hover:text-primary-800">
                      <span>Options ▼</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Equipment Finance Co.</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  65% <span className="text-yellow-500">→</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  88% <span className="text-green-500">↑</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  90% <span className="text-green-500">↑</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <button className="text-primary-600 hover:text-primary-800">
                      <span>Options ▼</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Regional Leasing Corp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  58% <span className="text-red-500">↓</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  74% <span className="text-red-500">↓</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  85% <span className="text-yellow-500">→</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="relative">
                    <button className="text-primary-600 hover:text-primary-800">
                      <span>Options ▼</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Add a new component for the enhanced Commission Forecast
  const CommissionForecastEnhanced = () => {
    // Time period options
    const timePeriods = [
      { id: 'thisMonth', name: 'This Month' },
      { id: 'nextMonth', name: 'Next Month' },
      { id: 'threeMonths', name: '3 Months' },
      { id: 'sixMonths', name: '6 Months' },
      { id: 'nineMonths', name: '9 Months' },
      { id: 'twelveMonths', name: '12 Months' },
      { id: 'lastYear', name: 'Last Year' },
      { id: 'yearBefore', name: 'Year Before' },
    ];

    return (
      <div className="bg-white rounded-lg shadow p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Commission Forecast</h3>

          {/* Filter options */}
          <div className="flex space-x-2">
            <select
              value={selectedTimeFilter}
              onChange={e => setSelectedTimeFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {timePeriods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1" style={{ minHeight: '260px' }}>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Projected Commission',
                  data: [12500, 15000, 17500, 22000, 18000, 24000],
                  backgroundColor: 'rgba(79, 70, 229, 0.6)',
                },
                {
                  label: 'Actual Commission',
                  data: [11000, 16000, 15000, 20000, 17000, 0],
                  backgroundColor: 'rgba(16, 185, 129, 0.6)',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return '$' + value.toLocaleString();
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  };

  // Add a new component for the enhanced Deal Status Overview
  const DealStatusOverviewEnhanced = () => {
    // Mock deal data
    const deals = [
      {
        id: 'TX-12345',
        borrower: 'QRS Manufacturing',
        amount: 250000,
        status: 'Document Collection',
        statusClass: 'blue',
        lender: 'First Capital Bank',
        commission: 3750,
        isReady: true,
      },
      {
        id: 'TX-12347',
        borrower: 'XYZ Properties',
        amount: 750000,
        status: 'Credit Analysis',
        statusClass: 'yellow',
        lender: 'Equipment Finance Co.',
        commission: 11250,
        isReady: false,
      },
      {
        id: 'TX-12350',
        borrower: 'LMN Construction',
        amount: 425000,
        status: 'Approved',
        statusClass: 'green',
        lender: 'Regional Leasing Corp',
        commission: 6375,
        isReady: true,
      },
    ];

    // State for the dropdown menus
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [showMicroView, setShowMicroView] = useState<string | null>(null);

    // Function to toggle dropdown
    const toggleDropdown = (id: string) => {
      if (openDropdownId === id) {
        setOpenDropdownId(null);
      } else {
        setOpenDropdownId(id);
      }
    };

    // Function to progress a deal to the next stage
    const progressDeal = (dealId: string) => {
      console.log(`Progressing deal ${dealId} to next stage`);
      // In a real implementation, this would call an API to update the deal status
      alert(`Deal ${dealId} progressed to next stage!`);
      setOpenDropdownId(null);
    };

    // Function to view the deal in Risk Map Navigator
    const viewInRiskMap = (dealId: string) => {
      // Navigate to Risk Map Navigator with the deal ID
      navigate(`/risk-assessment?dealId=${dealId}`);
    };

    // Dropdown actions menu
    const ActionDropdown = ({ dealId, isReady }: { dealId: string; isReady: boolean }) => {
      if (openDropdownId !== dealId) return null;

      return (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => viewInRiskMap(dealId)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              View Full Profile
            </button>
            <button
              onClick={() => setShowMicroView(dealId)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              View Micro Details
            </button>
            {isReady && (
              <button
                onClick={() => progressDeal(dealId)}
                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                role="menuitem"
              >
                Progress to Next Stage
              </button>
            )}
            <button
              className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
              role="menuitem"
            >
              Manage Contacts
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              Flag for Review
            </button>
          </div>
        </div>
      );
    };

    // Micro view modal
    const MicroViewModal = () => {
      if (!showMicroView) return null;

      const deal = deals.find(d => d.id === showMicroView);
      if (!deal) return null;

      return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {deal.borrower} - {deal.id}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Detailed deal information</p>
                      <div className="mt-4 space-y-3">
                        <div>
                          <span className="text-xs text-gray-500">Deal Amount:</span>
                          <span className="ml-2 text-sm font-medium">
                            ${deal.amount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Status:</span>
                          <span className={`ml-2 text-sm font-medium text-${deal.statusClass}-600`}>
                            {deal.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Lender:</span>
                          <span className="ml-2 text-sm font-medium">{deal.lender}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Commission:</span>
                          <span className="ml-2 text-sm font-medium">
                            ${deal.commission.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowMicroView(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Deal Status Overview</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DEAL ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  BORROWER
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  AMOUNT
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  STATUS
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  LENDER
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  COMMISSION
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deals.map(deal => (
                <tr key={deal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {deal.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.borrower}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${deal.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${deal.statusClass}-100 text-${deal.statusClass}-800`}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deal.lender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${deal.commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(deal.id)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <span>Options ▼</span>
                      </button>
                      <ActionDropdown dealId={deal.id} isReady={deal.isReady} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal view for detailed information */}
        <MicroViewModal />
      </div>
    );
  };

  // Now define the BrokerageDashboard component that uses the enhanced components
  const BrokerageDashboard: React.FC = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <MetricCard
              title="Active Deals"
              value="8"
              subtitle="In progress originated deals"
              trend={{ direction: 'up', value: '2', text: 'from last month' }}
              icon="/icons/deals.svg"
              color="blue"
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="Total Submissions"
              value="23"
              subtitle="Applications sent to lenders"
              trend={{ direction: 'up', value: '5', text: 'from last month' }}
              icon="/icons/document-collection.svg"
              color="green"
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="Approval Rate"
              value="62%"
              subtitle="Approved from submissions"
              trend={{ direction: 'up', value: '7%', text: 'from previous rate' }}
              icon="/icons/checkmark.svg"
              color="purple"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <LenderPerformanceMetricsEnhanced />
          </div>
          <div>
            <CommissionForecastEnhanced />
          </div>
        </div>
        <div className="mt-6">
          <DealStatusOverviewEnhanced />
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <TopNavigation title="Dashboard" />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Loading {userTypeString} view...</p>
            </div>
            <div className="animate-pulse bg-gray-200 h-12 w-48 rounded"></div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow mb-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="border-t border-gray-200 pt-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-10">
                <div className="bg-gray-200 rounded"></div>
                <div className="bg-gray-200 rounded"></div>
                <div className="bg-gray-200 rounded"></div>
                <div className="bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <TopNavigation title="Dashboard" />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Error loading data</p>
            </div>
            <EnhancedUserTypeSwitcher />
          </div>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
              <p className="mb-4">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TopNavigation title="Dashboard" />
      <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
        {/* Demo Mode Switcher */}
        <DemoModeSwitcherPanel
          currentUserType={getUserTypeString(userType || UserType.BUSINESS)}
          onUserTypeChange={handleUserTypeSwitch}
        />

        {/* Main Dashboard content - without redundant Dashboard title */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-primary-600 text-lg">Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-900"
                  onClick={handleRetry}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard content based on user type */}
              {userType === UserType.BUSINESS && <BusinessDashboard />}
              {userType === UserType.VENDOR && <VendorDashboard />}
              {userType === UserType.BROKERAGE && <BrokerageDashboard />}
              {userType === UserType.LENDER && <LenderDashboard />}
              {/* ... Other user type dashboards */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
