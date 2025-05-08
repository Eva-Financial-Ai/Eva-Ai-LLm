import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';

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

const ProfileSettings: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'requests' | 'organizations' | 'customers'>('profile');
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  
  // Notification types to receive
  const [notificationTypes, setNotificationTypes] = useState({
    transactions: true,
    documents: true,
    messages: true,
    reminders: true
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
    setReminder: false
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
        status: 'sent'
      },
      {
        id: 'req-002',
        type: 'reminder',
        message: 'Follow up on equipment invoice',
        recipientType: 'internal',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: 'pending'
      }
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
            phone: '(415) 555-5678'
          },
          {
            id: 'owner-002',
            name: 'Venture Partners LLC',
            type: 'business',
            ownershipPercentage: 49,
            email: 'partners@venturepartners.com',
            phone: '(415) 555-9012'
          }
        ]
      }
    ];
    
    setOrganizations(mockOrganizations);
    
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
        lastContactDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
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
        lastContactDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
      }
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
      followUpDate: newRequest.setReminder && newRequest.followUpDate 
        ? new Date(newRequest.followUpDate) 
        : undefined,
      status: 'pending'
    };
    
    setRequests([...requests, newRequestObj]);
    
    // Reset form and close modal
    setNewRequest({
      type: 'custom',
      message: '',
      recipientType: 'client',
      recipientInfo: '',
      followUpDate: '',
      setReminder: false
    });
    
    setRequestModalOpen(false);
    
    // Show confirmation message
    alert('Request created. Notifications will be sent according to your settings.');
  };
  
  // Delete a request
  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-64 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-lg">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{name}</h2>
                <p className="text-sm text-gray-500">{role}</p>
              </div>
            </div>
          </div>
          
          <nav className="p-3">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                Personal Information
              </button>
              
              <button
                onClick={() => setActiveTab('organizations')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'organizations'
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
                Organizations
              </button>
              
              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'customers'
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                Customers
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                Notification Preferences
              </button>
              
              <button
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                  activeTab === 'requests'
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                  />
                </svg>
                Requests & Follow-ups
              </button>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 bg-white shadow rounded-lg overflow-hidden">
          {/* Profile tab */}
          {activeTab === 'profile' && (
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
                      onChange={(e) => setName(e.target.value)}
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
                      onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
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
                    onChange={(e) => setPreferredLanguage(e.target.value)}
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
          )}
          
          {/* Organizations tab */}
          {activeTab === 'organizations' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Organizations</h2>
                <button
                  onClick={() => {
                    setCurrentOrganization(null);
                    setOrgFormMode('create');
                    setShowOrganizationModal(true);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
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
                  Add Organization
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Manage your business organizations here. You can add multiple businesses and switch between them when using the platform.
                    </p>
                  </div>
                </div>
              </div>
              
              {organizations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No organizations added yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your first organization to start managing your business portfolio.</p>
                  <button
                    onClick={() => {
                      setCurrentOrganization(null);
                      setOrgFormMode('create');
                      setShowOrganizationModal(true);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
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
                    Add Organization
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {organizations.map((org) => (
                    <div key={org.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex justify-between items-start p-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center">
                          <div className="bg-primary-100 rounded-full p-2 mr-3">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-6 w-6 text-primary-600" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                            <p className="text-sm text-gray-500">{org.legalName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {org.isDefault && (
                            <span className="mr-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Default
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setCurrentOrganization(org);
                              setOrgFormMode('edit');
                              setShowOrganizationModal(true);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">EIN</p>
                            <p className="font-medium">{org.ein}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium">{org.type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{org.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{org.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{org.address}, {org.city}, {org.state} {org.zipCode}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Industry</p>
                            <p className="font-medium">{org.industry}</p>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Ownership Structure</h4>
                          <div className="space-y-2">
                            {org.owners.map((owner) => (
                              <div key={owner.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <div>
                                  <p className="font-medium">{owner.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {owner.type.charAt(0).toUpperCase() + owner.type.slice(1)}
                                    {owner.title && ` • ${owner.title}`}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">{owner.ownershipPercentage}%</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                          {!org.isDefault && (
                            <button
                              onClick={() => {
                                // Set org as default
                                setOrganizations(
                                  organizations.map((o) => ({
                                    ...o,
                                    isDefault: o.id === org.id
                                  }))
                                );
                              }}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Set as Default
                            </button>
                          )}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                // Toggle active status
                                setOrganizations(
                                  organizations.map((o) =>
                                    o.id === org.id ? { ...o, isActive: !o.isActive } : o
                                  )
                                );
                              }}
                              className={`text-sm ${
                                org.isActive 
                                  ? 'text-red-600 hover:text-red-700' 
                                  : 'text-green-600 hover:text-green-700'
                              } font-medium`}
                            >
                              {org.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this organization?')) {
                                  setOrganizations(organizations.filter((o) => o.id !== org.id));
                                }
                              }}
                              className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Customers tab */}
          {activeTab === 'customers' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Customers</h2>
                <button
                  onClick={() => {
                    setCurrentCustomer(null);
                    setCustomerFormMode('create');
                    setShowCustomerModal(true);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
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
                  Add Customer
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Manage your customers and prospects here. You can track contact information, notes, and status updates.
                    </p>
                  </div>
                </div>
              </div>
              
              {customers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No customers added yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your first customer to start managing your relationships.</p>
                  <button
                    onClick={() => {
                      setCurrentCustomer(null);
                      setCustomerFormMode('create');
                      setShowCustomerModal(true);
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 mr-2" 
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
                    Add Customer
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <select
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Types</option>
                      <option value="business">Business</option>
                      <option value="individual">Individual</option>
                    </select>
                    
                    <select
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="prospect">Prospect</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                    
                    <div className="flex-grow md:ml-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search customers..."
                          className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-4 w-4 text-gray-400" 
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
                      </div>
                    </div>
                  </div>
                  
                  {/* Customer list */}
                  <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Contact
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
                            Last Contact
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {customers.map((customer) => (
                          <tr key={customer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-800">
                                  {customer.type === 'business' ? (
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className="h-5 w-5" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                                      />
                                    </svg>
                                  ) : (
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className="h-5 w-5" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                                      />
                                    </svg>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {customer.assignedTo && `Assigned to: ${customer.assignedTo}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.email}</div>
                              <div className="text-sm text-gray-500">{customer.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  customer.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : customer.status === 'prospect'
                                      ? 'bg-blue-100 text-blue-800'
                                      : customer.status === 'inactive'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }
                              `}>
                                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {customer.lastContactDate 
                                ? new Date(customer.lastContactDate).toLocaleDateString() 
                                : 'Never'
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => {
                                  setCurrentCustomer(customer);
                                  setCustomerFormMode('edit');
                                  setShowCustomerModal(true);
                                }}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Notifications tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Channels</h3>
                  
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                          <p className="text-xs text-gray-500">Receive notifications via email</p>
                        </div>
                      </div>
                      
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="emailToggle" 
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="emailToggle"
                          className={`${
                            emailNotifications ? 'bg-primary-600' : 'bg-gray-300'
                          } absolute block w-10 h-5 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              emailNotifications ? 'translate-x-5' : 'translate-x-0'
                            } inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
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
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                          <p className="text-xs text-gray-500">Receive notifications via text message</p>
                        </div>
                      </div>
                      
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="smsToggle" 
                          checked={smsNotifications}
                          onChange={() => setSmsNotifications(!smsNotifications)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="smsToggle"
                          className={`${
                            smsNotifications ? 'bg-primary-600' : 'bg-gray-300'
                          } absolute block w-10 h-5 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              smsNotifications ? 'translate-x-5' : 'translate-x-0'
                            } inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
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
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">In-App Notifications</p>
                          <p className="text-xs text-gray-500">Receive notifications within the application</p>
                        </div>
                      </div>
                      
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          id="inAppToggle" 
                          checked={inAppNotifications}
                          onChange={() => setInAppNotifications(!inAppNotifications)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="inAppToggle"
                          className={`${
                            inAppNotifications ? 'bg-primary-600' : 'bg-gray-300'
                          } absolute block w-10 h-5 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              inAppNotifications ? 'translate-x-5' : 'translate-x-0'
                            } inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="transactionsToggle" 
                        checked={notificationTypes.transactions}
                        onChange={() => setNotificationTypes({
                          ...notificationTypes,
                          transactions: !notificationTypes.transactions
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="transactionsToggle" className="ml-3 text-sm font-medium text-gray-700">
                        Transaction updates
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="documentsToggle" 
                        checked={notificationTypes.documents}
                        onChange={() => setNotificationTypes({
                          ...notificationTypes,
                          documents: !notificationTypes.documents
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="documentsToggle" className="ml-3 text-sm font-medium text-gray-700">
                        Document uploads and reviews
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="messagesToggle" 
                        checked={notificationTypes.messages}
                        onChange={() => setNotificationTypes({
                          ...notificationTypes,
                          messages: !notificationTypes.messages
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="messagesToggle" className="ml-3 text-sm font-medium text-gray-700">
                        Messages and communication
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remindersToggle" 
                        checked={notificationTypes.reminders}
                        onChange={() => setNotificationTypes({
                          ...notificationTypes,
                          reminders: !notificationTypes.reminders
                        })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remindersToggle" className="ml-3 text-sm font-medium text-gray-700">
                        Reminders and follow-ups
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleNotificationUpdate}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Requests tab */}
          {activeTab === 'requests' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Requests & Follow-ups</h2>
                
                <button
                  onClick={() => setRequestModalOpen(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
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
                  New Request
                </button>
              </div>
              
              <div className="space-y-6">
                {requests.length === 0 ? (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No requests</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Create a new request to get started
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {requests.map((request) => (
                        <li key={request.id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {request.type === 'document' && (
                                  <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                )}
                                
                                {request.type === 'reminder' && (
                                  <div className="p-2 bg-yellow-100 text-yellow-600 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                )}
                                
                                {request.type === 'approval' && (
                                  <div className="p-2 bg-green-100 text-green-600 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                )}
                                
                                {request.type === 'custom' && (
                                  <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                  </div>
                                )}
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {request.message}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    To: {request.recipientType.charAt(0).toUpperCase() + request.recipientType.slice(1)}
                                    {request.recipientInfo && ` (${request.recipientInfo})`}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  request.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </span>
                                
                                <button
                                  onClick={() => handleDeleteRequest(request.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex justify-between">
                              <div className="text-xs text-gray-500">
                                Created: {request.createdAt.toLocaleDateString()}
                              </div>
                              
                              {request.followUpDate && (
                                <div className="text-xs text-primary-600 font-medium">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Follow-up: {request.followUpDate.toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Organization Modal */}
      {showOrganizationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowOrganizationModal(false)}
            ></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {orgFormMode === 'create' ? 'Add Organization' : 'Edit Organization'}
                    </h3>
                    
                    <div className="mt-4">
                      <div className="space-y-4">
                        {/* Organization details form would go here */}
                        <p className="text-sm text-gray-500">
                          Fill out the details of your organization. This information will be used for legal and financial purposes.
                        </p>
                        
                        {/* Form fields would go here */}
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Organization Name
                            </label>
                            <input 
                              type="text" 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="e.g., Acme Technologies"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Legal Business Name
                            </label>
                            <input 
                              type="text" 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="e.g., Acme Technologies, LLC"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Organization Type
                            </label>
                            <select 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="llc">LLC</option>
                              <option value="corporation">Corporation</option>
                              <option value="partnership">Partnership</option>
                              <option value="soleProprietorship">Sole Proprietorship</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              EIN (Tax ID)
                            </label>
                            <input 
                              type="text" 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="XX-XXXXXXX"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {orgFormMode === 'create' ? 'Create Organization' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowOrganizationModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* New Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Create New Request</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Type
                </label>
                <select
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({
                    ...newRequest,
                    type: e.target.value as NotificationRequest['type']
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="custom">Custom Message</option>
                  <option value="document">Document Request</option>
                  <option value="approval">Approval Request</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newRequest.message}
                  onChange={(e) => setNewRequest({
                    ...newRequest,
                    message: e.target.value
                  })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Enter your request message..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Type
                </label>
                <select
                  value={newRequest.recipientType}
                  onChange={(e) => setNewRequest({
                    ...newRequest,
                    recipientType: e.target.value as NotificationRequest['recipientType']
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="client">Client</option>
                  <option value="internal">Internal Team</option>
                  <option value="vendor">Vendor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Info (Optional)
                </label>
                <input
                  type="text"
                  value={newRequest.recipientInfo}
                  onChange={(e) => setNewRequest({
                    ...newRequest,
                    recipientInfo: e.target.value
                  })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Name, ID, or other identifier"
                />
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  id="setReminder"
                  type="checkbox"
                  checked={newRequest.setReminder}
                  onChange={() => setNewRequest({
                    ...newRequest,
                    setReminder: !newRequest.setReminder
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="setReminder" className="ml-2 block text-sm text-gray-900">
                  Set follow-up reminder
                </label>
              </div>
              
              {newRequest.setReminder && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={newRequest.followUpDate}
                    onChange={(e) => setNewRequest({
                      ...newRequest,
                      followUpDate: e.target.value
                    })}
                    min={new Date().toISOString().split('T')[0]} // Set min to today
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={!newRequest.message.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  !newRequest.message.trim() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowCustomerModal(false)}
            ></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {customerFormMode === 'create' ? 'Add Customer' : 'Edit Customer'}
                    </h3>
                    
                    <div className="mt-4">
                      <div className="space-y-4">
                        {/* Customer details form would go here */}
                        <p className="text-sm text-gray-500">
                          Enter customer information to keep track of your business relationships.
                        </p>
                        
                        {/* Form fields would go here */}
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Customer Name
                            </label>
                            <input 
                              type="text" 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="e.g., Atlas Systems, Inc. or John Smith"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Customer Type
                            </label>
                            <div className="flex space-x-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  className="form-radio h-4 w-4 text-primary-600"
                                  name="customerType"
                                  value="business"
                                />
                                <span className="ml-2 text-sm text-gray-700">Business</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  className="form-radio h-4 w-4 text-primary-600"
                                  name="customerType"
                                  value="individual"
                                />
                                <span className="ml-2 text-sm text-gray-700">Individual</span>
                              </label>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input 
                              type="email" 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="customer@example.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <input 
                              type="tel" 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              placeholder="(XXX) XXX-XXXX"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="active">Active</option>
                              <option value="prospect">Prospect</option>
                              <option value="inactive">Inactive</option>
                              <option value="archived">Archived</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <textarea 
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                              rows={3}
                              placeholder="Add any notes about this customer..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {customerFormMode === 'create' ? 'Add Customer' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCustomerModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings; 