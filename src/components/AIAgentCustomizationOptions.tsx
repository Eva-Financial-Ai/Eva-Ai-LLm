import React, { useState } from 'react';

export type FormatType = 'Email' | 'Formal Email' | 'Follow-up Email' | 'Risk Assessment Inquiry Email' | 
  'Essay' | 'Report' | 'Outline' | 'Paragraph' | 'Multi-Column' | 'Press Release' | 
  'Proposal' | 'To Do List' | 'Script';

export type ToneType = 'Formal' | 'Professional' | 'Casual' | 'Informational';
export type LengthType = 'Short' | 'Medium' | 'Long';

export interface DataOption {
  id: string;
  name: string;
  isSelected: boolean;
}

interface AIAgentCustomizationOptionsProps {
  selectedFormats: FormatType[];
  setSelectedFormats: (formats: FormatType[]) => void;
  selectedTone: ToneType;
  setSelectedTone: (tone: ToneType) => void;
  selectedLength: LengthType;
  setSelectedLength: (length: LengthType) => void;
  dataOptions: DataOption[];
  setDataOptions: (options: DataOption[]) => void;
  priorityFeatures: string;
  setPriorityFeatures: (value: string) => void;
  performanceGoals: string;
  setPerformanceGoals: (value: string) => void;
}

const AIAgentCustomizationOptions: React.FC<AIAgentCustomizationOptionsProps> = ({
  selectedFormats,
  setSelectedFormats,
  selectedTone,
  setSelectedTone,
  selectedLength,
  setSelectedLength,
  dataOptions,
  setDataOptions,
  priorityFeatures,
  setPriorityFeatures,
  performanceGoals,
  setPerformanceGoals
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('Email');

  const toggleFormat = (format: FormatType) => {
    setSelectedFormat(format);
    if (!selectedFormats.includes(format)) {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const clearSelectedFormat = () => {
    if (selectedFormats.length > 1) {
      // Remove the currently displayed format but keep at least one
      setSelectedFormats(selectedFormats.filter(f => f !== selectedFormat));
      setSelectedFormat(selectedFormats.filter(f => f !== selectedFormat)[0]);
    }
  };

  const toggleDataOption = (id: string) => {
    setDataOptions(dataOptions.map(option => 
      option.id === id ? { ...option, isSelected: !option.isSelected } : option
    ));
  };

  // Format options based on the screenshot
  const formatOptions = [
    { name: 'Formal Email', type: 'Email' },
    { name: 'Follow-up Email', type: 'Email' },
    { name: 'Risk Assessment Inquiry Email', type: 'Email' },
    { name: 'Essay', type: 'Document' }
  ];

  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-md">
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-md font-medium text-gray-800">Customization Options</h3>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-gray-500 transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isExpanded && (
        <div className="space-y-6">
          {/* Format */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-700">Format</h4>
            
            {/* Current selected format with clear button */}
            <div className="mb-4">
              <div className="p-3 border border-gray-300 rounded-md flex justify-between items-center bg-white">
                <span>{selectedFormat}</span>
                <button 
                  className="text-gray-500"
                  onClick={clearSelectedFormat}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Format options */}
            <div className="flex flex-wrap gap-2">
              {formatOptions.map((format) => (
                <button
                  key={format.name}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedFormats.includes(format.name as FormatType) 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  onClick={() => toggleFormat(format.name as FormatType)}
                >
                  {format.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-700">Tone</h4>
            <div className="flex flex-wrap gap-2">
              {['Formal', 'Professional', 'Casual', 'Informational'].map((tone) => (
                <button
                  key={tone}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedTone === tone 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  onClick={() => setSelectedTone(tone as ToneType)}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-gray-700">Length</h4>
            <div className="flex flex-wrap gap-2">
              {['Short', 'Medium', 'Long'].map((length) => (
                <button
                  key={length}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedLength === length 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  onClick={() => setSelectedLength(length as LengthType)}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Data/Feature Options */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Data Sources & Features</h4>
            <div className="space-y-2 bg-gray-50 p-3 rounded-md">
              {dataOptions.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={option.isSelected}
                    onChange={() => toggleDataOption(option.id)}
                    className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 rounded"
                  />
                  <label htmlFor={option.id} className="text-sm text-gray-700">{option.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Features */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Features to Prioritize</h4>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pr-8 border border-gray-300 rounded-md"
                value={priorityFeatures}
                onChange={(e) => setPriorityFeatures(e.target.value)}
                placeholder="Which features or data points do you want to prioritize in the model?"
              />
              {priorityFeatures && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setPriorityFeatures('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Performance Goals */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Performance Goals</h4>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 pr-8 border border-gray-300 rounded-md"
                value={performanceGoals}
                onChange={(e) => setPerformanceGoals(e.target.value)}
                placeholder="Do you have any specific performance metrics or goals for the model?"
              />
              {performanceGoals && (
                <button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setPerformanceGoals('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentCustomizationOptions; 