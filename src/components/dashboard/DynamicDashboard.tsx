import React from 'react';
import { useUserType } from '../../contexts/UserTypeContext';
import { getDashboardConfig, DashboardWidgetType } from '../../config/RoleDashboardConfig';
import { MetricCard } from './MetricCard';
import { DealsTable } from './DealsTable';
import { DueDiligenceProgress } from './DueDiligenceProgress';
import { RecentActivities } from './RecentActivities';
import { DealProgressCard } from './DealProgressCard';
import { PermissionGuard } from '../../components/PermissionGuard';
import { PermissionLevel } from '../../types/UserTypes';
import { useNavigate } from 'react-router-dom';

// Additional widget components will be imported as needed

interface DynamicDashboardProps {
  metrics: any; // Metrics data
  transactions: any[]; // Transaction data
  activities: any[]; // Activity data
  dueDiligence?: any[]; // Due diligence data
  trends?: any; // Trend data
}

const DynamicDashboard: React.FC<DynamicDashboardProps> = ({
  metrics,
  transactions,
  activities,
  dueDiligence,
  trends,
}) => {
  const { userType } = useUserType();
  const navigate = useNavigate();

  // Handler for view transaction clicks
  const handleViewTransaction = (id: string) => {
    navigate(`/transaction/${id}`);
  };

  if (!userType) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-6">
        <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const dashboardConfig = getDashboardConfig(userType);

  // Sort widgets by priority
  const sortedWidgets = [...dashboardConfig.widgets].sort((a, b) => a.priority - b.priority);

  // Render a specific widget based on its type
  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case DashboardWidgetType.ACTIVE_DEALS:
        return (
          <MetricCard
            title={widget.title}
            value={metrics.activeDeals.toString()}
            subtitle="Current Month"
            trend={{ direction: 'up', value: '3', text: 'from last month' }}
            icon="/icons/deal-flow.svg"
            color="blue"
          />
        );

      case DashboardWidgetType.DEAL_VOLUME:
        return (
          <MetricCard
            title={widget.title}
            value={`$${(metrics.dealVolume / 1000000).toFixed(1)}M`}
            subtitle="Current Pipeline"
            trend={{ direction: 'up', value: '20%', text: 'month over month' }}
            icon="/icons/money.svg"
            color="green"
          />
        );

      case DashboardWidgetType.PROCESSING_TIME:
        return (
          <MetricCard
            title={widget.title}
            value={`${metrics.avgProcessingTime} days`}
            subtitle="From application to funding"
            trend={{ direction: 'down', value: '2.5 days', text: 'improvement' }}
            icon="/icons/processing.svg"
            color="indigo"
          />
        );

      case DashboardWidgetType.COMPLETED_DEALS:
        return (
          <MetricCard
            title={widget.title}
            value={metrics.completedDeals.toString()}
            subtitle="Current Month"
            trend={{ direction: 'up', value: 'on target', text: '' }}
            icon="/icons/complete.svg"
            color="purple"
          />
        );

      case DashboardWidgetType.DEAL_PROGRESS:
        return <DealProgressCard />;

      case DashboardWidgetType.DEAL_TABLE:
        return (
          <DealsTable
            transactions={transactions}
            title={widget.title || 'Active Deals'}
            onViewTransaction={handleViewTransaction}
          />
        );

      case DashboardWidgetType.DUE_DILIGENCE:
        return dueDiligence ? (
          <DueDiligenceProgress
            categories={dueDiligence}
            title={widget.title || 'Due Diligence Status'}
          />
        ) : null;

      case DashboardWidgetType.RECENT_ACTIVITIES:
        return <RecentActivities activities={activities} />;

      case DashboardWidgetType.DOCUMENT_STATUS:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Business Registration</span>
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Financial Statements</span>
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bank Statements</span>
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">Required</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>

              <div className="mt-4 text-right">
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Upload Documents →
                </button>
              </div>
            </div>
          </div>
        );

      case DashboardWidgetType.ESTIMATED_COMPLETION:
        return (
          <MetricCard
            title={widget.title}
            value="7 Days"
            subtitle="Based on current progress"
            trend={{ direction: 'down', value: '3 days', text: 'faster than similar loans' }}
            icon="/icons/clock.svg"
            color="green"
          />
        );

      case DashboardWidgetType.VENDOR_INVENTORY:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Equipment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
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
                      Interest
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        CNC Milling Machine Model X500
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Manufacturing</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$125,000</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      3 inquiries
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Industrial Conveyor System
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Logistics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">$78,500</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Financing Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1 application
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case DashboardWidgetType.FINANCING_OPTIONS:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Equipment Leasing</h4>
                  <span className="text-green-600 text-sm font-medium">High demand</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Offer flexible leasing terms with options to buy at end of term.
                </p>
                <div className="mt-3">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Create offering →
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Equipment Financing</h4>
                  <span className="text-blue-600 text-sm font-medium">Medium demand</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Direct sale with financing options through our partner lenders.
                </p>
                <div className="mt-3">
                  <button className="text-primary-600 hover:text-primary-700 text-sm">
                    Create offering →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case DashboardWidgetType.COMMISSION_FORECAST:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-semibold">$24,580</p>
                <p className="text-sm text-gray-500">Projected this quarter</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                +12% from last quarter
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Deal Closing Rate</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Deal Size</span>
                <span className="font-medium">$325,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Commission</span>
                <span className="font-medium">1.8%</span>
              </div>
            </div>
          </div>
        );

      case DashboardWidgetType.CLIENT_PIPELINE:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Inquiry Stage</span>
                <div className="flex items-center">
                  <div className="h-3 w-12 bg-blue-500 rounded-l"></div>
                  <span className="ml-2 text-sm text-gray-600">7 clients</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Application Stage</span>
                <div className="flex items-center">
                  <div className="h-3 w-16 bg-indigo-500 rounded-l"></div>
                  <span className="ml-2 text-sm text-gray-600">9 clients</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Review Stage</span>
                <div className="flex items-center">
                  <div className="h-3 w-8 bg-purple-500 rounded-l"></div>
                  <span className="ml-2 text-sm text-gray-600">5 clients</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Approval Stage</span>
                <div className="flex items-center">
                  <div className="h-3 w-6 bg-green-500 rounded-l"></div>
                  <span className="ml-2 text-sm text-gray-600">3 clients</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get column class based on widget width
  const getWidgetColumnClass = (width: string): string => {
    switch (width) {
      case 'full':
        return 'lg:col-span-6';
      case 'half':
        return 'lg:col-span-3';
      case 'third':
        return 'lg:col-span-2';
      case 'quarter':
        return 'lg:col-span-3 xl:col-span-1.5';
      default:
        return 'lg:col-span-6';
    }
  };

  // Get height class based on widget height
  const getWidgetHeightClass = (height: string): string => {
    switch (height) {
      case 'small':
        return 'h-auto';
      case 'medium':
        return 'h-auto';
      case 'large':
        return 'h-auto';
      default:
        return 'h-auto';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dashboardConfig.title}</h1>
          <p className="text-gray-500">{dashboardConfig.subtitle}</p>
        </div>
        <div className="flex space-x-2">
          {dashboardConfig.primaryActions.map((action, index) => (
            <button
              key={index}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {sortedWidgets.map((widget, index) => (
          <div
            key={index}
            className={`${getWidgetColumnClass(widget.width)} ${getWidgetHeightClass(widget.height)}`}
          >
            {widget.permissions ? (
              <PermissionGuard
                feature={widget.permissions.requiredFeature as any}
                minimumPermission={widget.permissions.minimumPermission || PermissionLevel.VIEW}
              >
                {renderWidget(widget)}
              </PermissionGuard>
            ) : (
              renderWidget(widget)
            )}
          </div>
        ))}
      </div>

      {dashboardConfig.secondaryActions.length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="flex flex-wrap gap-2">
            {dashboardConfig.secondaryActions.map((action, index) => (
              <button
                key={index}
                className="text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md text-sm border border-gray-300 hover:border-gray-400"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicDashboard;
