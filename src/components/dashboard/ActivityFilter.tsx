import React, { useState, useEffect } from 'react';
import { UserType } from '../../types/UserTypes';

// Interface for the DealActivityFilter component
interface ActivityFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

// Interface for Activity objects
interface Activity {
  id: number | string;
  action: string;
  description: string;
  timestamp: string;
  userType: UserType;
  user: {
    name: string;
    avatar: string;
  };
}

// Interface for the ActivityFilter component that filters activities
interface ActivityFilterWithDataProps {
  initialActivities: Activity[];
  onFilteredActivitiesChange: (filteredActivities: Activity[]) => void;
}

// Keep the existing DealActivityFilter component
export const DealActivityFilter: React.FC<ActivityFilterProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  const filters = [
    { id: 'all', label: 'All Activity' },
    { id: 'borrower', label: 'Borrower Activity' },
    { id: 'vendor', label: 'Vendor Activity' },
    { id: 'broker', label: 'Broker Activity' },
    { id: 'lender', label: 'Lender Activity' }
  ];

  return (
    <div className="bg-white rounded-lg shadow mt-6">
      <div className="border-b border-gray-200">
        <div className="flex -mb-px overflow-x-auto py-2 px-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`whitespace-nowrap px-3 py-2 font-medium text-sm rounded-md mr-2
                ${activeFilter === filter.id 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Create a new ActivityFilter component that works with RecentActivities
const ActivityFilter: React.FC<ActivityFilterWithDataProps> = ({ 
  initialActivities, 
  onFilteredActivitiesChange 
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Define the filter options
  const filters = [
    { id: 'all', label: 'All Activity' },
    { id: 'borrower', label: 'Borrower' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'broker', label: 'Broker' },
    { id: 'lender', label: 'Lender' }
  ];

  // Apply filtering when the active filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      onFilteredActivitiesChange(initialActivities);
    } else {
      // Map filter ID to UserType
      const userTypeMap: Record<string, UserType> = {
        'borrower': UserType.BUSINESS,
        'vendor': UserType.VENDOR,
        'broker': UserType.BROKERAGE,
        'lender': UserType.LENDER
      };
      
      const userType = userTypeMap[activeFilter];
      
      // Filter activities by user type
      const filtered = initialActivities.filter(activity => activity.userType === userType);
      onFilteredActivitiesChange(filtered);
    }
  }, [activeFilter, initialActivities, onFilteredActivitiesChange]);
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="flex flex-wrap -mb-px">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`mr-4 pb-2 text-sm font-medium 
              ${activeFilter === filter.id 
                ? 'text-primary-600 border-b-2 border-primary-500' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
              }`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActivityFilter; 