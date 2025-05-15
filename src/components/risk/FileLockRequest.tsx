import React, { useState } from 'react';
import { LockClosedIcon, XMarkIcon, CheckIcon, DocumentIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Define file types and period options
type FileType = 'Balance Sheet' | 'Tax Returns' | 'Bank Statements' | 'Profit & Loss Statement' | 'Proof Of Ownership' | 'Account receivable aging report';
type PeriodType = '3 Month' | '6 Month' | '1 Year' | 'YTD' | 'MTD';
type DocumentType = 'EXT' | 'MTD' | 'YTD';

interface DocumentRequest {
  fileType: FileType;
  documentType?: DocumentType;
  periodTime?: PeriodType;
  isSelected: boolean;
}

interface FileLockRequestProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onRequestComplete?: (selectedDocs: DocumentRequest[]) => void;
}

const FileLockRequest: React.FC<FileLockRequestProps> = ({ 
  position = 'bottom-right',
  onRequestComplete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentRequest[]>([
    { fileType: 'Balance Sheet', documentType: undefined, periodTime: '3 Month', isSelected: false },
    { fileType: 'Tax Returns', documentType: 'EXT', periodTime: undefined, isSelected: false },
    { fileType: 'Bank Statements', documentType: 'MTD', periodTime: undefined, isSelected: false },
    { fileType: 'Profit & Loss Statement', documentType: 'MTD', periodTime: undefined, isSelected: false },
    { fileType: 'Proof Of Ownership', documentType: undefined, periodTime: undefined, isSelected: false },
    { fileType: 'Account receivable aging report', documentType: undefined, periodTime: undefined, isSelected: false }
  ]);
  
  // Position styling classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };
  
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  
  const handleDocumentSelect = (index: number) => {
    const updatedDocs = [...selectedDocuments];
    updatedDocs[index].isSelected = !updatedDocs[index].isSelected;
    setSelectedDocuments(updatedDocs);
  };
  
  const handlePeriodChange = (index: number, period: PeriodType) => {
    const updatedDocs = [...selectedDocuments];
    updatedDocs[index].periodTime = period;
    setSelectedDocuments(updatedDocs);
  };
  
  const handleSubmit = () => {
    if (onRequestComplete) {
      onRequestComplete(selectedDocuments.filter(doc => doc.isSelected));
    }
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Floating lock button */}
      <button
        onClick={toggleModal}
        className={`fixed ${positionClasses[position]} z-30 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300`}
        aria-label="Request Documents"
      >
        <LockClosedIcon className="h-6 w-6" />
      </button>
      
      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={toggleModal}></div>
            
            {/* Modal panel */}
            <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto shadow-xl transform transition-all">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-900 flex items-center">
                  <LockClosedIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Filelock Request
                </h2>
                <button onClick={toggleModal} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Balance Sheet {'{Period Time}'}</label>
                  <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    <option>Balance Sheet {'{Period Time}'}</option>
                    <option>Tax Returns for 3 Years</option>
                    <option>Business Plan</option>
                    <option>AR Aging Summary</option>
                    <option>Equipment Sales Invoice</option>
                  </select>
                </div>
                
                <div className="space-y-4 mt-6">
                  {selectedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center border-b border-gray-200 pb-4">
                      <div className="flex-shrink-0 mr-4">
                        <input
                          type="checkbox"
                          checked={doc.isSelected}
                          onChange={() => handleDocumentSelect(index)}
                          className="h-5 w-5 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex flex-1 items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{doc.fileType}</p>
                        </div>
                        
                        {doc.documentType && (
                          <div className="mx-4 w-20 text-center">
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-md">
                              {doc.documentType}
                            </span>
                          </div>
                        )}
                        
                        <div className="w-40">
                          {doc.periodTime !== undefined && (
                            <select
                              value={doc.periodTime}
                              onChange={(e) => handlePeriodChange(index, e.target.value as PeriodType)}
                              className="block w-full py-1.5 px-3 border border-gray-300 bg-white rounded-md shadow-sm text-sm"
                            >
                              <option value="3 Month">3 Month</option>
                              <option value="6 Month">6 Month</option>
                              <option value="1 Year">1 Year</option>
                              <option value="YTD">YTD</option>
                              <option value="MTD">MTD</option>
                            </select>
                          )}
                          
                          {doc.fileType === 'Proof Of Ownership' && (
                            <div className="flex items-center text-gray-500 text-xs">
                              <InformationCircleIcon className="h-4 w-4 mr-1" />
                              <span>Please upload one of the following documents</span>
                            </div>
                          )}
                          
                          {doc.fileType === 'Account receivable aging report' && (
                            <div className="text-blue-600 text-sm">
                              Owner_Credit name file 2024...PDF
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {doc.fileType === 'Account receivable aging report' && (
                        <div className="ml-4 flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={handleSubmit}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileLockRequest; 