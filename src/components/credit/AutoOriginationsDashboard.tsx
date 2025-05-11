import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
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
  return (
    <Draggable draggableId={application.id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{application.borrowerName}</h3>
              <p className="text-sm text-gray-600">{application.borrowerId}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {application.type}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ${application.amount.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{application.lastUpdated}</p>
              <p className="text-sm mt-1">
                <span className="font-medium text-gray-700">Assigned:</span>{' '}
                {application.assignedTo}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Documents:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    application.documentStatus === 'Complete'
                      ? 'bg-green-100 text-green-800'
                      : application.documentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {application.documentStatus}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">EVA:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    application.eva_recommendation === 'Approve'
                      ? 'bg-green-100 text-green-800'
                      : application.eva_recommendation === 'Decline'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {application.eva_recommendation}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Risk: {application.risk_score}
              </div>
              <div className="mt-1 text-sm text-gray-600">{application.timeInBusiness}</div>
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

const AutoOriginationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [columns, setColumns] = useState<Record<string, Column>>({});
  const [applications, setApplications] = useState(SAMPLE_APPLICATIONS);
  const { userRole } = useContext(UserContext);

  // Initialize data
  useEffect(() => {
    // Group applications by status
    const newApplications = applications.filter(app => app.status === 'new_application');
    const documentsPending = applications.filter(app => app.status === 'documents_pending');
    const underReview = applications.filter(app => app.status === 'under_review');
    const approved = applications.filter(app => app.status === 'approved');
    const funded = applications.filter(app => app.status === 'funded');
    const rejected = applications.filter(app => app.status === 'rejected');

    // Create columns for Kanban board
    setColumns({
      new_application: {
        id: 'new_application',
        title: 'New Applications',
        applications: newApplications,
      },
      documents_pending: {
        id: 'documents_pending',
        title: 'Documents Pending',
        applications: documentsPending,
      },
      under_review: {
        id: 'under_review',
        title: 'Under Review',
        applications: underReview,
      },
      approved: {
        id: 'approved',
        title: 'Approved',
        applications: approved,
      },
      funded: {
        id: 'funded',
        title: 'Funded',
        applications: funded,
      },
      rejected: {
        id: 'rejected',
        title: 'Rejected',
        applications: rejected,
      },
    });

    setLoading(false);
  }, []);

  // Handle drag end
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If there's no destination
    if (!destination) {
      return;
    }

    // If the item was dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Find the application
    const application = applications.find(app => app.id === draggableId);
    if (!application) return;

    // Remove from source column
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceApplications = [...sourceColumn.applications];
    sourceApplications.splice(source.index, 1);

    // Add to destination column
    const destinationApplications = [...destColumn.applications];

    // Update application with new status and create a properly typed object
    const updatedApplication: Application = {
      ...application,
      status: destination.droppableId as any,
      businessName: application.businessName || application.borrowerName,
      date: application.date || application.createdAt || new Date().toISOString().split('T')[0],
      lastActivity:
        application.lastActivity ||
        `${new Date().toISOString().split('T')[0]}: Status changed to ${destination.droppableId}`,
      completedSteps: application.completedSteps || [],
    };

    destinationApplications.splice(destination.index, 0, updatedApplication);

    // Update state
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        applications: sourceApplications,
      },
      [destination.droppableId]: {
        ...destColumn,
        applications: destinationApplications,
      },
    });
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
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleNewOrigination}
          className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Pending Documents</h3>
            <p className="text-3xl font-bold text-gray-900">{pendingDocuments}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{approvedApplications}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
            <p className="text-3xl font-bold text-primary-600">${totalValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Render the appropriate dashboard view based on user role */}
      {renderDashboardByUserRole()}
    </div>
  );
};

export default AutoOriginationsDashboard;
