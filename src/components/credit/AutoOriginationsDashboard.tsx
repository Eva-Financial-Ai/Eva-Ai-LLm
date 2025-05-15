import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { useUserType } from '../../contexts/UserTypeContext';
import RoleBasedDashboard from './RoleBasedDashboard';
import { UserRole } from './RoleBasedHeader';
import TopNavbar, { UserRoleType, UserSpecificRoleType, DemoContextType } from '../layout/TopNavbar';
import TeamMembersPanel, { TeamMember } from '../TeamMembersPanel';

// Import recharts components directly with ignore comment to bypass TypeScript error
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
  AreaChart,
  Area,
} from 'recharts';
// Import using require to bypass TypeScript module resolution issues
const ReactBeautifulDnd = require('react-beautiful-dnd');
const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;

interface Application {
  id: string;
  borrowerName: string;
  borrowerId?: string;
  businessName: string;
  amount: number;
  status:
    | 'new_application'
    | 'documents_pending'
    | 'under_review'
    | 'approved'
    | 'funded'
    | 'rejected';
  date: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  vehicleInfo?: {
    type: string;
    make: string;
    model: string;
    year: number;
  };
  lastActivity: string;
  completedSteps: string[];
  type?: string;
  createdAt?: string;
  createdBy?: string;
  lastUpdated?: string;
  documentStatus?: string;
  creditScore?: number;
  timeInBusiness?: string;
  eva_recommendation?: string;
  risk_score?: number;
}

interface Column {
  id: string;
  title: string;
  applications: Application[];
}

// Define different application statuses
const STATUSES = {
  NEW_APPLICATION: 'new_application',
  DOCUMENTS_PENDING: 'documents_pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  FUNDED: 'funded',
  REJECTED: 'rejected',
};

// Sample application data
const SAMPLE_APPLICATIONS = [
  {
    id: 'app-1',
    borrowerName: 'Acme Industries',
    borrowerId: 'b-1001',
    businessName: 'Acme Industries LLC',
    amount: 125000,
    type: 'Equipment Finance',
    status: STATUSES.UNDER_REVIEW as 'under_review',
    date: '2023-08-15',
    createdAt: '2023-08-15',
    createdBy: 'John Smith',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-16',
    lastActivity: '2023-08-16: Documents requested',
    priority: 'High' as 'high',
    documentStatus: 'Incomplete',
    creditScore: 710,
    timeInBusiness: '5 years',
    eva_recommendation: 'Approve',
    risk_score: 82,
    completedSteps: ['application', 'basic_info'],
  },
  {
    id: 'app-2',
    borrowerName: 'Global Manufacturing Co',
    borrowerId: 'b-1002',
    businessName: 'Global Manufacturing',
    amount: 250000,
    type: 'Commercial Real Estate',
    status: STATUSES.APPROVED as 'approved',
    date: '2023-08-10',
    createdAt: '2023-08-10',
    createdBy: 'Sarah Johnson',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-14',
    lastActivity: '2023-08-14: Approval granted',
    priority: 'Medium' as 'medium',
    documentStatus: 'Complete',
    creditScore: 760,
    timeInBusiness: '12 years',
    eva_recommendation: 'Approve',
    risk_score: 88,
    completedSteps: ['application', 'basic_info', 'documents', 'review'],
  },
  {
    id: 'app-3',
    borrowerName: 'Quantum Technologies',
    borrowerId: 'b-1003',
    businessName: 'Quantum Tech Inc',
    amount: 75000,
    type: 'Working Capital',
    status: STATUSES.FUNDED as 'funded',
    date: '2023-08-05',
    createdAt: '2023-08-05',
    createdBy: 'John Smith',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-12',
    lastActivity: '2023-08-12: Funding completed',
    priority: 'Low' as 'low',
    documentStatus: 'Complete',
    creditScore: 740,
    timeInBusiness: '3 years',
    eva_recommendation: 'Approve',
    risk_score: 85,
    completedSteps: ['application', 'basic_info', 'documents', 'review', 'funding'],
  },
  {
    id: 'app-4',
    borrowerName: 'Sunrise Retail Solutions',
    borrowerId: 'b-1004',
    businessName: 'Sunrise Retail',
    amount: 50000,
    type: 'Equipment Finance',
    status: STATUSES.REJECTED as 'rejected',
    date: '2023-08-08',
    createdAt: '2023-08-08',
    createdBy: 'Sarah Johnson',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-13',
    lastActivity: '2023-08-13: Application rejected',
    priority: 'Medium' as 'medium',
    documentStatus: 'Incomplete',
    creditScore: 620,
    timeInBusiness: '1 year',
    eva_recommendation: 'Decline',
    risk_score: 61,
    completedSteps: ['application', 'basic_info'],
  },
  {
    id: 'app-5',
    borrowerName: 'Horizon Logistics',
    borrowerId: 'b-1005',
    businessName: 'Horizon Logistics Corp',
    amount: 180000,
    type: 'Commercial Auto',
    status: STATUSES.UNDER_REVIEW as 'under_review',
    date: '2023-08-13',
    createdAt: '2023-08-13',
    createdBy: 'John Smith',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-15',
    lastActivity: '2023-08-15: Underwriter assigned',
    priority: 'High' as 'high',
    documentStatus: 'Pending',
    creditScore: 690,
    timeInBusiness: '4 years',
    eva_recommendation: 'Additional Review',
    risk_score: 75,
    completedSteps: ['application', 'basic_info', 'documents'],
  },
  {
    id: 'app-6',
    borrowerName: 'Mountain View Construction',
    borrowerId: 'b-1006',
    businessName: 'Mountain View Construction LLC',
    amount: 320000,
    type: 'Commercial Real Estate',
    status: STATUSES.APPROVED as 'approved',
    date: '2023-08-07',
    createdAt: '2023-08-07',
    createdBy: 'Sarah Johnson',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-14',
    lastActivity: '2023-08-14: Terms accepted',
    priority: 'High' as 'high',
    documentStatus: 'Complete',
    creditScore: 780,
    timeInBusiness: '8 years',
    eva_recommendation: 'Approve',
    risk_score: 91,
    completedSteps: ['application', 'basic_info', 'documents', 'review'],
  },
  // Add examples with new statuses
  {
    id: 'app-7',
    borrowerName: 'Innovate Solutions',
    borrowerId: 'b-1007',
    businessName: 'Innovate Solutions Inc',
    amount: 95000,
    type: 'Equipment Finance',
    status: STATUSES.NEW_APPLICATION as 'new_application',
    date: '2023-08-20',
    createdAt: '2023-08-20',
    createdBy: 'Emma Davis',
    assignedTo: '',
    lastUpdated: '2023-08-20',
    lastActivity: '2023-08-20: Application submitted',
    priority: 'Medium' as 'medium',
    documentStatus: 'Not Started',
    creditScore: 715,
    timeInBusiness: '2 years',
    eva_recommendation: 'Review',
    risk_score: 78,
    completedSteps: ['application'],
  },
  {
    id: 'app-8',
    borrowerName: 'Green Energy Co',
    borrowerId: 'b-1008',
    businessName: 'Green Energy Solutions',
    amount: 135000,
    type: 'Solar Equipment',
    status: STATUSES.DOCUMENTS_PENDING as 'documents_pending',
    date: '2023-08-18',
    createdAt: '2023-08-18',
    createdBy: 'Alex Wong',
    assignedTo: 'Chris Taylor',
    lastUpdated: '2023-08-19',
    lastActivity: '2023-08-19: Documents requested',
    priority: 'High' as 'high',
    documentStatus: 'Pending',
    creditScore: 750,
    timeInBusiness: '4 years',
    eva_recommendation: 'Approve',
    risk_score: 85,
    completedSteps: ['application', 'basic_info'],
  },
];

