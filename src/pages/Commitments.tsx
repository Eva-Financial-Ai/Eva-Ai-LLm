import React, { useState } from 'react';
import TopNavigation from '../components/layout/TopNavigation';

// Define the Commitment interface
interface Commitment {
  id: string;
  title: string;
  description: string;
  type: 'loan' | 'equipment' | 'real_estate' | 'line_of_credit' | 'other';
  status: 'pending_approval' | 'approved' | 'funded' | 'expired' | 'cancelled';
  customer: {
    id: string;
    name: string;
    company: string;
  };
  amount: number;
  createdDate: string;
  expirationDate: string;
  approvedBy?: string;
  approvalDate?: string;
}

const Commitments: React.FC = () => {
  // Mock data for commitments
  const [commitments, setCommitments] = useState<Commitment[]>([
    {
      id: 'com-1',
      title: 'Commercial Real Estate Loan',
      description:
        'Commitment letter for financing the purchase of office building at 123 Main St.',
      type: 'real_estate',
      status: 'approved',
      customer: {
        id: 'cust-1',
        name: 'John Smith',
        company: 'Acme Corporation',
      },
      amount: 1250000,
      createdDate: '2023-11-10',
      expirationDate: '2024-02-10',
      approvedBy: 'Michael Johnson',
      approvalDate: '2023-11-15',
    },
    {
      id: 'com-2',
      title: 'Equipment Financing',
      description: 'Commitment for heavy machinery financing for construction project.',
      type: 'equipment',
      status: 'pending_approval',
      customer: {
        id: 'cust-2',
        name: 'Sarah Johnson',
        company: 'Globex Inc.',
      },
      amount: 450000,
      createdDate: '2023-11-25',
      expirationDate: '2024-01-25',
    },
    {
      id: 'com-3',
      title: 'Business Line of Credit',
      description: 'Revolving line of credit for operational expenses.',
      type: 'line_of_credit',
      status: 'funded',
      customer: {
        id: 'cust-3',
        name: 'David Williams',
        company: 'Construction Professionals LLC',
      },
      amount: 750000,
      createdDate: '2023-10-05',
      expirationDate: '2024-10-05',
      approvedBy: 'Jennifer Lee',
      approvalDate: '2023-10-12',
    },
    {
      id: 'com-4',
      title: 'Commercial Vehicle Fleet',
      description: 'Financing for the purchase of 10 delivery vehicles.',
      type: 'equipment',
      status: 'expired',
      customer: {
        id: 'cust-4',
        name: 'Lisa Chen',
        company: 'Innovate Financial',
      },
      amount: 350000,
      createdDate: '2023-08-15',
      expirationDate: '2023-11-15',
    },
    {
      id: 'com-5',
      title: 'Manufacturing Equipment Upgrade',
      description: 'Commitment for financing modernization of production line equipment.',
      type: 'equipment',
      status: 'cancelled',
      customer: {
        id: 'cust-5',
        name: 'Michael Rodriguez',
        company: 'TechTron Solutions',
      },
      amount: 850000,
      createdDate: '2023-09-20',
      expirationDate: '2023-12-20',
    },
  ]);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtered commitments based on filters and search
  const filteredCommitments = commitments.filter(commitment => {
    const matchesStatus = filterStatus === 'all' || commitment.status === filterStatus;
    const matchesType = filterType === 'all' || commitment.type === filterType;
    const matchesSearch =
      commitment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commitment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commitment.customer.company.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to render the status badge with appropriate styling
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      pending_approval: { label: 'Pending Approval', classes: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', classes: 'bg-green-100 text-green-800' },
      funded: { label: 'Funded', classes: 'bg-blue-100 text-blue-800' },
      expired: { label: 'Expired', classes: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.classes}`}>
        {config.label}
      </span>
    );
  };

  // Function to render type badge with appropriate styling
  const renderTypeBadge = (type: string) => {
    const typeConfig = {
      loan: { label: 'Loan', classes: 'bg-indigo-100 text-indigo-800' },
      equipment: { label: 'Equipment', classes: 'bg-purple-100 text-purple-800' },
      real_estate: { label: 'Real Estate', classes: 'bg-teal-100 text-teal-800' },
      line_of_credit: { label: 'Line of Credit', classes: 'bg-sky-100 text-sky-800' },
      other: { label: 'Other', classes: 'bg-gray-100 text-gray-800' },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.classes}`}>
        {config.label}
      </span>
    );
  };

  // Handle creating a new commitment (placeholder for real implementation)
  const handleCreateCommitment = () => {
    alert('This would open a form to create a new commitment letter in a real application.');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation title="Commitments" />

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Commitment Letters</h1>
          <p className="text-gray-600">Manage and track all financing commitment letters</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 w-full"
                  placeholder="Search commitment letters..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  className="border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2 w-full md:w-auto"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="funded">Funded</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  className="border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2 w-full md:w-auto"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="loan">Loans</option>
                  <option value="equipment">Equipment</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="line_of_credit">Line of Credit</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Create Commitment Button */}
            <button
              onClick={handleCreateCommitment}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Commitment
            </button>
          </div>
        </div>

        {/* Commitment List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Commitment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
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
                    Dates
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommitments.map(commitment => (
                  <tr key={commitment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{commitment.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{commitment.description}</div>
                        <div className="mt-2">{renderTypeBadge(commitment.type)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {commitment.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">{commitment.customer.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(commitment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(commitment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-500">
                        Created: {new Date(commitment.createdDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(commitment.expirationDate).toLocaleDateString()}
                      </div>
                      {commitment.approvalDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Approved: {new Date(commitment.approvalDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button className="text-primary-600 hover:text-primary-900">View</button>
                        <button className="text-gray-600 hover:text-gray-900">Edit</button>
                        <button className="text-indigo-600 hover:text-indigo-900">Download</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCommitments.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-gray-500">
                No commitment letters found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Commitments;
