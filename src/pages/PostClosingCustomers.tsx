import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import TopNavigation from '../components/layout/TopNavigation';
import { CalendarIcon, BellIcon, UserGroupIcon, ChartBarIcon, CurrencyDollarIcon, ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';

// Types for our application
interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  lastContact: string;
  nextFollowUp: string | null;
  loanType: string;
  closingDate: string;
  loanAmount: number;
  crossSellOpportunities: CrossSellOpportunity[];
  lifetimeValue: number;
  profileComplete: number;
  tags: string[];
}

type CustomerType = 'business' | 'business-owner' | 'vendor' | 'broker' | 'lender' | 'asset-seller' | 'service-provider';

interface CrossSellOpportunity {
  id: string;
  productName: string;
  probability: number;
  potentialValue: number;
  category: 'financial' | 'insurance' | 'advisory' | 'technology' | 'other';
  description: string;
}

interface Notification {
  id: string;
  customerId: string;
  date: string;
  description: string;
  type: 'email' | 'call' | 'meeting' | 'task';
  status: 'scheduled' | 'sent' | 'completed' | 'missed';
}

const PostClosingCustomers: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showAddNotification, setShowAddNotification] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<{
    customerId: string;
    date: string;
    description: string;
    type: 'email' | 'call' | 'meeting' | 'task';
  }>({
    customerId: '',
    date: new Date(Date.now() + 86400000).toISOString().substring(0, 10), // Tomorrow
    description: '',
    type: 'email'
  });

  // Mock data for customers
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'cust-1',
      name: 'Acme Corporation',
      type: 'business',
      lastContact: '2023-05-10',
      nextFollowUp: '2023-06-15',
      loanType: 'Equipment Financing',
      closingDate: '2023-05-01',
      loanAmount: 250000,
      crossSellOpportunities: [
        {
          id: 'cs-1',
          productName: 'Working Capital Line',
          probability: 0.7,
          potentialValue: 100000,
          category: 'financial',
          description: 'Working capital line to support seasonal inventory needs'
        },
        {
          id: 'cs-2',
          productName: 'Business Insurance',
          probability: 0.5,
          potentialValue: 5000,
          category: 'insurance',
          description: 'Comprehensive business insurance for their new equipment'
        }
      ],
      lifetimeValue: 35000,
      profileComplete: 85,
      tags: ['manufacturing', 'equipment', 'growth']
    },
    {
      id: 'cust-2',
      name: 'John Smith',
      type: 'business-owner',
      lastContact: '2023-05-15',
      nextFollowUp: '2023-06-20',
      loanType: 'Commercial Mortgage',
      closingDate: '2023-05-05',
      loanAmount: 750000,
      crossSellOpportunities: [
        {
          id: 'cs-3',
          productName: 'Personal Wealth Management',
          probability: 0.6,
          potentialValue: 25000,
          category: 'advisory',
          description: 'Wealth management services for business proceeds'
        }
      ],
      lifetimeValue: 62000,
      profileComplete: 90,
      tags: ['real-estate', 'high-value', 'repeat-customer']
    },
    {
      id: 'cust-3',
      name: 'XYZ Equipment Sales',
      type: 'vendor',
      lastContact: '2023-05-20',
      nextFollowUp: null,
      loanType: 'Vendor Program',
      closingDate: '2023-05-10',
      loanAmount: 500000,
      crossSellOpportunities: [
        {
          id: 'cs-4',
          productName: 'Enhanced Vendor Portal',
          probability: 0.8,
          potentialValue: 15000,
          category: 'technology',
          description: 'Upgraded vendor portal with advanced financing options'
        }
      ],
      lifetimeValue: 120000,
      profileComplete: 75,
      tags: ['machinery', 'high-volume', 'partnership']
    },
    {
      id: 'cust-4',
      name: 'Financial Brokers LLC',
      type: 'broker',
      lastContact: '2023-05-18',
      nextFollowUp: '2023-06-18',
      loanType: 'Broker Partnership',
      closingDate: '2023-05-15',
      loanAmount: 1200000,
      crossSellOpportunities: [
        {
          id: 'cs-5',
          productName: 'Broker Training Program',
          probability: 0.9,
          potentialValue: 8000,
          category: 'advisory',
          description: 'Specialized training on new financing products'
        }
      ],
      lifetimeValue: 230000,
      profileComplete: 95,
      tags: ['high-producer', 'multiple-deals', 'strategic']
    }
  ]);

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: 'not-1',
        customerId: 'cust-1',
        date: '2023-06-15',
        description: 'Follow-up on Working Capital Line opportunity',
        type: 'call',
        status: 'scheduled'
      },
      {
        id: 'not-2',
        customerId: 'cust-2',
        date: '2023-06-20',
        description: 'Present Wealth Management options',
        type: 'meeting',
        status: 'scheduled'
      },
      {
        id: 'not-3',
        customerId: 'cust-4',
        date: '2023-06-18',
        description: 'Broker Training Program scheduling',
        type: 'email',
        status: 'scheduled'
      }
    ]);
  }, []);

  // Filter customers based on active tab and search term
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return customer.type === activeTab && matchesSearch;
  });

  // Add a new notification
  const handleAddNotification = () => {
    if (!selectedCustomer || !newNotification.description || !newNotification.date) return;
    
    const notification: Notification = {
      id: `not-${Date.now()}`,
      customerId: selectedCustomer.id,
      date: newNotification.date,
      description: newNotification.description,
      type: newNotification.type,
      status: 'scheduled'
    };
    
    setNotifications([...notifications, notification]);
    
    // Update the customer's next follow-up date if it's earlier than the current one
    // or if there isn't one set yet
    const updatedCustomers = customers.map(customer => {
      if (customer.id === selectedCustomer.id) {
        if (!customer.nextFollowUp || new Date(notification.date) < new Date(customer.nextFollowUp)) {
          return { ...customer, nextFollowUp: notification.date };
        }
      }
      return customer;
    });
    setCustomers(updatedCustomers);
    
    // Reset form
    setShowAddNotification(false);
    setNewNotification({
      customerId: '',
      date: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
      description: '',
      type: 'email'
    });
    setSelectedCustomer(null);
  };

  // Navigation to customer details
  const navigateToCustomerDetails = (customerId: string) => {
    // In a real app, this would navigate to a detailed view
    console.log(`Navigating to customer ${customerId}`);
  };

  return (
    <PageLayout title="Post Closing Customers">
      <div className="container mx-auto px-4 py-6">
        <TopNavigation title="Post Closing Customers" />
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post Closing Customer Management</h1>
              <p className="text-gray-600">Maximize customer lifetime value with strategic follow-ups and cross-selling</p>
            </div>
            
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button 
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
                onClick={() => {
                  setShowAddNotification(true);
                }}
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                <span>New Reminder</span>
              </button>
            </div>
          </div>
          
          {/* Customer Type Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6 overflow-x-auto pb-1">
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Customers
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'business'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('business')}
              >
                Businesses
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'business-owner'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('business-owner')}
              >
                Business Owners
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'vendor'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('vendor')}
              >
                Vendors
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'broker'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('broker')}
              >
                Brokers & Originators
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'lender'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('lender')}
              >
                Lenders
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'asset-seller'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('asset-seller')}
              >
                Asset Sellers
              </button>
              <button
                className={`py-2 px-1 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === 'service-provider'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('service-provider')}
              >
                Service Providers
              </button>
            </nav>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Customers</p>
                  <p className="text-2xl font-bold text-blue-800">{customers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-600">Avg. Lifetime Value</p>
                  <p className="text-2xl font-bold text-green-800">
                    ${Math.round(customers.reduce((acc, c) => acc + c.lifetimeValue, 0) / customers.length).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Loan Volume</p>
                  <p className="text-2xl font-bold text-purple-800">
                    ${customers.reduce((acc, c) => acc + c.loanAmount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-center">
                <ArrowPathIcon className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-amber-600">Follow-ups This Month</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {notifications.filter(n => {
                      const today = new Date();
                      const notifDate = new Date(n.date);
                      return notifDate.getMonth() === today.getMonth() && 
                             notifDate.getFullYear() === today.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Follow-up
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cross-Sell Opportunities
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {customer.type.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.loanType}</div>
                      <div className="text-sm text-gray-500">
                        ${customer.loanAmount.toLocaleString()} • {new Date(customer.closingDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.lastContact).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.nextFollowUp ? (
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                          <span className="text-sm text-gray-900">
                            {new Date(customer.nextFollowUp).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {customer.crossSellOpportunities.length > 0 ? (
                          customer.crossSellOpportunities.map(opportunity => (
                            <div key={opportunity.id} className="flex items-center">
                              <div 
                                className="w-2 h-2 rounded-full mr-2" 
                                style={{ 
                                  backgroundColor: opportunity.probability > 0.7 
                                    ? '#10B981' // green 
                                    : opportunity.probability > 0.4 
                                      ? '#F59E0B' // amber
                                      : '#EF4444' // red
                                }}
                              />
                              <span className="text-sm text-gray-900">
                                {opportunity.productName}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">None identified</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowAddNotification(true);
                            setNewNotification(prev => ({
                              ...prev,
                              customerId: customer.id
                            }));
                          }}
                          className="text-primary-600 hover:text-primary-900 flex items-center"
                        >
                          <BellIcon className="h-4 w-4 mr-1" />
                          Schedule
                        </button>
                        <button 
                          onClick={() => navigateToCustomerDetails(customer.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No customers found matching your criteria.</p>
            </div>
          )}
        </div>
        
        {/* Upcoming Follow-ups Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Follow-ups</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(notification => {
                    const customer = customers.find(c => c.id === notification.customerId);
                    return (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(notification.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {notification.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${notification.type === 'email' ? 'bg-blue-100 text-blue-800' :
                              notification.type === 'call' ? 'bg-green-100 text-green-800' :
                              notification.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {notification.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${notification.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              notification.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              notification.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}
                          `}>
                            {notification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-primary-600 hover:text-primary-900"
                              onClick={() => {
                                // Mark as completed logic would go here
                                const updatedNotifications = notifications.map(n => 
                                  n.id === notification.id ? {...n, status: 'completed' as const} : n
                                );
                                setNotifications(updatedNotifications);
                              }}
                            >
                              Complete
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => {
                                // Reschedule logic would go here
                                const customer = customers.find(c => c.id === notification.customerId);
                                if (customer) {
                                  setSelectedCustomer(customer);
                                  setShowAddNotification(true);
                                  setNewNotification({
                                    customerId: customer.id,
                                    date: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
                                    description: `Rescheduled: ${notification.description}`,
                                    type: notification.type
                                  });
                                }
                              }}
                            >
                              Reschedule
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          
          {notifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming follow-ups scheduled.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Notification Modal */}
      {showAddNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Schedule Follow-up</h3>
              <button 
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowAddNotification(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => {
                    const customer = customers.find(c => c.id === e.target.value);
                    setSelectedCustomer(customer || null);
                    setNewNotification(prev => ({
                      ...prev,
                      customerId: e.target.value
                    }));
                  }}
                >
                  <option value="">Select a customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Date
                </label>
                <input 
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newNotification.date}
                  onChange={(e) => setNewNotification(prev => ({
                    ...prev,
                    date: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe the purpose of this follow-up..."
                  value={newNotification.description}
                  onChange={(e) => setNewNotification(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Method
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="radio"
                      className="form-radio text-primary-600"
                      name="contactMethod"
                      value="email"
                      checked={newNotification.type === 'email'}
                      onChange={() => setNewNotification(prev => ({
                        ...prev,
                        type: 'email'
                      }))}
                    />
                    <span className="ml-2">Email</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio"
                      className="form-radio text-primary-600"
                      name="contactMethod"
                      value="call"
                      checked={newNotification.type === 'call'}
                      onChange={() => setNewNotification(prev => ({
                        ...prev,
                        type: 'call'
                      }))}
                    />
                    <span className="ml-2">Call</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio"
                      className="form-radio text-primary-600"
                      name="contactMethod"
                      value="meeting"
                      checked={newNotification.type === 'meeting'}
                      onChange={() => setNewNotification(prev => ({
                        ...prev,
                        type: 'meeting'
                      }))}
                    />
                    <span className="ml-2">Meeting</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input 
                      type="radio"
                      className="form-radio text-primary-600"
                      name="contactMethod"
                      value="task"
                      checked={newNotification.type === 'task'}
                      onChange={() => setNewNotification(prev => ({
                        ...prev,
                        type: 'task'
                      }))}
                    />
                    <span className="ml-2">Task</span>
                  </label>
                </div>
              </div>
              
              {/* Cross-sell suggestions if customer is selected */}
              {selectedCustomer && selectedCustomer.crossSellOpportunities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suggested Cross-Sell Opportunities
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedCustomer.crossSellOpportunities.map(opportunity => (
                      <div key={opportunity.id} className="flex items-center mb-2 last:mb-0">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ 
                            backgroundColor: opportunity.probability > 0.7 
                              ? '#10B981' // green 
                              : opportunity.probability > 0.4 
                                ? '#F59E0B' // amber
                                : '#EF4444' // red
                          }}
                        />
                        <button
                          className="text-left text-sm text-primary-600 hover:text-primary-800 cursor-pointer"
                          onClick={() => {
                            setNewNotification(prev => ({
                              ...prev,
                              description: `Discuss ${opportunity.productName}: ${opportunity.description}`
                            }));
                          }}
                        >
                          {opportunity.productName} (${opportunity.potentialValue.toLocaleString()})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowAddNotification(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700"
                onClick={handleAddNotification}
              >
                Schedule Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default PostClosingCustomers; 