// Sample vendor equipment data (for vendor view)
const VENDOR_EQUIPMENT = [
  {
    id: 'equip-1',
    equipmentName: 'Industrial CNC Machine XL-5000',
    model: 'CNC-5000',
    manufacturer: 'TechMach Industries',
    price: 85000,
    inStock: true,
    category: 'Manufacturing',
    financingRequests: 3,
    approvedRequests: 2,
    pendingApprovals: 1,
    avgApprovalTime: '3 days',
    popularFinancingTerm: '60 months'
  },
  {
    id: 'equip-2',
    equipmentName: 'Commercial Refrigeration System',
    model: 'CRS-X450',
    manufacturer: 'ColdTech Solutions',
    price: 42000,
    inStock: true,
    category: 'Food Service',
    financingRequests: 5,
    approvedRequests: 4,
    pendingApprovals: 1,
    avgApprovalTime: '2 days',
    popularFinancingTerm: '48 months'
  },
  {
    id: 'equip-3',
    equipmentName: 'Heavy Duty Tractor',
    model: 'HDT-8900',
    manufacturer: 'AgriMech Corp',
    price: 120000,
    inStock: false,
    category: 'Agriculture',
    financingRequests: 2,
    approvedRequests: 0,
    pendingApprovals: 2,
    avgApprovalTime: 'Pending',
    popularFinancingTerm: '72 months'
  },
  {
    id: 'equip-4',
    equipmentName: 'Solar Panel Installation Kit',
    model: 'SPK-2000',
    manufacturer: 'GreenEnergy Solutions',
    price: 28500,
    inStock: true,
    category: 'Renewable Energy',
    financingRequests: 8,
    approvedRequests: 6,
    pendingApprovals: 2,
    avgApprovalTime: '4 days',
    popularFinancingTerm: '36 months'
  },
  {
    id: 'equip-5',
    equipmentName: 'Medical Imaging System',
    model: 'MIS-Ultra',
    manufacturer: 'MedTech Innovations',
    price: 195000,
    inStock: true,
    category: 'Healthcare',
    financingRequests: 1,
    approvedRequests: 1,
    pendingApprovals: 0,
    avgApprovalTime: '5 days',
    popularFinancingTerm: '84 months'
  }
];

// Add vendor financing metrics data
const VENDOR_FINANCING_METRICS = {
  totalFinancingVolume: 1250000,
  approvalRate: 78,
  averageTransactionSize: 62500,
  topFinancedCategories: [
    { name: 'Manufacturing', amount: 450000 },
    { name: 'Healthcare', amount: 320000 },
    { name: 'Agriculture', amount: 230000 },
    { name: 'Food Service', amount: 150000 },
    { name: 'Renewable Energy', amount: 100000 }
  ],
  monthlyTrends: [
    { month: 'Jan', amount: 85000 },
    { month: 'Feb', amount: 92000 },
    { month: 'Mar', amount: 78000 },
    { month: 'Apr', amount: 105000 },
    { month: 'May', amount: 125000 },
    { month: 'Jun', amount: 165000 }
  ]
};

// Sample broker commissions (for broker view)
const BROKER_COMMISSIONS = [
  {
    id: 'comm-1',
    applicationId: 'app-2',
    borrowerName: 'Global Manufacturing Co',
    loanAmount: 250000,
    loanType: 'Commercial Real Estate',
    commissionRate: 1.5,
    commissionAmount: 3750,
    status: 'Pending',
    expectedPaymentDate: '2023-09-14',
    lender: 'Capital Express',
    closingDate: '2023-08-30'
  },
  {
    id: 'comm-2',
    applicationId: 'app-3',
    borrowerName: 'Quantum Technologies',
    loanAmount: 75000,
    loanType: 'Working Capital',
    commissionRate: 2.0,
    commissionAmount: 1500,
    status: 'Paid',
    paymentDate: '2023-08-20',
    lender: 'First National Bank',
    closingDate: '2023-08-15'
  },
  {
    id: 'comm-3',
    applicationId: 'app-6',
    borrowerName: 'Mountain View Construction',
    loanAmount: 320000,
    loanType: 'Commercial Real Estate',
    commissionRate: 1.25,
    commissionAmount: 4000,
    status: 'Pending',
    expectedPaymentDate: '2023-09-20',
    lender: 'Midwest Funding Partners',
    closingDate: '2023-09-05'
  },
  {
    id: 'comm-4',
    applicationId: 'app-9',
    borrowerName: 'Sunrise Healthcare Solutions',
    loanAmount: 180000,
    loanType: 'Equipment Finance',
    commissionRate: 1.75,
    commissionAmount: 3150,
    status: 'Paid',
    paymentDate: '2023-08-25',
    lender: 'Healthcare Capital Group',
    closingDate: '2023-08-20'
  },
  {
    id: 'comm-5',
    applicationId: 'app-10',
    borrowerName: 'Fresh Harvest Organics',
    loanAmount: 95000,
    loanType: 'SBA Loan',
    commissionRate: 2.25,
    commissionAmount: 2138,
    status: 'Processing',
    expectedPaymentDate: '2023-10-05',
    lender: 'Community First Bank',
    closingDate: 'Pending'
  }
];

// Sample borrower loans (for borrower view)
const BORROWER_LOANS = [
  {
    id: 'loan-1',
    loanAmount: 125000,
    type: 'Equipment Finance',
    status: 'Processing',
    applicationDate: '2023-08-15',
    lender: 'Acme Financial',
    interestRate: 5.75,
    term: 60,
    monthlyPayment: 2400,
    nextPaymentDue: '2023-10-01',
  },
  {
    id: 'loan-2',
    loanAmount: 50000,
    type: 'Working Capital',
    status: 'Approved',
    applicationDate: '2023-07-10',
    lender: 'Capital Express',
    interestRate: 7.25,
    term: 36,
    monthlyPayment: 1550,
    nextPaymentDue: '2023-09-15',
  },
];

