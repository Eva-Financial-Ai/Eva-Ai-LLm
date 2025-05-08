import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';
import { RiskCategory } from './RiskMapOptimized';

// Icons
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  CubeIcon,
  DocumentReportIcon,
  ChartPieIcon,
  UserIcon,
  OfficeBuildingIcon,
  DocumentTextIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  current: boolean;
  expanded?: boolean;
  children?: NavigationChild[];
  visibleTo?: ('all' | 'broker' | 'lender' | 'borrower' | 'vendor')[];
}

interface NavigationChild {
  id: string;
  name: string;
  icon?: React.ReactNode;
  current: boolean;
  visibleTo?: ('all' | 'broker' | 'lender' | 'borrower' | 'vendor')[];
}

interface RiskMapNavigatorProps {
  selectedCategory: RiskCategory;
  onCategorySelect: (category: RiskCategory) => void;
}

// Category definition with icons and descriptions
const categories: {
  id: RiskCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: 'all',
    name: 'Overview',
    description: 'Complete risk assessment summary',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'credit',
    name: 'Credit',
    description: 'Credit history and performance',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'capacity',
    name: 'Capacity',
    description: 'Ability to repay obligations',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'collateral',
    name: 'Collateral',
    description: 'Assets securing the financing',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: 'capital',
    name: 'Capital',
    description: 'Investment and financial strength',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'conditions',
    name: 'Conditions',
    description: 'Market and industry factors',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: 'character',
    name: 'Character',
    description: 'Management quality and history',
    icon: (
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  }
];

// Memoized RiskMapNavigator component
const RiskMapNavigator: React.FC<RiskMapNavigatorProps> = ({ 
  selectedCategory,
  onCategorySelect 
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-4">Risk Categories</h3>
      <nav className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary-100 text-primary-800'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className={`flex-shrink-0 ${
              selectedCategory === category.id ? 'text-primary-600' : 'text-gray-500'
            }`}>
              {category.icon}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 hidden md:block">{category.description}</p>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default React.memo(RiskMapNavigator); 