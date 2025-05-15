import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          color="blue"
        />
      </div>
      <div className="lg:col-span-3">
        <MetricCard
          title="Estimated Time to Decision"
          value="7 Days"
          subtitle="Based on current progress"
          trend={{ direction: 'down', value: '3 days', text: 'faster than similar loans' }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="green"
        />
      </div>
    </div>
  );
};

const VendorDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Sample data for assets
  const assetInventory = [
    {
      id: 'AST-001',
      name: 'CNC Milling Machine Model X500',
      category: 'Manufacturing',
      price: 125000,
      status: 'Available',
      interest: '3 inquiries',
    },
    {
      id: 'AST-002',
      name: 'Industrial Conveyor System',
      category: 'Logistics',
      price: 78500,
      status: 'Financing Pending',
      interest: '1 application',
    },
    {
      id: 'AST-003',
      name: 'Commercial Kitchen Equipment Package',
      category: 'Food Service',
      price: 95750,
      status: 'Available',
      interest: '5 inquiries',
    },
    {
      id: 'AST-004',
      name: 'Diagnostic Imaging System',
      category: 'Healthcare',
      price: 235000,
      status: 'Available',
      interest: '2 inquiries',
    },
  ];

  // Sample data for financing options
  const financingOptions = [
    {
      id: 1,
      name: 'Equipment Leasing',
      description: 'Flexible leasing terms with options to buy at end of term',
      demand: 'High demand',
    },
    {
      id: 2,
      name: 'Equipment Financing',
      description: 'Direct sale with financing options through our partner lenders',
      demand: 'Medium demand',
    },
    {
      id: 3,
      name: 'Fair Market Value Lease',
      description: 'Lower payments with option to purchase at fair market value',
      demand: 'High demand',
    },
  ];

  // Sample data for recent activities
  const recentActivities = [
    {
      id: 1,
      user: 'John Smith',
      userType: 'Borrower',
      action: 'Requested information about CNC Machine',
      time: '2 hours ago',
    },
    {
      id: 2,
      user: 'First Capital Bank',
      userType: 'Lender',
      action: 'Approved financing for Industrial Conveyor',
      time: '4 hours ago',
    },
    {
      id: 3,
      user: 'Jane Doe',
      userType: 'Broker',
      action: 'Sent client application for Kitchen Package',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Vendor Action Center - Top Row */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Vendor Action Center</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/asset-listing', { state: { isNew: true } })}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Asset
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Inquiries
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border border-green-200 bg-green-50 rounded-md p-3">
            <h4 className="text-sm font-medium text-green-800 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              New Financing Applications (3)
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Industrial Conveyor System</span>
                <button className="text-xs bg-green-100 hover:bg-green-200 text-green-800 font-medium py-1 px-2 rounded">
                  Review
                </button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Diagnostic Imaging System</span>
                <button className="text-xs bg-green-100 hover:bg-green-200 text-green-800 font-medium py-1 px-2 rounded">
                  Review
                </button>
              </li>
            </ul>
          </div>

          <div className="border border-blue-200 bg-blue-50 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
              New Inquiries (5)
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">CNC Milling Machine X500</span>
                <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-2 rounded">
                  Respond
                </button>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Kitchen Equipment Package</span>
                <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-2 rounded">
                  Respond
                </button>
              </li>
            </ul>
          </div>

          <div className="border border-purple-200 bg-purple-50 rounded-md p-3">
            <h4 className="text-sm font-medium text-purple-800 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Financing Status (2)
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Industrial Conveyor System</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Forklift Fleet (3 units)</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Approved
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <MetricCard
            title="Listed Assets"
            value="14"
            subtitle="Active inventory items"
            trend={{ direction: 'up', value: '3', text: 'from last month' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
            color="green"
          />
        </div>
        <div className="lg:col-span-1">
          <MetricCard
            title="Pending Approvals"
            value="5"
            subtitle="Equipment financing requests"
            trend={{ direction: 'up', value: '2', text: 'new requests this week' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            color="blue"
          />
        </div>
        <div className="lg:col-span-1">
          <MetricCard
            title="Total Financed"
            value="$1.2M"
            subtitle="Year to date"
            trend={{ direction: 'up', value: '12%', text: 'higher than last year' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="purple"
          />
        </div>
      </div>

      {/* Asset inventory table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Asset Inventory</h3>
          <div className="flex space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets..."
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <svg
                className="h-4 w-4 text-gray-400 absolute left-2.5 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
              <option>All Categories</option>
              <option>Manufacturing</option>
              <option>Logistics</option>
              <option>Food Service</option>
              <option>Healthcare</option>
            </select>
          </div>
        </div>
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assetInventory.map((asset, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{asset.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${asset.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        asset.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : asset.status === 'Financing Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.interest}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium py-1 px-2 rounded">
                        Edit
                      </button>
                      <button className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1 px-2 rounded">
                        Promote
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Manage All Inventory →
          </button>
        </div>
      </div>

      {/* Financing Options and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financing Options to Offer</h3>
          <div className="space-y-4">
            {financingOptions.map((option, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">{option.name}</h4>
                  <span
                    className={`text-sm font-medium ${
                      option.demand === 'High demand'
                        ? 'text-green-600'
                        : option.demand === 'Medium demand'
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                    }`}
                  >
                    {option.demand}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                <div className="mt-3">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Create offering →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex space-x-3">
                <div
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.userType === 'Borrower'
                      ? 'bg-blue-100'
                      : activity.userType === 'Lender'
                        ? 'bg-green-100'
                        : 'bg-purple-100'
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      activity.userType === 'Borrower'
                        ? 'text-blue-800'
                        : activity.userType === 'Lender'
                          ? 'text-green-800'
                          : 'text-purple-800'
                    }`}
                  >
                    {activity.user.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {activity.user}
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        activity.userType === 'Borrower'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.userType === 'Lender'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {activity.userType}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{activity.action}</div>
                  <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Restore the LenderDashboard component
const LenderDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateNewDeal = () => {
    navigate('/credit-application');
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 flex justify-end mb-4">
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
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div>
          <MetricCard
            title="Active Deals"
            value={mockMetrics.activeDeals.toString()}
            subtitle="Current Month"
            trend={{ direction: 'up', value: '3', text: 'from last month' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            color="blue"
          />
        </div>
        <div>
          <MetricCard
            title="Deal Volume"
            value={`$${(mockMetrics.dealVolume / 1000000).toFixed(1)}M`}
            subtitle="Current Pipeline"
            trend={{
              direction: 'up',
              value: `${mockMetrics.monthlyChange}%`,
              text: 'month over month',
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="green"
          />
        </div>
        <div>
          <MetricCard
            title="Avg. Processing Time"
            value={`${mockMetrics.avgProcessingTime} days`}
            subtitle="From application to funding"
            trend={{ direction: 'down', value: '2.5 days', text: 'improvement' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="indigo"
          />
        </div>
        <div>
          <MetricCard
            title="Completed Deals"
            value={mockMetrics.completedDeals.toString()}
            subtitle="Current Month"
            trend={{ direction: 'stable', value: '', text: 'on target' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            }
            color="purple"
          />
        </div>
      </div>

      {/* Risk and Portfolio analytics section */}
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
      <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div className="col-span-12 bg-white rounded-lg shadow overflow-hidden">
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

// Add the missing BrokerageDashboard component
const BrokerageDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewDeal = () => {
    navigate('/credit-application');
  };

  // Sample data for broker dashboard
  const pendingDeals = [
    {
      id: 'DEL-3421',
      client: 'Starlight Manufacturing',
      amount: 320000,
      status: 'Application Submitted',
      days: 2,
    },
    {
      id: 'DEL-2856',
      client: 'Northern Healthcare',
      amount: 175000,
      status: 'Awaiting Approval',
      days: 5,
    },
    {
      id: 'DEL-3211',
      client: 'Coastal Properties LLC',
      amount: 650000,
      status: 'Document Collection',
      days: 3,
    },
  ];

  // Sample data for lender performance
  const lenderPerformance = [
    { name: 'First National Bank', approvalRate: 78, avgTime: 4.5, deals: 12 },
    { name: 'Capital Funding Group', approvalRate: 65, avgTime: 3.2, deals: 8 },
    { name: 'Meridian Credit Union', approvalRate: 82, avgTime: 5.8, deals: 5 },
  ];

  // Sample data for commissions
  const commissionForecasts = [
    { month: 'Current Month', amount: 28500, status: 'Projected' },
    { month: 'Next Month', amount: 32000, status: 'Forecast' },
    { month: 'Last Month', amount: 25750, status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      {/* Broker Action Center - Top Row */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Broker Action Center</h3>
          <button
            onClick={handleNewDeal}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Deal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="border border-orange-200 bg-orange-50 rounded-md p-3">
            <h4 className="text-sm font-medium text-orange-800 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              Priority Tasks (5)
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Submit additional docs for DEL-2856</span>
                <span className="text-xs bg-red-100 text-red-800 font-medium py-0.5 px-2 rounded">
                  Urgent
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Client call with Starlight Manufacturing</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 font-medium py-0.5 px-2 rounded">
                  Today
                </span>
              </li>
            </ul>
          </div>

          <div className="border border-blue-200 bg-blue-50 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              Upcoming Deadlines (3)
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Coastal Properties application deadline</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-medium py-0.5 px-2 rounded">
                  2 days
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Northern Healthcare final approval</span>
                <span className="text-xs bg-blue-100 text-blue-800 font-medium py-0.5 px-2 rounded">
                  4 days
                </span>
              </li>
            </ul>
          </div>

          <div className="border border-green-200 bg-green-50 rounded-md p-3">
            <h4 className="text-sm font-medium text-green-800 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Recently Funded Deals (2)
            </h4>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Metro Logistics Equipment Lease</span>
                <span className="text-xs bg-green-100 text-green-800 font-medium py-0.5 px-2 rounded">
                  $425,000
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Sunrise Medical Group Expansion</span>
                <span className="text-xs bg-green-100 text-green-800 font-medium py-0.5 px-2 rounded">
                  $275,000
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-1">
          <MetricCard
            title="Active Pipeline"
            value="$2.4M"
            subtitle="8 deals in progress"
            trend={{ direction: 'up', value: '15%', text: 'from last month' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            color="blue"
          />
        </div>
        <div className="lg:col-span-1">
          <MetricCard
            title="Avg Deal Size"
            value="$298K"
            subtitle="Current pipeline"
            trend={{ direction: 'up', value: '8%', text: 'from previous quarter' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            }
            color="green"
          />
        </div>
        <div className="lg:col-span-1">
          <MetricCard
            title="Approval Rate"
            value="72%"
            subtitle="Last 30 days"
            trend={{ direction: 'up', value: '5%', text: 'from previous period' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
            }
            color="purple"
          />
        </div>
        <div className="lg:col-span-1">
          <MetricCard
            title="Commission MTD"
            value="$28.5K"
            subtitle="Projected for month"
            trend={{ direction: 'up', value: '12%', text: 'above target' }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            color="indigo"
          />
        </div>
      </div>

      {/* Pipeline Visualization and Pending Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pipeline Status</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>New Applications</span>
                  <span className="font-medium">3 deals - $845,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Document Collection</span>
                  <span className="font-medium">2 deals - $520,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Underwriting</span>
                  <span className="font-medium">1 deal - $380,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Approval</span>
                  <span className="font-medium">2 deals - $655,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Closing</span>
                  <span className="font-medium">1 deal - $425,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>

            {/* Pipeline donut chart */}
            <div className="mt-6 flex justify-center">
              <div className="w-36 h-36 rounded-full border-8 border-blue-500 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <div className="text-2xl font-bold">$2.4M</div>
                    <div className="text-xs text-gray-500">Total Pipeline</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Pending Deals</h3>
            <div className="flex space-x-2">
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option>All Statuses</option>
                <option>Application Submitted</option>
                <option>Document Collection</option>
                <option>Awaiting Approval</option>
              </select>
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option>All Lenders</option>
                <option>First National Bank</option>
                <option>Capital Funding Group</option>
                <option>Meridian Credit Union</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deal ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Client
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
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
                    Days Active
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingDeals.map((deal, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      {deal.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deal.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${deal.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          deal.status === 'Application Submitted'
                            ? 'bg-blue-100 text-blue-800'
                            : deal.status === 'Awaiting Approval'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deal.days} {deal.days === 1 ? 'day' : 'days'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary-600 hover:text-primary-900 font-medium">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center text-sm">
            <span className="text-gray-700">Showing 3 of 8 total deals</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200">
                Previous
              </button>
              <button className="px-3 py-1 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lender performance and commission sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Lender Performance</h3>
          </div>
          <div className="p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Lender
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Approval Rate
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avg. Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Deals
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lenderPerformance.map((lender, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lender.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span
                          className={`mr-2 font-medium ${
                            lender.approvalRate >= 80
                              ? 'text-green-600'
                              : lender.approvalRate >= 70
                                ? 'text-blue-600'
                                : 'text-yellow-600'
                          }`}
                        >
                          {lender.approvalRate}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              lender.approvalRate >= 80
                                ? 'bg-green-500'
                                : lender.approvalRate >= 70
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                            }`}
                            style={{ width: `${lender.approvalRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {lender.avgTime} days
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {lender.deals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm text-right">
              <button className="text-primary-600 hover:text-primary-800 font-medium">
                View all lenders →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Commission Forecast</h3>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-6">
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-gray-900">$86.2K</div>
                <div className="text-sm text-gray-500">Annual to Date</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-primary-600">$28.5K</div>
                <div className="text-sm text-gray-500">Current Month</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-bold text-green-600">$32K</div>
                <div className="text-sm text-gray-500">Forecast Next Month</div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {commissionForecasts.map((forecast, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">{forecast.month}</div>
                    <div className="text-sm text-gray-500">{forecast.status}</div>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      forecast.status === 'Paid'
                        ? 'text-green-600'
                        : forecast.status === 'Projected'
                          ? 'text-primary-600'
                          : 'text-indigo-600'
                    }`}
                  >
                    ${forecast.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Annual Target: $350,000</span>
                <span className="text-sm font-medium text-green-600">25% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple error boundary component
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Dashboard error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl text-red-600 font-bold mb-4">Dashboard Error</h2>
          <p className="mb-4">There was a problem loading the dashboard.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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

  // Get the user type string for the demo mode switcher
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
    navigate('/credit-application');
  };

  // Add view transaction handler
  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transaction/${transactionId}`);
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-primary-600 text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
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
        </div>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-primary-600 rounded-full border-t-transparent"></div>
          </div>
        }
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto px-4 py-6 space-y-6">
            {/* Demo Mode Switcher */}
            <DemoModeSwitcherPanel
              currentUserType={getUserTypeString(userType || UserType.BUSINESS)}
              onUserTypeChange={handleUserTypeSwitch}
            />

            {/* Dashboard content based on user type */}
            <div className="space-y-6">
              {userType === UserType.BUSINESS && <BusinessDashboard />}
              {userType === UserType.VENDOR && <VendorDashboard />}
              {userType === UserType.BROKERAGE && <BrokerageDashboard />}
              {userType === UserType.LENDER && <LenderDashboard />}
            </div>
          </div>

          {/* Dialog for new deal options */}
          <NewDealDialog />
        </div>
      </Suspense>
    </DashboardErrorBoundary>
  );
};

export default Dashboard;
