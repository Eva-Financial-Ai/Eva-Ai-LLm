import { UserType } from '../types/UserTypes';

// Define widget types that can appear on dashboards
export enum DashboardWidgetType {
  ACTIVE_DEALS = 'active_deals',
  DEAL_VOLUME = 'deal_volume',
  PROCESSING_TIME = 'processing_time',
  COMPLETED_DEALS = 'completed_deals',
  DEAL_PROGRESS = 'deal_progress',
  DEAL_TABLE = 'deal_table',
  DUE_DILIGENCE = 'due_diligence',
  FUNDING_TRENDS = 'funding_trends',
  RECENT_ACTIVITIES = 'recent_activities',
  RISK_ASSESSMENT = 'risk_assessment',
  DOCUMENT_STATUS = 'document_status',
  ESTIMATED_COMPLETION = 'estimated_completion',
  VENDOR_INVENTORY = 'vendor_inventory',
  FINANCING_OPTIONS = 'financing_options',
  COMMISSION_FORECAST = 'commission_forecast',
  CLIENT_PIPELINE = 'client_pipeline',
  SYSTEM_STATUS = 'system_status',
  PLATFORM_METRICS = 'platform_metrics',
  USER_MANAGEMENT = 'user_management',
}

// Define widget configuration
export interface DashboardWidgetConfig {
  type: DashboardWidgetType;
  title: string;
  width: 'full' | 'half' | 'third' | 'quarter';
  height: 'small' | 'medium' | 'large';
  priority: number; // Lower number = higher on dashboard
  permissions?: {
    requiredFeature?: string;
    minimumPermission?: number;
  };
}

// Define dashboard layout for each user type
export interface DashboardConfig {
  title: string;
  subtitle: string;
  widgets: DashboardWidgetConfig[];
  primaryActions: string[];
  secondaryActions: string[];
}

