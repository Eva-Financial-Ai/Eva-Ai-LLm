import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SafeForms from './credit/SafeForms';
import FinancialStatements from './credit/FinancialStatements';
import BusinessTaxReturns from './credit/BusinessTaxReturns';
import { UserContext } from '../contexts/UserContext';

const CreditApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('application');
  const navigate = useNavigate();
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  const handleSave = () => {
    alert('Application saved successfully!');
  };
  
  const handleSubmit = () => {
    alert('Application submitted successfully!');
    navigate('/dashboard');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Credit Application</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('application')}
            className={`${
              activeTab === 'application'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Application
          </button>
          <button
            onClick={() => handleTabChange('financial')}
            className={`${
              activeTab === 'financial'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Financial Statements
          </button>
          <button
            onClick={() => handleTabChange('taxes')}
            className={`${
              activeTab === 'taxes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Tax Returns
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {activeTab === 'application' && (
          <UserContext.Consumer>
            {(context) => (
              <SafeForms userType={context.userRole || 'borrower'} requestMode={false} />
            )}
          </UserContext.Consumer>
        )}
        
        {activeTab === 'financial' && (
          <UserContext.Consumer>
            {(context) => (
              <FinancialStatements userType={context.userRole || 'borrower'} />
            )}
          </UserContext.Consumer>
        )}
        
        {activeTab === 'taxes' && (
          <BusinessTaxReturns />
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Save Draft
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default CreditApplication; 