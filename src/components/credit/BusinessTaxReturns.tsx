import React, { useState } from 'react';

const BusinessTaxReturns: React.FC = () => {
  // State to track which years have been selected
  const [selectedYears, setSelectedYears] = useState({
    mostRecentYear: false,
    priorYear: false,
    twoYearsPrior: false,
    taxExtension: false
  });

  // State to track uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({});

  // Handle checkbox changes
  const handleCheckboxChange = (year: keyof typeof selectedYears) => {
    setSelectedYears({
      ...selectedYears,
      [year]: !selectedYears[year]
    });
  };

  // Handle file upload
  const handleFileUpload = (year: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles({
        ...uploadedFiles,
        [year]: e.target.files[0].name
      });
    }
  };

  return (
    <div className="business-tax-returns p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Business Tax Returns</h3>
      <p className="text-sm text-gray-600 mb-4">Please select which years of business tax returns you will be providing:</p>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="mostRecentYear" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={selectedYears.mostRecentYear}
            onChange={() => handleCheckboxChange('mostRecentYear')}
          />
          <label htmlFor="mostRecentYear" className="ml-2 block text-sm text-gray-700">
            Most Recent Tax Year (2024)
          </label>
          {selectedYears.mostRecentYear && (
            <div className="ml-4 flex-1">
              <input
                type="file"
                id="file-2024"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileUpload('2024', e)}
              />
              <label 
                htmlFor="file-2024" 
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
              >
                {uploadedFiles['2024'] ? 'Change File' : 'Upload'}
              </label>
              {uploadedFiles['2024'] && (
                <span className="ml-2 text-sm text-gray-600">{uploadedFiles['2024']}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="priorYear" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={selectedYears.priorYear}
            onChange={() => handleCheckboxChange('priorYear')}
          />
          <label htmlFor="priorYear" className="ml-2 block text-sm text-gray-700">
            Prior Tax Year (2023)
          </label>
          {selectedYears.priorYear && (
            <div className="ml-4 flex-1">
              <input
                type="file"
                id="file-2023"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileUpload('2023', e)}
              />
              <label 
                htmlFor="file-2023" 
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
              >
                {uploadedFiles['2023'] ? 'Change File' : 'Upload'}
              </label>
              {uploadedFiles['2023'] && (
                <span className="ml-2 text-sm text-gray-600">{uploadedFiles['2023']}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="twoYearsPrior" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={selectedYears.twoYearsPrior}
            onChange={() => handleCheckboxChange('twoYearsPrior')}
          />
          <label htmlFor="twoYearsPrior" className="ml-2 block text-sm text-gray-700">
            Two Years Prior (2022)
          </label>
          {selectedYears.twoYearsPrior && (
            <div className="ml-4 flex-1">
              <input
                type="file"
                id="file-2022"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileUpload('2022', e)}
              />
              <label 
                htmlFor="file-2022" 
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
              >
                {uploadedFiles['2022'] ? 'Change File' : 'Upload'}
              </label>
              {uploadedFiles['2022'] && (
                <span className="ml-2 text-sm text-gray-600">{uploadedFiles['2022']}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="taxExtension" 
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            checked={selectedYears.taxExtension}
            onChange={() => handleCheckboxChange('taxExtension')}
          />
          <label htmlFor="taxExtension" className="ml-2 block text-sm text-gray-700">
            Last Year Tax Extension
          </label>
          {selectedYears.taxExtension && (
            <div className="ml-4 flex-1">
              <input
                type="file"
                id="file-extension"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileUpload('extension', e)}
              />
              <label 
                htmlFor="file-extension" 
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
              >
                {uploadedFiles['extension'] ? 'Change File' : 'Upload'}
              </label>
              {uploadedFiles['extension'] && (
                <span className="ml-2 text-sm text-gray-600">{uploadedFiles['extension']}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Tax returns should include all schedules and attachments. Please ensure all documents are complete 
          before uploading to avoid delays in processing your application.
        </p>
      </div>
    </div>
  );
};

export default BusinessTaxReturns; 