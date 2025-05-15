import React from 'react';

// Define role types
export type UserRole = 
  | 'sales_manager' 
  | 'loan_processor' 
  | 'credit_underwriter' 
  | 'credit_committee' 
  | 'portfolio_manager'
  | 'portfolio_servicer'
  | 'portfolio_monitor'
  | 'developer'
  | 'admin';

// Define view mode
export type ViewMode = 'macro' | 'micro';

interface RoleBasedHeaderProps {
  userRole: UserRole;
  viewMode: ViewMode;
  onRoleChange: (role: UserRole) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onNewOrigination: () => void;
}

const RoleBasedHeader: React.FC<RoleBasedHeaderProps> = ({
  userRole,
  viewMode,
  onRoleChange,
  onViewModeChange,
  onNewOrigination
}) => {
  // Get role display name
  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case 'sales_manager': return 'Sales & Relationship Manager';
      case 'loan_processor': return 'Loan Processor';
      case 'credit_underwriter': return 'Credit Underwriter & Analyst';
      case 'credit_committee': return 'Credit Committee';
      case 'portfolio_manager': return 'Portfolio Manager';
      case 'portfolio_servicer': return 'Portfolio Navigator Servicer';
      case 'portfolio_monitor': return 'Portfolio Navigator Monitoring';
      case 'developer': return 'Developer';
      case 'admin': return 'System Root Admin';
      default: return 'User';
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getRoleDisplayName(userRole)} Dashboard</h1>
        <p className="text-gray-600 mt-1">
          {viewMode === 'macro' 
            ? 'High-level overview of your organization performance' 
            : 'Detailed view of individual applications and metrics'}
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
        {/* View Mode Toggle - Only visible for roles with dual views */}
        {['loan_processor', 'credit_underwriter', 'credit_committee', 'portfolio_manager', 'portfolio_servicer', 'portfolio_monitor'].includes(userRole) && (
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => onViewModeChange('macro')}
              className={`${
                viewMode === 'macro'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            >
              Macro View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('micro')}
              className={`${
                viewMode === 'micro'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            >
              Micro View
            </button>
          </div>
        )}
        
        {/* Role Selector - Only visible for admin or developer */}
        {['admin', 'developer'].includes(userRole) && (
          <select
            className="form-select rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={userRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
          >
            <option value="sales_manager">Sales & Relationship Manager</option>
            <option value="loan_processor">Loan Processor</option>
            <option value="credit_underwriter">Credit Underwriter & Analyst</option>
            <option value="credit_committee">Credit Committee</option>
            <option value="portfolio_manager">Portfolio Manager</option>
            <option value="portfolio_servicer">Portfolio Navigator Servicer</option>
            <option value="portfolio_monitor">Portfolio Navigator Monitoring</option>
            <option value="developer">Developer</option>
            <option value="admin">System Root Admin</option>
          </select>
        )}
        
        {/* New Origination Button */}
        <button
          onClick={onNewOrigination}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          New Origination
        </button>
      </div>
    </div>
  );
};

export default RoleBasedHeader; 