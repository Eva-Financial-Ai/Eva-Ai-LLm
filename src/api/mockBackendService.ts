import { Transaction, WorkflowStage } from '../contexts/WorkflowContext';
import { UserType } from '../types/UserTypes';

// Toggle to enable/disable demo mode
export const DEMO_MODE = true;

// ---------------------------
// User Data
// ---------------------------
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  orgName: string;
  preferredLanguage: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: UserProfile[] = [
  {
    id: 'user-001',
    name: 'Alex Morgan',
    email: 'alex.morgan@evafinance.com',
    phone: '(555) 123-4567',
    role: 'lender_admin',
    orgName: 'EVA Finance',
    preferredLanguage: 'en',
    avatar: '/avatars/user1.jpg',
    createdAt: new Date(2022, 1, 15).toISOString(),
    updatedAt: new Date(2023, 6, 10).toISOString(),
  },
  {
    id: 'user-002',
    name: 'Jamie Smith',
    email: 'jamie@abcgroup.com',
    phone: '(555) 234-5678',
    role: 'borrower',
    orgName: 'ABC Group',
    preferredLanguage: 'en',
    avatar: '/avatars/user2.jpg',
    createdAt: new Date(2022, 3, 10).toISOString(),
    updatedAt: new Date(2023, 5, 22).toISOString(),
  },
  {
    id: 'user-003',
    name: 'Taylor Jones',
    email: 'taylor@brokeragefirm.com',
    phone: '(555) 345-6789',
    role: 'broker',
    orgName: 'Capital Brokerage',
    preferredLanguage: 'en',
    avatar: '/avatars/user3.jpg',
    createdAt: new Date(2022, 5, 8).toISOString(),
    updatedAt: new Date(2023, 4, 15).toISOString(),
  },
  {
    id: 'user-004',
    name: 'Morgan Davis',
    email: 'morgan@equipmentsupply.com',
    phone: '(555) 456-7890',
    role: 'vendor',
    orgName: 'Equipment Supply Co.',
    preferredLanguage: 'en',
    avatar: '/avatars/user4.jpg',
    createdAt: new Date(2022, 7, 21).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
  }
];

// Current user (default logged in for demo)
export const currentUser = mockUsers[0];