interface ApplicationCardProps {
  application: any;
  index: number;
}

// Application Card Component
const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Function to determine the application stage based on features/sections
  const getApplicationStage = (application: Application) => {
    // Check which features/sections the application is in
    if (application.completedSteps.includes('risk_map')) {
      return 'Risk Map Navigator';
    } else if (application.completedSteps.includes('document_verification')) {
      return 'Document Verification';
    } else if (application.completedSteps.includes('deal_structuring')) {
      return 'Deal Structuring';
    } else if (application.completedSteps.includes('basic_info')) {
      return 'Credit Application';
    } else {
      return 'Application Form';
    }
  };

  // Function to get outstanding actions
  const getOutstandingActions = (application: Application) => {
    const actions: string[] = [];

    if (!application.completedSteps.includes('basic_info')) {
      actions.push('Complete basic information');
    }

    if (application.documentStatus === 'Incomplete' || application.documentStatus === 'Pending') {
      actions.push('Upload required documents');
    }

    if (
      !application.completedSteps.includes('risk_map') &&
      application.completedSteps.includes('basic_info')
    ) {
      actions.push('Complete risk assessment');
    }

    if (application.status === 'under_review') {
      actions.push('Underwriter review');
    }

    if (
      application.completedSteps.includes('review') &&
      !application.completedSteps.includes('funding')
    ) {
      actions.push('Process funding');
    }

    return actions;
  };

  // Get outstanding actions
  const outstandingActions = getOutstandingActions(application);
  const applicationStage = getApplicationStage(application);

  return (
    <Draggable draggableId={application.id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-5 mb-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          style={{ ...provided.draggableProps.style, minHeight: '300px' }} // Increased card height for better consistency
        >
          <div className="flex justify-between items-start mb-3">
            <div className="font-bold text-lg">{application.borrowerName}</div>
            <div
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                application.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : application.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : application.status === 'funded'
                      ? 'bg-blue-100 text-blue-800'
                      : application.status === 'under_review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === 'documents_pending'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
              }`}
            >
              {application.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            ID: {application.borrowerId || application.id}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">BUSINESS</div>
              <div className="text-sm font-medium">{application.businessName}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">AMOUNT</div>
              <div className="text-sm font-semibold">${application.amount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">TYPE</div>
              <div className="text-sm font-medium">{application.type}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">PRIORITY</div>
              <div className={`text-sm font-medium ${getPriorityColor(application.priority)}`}>
                {typeof application.priority === 'string'
                  ? application.priority.charAt(0).toUpperCase() + application.priority.slice(1)
                  : application.priority}
              </div>
            </div>
          </div>

          {/* New fields for better decision making */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">CREDIT SCORE</div>
              <div
                className={`text-sm font-semibold ${
                  (application.creditScore || 0) > 700
                    ? 'text-green-600'
                    : (application.creditScore || 0) > 650
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {application.creditScore || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">TIME IN BUSINESS</div>
              <div className="text-sm font-medium">{application.timeInBusiness || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">RISK SCORE</div>
              <div
                className={`text-sm font-semibold ${
                  (application.risk_score || 0) > 80
                    ? 'text-green-600'
                    : (application.risk_score || 0) > 70
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {application.risk_score || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">EVA REC</div>
              <div
                className={`text-sm font-medium ${
                  application.eva_recommendation === 'Approve'
                    ? 'text-green-600'
                    : application.eva_recommendation === 'Decline'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                }`}
              >
                {application.eva_recommendation || 'Pending'}
              </div>
            </div>
          </div>

          {/* Application Stage */}
          <div className="mb-3">
            <div className="text-xs font-medium text-gray-500 mb-1">CURRENT STAGE</div>
            <div className="text-sm font-medium text-blue-600">{applicationStage}</div>
          </div>

          {/* Outstanding Actions */}
          {outstandingActions.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 mb-1">OUTSTANDING ACTIONS</div>
              <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
                {outstandingActions.slice(0, 2).map((action, idx) => (
                  <li key={idx} className="mb-1">{action}</li>
                ))}
                {outstandingActions.length > 2 && (
                  <li className="text-blue-500">+{outstandingActions.length - 2} more actions</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {application.assignedTo ? `Assigned: ${application.assignedTo}` : 'Unassigned'}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(application.date).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// Equipment Card for Vendor View
const EquipmentCard: React.FC<{ equipment: any }> = ({ equipment }) => {
  return (
    <div className="p-5 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{equipment.equipmentName}</h3>
          <p className="text-sm text-gray-600 mb-1">Model: {equipment.model}</p>
          <p className="text-sm text-gray-600 mb-1">Manufacturer: {equipment.manufacturer || 'N/A'}</p>
          <p className="text-sm text-gray-600 mb-2">Category: {equipment.category || 'N/A'}</p>
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ${equipment.price.toLocaleString()}
            </span>
            <span
              className={`ml-2 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                equipment.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {equipment.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Financing Requests: {equipment.financingRequests}
          </p>
          <p className="text-sm text-gray-600 mb-1">Approved: {equipment.approvedRequests}</p>
          <p className="text-sm text-gray-600 mb-1">Pending: {equipment.pendingApprovals}</p>
          <p className="text-sm text-gray-600 mb-1">Avg. Approval: {equipment.avgApprovalTime}</p>
          <p className="text-sm text-gray-600">Popular Term: {equipment.popularFinancingTerm}</p>
        </div>
      </div>
    </div>
  );
};

// Commission Card for Broker View
const CommissionCard: React.FC<{ commission: any }> = ({ commission }) => {
  return (
    <div className="p-5 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{commission.borrowerName}</h3>
          <p className="text-sm text-gray-600 mb-1">App ID: {commission.applicationId}</p>
          <p className="text-sm text-gray-600 mb-2">Lender: {commission.lender}</p>
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {commission.loanType}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Loan: ${commission.loanAmount.toLocaleString()}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Rate: {commission.commissionRate}%
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
            commission.status === 'Paid' ? 'bg-green-100 text-green-800' : 
            commission.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {commission.status}
          </p>
          <p className="text-sm mt-2 font-bold text-green-600">
            ${commission.commissionAmount.toLocaleString()}
          </p>
          <p className="text-sm mt-1 text-gray-600">
            {commission.status === 'Paid' ? `Paid: ${commission.paymentDate}` : 
             commission.status === 'Pending' ? `Expected: ${commission.expectedPaymentDate}` : 
             'Processing'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Closing: {commission.closingDate}
          </p>
        </div>
      </div>
    </div>
  );
};

// Loan Card for Borrower View
const LoanCard: React.FC<{ loan: any }> = ({ loan }) => {
  return (
    <div className="p-5 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{loan.type}</h3>
          <p className="text-sm text-gray-600 mb-2">Lender: {loan.lender}</p>
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${loan.loanAmount.toLocaleString()}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {loan.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700 mb-1">Rate: {loan.interestRate}%</p>
          <p className="text-sm text-gray-600 mb-1">Term: {loan.term} months</p>
          <p className="text-sm text-gray-600 mt-2">Next Payment: {loan.nextPaymentDue}</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium">Monthly Payment:</span> ${loan.monthlyPayment}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Application Date:</span> {loan.applicationDate}
        </p>
      </div>
    </div>
  );
};

// New interface for dashboard metrics
interface DashboardMetrics {
  weeklyApplications: { name: string; count: number }[];
  statusDistribution: { name: string; value: number }[];
  amountByIndustry: { name: string; amount: number }[];
  conversionRates: { name: string; rate: number }[];
  approvalTrend: { date: string; applications: number; approvals: number }[];
}

// Conversation Agent Type
interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  primaryColor: string;
  capabilities: string[];
}

// User persona type
interface UserPersona {
  id: string;
  role: string;
  name: string;
  goals: string[];
  painPoints: string[];
  userStory: string;
  preferredAgents: string[];
}

// Sample user personas
const USER_PERSONAS: UserPersona[] = [
  {
    id: 'lender-1',
    role: 'lender',
    name: 'Financial Manager Sarah',
    goals: [
      'Efficiently review and process loan applications',
      'Make data-driven decisions on approvals',
      'Minimize risk in the loan portfolio',
      'Meet monthly origination targets',
    ],
    painPoints: [
      'Too much time spent on manual document review',
      'Difficult to assess risk across different industries',
      'Lacks holistic view of application pipeline',
      'Too many systems to navigate for complete information',
    ],
    userStory:
      'As a financial manager, I need to quickly review loan applications, assess risks, and make approval decisions so I can meet origination targets while maintaining portfolio quality.',
    preferredAgents: ['risk-analyst', 'doc-specialist', 'financial-advisor'],
  },
  {
    id: 'broker-1',
    role: 'broker',
    name: 'Broker Michael',
    goals: [
      'Submit complete applications on behalf of clients',
      'Track application status in real-time',
      'Maximize commission revenue',
      'Build relationships with multiple lenders',
    ],
    painPoints: [
      'Slow feedback on incomplete applications',
      'Lack of transparency on approval criteria',
      'Difficulty predicting approval likelihood',
      'Commission payment delays',
    ],
    userStory:
      'As a broker, I need to efficiently submit applications and track their progress so I can manage client expectations and plan my commission pipeline.',
    preferredAgents: ['application-assistant', 'commission-tracker', 'client-advisor'],
  },
  {
    id: 'borrower-1',
    role: 'borrower',
    name: 'Small Business Owner Jennifer',
    goals: [
      'Secure financing with minimal paperwork',
      'Understand loan terms and requirements',
      'Get quick decisions on applications',
      'Find the best rates and terms',
    ],
    painPoints: [
      'Complicated application process',
      'Unclear documentation requirements',
      'Slow approval process',
      'Difficulty understanding loan terms',
    ],
    userStory:
      'As a small business owner, I need a simple application process with clear requirements so I can secure financing quickly with minimal disruption to my business.',
    preferredAgents: ['document-guide', 'application-assistant', 'term-explainer'],
  },
  {
    id: 'vendor-1',
    role: 'vendor',
    name: 'Equipment Vendor Carlos',
    goals: [
      'Facilitate equipment financing for customers',
      'Track financing application status',
      'Convert more sales through financing options',
      'Maintain inventory visibility',
    ],
    painPoints: [
      'Sales lost due to financing delays',
      'Lack of integration between inventory and financing',
      'Limited visibility into application status',
      'Complex financing process discourages customers',
    ],
    userStory:
      'As an equipment vendor, I need to offer seamless financing options so my customers can easily purchase equipment without lengthy delays.',
    preferredAgents: ['inventory-specialist', 'financing-specialist', 'sales-advisor'],
  },
];

// Sample agent types
const AGENT_TYPES: AgentType[] = [
  {
    id: 'risk-analyst',
    name: 'EVA Risk Analyst',
    description: 'Specializes in risk assessment and financial analysis for loan applications',
    icon: '🧠',
    primaryColor: '#4F46E5',
    capabilities: [
      'Credit risk analysis',
      'Financial statement interpretation',
      'Industry risk factor identification',
      'Fraud detection',
      'Portfolio risk assessment',
    ],
  },
  {
    id: 'doc-specialist',
    name: 'Document Specialist',
    description: 'Assists with document verification, extraction, and organization',
    icon: '📄',
    primaryColor: '#10B981',
    capabilities: [
      'Document verification',
      'Information extraction',
      'Missing document identification',
      'Document organization',
      'Regulatory compliance checking',
    ],
  },
  {
    id: 'financial-advisor',
    name: 'Financial Advisor',
    description: 'Provides financial advice and loan structuring recommendations',
    icon: '💰',
    primaryColor: '#F59E0B',
    capabilities: [
      'Loan term optimization',
      'Repayment planning',
      'Financial impact analysis',
      'Alternative financing suggestions',
      'Cash flow forecasting',
    ],
  },
  {
    id: 'application-assistant',
    name: 'Application Assistant',
    description: 'Guides users through the application process and requirements',
    icon: '📝',
    primaryColor: '#EC4899',
    capabilities: [
      'Application form guidance',
      'Requirements explanation',
      'Application status tracking',
      'Information completeness checking',
      'Application submission assistance',
    ],
  },
  {
    id: 'client-advisor',
    name: 'Client Relationship Advisor',
    description: 'Helps manage client relationships and communication',
    icon: '👥',
    primaryColor: '#8B5CF6',
    capabilities: [
      'Client communication templates',
      'Follow-up scheduling',
      'Client need assessment',
      'Application history tracking',
      'Client satisfaction monitoring',
    ],
  },
];

// Create some mock team members
// Add mock team data for each user type
const MOCK_LENDER_TEAM: TeamMember[] = [
  {
    id: 'member-1',
    name: 'John Smith',
    email: 'john.smith@lendercompany.com',
    role: 'lender',
    specificRole: 'default_role',
    dateAdded: '2023-06-15',
    addedBy: 'Admin User',
    permissions: ['view', 'edit', 'approve_loans'],
    status: 'active'
  },
  {
    id: 'member-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@lendercompany.com',
    role: 'lender',
    specificRole: 'default_role',
    dateAdded: '2023-07-22',
    addedBy: 'Admin User',
    permissions: ['view', 'edit', 'approve_loans', 'view_financials'],
    status: 'active'
  },
  {
    id: 'member-3',
    name: 'Michael Chen',
    email: 'm.chen@lendercompany.com',
    role: 'lender',
    specificRole: 'cpa_bookkeeper',
    dateAdded: '2023-08-10',
    addedBy: 'Admin User',
    permissions: ['view', 'view_financials'],
    status: 'active'
  },
  {
    id: 'member-4',
    name: 'Jessica Rodriguez',
    email: 'j.rodriguez@lendercompany.com',
    role: 'lender',
    specificRole: 'default_role',
    dateAdded: '2023-08-05',
    addedBy: 'John Smith',
    permissions: ['view', 'edit', 'approve_loans', 'portfolio_management'],
    status: 'active'
  },
  {
    id: 'member-5',
    name: 'Robert Taylor',
    email: 'r.taylor@lendercompany.com',
    role: 'lender',
    specificRole: 'default_role',
    dateAdded: '2023-07-30',
    addedBy: 'Admin User',
    permissions: ['view', 'edit', 'risk_assessment', 'underwriting'],
    status: 'active'
  }
];

const MOCK_BROKER_TEAM: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Lisa Rodriguez',
    email: 'lisa@brokeragefirm.com',
    role: 'broker',
    specificRole: 'default_role',
    dateAdded: '2023-05-20',
    addedBy: 'Admin User',
    permissions: ['view', 'edit', 'submit_applications', 'client_communication'],
    status: 'active'
  },
  {
    id: 'member-2',
    name: 'David Wilson',
    email: 'david@brokeragefirm.com',
    role: 'broker',
    specificRole: 'default_role',
    dateAdded: '2023-07-12',
    addedBy: 'Admin User',
    permissions: ['view', 'edit', 'submit_applications'],
    status: 'active'
  },
  {
    id: 'member-3',
    name: 'Emily Chen',
    email: 'emily@brokeragefirm.com',
    role: 'broker',
    specificRole: 'cpa_bookkeeper',
    dateAdded: '2023-06-30',
    addedBy: 'Lisa Rodriguez',
    permissions: ['view', 'view_financials', 'document_preparation'],
    status: 'active'
  },
  {
    id: 'member-4',
    name: 'Marcus Johnson',
    email: 'marcus@brokeragefirm.com',
    role: 'broker',
    specificRole: 'default_role',
    dateAdded: '2023-08-15',
    addedBy: 'Lisa Rodriguez',
    permissions: ['view', 'edit', 'submit_applications', 'client_communication'],
    status: 'active'
  },
  {
    id: 'member-5',
    name: 'Sophia Williams',
    email: 'sophia@brokeragefirm.com',
    role: 'broker',
    specificRole: 'default_role',
    dateAdded: '2023-07-25',
    addedBy: 'Admin User',
    permissions: ['view', 'edit', 'submit_applications', 'client_communication'],
    status: 'pending'
  }
];

const MOCK_BORROWER_TEAM: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Jennifer Lewis',
    email: 'jennifer@acmeindustries.com',
    role: 'borrower',
    specificRole: 'owners',
    dateAdded: '2023-08-01',
    addedBy: 'System Admin',
    permissions: ['view', 'edit', 'sign_documents', 'payment_access', 'document_upload'],
    status: 'active'
  },
  {
    id: 'member-2',
    name: 'Robert Brown',
    email: 'robert@acmeindustries.com',
    role: 'borrower',
    specificRole: 'authorized_proxy',
    dateAdded: '2023-08-05',
    addedBy: 'Jennifer Lewis',
    permissions: ['view', 'document_upload'],
    status: 'active'
  },
  {
    id: 'member-3',
    name: 'Amanda Parker',
    email: 'accounting@acmeindustries.com',
    role: 'borrower',
    specificRole: 'cpa_bookkeeper',
    dateAdded: '2023-08-12',
    addedBy: 'Jennifer Lewis',
    permissions: ['view', 'document_upload'],
    status: 'pending'
  }
];

const MOCK_VENDOR_TEAM: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Carlos Mendez',
    email: 'carlos@equipmentvendor.com',
    role: 'vendor',
    specificRole: 'business_owner',
    dateAdded: '2023-07-05',
    addedBy: 'System Admin',
    permissions: ['view', 'edit', 'manage_inventory', 'view_financing_status', 'quote_generation', 'manage_team', 'approval_authority'],
    status: 'active'
  },
  {
    id: 'member-2',
    name: 'Maria Garcia',
    email: 'maria@equipmentvendor.com',
    role: 'vendor',
    specificRole: 'sales_department',
    dateAdded: '2023-07-15',
    addedBy: 'Carlos Mendez',
    permissions: ['view', 'edit', 'quote_generation', 'view_financing_status', 'customer_communication'],
    status: 'active'
  },
  {
    id: 'member-3',
    name: 'James Wilson',
    email: 'james@equipmentvendor.com',
    role: 'vendor',
    specificRole: 'finance_department',
    dateAdded: '2023-07-28',
    addedBy: 'Carlos Mendez',
    permissions: ['view', 'edit', 'view_financing_status', 'financial_reporting', 'payment_tracking'],
    status: 'active'
  },
  {
    id: 'member-4',
    name: 'Sarah Johnson',
    email: 'sarah@equipmentvendor.com',
    role: 'vendor',
    specificRole: 'marketing',
    dateAdded: '2023-08-10',
    addedBy: 'Carlos Mendez',
    permissions: ['view', 'edit', 'marketing_campaigns', 'customer_communication'],
    status: 'active'
  },
  {
    id: 'member-5',
    name: 'Robert Chen',
    email: 'robert@equipmentvendor.com',
    role: 'vendor',
    specificRole: 'maintenance_service',
    dateAdded: '2023-08-15',
    addedBy: 'Carlos Mendez',
    permissions: ['view', 'service_scheduling', 'inventory_visibility'],
    status: 'active'
  }
];

