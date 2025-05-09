import { Transaction, WorkflowStage } from '../contexts/WorkflowContext';
import { UserType } from '../types/UserTypes';

// Mock login response
export const mockLoginResponse = {
  success: true,
  token: 'mock-jwt-token',
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
  },
};

export interface MockTransaction {
  id: string;
  applicantData: {
    id: string;
    name: string;
    entityType: string;
    industryCode: string;
  };
  type: string;
  amount: number;
  details: Record<string, any>;
  currentStage: WorkflowStage;
  riskProfile?: {
    overallScore: number;
    creditScore: {
      business: number;
      personal: number;
    };
    financialRatios: {
      name: string;
      value: number;
      benchmark: string;
      status: string;
    }[];
    riskFactors: {
      category: string;
      name: string;
      value: string;
      impact: string;
    }[];
  };
}

export const mockTransactions: MockTransaction[] = [
  {
    id: 'TX-12345',
    applicantData: {
      id: 'APP-123456',
      name: 'QRS Manufacturing',
      entityType: 'Corporation',
      industryCode: 'MANUFACTURING',
    },
    type: 'Equipment Financing',
    amount: 250000,
    details: {
      equipmentType: 'CNC Machine',
      term: 60,
      interestRate: 5.75,
    },
    currentStage: 'document_collection',
  },
  {
    id: 'TX-12346',
    applicantData: {
      id: 'APP-123457',
      name: 'ABC Corp',
      entityType: 'LLC',
      industryCode: 'TECHNOLOGY',
    },
    type: 'Working Capital',
    amount: 100000,
    details: {
      purpose: 'Expansion',
      term: 36,
      interestRate: 7.25,
    },
    currentStage: 'risk_assessment',
    riskProfile: {
      overallScore: 75,
      creditScore: {
        business: 82,
        personal: 710,
      },
      financialRatios: [
        { name: 'Debt to Income', value: 0.38, benchmark: '< 0.4', status: 'warning' },
        { name: 'Current Ratio', value: 1.75, benchmark: '> 1.5', status: 'good' },
        { name: 'Quick Ratio', value: 1.2, benchmark: '> 1.0', status: 'good' },
        { name: 'Operating Margin', value: 0.15, benchmark: '> 0.2', status: 'warning' },
      ],
      riskFactors: [
        { category: 'Business', name: 'Time in Business', value: '4 years', impact: 'neutral' },
        { category: 'Financial', name: 'Cash Reserves', value: '$65,000', impact: 'positive' },
        {
          category: 'Industry',
          name: 'Technology Sector Growth',
          value: 'Strong',
          impact: 'positive',
        },
        { category: 'Market', name: 'Competition Intensity', value: 'High', impact: 'negative' },
      ],
    },
  },
  {
    id: 'TX-12347',
    applicantData: {
      id: 'APP-123458',
      name: 'XYZ Properties',
      entityType: 'Partnership',
      industryCode: 'REAL_ESTATE',
    },
    type: 'Real Estate',
    amount: 750000,
    details: {
      propertyType: 'Commercial',
      term: 240,
      interestRate: 4.5,
    },
    currentStage: 'deal_structuring',
  },
  {
    id: 'TX-12348',
    applicantData: {
      id: 'APP-123459',
      name: 'LMN Enterprises',
      entityType: 'Corporation',
      industryCode: 'RETAIL',
    },
    type: 'Expansion Loan',
    amount: 500000,
    details: {
      purpose: 'New Location',
      term: 84,
      interestRate: 6.0,
    },
    currentStage: 'document_execution',
  },
  {
    id: 'TX-12349',
    applicantData: {
      id: 'APP-123460',
      name: 'EFG Retail',
      entityType: 'LLC',
      industryCode: 'RETAIL',
    },
    type: 'Inventory Financing',
    amount: 175000,
    details: {
      inventoryType: 'Seasonal',
      term: 12,
      interestRate: 8.5,
    },
    currentStage: 'post_closing',
  },
];

export const mockInsights = [
  {
    category: 'critical' as 'critical',
    title: 'High Debt to Equity Ratio',
    description:
      'Your debt to equity ratio is above industry benchmarks, indicating higher financial risk.',
    ratios: ['Debt to Equity'],
    recommendation: 'Consider reducing debt or increasing equity to improve financial stability.',
  },
  {
    category: 'warning' as 'warning',
    title: 'Below Average Profit Margin',
    description:
      'Your profit margin is slightly below industry benchmarks, which may impact long-term profitability.',
    ratios: ['Profit Margin'],
    recommendation: 'Focus on cost reduction strategies or pricing adjustments to improve margins.',
  },
  {
    category: 'positive' as 'positive',
    title: 'Strong Liquidity Position',
    description:
      'Your quick ratio exceeds industry benchmarks, indicating good short-term financial health.',
    ratios: ['Quick Ratio', 'Cash Ratio'],
    recommendation: 'Maintain current liquidity management practices.',
  },
];

export interface Activity {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  userType: UserType;
  user: {
    name: string;
    avatar: string;
  };
}

export const mockActivities: Activity[] = [
  {
    id: 1,
    action: 'Document Added',
    description: 'Financial Statements Q1 2023 added to ABC Corp file',
    timestamp: '2 hours ago',
    userType: UserType.BUSINESS,
    user: {
      name: 'Jamie Smith',
      avatar: '/avatars/user2.jpg',
    },
  },
  {
    id: 2,
    action: 'Risk Assessment',
    description: 'Credit analysis completed for QRS Manufacturing',
    timestamp: '4 hours ago',
    userType: UserType.LENDER,
    user: {
      name: 'Alex Morgan',
      avatar: '/avatars/user1.jpg',
    },
  },
  {
    id: 3,
    action: 'Deal Approved',
    description: 'XYZ Properties deal terms approved by committee',
    timestamp: '1 day ago',
    userType: UserType.BROKERAGE,
    user: {
      name: 'Taylor Jones',
      avatar: '/avatars/user3.jpg',
    },
  },
  {
    id: 4,
    action: 'New Application',
    description: 'New equipment financing application received from DEF Industries',
    timestamp: '2 days ago',
    userType: UserType.BUSINESS,
    user: {
      name: 'Casey Wilson',
      avatar: '/avatars/user5.jpg',
    },
  },
  {
    id: 5,
    action: 'Equipment Listed',
    description: 'New industrial machinery listed for lease - 3 units available',
    timestamp: '3 days ago',
    userType: UserType.VENDOR,
    user: {
      name: 'Morgan Davis',
      avatar: '/avatars/user4.jpg',
    },
  },
  {
    id: 6,
    action: 'Deal Matched',
    description: 'Matched TechPro Inc. with appropriate equipment vendor for manufacturing setup',
    timestamp: '4 days ago',
    userType: UserType.BROKERAGE,
    user: {
      name: 'Jamie Rodriguez',
      avatar: '/avatars/user6.jpg',
    },
  },
  {
    id: 7,
    action: 'Payment Processed',
    description: 'Monthly payment of $4,320 received from LMN Enterprises',
    timestamp: '5 days ago',
    userType: UserType.LENDER,
    user: {
      name: 'Riley Johnson',
      avatar: '/avatars/user4.jpg',
    },
  },
  {
    id: 8,
    action: 'Inventory Update',
    description: 'Updated inventory levels for heavy machinery - 2 units sold',
    timestamp: '1 week ago',
    userType: UserType.VENDOR,
    user: {
      name: 'Morgan Davis',
      avatar: '/avatars/user4.jpg',
    },
  },
];