// Configure dashboards for each user type
export const dashboardConfigs: Record<UserType, DashboardConfig> = {
  [UserType.LENDER]: {
    title: 'Lender Dashboard',
    subtitle: 'Comprehensive loan portfolio management',
    widgets: [
      {
        type: DashboardWidgetType.ACTIVE_DEALS,
        title: 'Active Deals',
        width: 'quarter',
        height: 'small',
        priority: 1,
      },
      {
        type: DashboardWidgetType.DEAL_VOLUME,
        title: 'Deal Volume',
        width: 'quarter',
        height: 'small',
        priority: 2,
      },
      {
        type: DashboardWidgetType.PROCESSING_TIME,
        title: 'Avg. Processing Time',
        width: 'quarter',
        height: 'small',
        priority: 3,
      },
      {
        type: DashboardWidgetType.COMPLETED_DEALS,
        title: 'Completed Deals',
        width: 'quarter',
        height: 'small',
        priority: 4,
      },
      {
        type: DashboardWidgetType.DEAL_TABLE,
        title: 'Active Deals',
        width: 'full',
        height: 'large',
        priority: 5,
      },
      {
        type: DashboardWidgetType.FUNDING_TRENDS,
        title: 'Funding Trends',
        width: 'half',
        height: 'medium',
        priority: 6,
      },
      {
        type: DashboardWidgetType.DUE_DILIGENCE,
        title: 'Due Diligence Status',
        width: 'half',
        height: 'medium',
        priority: 7,
      },
      {
        type: DashboardWidgetType.RECENT_ACTIVITIES,
        title: 'Recent Activities',
        width: 'full',
        height: 'medium',
        priority: 8,
      },
    ],
    primaryActions: ['Start New Deal', 'View Reports'],
    secondaryActions: ['Import Data', 'Export Portfolio'],
  },
  [UserType.BROKERAGE]: {
    title: 'Broker Dashboard',
    subtitle: 'Deal origination and client management',
    widgets: [
      {
        type: DashboardWidgetType.CLIENT_PIPELINE,
        title: 'Client Pipeline',
        width: 'half',
        height: 'medium',
        priority: 1,
      },
      {
        type: DashboardWidgetType.COMMISSION_FORECAST,
        title: 'Commission Forecast',
        width: 'half',
        height: 'medium',
        priority: 2,
      },
      {
        type: DashboardWidgetType.ACTIVE_DEALS,
        title: 'Active Deals',
        width: 'third',
        height: 'small',
        priority: 3,
      },
      {
        type: DashboardWidgetType.PROCESSING_TIME,
        title: 'Avg. Processing Time',
        width: 'third',
        height: 'small',
        priority: 4,
      },
      {
        type: DashboardWidgetType.COMPLETED_DEALS,
        title: 'Completed Deals',
        width: 'third',
        height: 'small',
        priority: 5,
      },
      {
        type: DashboardWidgetType.DEAL_TABLE,
        title: 'Client Applications',
        width: 'full',
        height: 'large',
        priority: 6,
      },
      {
        type: DashboardWidgetType.RECENT_ACTIVITIES,
        title: 'Recent Activities',
        width: 'full',
        height: 'medium',
        priority: 7,
      },
    ],
    primaryActions: ['Start New Application', 'Match Client to Lender'],
    secondaryActions: ['Client Directory', 'Commission Reports'],
  },
  [UserType.VENDOR]: {
    title: 'Vendor Dashboard',
    subtitle: 'Asset inventory and financing management',
    widgets: [
      {
        type: DashboardWidgetType.VENDOR_INVENTORY,
        title: 'Asset Inventory',
        width: 'full',
        height: 'large',
        priority: 1,
      },
      {
        type: DashboardWidgetType.FINANCING_OPTIONS,
        title: 'Financing Options',
        width: 'half',
        height: 'medium',
        priority: 2,
      },
      {
        type: DashboardWidgetType.ACTIVE_DEALS,
        title: 'Pending Approvals',
        width: 'half',
        height: 'small',
        priority: 3,
      },
      {
        type: DashboardWidgetType.DEAL_TABLE,
        title: 'Financing Applications',
        width: 'full',
        height: 'medium',
        priority: 4,
      },
      {
        type: DashboardWidgetType.RECENT_ACTIVITIES,
        title: 'Recent Activities',
        width: 'half',
        height: 'medium',
        priority: 5,
      },
    ],
    primaryActions: ['Add Inventory', 'Create Financing Option'],
    secondaryActions: ['View Sales Reports', 'Partner Directory'],
  },
  [UserType.BUSINESS]: {
    title: 'Borrower Dashboard',
    subtitle: 'Application tracking and financing management',
    widgets: [
      {
        type: DashboardWidgetType.DEAL_PROGRESS,
        title: 'Application Progress',
        width: 'full',
        height: 'medium',
        priority: 1,
      },
      {
        type: DashboardWidgetType.DOCUMENT_STATUS,
        title: 'Document Status',
        width: 'half',
        height: 'medium',
        priority: 2,
      },
      {
        type: DashboardWidgetType.ESTIMATED_COMPLETION,
        title: 'Estimated Completion',
        width: 'half',
        height: 'medium',
        priority: 3,
      },
      {
        type: DashboardWidgetType.RECENT_ACTIVITIES,
        title: 'Recent Updates',
        width: 'full',
        height: 'medium',
        priority: 4,
      },
    ],
    primaryActions: ['Start New Application', 'Upload Documents'],
    secondaryActions: ['Contact Support', 'View Financing Options'],
  },
  [UserType.ADMIN]: {
    title: 'System Administration',
    subtitle: 'Platform management and security controls',
    widgets: [
      {
        type: DashboardWidgetType.SYSTEM_STATUS,
        title: 'System Status',
        width: 'full',
        height: 'medium',
        priority: 1,
      },
      {
        type: DashboardWidgetType.USER_MANAGEMENT,
        title: 'User Management',
        width: 'half',
        height: 'large',
        priority: 2,
      },
      {
        type: DashboardWidgetType.PLATFORM_METRICS,
        title: 'Platform Metrics',
        width: 'half',
        height: 'large',
        priority: 3,
      },
      {
        type: DashboardWidgetType.RECENT_ACTIVITIES,
        title: 'System Activities',
        width: 'full',
        height: 'medium',
        priority: 4,
      },
    ],
    primaryActions: ['Manage Users', 'System Configuration'],
    secondaryActions: ['View Logs', 'Security Settings'],
  },
  [UserType.DEVELOPER]: {
    title: 'Developer Dashboard',
    subtitle: 'API metrics and platform development',
    widgets: [
      {
        type: DashboardWidgetType.SYSTEM_STATUS,
        title: 'API Status',
        width: 'half',
        height: 'medium',
        priority: 1,
      },
      {
        type: DashboardWidgetType.PLATFORM_METRICS,
        title: 'Performance Metrics',
        width: 'half',
        height: 'medium',
        priority: 2,
      },
      {
        type: DashboardWidgetType.USER_MANAGEMENT,
        title: 'Development Users',
        width: 'full',
        height: 'medium',
        priority: 3,
      },
      {
        type: DashboardWidgetType.RECENT_ACTIVITIES,
        title: 'Recent Deployments',
        width: 'full',
        height: 'medium',
        priority: 4,
      },
    ],
    primaryActions: ['API Explorer', 'View Documentation'],
    secondaryActions: ['Deploy Changes', 'Test Environment'],
  },
};

// Helper function to get dashboard config based on user type
export const getDashboardConfig = (userType: UserType): DashboardConfig => {
  return dashboardConfigs[userType] || dashboardConfigs[UserType.BUSINESS];
};