// ---------------------------
// Transaction Data
// ---------------------------
export interface MockTransaction extends Transaction {
  id: string;
  applicantData: {
    id: string;
    name: string;
    entityType: string;
    industryCode: string;
    foundedYear: number;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  type: string;
  amount: number;
  term: number;
  interestRate: number;
  purpose: string;
  details: {
    equipmentType?: string;
    propertyType?: string;
    purpose?: string;
    term: number;
    interestRate: number;
  };
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  currentStage: WorkflowStage;
  assignedTo: string;
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'verified' | 'rejected';
    uploadedAt: string;
    url: string;
  }[];
  notes: {
    id: string;
    text: string;
    createdBy: string;
    createdAt: string;
  }[];
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
      status: 'good' | 'warning' | 'critical';
    }[];
    riskFactors: {
      category: string;
      name: string;
      value: string;
      impact: 'positive' | 'neutral' | 'negative';
    }[];
    aiInsights: string[];
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
      foundedYear: 2010,
      contactEmail: 'contact@qrsmanufacturing.com',
      contactPhone: '(555) 987-6543',
      address: '1234 Factory Lane, Industrial Park, CA 92345'
    },
    type: 'Equipment Financing',
    amount: 250000,
    term: 60,
    interestRate: 5.75,
    purpose: 'Purchase new CNC machinery',
    details: {
      equipmentType: 'CNC Machine',
      term: 60,
      interestRate: 5.75
    },
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 3, 18).toISOString(),
    status: 'in_review',
    currentStage: 'document_collection',
    assignedTo: 'user-001',
    documents: [
      {
        id: 'DOC-001',
        name: 'Business Registration',
        type: 'registration',
        status: 'verified',
        uploadedAt: new Date(2023, 3, 15).toISOString(),
        url: '/mock/documents/business-registration.pdf'
      },
      {
        id: 'DOC-002',
        name: 'Financial Statements 2022',
        type: 'financial',
        status: 'verified',
        uploadedAt: new Date(2023, 3, 16).toISOString(),
        url: '/mock/documents/financial-statements-2022.pdf'
      },
      {
        id: 'DOC-003',
        name: 'Equipment Quote',
        type: 'quote',
        status: 'pending',
        uploadedAt: new Date(2023, 3, 17).toISOString(),
        url: '/mock/documents/equipment-quote.pdf'
      }
    ],
    notes: [
      {
        id: 'NOTE-001',
        text: 'Applicant has strong credit history but limited collateral.',
        createdBy: 'user-001',
        createdAt: new Date(2023, 3, 16).toISOString()
      },
      {
        id: 'NOTE-002',
        text: 'Requested additional documentation for equipment specifications.',
        createdBy: 'user-001',
        createdAt: new Date(2023, 3, 17).toISOString()
      }
    ]
  },
  {
    id: 'TX-12346',
    applicantData: {
      id: 'APP-123457',
      name: 'ABC Corp',
      entityType: 'LLC',
      industryCode: 'TECHNOLOGY',
      foundedYear: 2018,
      contactEmail: 'finance@abccorp.com',
      contactPhone: '(555) 123-4567',
      address: '789 Tech Blvd, Innovation District, CA 94103'
    },
    type: 'Working Capital',
    amount: 100000,
    term: 36,
    interestRate: 7.25,
    purpose: 'Business expansion',
    details: {
      purpose: 'Expansion',
      term: 36,
      interestRate: 7.25
    },
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
    status: 'in_review',
    currentStage: 'risk_assessment',
    assignedTo: 'user-001',
    documents: [
      {
        id: 'DOC-101',
        name: 'Business Plan',
        type: 'business_plan',
        status: 'verified',
        uploadedAt: new Date(2023, 2, 10).toISOString(),
        url: '/mock/documents/business-plan.pdf'
      },
      {
        id: 'DOC-102',
        name: 'Tax Returns 2022',
        type: 'tax',
        status: 'verified',
        uploadedAt: new Date(2023, 2, 12).toISOString(),
        url: '/mock/documents/tax-returns-2022.pdf'
      },
      {
        id: 'DOC-103',
        name: 'Bank Statements (3 months)',
        type: 'bank_statement',
        status: 'verified',
        uploadedAt: new Date(2023, 2, 15).toISOString(),
        url: '/mock/documents/bank-statements.pdf'
      }
    ],
    notes: [
      {
        id: 'NOTE-101',
        text: 'Company shows strong growth in SaaS subscription revenue.',
        createdBy: 'user-001',
        createdAt: new Date(2023, 2, 18).toISOString()
      }
    ],
    riskProfile: {
      overallScore: 75,
      creditScore: {
        business: 82,
        personal: 710
      },
      financialRatios: [
        { name: 'Debt to Income', value: 0.38, benchmark: '< 0.4', status: 'warning' },
        { name: 'Current Ratio', value: 1.75, benchmark: '> 1.5', status: 'good' },
        { name: 'Quick Ratio', value: 1.2, benchmark: '> 1.0', status: 'good' },
        { name: 'Operating Margin', value: 0.15, benchmark: '> 0.2', status: 'warning' }
      ],
      riskFactors: [
        { category: 'Business', name: 'Time in Business', value: '4 years', impact: 'neutral' },
        { category: 'Financial', name: 'Cash Reserves', value: '$65,000', impact: 'positive' },
        { category: 'Industry', name: 'Technology Sector Growth', value: 'Strong', impact: 'positive' },
        { category: 'Market', name: 'Competition Intensity', value: 'High', impact: 'negative' }
      ],
      aiInsights: [
        "Based on current cash flow projections, ABC Corp can maintain a healthy debt service coverage ratio of 1.8x.",
        "Technology sector companies at similar growth stage typically achieve better margins within 18-24 months.",
        "Recommend close monitoring of customer acquisition cost relative to lifetime value."
      ]
    }
  },
  {
    id: 'TX-12347',
    applicantData: {
      id: 'APP-123458',
      name: 'XYZ Properties',
      entityType: 'Partnership',
      industryCode: 'REAL_ESTATE',
      foundedYear: 2015,
      contactEmail: 'info@xyzproperties.com',
      contactPhone: '(555) 789-0123',
      address: '567 Property Way, Downtown, NY 10001'
    },
    type: 'Real Estate',
    amount: 750000,
    term: 240,
    interestRate: 4.5,
    purpose: 'Purchase commercial building',
    details: {
      propertyType: 'Commercial',
      term: 240,
      interestRate: 4.5
    },
    createdAt: new Date(2023, 1, 5).toISOString(),
    updatedAt: new Date(2023, 2, 20).toISOString(),
    status: 'approved',
    currentStage: 'deal_structuring',
    assignedTo: 'user-003',
    documents: [
      {
        id: 'DOC-201',
        name: 'Property Appraisal',
        type: 'appraisal',
        status: 'verified',
        uploadedAt: new Date(2023, 1, 10).toISOString(),
        url: '/mock/documents/property-appraisal.pdf'
      },
      {
        id: 'DOC-202',
        name: 'Environmental Assessment',
        type: 'assessment',
        status: 'verified',
        uploadedAt: new Date(2023, 1, 15).toISOString(),
        url: '/mock/documents/environmental-assessment.pdf'
      }
    ],
    notes: [
      {
        id: 'NOTE-201',
        text: 'Property has excellent location with strong rental income potential.',
        createdBy: 'user-003',
        createdAt: new Date(2023, 2, 1).toISOString()
      }
    ],
    riskProfile: {
      overallScore: 82,
      creditScore: {
        business: 88,
        personal: 745
      },
      financialRatios: [
        { name: 'Loan to Value', value: 0.65, benchmark: '< 0.75', status: 'good' },
        { name: 'Debt Service Coverage', value: 1.4, benchmark: '> 1.25', status: 'good' },
        { name: 'Net Operating Income', value: 95000, benchmark: '> 90000', status: 'good' }
      ],
      riskFactors: [
        { category: 'Location', name: 'Market Demand', value: 'High', impact: 'positive' },
        { category: 'Property', name: 'Building Condition', value: 'Excellent', impact: 'positive' },
        { category: 'Economic', name: 'Interest Rate Trend', value: 'Rising', impact: 'negative' }
      ],
      aiInsights: [
        "Property location shows consistent appreciation of 4.2% annually over the past 5 years.",
        "Similar commercial properties in this area have vacancy rates below 5%.",
        "Recommend confirming tenant commitments to validate projected rental income."
      ]
    }
  }
];

