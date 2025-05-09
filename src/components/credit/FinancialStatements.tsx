import React from 'react';

interface FinancialStatementsProps {
  userType: string;
}

const FinancialStatements: React.FC<FinancialStatementsProps> = ({ userType }) => {
  // Mock data for financial statements
  const financialStatements = [
    {
      id: 'fs-1',
      name: 'Profit & Loss Statement',
      description: 'Most recent financial year',
      required: true,
      fileType: 'pdf',
    },
    {
      id: 'fs-2',
      name: 'Balance Sheet',
      description: 'As of last quarter',
      required: true,
      fileType: 'pdf',
    },
    {
      id: 'fs-3',
      name: 'Cash Flow Statement',
      description: 'Last 12 months',
      required: false,
      fileType: 'pdf',
    },
    {
      id: 'fs-4',
      name: 'Business Bank Statements',
      description: 'Last 3 months',
      required: true,
      fileType: 'pdf',
    },
  ];

  return (
    <div className="financial-statements">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Statements</h3>

      {userType === 'borrower' ? (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-4">
            Please upload the following financial statements to support your application. Documents
            marked as required must be provided to complete your application.
          </p>

          <div className="financial-statements-list">
            {financialStatements.map(statement => (
              <div key={statement.id} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800">{statement.name}</h4>
                      {statement.required && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{statement.description}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                    Upload
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-4">
            View and manage financial statements submitted by the borrower.
          </p>

          <div className="financial-statements-list">
            {financialStatements.map(statement => (
              <div key={statement.id} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800">{statement.name}</h4>
                      {statement.required && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{statement.description}</p>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm mr-2">
                      View
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialStatements;
