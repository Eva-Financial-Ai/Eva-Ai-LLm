import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useUserType } from '../contexts/UserTypeContext';
import { UserType } from '../types/UserTypes';
import TopNavigation from '../components/layout/TopNavigation';
import RelationshipCommitment, { CommitmentData } from '../components/common/RelationshipCommitment';
import ContactsManager from '../components/communications/ContactsManager';

// Mock data for initial commitments
const mockCommitments: CommitmentData[] = [
  {
    id: 'commitment-1',
    partnerName: 'Atlas Manufacturing',
    partnerType: 'broker',
    commitmentPeriod: 'monthly',
    minDealCount: 5,
    minDealVolume: 250000,
    startDate: new Date('2023-01-01'),
    currentProgress: {
      dealCount: 3,
      dealVolume: 175000,
      lastUpdated: new Date('2023-01-20')
    },
    userId: 'user-1'
  },
  {
    id: 'commitment-2',
    partnerName: 'Summit Financial',
    partnerType: 'lender',
    commitmentPeriod: 'quarterly',
    minDealCount: 12,
    minDealVolume: 1500000,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    currentProgress: {
      dealCount: 8,
      dealVolume: 1200000,
      lastUpdated: new Date('2023-02-15')
    },
    notes: 'Focus on equipment financing deals',
    userId: 'user-2'
  },
  {
    id: 'commitment-3',
    partnerName: 'EastCoast Equipment',
    partnerType: 'vendor',
    commitmentPeriod: 'yearly',
    minDealCount: 20,
    minDealVolume: 3000000,
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    currentProgress: {
      dealCount: 14,
      dealVolume: 2400000,
      lastUpdated: new Date('2023-03-10')
    },
    notes: 'Strategic vendor partnership with quarterly review meetings',
    userId: 'user-3'
  }
];

const CustomerRetention: React.FC = () => {
  const { userRole } = useContext(UserContext);
  const { userType } = useUserType();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Map userType or userRole to the effective role needed by child components
  const getEffectiveRole = (): string => {
    if (userType) {
      switch(userType) {
        case UserType.BUSINESS:
          return 'borrower';
        case UserType.VENDOR:
          return 'vendor';
        case UserType.BROKERAGE:
          return 'broker';
        case UserType.LENDER:
          return 'lender';
        default:
          return 'borrower';
      }
    }
    
    return userRole || 'borrower';
  };
  
  const effectiveRole = getEffectiveRole();

  // Render content based on user role
  const renderRoleBasedContent = () => {
    switch (effectiveRole) {
      case 'borrower':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Your Benefits</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Loyalty program discounts on future financing</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Early access to new financial products</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Business growth resources and webinars</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Recent Interactions</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Document Request Completed</p>
                      <p className="text-xs text-gray-500">You completed all documentation requirements for your current financing.</p>
                      <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Account Manager Check-in</p>
                      <p className="text-xs text-gray-500">Sarah Johnson contacted you to discuss your business growth plans.</p>
                      <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'lender':
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-2">Lender Portfolio Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Customer Retention Rate</p>
                  <p className="text-lg font-bold text-indigo-700">92%</p>
                  <p className="text-xs text-green-600">+2.5% from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Portfolio Value</p>
                  <p className="text-lg font-bold text-indigo-700">$24.7M</p>
                  <p className="text-xs text-green-600">+$1.2M from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Borrowers</p>
                  <p className="text-lg font-bold text-indigo-700">347</p>
                  <p className="text-xs text-green-600">+12 new clients</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Renewal Opportunities</p>
                  <p className="text-lg font-bold text-indigo-700">28</p>
                  <p className="text-xs text-yellow-600">Due in next 60 days</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">At-Risk Accounts</h3>
              </div>
              <div className="p-4">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Balance</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Acme Industries</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">High Risk</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">$430,000</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">Contact</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Zenith Solutions</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Medium Risk</span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">$215,000</td>
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">Contact</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'vendor':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Vendor Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Equipment Financed</p>
                  <p className="text-lg font-bold text-green-700">$3.4M</p>
                  <p className="text-xs text-green-600">+$340K from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Deals Closed</p>
                  <p className="text-lg font-bold text-green-700">42</p>
                  <p className="text-xs text-green-600">+7 from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer Satisfaction</p>
                  <p className="text-lg font-bold text-green-700">4.8/5</p>
                  <p className="text-xs text-green-600">+0.2 from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pipeline Opportunities</p>
                  <p className="text-lg font-bold text-green-700">18</p>
                  <p className="text-xs text-yellow-600">Potential value: $1.2M</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Customer Engagement Opportunities</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Equipment Maintenance Due</p>
                      <p className="text-xs text-gray-500">3 customers have equipment maintenance due in the next 30 days</p>
                      <button className="mt-1 text-xs text-green-600 font-medium">View Customers</button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Special Promotion Opportunity</p>
                      <p className="text-xs text-gray-500">Seasonal promotion opportunity for existing customers looking to upgrade equipment</p>
                      <button className="mt-1 text-xs text-purple-600 font-medium">Create Campaign</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'broker':
        return (
          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Broker Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Deal Volume</p>
                  <p className="text-lg font-bold text-amber-700">$5.7M</p>
                  <p className="text-xs text-green-600">+$820K from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Success Rate</p>
                  <p className="text-lg font-bold text-amber-700">76%</p>
                  <p className="text-xs text-green-600">+4% from last quarter</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Clients</p>
                  <p className="text-lg font-bold text-amber-700">34</p>
                  <p className="text-xs text-green-600">+7 new clients</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pipeline Opportunities</p>
                  <p className="text-lg font-bold text-amber-700">12</p>
                  <p className="text-xs text-yellow-600">Potential value: $2.8M</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Client Retention Opportunities</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Loan Renewal Coming Up</p>
                      <p className="text-xs text-gray-500">4 clients have loans expiring in the next 60 days</p>
                      <button className="mt-1 text-xs text-blue-600 font-medium">View Renewals</button>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Cross-Selling Opportunity</p>
                      <p className="text-xs text-gray-500">5 existing clients likely to qualify for additional financing products</p>
                      <button className="mt-1 text-xs text-green-600 font-medium">View Opportunities</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500">Please select a role to view customer retention information.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <TopNavigation title="Customer Retention" />
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Customer Retention</h1>
          <p className="text-gray-600 mt-1">Track equipment sales and maintain relationships with your customers.</p>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('engagement')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'engagement'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Engagement
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'contacts'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contacts
            </button>
            <button
              onClick={() => setActiveTab('commitments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'commitments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Commitments
            </button>
          </nav>
        </div>
        
        <div className="p-4 sm:p-6">
          {activeTab === 'overview' ? (
            renderRoleBasedContent()
          ) : activeTab === 'engagement' ? (
            <div className="bg-white p-6 rounded-lg text-center border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Customer Engagement Features</h3>
              <p className="mt-1 text-sm text-gray-500">
                Engagement features are coming soon. This will include tools for customer communications, campaigns, and event tracking.
              </p>
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="bg-white p-6 rounded-lg text-center border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Customer Analytics</h3>
              <p className="mt-1 text-sm text-gray-500">
                Detailed analytics for customer retention performance are in development and will be available soon.
              </p>
            </div>
          ) : activeTab === 'contacts' ? (
            <ContactsManager />
          ) : (
            <div className="space-y-6">
              <RelationshipCommitment
                userRole={effectiveRole}
                initialCommitments={mockCommitments}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerRetention; 