// Sample broker clients (for broker view)
const BROKER_CLIENTS = [
  {
    id: 'client-1',
    name: 'Global Manufacturing Co',
    contactName: 'Robert Chen',
    contactEmail: 'robert@globalmfg.com',
    contactPhone: '(555) 123-4567',
    industry: 'Manufacturing',
    activeApplications: 1,
    completedDeals: 2,
    totalFunding: 450000,
    lastActivity: '2023-08-30',
    status: 'Active'
  },
  {
    id: 'client-2',
    name: 'Quantum Technologies',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@quantumtech.com',
    contactPhone: '(555) 234-5678',
    industry: 'Technology',
    activeApplications: 0,
    completedDeals: 1,
    totalFunding: 75000,
    lastActivity: '2023-08-15',
    status: 'Active'
  },
  {
    id: 'client-3',
    name: 'Mountain View Construction',
    contactName: 'Michael Brown',
    contactEmail: 'michael@mountainviewconst.com',
    contactPhone: '(555) 345-6789',
    industry: 'Construction',
    activeApplications: 1,
    completedDeals: 1,
    totalFunding: 320000,
    lastActivity: '2023-09-01',
    status: 'Active'
  },
  {
    id: 'client-4',
    name: 'Sunrise Healthcare Solutions',
    contactName: 'Jennifer Lee',
    contactEmail: 'jennifer@sunrisehealthcare.com',
    contactPhone: '(555) 456-7890',
    industry: 'Healthcare',
    activeApplications: 0,
    completedDeals: 1,
    totalFunding: 180000,
    lastActivity: '2023-08-20',
    status: 'Active'
  },
  {
    id: 'client-5',
    name: 'Fresh Harvest Organics',
    contactName: 'David Wilson',
    contactEmail: 'david@freshharvest.com',
    contactPhone: '(555) 567-8901',
    industry: 'Agriculture',
    activeApplications: 1,
    completedDeals: 0,
    totalFunding: 0,
    lastActivity: '2023-09-02',
    status: 'New'
  }
];

