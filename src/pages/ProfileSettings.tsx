/**
 * @component ProfileSettings
 * @description User profile and account management interface
 *
 * @userStories
 * 1. As a platform user, I want to update my profile information so that my contact details and preferences are current.
 * 2. As a team administrator, I want to manage team member access levels so that I can control permissions based on roles.
 * 3. As a security-conscious user, I want to enable two-factor authentication so that my account has enhanced protection.
 * 4. As a user with accessibility needs, I want to customize interface settings so that I can use the platform comfortably.
 *
 * @userJourney Team Administrator Managing Team
 * 1. Trigger: Need to add new team member to organization account
 * 2. Entry Point: Navigates to Profile Settings from account dropdown
 * 3. Tab Selection: Selects "Team Management" tab
 * 4. Current Review: Reviews current team members and their permissions
 * 5. Add Member: Clicks "Add Team Member" button
 * 6. Information Entry: Enters new member's name, email, role
 * 7. Permission Configuration: Sets specific permissions for platform access
 * 8. Invitation: Sends invitation to new team member
 * 9. Confirmation: Receives confirmation that invitation was sent
 * 10. Status Monitoring: Views pending status until member accepts
 * 11. Adjustment: Makes adjustments to permissions as needed after acceptance
 * 12. Notification Settings: Configures notification settings for team activities
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../api/authService';
import AccessibilityControls from '../components/common/AccessibilityControls';
import ThemePreferences from '../components/common/ThemePreferences';
import { useTranslation } from 'react-i18next';
import userService, { TeamMember } from '../api/userService';
import { ApiErrorHandler } from '../utils/apiErrorHandler';
import { useToast } from '../components/common/ToastContainer';
import useProfileForm from '../hooks/useProfileForm';
import useTeamManagement from '../hooks/useTeamManagement';
import PasswordStrengthMeter from '../components/common/PasswordStrengthMeter';

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
  category: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending' | 'prospect';
}

// Helper function for conditional class names
const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

const ProfileSettings: React.FC = () => {
  const { t } = useTranslation();
  const tAny = t as any;
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const { showToast } = useToast();

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isTogglingTwoFactor, setIsTogglingTwoFactor] = useState(false);

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    notificationTypes: {
      transactions: true,
      documents: true,
      messages: true,
      reminders: false,
    },
  });
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Notification requests state
  const [requests, setRequests] = useState<NotificationRequest[]>([]);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    type: 'custom' as const,
    message: '',
    recipientType: 'client' as const,
    recipientInfo: '',
    followUpDate: '',
    setReminder: false,
  });

  // Profile form using custom hook
  const {
    formState: profileForm,
    errors: profileErrors,
    isLoading: isLoadingProfile,
    isSaving: isSavingProfile,
    isDirty: isProfileDirty,
    handleChange: handleProfileChange,
    handleSubmit: handleProfileSubmit,
    resetForm: resetProfileForm,
  } = useProfileForm();

  // Team management using custom hook
  const {
    teamMembers,
    isLoading: isLoadingTeam,
    isSaving: isSavingTeam,
    isRemoving: isRemovingTeam,
    errors: teamErrors,
    formState: teamMemberForm,
    setFormState: setTeamMemberForm,
    resetFormState: resetTeamMemberForm,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
  } = useTeamManagement();

  // Customer state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [customerFormMode, setCustomerFormMode] = useState<'create' | 'edit'>('create');
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  // Current team member for editing
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember | null>(null);
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
  const [teamMemberMode, setTeamMemberMode] = useState<'create' | 'edit'>('create');

  // Handler functions
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof passwordErrors];
        return newErrors;
      });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: typeof passwordErrors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Submit form
    setIsChangingPassword(true);

    userService
      .changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      .then(() => {
        showToast(tAny('profile.passwordUpdated'), 'success');

        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      })
      .catch(error => {
        const formattedError = ApiErrorHandler.formatError(error);

        if (formattedError.status === 401) {
          setPasswordErrors({
            currentPassword: 'Current password is incorrect',
          });
        } else {
          setPasswordErrors({
            general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
          });
        }
      })
      .finally(() => {
        setIsChangingPassword(false);
      });
  };

  const handleToggleTwoFactor = () => {
    setIsTogglingTwoFactor(true);

    userService
      .toggleTwoFactorAuth(!twoFactorEnabled)
      .then(() => {
        setTwoFactorEnabled(!twoFactorEnabled);
        showToast(
          twoFactorEnabled ? tAny('profile.twoFactorDisabled') : tAny('profile.twoFactorEnabled'),
          'success'
        );
      })
      .catch(error => {
        showToast(
          ApiErrorHandler.getUserFriendlyMessage(ApiErrorHandler.formatError(error)),
          'error'
        );
      })
      .finally(() => {
        setIsTogglingTwoFactor(false);
      });
  };

  const handleNotificationToggle = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNotificationTypeToggle = (key: keyof typeof notificationPrefs.notificationTypes) => {
    setNotificationPrefs(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [key]: !prev.notificationTypes[key],
      },
    }));
  };

  const handleSaveNotifications = () => {
    setIsSavingNotifications(true);

    // Mock API call
    setTimeout(() => {
      setIsSavingNotifications(false);
      showToast(tAny('profile.notificationsSaved'), 'success');
    }, 1000);
  };

  const openTeamMemberModal = (member?: TeamMember) => {
    if (member) {
      setTeamMemberForm({
        name: member.name,
        email: member.email,
        role: member.role,
        permissions: { ...member.permissions },
      });
      setCurrentTeamMember(member);
      setTeamMemberMode('edit');
    } else {
      resetTeamMemberForm();
      setCurrentTeamMember(null);
      setTeamMemberMode('create');
    }

    setShowTeamMemberModal(true);
  };

  const handlePermissionToggle = (key: keyof TeamMember['permissions']) => {
    setTeamMemberForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  const handleSaveTeamMember = async () => {
    let success = false;

    if (teamMemberMode === 'create') {
      success = await addTeamMember();
    } else if (currentTeamMember) {
      success = await updateTeamMember(currentTeamMember.id);
    }

    if (success) {
      setShowTeamMemberModal(false);
      showToast(
        teamMemberMode === 'create'
          ? tAny('profile.teamMemberAdded')
          : tAny('profile.teamMemberUpdated'),
        'success'
      );
    }
  };

  const handleRemoveTeamMember = async (id: string) => {
    if (window.confirm(tAny('profile.confirmRemoveMember'))) {
      const success = await removeTeamMember(id);

      if (success) {
        showToast(tAny('profile.teamMemberRemoved'), 'success');
      }
    }
  };

  // Load user data
  useEffect(() => {
    if (user) {
      // Populate profileForm with user data
      Object.entries(user).forEach(([key, value]) => {
        if (key !== 'role') {
          handleProfileChange({
            target: { name: key, value },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      });
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

    // Mock: Load payment methods
    const mockPaymentMethods = [
      {
        id: 'pm-001',
        type: 'credit' as const,
        last4: '4242',
        expiry: '04/25',
        isDefault: true,
      },
      {
        id: 'pm-002',
        type: 'bank' as const,
        last4: '6789',
        isDefault: false,
      },
    ];

    // Mock: Load subscription history
    const mockSubscriptionHistory = [
      {
        id: 'sub-001',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        amount: 49.99,
        status: 'paid' as const,
        description: 'EVA Premium Monthly Subscription',
      },
      {
        id: 'sub-002',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
        amount: 49.99,
        status: 'paid' as const,
        description: 'EVA Premium Monthly Subscription',
      },
    ];

    // Mock: Load customers
    const mockCustomers: Customer[] = [
      {
        id: 'cust-001',
        name: 'Atlas Systems, Inc.',
        category: 'business',
        contactPerson: 'Sarah Thompson',
        contactEmail: 'info@atlassystems.com',
        contactPhone: '(510) 555-3456',
        status: 'active',
      },
      {
        id: 'cust-002',
        name: 'Robert Johnson',
        category: 'individual',
        contactPerson: 'James Wilson',
        contactEmail: 'robert@johnson.com',
        contactPhone: '(415) 555-7890',
        status: 'prospect',
      },
    ];

    setCustomers(mockCustomers);
  }, [user, handleProfileChange]);

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
      type: 'custom',
      message: 'New custom request',
      recipientType: 'client',
      createdAt: new Date(),
      status: 'pending',
    };

    // Mock: Add new request to the list
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
          {tAny('profile.personalInfo')}
        </h2>

        {profileErrors.general && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
            {profileErrors.general}
          </div>
        )}

        {isLoadingProfile ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.name')}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  profileErrors.name
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={profileErrors.name ? 'true' : 'false'}
                aria-describedby={profileErrors.name ? 'name-error' : undefined}
              />
              {profileErrors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {profileErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  profileErrors.email
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={profileErrors.email ? 'true' : 'false'}
                aria-describedby={profileErrors.email ? 'email-error' : undefined}
              />
              {profileErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {profileErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.phone')}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  profileErrors.phone
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={profileErrors.phone ? 'true' : 'false'}
                aria-describedby={profileErrors.phone ? 'phone-error' : undefined}
              />
              {profileErrors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {profileErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="preferredLanguage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.language')}
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={profileForm.preferredLanguage}
                onChange={handleProfileChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en">{tAny('languages.english')}</option>
                <option value="es">{tAny('languages.spanish')}</option>
                <option value="fr">{tAny('languages.french')}</option>
                <option value="de">{tAny('languages.german')}</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetProfileForm}
                disabled={!isProfileDirty || isSavingProfile}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {tAny('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={!isProfileDirty || isSavingProfile}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 disabled:opacity-50 inline-flex items-center"
              >
                {isSavingProfile && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {tAny('common.save')}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  // Render account tab content
  const renderAccountTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {tAny('profile.accountSettings')}
        </h2>

        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              {tAny('profile.accountType')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {tAny('profile.currentPlan')}
            </p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              {tAny('profile.dataExport')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {tAny('profile.dataExportDesc')}
            </p>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {tAny('profile.exportData')}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-3">
              {tAny('profile.dangerZone')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {tAny(
                'profile.dangerZoneDesc',
                'Once you delete your account, there is no going back. Please be certain.'
              )}
            </p>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {tAny('profile.deleteAccount')}
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
          {tAny('profile.security')}
        </h2>

        {/* Password Change Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            {tAny('profile.changePassword')}
          </h3>

          {passwordErrors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
              {passwordErrors.general}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg" noValidate>
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.currentPassword')}
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  passwordErrors.currentPassword
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={passwordErrors.currentPassword ? 'true' : 'false'}
                aria-describedby={
                  passwordErrors.currentPassword ? 'current-password-error' : undefined
                }
              />
              {passwordErrors.currentPassword && (
                <p
                  id="current-password-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.newPassword')}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  passwordErrors.newPassword
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={passwordErrors.newPassword ? 'true' : 'false'}
                aria-describedby={passwordErrors.newPassword ? 'new-password-error' : undefined}
              />
              {passwordErrors.newPassword && (
                <p id="new-password-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {passwordErrors.newPassword}
                </p>
              )}

              {/* Password strength meter */}
              {passwordForm.newPassword && (
                <PasswordStrengthMeter password={passwordForm.newPassword} className="mt-3" />
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  passwordErrors.confirmPassword
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={passwordErrors.confirmPassword ? 'true' : 'false'}
                aria-describedby={
                  passwordErrors.confirmPassword ? 'confirm-password-error' : undefined
                }
              />
              {passwordErrors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 disabled:opacity-50 inline-flex items-center justify-center"
              >
                {isChangingPassword && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {tAny('profile.updatePassword')}
              </button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            {tAny('profile.twoFactorAuth')}
          </h3>

          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {tAny(
              'profile.twoFactorDescription',
              'Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.'
            )}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {twoFactorEnabled
                  ? tAny('profile.twoFactorEnabled')
                  : tAny('profile.twoFactorDisabled')}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleTwoFactor}
              disabled={isTogglingTwoFactor}
              className={`px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                twoFactorEnabled
                  ? 'text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50'
                  : 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50'
              } disabled:opacity-50 inline-flex items-center`}
            >
              {isTogglingTwoFactor && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {twoFactorEnabled ? tAny('profile.disable') : tAny('profile.enable')}
            </button>
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
          {tAny('profile.notifications')}
        </h2>

        <div className="space-y-6">
          {/* Channel Preferences */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {tAny('profile.notificationChannels')}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                />
                <label
                  htmlFor="emailNotifications"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.emailNotifications')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="smsNotifications"
                  name="smsNotifications"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.smsNotifications}
                  onChange={() => handleNotificationToggle('smsNotifications')}
                />
                <label
                  htmlFor="smsNotifications"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.smsNotifications')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="inAppNotifications"
                  name="inAppNotifications"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.inAppNotifications}
                  onChange={() => handleNotificationToggle('inAppNotifications')}
                />
                <label
                  htmlFor="inAppNotifications"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.inAppNotifications')}
                </label>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              {tAny('profile.notificationTypes')}
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center">
                <input
                  id="transactions"
                  name="transactions"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.notificationTypes.transactions}
                  onChange={() => handleNotificationTypeToggle('transactions')}
                />
                <label
                  htmlFor="transactions"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.transactions')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="documents"
                  name="documents"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.notificationTypes.documents}
                  onChange={() => handleNotificationTypeToggle('documents')}
                />
                <label
                  htmlFor="documents"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.documents')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="messages"
                  name="messages"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.notificationTypes.messages}
                  onChange={() => handleNotificationTypeToggle('messages')}
                />
                <label
                  htmlFor="messages"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.messages')}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="reminders"
                  name="reminders"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                  checked={notificationPrefs.notificationTypes.reminders}
                  onChange={() => handleNotificationTypeToggle('reminders')}
                />
                <label
                  htmlFor="reminders"
                  className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {tAny('profile.reminders')}
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotifications}
              disabled={isSavingNotifications}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 disabled:opacity-50 inline-flex items-center"
            >
              {isSavingNotifications && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {tAny('common.save')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render accessibility tab content
  const renderAccessibilityTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          {tAny('profile.accessibility')}
        </h2>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          {tAny(
            'profile.accessibilityDescription',
            'Adjust these settings to make the application more accessible based on your needs.'
          )}
        </p>

        <AccessibilityControls className="mb-6" />

        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-8 mb-3">
          {tAny('profile.additionalAccessibility')}
        </h3>

        {/* Additional accessibility options can be added here */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="highContrast"
              name="highContrast"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label
              htmlFor="highContrast"
              className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('profile.highContrast')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="reducedMotion"
              name="reducedMotion"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label
              htmlFor="reducedMotion"
              className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('profile.reducedMotion')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="largerText"
              name="largerText"
              type="checkbox"
              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label
              htmlFor="largerText"
              className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('profile.largerText')}
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Render team management tab content
  const renderTeamManagementTab = () => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">
            {tAny('profile.teamManagement')}
          </h2>

          <button
            type="button"
            onClick={() => openTeamMemberModal()}
            className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 inline-flex items-center"
          >
            <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            {tAny('profile.addTeamMember')}
          </button>
        </div>

        {teamErrors.general && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
            {teamErrors.general}
          </div>
        )}

        {isLoadingTeam ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-2">
              {tAny(
                'profile.noTeamMembers',
                'No team members found. Add your first team member to get started.'
              )}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {tAny('profile.name')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {tAny('profile.email')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {tAny('profile.role')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {tAny('profile.status')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {tAny('profile.lastActive')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {tAny('profile.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {teamMembers.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {member.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className="capitalize">{member.role}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                            : member.status === 'invited'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {member.lastActive
                        ? new Date(member.lastActive).toLocaleDateString()
                        : tAny('profile.never')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openTeamMemberModal(member)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                      >
                        {tAny('common.edit')}
                      </button>
                      <button
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {tAny('common.remove')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Team member modal component
  const TeamMemberModal = () => {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {teamMemberMode === 'create'
                ? tAny('profile.addTeamMember')
                : tAny('profile.editTeamMember')}
            </h3>
            <button
              type="button"
              onClick={() => setShowTeamMemberModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <span className="sr-only">{tAny('common.close')}</span>
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

          {teamErrors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
              {teamErrors.general}
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.name')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={teamMemberForm.name}
                onChange={e => setTeamMemberForm(prev => ({ ...prev, name: e.target.value }))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  teamErrors.name
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={teamErrors.name ? 'true' : 'false'}
                aria-describedby={teamErrors.name ? 'name-error' : undefined}
              />
              {teamErrors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {teamErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.email')} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={teamMemberForm.email}
                onChange={e => setTeamMemberForm(prev => ({ ...prev, email: e.target.value }))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  teamErrors.email
                    ? 'border-red-300 dark:border-red-700'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-invalid={teamErrors.email ? 'true' : 'false'}
                aria-describedby={teamErrors.email ? 'email-error' : undefined}
              />
              {teamErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {teamErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {tAny('profile.role')} *
              </label>
              <select
                id="role"
                name="role"
                value={teamMemberForm.role}
                onChange={e =>
                  setTeamMemberForm(prev => ({
                    ...prev,
                    role: e.target.value as TeamMember['role'],
                  }))
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="admin">{tAny('profile.roles.admin')}</option>
                <option value="manager">{tAny('profile.roles.manager')}</option>
                <option value="user">{tAny('profile.roles.user')}</option>
                <option value="viewer">{tAny('profile.roles.viewer')}</option>
              </select>
              {teamErrors.role && (
                <p id="role-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {teamErrors.role}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {tAny('profile.permissions')}
              </h4>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="canManageUsers"
                    name="canManageUsers"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={teamMemberForm.permissions.canManageUsers}
                    onChange={() => handlePermissionToggle('canManageUsers')}
                  />
                  <label
                    htmlFor="canManageUsers"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tAny('profile.permissions.manageUsers')}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="canViewDocuments"
                    name="canViewDocuments"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={teamMemberForm.permissions.canViewDocuments}
                    onChange={() => handlePermissionToggle('canViewDocuments')}
                  />
                  <label
                    htmlFor="canViewDocuments"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tAny('profile.permissions.viewDocuments')}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="canEditDocuments"
                    name="canEditDocuments"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={teamMemberForm.permissions.canEditDocuments}
                    onChange={() => handlePermissionToggle('canEditDocuments')}
                  />
                  <label
                    htmlFor="canEditDocuments"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tAny('profile.permissions.editDocuments')}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="canApproveDeals"
                    name="canApproveDeals"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={teamMemberForm.permissions.canApproveDeals}
                    onChange={() => handlePermissionToggle('canApproveDeals')}
                  />
                  <label
                    htmlFor="canApproveDeals"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tAny('profile.permissions.approveDeals')}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="canManageSettings"
                    name="canManageSettings"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                    checked={teamMemberForm.permissions.canManageSettings}
                    onChange={() => handlePermissionToggle('canManageSettings')}
                  />
                  <label
                    htmlFor="canManageSettings"
                    className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {tAny('profile.permissions.manageSettings')}
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTeamMemberModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
              >
                {tAny('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSaveTeamMember}
                disabled={isSavingTeam}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 disabled:opacity-50 inline-flex items-center"
              >
                {isSavingTeam && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {tAny('common.save')}
              </button>
            </div>
          </form>
        </div>
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
    <div className="container py-8 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        {tAny('profile.settings')}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <nav className="flex flex-col">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="p-4">
                  <h2 className="text-base font-medium text-gray-800 dark:text-white">
                    {tAny('profile.settingsMenu')}
                  </h2>
                </div>
              </div>
              <ul className="py-2">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                      activeTab === 'profile'
                        ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {tAny('profile.personalInfo')}
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
                    {tAny('profile.security')}
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
                    {tAny('profile.notifications')}
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
                    {tAny('profile.accessibility')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('team-management')}
                    className={`w-full px-4 py-4 flex items-center text-sm font-medium ${
                      activeTab === 'team-management'
                        ? 'text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-gray-700'
                        : 'text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {tAny('profile.teamManagement')}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'accessibility' && renderAccessibilityTab()}
          {activeTab === 'team-management' && renderTeamManagementTab()}
        </div>
      </div>

      {/* Team member modal */}
      {showTeamMemberModal && <TeamMemberModal />}
    </div>
  );
};

export default ProfileSettings;
