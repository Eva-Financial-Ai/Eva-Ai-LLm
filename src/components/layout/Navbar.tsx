import React, { Fragment, useState, useContext, useEffect, memo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { UserContext, AppUserRole } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
// Import icons using the standard pattern which is compatible with Jest
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LanguageSelector from '../common/LanguageSelector';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

// Import icons for AI Tools dropdown
const SmartMatchingIcon = memo(() => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
));

const DataOrchestratorIcon = memo(() => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    />
  </svg>
));

const DocumentVerificationIcon = memo(() => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
));

const CreditAnalysisIcon = memo(() => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
));

const LifecycleAssistantIcon = memo(() => (
  <svg
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
));

// Notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Match',
    message: 'You have a new match with Capital Express Funding',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
  },
  {
    id: 'notif-2',
    title: 'Document Uploaded',
    message: 'Financial statement successfully uploaded',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: 'notif-3',
    title: 'Risk Assessment',
    message: 'Risk assessment for TX-101 is now complete',
    type: 'info',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-md">
      <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p className="text-sm text-red-700 mt-2">{error.message}</p>
    </div>
  );
}

const Navbar = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentTransaction } = useWorkflow();
  const {
    theme,
    setTheme,
    setShowSmartMatching,
    setShowDataOrchestrator,
    setShowDocVerification,
    setShowCreditAnalysis,
    sidebarCollapsed,
    setSidebarCollapsed,
    userRole,
    setPQCAuthenticated,
    showAILifecycleAssistant,
    setShowAILifecycleAssistant,
    setUserRole,
  } = useContext(UserContext);
  const { user, logout } = useAuth();

  // State for notifications
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);

  // State for user menu
  const [showUserMenu, setShowUserMenu] = useState(false);

  // State for mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const toggleDarkMode = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Store the theme preference in localStorage for persistence
    localStorage.setItem('theme', newTheme);

    // Apply the theme immediately to the document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, setTheme]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
    localStorage.setItem('sidebarCollapsed', (!sidebarCollapsed).toString());
  }, [sidebarCollapsed, setSidebarCollapsed]);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  // Calculate this value once and reuse it
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const toggleNotificationsMenu = useCallback(() => {
    setShowNotifications(prev => !prev);
    if (showUserMenu) setShowUserMenu(false);
    if (showMobileMenu) setShowMobileMenu(false);
  }, [showUserMenu, showMobileMenu]);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
    if (showNotifications) setShowNotifications(false);
    if (showMobileMenu) setShowMobileMenu(false);
  }, [showNotifications, showMobileMenu]);

  const toggleMobileMenu = useCallback(() => {
    setShowMobileMenu(prev => !prev);
    if (showNotifications) setShowNotifications(false);
    if (showUserMenu) setShowUserMenu(false);
  }, [showNotifications, showUserMenu]);

  const navigateToProfileSettings = useCallback(() => {
    setShowUserMenu(false);
    navigate('/profile-settings');
  }, [navigate]);

  const openSmartMatching = useCallback(() => {
    setShowSmartMatching(true);
    if (showMobileMenu) setShowMobileMenu(false);
  }, [showMobileMenu, setShowSmartMatching]);

  const openDataOrchestrator = useCallback(() => {
    setShowDataOrchestrator(true);
    if (showMobileMenu) setShowMobileMenu(false);
  }, [showMobileMenu, setShowDataOrchestrator]);

  const openDocVerification = useCallback(() => {
    setShowDocVerification(true);
    if (showMobileMenu) setShowMobileMenu(false);
  }, [showMobileMenu, setShowDocVerification]);

  const openCreditAnalysis = useCallback(() => {
    setShowCreditAnalysis(true);
    if (showMobileMenu) setShowMobileMenu(false);
  }, [showMobileMenu, setShowCreditAnalysis]);

  // Function to get notification type styles
  const getNotificationTypeStyles = useCallback((type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      case 'error':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';
      default:
        return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
    }
  }, []);

  // Function to format relative time
  const formatRelativeTime = useCallback((date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }, []);

  const roleOptions: Array<'broker' | 'lender' | 'borrower'> = ['broker', 'lender', 'borrower'];

  const handleRoleChange = useCallback(
    (role: AppUserRole) => {
      setUserRole(role);
      // Store the role in localStorage for persistence
      localStorage.setItem('userRole', role);
      // Refresh the page to ensure all components reflect the new role
      window.location.reload();
    },
    [setUserRole]
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Disclosure as="nav" className="bg-white border-b border-light-border sticky top-0 z-10">
        {({ open }: { open: boolean }) => (
          <>
            <div className="mx-auto max-w-full px-2 sm:px-3 lg:px-4">
              <div className="relative flex h-14 items-center justify-between">
                {/* Mobile menu button & Sidebar toggle */}
                <div className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md p-1.5 text-light-text-secondary hover:bg-light-bg-alt hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={toggleSidebar}
                  >
                    <span className="sr-only">Toggle sidebar</span>
                    {sidebarCollapsed ? (
                      <Bars3Icon className="block h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                  <img
                    src="/eva-logo.svg"
                    alt="EVAFIN"
                    className="h-5 w-auto ml-2 hidden sm:block"
                  />
                  <div className="ml-2.5 text-sm font-medium text-light-text hidden md:block">
                    EVA AI{' '}
                    <span className="font-light text-light-text-secondary">
                      Agentic Broker System
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  {/* Logo area (can be added back if needed) */}
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Language Selector */}
                  <LanguageSelector className="mr-3" />

                  {/* AI Tools Dropdown */}
                  <Menu as="div" className="relative ml-2">
                    <div>
                      <Menu.Button className="flex items-center rounded-md bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t('common.aiTools', 'AI Tools')}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={openSmartMatching}
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'flex items-center px-4 py-2 text-sm text-light-text hover:bg-light-bg-alt'
                              )}
                            >
                              <SmartMatchingIcon />
                              <span className="ml-3">
                                {t('aiTools.smartMatching', 'Smart Matching')}
                              </span>
                              <span className="ml-auto px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                {t('common.new', 'New')}
                              </span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={openDataOrchestrator}
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'flex items-center px-4 py-2 text-sm text-light-text hover:bg-light-bg-alt'
                              )}
                            >
                              <DataOrchestratorIcon />
                              <span className="ml-3">
                                {t('aiTools.dataOrchestrator', 'Data Orchestrator')}
                              </span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={openDocVerification}
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'flex items-center px-4 py-2 text-sm text-light-text hover:bg-light-bg-alt'
                              )}
                            >
                              <DocumentVerificationIcon />
                              <span className="ml-3">
                                {t('aiTools.documentVerification', 'Document Verification')}
                              </span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={openCreditAnalysis}
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'flex items-center px-4 py-2 text-sm text-light-text hover:bg-light-bg-alt'
                              )}
                            >
                              <CreditAnalysisIcon />
                              <span className="ml-3">
                                {t('aiTools.creditAnalysis', 'Credit Analysis')}
                              </span>
                              <span className="ml-auto px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {t('common.comingSoon', 'Coming Soon')}
                              </span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              onClick={() => setShowAILifecycleAssistant(true)}
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'flex items-center px-4 py-2 text-sm text-light-text hover:bg-light-bg-alt'
                              )}
                            >
                              <LifecycleAssistantIcon />
                              <span className="ml-3">
                                {t('aiTools.lifecycleAssistant', 'Lifecycle Assistant')}
                              </span>
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/* Notification Bell */}
                  <button
                    type="button"
                    className="relative ml-2 rounded-full bg-light-bg-alt p-1 text-light-text-secondary hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={toggleNotificationsMenu}
                    aria-label={`${unreadCount} unread notifications`}
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-4 w-4" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-risk-red text-white text-[0.65rem] flex items-center justify-center ring-1 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-2">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-600">
                          <span className="text-xs font-medium leading-none text-white">
                            {user && typeof user === 'object' && 'email' in user
                              ? user.email.charAt(0).toUpperCase()
                              : 'U'}
                          </span>
                        </span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <a
                              href="#"
                              onClick={navigateToProfileSettings}
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'block px-3 py-1.5 text-xs text-light-text'
                              )}
                            >
                              {t('profile.profile', 'Your Profile')}
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'block px-3 py-1.5 text-xs text-light-text'
                              )}
                              onClick={() => toggleDarkMode()}
                            >
                              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }: { active: boolean }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-light-bg-alt' : '',
                                'block px-3 py-1.5 text-xs text-light-text'
                              )}
                              onClick={handleLogout}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                        <div className="px-3 py-1.5 text-xs text-gray-700 border-b border-gray-200">
                          <div className="font-medium mb-1">Acting As</div>
                          <select
                            value={userRole}
                            onChange={e => {
                              // This simulates changing the role and re-authenticating
                              // In a real app, you might want to confirm this action with the user
                              setPQCAuthenticated(false); // Log out
                              // In a real app, you would redirect to login here
                              // The user would then log in as the new role
                            }}
                            className="mt-1 block w-full border border-gray-300 rounded-md text-xs focus:ring-primary-500 focus:border-primary-500"
                          >
                            {roleOptions.map(r => (
                              <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* User Role Options */}
                        <div className="py-1">
                          <p className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                            Switch Role
                          </p>
                          <button
                            onClick={() => handleRoleChange('lender')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              userRole === 'lender'
                                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            Lender
                          </button>
                          <button
                            onClick={() => handleRoleChange('borrower')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              userRole === 'borrower'
                                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            Business (Borrower)
                          </button>
                          <button
                            onClick={() => handleRoleChange('broker')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              userRole === 'broker'
                                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            Broker/Originator
                          </button>
                          <button
                            onClick={() => handleRoleChange('vendor')}
                            className={`block px-4 py-2 text-sm w-full text-left ${
                              userRole === 'vendor'
                                ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            Vendor (Asset Seller)
                          </button>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            {/* Mobile menu (can be added back if needed) */}
          </>
        )}
      </Disclosure>
    </ErrorBoundary>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
