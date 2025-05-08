import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { UserContext } from '../../contexts/UserContext';
import { useUserType } from '../../contexts/UserTypeContext';
import { PermissionLevel, FeatureAccess, UserType } from '../../types/UserTypes';
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
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import {
} from './SidebarIcons';

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
  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DocumentsIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const RiskAssessmentIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DealStructuringIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TransactionsIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// AI Tools Icons
const SmartMatchingIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DataOrchestratorIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const DocumentVerificationIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const CreditAnalysisIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LifecycleAssistantIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Blockchain Features Icons
const AssetPressIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PortfolioWalletIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const CommercialPaperIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// Collapse Icon
const CollapseIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

// Expand Icon
const ExpandIcon = () => (
  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);

// Add new icon for Customer Retention
const CustomerRetentionIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// Add new icon for Safe Forms
const SafeFormsIcon = () => (
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
  onToggle
}: { 
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
}) => {
  const isLink = !to.startsWith('#') && !hasChildren;
  const activeClasses = "bg-primary-50 text-risk-red-DEFAULT border-l-4 border-risk-red-DEFAULT font-bold";
  const normalClasses = "text-gray-700 hover:bg-silver-100 hover:text-risk-red-DEFAULT";
  
  const itemClasses = `
    flex items-center px-${isCollapsed ? '2.5' : '4'} py-3 text-base 
    hover:bg-silver-100 ${isActive ? activeClasses : normalClasses}
    ${isCollapsed ? 'justify-center' : ''} ${isCollapsed ? 'group' : ''} relative w-full text-left
  `;
  
  const effectiveOnClick = hasChildren ? onToggle : onClick;

  const renderContent = () => (
    <>
      <div className={`flex-shrink-0 ${isCollapsed ? '' : 'mr-3.5'}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <div className="flex-1 flex items-center justify-between">
          <div>
            <span className={`block ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
          </div>
          <div className="flex items-center">
            {badge && (
              <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-silver-100 text-risk-red-DEFAULT">
                {badge}
              </span>
            )}
            {hasChildren && (
              isOpen ? <ChevronUpIcon className="h-4 w-4 ml-2 text-gray-500" /> : <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-500" />
            )}
          </div>
        </div>
      )}
      
      {isCollapsed && description && (
        <div className="absolute left-full ml-2 p-2.5 bg-risk-red-DEFAULT text-white text-xs rounded shadow-lg z-30 origin-left transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 w-48">
          <div className="font-bold mb-1">{label}</div>
          <div className="text-silver-100 text-xs">{description}</div>
        </div>
      )}
    </>
  );
  
  return isLink ? (
    <NavLink
      to={to}
      className={itemClasses}
      end={to === '/'}
    >
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

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { } = useWorkflow();
  const { 
    setShowSmartMatching, 
    setShowDataOrchestrator, 
    setShowDocVerification,
    setShowCreditAnalysis,
    setShowAILifecycleAssistant,
    toggleTool,
    sidebarCollapsed,
    setSidebarCollapsed
  } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [safeFormsOpen, setSafeFormsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  
  // Get the user type and permissions
  const { hasPermission, userType } = useUserType();
  
  // Close sidebar when route changes (especially important on mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Load sidebar collapsed state from localStorage on mount
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState) {
      setSidebarCollapsed(savedCollapsedState === 'true');
    }
    // Initialize open sections based on active route or previously saved state if desired
    // For now, default to closed
  }, []);

  const mainNavigation: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <HomeIcon className="w-5 h-5" />,
      description: 'View overall metrics & deal status'
    },
    {
      name: 'Credit Application',
      path: '/credit-application',
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      description: 'Create a new credit request'
    },
    {
      name: 'Customer Retention',
      path: '/customer-retention',
      icon: <UserGroupIcon className="w-5 h-5" />,
      description: 'Manage customer relationships'
    },
    {
      name: 'Filelock Drive',
      path: '/documents',
      stage: 'document_collection',
      icon: <LockClosedIcon className="w-5 h-5" />,
      description: 'Secure deal document storage'
    },
    {
      name: 'Safe Forms',
      path: '#safe-forms',
      icon: <DocumentDuplicateIcon className="w-5 h-5" />,
      description: 'Smart contract form templates',
      onClick: () => setSafeFormsOpen(!safeFormsOpen)
    },
    {
      name: 'Risk Map Navigator',
      path: '/risk-assessment',
      stage: 'risk_assessment',
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      description: 'Analyze borrower & deal risk'
    },
    {
      name: 'Deal Structuring',
      path: '#deal-structuring',
      icon: <ScaleIcon className="w-5 h-5" />,
      description: 'Configure terms, covenants',
      children: [
        {
          name: 'Structure Editor',
          path: '/deal-structuring',
          icon: <Cog6ToothIcon className="w-5 h-5 text-gray-400" />,
          description: 'Edit and manage deal structures'
        },
        {
          name: 'Smart Match',
          path: '/deal-structuring/smart-match',
          icon: <LightBulbIcon className="w-5 h-5 text-gray-400" />,
          description: 'AI-powered investor matching',
          badge: 'New'
        }
      ]
    },
    {
      name: 'Transaction Execution',
      path: '/transactions',
      stage: 'document_execution',
      icon: <ArrowsRightLeftIcon className="w-5 h-5" />,
      description: 'E-sign & close documents'
    },
    {
      name: 'Asset Press',
      path: '/asset-press',
      badge: 'Beta',
      icon: <BuildingLibraryIcon className="w-5 h-5" />,
      description: 'Tokenize assets for liquidity'
    },
    {
      name: 'Portfolio Navigator',
      path: '/portfolio-wallet',
      badge: 'Beta',
      icon: <WalletIcon className="w-5 h-5" />,
      description: 'Advanced asset portfolio analytics'
    },
    {
      name: 'Commercial Truck & Equipment Market',
      path: '#commercial-paper',
      icon: <BuildingStorefrontIcon className="w-5 h-5" />,
      description: 'Buy and sell commercial paper/equipment',
    }
  ];
  
  const safeFormsTemplates: FormTemplate[] = [
    {
      id: 'credit-application',
      name: 'Credit Application',
      description: 'Standard credit application form',
      path: '/forms/credit-application'
    },
    {
      id: 'additional-owner-individual',
      name: 'Additional Owner (Individual)',
      description: 'Form for additional individual owners',
      path: '/forms/additional-owner-individual'
    },
    {
      id: 'additional-owner-business',
      name: 'Additional Owner (Business)',
      description: 'Form for business entity owners',
      path: '/forms/additional-owner-business'
    },
    {
      id: 'additional-owner-trust',
      name: 'Additional Owner (Trust)',
      description: 'Form for trust entity owners',
      path: '/forms/additional-owner-trust'
    },
    {
      id: 'business-debt-schedule',
      name: 'Business Debt Schedule',
      description: 'Table template for business debt',
      path: '/forms/business-debt-schedule'
    },
    {
      id: 'personal-finance-statement',
      name: 'Personal Finance Statement',
      description: 'SBA Form 413 compliant template',
      path: '/forms/personal-finance-statement'
    },
    {
      id: 'asset-ledger',
      name: 'Asset Ledger',
      description: 'Asset details verification table',
      path: '/forms/asset-ledger'
    },
    {
      id: 'vendor-verification',
      name: 'Vendor Payment & KYB',
      description: 'Vendor verification and KYB',
      path: '/forms/vendor-verification'
    },
    {
      id: 'broker-kyb',
      name: 'Broker KYB & Payment',
      description: 'Broker verification and payment',
      path: '/forms/broker-kyb'
    },
    {
      id: 'lender-payment',
      name: 'Lender Payment Instructions',
      description: 'Funding recipient instructions',
      path: '/forms/lender-payment'
    },
    {
      id: 'broker-commission',
      name: 'Broker Commission Split',
      description: 'Broker commission agreement',
      path: '/forms/broker-commission'
    },
    {
      id: 'lender-commission',
      name: 'Lender Commission Split',
      description: 'Lender commission agreement',
      path: '/forms/lender-commission'
    },
    {
      id: 'state-disclosure',
      name: 'NY/CA Lender Disclosure',
      description: 'State-specific disclosure forms',
      path: '/forms/state-disclosure'
    }
  ];
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    
    // For nested routes, only highlight the most specific match
    if (path.includes('smart-match') && location.pathname.includes('smart-match')) {
      return true;
    }
    
    // For parent items with children, don't highlight parent when on child pages
    if (path === '/deal-structuring' && location.pathname.includes('/deal-structuring/')) {
      return false;
    }
    
    return location.pathname.startsWith(path) && path !== '/';
  };

  const handleToggleSection = (itemName: string) => {
    setOpenSections(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleOpenTool = (item: NavItem) => {
    if (item.path === '#smart-matching') {
      setShowSmartMatching(true);
    } else if (item.path === '#data-orchestrator') {
      setShowDataOrchestrator(true);
    } else if (item.path === '#doc-verification') {
      setShowDocVerification(true);
    } else if (item.path === '#credit-analysis') {
      setShowCreditAnalysis(true);
    } else if (item.path === '#lifecycle-assistant') {
      setShowAILifecycleAssistant(true);
    } else if (item.path === '#commercial-paper') {
      toggleTool('commercialPaper');
    }
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    if (newState) {
      setOpenSections({});
      setSafeFormsOpen(false);
    }
    if (window.innerWidth < 768) {
      setIsOpen(!isOpen);
    }
    localStorage.setItem('sidebarCollapsed', newState.toString());
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  };
  
  const renderNavItems = (items: NavItem[], sectionTitle?: string, isSubmenu = false) => {
    const userTypeValue = userType || UserType.BUSINESS;
    const adjustedItems = items.map(item => {
      if (item.path === '#commercial-paper' && userTypeValue === UserType.VENDOR) {
        return { ...item, name: 'Commercial Truck & Equipment Market', badge: 'Coming Soon', description: 'Browse and list commercial equipment' };
      }
      if (item.path === '#commercial-paper' && userTypeValue === UserType.BUSINESS) {
        return { ...item, name: 'Commercial Truck & Equipment Market', badge: 'Coming Soon', description: 'Browse available equipment financing options' };
      }
      if (item.path === '#asset-portfolio' && (userTypeValue === UserType.VENDOR || userTypeValue === UserType.BUSINESS)) {
        return { ...item, hidden: true };
      }
      if ((item.path === '/asset-press' || item.path === '/portfolio-wallet') && (userTypeValue === UserType.BROKERAGE || userTypeValue === UserType.LENDER)) {
        return { ...item, hidden: false };
      }
      return item;
    }).filter(item => !item.hidden);

    if (adjustedItems.length === 0) return null;

    return (
      <div className={`mb-${isSubmenu ? 2 : 8}`}>
        {sectionTitle && !sidebarCollapsed && (
          <h3 className={`px-4 py-2 text-xs font-bold text-risk-red-DEFAULT uppercase tracking-wider ${isSubmenu ? 'mt-2' : ''}`}>
            {sectionTitle}
          </h3>
        )}
        <ul className={`space-y-${isSubmenu ? 1 : 2} ${isSubmenu && !sidebarCollapsed ? 'pl-4 border-l border-silver-200 ml-2' : ''}`}>
          {adjustedItems.map((item) => {
            const itemIsActive = isActive(item.path) || (item.children && item.children.some(child => isActive(child.path))) || false;
            const isSectionOpen = openSections[item.name] || false;
            
            let itemOnClick: (() => void) | undefined = undefined;
            if (item.children) {
              itemOnClick = () => handleToggleSection(item.name);
            } else if (item.path.startsWith('#') && item.path !== '#safe-forms') {
                itemOnClick = () => handleOpenTool(item);
            } else if (item.onClick) {
                itemOnClick = item.onClick;
            }

            return (
              <li key={item.name}>
                <SidebarItem
                  to={item.children ? '#' : item.path}
                  icon={item.icon}
                  label={item.name}
                  description={item.description}
                  badge={item.badge}
                  isActive={itemIsActive}
                  isCollapsed={sidebarCollapsed}
                  onClick={itemOnClick}
                  hasChildren={!!item.children}
                  isOpen={isSectionOpen}
                  onToggle={() => handleToggleSection(item.name)}
                />
                {!sidebarCollapsed && item.children && isSectionOpen && (
                  <ul className="pl-5 mt-1 space-y-1">
                    {item.children.map(child => (
                      <li key={child.name}>
                        <SidebarItem
                          to={child.path}
                          icon={child.icon}
                          label={child.name}
                          description={child.description}
                          badge={child.badge}
                          isActive={isActive(child.path)}
                          isCollapsed={sidebarCollapsed}
                        />
                      </li>
                    ))}
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <aside 
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-silver-200 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:relative ${sidebarCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between h-20 px-5 border-b border-silver-300">
            <div className="flex items-center">
              <img src="/logo.svg" alt="EVA" className="h-9 w-9" />
              {!sidebarCollapsed && (
                <>
                  <span className="ml-3 text-xl font-bold text-risk-red-DEFAULT">EVA</span>
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-silver-100 text-risk-red-DEFAULT rounded">BETA</span>
                </>
              )}
            </div>

            <button 
              className="hidden md:block rounded-md p-1.5 text-gray-500 hover:bg-silver-100 transition-colors"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
            </button>

            <button 
              className="md:hidden rounded-md p-1.5 text-gray-500 hover:bg-silver-100"
              onClick={toggleSidebar}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="px-5 py-3 border-b border-silver-300">
              <p className="text-base text-gray-600 font-medium">AI-Powered Credit Origination</p>
            </div>
          )}
          
          <nav className={`flex-1 overflow-y-auto px-3 py-5 max-h-[calc(100vh-10rem)] ${sidebarCollapsed ? 'scrollbar-none' : 'scrollbar-thin scrollbar-thumb-silver-400 scrollbar-track-transparent hover:scrollbar-thumb-risk-red-light'}`}>
            {renderNavItems(mainNavigation, "MAIN NAVIGATION")}
            
            {safeFormsOpen && (
              <div className={`${sidebarCollapsed ? 'ml-0' : 'ml-5 pl-3 border-l border-silver-200'}`}>
                <ul className="space-y-1 mt-1">
                  {safeFormsTemplates.map((template) => (
                    <li key={template.id}>
                      <SidebarItem
                        to={template.path}
                        icon={<DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />}
                        label={template.name}
                        description={template.description}
                        isActive={isActive(template.path)}
                        isCollapsed={sidebarCollapsed}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
          
          {!sidebarCollapsed && (
            <div className="px-5 py-4 border-t border-silver-200 mt-auto">
              <p className="text-base text-gray-600 mb-1 font-medium">Need help?</p>
              <a href="#" className="text-base text-risk-red-DEFAULT font-bold hover:text-risk-red-light">Contact support</a>
            </div>
          )}
        </div>
      </aside>
      
      {isOpen && (
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