// Sample lender portfolio data
const LENDER_PORTFOLIO = [
  {
    id: 'loan-portfolio-1',
    category: 'Commercial Real Estate',
    activeLoans: 24,
    totalValue: 8750000,
    averageLoanSize: 364583,
    avgInterestRate: 5.8,
    delinquencyRate: 1.2,
    riskScore: 'Low'
  },
  {
    id: 'loan-portfolio-2',
    category: 'Equipment Finance',
    activeLoans: 35,
    totalValue: 5250000,
    averageLoanSize: 150000,
    avgInterestRate: 6.2,
    delinquencyRate: 1.5,
    riskScore: 'Low'
  },
  {
    id: 'loan-portfolio-3',
    category: 'Working Capital',
    activeLoans: 42,
    totalValue: 3150000,
    averageLoanSize: 75000,
    avgInterestRate: 7.5,
    delinquencyRate: 2.1,
    riskScore: 'Medium'
  },
  {
    id: 'loan-portfolio-4',
    category: 'SBA Loans',
    activeLoans: 18,
    totalValue: 4500000,
    averageLoanSize: 250000,
    avgInterestRate: 5.2,
    delinquencyRate: 0.8,
    riskScore: 'Low'
  },
  {
    id: 'loan-portfolio-5',
    category: 'Bridge Financing',
    activeLoans: 12,
    totalValue: 6200000,
    averageLoanSize: 516667,
    avgInterestRate: 8.1,
    delinquencyRate: 1.9,
    riskScore: 'Medium'
  }
];

