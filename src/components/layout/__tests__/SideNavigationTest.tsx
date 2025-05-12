import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SideNavigation from '../SideNavigation';

/**
 * This is a simple test component to render the SideNavigation
 * in isolation for manual testing purposes.
 */
const SideNavigationTest: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <Router>
        <SideNavigation />
        <div className="pl-20 sm:pl-72 flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">SideNavigation Test</h1>
          <p className="mb-2">This is a test page to manually verify SideNavigation functionality:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>All dropdown menus should expand/collapse correctly</li>
            <li>Customer Retention should be listed above Filelock Drive</li>
            <li>Customer Retention menu should have proper sub-options</li>
            <li>Navigation paths should be correct</li>
          </ul>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Current location:</p>
            <div id="current-path" className="font-mono mt-2">{window.location.pathname}</div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default SideNavigationTest; 