import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiskCategory } from './RiskMapOptimized';

export type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

interface RiskMapNavigatorProps {
  selectedCategory: RiskCategory;
  onCategorySelect: (category: RiskCategory) => void;
  riskMapType?: RiskMapType;
}

const RiskMapNavigator: React.FC<RiskMapNavigatorProps> = ({
  selectedCategory,
  onCategorySelect,
  riskMapType = 'unsecured',
}) => {
  const navigate = useNavigate();

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

  const handleNavigationClick = (category: RiskCategory) => {
    onCategorySelect(category);
    // Stay on the current view (standard, report, etc.) but change the category
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className={`p-4 border-b ${typeInfo.borderColor} ${typeInfo.bgColor}`}>
        <h3 className={`text-lg font-medium ${typeInfo.textColor}`}>{typeInfo.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{typeInfo.subtitle}</p>
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
                {selectedCategory === category.id && (
                  <span className="ml-auto">
                    <svg
                      className={`h-5 w-5 text-${riskMapType === 'unsecured' ? 'blue' : riskMapType === 'equipment' ? 'green' : 'amber'}-600`}
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
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`p-3 ${typeInfo.bgColor} border-t ${typeInfo.borderColor} mt-2`}>
        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">5C's of Credit Analysis</p>
          <p>
            These traditional categories help evaluate overall creditworthiness and risk profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RiskMapNavigator;