// Create broker metrics
const BROKER_METRICS = {
  totalCommissions: 14538,
  pendingCommissions: 9888,
  conversionRate: 68,
  avgDealSize: 184000,
  topLenders: [
    { name: 'Capital Express', deals: 12, volume: 2850000 },
    { name: 'First National Bank', deals: 8, volume: 1200000 },
    { name: 'Midwest Funding Partners', deals: 6, volume: 1800000 },
    { name: 'Healthcare Capital Group', deals: 5, volume: 950000 },
    { name: 'Community First Bank', deals: 4, volume: 720000 }
  ],
  monthlyTrends: [
    { month: 'Apr', applications: 12, approvals: 7, commissions: 8250 },
    { month: 'May', applications: 15, approvals: 10, commissions: 10500 },
    { month: 'Jun', applications: 18, approvals: 12, commissions: 12800 },
    { month: 'Jul', applications: 14, approvals: 9, commissions: 9750 },
    { month: 'Aug', applications: 22, approvals: 15, commissions: 16200 },
    { month: 'Sep', applications: 20, approvals: 14, commissions: 14538 }
  ]
};

// Lender metrics
const LENDER_METRICS = {
  totalPortfolioValue: 27850000,
  activeLoans: 131,
  newApplicationsThisMonth: 24,
  fundedLoansThisMonth: 18,
  portfolioHealth: {
    healthy: 92.5,
    watchList: 5.8,
    delinquent: 1.7
  },
  loanPerformance: [
    { month: 'Apr', funded: 14, value: 3200000 },
    { month: 'May', funded: 17, value: 3850000 },
    { month: 'Jun', funded: 15, value: 4100000 },
    { month: 'Jul', funded: 16, value: 3750000 },
    { month: 'Aug', funded: 18, value: 4500000 },
    { month: 'Sep', funded: 12, value: 2950000 }
  ]
};

