import React, { useState } from 'react';
import TopNavigation from '../../components/layout/TopNavigation';

// Define types for commitments
interface Commitment {
  id: string;
  title: string;
  description: string;
  type: 'agreement' | 'contract' | 'subscription' | 'recurring_payment' | 'other';
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  customer: {
    id: string;
    name: string;
    company: string;
  };
  startDate: string;
  endDate: string;
  value: number;
  recurringInterval?: 'monthly' | 'quarterly' | 'annually' | 'one_time';
  documents?: string[];
  notes?: string;
  renewalReminder?: boolean;
  autoRenew?: boolean;
}

// Mock function to calculate upcoming renewals
const getUpcomingRenewals = (commitmentData: Commitment[]): number => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  return commitmentData.filter(c => {
    const endDate = new Date(c.endDate);
    return c.status === 'active' && endDate <= thirtyDaysFromNow && endDate >= new Date();
  }).length;
};

// Calculate total annual value considering recurring intervals
const calculateAnnualValue = (commitmentData: Commitment[]): number => {
  return commitmentData
    .filter(c => c.status === 'active')
    .reduce((sum, commitment) => {
      let annualValue = commitment.value;
      
      // Adjust for recurring intervals
      if (commitment.recurringInterval === 'monthly') {
        annualValue *= 12;
      } else if (commitment.recurringInterval === 'quarterly') {
        annualValue *= 4;
      }
      
      return sum + annualValue;
    }, 0);
};

