import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiskCategory } from './RiskMapOptimized';
import OrganizationSelector, { Organization } from './OrganizationSelector';

export type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

interface RiskMapNavigatorProps {
  selectedCategory: RiskCategory;
  onCategorySelect: (category: RiskCategory) => void;
  riskMapType?: RiskMapType;
  onRiskMapTypeChange?: (type: RiskMapType) => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

// Define the available risk map views for top navigation
export const RISK_MAP_VIEWS = {
  STANDARD: 'standard',
  REPORT: 'report',
  LAB: 'lab',
  SCORE: 'score',
};

const RiskMapNavigator: React.FC<RiskMapNavigatorProps> = ({
  selectedCategory,
  onCategorySelect,
  riskMapType = 'unsecured',
  onRiskMapTypeChange,
  activeView = RISK_MAP_VIEWS.STANDARD,
  onViewChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [localActiveView, setLocalActiveView] = useState<string>(activeView);
  
  // Update local state when prop changes
  useEffect(() => {
    setLocalActiveView(activeView);
  }, [activeView]);

  // Define available categories with readable labels and icons
  const categoryConfig: {
    id: RiskCategory;
    label: string;
    icon: string;
    description?: string;
  }[] = [
    {
      id: 'all',
      label: 'Overview',
      icon: '📊',
      description: 'Complete risk assessment overview',
    },
    {
      id: 'credit',
      label: 'Credit',
      icon: '💳',
      description: 'Credit history and score analysis',
    },
    {
      id: 'capacity',
      label: 'Capacity',
      icon: '💼',
      description: 'Debt service capacity assessment',
    },
    {
      id: 'collateral',
      label: 'Collateral',
      icon: '🏠',
      description: 'Asset evaluation and coverage',
    },
    {
      id: 'capital',
      label: 'Capital',
      icon: '💰',
      description: 'Available funds and investments',
    },
    {
      id: 'conditions',
      label: 'Conditions',
      icon: '📈',
      description: 'Market and economic factors',
    },
    {
      id: 'character',
      label: 'Character',
      icon: '👤',
      description: 'Reputation and responsibility',
    },
  ];

  // Handle navigation click from the sidebar
  const handleNavigationClick = (category: RiskCategory) => {
    onCategorySelect(category);
  };

  // Handle organization change
  const handleOrganizationChange = (organization: Organization) => {
    setSelectedOrganization(organization);
    console.log(`Selected organization: ${organization.name}`);
  };

  // Handle risk map type change
  const handleRiskMapTypeChange = (type: RiskMapType) => {
    if (onRiskMapTypeChange) {
      onRiskMapTypeChange(type);
    }
  };

  // Handle view change with animation and style updates
  const handleViewChange = (view: string) => {
    console.log(`Changing view to: ${view}`); // Add logging to help debug
    
    // Update local state immediately for responsive UI
    setLocalActiveView(view);
    
    // Call parent handler if provided
    if (onViewChange) {
      onViewChange(view);
      
      // Add visual feedback during navigation
      const element = document.getElementById(`risk-tab-${view}`);
      if (element) {
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 500);
      }
    } else {
      // Create a more dynamic and responsive navigation experience
      const element = document.getElementById(`risk-tab-${view}`);
      if (element) {
        // Add visual feedback during navigation
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 500);
      }
      
      // Navigate to the selected view with clear path structure
      const basePath = '/risk-assessment';
      let newPath = '';
      
      switch (view) {
        case RISK_MAP_VIEWS.STANDARD:
          newPath = basePath;
          break;
        case RISK_MAP_VIEWS.REPORT:
          newPath = `${basePath}/report`;
          break;
        case RISK_MAP_VIEWS.LAB:
          newPath = `${basePath}/lab`;
          break;
        case RISK_MAP_VIEWS.SCORE:
          newPath = `${basePath}/score`;
          break;
        default:
          newPath = basePath;
      }
      
      // Use replace: true to avoid cluttering browser history with tab changes
      navigate(newPath, { replace: true });
    }
  };

  // Get the title and subtitle based on risk map type
  const getRiskMapTypeInfo = () => {
    switch (riskMapType) {
      case 'unsecured':
        return {
          title: 'Unsecured Commercial Paper',
          subtitle: 'General credit application and intangible assets',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
        };
      case 'equipment':
        return {
          title: 'Commercial Equipment',
          subtitle: 'Equipment, vehicles, machines, technology assets',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
        };
      case 'realestate':
        return {
          title: 'Commercial Real Estate',
          subtitle: 'Properties, land, and real estate assets',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
        };
      default:
        return {
          title: 'Risk Categories',
          subtitle: 'Select a category to view details',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
        };
    }
  };