// Client card for broker view
const ClientCard: React.FC<{ client: any }> = ({ client }) => {
  return (
    <div className="p-5 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{client.name}</h3>
          <p className="text-sm text-gray-600 mb-1">Contact: {client.contactName}</p>
          <p className="text-sm text-gray-600 mb-2">Industry: {client.industry}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
              client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {client.status}
            </span>
            {client.activeApplications > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {client.activeApplications} Active {client.activeApplications === 1 ? 'Application' : 'Applications'}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700 mb-1">Completed Deals: {client.completedDeals}</p>
          <p className="text-sm text-gray-600 mb-1">Total Funding: ${client.totalFunding.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-2">Last Activity: {client.lastActivity}</p>
        </div>
      </div>
    </div>
  );
};

// Portfolio card for lender view
const PortfolioCard: React.FC<{ portfolio: any }> = ({ portfolio }) => {
  return (
    <div className="p-5 mb-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{portfolio.category}</h3>
          <p className="text-sm text-gray-600 mb-1">Active Loans: {portfolio.activeLoans}</p>
          <p className="text-sm text-gray-600 mb-2">Avg. Loan Size: ${portfolio.averageLoanSize.toLocaleString()}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
              portfolio.riskScore === 'Low' ? 'bg-green-100 text-green-800' : 
              portfolio.riskScore === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {portfolio.riskScore} Risk
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700 mb-1">Total Value: ${portfolio.totalValue.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mb-1">Avg. Interest Rate: {portfolio.avgInterestRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Delinquency Rate: {portfolio.delinquencyRate}%</p>
        </div>
      </div>
    </div>
  );
};

// Add enhanced role hierarchy definition
// Define role hierarchy for permissions - higher number means higher permissions
const ROLE_HIERARCHY = {
  'sales_manager': 1, // Sales & Relation Managers & Business Development Managers
  'loan_processor': 2, // Loan Processor
  'credit_underwriter': 3, // Credit Underwriter & Analysis
  'credit_committee': 4, // Credit Committee
  'portfolio_manager': 5, // Portfolio Manager
  'portfolio_servicer': 6, // Portfolio Navigator Servicer
  'portfolio_monitor': 7, // Portfolio Navigator Monitoring
  'developer': 8, // Developer for Integrations and Monitoring
  'admin': 9, // System Root Admin
};

// Define role display names with proper capitalization
const ROLE_DISPLAY_NAMES = {
  'sales_manager': 'Sales & Relation Manager',
  'loan_processor': 'Loan Processor',
  'credit_underwriter': 'Credit Underwriter & Analyst',
  'credit_committee': 'Credit Committee Member',
  'portfolio_manager': 'Portfolio Manager',
  'portfolio_servicer': 'Portfolio Navigator - Servicer',
  'portfolio_monitor': 'Portfolio Navigator - Monitoring',
  'developer': 'Developer & Integration Specialist',
  'admin': 'System Root Administrator',
  'lender': 'Lender',
  'broker': 'Commercial Broker',
  'borrower': 'Borrower',
  'vendor': 'Equipment Vendor'
};

// Define view types for each role
const ROLE_VIEW_TYPES = {
  'sales_manager': ['macro', 'micro'],
  'loan_processor': ['macro', 'micro'],
  'credit_underwriter': ['macro', 'micro'],
  'credit_committee': ['macro', 'micro'],
  'portfolio_manager': ['macro', 'micro'],
  'portfolio_servicer': ['macro', 'micro'],
  'portfolio_monitor': ['macro', 'micro'],
  'developer': ['system', 'logs', 'integration'],
  'admin': ['system', 'users', 'permissions', 'audit']
};

// Add role-specific KPI definitions
const ROLE_KPIS = {
  'sales_manager': [
    { name: 'New Applications', value: 65, change: 12.5, trend: 'up' },
    { name: 'Conversion Rate', value: '32%', change: 5.2, trend: 'up' },
    { name: 'Total Pipeline', value: '$3.65M', change: 15.3, trend: 'up' },
    { name: 'Avg. Response Time', value: '4h 32m', change: -12.1, trend: 'up' }
  ],
  'loan_processor': [
    { name: 'Documents Pending', value: 24, change: 3.2, trend: 'down' },
    { name: 'Processing Efficiency', value: '87%', change: 4.3, trend: 'up' },
    { name: 'Avg. Process Time', value: '2d 8h', change: -8.7, trend: 'up' },
    { name: 'Error Rate', value: '1.2%', change: -15.5, trend: 'up' }
  ],
  'credit_underwriter': [
    { name: 'Under Review', value: 18, change: 5.5, trend: 'up' },
    { name: 'Risk Assessment Score', value: '84/100', change: 3.2, trend: 'up' },
    { name: 'Approval Rate', value: '72%', change: 2.1, trend: 'up' },
    { name: 'Avg. Analysis Time', value: '3d 4h', change: -12.3, trend: 'up' }
  ],
  'credit_committee': [
    { name: 'Pending Approvals', value: 12, change: -5.8, trend: 'down' },
    { name: 'Approved MTD', value: 28, change: 15.4, trend: 'up' },
    { name: 'Escalation Rate', value: '8.3%', change: -2.1, trend: 'up' },
    { name: 'Avg. Decision Time', value: '1d 6h', change: -15.0, trend: 'up' }
  ],
  'portfolio_manager': [
    { name: 'Active Portfolios', value: 42, change: 7.5, trend: 'up' },
    { name: 'AUM', value: '$28.5M', change: 12.3, trend: 'up' },
    { name: 'Delinquency Rate', value: '1.7%', change: -0.5, trend: 'up' },
    { name: 'Yield', value: '6.2%', change: 0.3, trend: 'up' }
  ],
  'portfolio_servicer': [
    { name: 'Accounts Serviced', value: 156, change: 8.3, trend: 'up' },
    { name: 'Payment Success Rate', value: '96.8%', change: 1.2, trend: 'up' },
    { name: 'Payment Processing Time', value: '0d 6h', change: -25.0, trend: 'up' },
    { name: 'Customer Satisfaction', value: '4.7/5', change: 6.8, trend: 'up' }
  ],
  'portfolio_monitor': [
    { name: 'Accounts Monitored', value: 178, change: 5.3, trend: 'up' },
    { name: 'Early Warning Flags', value: 8, change: -12.5, trend: 'up' },
    { name: 'Compliance Score', value: '96%', change: 2.1, trend: 'up' },
    { name: 'Monitoring Coverage', value: '99.8%', change: 0.5, trend: 'up' }
  ],
  'developer': [
    { name: 'System Uptime', value: '99.96%', change: 0.02, trend: 'up' },
    { name: 'API Requests (24h)', value: '854K', change: 12.3, trend: 'up' },
    { name: 'Avg. Response Time', value: '128ms', change: -15.2, trend: 'up' },
    { name: 'Active Integrations', value: 24, change: 4.3, trend: 'up' }
  ],
  'admin': [
    { name: 'Active Users', value: 182, change: 8.3, trend: 'up' },
    { name: 'System Health', value: '98%', change: 2.1, trend: 'up' },
    { name: 'Security Events (24h)', value: 5, change: -25.0, trend: 'up' },
    { name: 'Resource Utilization', value: '42%', change: -5.5, trend: 'up' }
  ]
};

// Enhanced KPI card component with visual indicators
const KpiCard: React.FC<{ kpi: any, className?: string }> = ({ kpi, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-5 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{kpi.name}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</p>
      <div className={`mt-2 text-sm flex items-center ${
        kpi.trend === 'up' 
          ? (kpi.change > 0 ? 'text-green-600' : 'text-red-600') 
          : (kpi.change > 0 ? 'text-red-600' : 'text-green-600')
      }`}>
        {kpi.change > 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% from last month
        <div className="ml-2 w-16 h-4 bg-gray-100 rounded overflow-hidden">
          <div 
            className={`h-full ${kpi.trend === 'up' 
              ? (kpi.change > 0 ? 'bg-green-500' : 'bg-red-500') 
              : (kpi.change > 0 ? 'bg-red-500' : 'bg-green-500')}`}
            style={{ width: `${Math.min(Math.abs(kpi.change) * 3, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Create a role selection component
const RoleSelector: React.FC<{ 
  currentRole: UserRole, 
  roles: string[], 
  onChange: (role: UserRole) => void 
}> = ({ currentRole, roles, onChange }) => {
  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Switch View</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => onChange(role as UserRole)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              currentRole === role
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {ROLE_DISPLAY_NAMES[role] || role}
          </button>
        ))}
      </div>
    </div>
  );
};

// Create a view mode selector component (Macro/Micro)
const ViewModeSelector: React.FC<{
  currentViewMode: string,
  availableViewModes: string[],
  onChange: (mode: string) => void
}> = ({ currentViewMode, availableViewModes, onChange }) => {
  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden mb-6 w-fit">
      {availableViewModes.map(mode => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-4 py-2 text-sm font-medium ${
            currentViewMode === mode
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)} View
        </button>
      ))}
    </div>
  );
};

const AutoOriginationsDashboard = () => {
  const navigate = useNavigate();
  
  // Use UserContext and UserTypeContext to get role information
  const userContext = useContext(UserContext);
  const userTypeContext = useUserType();
  
  // Set state based on context values
  const [currentUserType, setCurrentUserType] = useState<UserRoleType>(
    localStorage.getItem('userRole') as UserRoleType || 'lender'
  );
  const [currentSpecificRole, setCurrentSpecificRole] = useState<UserSpecificRoleType>(
    localStorage.getItem('specificRole') as UserSpecificRoleType || 'default_role'
  );
  const [currentDemoContext, setCurrentDemoContext] = useState<DemoContextType>('all');
  
  // Add new state for employee role and view mode
  const [currentEmployeeRole, setCurrentEmployeeRole] = useState<UserRole>('sales_manager');
  const [currentViewMode, setCurrentViewMode] = useState('macro');
  
  // Add state for the selected role from the tabs at the top
  const [selectedRoleTab, setSelectedRoleTab] = useState<string>('sales_manager');
  const [showRoleDashboard, setShowRoleDashboard] = useState<boolean>(true);
  
  // State for portfolio-related views (these will be handled elsewhere)
  const [isPortfolioView, setIsPortfolioView] = useState(false);
  const [portfolioViewType, setPortfolioViewType] = useState<'manager'|'monitoring'|'servicer'>('manager');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState(currentUserType); // Set view based on current user type
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState<Application[]>(SAMPLE_APPLICATIONS);
  const [loading, setLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [activeMetricTab, setActiveMetricTab] = useState('overview');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [useEnhancedDashboard, setUseEnhancedDashboard] = useState(true);
  const [currentTransaction, setCurrentTransaction] = useState('TX-123');
  const [displayMode, setDisplayMode] = useState<'kanban' | 'list'>('kanban'); // Default display mode is kanban

  // Get available roles based on user type
  const getAvailableRoles = () => {
    if (['lender', 'admin'].includes(currentUserType)) {
      // Removed portfolio-related roles - these will be handled separately
      return ['sales_manager', 'loan_processor', 'credit_underwriter', 'credit_committee'];
    } else if (currentUserType === 'broker') {
      return ['sales_manager', 'loan_processor'];
    } else if (currentUserType === 'borrower') {
      return [];
    } else if (currentUserType === 'vendor') {
      return ['sales_manager'];
    } else {
      return [currentUserType];
    }
  };

  // Define role tabs that exclude portfolio-related views
  const roleTabs = [
    { id: 'sales_manager', name: 'Sales & Relation Manager' },
    { id: 'loan_processor', name: 'Loan Processor' },
    { id: 'credit_underwriter', name: 'Credit Underwriter & Analyst' },
    { id: 'credit_committee', name: 'Credit Committee Member' },
    { id: 'system_admin', name: 'System Root Administrator' }
  ];

  // Get available view modes for current role
  const getAvailableViewModes = () => {
    return ROLE_VIEW_TYPES[currentEmployeeRole] || ['macro'];
  };

  // Handle employee role change
  const handleEmployeeRoleChange = (role: UserRole) => {
    setCurrentEmployeeRole(role);
    setSelectedRoleTab(role);
    setShowRoleDashboard(true);
    
    // Reset view mode to a valid one for this role
    const availableViewModes = ROLE_VIEW_TYPES[role] || ['macro'];
    if (!availableViewModes.includes(currentViewMode)) {
      setCurrentViewMode(availableViewModes[0]);
    }
  };

  // Handle view mode change
  const handleViewModeChange = (mode: string) => {
    setCurrentViewMode(mode);
  };

  // Handle role tab selection
  const handleRoleTabClick = (role: string) => {
    // If selecting a portfolio-related role, redirect to Portfolio Navigator
    if (['portfolio_manager', 'portfolio_servicer', 'portfolio_monitor'].includes(role)) {
      navigate('/portfolio-navigator');
      return;
    }
    
    setSelectedRoleTab(role as UserRole);
    setCurrentEmployeeRole(role as UserRole);
    setShowRoleDashboard(true);
  };

  // Function to handle creating a new application
  const handleNewOrigination = () => {
    navigate('/credit-application');
  };

  // Map user role to our enhanced dashboard role
  const mapToEnhancedRole = (role: UserRoleType): UserRole => {
    switch (role) {
      case 'lender': return 'credit_underwriter';
      case 'broker': return 'sales_manager';
      case 'vendor': return 'sales_manager'; // Changed from portfolio_manager to sales_manager
      case 'borrower': return 'sales_manager';
      default: return role as UserRole;
    }
  };

  // Main component render
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading Originations Dashboard...</p>
      </div>
    );
  }

  // Portfolio views should redirect to Portfolio Navigator
  if (isPortfolioView) {
    navigate('/portfolio-navigator');
    return null;
  }

  return (
    <div>
      <TopNavbar 
        currentTransaction={currentTransaction}
        demoContext={currentDemoContext}
      />
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Main horizontal tab navigation - simpler design */}
          <div className="mb-8">
            <div className="flex flex-wrap">
              {/* Role selection tabs - horizontal with equal width */}
              <div className="flex w-full border border-gray-200 bg-white rounded-md overflow-hidden mb-4">
                {roleTabs.map(role => (
                  <button 
                    key={role.id}
                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                      selectedRoleTab === role.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleRoleTabClick(role.id)}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* View Mode and Action buttons */}
          <div className="flex justify-end mb-6">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentViewMode === 'macro'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => handleViewModeChange('macro')}
              >
                Macro View
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentViewMode === 'micro'
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => handleViewModeChange('micro')}
              >
                Micro View
              </button>
              <button
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium flex items-center"
                onClick={handleNewOrigination}
              >
                <span className="mr-1">+</span>
                New Origination
              </button>
            </div>
          </div>

          {/* Main dashboard content */}
          {showRoleDashboard && (
            <div>
              {/* Portfolio Value Stats Card */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 border-l-4 border-indigo-500">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Total Value</h3>
                  <p className="text-2xl font-bold text-red-600 mb-1">$12,450,000</p>
                  <p className="text-sm text-green-600">+18.2% from last month</p>
                </div>
                {/* Add more stat cards here */}
              </div>

              {/* Main dashboard by role */}
              <RoleBasedDashboard 
                initialRole={currentEmployeeRole} 
                initialViewMode={currentViewMode as 'macro' | 'micro'}
                useTopNavbar={false}
                currentTransaction={currentTransaction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoOriginationsDashboard;

