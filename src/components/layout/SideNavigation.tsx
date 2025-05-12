import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  PhoneIcon,
  ClipboardIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  id?: string;
  name?: string;
  label?: string;
  href?: string;
  path?: string;
  icon?: any;
  current?: boolean;
  badge?: string;
  isOpen?: boolean;
  children?: any[];
  hasChildren?: boolean;
  expanded?: boolean;
  toggle?: () => void;
  onClick?: () => void;
  selected?: boolean;
}

interface SideNavigationProps {
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  orientation?: 'portrait' | 'landscape';
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  deviceType = 'desktop',
  orientation = 'landscape',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { t } = useTranslation();

  // Initialize with no items expanded by default
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  // Add state for customer retention submenu
  const [customerRetentionExpanded, setCustomerRetentionExpanded] = useState(false);
  const [customersExpanded, setCustomersExpanded] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('businesses');

  // Determine if we're on a small screen
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isPortrait = orientation === 'portrait';
  const isSmallScreen = isMobile || (isTablet && isPortrait);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    if (isSmallScreen) {
      setSidebarCollapsed(true);
    }
  }, [isSmallScreen, deviceType, orientation]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if current path matches this navigation item
  useEffect(() => {
    // Auto-expand the items that contain the current path
    const currentPath = location.pathname;

    // Find all navigation items that should be expanded based on the current path
    const shouldExpandItems: string[] = [];

    // For main items with the current route
    navigationItems.forEach(item => {
      const itemPath = item.href || item.path || '';
      if (currentPath === itemPath || currentPath.startsWith(itemPath + '/')) {
        if (item.name) shouldExpandItems.push(item.name);
        if (item.id) shouldExpandItems.push(item.id);
      }

      // For child items
      if (item.children && item.children.length > 0) {
        item.children.forEach(child => {
          const childPath = child.href || child.path || '';
          if (currentPath === childPath || currentPath.startsWith(childPath + '/')) {
            if (item.name) shouldExpandItems.push(item.name);
            if (item.id) shouldExpandItems.push(item.id);
          }
        });
      }
    });

    // If customer retention or calendar page is active, expand its menu
    if (currentPath.includes('customer-retention')) {
      setCustomerRetentionExpanded(true);

      // Check specific subpaths
      if (currentPath.includes('/calendar')) {
        // Make sure Customer Retention is expanded when on calendar pages
        setCustomerRetentionExpanded(true);
      }
    }

    // Set the expanded items
    if (shouldExpandItems.length > 0) {
      setExpandedItems(shouldExpandItems);
    }
  }, [location.pathname]);

  const toggleItem = (name: string) => {
    if (expandedItems.includes(name)) {
      setExpandedItems(expandedItems.filter(item => item !== name));
    } else {
      setExpandedItems([...expandedItems, name]);
    }
  };

  const toggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);

    // If we're on mobile and expanding the sidebar, show the overlay
    if (isMobile && !newCollapsedState) {
      setIsOverlayVisible(true);
    } else {
      setIsOverlayVisible(false);
    }
  };

  // Close sidebar when clicking a link on mobile
  const handleNavItemClick = (onClick?: () => void) => {
    if (onClick) {
      onClick();
    }

    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
      setIsOverlayVisible(false);
    }
  };

  // Function to handle user-type specific navigation for Asset Marketplace
  const getAssetMarketplacePath = () => {
    if (userType === UserType.VENDOR) {
      // Manufacturers/vendors want to list equipment for sale
      return '/commercial-market?view=seller';
    } else if (userType === UserType.BROKERAGE) {
      // Brokers need view for funding sources and syndication
      return '/commercial-market?view=broker';
    } else if (userType === UserType.LENDER) {
      // Lenders need to manage repossessions and offer financing
      return '/commercial-market?view=lender';
    } else {
      // Default to buyer view for business/borrower or any other type
      return '/commercial-market?view=buyer';
    }
  };

  // Customer Retention menu items
  const customerRetentionMenuItems = [
    {
      id: 'customers',
      label: 'Customers',
      icon: <UsersIcon className="w-5 h-5" />,
      hasChildren: true,
      expanded: customersExpanded,
      toggle: () => setCustomersExpanded(!customersExpanded),
      current: location.pathname.includes('/customer-retention/customers'),
      children: [
        {
          id: 'businesses',
          label: 'Businesses',
          selected:
            location.pathname.includes('/customer-retention/customers') &&
            selectedCustomerType === 'businesses',
          onClick: () => {
            setSelectedCustomerType('businesses');
            navigate('/customer-retention/customers?type=businesses');
          },
          path: '/customer-retention/customers?type=businesses',
          current:
            location.pathname.includes('/customer-retention/customers') &&
            location.search.includes('type=businesses'),
        },
        {
          id: 'business-owners',
          label: 'Business Owners',
          selected: selectedCustomerType === 'business-owners',
          onClick: () => {
            setSelectedCustomerType('business-owners');
            navigate('/customer-retention/customers?type=business-owners');
          },
          path: '/customer-retention/customers?type=business-owners',
          current:
            location.pathname.includes('/customer-retention/customers') &&
            location.search.includes('type=business-owners'),
        },
        {
          id: 'asset-sellers',
          label: 'Asset Sellers',
          selected: selectedCustomerType === 'asset-sellers',
          onClick: () => {
            setSelectedCustomerType('asset-sellers');
            navigate('/customer-retention/customers?type=asset-sellers');
          },
          path: '/customer-retention/customers?type=asset-sellers',
          current:
            location.pathname.includes('/customer-retention/customers') &&
            location.search.includes('type=asset-sellers'),
        },
        {
          id: 'brokers-originators',
          label: 'Brokers & Originators',
          selected: selectedCustomerType === 'brokers-originators',
          onClick: () => {
            setSelectedCustomerType('brokers-originators');
            navigate('/customer-retention/customers?type=brokers-originators');
          },
          path: '/customer-retention/customers?type=brokers-originators',
          current:
            location.pathname.includes('/customer-retention/customers') &&
            location.search.includes('type=brokers-originators'),
        },
        {
          id: 'service-providers',
          label: 'Service Providers',
          selected: selectedCustomerType === 'service-providers',
          onClick: () => {
            setSelectedCustomerType('service-providers');
            navigate('/customer-retention/customers?type=service-providers');
          },
          path: '/customer-retention/customers?type=service-providers',
          current:
            location.pathname.includes('/customer-retention/customers') &&
            location.search.includes('type=service-providers'),
        },
      ],
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: <PhoneIcon className="w-5 h-5" />,
      path: '/customer-retention/contacts',
      onClick: () => {
        navigate('/customer-retention/contacts');
      },
      current: location.pathname.includes('/customer-retention/contacts'),
    },
    {
      id: 'commitments',
      label: 'Commitments',
      icon: <ClipboardIcon className="w-5 h-5" />,
      path: '/customer-retention/commitments',
      onClick: () => {
        navigate('/customer-retention/commitments');
      },
      current: location.pathname.includes('/customer-retention/commitments'),
    },
    {
      id: 'calendar',
      label: 'Calendar Integration',
      icon: <CalendarIcon className="w-5 h-5" />,
      path: '/customer-retention/calendar',
      onClick: () => {
        navigate('/customer-retention/calendar');
      },
      hasChildren: false,
      current: location.pathname.includes('/customer-retention/calendar'),
    },
  ];

  // Define navigation items with both old and new style compatible structure
  const navigationItems = [
    {
      name: t('common.dashboard'),
      href: '/',
      onClick: () => {
        navigate('/');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      current: location.pathname === '/' || location.pathname === '/dashboard',
    },
    {
      name: t('common.aiAssistant', 'Eva AI Assistant'),
      href: '/ai-assistant',
      onClick: () => {
        navigate('/ai-assistant');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.59.225M14.25 3.104c.251.023.501.05.75.082M14.25 3.104A24.301 24.301 0 0010.5 3.187m3.75 0c1.701.072 3.369.283 4.963.621.096.021.193.037.291.056v5.038a2.25 2.25 0 01-.659 1.591L14.5 14.5m0-5.25a.75.75 0 100-1.5.75.75 0 000 1.5zM12 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm-2.25.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
          />
        </svg>
      ),
      current: location.pathname === '/ai-assistant',
      badge: 'New',
    },
    {
      name: t('common.creditApplication'),
      href: '/credit-application',
      onClick: () => {
        navigate('/credit-application');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      current:
        location.pathname === '/credit-application' || location.pathname === '/auto-originations',
      isOpen: expandedItems.includes(t('common.creditApplication')),
      children: [
        {
          name: t('common.applicationForm', 'Application Form'),
          href: '/credit-application',
          onClick: () => {
            navigate('/credit-application');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          current: location.pathname === '/credit-application',
        },
        {
          name: t('common.autoOriginations', 'Auto Originations'),
          href: '/auto-originations',
          onClick: () => {
            navigate('/auto-originations');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          ),
          current: location.pathname === '/auto-originations',
        },
        {
          name: t('common.postClosingCustomers', 'Post Closing Customers'),
          href: '/post-closing',
          onClick: () => {
            navigate('/post-closing');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          ),
          current: location.pathname === '/post-closing',
          badge: 'New',
        },
      ],
    },
    // Customer Retention moved above Filelock Drive
    {
      id: 'customer-retention',
      name: 'Customer Retention',
      href: '/customer-retention',
      path: '/customer-retention',
      onClick: () => {
        navigate('/customer-retention');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
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
      ),
      current:
        location.pathname === '/customer-retention' ||
        location.pathname.startsWith('/customer-retention/'),
      isOpen: customerRetentionExpanded,
      expanded: customerRetentionExpanded,
      toggle: () => setCustomerRetentionExpanded(!customerRetentionExpanded),
      hasChildren: true,
      children: customerRetentionMenuItems,
      badge: 'New',
    },
    {
      name: 'Filelock Drive',
      href: '/documents',
      onClick: () => {
        navigate('/documents');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      current:
        location.pathname === '/documents' ||
        location.pathname === '/document-center' ||
        location.pathname.startsWith('/shield-vault'),
      isOpen: expandedItems.includes('Filelock Drive'),
      children: [
        {
          name: 'Document Management',
          href: '/documents',
          onClick: () => {
            navigate('/documents');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          current: location.pathname === '/documents',
        },
        {
          name: 'Shield Vault',
          href: '/shield-vault',
          onClick: () => {
            navigate('/shield-vault');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          ),
          current: location.pathname.startsWith('/shield-vault'),
        },
        {
          name: 'Safe Forms',
          href: '/forms',
          onClick: () => {
            navigate('/forms');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
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
          ),
          current: location.pathname === '/forms' || location.pathname.startsWith('/forms/'),
        },
      ],
    },
    {
      name: 'Risk Map Navigator',
      href: '/risk-assessment',
      onClick: () => {
        navigate('/risk-assessment/standard');
        toggleItem('Risk Map Navigator');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      current:
        location.pathname === '/risk-assessment' ||
        location.pathname.startsWith('/risk-assessment/'),
      isOpen: expandedItems.includes('Risk Map Navigator'),
      children: [
        {
          name: 'Standard',
          href: '/risk-assessment/standard',
          onClick: () => {
            navigate('/risk-assessment/standard?tab=standard');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          current:
            location.pathname === '/risk-assessment/standard' ||
            location.pathname === '/risk-assessment',
          isDefault: true,
        },
        {
          name: 'Eva Risk Report',
          href: '/risk-assessment/report',
          onClick: () => {
            navigate('/risk-assessment/report?tab=report');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          ),
          current: location.pathname === '/risk-assessment/report',
        },
        {
          name: 'RiskLab',
          href: '/risk-assessment/lab',
          onClick: () => {
            navigate('/risk-assessment/lab?tab=lab');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          ),
          current: location.pathname === '/risk-assessment/lab',
        },
        {
          name: 'Eva Score',
          href: '/risk-assessment/score',
          onClick: () => {
            navigate('/risk-assessment/score?tab=score');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
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
          ),
          current: location.pathname === '/risk-assessment/score',
        },
      ],
    },
    {
      name: 'Deal Structuring',
      href: '/deal-structuring',
      onClick: () => {
        navigate('/deal-structuring');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
      current: location.pathname.startsWith('/deal-structuring'),
      isOpen: expandedItems.includes('Deal Structuring'),
      children: [
        {
          name: 'Structure Editor',
          href: '/deal-structuring',
          onClick: () => {
            navigate('/deal-structuring');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
          current: location.pathname === '/deal-structuring',
        },
        {
          name: 'Smart Match',
          href: '/deal-structuring/smart-match',
          onClick: () => {
            navigate('/deal-structuring/smart-match');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          ),
          current: location.pathname === '/deal-structuring/smart-match',
          badge: 'New',
        },
        {
          name: 'Transaction Execution',
          href: '/transaction-execution',
          onClick: () => {
            navigate('/transaction-execution');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          ),
          current:
            location.pathname === '/transaction-execution' ||
            location.pathname.includes('/transaction-execution/'),
          badge: 'New',
        },
      ],
    },
    {
      name: 'Asset Press',
      href: '/asset-press',
      onClick: () => {
        navigate('/asset-press');
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>
      ),
      current: location.pathname === '/asset-press' || location.pathname === '/asset-marketplace',
      badge: 'Beta',
      isOpen: expandedItems.includes('Asset Press'),
      children: [
        {
          name: 'Asset Press',
          href: '/asset-press',
          onClick: () => {
            navigate('/asset-press');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
          ),
          current: location.pathname === '/asset-press',
        },
        {
          name: 'Asset Marketplace',
          href: '/asset-marketplace',
          onClick: () => {
            navigate('/asset-marketplace');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
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
          ),
          current: location.pathname === '/asset-marketplace',
        },
      ],
    },
    {
      name: 'Portfolio Navigator',
      href: '/portfolio-wallet',
      onClick: () => {
        toggleItem('Portfolio Navigator'); // Toggle dropdown instead of navigation
      },
      icon: active => (
        <svg
          className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2M7 7h10"
          />
        </svg>
      ),
      current:
        location.pathname === '/portfolio-wallet' || location.pathname === '/asset-portfolio',
      isOpen: expandedItems.includes('Portfolio Navigator'),
      badge: 'Beta',
      children: [
        {
          name: 'Portfolio Wallet',
          href: '/portfolio-wallet',
          onClick: () => {
            navigate('/portfolio-wallet');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          ),
          current: location.pathname === '/portfolio-wallet',
        },
        {
          name: 'Asset Portfolio',
          href: '/asset-portfolio',
          onClick: () => {
            navigate('/asset-portfolio');
          },
          icon: active => (
            <svg
              className={`h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-600'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
          current: location.pathname === '/asset-portfolio',
        },
      ],
    },
  ];

  // Render function for navigation items
  const renderNavItem = (item: NavigationItem) => {
    // Handle either the old navigation structure or new customer retention structure
    const itemName = item.name || item.label || '';
    const itemPath = item.href || item.path || '#';
    const itemIcon = typeof item.icon === 'function' ? item.icon(item.current || false) : item.icon;
    const hasChildren = (item.children && item.children.length > 0) || item.hasChildren;
    const isExpanded = item.isOpen || item.expanded || expandedItems.includes(itemName);
    const toggleFn = item.toggle || (() => toggleItem(itemName));

    // Check if this item or any of its children is active
    const isActive =
      item.current ||
      Boolean(item.selected) ||
      location.pathname === itemPath ||
      location.pathname.startsWith(itemPath + '/');

    // Style classes
    const linkBaseClasses = 'flex items-center px-3 py-2.5 text-base font-medium rounded-md';
    const activeClasses = 'text-primary-600 bg-primary-50 hover:bg-primary-100';
    const inactiveClasses = 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    const styleClasses = `${linkBaseClasses} ${isActive ? activeClasses : inactiveClasses}`;

    // Render differently based on whether the item has children
    if (!hasChildren) {
      return (
        <li key={itemName}>
          <Link
            to={itemPath}
            className={styleClasses}
            onClick={() => handleNavItemClick(item.onClick)}
          >
            <span className="mr-3">{itemIcon}</span>
            <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{itemName}</span>
            {item.badge && !sidebarCollapsed && (
              <span
                className={`ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  item.badge === 'New'
                    ? 'bg-green-100 text-green-800'
                    : item.badge === 'Beta'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        </li>
      );
    }

    // Item with children/submenu
    return (
      <li key={itemName}>
        <button
          onClick={e => {
            e.preventDefault();
            toggleFn();
          }}
          className={`w-full ${styleClasses} flex items-center justify-between`}
        >
          <div className="flex items-center">
            <span className="mr-3">{itemIcon}</span>
            <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{itemName}</span>
            {item.badge && !sidebarCollapsed && (
              <span
                className={`ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  item.badge === 'New'
                    ? 'bg-green-100 text-green-800'
                    : item.badge === 'Beta'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.badge}
              </span>
            )}
          </div>
          <svg
            className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        {isExpanded && (
          <ul className={`mt-1 pl-4 space-y-1 ${isMobile ? 'bg-gray-50' : ''}`}>
            {item.children?.map((subItem: NavigationItem) => {
              const subItemName = subItem.name || subItem.label || '';
              const subItemPath = subItem.href || subItem.path || '#';
              const subItemIcon =
                typeof subItem.icon === 'function'
                  ? subItem.icon(subItem.current || false)
                  : subItem.icon;
              const isSelected = subItem.current || subItem.selected;

              const subStyleClasses = `flex items-center px-3 py-2.5 text-base font-medium rounded-md ${
                isSelected ? activeClasses : inactiveClasses
              }`;

              return (
                <li key={subItemName} className="mt-1">
                  {subItem.onClick ? (
                    <button
                      onClick={() => handleNavItemClick(subItem.onClick)}
                      className={subStyleClasses}
                    >
                      {subItemIcon && <span className="mr-3">{subItemIcon}</span>}
                      <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                        {subItemName}
                      </span>
                      {subItem.badge && !sidebarCollapsed && (
                        <span
                          className={`ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            subItem.badge === 'New'
                              ? 'bg-green-100 text-green-800'
                              : subItem.badge === 'Beta'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {subItem.badge}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={subItemPath}
                      className={subStyleClasses}
                      onClick={() => handleNavItemClick()}
                    >
                      {subItemIcon && <span className="mr-3">{subItemIcon}</span>}
                      <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                        {subItemName}
                      </span>
                      {subItem.badge && !sidebarCollapsed && (
                        <span
                          className={`ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            subItem.badge === 'New'
                              ? 'bg-green-100 text-green-800'
                              : subItem.badge === 'Beta'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  // Mobile-optimized sidebar toggle button
  const renderSidebarToggle = () => (
    <button
      onClick={toggleSidebar}
      className={`${isMobile ? 'absolute right-4 top-4 z-50' : 'absolute -right-3 top-12'} bg-white border border-gray-200 rounded-full p-1 shadow-md z-10 hover:shadow-lg transition-all`}
      aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {sidebarCollapsed ? (
        <svg
          className="h-4 w-4 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );

  // Determines sidebar widths for different screen sizes
  const getSidebarWidth = () => {
    if (sidebarCollapsed) return 'w-20'; // Wider collapsed sidebar (was w-14)
    if (isMobile) return 'w-72'; // Wider for mobile sidebar (was w-64)
    if (isTablet) return 'w-64'; // Wider for tablet (was w-56)
    return 'w-72'; // Wider for desktop (was w-64)
  };

  return (
    <>
      <nav
        className={`fixed h-full bg-white dark:bg-gray-900 z-20 overflow-y-auto transition-all duration-300 border-r border-gray-200 dark:border-gray-800 ${getSidebarWidth()} ${isMobile && !sidebarCollapsed ? 'left-0' : sidebarCollapsed && isMobile ? '-left-20' : ''}`}
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200 relative">
            {renderSidebarToggle()}
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div
                className={`flex items-center flex-shrink-0 px-4 mb-5 ${sidebarCollapsed ? 'justify-center' : ''}`}
              >
                {sidebarCollapsed ? (
                  <img className="h-8 w-8" src="/eva-favicon.svg" alt="EVA Platform" />
                ) : (
                  <img className="h-8 w-auto" src="/eva-logo.svg" alt="EVA Platform Logo" />
                )}
              </div>
              <nav className="flex-1 px-2 bg-white space-y-0">
                {/* Render navigation items */}
                <ul className="space-y-1">{navigationItems.map(item => renderNavItem(item))}</ul>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay backdrop when sidebar is open on small screens */}
      {isOverlayVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default SideNavigation;
