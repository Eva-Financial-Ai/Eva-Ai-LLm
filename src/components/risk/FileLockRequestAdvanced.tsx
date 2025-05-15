import React, { useState } from 'react';
import { LockClosedIcon, XMarkIcon, CheckIcon, DocumentIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Define file types and period options
type FileType = 'Balance Sheet' | 'Tax Returns' | 'Bank Statements' | 'Profit & Loss Statement' | 'Proof Of Ownership';
type PeriodType = '3 Month' | '6 Month' | '1 Year' | 'YTD' | 'MTD';
type DocumentType = 'EXT' | 'MTD' | 'YTD';
type FormCode = 'UCC-1' | 'UCC-3' | 'UCC-5';

interface FormType {
  formCode: FormCode;
  formName: string;
  type: string;
  createdBy: string;
  period?: PeriodType;
  isSelected: boolean;
}

interface StepperStep {
  label: string;
  isComplete: boolean;
  isActive: boolean;
}

interface FileLockRequestAdvancedProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onRequestComplete?: (selectedForms: FormType[]) => void;
}

const FileLockRequestAdvanced: React.FC<FileLockRequestAdvancedProps> = ({ 
  position = 'bottom-right',
  onRequestComplete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<StepperStep[]>([
    { label: 'Application', isComplete: true, isActive: false },
    { label: 'Organization/Person', isComplete: true, isActive: false },
    { label: 'Form Type Selection', isComplete: false, isActive: true },
    { label: 'Deadline', isComplete: false, isActive: false }
  ]);
  
  const [selectedFormCategory, setSelectedFormCategory] = useState<string>('UCC');
  const [selectedForms, setSelectedForms] = useState<FormType[]>([
    { formCode: 'UCC-1', formName: 'Financing Statement', type: 'Lien Filing', createdBy: 'Hakan Isler', period: undefined, isSelected: false },
    { formCode: 'UCC-3', formName: 'Financing Statement Amendment', type: 'Lien Update', createdBy: 'Hakan Isler', period: undefined, isSelected: false },
    { formCode: 'UCC-5', formName: 'Information Statement', type: 'Notice/Correction', createdBy: 'Hakan Isler', period: '3 Month', isSelected: true },
    { formCode: 'UCC-1', formName: 'Request for Information/Copies', type: 'Information Statement', createdBy: 'System', period: undefined, isSelected: false }
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
  
  const handleFormSelect = (index: number) => {
    const updatedForms = [...selectedForms];
    updatedForms[index].isSelected = !updatedForms[index].isSelected;
    setSelectedForms(updatedForms);
  };
  
  const handlePeriodChange = (index: number, period: PeriodType) => {
    const updatedForms = [...selectedForms];
    updatedForms[index].period = period;
    setSelectedForms(updatedForms);
  };

  const handleFormCategoryChange = (category: string) => {
    setSelectedFormCategory(category);
  };
  
  const handleNext = () => {
    const currentStepIndex = steps.findIndex(step => step.isActive);
    if (currentStepIndex < steps.length - 1) {
      const updatedSteps = [...steps];
      updatedSteps[currentStepIndex].isActive = false;
      updatedSteps[currentStepIndex].isComplete = true;
      updatedSteps[currentStepIndex + 1].isActive = true;
      setSteps(updatedSteps);
    } else {
      if (onRequestComplete) {
        onRequestComplete(selectedForms.filter(form => form.isSelected));
      }
      setIsOpen(false);
    }
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
            <div className="relative bg-white rounded-lg max-w-4xl w-full mx-auto shadow-xl transform transition-all">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-medium text-gray-900">Filelock Request</h2>
                <button onClick={toggleModal} className="text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Stepper */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  {steps.map((step, index) => (
                    <React.Fragment key={index}>
                      {/* Step circle */}
                      <div className="relative flex items-center justify-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                            ${step.isComplete ? 'bg-primary-600 border-primary-600' : step.isActive ? 'border-primary-600 text-primary-600' : 'border-gray-300 text-gray-300'}`}
                        >
                          {step.isComplete ? (
                            <CheckIcon className="h-6 w-6 text-white" />
                          ) : (
                            <span className={`text-sm font-medium ${step.isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-6 w-max text-xs font-medium text-gray-500">{step.label}</div>
                      </div>
                      
                      {/* Connector line */}
                      {index < steps.length - 1 && (
                        <div 
                          className={`flex-1 h-0.5 mx-2 ${step.isComplete ? 'bg-primary-600' : 'bg-gray-300'}`}
                        ></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Form selection dropdown */}
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filelock Request</label>
                  <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    <option>Balance Sheet {'{Period Time}'}</option>
                  </select>
                </div>
                
                {/* Form Category Tabs */}
                <div className="mb-6">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`py-3 px-4 font-medium text-sm ${selectedFormCategory === 'UCC' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleFormCategoryChange('UCC')}
                    >
                      Uniform Commercial Code (UCC) Forms
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">1</span>
                    </button>
                    <button
                      className={`py-3 px-4 font-medium text-sm ${selectedFormCategory === 'SBA' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleFormCategoryChange('SBA')}
                    >
                      Small Business Administration (SBA) Forms
                    </button>
                    <button
                      className={`py-3 px-4 font-medium text-sm ${selectedFormCategory === 'IRS' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleFormCategoryChange('IRS')}
                    >
                      Internal Revenue Service (IRS) Forms
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">2</span>
                    </button>
                  </div>
                </div>
                
                {/* Form table */}
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="w-12 py-3 pl-4"></th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Code</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create by</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedForms.map((form, index) => (
                        <tr key={index} className={form.isSelected ? 'bg-blue-50' : ''}>
                          <td className="py-3 pl-4">
                            <input
                              type="checkbox"
                              checked={form.isSelected}
                              onChange={() => handleFormSelect(index)}
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{form.formCode}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{form.formName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{form.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{form.createdBy}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            {form.isSelected && (
                              <select
                                value={form.period || '3 Month'}
                                onChange={(e) => handlePeriodChange(index, e.target.value as PeriodType)}
                                className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm"
                              >
                                <option value="3 Month">3 Month</option>
                                <option value="6 Month">6 Month</option>
                                <option value="1 Year">1 Year</option>
                                <option value="YTD">YTD</option>
                                <option value="MTD">MTD</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <div className="text-sm text-gray-500">
                  1 Application, 2 People, 1 Safe Form
                </div>
                <button 
                  onClick={handleNext}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Select & Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileLockRequestAdvanced; 