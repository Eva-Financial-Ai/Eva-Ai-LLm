import React from 'react';
import UserProfileSimulator from '../components/testing/UserProfileSimulator';
import AppErrorBoundary from '../components/common/AppErrorBoundary';

const UserProfileSimulation: React.FC = () => {
  return (
    <AppErrorBoundary>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">User Profile Simulation</h1>
          <p className="mb-6 text-gray-600">
            This tool allows you to simulate different user profiles for testing and demonstration purposes.
            Select a role and profile to see how the application behaves for different user types.
          </p>
          
          <UserProfileSimulator />
          
          <div className="mt-10 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-2">How to use this simulator</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Select a user role (Borrower, Vendor, Broker, or Lender)</li>
              <li>Choose a profile from the available options for that role</li>
              <li>Navigate through the application to see role-specific views and functionality</li>
              <li>Use the recommended pages section to quickly access relevant pages for each role</li>
              <li>Changes made in simulation mode are isolated and won't affect production data</li>
            </ul>
          </div>
        </div>
      </div>
    </AppErrorBoundary>
  );
};

export default UserProfileSimulation; 