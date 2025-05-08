import React from 'react';

// Financial statements interface for accounting integrations
export interface FinancialStatement {
  id: string;
  name: string;
  source: 'quickbooks' | 'netsuite' | 'upload';
  type: 'profit_loss' | 'balance_sheet' | 'cash_flow' | 'income_statement';
  year: string;
  url: string;
}

interface AccountingSoftwareIntegrationProps {
  quickbooksConnected: boolean;
  netsuiteConnected: boolean;
  financialStatements: FinancialStatement[];
  onConnect: (type: 'quickbooks' | 'netsuite') => void;
  onDisconnect: (type: 'quickbooks' | 'netsuite') => void;
  onUpload: (files: FileList) => void;
}

const AccountingSoftwareIntegration: React.FC<AccountingSoftwareIntegrationProps> = ({
  quickbooksConnected,
  netsuiteConnected,
  financialStatements,
  onConnect,
  onDisconnect,
  onUpload
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  return (
    <div className="bg-white p-4 rounded-md border border-light-border mb-6">
      <h3 className="text-lg font-medium mb-4 text-light-text">Financial Statements & Accounting Software</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* QuickBooks Connection */}
        <div className="border border-light-border rounded-md p-4 bg-light-bg-alt">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L1.5 6V18L12 24L22.5 18V6L12 0ZM12 16.5C9.5 16.5 7.5 14.5 7.5 12C7.5 9.5 9.5 7.5 12 7.5C14.5 7.5 16.5 9.5 16.5 12C16.5 14.5 14.5 16.5 12 16.5Z" />
              </svg>
              <h4 className="text-md font-medium text-light-text">QuickBooks Connection</h4>
            </div>
            
            {!quickbooksConnected && (
              <button
                type="button"
                onClick={() => onConnect('quickbooks')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Connect QuickBooks
              </button>
            )}
          </div>
          
          {quickbooksConnected ? (
            <div>
              <div className="p-3 bg-green-50 text-green-800 rounded-md mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Connected to QuickBooks</span>
              </div>
              
              <h5 className="font-medium text-sm text-light-text-secondary mb-2">Available Statements</h5>
              
              <div className="space-y-2">
                {financialStatements
                  .filter(statement => statement.source === 'quickbooks')
                  .map(statement => (
                    <div key={statement.id} className="flex justify-between items-center p-2 border border-light-border rounded-md bg-white">
                      <div>
                        <span className="text-sm font-medium">{statement.name}</span>
                        <span className="text-xs text-light-text-secondary block">{statement.type === 'profit_loss' ? 'Profit & Loss' : 'Balance Sheet'}</span>
                      </div>
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 text-sm"
                        onClick={() => { /* Download statement */ }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onDisconnect('quickbooks')}
                  className="text-risk-red text-sm underline hover:text-risk-red-dark"
                >
                  Disconnect QuickBooks
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-light-text-secondary py-4">
              <p className="text-sm">Connect your QuickBooks account to automatically import:</p>
              <ul className="text-sm mt-2 text-left list-disc pl-5">
                <li>Profit & Loss Statements (last 2-3 years)</li>
                <li>Balance Sheets (last 2-3 years)</li>
                <li>Income Statements</li>
              </ul>
            </div>
          )}
        </div>
        
        {/* NetSuite Connection */}
        <div className="border border-light-border rounded-md p-4 bg-light-bg-alt">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM13.8 17.4H10.2V12H13.8V17.4ZM13.8 10.8H10.2V7.2H13.8V10.8Z" />
              </svg>
              <h4 className="text-md font-medium text-light-text">NetSuite Connection</h4>
            </div>
            
            {!netsuiteConnected && (
              <button
                type="button"
                onClick={() => onConnect('netsuite')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Connect NetSuite
              </button>
            )}
          </div>
          
          {netsuiteConnected ? (
            <div>
              <div className="p-3 bg-green-50 text-green-800 rounded-md mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Connected to NetSuite</span>
              </div>
              
              <h5 className="font-medium text-sm text-light-text-secondary mb-2">Available Statements</h5>
              
              <div className="space-y-2">
                {financialStatements
                  .filter(statement => statement.source === 'netsuite')
                  .map(statement => (
                    <div key={statement.id} className="flex justify-between items-center p-2 border border-light-border rounded-md bg-white">
                      <div>
                        <span className="text-sm font-medium">{statement.name}</span>
                        <span className="text-xs text-light-text-secondary block">{statement.type === 'profit_loss' ? 'Profit & Loss' : 'Balance Sheet'}</span>
                      </div>
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-800 text-sm"
                        onClick={() => { /* Download statement */ }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onDisconnect('netsuite')}
                  className="text-risk-red text-sm underline hover:text-risk-red-dark"
                >
                  Disconnect NetSuite
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-light-text-secondary py-4">
              <p className="text-sm">Connect your NetSuite account to automatically import:</p>
              <ul className="text-sm mt-2 text-left list-disc pl-5">
                <li>Profit & Loss Statements (up to 3 years)</li>
                <li>Balance Sheets</li>
                <li>Cash Flow Statements</li>
                <li>Income Statements</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Manual Financial Statements Upload */}
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 text-light-text">Upload Financial Statements</h4>
        <p className="text-sm text-light-text-secondary mb-3">
          If you can't connect your accounting software, you can manually upload your financial statements here.
        </p>
        
        <div className="border border-dashed border-light-border rounded-md p-4 text-center">
          <svg className="h-10 w-10 mx-auto text-light-text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-light-text-secondary mb-3">Drag and drop financial statements here, or click to browse</p>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && onUpload(e.target.files)}
            accept=".pdf,.xls,.xlsx"
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-light-border rounded-md shadow-sm text-sm font-medium text-light-text bg-white hover:bg-light-bg"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
          <p className="text-xs text-light-text-secondary mt-2">Supported formats: PDF, XLS, XLSX (max 10MB)</p>
        </div>
      </div>
    </div>
  );
};

export default AccountingSoftwareIntegration; 