import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

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
    equipmentName: 'Industrial CNC Machine',
    model: 'CNC-5000',
    price: 85000,
    inStock: true,
    financingRequests: 3,
    approvedRequests: 2,
  },
  {
    id: 'equip-2',
    equipmentName: 'Commercial Refrigeration System',
    model: 'CRS-X450',
    price: 42000,
    inStock: true,
    financingRequests: 1,
    approvedRequests: 1,
  },
  {
    id: 'equip-3',
    equipmentName: 'Heavy Duty Tractor',
    model: 'HDT-8900',
    price: 120000,
    inStock: false,
    financingRequests: 2,
    approvedRequests: 0,
  },
];

// Sample broker commissions (for broker view)
const BROKER_COMMISSIONS = [
  {
    id: 'comm-1',
    applicationId: 'app-2',
    borrowerName: 'Global Manufacturing Co',
    loanAmount: 250000,
    commissionRate: 1.5,
    commissionAmount: 3750,
    status: 'Pending',
    expectedPaymentDate: '2023-09-14',
  },
  {
    id: 'comm-2',
    applicationId: 'app-3',
    borrowerName: 'Quantum Technologies',
    loanAmount: 75000,
    commissionRate: 2.0,
    commissionAmount: 1500,
    status: 'Paid',
    paymentDate: '2023-08-20',
  },
  {
    id: 'comm-3',
    applicationId: 'app-6',
    borrowerName: 'Mountain View Construction',
    loanAmount: 320000,
    commissionRate: 1.25,
    commissionAmount: 4000,
    status: 'Pending',
    expectedPaymentDate: '2023-09-20',
  },
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
          className="bg-white p-4 mb-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200"
          style={{ ...provided.draggableProps.style, minHeight: '280px' }} // Increased card height by ~33%
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-bold text-lg">{application.borrowerName}</div>
            <div
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
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

          <div className="text-sm text-gray-600 mb-3">
            ID: {application.borrowerId || application.id}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <div className="text-xs font-medium text-gray-500">BUSINESS</div>
              <div className="text-sm">{application.businessName}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">AMOUNT</div>
              <div className="text-sm font-semibold">${application.amount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">TYPE</div>
              <div className="text-sm">{application.type}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">PRIORITY</div>
              <div className={`text-sm font-medium ${getPriorityColor(application.priority)}`}>
                {typeof application.priority === 'string'
                  ? application.priority.charAt(0).toUpperCase() + application.priority.slice(1)
                  : application.priority}
              </div>
            </div>
          </div>

          {/* New fields for better decision making */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <div className="text-xs font-medium text-gray-500">CREDIT SCORE</div>
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
              <div className="text-xs font-medium text-gray-500">TIME IN BUSINESS</div>
              <div className="text-sm">{application.timeInBusiness || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500">RISK SCORE</div>
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
              <div className="text-xs font-medium text-gray-500">EVA REC</div>
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
            <div className="text-xs font-medium text-gray-500">CURRENT STAGE</div>
            <div className="text-sm font-medium text-blue-600">{applicationStage}</div>
          </div>

          {/* Outstanding Actions */}
          {outstandingActions.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500">OUTSTANDING ACTIONS</div>
              <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
                {outstandingActions.slice(0, 2).map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
                {outstandingActions.length > 2 && (
                  <li className="text-blue-500">+{outstandingActions.length - 2} more actions</li>
                )}
              </ul>
            </div>
          )}

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
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
    <div className="p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{equipment.equipmentName}</h3>
          <p className="text-sm text-gray-600">Model: {equipment.model}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ${equipment.price.toLocaleString()}
            </span>
            <span
              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                equipment.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {equipment.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            Financing Requests: {equipment.financingRequests}
          </p>
          <p className="text-sm text-gray-600">Approved: {equipment.approvedRequests}</p>
        </div>
      </div>
    </div>
  );
};

// Commission Card for Broker View
const CommissionCard: React.FC<{ commission: any }> = ({ commission }) => {
  return (
    <div className="p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{commission.borrowerName}</h3>
          <p className="text-sm text-gray-600">App ID: {commission.applicationId}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Loan: ${commission.loanAmount.toLocaleString()}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Commission: ${commission.commissionAmount.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              commission.status === 'Paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {commission.status}
          </p>
          <p className="text-sm mt-1 text-gray-600">
            {commission.status === 'Paid'
              ? `Paid: ${commission.paymentDate}`
              : `Expected: ${commission.expectedPaymentDate}`}
          </p>
        </div>
      </div>
    </div>
  );
};

// Loan Card for Borrower View
const LoanCard: React.FC<{ loan: any }> = ({ loan }) => {
  return (
    <div className="p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{loan.type}</h3>
          <p className="text-sm text-gray-600">Lender: {loan.lender}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ${loan.loanAmount.toLocaleString()}
            </span>
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {loan.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">Rate: {loan.interestRate}%</p>
          <p className="text-sm text-gray-600">Term: {loan.term} months</p>
          <p className="text-sm text-gray-600 mt-1">Next Payment: {loan.nextPaymentDue}</p>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-600">
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

const AutoOriginationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('lender'); // Default view is lender
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

  // Modified columns to match application features/sections rather than just status
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'application_form',
      title: 'Application Form',
      applications: [],
    },
    {
      id: 'credit_application',
      title: 'Credit Application',
      applications: [],
    },
    {
      id: 'risk_map_navigator',
      title: 'Risk Map Navigator',
      applications: [],
    },
    {
      id: 'deal_structuring',
      title: 'Deal Structuring',
      applications: [],
    },
    {
      id: 'transaction_execution',
      title: 'Transaction Execution',
      applications: [],
    },
    {
      id: 'post_closing',
      title: 'Post-Closing',
      applications: [],
    },
  ]);

  // Sample dashboard metrics data
  const dashboardMetrics: DashboardMetrics = {
    weeklyApplications: [
      { name: 'Mon', count: 4 },
      { name: 'Tue', count: 7 },
      { name: 'Wed', count: 5 },
      { name: 'Thu', count: 9 },
      { name: 'Fri', count: 6 },
      { name: 'Sat', count: 2 },
      { name: 'Sun', count: 1 },
    ],
    statusDistribution: [
      { name: 'New Application', value: 15 },
      { name: 'Documents Pending', value: 25 },
      { name: 'Under Review', value: 30 },
      { name: 'Approved', value: 20 },
      { name: 'Funded', value: 8 },
      { name: 'Rejected', value: 2 },
    ],
    amountByIndustry: [
      { name: 'Manufacturing', amount: 450000 },
      { name: 'Retail', amount: 320000 },
      { name: 'Technology', amount: 280000 },
      { name: 'Healthcare', amount: 180000 },
      { name: 'Construction', amount: 370000 },
      { name: 'Food Service', amount: 130000 },
    ],
    conversionRates: [
      { name: 'Application to Review', rate: 82 },
      { name: 'Review to Approval', rate: 64 },
      { name: 'Approval to Funding', rate: 78 },
    ],
    approvalTrend: [
      { date: 'Jan', applications: 45, approvals: 32 },
      { date: 'Feb', applications: 52, approvals: 35 },
      { date: 'Mar', applications: 49, approvals: 30 },
      { date: 'Apr', applications: 60, approvals: 45 },
      { date: 'May', applications: 55, approvals: 38 },
      { date: 'Jun', applications: 70, approvals: 53 },
    ],
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Function to place applications in the appropriate column based on their stage
  const organizeApplicationsByStage = () => {
    const newColumns = [...columns].map(column => ({
      ...column,
      applications: [] as Application[],
    }));

    applications.forEach(application => {
      // Determine which column this application belongs to based on its stage
      let columnId = 'application_form';

      if (application.status === 'funded') {
        columnId = 'post_closing';
      } else if (application.completedSteps.includes('review')) {
        columnId = 'transaction_execution';
      } else if (
        application.completedSteps.includes('risk_map') ||
        (application.completedSteps.includes('documents') && application.status === 'under_review')
      ) {
        columnId = 'deal_structuring';
      } else if (
        application.completedSteps.includes('basic_info') &&
        (application.status === 'documents_pending' || application.documentStatus === 'Pending')
      ) {
        columnId = 'risk_map_navigator';
      } else if (
        application.completedSteps.includes('application') &&
        !application.completedSteps.includes('risk_map')
      ) {
        columnId = 'credit_application';
      }

      // Find the column and add the application to it
      const column = newColumns.find(col => col.id === columnId);
      if (column) {
        column.applications.push(application);
      }
    });

    return newColumns;
  };

  // Initialize columns with applications on component mount and when applications change
  useEffect(() => {
    setColumns(organizeApplicationsByStage());
  }, [applications]);

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination, or if dragged to the same place, do nothing
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    // Find the application being dragged
    const application = sourceColumn.applications.find(app => app.id === draggableId);
    if (!application) return;

    // Create new columns array
    const newColumns = [...columns];
    // Find the source and destination columns in the new array
    const newSourceColumn = newColumns.find(col => col.id === source.droppableId);
    const newDestColumn = newColumns.find(col => col.id === destination.droppableId);
    if (!newSourceColumn || !newDestColumn) return;

    // Update application status and completedSteps based on the destination column
    const updatedApplication = { ...application };

    // Update application status based on destination column
    switch (destination.droppableId) {
      case 'application_form':
        updatedApplication.status = 'new_application';
        break;
      case 'credit_application':
        updatedApplication.status = 'documents_pending';
        if (!updatedApplication.completedSteps.includes('application')) {
          updatedApplication.completedSteps.push('application');
        }
        break;
      case 'risk_map_navigator':
        updatedApplication.status = 'documents_pending';
        if (!updatedApplication.completedSteps.includes('basic_info')) {
          updatedApplication.completedSteps.push('basic_info');
        }
        break;
      case 'deal_structuring':
        updatedApplication.status = 'under_review';
        if (!updatedApplication.completedSteps.includes('risk_map')) {
          updatedApplication.completedSteps.push('risk_map');
        }
        break;
      case 'transaction_execution':
        updatedApplication.status = 'approved';
        if (!updatedApplication.completedSteps.includes('review')) {
          updatedApplication.completedSteps.push('review');
        }
        break;
      case 'post_closing':
        updatedApplication.status = 'funded';
        if (!updatedApplication.completedSteps.includes('funding')) {
          updatedApplication.completedSteps.push('funding');
        }
        break;
    }

    // Remove application from source column
    newSourceColumn.applications = newSourceColumn.applications.filter(
      app => app.id !== draggableId
    );

    // Insert application at destination
    newDestColumn.applications = [
      ...newDestColumn.applications.slice(0, destination.index),
      updatedApplication,
      ...newDestColumn.applications.slice(destination.index),
    ];

    // Update state
    setColumns(newColumns);

    // Update the application in the main applications array
    setApplications(
      applications.map(app => (app.id === updatedApplication.id ? updatedApplication : app))
    );
  };

  // Get assignees for filter
  const assignees = [
    'all',
    ...Array.from(
      new Set(applications.filter(app => app.assignedTo).map(app => app.assignedTo as string))
    ),
  ];

  // Function to get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to filter applications in each column
  const filterColumnApplications = (applications: Application[]) => {
    return applications.filter(app => {
      const matchesSearch =
        app.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
      const matchesAssignee = assigneeFilter === 'all' || app.assignedTo === assigneeFilter;

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  };

  // View application details
  const viewApplicationDetails = (applicationId: string) => {
    navigate(`/credit-application/${applicationId}`);
  };

  // Group applications by status
  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  // Statistics for the dashboard
  const totalApplications = applications.length;
  const pendingDocuments = applications.filter(app => app.documentStatus !== 'Complete').length;
  const approvedApplications = applications.filter(app => app.status === STATUSES.APPROVED).length;
  const totalValue = applications.reduce((sum, app) => sum + app.amount, 0);

  // Function to render the metrics dashboard
  const renderMetricsDashboard = () => {
    switch (activeMetricTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Weekly Application Volume</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardMetrics.weeklyApplications}>
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
                    data={dashboardMetrics.statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {dashboardMetrics.statusDistribution.map((entry, index) => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Application to Approval Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dashboardMetrics.approvalTrend}>
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

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Pipeline Conversion Rates</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardMetrics.conversionRates} layout="vertical">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Origination Amount by Industry
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardMetrics.amountByIndustry}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={value => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Cumulative Origination Value
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dashboardMetrics.approvalTrend}>
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
      default:
        return null;
    }
  };

  // Render Kanban Board for Lender View
  const renderLenderView = () => (
    <div className="kanban-board w-full overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 min-w-max">
          {Object.values(STATUSES).map(status => (
            <div key={status} className="w-80 flex-shrink-0">
              <h2 className="text-lg font-medium text-gray-900 mb-3">{status}</h2>
              <Droppable droppableId={status}>
                {provided => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 p-3 rounded-lg min-h-[500px]"
                  >
                    {getApplicationsByStatus(status).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No applications in this stage
                      </div>
                    ) : (
                      getApplicationsByStatus(status).map((app, index) => (
                        <ApplicationCard key={app.id} application={app} index={index} />
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );

  // Render Vendor View
  const renderVendorView = () => (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-4">Your Equipment Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VENDOR_EQUIPMENT.map(equipment => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>

      <h2 className="text-xl font-medium text-gray-900 mt-8 mb-4">Financing Applications</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        {applications
          .filter(app => app.type === 'Equipment Finance')
          .map((app, index) => (
            <ApplicationCard key={app.id} application={app} index={index} />
          ))}
      </div>
    </div>
  );

  // Render Broker View
  const renderBrokerView = () => (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-4">Your Applications</h2>
      <div className="kanban-board w-full overflow-x-auto mb-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 min-w-max">
            {Object.values(STATUSES).map(status => (
              <div key={status} className="w-80 flex-shrink-0">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{status}</h3>
                <Droppable droppableId={status}>
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-50 p-3 rounded-lg min-h-[300px]"
                    >
                      {getApplicationsByStatus(status).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No applications in this stage
                        </div>
                      ) : (
                        getApplicationsByStatus(status).map((app, index) => (
                          <ApplicationCard key={app.id} application={app} index={index} />
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      <h2 className="text-xl font-medium text-gray-900 mb-4">Your Commissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BROKER_COMMISSIONS.map(commission => (
          <CommissionCard key={commission.id} commission={commission} />
        ))}
      </div>
    </div>
  );

  // Render Borrower View
  const renderBorrowerView = () => (
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-4">Your Loans</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {BORROWER_LOANS.map(loan => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>

      <h2 className="text-xl font-medium text-gray-900 mb-4">Your Applications</h2>
      <div className="grid grid-cols-1 gap-4">
        {applications
          .filter(app => app.borrowerId === 'b-1001') // Filter to show just this borrower's apps
          .map((app, index) => (
            <ApplicationCard key={app.id} application={app} index={index} />
          ))}
      </div>
    </div>
  );

  // Render the appropriate view based on user role
  const renderDashboardByUserRole = () => {
    switch (userRole) {
      case 'lender':
        return renderLenderView();
      case 'vendor':
        return renderVendorView();
      case 'broker':
        return renderBrokerView();
      case 'borrower':
        return renderBorrowerView();
      default:
        return renderLenderView(); // Default to lender view
    }
  };

  // Function to handle creating a new application
  const handleNewOrigination = () => {
    navigate('/credit-application');
  };

  // Function to get the current user persona based on role
  const getCurrentUserPersona = () => {
    const persona = USER_PERSONAS.find(p => p.role === userRole);
    return persona || USER_PERSONAS[0]; // Default to first persona if not found
  };

  // Function to get recommended agents for the current user
  const getRecommendedAgents = () => {
    const persona = getCurrentUserPersona();
    return AGENT_TYPES.filter(agent => persona.preferredAgents.includes(agent.id));
  };

  // Function to open agent selector modal
  const openAgentSelector = () => {
    setSelectedPersona(getCurrentUserPersona());
    setShowAgentSelector(true);
  };

  // Function to select an agent
  const selectAgent = (agent: AgentType) => {
    setSelectedAgent(agent);
    setShowAgentSelector(false);
    // Here you would typically start a conversation with this agent
  };

  // Function to render the agent selector modal
  const renderAgentSelector = () => {
    if (!showAgentSelector) return null;

    const recommendedAgents = getRecommendedAgents();

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Select Conversation Agent</h2>
              <button
                onClick={() => setShowAgentSelector(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-gray-600">
              Select an agent that specializes in your current task
            </p>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended for You</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {recommendedAgents.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => selectAgent(agent)}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  style={{ borderColor: agent.primaryColor }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md text-2xl"
                    style={{ backgroundColor: agent.primaryColor + '20' }}
                  >
                    {agent.icon}
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">{agent.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <h3 className="text-lg font-medium text-gray-900 mb-4">All Agents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AGENT_TYPES.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => selectAgent(agent)}
                  className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-md text-2xl"
                    style={{ backgroundColor: agent.primaryColor + '20' }}
                  >
                    {agent.icon}
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="text-lg font-medium text-gray-900">{agent.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Loading Originations Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="auto-originations-dashboard p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auto Originations Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'lender'
              ? 'Monitor and manage all loan originations in one place'
              : userRole === 'broker'
                ? 'Track your client applications and commissions'
                : userRole === 'vendor'
                  ? 'Manage your equipment financing requests'
                  : 'View your active loans and applications'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={openAgentSelector}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Get AI Assistance
          </button>
          <button
            onClick={handleNewOrigination}
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

      {/* Render the agent selector modal */}
      {renderAgentSelector()}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
          <div className="mt-1 text-sm text-green-600">↑ 12.5% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Documents</h3>
          <p className="text-3xl font-bold text-gray-900">{pendingDocuments}</p>
          <div className="mt-1 text-sm text-red-600">↑ 3.2% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{approvedApplications}</p>
          <div className="mt-1 text-sm text-green-600">↑ 7.8% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
          <p className="text-3xl font-bold text-primary-600">${totalValue.toLocaleString()}</p>
          <div className="mt-1 text-sm text-green-600">↑ 15.3% from last month</div>
        </div>
      </div>

      {/* Data Visualization Section (Only for lender view) */}
      {userRole === 'lender' && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow mb-4">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveMetricTab('overview')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeMetricTab === 'overview'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveMetricTab('performance')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeMetricTab === 'performance'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Performance Metrics
                </button>
                <button
                  onClick={() => setActiveMetricTab('financial')}
                  className={`py-4 px-6 text-sm font-medium ${
                    activeMetricTab === 'financial'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Financial Analysis
                </button>
              </nav>
            </div>
            <div className="p-4">{renderMetricsDashboard()}</div>
          </div>
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          {/* Only show search and filters for lender and broker views */}
          {(userRole === 'lender' || userRole === 'broker') && (
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Applications"
                  className="pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
              {userRole === 'lender' && (
                <>
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="pl-3 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    value={assigneeFilter}
                    onChange={e => setAssigneeFilter(e.target.value)}
                    className="pl-3 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {assignees.map(assignee => (
                      <option key={assignee} value={assignee}>
                        {assignee === 'all' ? 'All Assignees' : assignee}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          )}

          {/* View type selector */}
          {userRole === 'lender' && (
            <div className="mt-4 md:mt-0 flex">
              <button
                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-l-md ${
                  view === 'kanban'
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setView('kanban')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Kanban
              </button>
              <button
                className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md ${
                  view === 'list'
                    ? 'bg-primary-100 text-primary-700 border-primary-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setView('list')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Render the appropriate dashboard view based on user role */}
      {renderDashboardByUserRole()}
    </div>
  );
};

export default AutoOriginationsDashboard;
