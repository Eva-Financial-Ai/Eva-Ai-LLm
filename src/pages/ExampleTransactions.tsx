import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTransactionStore from '../hooks/useTransactionStore';
import { WorkflowStage } from '../contexts/WorkflowContext';

const ExampleTransactions: React.FC = () => {
  const navigate = useNavigate();
  const { createTransaction, fetchTransactions, advanceStage, transactions: storeTransactions, loading } = useTransactionStore();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Update local transactions when store transactions change
  useEffect(() => {
    if (success) {
      setTransactions(storeTransactions.filter(t => 
        t.currentStage === 'risk_assessment'
      ));
    }
  }, [storeTransactions, success]);

  // Create 3 example transactions for demo purposes
  const handleCreateExamples = async () => {
    setCreating(true);
    setError(null);
    setSuccess(false);
    setTransactions([]);
    
    try {
      console.log("Creating example transactions...");
      
      // Example 1: Low risk commercial loan
      const transaction1 = {
        applicantData: {
          id: `APP-${Math.floor(Math.random() * 900000 + 100000)}`,
          name: 'Evergreen Industries',
          entityType: 'Corporation',
          industryCode: 'TECH-001'
        },
        type: 'Equipment Loan',
        amount: 350000,
        details: {
          purpose: 'Purchasing manufacturing equipment',
          term: 60,
          rate: 5.2,
          collateral: true
        },
        currentStage: 'document_collection' as WorkflowStage
      };
      
      // Example 2: Medium risk startup financing
      const transaction2 = {
        applicantData: {
          id: `APP-${Math.floor(Math.random() * 900000 + 100000)}`,
          name: 'NextGen Solutions',
          entityType: 'LLC',
          industryCode: 'TECH-042'
        },
        type: 'Working Capital',
        amount: 250000,
        details: {
          purpose: 'Expansion into new markets',
          term: 36,
          rate: 6.5,
          collateral: false
        },
        currentStage: 'document_collection' as WorkflowStage
      };
      
      // Example 3: High risk commercial property
      const transaction3 = {
        applicantData: {
          id: `APP-${Math.floor(Math.random() * 900000 + 100000)}`,
          name: 'Urban Development Group',
          entityType: 'Partnership',
          industryCode: 'CONS-103'
        },
        type: 'Commercial Mortgage',
        amount: 1200000,
        details: {
          purpose: 'Acquiring commercial property in downtown area',
          term: 180,
          rate: 7.8,
          collateral: true
        },
        currentStage: 'document_collection' as WorkflowStage
      };
      
      // Create the transactions
      const result1 = await createTransaction(transaction1);
      console.log("Created transaction 1:", result1);
      
      const result2 = await createTransaction(transaction2);
      console.log("Created transaction 2:", result2);
      
      const result3 = await createTransaction(transaction3);
      console.log("Created transaction 3:", result3);
      
      // Advance each transaction to a different stage
      if (result1) {
        await advanceStage(result1.id, 'risk_assessment');
      }
      
      if (result2) {
        await advanceStage(result2.id, 'risk_assessment');
      }
      
      if (result3) {
        await advanceStage(result3.id, 'risk_assessment');
      }
      
      // Refresh transactions to get the latest state
      await fetchTransactions();
      
      console.log("Example transactions created successfully!");
      setSuccess(true);
      setTransactions([result1, result2, result3].filter(Boolean));
    } catch (error) {
      console.error("Error creating example transactions:", error);
      setError("Failed to create example transactions. See console for details.");
    } finally {
      setCreating(false);
    }
  };

  const handleViewRiskAssessment = (transactionId: string) => {
    // Set the currentTransaction in the store before navigating
    const transaction = storeTransactions.find(t => t.id === transactionId);
    if (transaction) {
      useTransactionStore.getState().setCurrentTransaction(transaction);
    }
    navigate('/risk-assessment');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Example Transactions</h1>
        <p className="text-gray-600">
          Generate example transactions to test the risk assessment system
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create Demo Transactions</h2>
        <p className="text-gray-600 mb-4">
          This will create three sample transactions with different risk profiles and advance them to the risk assessment stage.
        </p>
        
        <button
          onClick={handleCreateExamples}
          disabled={creating}
          className={`px-4 py-2 rounded-md font-medium ${
            creating 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {creating ? 'Creating...' : 'Create Example Transactions'}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
            Successfully created {transactions.length} example transactions!
          </div>
        )}
      </div>
      
      {transactions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Created Transactions</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.applicantData.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewRiskAssessment(transaction.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Risk Assessment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleTransactions; 