const CustomerRetentionCommitments: React.FC = () => {
  // Mock data for commitments
  const [commitments, setCommitments] = useState<Commitment[]>([
    {
      id: 'com-1',
      title: 'Annual Service Agreement',
      description: 'Premium service package with quarterly review meetings',
      type: 'agreement',
      status: 'active',
      customer: {
        id: 'cust-1',
        name: 'John Smith',
        company: 'Acme Corporation',
      },
      startDate: '2023-01-15',
      endDate: '2024-01-15',
      value: 12000,
      recurringInterval: 'annually',
      documents: ['service-agreement-acme-2023.pdf'],
      notes: 'Customer has expressed interest in extending to premium tier next renewal',
      renewalReminder: true,
      autoRenew: false,
    },
    {
      id: 'com-2',
      title: 'Software Subscription',
      description: 'Enterprise license for 50 users',
      type: 'subscription',
      status: 'active',
      customer: {
        id: 'cust-2',
        name: 'Sarah Johnson',
        company: 'Globex Inc.',
      },
      startDate: '2023-04-10',
      endDate: '2024-04-10',
      value: 24000,
      recurringInterval: 'monthly',
      renewalReminder: true,
      autoRenew: true,
    },
    {
      id: 'com-3',
      title: 'Consulting Retainer',
      description: 'Financial advisory services - 20 hours per month',
      type: 'contract',
      status: 'pending',
      customer: {
        id: 'cust-3',
        name: 'Michael Rodriguez',
        company: 'TechTron Solutions',
      },
      startDate: '2023-12-01',
      endDate: '2024-06-01',
      value: 36000,
      recurringInterval: 'monthly',
      documents: ['techtron-contract-draft.pdf'],
      notes: 'Awaiting signature from client',
      renewalReminder: false,
      autoRenew: false,
    },
    {
      id: 'com-4',
      title: 'Equipment Maintenance',
      description: 'Quarterly maintenance for manufacturing equipment',
      type: 'agreement',
      status: 'expired',
      customer: {
        id: 'cust-4',
        name: 'David Williams',
        company: 'Construction Professionals LLC',
      },
      startDate: '2022-05-12',
      endDate: '2023-05-12',
      value: 8000,
      recurringInterval: 'quarterly',
      notes: 'Need to contact for renewal',
      renewalReminder: true,
      autoRenew: false,
    },
    {
      id: 'com-5',
      title: 'Premium Support Plan',
      description: '24/7 dedicated support with 4-hour response time',
      type: 'subscription',
      status: 'cancelled',
      customer: {
        id: 'cust-5',
        name: 'Lisa Chen',
        company: 'Innovate Financial',
      },
      startDate: '2023-03-20',
      endDate: '2024-03-20',
      value: 18000,
      recurringInterval: 'annually',
      documents: ['support-contract-innovate.pdf'],
      notes: 'Customer cancelled due to budget constraints. Follow up in Q3 for potential renewal.',
      renewalReminder: false,
      autoRenew: false,
    },
  ]);

  // State for filters and searching
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCommitment, setNewCommitment] = useState<Partial<Commitment>>({
    type: 'agreement',
    status: 'active',
    recurringInterval: 'monthly',
    renewalReminder: true,
    autoRenew: false,
  });

  // Filter commitments based on search and filters
  const filteredCommitments = commitments.filter(commitment => {
    const matchesSearch =
      commitment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commitment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commitment.customer.company.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filterStatus === 'all' || commitment.status === filterStatus;
    const matchesType = filterType === 'all' || commitment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Function to add a new commitment
  const handleAddCommitment = () => {
    // This would be an API call in a real implementation
    const newId = `com-${commitments.length + 1}-${Date.now().toString().slice(-4)}`;
    
    const commitment: Commitment = {
      id: newId,
      title: newCommitment.title || 'Untitled Commitment',
      description: newCommitment.description || '',
      type: newCommitment.type as any || 'agreement',
      status: newCommitment.status as any || 'pending',
      customer: {
        id: 'new-customer',
        name: newCommitment.customer?.name || 'New Customer',
        company: newCommitment.customer?.company || 'New Company',
      },
      startDate: newCommitment.startDate || new Date().toISOString().split('T')[0],
      endDate: newCommitment.endDate || new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      value: newCommitment.value || 0,
      recurringInterval: newCommitment.recurringInterval as any,
      notes: newCommitment.notes,
      renewalReminder: newCommitment.renewalReminder,
      autoRenew: newCommitment.autoRenew,
    };
    
    setCommitments([...commitments, commitment]);
    setShowAddModal(false);
    setNewCommitment({
      type: 'agreement',
      status: 'active',
      recurringInterval: 'monthly',
      renewalReminder: true,
      autoRenew: false,
    });
  };

  // Function to render status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string, label: string }> = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      expired: { color: 'bg-gray-100 text-gray-800', label: 'Expired' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    
    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Function to render type badge
  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { color: string, label: string }> = {
      agreement: { color: 'bg-blue-100 text-blue-800', label: 'Agreement' },
      contract: { color: 'bg-purple-100 text-purple-800', label: 'Contract' },
      subscription: { color: 'bg-indigo-100 text-indigo-800', label: 'Subscription' },
      recurring_payment: { color: 'bg-teal-100 text-teal-800', label: 'Recurring Payment' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' },
    };
    
    const config = typeConfig[type] || typeConfig.other;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Calculate dashboard metrics
  const activeCommitments = commitments.filter(c => c.status === 'active').length;
  const upcomingRenewals = getUpcomingRenewals(commitments);
  const annualValue = calculateAnnualValue(commitments);

  return (
    <div className="pl-20 sm:pl-72 w-full">
      <div className="container mx-auto px-4 py-6 max-w-full">
        <TopNavigation title="Customer Retention - Commitments" currentTransactionId="TX-123" />
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Active Commitments */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Active Commitments</p>
                <h3 className="font-bold text-3xl text-gray-900">
                  {activeCommitments}
                </h3>
              </div>
            </div>
          </div>

          {/* Upcoming Renewals */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Upcoming Renewals (30 days)</p>
                <h3 className="font-bold text-3xl text-gray-900">{upcomingRenewals}</h3>
              </div>
            </div>
          </div>

          {/* Total Annual Value */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-800">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm">Annual Commitment Value</p>
                <h3 className="font-bold text-3xl text-gray-900">
                  {formatCurrency(annualValue)}
                </h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Commitments</h1>
              <p className="text-gray-600">Track and manage customer agreements and commitments</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Commitment
            </button>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search commitments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="agreement">Agreements</option>
                <option value="contract">Contracts</option>
                <option value="subscription">Subscriptions</option>
                <option value="recurring_payment">Recurring Payments</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Commitments Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commitment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type/Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommitments.length > 0 ? (
                  filteredCommitments.map((commitment) => (
                    <tr key={commitment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commitment.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{commitment.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commitment.customer.name}</div>
                        <div className="text-sm text-gray-500">{commitment.customer.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          {getTypeBadge(commitment.type)}
                          {getStatusBadge(commitment.status)}
                          {commitment.autoRenew && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                              Auto-renew
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>Start: {formatDate(commitment.startDate)}</div>
                          <div>End: {formatDate(commitment.endDate)}</div>
                        </div>
                        {isRenewalSoon(commitment) && (
                          <div className="text-xs mt-1 text-amber-600 font-medium">
                            Renews soon
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(commitment.value)}</div>
                        <div className="text-xs text-gray-500">
                          {commitment.recurringInterval ? `${commitment.recurringInterval}` : 'one-time'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No commitments found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Commitment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 md:mx-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Add New Commitment</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g. Annual Service Agreement"
                      value={newCommitment.title || ''}
                      onChange={(e) => setNewCommitment({ ...newCommitment, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter commitment details..."
                      rows={3}
                      value={newCommitment.description || ''}
                      onChange={(e) => setNewCommitment({ ...newCommitment, description: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Customer name"
                      value={newCommitment.customer?.name || ''}
                      onChange={(e) => setNewCommitment({ 
                        ...newCommitment, 
                        customer: { 
                          ...newCommitment.customer as any, 
                          name: e.target.value 
                        } 
                      })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Company name"
                      value={newCommitment.customer?.company || ''}
                      onChange={(e) => setNewCommitment({ 
                        ...newCommitment, 
                        customer: { 
                          ...newCommitment.customer as any, 
                          company: e.target.value 
                        } 
                      })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={newCommitment.type}
                      onChange={(e) => setNewCommitment({ ...newCommitment, type: e.target.value as any })}
                    >
                      <option value="agreement">Agreement</option>
                      <option value="contract">Contract</option>
                      <option value="subscription">Subscription</option>
                      <option value="recurring_payment">Recurring Payment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={newCommitment.status}
                      onChange={(e) => setNewCommitment({ ...newCommitment, status: e.target.value as any })}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={newCommitment.startDate || ''}
                      onChange={(e) => setNewCommitment({ ...newCommitment, startDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={newCommitment.endDate || ''}
                      onChange={(e) => setNewCommitment({ ...newCommitment, endDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        className="w-full pl-7 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0"
                        value={newCommitment.value || ''}
                        onChange={(e) => setNewCommitment({ ...newCommitment, value: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recurring Interval</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      value={newCommitment.recurringInterval}
                      onChange={(e) => setNewCommitment({ ...newCommitment, recurringInterval: e.target.value as any })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                      <option value="one_time">One-time</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Additional notes..."
                      rows={2}
                      value={newCommitment.notes || ''}
                      onChange={(e) => setNewCommitment({ ...newCommitment, notes: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="renewalReminder"
                        checked={newCommitment.renewalReminder || false}
                        onChange={(e) => setNewCommitment({ ...newCommitment, renewalReminder: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="renewalReminder" className="ml-2 block text-sm text-gray-700">
                        Send renewal reminder
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoRenew"
                        checked={newCommitment.autoRenew || false}
                        onChange={(e) => setNewCommitment({ ...newCommitment, autoRenew: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="autoRenew" className="ml-2 block text-sm text-gray-700">
                        Auto-renew
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCommitment}
                  className="px-4 py-2 border border-transparent rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Add Commitment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to check if a commitment is renewing soon (within 30 days)
const isRenewalSoon = (commitment: Commitment): boolean => {
  if (commitment.status !== 'active') return false;
  
  const endDate = new Date(commitment.endDate);
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  
  return endDate <= thirtyDaysFromNow && endDate >= now;
};

export default CustomerRetentionCommitments; 