// ---------------------------
// Activity Data
// ---------------------------
export interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userType: UserType;
  transactionId?: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export const mockActivities: Activity[] = [
  {
    id: 'ACT-001',
    action: 'Document Added',
    description: 'Financial Statements Q1 2023 added to ABC Corp file',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    userType: UserType.BUSINESS,
    transactionId: 'TX-12346',
    user: {
      id: 'user-002',
      name: 'Jamie Smith',
      avatar: '/avatars/user2.jpg',
    },
  },
  {
    id: 'ACT-002',
    action: 'Risk Assessment',
    description: 'Credit analysis completed for QRS Manufacturing',
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    userType: UserType.LENDER,
    transactionId: 'TX-12345',
    user: {
      id: 'user-001',
      name: 'Alex Morgan',
      avatar: '/avatars/user1.jpg',
    },
  },
  {
    id: 'ACT-003',
    action: 'Deal Approved',
    description: 'XYZ Properties deal terms approved by committee',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userType: UserType.BROKERAGE,
    transactionId: 'TX-12347',
    user: {
      id: 'user-003',
      name: 'Taylor Jones',
      avatar: '/avatars/user3.jpg',
    },
  },
  {
    id: 'ACT-004',
    action: 'New Application',
    description: 'New equipment financing application received from DEF Industries',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    userType: UserType.BUSINESS,
    user: {
      id: 'user-005',
      name: 'Casey Wilson',
      avatar: '/avatars/user5.jpg',
    },
  },
  {
    id: 'ACT-005',
    action: 'Equipment Listed',
    description: 'New industrial machinery listed for lease - 3 units available',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    userType: UserType.VENDOR,
    user: {
      id: 'user-004',
      name: 'Morgan Davis',
      avatar: '/avatars/user4.jpg',
    },
  }
];