  const typeInfo = getRiskMapTypeInfo();

  return (
    <>
      {/* Top navigation for views and organization selector - Redesigned to prevent overlap */}
      <div className="mb-6 border-b border-gray-200 pb-4">
        {/* Separate navigation into two rows for better organization */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          {/* Top navigation tabs */}
          <div className="flex flex-wrap items-center gap-1 overflow-visible">
            <button
              id="risk-tab-standard"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewChange(RISK_MAP_VIEWS.STANDARD);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-300 ease-in-out relative ${
                localActiveView === RISK_MAP_VIEWS.STANDARD
                  ? 'bg-white text-primary-700 shadow-sm border-t-2 border-l-2 border-r-2 border-primary-500 border-b-0 z-20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-200'
              }`}
              type="button"
            >
              Standard Risk Map
            </button>
            <button
              id="risk-tab-report"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewChange(RISK_MAP_VIEWS.REPORT);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-300 ease-in-out relative ${
                localActiveView === RISK_MAP_VIEWS.REPORT
                  ? 'bg-white text-primary-700 shadow-sm border-t-2 border-l-2 border-r-2 border-primary-500 border-b-0 z-20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-200'
              }`}
              type="button"
            >
              Eva Risk Report
            </button>
            <button
              id="risk-tab-lab"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewChange(RISK_MAP_VIEWS.LAB);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-300 ease-in-out relative ${
                localActiveView === RISK_MAP_VIEWS.LAB
                  ? 'bg-white text-primary-700 shadow-sm border-t-2 border-l-2 border-r-2 border-primary-500 border-b-0 z-20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-200'
              }`}
              type="button"
            >
              RiskLab
            </button>
            <button
              id="risk-tab-score"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleViewChange(RISK_MAP_VIEWS.SCORE);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all duration-300 ease-in-out relative ${
                localActiveView === RISK_MAP_VIEWS.SCORE
                  ? 'bg-white text-primary-700 shadow-sm border-t-2 border-l-2 border-r-2 border-primary-500 border-b-0 z-20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-200'
              }`}
              type="button"
            >
              Eva Score
            </button>
          </div>

          {/* Type selector buttons in their own row on mobile, same row on desktop */}
          <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Loan Type:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => handleRiskMapTypeChange('unsecured')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    riskMapType === 'unsecured'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Unsecured
                </button>
                <button
                  onClick={() => handleRiskMapTypeChange('equipment')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    riskMapType === 'equipment'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Equipment
                </button>
                <button
                  onClick={() => handleRiskMapTypeChange('realestate')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                    riskMapType === 'realestate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Real Estate
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Organization selector in its own row for better spacing */}
        <div className="mt-4">
          <OrganizationSelector onOrganizationChange={handleOrganizationChange} />
        </div>
      </div>
    
      {/* Left sidebar navigation */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className={`p-4 border-b ${typeInfo.borderColor} ${typeInfo.bgColor}`}>
          <h3 className={`text-lg font-medium ${typeInfo.textColor}`}>{typeInfo.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{typeInfo.subtitle}</p>
          {selectedOrganization && (
            <div className="mt-2 text-sm font-medium">
              Organization: <span className="text-primary-600">{selectedOrganization.name}</span>
            </div>
          )}
        </div>
        <nav className="p-3">
          <ul className="space-y-1">
            {categoryConfig.map(category => (
              <li key={category.id}>
                <button
                  onClick={() => handleNavigationClick(category.id)}
                  className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      selectedCategory === category.id
                        ? `bg-${riskMapType === 'unsecured' ? 'blue' : riskMapType === 'equipment' ? 'green' : 'amber'}-50 
                        text-${riskMapType === 'unsecured' ? 'blue' : riskMapType === 'equipment' ? 'green' : 'amber'}-700 
                        border-l-4 border-${riskMapType === 'unsecured' ? 'blue' : riskMapType === 'equipment' ? 'green' : 'amber'}-600`
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  title={category.description}
                >
                  <span className="mr-3">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default RiskMapNavigator;
