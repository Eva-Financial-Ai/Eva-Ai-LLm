import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { UserContext, UserContextType } from '../../contexts/UserContext';
import { useUserType, UserTypeContextType } from '../../contexts/UserTypeContext';
import { PermissionLevel, FeatureAccess, UserType } from '../../types/UserTypes';
import { useModal, ModalType } from '../../contexts/ModalContext';
import {
  HomeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  CircleStackIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ClockIcon,
  CameraIcon,
  WalletIcon,
  BuildingStorefrontIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentListIcon,
  BuildingLibraryIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  IdentificationIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  DocumentPlusIcon,
} from '@heroicons/react/24/outline';
import {} from './SidebarIcons';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  /**
   * Short tooltip phrase describing what the feature does. Used when the sidebar is collapsed
   */
  description?: string;
  stage?: string;
  badge?: string;
  hidden?: boolean;
  children?: NavItem[];
  onClick?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// SVG Icons
const DashboardIcon = () => (
  <svg
    className="w-6 h-6"
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
);

const DocumentsIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const RiskAssessmentIcon = () => (
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DealStructuringIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const TransactionsIcon = () => (
  <svg
    className="w-4 h-4"
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
);

// AI Tools Icons
const SmartMatchingIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const DataOrchestratorIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const DocumentVerificationIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const CreditAnalysisIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const LifecycleAssistantIcon = () => (
  <svg
    className="w-4 h-4"
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
);

// Blockchain Features Icons
const AssetPressIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const PortfolioWalletIcon = () => (
  <svg
    className="w-4 h-4"
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
);

const CommercialPaperIcon = () => (
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

// Collapse Icon
const CollapseIcon = () => (
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  </svg>
);

// Expand Icon
const ExpandIcon = () => (
  <svg
    className="w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
    />
  </svg>
);

// Add new icon for Customer Retention
const CustomerRetentionIcon = () => (
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
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

// Add new icon for Safe Forms
const SafeFormsIcon = () => (
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
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Add interfaces for Safe Forms templates
interface FormTemplate {
  id: string;
  name: string;
  description: string;
  path: string;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  description?: string;
  badge?: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
  hasChildren?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const SidebarItem = ({
  to,
  icon,
  label,
  description,
  badge,
  isActive,
  isCollapsed,
  onClick,
  hasChildren,
  isOpen,
  onToggle,
}: SidebarItemProps) => {
  const isLink = !to.startsWith('#') && !hasChildren;

  const activeClasses =
    'bg-primary-100 text-primary-700 border-l-4 border-primary-600 font-semibold';
  const normalClasses = 'text-gray-600 hover:bg-gray-100 hover:text-primary-600';

  const itemBaseClasses = `flex items-center w-full text-left px-3 py-2.5 text-sm transition-colors duration-150 rounded-md group relative`;

  const itemClasses = `
    ${itemBaseClasses}
    ${isActive ? activeClasses : normalClasses}
    ${isCollapsed ? 'justify-center' : ''}
  `;

  const effectiveOnClick = hasChildren ? onToggle : onClick;

  const renderContent = () => (
    <>
      <div className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>
        {React.isValidElement(icon) && typeof icon.type !== 'string'
          ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })
          : React.isValidElement(icon)
            ? icon
            : icon}
      </div>
      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between">
          <span className={`block ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
          <div className="flex items-center">
            {badge && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">
                {badge}
              </span>
            )}
            {hasChildren &&
              (isOpen ? (
                <ChevronUpIcon className="h-4 w-4 ml-2 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-400" />
              ))}
          </div>
        </div>
      )}

      {isCollapsed && description && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 p-2.5 bg-gray-800 text-white text-xs rounded-md shadow-lg z-[100] origin-left transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 w-max max-w-xs whitespace-normal">
          <div className="font-semibold mb-0.5">{label}</div>
          <div className="text-gray-300 text-xs">{description}</div>
        </div>
      )}
    </>
  );

  return isLink ? (
    <NavLink to={to} className={itemClasses} end={to === '/' || undefined}>
      {renderContent()}
    </NavLink>
  ) : (
    <button
      onClick={effectiveOnClick}
      className={itemClasses}
      aria-expanded={hasChildren ? isOpen : undefined}
    >
      {renderContent()}
    </button>
  );
};

// Define a more generic primary navigation structure
const primaryNavItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon className="w-5 h-5" />,
    description: 'Overview and key metrics',
  },
  {
    name: 'Credit Application',
    path: '#credit-application',
    icon: <DocumentDuplicateIcon className="w-5 h-5" />,
    description: 'Manage and initiate credit applications',
    children: [
      {
        name: 'New Application',
        path: '/credit-application',
        icon: <DocumentPlusIcon className="w-5 h-5" />,
        description: 'Begin a new credit origination process',
      },
      {
        name: 'New Origination',
        path: '#new-origination',
        icon: <DocumentPlusIcon className="w-5 h-5" />,
        description: 'Start a SAFE credit application process',
        onClick: () => {},
      },
    ],
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
    name: 'Custom Agents',
    path: '/custom-agents',
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    description: 'Create and manage custom AI agents',
  },
  {
    name: 'Portfolio',
    icon: <CircleStackIcon className="w-5 h-5" />,
    path: '#portfolio-management',
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
];

const Sidebar: React.FC = () => {
  const userContext = useContext(UserContext);
  const { userType, permissions, employeeRole, hasPermission, hasRolePermission } = useUserType();
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const [isSidebarActuallyCollapsed, setIsSidebarActuallyCollapsed] = useState(
    userContext.sidebarCollapsed
  );

  useEffect(() => {
    setIsSidebarActuallyCollapsed(userContext.sidebarCollapsed);
  }, [userContext.sidebarCollapsed]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const expandedWidthClass = 'w-76'; // Tailwind class for 19rem
  const collapsedWidthClass = 'w-22'; // Tailwind class for 5.5rem

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockTemplates: FormTemplate[] = [
        {
          id: 'credit-app',
          name: 'Credit Application',
          description: 'Standard credit application',
          path: '/forms/credit-application',
        },
        {
          id: 'kyc-form',
          name: 'KYC Form',
          description: 'Know Your Customer form',
          path: '/forms/kyc',
        },
      ];
      setFormTemplates(mockTemplates);
      setIsLoadingTemplates(false);
    };
    fetchTemplates();
  }, []);

  const getFilteredNavItems = (items: NavItem[]): NavItem[] => {
    return items.reduce((acc, item) => {
      const featureName = item.name.replace(/\s+/g, '').toLowerCase() as keyof FeatureAccess;
      let canAccess = true;

      if (permissions && featureName in permissions) {
        const requiredPermissionLevel = permissions[featureName];
        canAccess = hasPermission(featureName, requiredPermissionLevel);
      }

      if (item.hidden || !canAccess) return acc;

      if (item.name === 'New Origination') {
        item = {
          ...item,
          onClick: () => openModal(ModalType.APPLICATION_TYPE),
        };
      }

      if (item.children) {
        const filteredChildren = getFilteredNavItems(item.children);
        if (filteredChildren.length > 0) acc.push({ ...item, children: filteredChildren });
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as NavItem[]);
  };

  const navSections: NavSection[] = useMemo(() => {
    const actionablePrimaryNavItems = primaryNavItems.map(item => ({
      ...item,
      icon: React.isValidElement(item.icon) ? item.icon : <AcademicCapIcon className="w-5 h-5" />,
    }));

    const baseSections: NavSection[] = [
      { title: 'Main Navigation', items: getFilteredNavItems(actionablePrimaryNavItems) },
    ];
    if (userType === UserType.BROKERAGE && permissions?.dashboard === PermissionLevel.ADMIN) {
      // Add admin specific sections if any
    }
    const settingsItem: NavItem = {
      name: 'Profile Settings',
      path: '/profile-settings',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      description: 'Manage your profile and settings',
    };
    const filteredSettings = getFilteredNavItems([settingsItem]);
    if (filteredSettings.length > 0) {
      baseSections.push({ title: 'Settings', items: filteredSettings });
    }
    return baseSections.filter(section => section.items.length > 0);
  }, [userType, permissions, formTemplates, hasPermission]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path) && path !== '/';
  };

  const handleToggleSection = (itemName: string) => {
    setOpenSections(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleOpenTool = (item: NavItem) => {
    /* ... */
  };

  const toggleSidebar = () => {
    userContext.setSidebarCollapsed(!userContext.sidebarCollapsed);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  };

  const renderNavItems = (items: NavItem[], sectionTitle?: string, isSubmenu = false) => {
    if (items.length === 0 && !isLoadingTemplates && sectionTitle === 'Form Templates') return null;
    if (items.length === 0 && sectionTitle !== 'Form Templates') return null;

    return (
      <div className={`mb-4 ${isSubmenu ? 'ml-0' : ''}`}>
        {sectionTitle && !isSidebarActuallyCollapsed && (
          <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {sectionTitle}
          </h3>
        )}
        <ul
          className={`space-y-1 ${isSubmenu && !isSidebarActuallyCollapsed ? 'pl-4 border-l border-gray-200 ml-3' : ''}`}
        >
          {items.map(item => {
            const itemIsActive =
              isActive(item.path) ||
              (item.children && item.children.some(child => isActive(child.path))) ||
              false;
            const isSectionOpen = openSections[item.name] || false;

            let itemOnClickHandler: (() => void) | undefined = item.onClick;
            if (item.children) {
              itemOnClickHandler = () => handleToggleSection(item.name);
            } else if (item.path.startsWith('#')) {
              itemOnClickHandler = () => handleOpenTool(item);
            }

            return (
              <li key={item.name}>
                <SidebarItem
                  to={
                    item.children ? '#' + item.name.replace(/\s+/g, '-').toLowerCase() : item.path
                  }
                  icon={item.icon || undefined}
                  label={item.name}
                  description={item.description}
                  badge={item.badge}
                  isActive={itemIsActive}
                  isCollapsed={isSidebarActuallyCollapsed}
                  onClick={itemOnClickHandler}
                  hasChildren={!!item.children}
                  isOpen={isSectionOpen}
                  onToggle={() => handleToggleSection(item.name)}
                />
                {!isSidebarActuallyCollapsed && item.children && isSectionOpen && (
                  <ul className="pl-5 mt-1 space-y-1">
                    {renderNavItems(item.children, undefined, true)}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-risk-red-DEFAULT text-white shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out flex flex-col
                  ${isSidebarActuallyCollapsed ? collapsedWidthClass : expandedWidthClass}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <img src="/eva-logo.svg" alt="EVAFIN" className="h-8 w-auto" />
            {!isSidebarActuallyCollapsed && (
              <>
                <span className="ml-2.5 text-lg font-bold text-primary-600">EVA</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold bg-gray-200 text-primary-700 rounded">
                  BETA
                </span>
              </>
            )}
          </div>
          <button
            className="hidden md:block rounded-md p-1 text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={toggleSidebar}
            aria-label={isSidebarActuallyCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarActuallyCollapsed ? (
              <ChevronDoubleRightIcon className="h-5 w-5" />
            ) : (
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {!isSidebarActuallyCollapsed && (
          <div className="px-4 py-2 border-b border-gray-200 flex-shrink-0">
            <p className="text-sm text-gray-500 font-medium">AI-Powered Credit Origination</p>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navSections.map(section => renderNavItems(section.items, section.title, false))}
        </nav>

        {!isSidebarActuallyCollapsed && (
          <div className="px-4 py-3 border-t border-gray-200 mt-auto flex-shrink-0">
            <a
              href="#support"
              className="flex items-center text-sm text-gray-600 hover:text-primary-600"
            >
              <Cog6ToothIcon className="w-5 h-5 mr-2" /> Need help? Contact Support
            </a>
          </div>
        )}
      </aside>

      {isSidebarActuallyCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
