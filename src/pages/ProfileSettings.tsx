import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';
import AccessibilityControls from '../components/common/AccessibilityControls';
import ThemePreferences from '../components/common/ThemePreferences';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

  // Render profile tab content
  const renderProfileTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {t('profile.personalInfo', 'Personal Information')}
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.fullName', 'Full Name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.emailAddress', 'Email Address')}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.phoneNumber', 'Phone Number')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.role', 'Role')}
              </label>
              <input
                type="text"
                value={role}
                disabled
                className="w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-600 dark:border-gray-700 dark:text-gray-300 shadow-sm"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('profile.roleNote', 'Your role cannot be changed')}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.preferredLanguage', 'Preferred Language')}
            </label>
            <select
              value={preferredLanguage}
              onChange={e => setPreferredLanguage(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={() => {
                // Handle profile update
                console.log('Profile updated');
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('profile.saveChanges', 'Save Changes')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render account tab content
  const renderAccountTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {t('profile.accountSettings', 'Account Settings')}
        </h2>
        
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              {t('profile.accountType', 'Account Type')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('profile.currentPlan', 'You are currently on the Enterprise plan')}
            </p>
          </div>
          
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              {t('profile.dataExport', 'Data Export')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('profile.dataExportDesc', 'Download a copy of your data from the EVA platform.')}
            </p>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('profile.exportData', 'Export Data')}
            </button>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-3">
              {t('profile.dangerZone', 'Danger Zone')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('profile.dangerZoneDesc', 'Once you delete your account, there is no going back. Please be certain.')}
            </p>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('profile.deleteAccount', 'Delete Account')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render security tab content
  const renderSecurityTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {t('profile.securitySettings', 'Security Settings')}
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {t('profile.twoFactor', 'Two-Factor Authentication')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400"
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
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {t('profile.twoFactorDisabled', 'Two-factor authentication is not enabled')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('profile.twoFactorDesc', 'Add an extra layer of security to your account')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('profile.enable', 'Enable')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {t('profile.changePassword', 'Change Password')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.currentPassword', 'Current Password')}
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.newPassword', 'New Password')}
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('profile.confirmNewPassword', 'Confirm New Password')}
                </label>
                <input
                  type="password"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {t('profile.updatePassword', 'Update Password')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render notifications tab content
  const renderNotificationsTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {t('profile.notificationPreferences', 'Notification Preferences')}
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {t('profile.emailNotifications', 'Email Notifications')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                    {t('profile.emailUpdates', 'Email Updates')}
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('profile.emailUpdatesDesc', 'Get notified when a transaction status changes or requires your attention.')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketing-emails"
                    name="marketing-emails"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketing-emails" className="font-medium text-gray-700 dark:text-gray-300">
                    {t('profile.marketingEmails', 'Marketing Emails')}
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('profile.marketingEmailsDesc', 'Receive emails about new features, product updates, and industry news.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {t('profile.pushNotifications', 'Push Notifications')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="browser-notifications"
                    name="browser-notifications"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="browser-notifications" className="font-medium text-gray-700 dark:text-gray-300">
                    {t('profile.browserNotifications', 'Browser Notifications')}
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('profile.browserNotificationsDesc', 'Allow browser notifications for important updates while you\'re using the application.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {t('profile.savePreferences', 'Save Preferences')}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Add new Appearance tab content
  const renderAppearanceTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">{t('profile.appearance', 'Appearance')}</h2>
        
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {t('profile.appearanceDescription', 'Customize the look and feel of the application.')}
        </p>
        
        <ThemePreferences className="mb-6" />
      </div>
    );
  };
  
  // Render accessibility tab content
  const renderAccessibilityTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">{t('profile.accessibility', 'Accessibility Settings')}</h2>
        
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {t('profile.accessibilityDescription', 'Adjust these settings to make the application more accessible based on your needs.')}
        </p>
        
        <AccessibilityControls className="mb-6" />
        
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-8 mb-3">
          {t('profile.additionalAccessibility', 'Additional Accessibility Options')}
        </h3>
        
        {/* Additional accessibility options can be added here */}
      </div>
    );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            {t('profile.settings', 'Profile Settings')}
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t('profile.profile', 'Profile')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                    activeTab === 'account'
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t('profile.account', 'Account')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('appearance')}
                  className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                    activeTab === 'appearance'
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t('profile.appearance', 'Appearance')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                    activeTab === 'security'
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t('profile.security', 'Security')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                    activeTab === 'notifications'
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t('profile.notifications', 'Notifications')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('accessibility')}
                  className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                    activeTab === 'accessibility'
                      ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                  }`}
                >
                  {t('profile.accessibility', 'Accessibility')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'account' && renderAccountTab()}
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'accessibility' && renderAccessibilityTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
