import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';
import AccessibilityControls from '../components/common/AccessibilityControls';

// Types for notification requests
interface NotificationRequest {
  id: string;
  type: 'info' | 'reminder' | 'document' | 'approval' | 'custom';
  message: string;
  recipientType: 'internal' | 'client' | 'vendor' | 'other';
  recipientInfo?: string;
  createdAt: Date;
  followUpDate?: Date;
  status: 'pending' | 'sent' | 'completed';
}

// Organization structure type
interface Organization {
  id: string;
  name: string;
  legalName: string;
  type: 'llc' | 'corporation' | 'partnership' | 'soleProprietorship' | 'other';
  ein: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  isActive: boolean;
  isDefault: boolean;
  yearFounded: string;
  industry: string;
  description?: string;
  numberOfEmployees: string;
  annualRevenue?: string;
  owners: OrganizationOwner[];
}

// Organization owner structure
interface OrganizationOwner {
  id: string;
  name: string;
  type: 'individual' | 'business' | 'trust';
  ownershipPercentage: number;
  title?: string;
  email?: string;
  phone?: string;
}

// Customer structure
interface Customer {
  id: string;
  name: string;
  type: 'business' | 'individual';
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  assignedTo?: string;
  status: 'active' | 'inactive' | 'prospect' | 'archived';
  createdAt: Date;
  lastContactDate?: Date;
}

