import React, { useState, useEffect } from 'react';
import { UserType } from '../../types/UserTypes';
import ActivityFilter from './ActivityFilter';

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

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activities);

  // Update filtered activities when the activities prop changes
  useEffect(() => {
    setFilteredActivities(activities);
  }, [activities]);

  const getUserTypeLabel = (type: UserType): string => {
    switch (type) {
      case UserType.BUSINESS:
        return 'Borrower';
      case UserType.VENDOR:
        return 'Vendor';
      case UserType.BROKERAGE:
        return 'Broker';
      case UserType.LENDER:
        return 'Lender';
      default:
        return 'User';
    }
  };

  const getUserTypeColor = (type: UserType): string => {
    switch (type) {
      case UserType.BUSINESS:
        return 'bg-blue-100 text-blue-800';
      case UserType.VENDOR:
        return 'bg-green-100 text-green-800';
      case UserType.BROKERAGE:
        return 'bg-purple-100 text-purple-800';
      case UserType.LENDER:
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFilteredActivitiesChange = (newFilteredActivities: Activity[]) => {
    setFilteredActivities(newFilteredActivities);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <ActivityFilter
          initialActivities={activities}
          onFilteredActivitiesChange={handleFilteredActivitiesChange}
        />
      </div>

      <div className="divide-y divide-gray-200">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="p-6 hover:bg-gray-50">
            <div className="flex space-x-3">
              <img
                className="h-10 w-10 rounded-full"
                src={activity.user.avatar}
                alt={activity.user.name}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">{activity.user.name}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(activity.userType)}`}
                    >
                      {getUserTypeLabel(activity.userType)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No activities found for the selected filter</p>
          </div>
        )}
      </div>

      {filteredActivities.length > 0 && (
        <div className="bg-gray-50 px-6 py-3">
          <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all activity
          </a>
        </div>
      )}
    </div>
  );
};