// ---------------------------
// Analytics Data
// ---------------------------
export interface AnalyticsData {
  summary: {
    totalTransactions: number;
    totalFunding: number;
    pendingApplications: number;
    approvalRate: number;
    averageProcessingTime: number; // in days
  };
  transactionsByType: {
    type: string;
    count: number;
    amount: number;
  }[];
  transactionsByStatus: {
    status: string;
    count: number;
  }[];
  transactionsByMonth: {
    month: string;
    count: number;
    amount: number;
  }[];
  riskDistribution: {
    riskLevel: string;
    count: number;
    percentage: number;
  }[];
}

export const mockAnalytics: AnalyticsData = {
  summary: {
    totalTransactions: 124,
    totalFunding: 17500000,
    pendingApplications: 35,
    approvalRate: 0.72,
    averageProcessingTime: 12.5
  },
  transactionsByType: [
    { type: 'Equipment Financing', count: 45, amount: 6250000 },
    { type: 'Working Capital', count: 32, amount: 3200000 },
    { type: 'Real Estate', count: 18, amount: 7200000 },
    { type: 'Expansion Loan', count: 15, amount: 750000 },
    { type: 'Inventory Financing', count: 14, amount: 100000 }
  ],
  transactionsByStatus: [
    { status: 'Approved', count: 62 },
    { status: 'In Review', count: 35 },
    { status: 'Pending', count: 20 },
    { status: 'Rejected', count: 7 }
  ],
  transactionsByMonth: [
    { month: 'Jan', count: 8, amount: 1200000 },
    { month: 'Feb', count: 10, amount: 1500000 },
    { month: 'Mar', count: 15, amount: 2100000 },
    { month: 'Apr', count: 12, amount: 1800000 },
    { month: 'May', count: 18, amount: 2500000 },
    { month: 'Jun', count: 14, amount: 2000000 },
    { month: 'Jul', count: 16, amount: 2200000 },
    { month: 'Aug', count: 9, amount: 1300000 },
    { month: 'Sep', count: 7, amount: 950000 },
    { month: 'Oct', count: 6, amount: 750000 },
    { month: 'Nov', count: 5, amount: 650000 },
    { month: 'Dec', count: 4, amount: 550000 }
  ],
  riskDistribution: [
    { riskLevel: 'Low Risk', count: 55, percentage: 0.44 },
    { riskLevel: 'Medium Risk', count: 42, percentage: 0.34 },
    { riskLevel: 'High Risk', count: 27, percentage: 0.22 }
  ]
};

// ---------------------------
// Document Data
// ---------------------------
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
  createdBy: string;
  status: 'active' | 'draft' | 'archived';
}

export const mockDocumentTemplates: DocumentTemplate[] = [
  {
    id: 'TEMP-001',
    name: 'Loan Agreement',
    description: 'Standard loan agreement for equipment financing',
    category: 'Contracts',
    lastUpdated: new Date(2023, 5, 15).toISOString(),
    createdBy: 'user-001',
    status: 'active'
  },
  {
    id: 'TEMP-002',
    name: 'Personal Guarantee',
    description: 'Personal guarantee form for business owners',
    category: 'Legal',
    lastUpdated: new Date(2023, 4, 20).toISOString(),
    createdBy: 'user-001',
    status: 'active'
  },
  {
    id: 'TEMP-003',
    name: 'UCC Filing',
    description: 'UCC-1 filing form',
    category: 'Legal',
    lastUpdated: new Date(2023, 3, 10).toISOString(),
    createdBy: 'user-001',
    status: 'active'
  },
  {
    id: 'TEMP-004',
    name: 'Term Sheet',
    description: 'Preliminary deal term sheet for negotiation',
    category: 'Proposal',
    lastUpdated: new Date(2023, 6, 5).toISOString(),
    createdBy: 'user-003',
    status: 'active'
  },
  {
    id: 'TEMP-005',
    name: 'Equipment List',
    description: 'Template for listing financed equipment',
    category: 'Documentation',
    lastUpdated: new Date(2023, 2, 25).toISOString(),
    createdBy: 'user-004',
    status: 'draft'
  }
];

