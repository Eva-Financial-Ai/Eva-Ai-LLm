import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';

interface NavigationItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactElement;
  current: boolean;
  badge?: string;
  children?: NavigationItem[];
  isOpen?: boolean;
  isDefault?: boolean;
  onClick?: () => void;
}

const SideNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userType } = useUserType();
  // Initialize with all menu items expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'Deal Structuring',
    'Filelock Drive',
    'Portfolio Navigator',
    'Risk Map Navigator',
  ]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detect if we're on a submenu route and expand the parent menu automatically
  useEffect(() => {
    const currentPath = location.pathname;
    const needsExpanding = navigation.filter(
      item =>
        item.children &&
        item.children.some(child => currentPath.startsWith(child.href)) &&
        !expandedItems.includes(item.name)
    );

    if (needsExpanding.length > 0) {
      setExpandedItems([...expandedItems, ...needsExpanding.map(item => item.name)]);
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
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Function to handle user-type specific navigation for Commercial Market
  const getCommercialMarketPath = () => {
    if (userType === UserType.VENDOR) {
      return '/commercial-market?view=seller';
    } else if (userType === UserType.BROKERAGE) {
      return '/commercial-market?view=broker';
    } else if (userType === UserType.LENDER) {
      return '/commercial-market?view=lender';
    } else {
      // Default to buyer view for business or any other type
      return '/commercial-market?view=buyer';
    }
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/',
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
      name: 'Credit Application',
      href: '/credit-application',
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
      current: location.pathname === '/credit-application',
    },
    {
      name: 'Customer Retention',
      href: '/customer-retention',
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
      current: location.pathname === '/customer-retention',
    },
    {
      name: 'Filelock Drive',
      href: '/documents',
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
      current: location.pathname === '/documents' || location.pathname === '/document-center',
      isOpen: expandedItems.includes('Filelock Drive'),
      children: [
        {
          name: 'Safe Forms',
          href: '/forms',
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
          current: location.pathname === '/forms' || location.pathname.startsWith('/forms/'),
        },
      ],
    },
    {
      name: 'Risk Map Navigator',
      href: '/risk-assessment/standard',
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
          current: location.pathname === '/risk-assessment/report',
        },
        {
          name: 'RiskLab',
          href: '/risk-assessment/lab',
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
      current: location.pathname === '/deal-structuring',
      isOpen: expandedItems.includes('Deal Structuring'),
      children: [
        {
          name: 'Structure Editor',
          href: '/deal-structuring/editor',
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
          current: location.pathname === '/deal-structuring/editor',
        },
        {
          name: 'Smart Match',
          href: '/deal-structuring/smart-match',
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
      ],
    },
    {
      name: 'Transaction Execution',
      href: '/transactions',
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
        location.pathname === '/transactions' || location.pathname.includes('/transactions/'),
    },
    {
      name: 'Asset Press',
      href: '/asset-press',
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
      badge: 'Beta',
    },
    {
      name: 'Portfolio Navigator',
      href: '/portfolio-navigator',
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
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      current:
        location.pathname === '/portfolio-navigator' || location.pathname === '/portfolio-wallet',
      isOpen: expandedItems.includes('Portfolio Navigator'),
      badge: 'Beta',
      children: [
        {
          name: 'Portfolio Wallet',
          href: '/portfolio-wallet',
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
      ],
    },
    {
      name: 'Commercial Truck & Equipment Market',
      href: getCommercialMarketPath(),
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
      current: location.pathname === '/commercial-market',
      badge: 'Coming Soon',
    },
  ];

  // Helper function to render badge
  const renderBadge = (badge?: string) => {
    if (!badge) return null;

    const getBadgeClass = (badge: string) => {
      switch (badge.toLowerCase()) {
        case 'new':
          return 'bg-blue-100 text-blue-800';
        case 'beta':
          return 'bg-gray-100 text-gray-800';
        case 'coming soon':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span
        className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(badge)}`}
      >
        {badge}
      </span>
    );
  };

  // Helper function to render chevron for expandable items
  const renderChevron = (isOpen?: boolean) => {
    if (isOpen === undefined) return null;

    return isOpen ? (
      <svg
        className="h-5 w-5 ml-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        className="h-5 w-5 ml-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  // Render a navigation item
  const renderNavItem = (item: NavigationItem, isChild = false) => {
    // Use conditional rendering instead of dynamic component to avoid TypeScript errors
    if (item.children && item.children.length) {
      return (
        <li key={item.name}>
          {item.children ? (
            <>
              <button
                onClick={() => toggleItem(item.name)}
                className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                  item.current
                    ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon(item.current)}</span>
                  <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{item.name}</span>
                  {item.badge && !sidebarCollapsed && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
                    expandedItems.includes(item.name) ? 'rotate-90' : ''
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
                  />
                </svg>
              </button>
              {expandedItems.includes(item.name) && (
                <ul className="mt-1 pl-4 space-y-1">
                  {item.children.map(subItem => (
                    <li key={subItem.name} className="mt-1">
                      <Link
                        to={subItem.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          subItem.current
                            ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="mr-3">{subItem.icon(subItem.current)}</span>
                        <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                          {subItem.name}
                        </span>
                        {subItem.badge && !sidebarCollapsed && (
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : item.name === 'Commercial Truck & Equipment Market' ? (
            <Link
              to={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                item.current
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon(item.current)}</span>
              <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{item.name}</span>
              {item.badge && !sidebarCollapsed && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
          ) : (
            <Link
              to={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                item.current
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon(item.current)}</span>
              <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{item.name}</span>
              {item.badge && !sidebarCollapsed && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
          )}
        </li>
      );
    } else {
      // Use the correct href based on whether this is a default landing page
      const href = isChild ? item.href : item.href;

      return (
        <li key={item.name}>
          {item.name === 'Commercial Truck & Equipment Market' ? (
            <Link
              to={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                item.current
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon(item.current)}</span>
              <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{item.name}</span>
              {item.badge && !sidebarCollapsed && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
          ) : (
            <Link
              to={href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                item.current
                  ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{item.icon(item.current)}</span>
              <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>{item.name}</span>
              {item.badge && !sidebarCollapsed && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
          )}
        </li>
      );
    }
  };

  // Sidebar toggle button
  const renderSidebarToggle = () => (
    <button
      onClick={toggleSidebar}
      className="absolute -right-3 top-12 bg-white border border-gray-200 rounded-full p-1 shadow-md"
      aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {sidebarCollapsed ? (
        <svg
          className="h-4 w-4 text-gray-500"
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
          className="h-4 w-4 text-gray-500"
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

  return (
    <div
      className={`md:flex md:flex-shrink-0 relative transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:w-16' : 'md:w-56'}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200 relative">
          {renderSidebarToggle()}
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div
              className={`flex items-center flex-shrink-0 px-4 mb-5 ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              {sidebarCollapsed ? (
                <img className="h-8 w-8" src="/logo-icon.svg" alt="EVA Platform" />
              ) : (
                <img className="h-8 w-auto" src="/logo-full.svg" alt="EVA Platform Logo" />
              )}
            </div>
            <nav className="flex-1 px-2 bg-white space-y-0">
              {sidebarCollapsed
                ? // Collapsed view
                  navigation.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex justify-center items-center p-2 my-1 rounded-md ${
                        item.current ? 'bg-pink-50' : 'hover:bg-gray-50'
                      }`}
                      title={item.name}
                    >
                      {item.icon(item.current)}
                    </Link>
                  ))
                : // Expanded view
                  navigation.map(item => (
                    <li key={item.name}>
                      {item.children ? (
                        <>
                          <button
                            onClick={() => toggleItem(item.name)}
                            className={`w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                              item.current
                                ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="mr-3">{item.icon(item.current)}</span>
                              <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                                {item.name}
                              </span>
                              {item.badge && !sidebarCollapsed && (
                                <span
                                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
                                expandedItems.includes(item.name) ? 'rotate-90' : ''
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
                              />
                            </svg>
                          </button>
                          {expandedItems.includes(item.name) && (
                            <ul className="mt-1 pl-4 space-y-1">
                              {item.children.map(subItem => (
                                <li key={subItem.name} className="mt-1">
                                  <Link
                                    to={subItem.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                      subItem.current
                                        ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                  >
                                    <span className="mr-3">{subItem.icon(subItem.current)}</span>
                                    <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                                      {subItem.name}
                                    </span>
                                    {subItem.badge && !sidebarCollapsed && (
                                      <span
                                        className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : item.name === 'Commercial Truck & Equipment Market' ? (
                        <Link
                          to={item.href}
                          className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            item.current
                              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-3">{item.icon(item.current)}</span>
                          <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                            {item.name}
                          </span>
                          {item.badge && !sidebarCollapsed && (
                            <span
                              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
                      ) : (
                        <Link
                          to={item.href}
                          className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            item.current
                              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-3">{item.icon(item.current)}</span>
                          <span className={sidebarCollapsed ? 'sr-only' : 'truncate'}>
                            {item.name}
                          </span>
                          {item.badge && !sidebarCollapsed && (
                            <span
                              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
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
                      )}
                    </li>
                  ))}
            </nav>
          </div>
          {!sidebarCollapsed && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex flex-col space-y-2">
                <div className="text-sm text-gray-500">Need help?</div>
                <Link to="/support" className="text-gray-700 hover:text-gray-900 font-medium">
                  Contact support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNavigation;