// Helper function for conditional class names
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');

  // Billing and payment states
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethods, setPaymentMethods] = useState<Array<{
    id: string;
    type: 'credit' | 'bank';
    last4: string;
    expiry?: string;
    isDefault: boolean;
  }>>([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    setAsDefault: false
  });
  const [subscriptionHistory, setSubscriptionHistory] = useState<Array<{
    id: string;
    date: Date;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
  }>>([]);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  // Notification types to receive
  const [notificationTypes, setNotificationTypes] = useState({
    transactions: true,
    documents: true,
    messages: true,
    reminders: true,
  });

  // Custom requests state
  const [requests, setRequests] = useState<NotificationRequest[]>([]);
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // New request form state
  const [newRequest, setNewRequest] = useState<{
    type: NotificationRequest['type'];
    message: string;
    recipientType: NotificationRequest['recipientType'];
    recipientInfo: string;
    followUpDate: string;
    setReminder: boolean;
  }>({
    type: 'custom',
    message: '',
    recipientType: 'client',
    recipientInfo: '',
    followUpDate: '',
    setReminder: false,
  });

  // Organizations state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showOrganizationModal, setShowOrganizationModal] = useState(false);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [orgFormMode, setOrgFormMode] = useState<'create' | 'edit'>('create');

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [customerFormMode, setCustomerFormMode] = useState<'create' | 'edit'>('create');

  // Load user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || '');

      // Mock: Fetch actual user data would happen here
      setPhone('(555) 123-4567'); // Mock data
    }

    // Mock: Load saved requests
    const mockRequests: NotificationRequest[] = [
      {
        id: 'req-001',
        type: 'document',
        message: 'Please provide updated financial statements',
        recipientType: 'client',
        recipientInfo: 'Acme Corporation',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        followUpDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
        status: 'sent',
      },
      {
        id: 'req-002',
        type: 'reminder',
        message: 'Follow up on equipment invoice',
        recipientType: 'internal',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'pending',
      },
    ];

    setRequests(mockRequests);

    // Mock: Load organizations
    const mockOrganizations: Organization[] = [
      {
        id: 'org-001',
        name: 'Acme Technologies',
        legalName: 'Acme Technologies, LLC',
        type: 'llc',
        ein: '12-3456789',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103',
        phone: '(415) 555-1234',
        email: 'info@acmetech.com',
        website: 'www.acmetech.com',
        isActive: true,
        isDefault: true,
        yearFounded: '2015',
        industry: 'Technology',
        description: 'A technology company specializing in enterprise solutions',
        numberOfEmployees: '25-50',
        annualRevenue: '$5M-$10M',
        owners: [
          {
            id: 'owner-001',
            name: 'John Smith',
            type: 'individual',
            ownershipPercentage: 51,
            title: 'CEO',
            email: 'john@acmetech.com',
            phone: '(415) 555-5678',
          },
          {
            id: 'owner-002',
            name: 'Venture Partners LLC',
            type: 'business',
            ownershipPercentage: 49,
            email: 'partners@venturepartners.com',
            phone: '(415) 555-9012',
          },
        ],
      },
    ];

    setOrganizations(mockOrganizations);

    // Mock: Load payment methods
    const mockPaymentMethods = [
      {
        id: 'pm-001',
        type: 'credit' as const,
        last4: '4242',
        expiry: '04/25',
        isDefault: true
      },
      {
        id: 'pm-002',
        type: 'bank' as const,
        last4: '6789',
        isDefault: false
      }
    ];
    setPaymentMethods(mockPaymentMethods);

    // Mock: Load subscription history
    const mockSubscriptionHistory = [
      {
        id: 'sub-001',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        amount: 49.99,
        status: 'paid' as const,
        description: 'EVA Premium Monthly Subscription'
      },
      {
        id: 'sub-002',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
        amount: 49.99,
        status: 'paid' as const,
        description: 'EVA Premium Monthly Subscription'
      }
    ];
    setSubscriptionHistory(mockSubscriptionHistory);

    // Mock: Load customers
    const mockCustomers: Customer[] = [
      {
        id: 'cust-001',
        name: 'Atlas Systems, Inc.',
        type: 'business',
        email: 'info@atlassystems.com',
        phone: '(510) 555-3456',
        address: '456 Market St',
        city: 'Oakland',
        state: 'CA',
        zipCode: '94607',
        notes: 'Equipment financing client',
        assignedTo: 'Sarah Thompson',
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
        lastContactDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      },
      {
        id: 'cust-002',
        name: 'Robert Johnson',
        type: 'individual',
        email: 'robert@johnson.com',
        phone: '(415) 555-7890',
        address: '789 Oak St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94110',
        notes: 'Small business owner, interested in line of credit',
        assignedTo: 'James Wilson',
        status: 'prospect',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
        lastContactDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
    ];

    setCustomers(mockCustomers);
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = () => {
    // In a real app, this would call an API
    alert('Profile updated successfully');
  };

  // Handle notification preferences update
  const handleNotificationUpdate = () => {
    // In a real app, this would call an API
    alert('Notification preferences updated successfully');
  };

  // Create a new request
  const handleCreateRequest = () => {
    const newRequestObj: NotificationRequest = {
      id: `req-${Date.now()}`,
      type: newRequest.type,
      message: newRequest.message,
      recipientType: newRequest.recipientType,
      recipientInfo: newRequest.recipientInfo || undefined,
      createdAt: new Date(),
      followUpDate:
        newRequest.setReminder && newRequest.followUpDate
          ? new Date(newRequest.followUpDate)
          : undefined,
      status: 'pending',
    };

    setRequests([...requests, newRequestObj]);

    // Reset form and close modal
    setNewRequest({
      type: 'custom',
      message: '',
      recipientType: 'client',
      recipientInfo: '',
      followUpDate: '',
      setReminder: false,
    });

    setRequestModalOpen(false);

    // Show confirmation message
    alert('Request created. Notifications will be sent according to your settings.');
  };

  // Delete a request
  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  // Define the tabs array
  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'security', name: 'Security' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'billing', name: 'Billing & Payments' },
    { id: 'organization', name: 'Organization' },
    { id: 'accessibility', name: 'Accessibility' },
  ];

  // Add new Accessibility tab content
  const renderAccessibilityTab = () => {
    return (
      <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Accessibility Settings</h2>
          <p className="text-gray-600 mb-6">
            Adjust these settings to make the application more accessible based on your needs.
          </p>

          <AccessibilityControls className="mb-6" />

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Additional Accessibility Options
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-900">Reduce Animations</p>
                  <p className="text-sm text-gray-500">
                    Minimize motion effects throughout the application
                  </p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input type="checkbox" id="reduceAnimations" className="sr-only" />
                  <label
                    htmlFor="reduceAnimations"
                    className="bg-gray-300 absolute block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200"
                  >
                    <span className="inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform duration-200"></span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-900">Screen Reader Optimized</p>
                  <p className="text-sm text-gray-500">Enhance compatibility with screen readers</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input type="checkbox" id="screenReader" className="sr-only" />
                  <label
                    htmlFor="screenReader"
                    className="bg-gray-300 absolute block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200"
                  >
                    <span className="inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform duration-200"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render billing and payments tab
  const renderBillingTab = () => {
    const planOptions = [
      { id: 'free', name: 'Free', price: 0, features: ['Basic dashboard access', 'Limited reports', 'Community support'] },
      { id: 'standard', name: 'Standard', price: 49.99, features: ['Full dashboard access', 'Unlimited reports', 'Priority email support', 'Data export'] },
      { id: 'premium', name: 'Premium', price: 99.99, features: ['Everything in Standard', 'EVA AI assistant', 'Dedicated account manager', 'API access', 'Advanced analytics'] }
    ];

    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Current Plan</h3>
            
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {planOptions.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative rounded-lg border ${
                    currentPlan === plan.id 
                      ? 'border-primary-500 ring-2 ring-primary-500' 
                      : 'border-gray-300'
                  } bg-white p-6 shadow-sm`}
                >
                  {currentPlan === plan.id && (
                    <div className="absolute top-0 right-0 -mt-3 -mr-3">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        Current Plan
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                    <p className="mt-4 text-sm text-gray-500">
                      {plan.price === 0 ? 'Free' : `$${plan.price.toFixed(2)} / month`}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg 
                            className="h-5 w-5 text-green-500" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="ml-2 text-sm text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {currentPlan !== plan.id ? (
                      <button
                        type="button"
                        onClick={() => setCurrentPlan(plan.id)}
                        className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Select Plan
                      </button>
                    ) : (
                      <div className="mt-6 w-full inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md border border-primary-500 text-primary-700">
                        Selected
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {currentPlan !== 'free' && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-md font-medium text-gray-900">Billing Cycle</h4>
                    <p className="text-sm text-gray-500">Choose how often you want to be billed</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        id="monthly"
                        name="billing-cycle"
                        type="radio"
                        checked={billingCycle === 'monthly'}
                        onChange={() => setBillingCycle('monthly')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="monthly" className="ml-2 block text-sm text-gray-700">
                        Monthly
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="yearly"
                        name="billing-cycle"
                        type="radio"
                        checked={billingCycle === 'yearly'}
                        onChange={() => setBillingCycle('yearly')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="yearly" className="ml-2 block text-sm text-gray-700">
                        Yearly <span className="text-green-600">(Save 20%)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleUpdateSubscription}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Update Subscription
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Methods</h3>
              <button
                type="button"
                onClick={() => setShowAddPaymentModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-0.5 mr-2 h-4 w-4" 
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Payment Method
              </button>
            </div>

            {paymentMethods.length > 0 ? (
              <div className="mt-5 divide-y divide-gray-200">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      {method.type === 'credit' ? (
                        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      ) : (
                        <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      )}
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {method.type === 'credit' ? 'Credit Card' : 'Bank Account'} ending in {method.last4}
                        </p>
                        {method.expiry && (
                          <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                        )}
                        {method.isDefault && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                          className="text-sm text-primary-600 hover:text-primary-900"
                        >
                          Set as default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">No payment methods added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Billing History</h3>
            
            {subscriptionHistory.length > 0 ? (
              <div className="mt-5 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {subscriptionHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {item.date.toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Download Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-5 text-center py-8 bg-gray-50 rounded-md">
                <p className="text-gray-500">No billing history available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle payment method operations
  const handleAddPaymentMethod = () => {
    // In a real implementation, this would call a payment processor API
    const newId = `pm-00${paymentMethods.length + 1}`;
    const last4 = newPaymentMethod.cardNumber.slice(-4);
    
    const newMethod = {
      id: newId,
      type: 'credit' as const,
      last4,
      expiry: newPaymentMethod.expiryDate,
      isDefault: newPaymentMethod.setAsDefault
    };
    
    // If setting as default, update other payment methods
    let updatedMethods = [...paymentMethods];
    if (newPaymentMethod.setAsDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: false
      }));
    }
    
    setPaymentMethods([...updatedMethods, newMethod]);
    setShowAddPaymentModal(false);
    
    // Reset form
    setNewPaymentMethod({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      setAsDefault: false
    });
    
    alert('Payment method added successfully');
  };
  
  const handleRemovePaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    
    // If removing default method, set the first available as default
    if (paymentMethods.find(method => method.id === id)?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }
    
    alert('Payment method removed successfully');
  };
  
  const handleSetDefaultPaymentMethod = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentMethods(updatedMethods);
    alert('Default payment method updated');
  };
  
  // Handle subscription updates
  const handleUpdateSubscription = () => {
    alert(`Subscription updated to ${currentPlan} (${billingCycle})`);
    // In a real implementation, this would call a subscription management API
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">Please log in to access your profile settings.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Account Settings</h1>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={classNames(
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                      )}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'profile' && (
                  <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-medium text-gray-900 mb-6">Personal Information</h2>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                              type="text"
                              value={role}
                              disabled
                              className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">Your role cannot be changed</p>
                          </div>
                        </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preferred Language
                  </label>
                  <select
                              value={preferredLanguage}
                              onChange={e => setPreferredLanguage(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                  </select>
                </div>

                        <div className="pt-4 border-t border-gray-200 flex justify-end">
                <button
                              onClick={handleProfileUpdate}
                              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                            >
                              Save Changes
                </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-medium text-gray-900 mb-6">Security Settings</h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Two-Factor Authentication
                          </h3>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-3 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Two-factor authentication is not enabled
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Add an extra layer of security to your account
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Enable
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-3 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                  />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Password last changed 45 days ago
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    It's recommended to change your password regularly
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Change Password
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Login Sessions
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Manage and monitor where you're currently logged in.
                          </p>

                          <div className="bg-gray-50 rounded-md p-4 mb-4">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-green-500"
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
                              <span className="text-sm font-medium text-gray-900">Current Session</span>
                              <span className="ml-auto text-xs text-gray-500">
                                Started 2 hours ago · MacOS · Chrome
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Sign Out All Other Sessions
                            </button>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            API Access
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Manage API keys for programmatic access to your account.
                          </p>

                          <div className="flex justify-end mb-4">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <svg
                                className="-ml-0.5 mr-2 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              Generate New API Key
                            </button>
                          </div>

                          <div className="text-center py-8 bg-gray-50 rounded-md">
                            <p className="text-gray-500">No API keys have been generated yet.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'billing' && renderBillingTab()}
                
                {activeTab === 'accessibility' && renderAccessibilityTab()}
                
                {activeTab === 'notifications' && (
                  <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-medium text-gray-900 mb-6">Notification Preferences</h2>
                      {/* ... notification settings content ... */}
                    </div>
                  </div>
                )}
                
                {activeTab === 'organization' && (
                  <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-xl font-medium text-gray-900 mb-6">Organization Settings</h2>
                      {/* ... organization settings content ... */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileSettings;