// ---------------------------
// Notification Data
// ---------------------------
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'NOTIF-001',
    type: 'info',
    title: 'New Document Uploaded',
    message: 'QRS Manufacturing has uploaded new financial documents.',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    link: '/transactions/TX-12345'
  },
  {
    id: 'NOTIF-002',
    type: 'success',
    title: 'Deal Approved',
    message: 'XYZ Properties loan has been approved by the credit committee.',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    link: '/transactions/TX-12347'
  },
  {
    id: 'NOTIF-003',
    type: 'warning',
    title: 'Document Expiring',
    message: 'Insurance certificate for ABC Corp will expire in 15 days.',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    read: false,
    link: '/transactions/TX-12346'
  },
  {
    id: 'NOTIF-004',
    type: 'error',
    title: 'Verification Failed',
    message: 'Automatic verification failed for DEF Industries business license.',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    read: false
  },
  {
    id: 'NOTIF-005',
    type: 'info',
    title: 'New Feature Available',
    message: 'AI-powered risk assessment is now available for all transactions.',
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    read: true
  }
];

// ---------------------------
// AI Insights Data
// ---------------------------
export interface AIInsight {
  id: string;
  transactionId: string;
  category: 'financial' | 'risk' | 'market' | 'operational';
  title: string;
  summary: string;
  details: string;
  confidence: number;
  timestamp: string;
  sources?: string[];
  recommendations?: string[];
}

export const mockAIInsights: AIInsight[] = [
  {
    id: 'AI-001',
    transactionId: 'TX-12346',
    category: 'financial',
    title: 'Cash Flow Analysis',
    summary: 'ABC Corp shows strong revenue growth but declining operating margins.',
    details: 'Analysis of the past 4 quarters shows YoY revenue growth of 32%, but operating margins have declined from 25% to 15%. This pattern is consistent with companies in expansion phases investing heavily in growth.',
    confidence: 0.87,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    recommendations: [
      'Monitor cost structure as company scales',
      'Implement quarterly financial reviews',
      'Consider operational efficiency improvements'
    ]
  },
  {
    id: 'AI-002',
    transactionId: 'TX-12345',
    category: 'market',
    title: 'Industry Trend Analysis',
    summary: 'Manufacturing automation equipment demand projected to increase 18% over next 24 months.',
    details: 'Recent market research indicates that demand for CNC and robotic manufacturing equipment is accelerating due to labor shortages and reshoring initiatives. QRS Manufacturing is well-positioned to benefit from this trend.',
    confidence: 0.92,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    sources: [
      'Industry Association Report Q2 2023',
      'Federal Reserve Manufacturing Index',
      'Sectoral economic projections'
    ]
  },
  {
    id: 'AI-003',
    transactionId: 'TX-12347',
    category: 'risk',
    title: 'Commercial Real Estate Market Risk',
    summary: 'Property location shows resilience to market fluctuations.',
    details: 'Analysis of commercial property values in the target location shows less volatility than the broader market. During the last economic downturn, properties in this area experienced a 7% decline compared to 15% market average.',
    confidence: 0.85,
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    recommendations: [
      'Property represents good collateral value',
      'Consider extended term options',
      'Rental income appears sustainable based on historical vacancy rates'
    ]
  }
];

// ---------------------------
// Mock Backend Functions
// ---------------------------

// Generic response delay function to simulate network latency
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// User Service Functions
export const getUserProfile = async (): Promise<UserProfile> => {
  await delay();
  return currentUser;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  await delay();
  return mockUsers;
};

