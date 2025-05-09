import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RiskAdvisorWrapper from '../risk/RiskAdvisorWrapper';
import {
  HomeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ArrowsRightLeftIcon,
  CircleStackIcon,
  ChartBarIcon,
  WalletIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  children?: NavigationItem[];
}

const primaryNavItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon className="w-5 h-5" />,
    description: 'Overview and key metrics',
  },
  {
    name: 'Documents',
    path: '/documents',
    icon: <DocumentTextIcon className="w-5 h-5" />,
    description: 'Manage and view documents',
  },
  {
    name: 'Transactions',
    path: '/transactions',
    icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
    description: 'View and manage transactions',
  },
  {
    name: 'Risk Assessment',
    path: '/risk-assessment',
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    description: 'Assess and manage risk',
  },
  {
    name: 'Deal Structuring',
    path: '/deal-structuring',
    icon: <ScaleIcon className="w-5 h-5" />,
    description: 'Structure and manage deals',
  },
  {
    name: 'Portfolio',
    path: '/portfolio',
    icon: <CircleStackIcon className="w-5 h-5" />,
    description: 'Manage your asset portfolio',
    children: [
      {
        name: 'Asset Portfolio',
        path: '/asset-portfolio',
        icon: <ChartBarIcon className="w-5 h-5" />,
        description: 'View your asset portfolio dashboard',
      },
      {
        name: 'Portfolio Wallet',
        path: '/portfolio-wallet',
        icon: <WalletIcon className="w-5 h-5" />,
        description: 'Manage your portfolio wallet',
      },
      {
        name: 'Asset Listing',
        path: '/asset-listing',
        icon: <BuildingStorefrontIcon className="w-5 h-5" />,
        description: 'Browse and list assets',
      },
    ],
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Cog6ToothIcon className="w-5 h-5" />,
    description: 'Configure your preferences',
  },
];

const MainNavigation: React.FC = () => {
  const [showRiskChat, setShowRiskChat] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  const toggleExpand = (itemName: string) => {
    setExpandedItem(prev => (prev === itemName ? null : itemName));
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path) && path !== '/';
  };

  return (
    <>
      <div className="bg-white border-r border-gray-200 w-64 fixed top-0 left-0 bottom-0 z-30 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="px-4 py-5 flex items-center border-b border-gray-200">
            <img src="/logo.svg" alt="EVA Platform" className="h-8" />
            <span className="ml-2 text-lg font-semibold text-gray-900">EVA Platform</span>
          </div>

          <nav className="mt-6 px-4 flex-1">
            <ul className="space-y-2">
              {primaryNavItems.map(item => (
                <li key={item.name}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.name)}
                        className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3 text-gray-500">{item.icon}</span>
                        <span>{item.name}</span>
                        <svg
                          className={`ml-auto h-4 w-4 transition-transform ${
                            expandedItem === item.name ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {expandedItem === item.name && (
                        <ul className="mt-1 pl-8 space-y-1">
                          {item.children.map(child => (
                            <li key={child.name}>
                              <Link
                                to={child.path}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                  isActive(child.path)
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3 text-gray-500">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="fixed bottom-6 left-6">
            <button
              onClick={() => setShowRiskChat(true)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              title="Open Risk Advisor Chat"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showRiskChat && (
        <RiskAdvisorWrapper
          isOpen={showRiskChat}
          onClose={() => setShowRiskChat(false)}
          mode="general"
        />
      )}
    </>
  );
};

export default MainNavigation;
