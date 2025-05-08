import React, { useState, useEffect } from 'react';
import TestDiagnostics from '../components/testing/TestDiagnostics';
import { ComponentTesterApp } from '../components/testing/ComponentTesterApp';
import { ComponentTestResult } from '../components/testing/ComponentTester';
import { RiskMapEvaReport } from '../components/risk/RiskMapEvaReport';
import RiskMapNavigator from '../components/risk/RiskMapNavigator';
import useTransactionStore from '../hooks/useTransactionStore';
import { RiskCategory } from '../components/risk/RiskMapOptimized';

const DiagnosticPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>('credit');
  const [showRiskMap, setShowRiskMap] = useState(false);
  const [showComponentTests, setShowComponentTests] = useState(false);
  const [testResults, setTestResults] = useState<ComponentTestResult[]>([]);
  const { currentTransaction, setCurrentTransaction, transactions, fetchTransactions } = useTransactionStore();

  // Find a transaction in risk_assessment stage that could be used
  const findRiskAssessmentTransaction = () => {
    console.log('Finding risk assessment transaction...');
    const riskTransaction = transactions.find(
      transaction => transaction.currentStage === 'risk_assessment'
    );
    
    if (riskTransaction) {
      console.log('Found risk assessment transaction:', riskTransaction.id);
      setCurrentTransaction(riskTransaction);
    } else {
      console.log('No transaction in risk_assessment stage found');
    }
  };
  
  // Automatically load transactions and find a risk assessment transaction on mount
  useEffect(() => {
    const initializeRiskData = async () => {
      console.log('DiagnosticPage: Initializing risk assessment data...');
      
      if (transactions.length === 0) {
        console.log('DiagnosticPage: No transactions found, fetching...');
        await fetchTransactions();
      }
      
      // After fetching, find and set a risk assessment transaction
      findRiskAssessmentTransaction();
    };
    
    initializeRiskData();
  }, []);  // Empty dependency array ensures this runs only once on mount

  const handleCategorySelect = (categoryId: RiskCategory, childId?: string) => {
    setSelectedCategory(categoryId);
    console.log('Selected category:', categoryId, childId);
  };

  const handleTestComplete = (results: ComponentTestResult[]) => {
    setTestResults(results);
    console.log('Component testing complete:', results);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">EVA Platform Diagnostics</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              This page is for development and troubleshooting purposes only. It allows you to diagnose issues with the Risk Map feature.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Controls & Diagnostics */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Debug Controls</h2>
            
            <div className="space-y-4">
              <div>
                <button
                  onClick={findRiskAssessmentTransaction}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Find & Set Risk Assessment Transaction
                </button>
                <p className="mt-1 text-xs text-gray-500">
                  Sets the current transaction to one in the risk_assessment stage
                </p>
              </div>
              
              <div>
                <button
                  onClick={() => setShowRiskMap(!showRiskMap)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {showRiskMap ? 'Hide Risk Map' : 'Show Risk Map'}
                </button>
                <p className="mt-1 text-xs text-gray-500">
                  Toggles the Risk Map component to test loading
                </p>
              </div>
              
              <div>
                <button
                  onClick={() => setShowComponentTests(!showComponentTests)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {showComponentTests ? 'Hide Component Tests' : 'Run Component Tests'}
                </button>
                <p className="mt-1 text-xs text-gray-500">
                  Tests risk components in isolation
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Transaction</h3>
                {currentTransaction ? (
                  <div className="text-sm">
                    <div><span className="font-medium">ID:</span> {currentTransaction.id}</div>
                    <div><span className="font-medium">Name:</span> {currentTransaction.applicantData.name}</div>
                    <div><span className="font-medium">Stage:</span> {currentTransaction.currentStage}</div>
                    <div><span className="font-medium">Amount:</span> ${currentTransaction.amount.toLocaleString()}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">No transaction selected</div>
                )}
              </div>
            </div>
          </div>
          
          {showRiskMap && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Risk Map Navigator</h2>
              </div>
              <div className="p-4">
                <RiskMapNavigator 
                  onCategorySelect={handleCategorySelect} 
                  selectedCategory={selectedCategory}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Center & Right Columns - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Diagnostics Component */}
          <TestDiagnostics showFullDetails={false} />
          
          {/* Risk Map Report */}
          {showRiskMap && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Risk Map Report</h2>
              </div>
              <div className="p-4">
                <RiskMapEvaReport />
              </div>
            </div>
          )}
          
          {/* Component Tests */}
          {showComponentTests && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Component Tests</h2>
              </div>
              <div className="p-4">
                <ComponentTesterApp
                  componentDirs={['./src/components/risk']}
                  options={{
                    excludeDirs: ['__tests__'],
                    excludeFiles: ['index.ts', 'types.ts'],
                    recursive: true
                  }}
                  onComplete={handleTestComplete}
                />
              </div>
              
              {testResults.length > 0 && (
                <div className="p-4 mt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Test Results Summary</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {testResults.filter(r => r.status === 'success').length}
                      </div>
                      <div className="text-xs text-green-800">Passing</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-600">
                        {testResults.filter(r => r.status === 'error').length}
                      </div>
                      <div className="text-xs text-red-800">Failed</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-xl font-bold text-yellow-600">
                        {testResults.filter(r => r.status === 'warning').length}
                      </div>
                      <div className="text-xs text-yellow-800">Warning</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;