// Transaction Service Functions
export const getTransactions = async (): Promise<MockTransaction[]> => {
  await delay(700);
  return mockTransactions;
};

export const getTransactionById = async (id: string): Promise<MockTransaction | null> => {
  await delay();
  return mockTransactions.find(t => t.id === id) || null;
};

export const createTransaction = async (transaction: Partial<MockTransaction>): Promise<MockTransaction> => {
  await delay(800);
  const newTransaction: MockTransaction = {
    ...transaction as any,
    id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'pending',
    currentStage: 'application',
    documents: [],
    notes: [],
    details: transaction.details || {
      term: transaction.term || 0,
      interestRate: transaction.interestRate || 0
    }
  };
  
  mockTransactions.push(newTransaction);
  return newTransaction;
};

export const updateTransactionStage = async (id: string, stage: WorkflowStage): Promise<MockTransaction | null> => {
  await delay();
  const transaction = mockTransactions.find(t => t.id === id);
  if (!transaction) return null;
  
  transaction.currentStage = stage;
  transaction.updatedAt = new Date().toISOString();
  return transaction;
};

// Activity Service Functions
export const getRecentActivities = async (limit: number = 10): Promise<Activity[]> => {
  await delay();
  return mockActivities.slice(0, limit);
};

// Analytics Service Functions
export const getAnalytics = async (): Promise<AnalyticsData> => {
  await delay(1000);
  return mockAnalytics;
};

// Document Service Functions
export const getDocumentTemplates = async (): Promise<DocumentTemplate[]> => {
  await delay();
  return mockDocumentTemplates;
};

export const getTransactionDocuments = async (transactionId: string): Promise<any[]> => {
  await delay();
  const transaction = mockTransactions.find(t => t.id === transactionId);
  return transaction?.documents || [];
};

// Notification Service Functions
export const getNotifications = async (): Promise<Notification[]> => {
  await delay();
  return mockNotifications;
};

export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  await delay();
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
};

// AI Service Functions
export const getAIInsights = async (transactionId: string): Promise<AIInsight[]> => {
  await delay(1200); // Longer delay to simulate AI processing
  return mockAIInsights.filter(insight => insight.transactionId === transactionId);
};

export const generateTransactionAnalysis = async (transactionId: string): Promise<{ summary: string, insights: string[] }> => {
  await delay(2000); // Longer delay to simulate complex AI processing
  const transaction = mockTransactions.find(t => t.id === transactionId);
  
  if (!transaction) {
    return {
      summary: "Transaction not found",
      insights: []
    };
  }
  
  return {
    summary: `Analysis of ${transaction.applicantData.name}'s ${transaction.type} application for $${transaction.amount.toLocaleString()} shows a ${transaction.riskProfile?.overallScore || 'N/A'} risk score with ${transaction.riskProfile?.financialRatios.filter(r => r.status === 'good').length || 0} positive financial indicators.`,
    insights: [
      `${transaction.applicantData.name} has been operating in the ${transaction.applicantData.industryCode.toLowerCase().replace('_', ' ')} sector for ${new Date().getFullYear() - transaction.applicantData.foundedYear} years.`,
      `The requested ${transaction.type.toLowerCase()} of $${transaction.amount.toLocaleString()} represents an appropriate financing level for a business of this size and maturity.`,
      `Based on historical performance and industry benchmarks, this transaction has a projected default probability of ${Math.max(5, 100 - (transaction.riskProfile?.overallScore || 50))}%.`,
      `Current economic conditions in the ${transaction.applicantData.industryCode.toLowerCase().replace('_', ' ')} sector suggest stable growth over the financing term.`
    ]
  };
};

// Export a unified mock service
export default {
  users: {
    getUserProfile,
    getAllUsers
  },
  transactions: {
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransactionStage
  },
  activities: {
    getRecentActivities
  },
  analytics: {
    getAnalytics
  },
  documents: {
    getDocumentTemplates,
    getTransactionDocuments
  },
  notifications: {
    getNotifications,
    markNotificationAsRead
  },
  ai: {
    getAIInsights,
    generateTransactionAnalysis
  }
}; 