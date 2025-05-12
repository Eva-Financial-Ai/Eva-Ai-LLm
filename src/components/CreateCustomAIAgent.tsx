import React, { useState, useRef } from 'react';
import AIAgentCustomizationOptions, { 
  FormatType, 
  ToneType, 
  LengthType,
  DataOption
} from './AIAgentCustomizationOptions';

interface CustomAIAgentProps {
  onCancel: () => void;
  onSave: (agentConfig: any) => void;
}

interface KnowledgeBaseFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const CreateCustomAIAgent: React.FC<CustomAIAgentProps> = ({ onCancel, onSave }) => {
  const [modelName, setModelName] = useState('Test AI');
  const [fullName, setFullName] = useState('');
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<FormatType[]>(['Email']);
  const [selectedTone, setSelectedTone] = useState<ToneType>('Formal');
  const [selectedLength, setSelectedLength] = useState<LengthType>('Short');
  const [priorityFeatures, setPriorityFeatures] = useState('');
  const [performanceGoals, setPerformanceGoals] = useState('');
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeBaseFile[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const knowledgeFileInputRef = useRef<HTMLInputElement>(null);
  
  // Data options
  const [dataOptions, setDataOptions] = useState<DataOption[]>([
    { id: 'customer-data', name: 'Customer Data', isSelected: false },
    { id: 'financial-data', name: 'Financial Data', isSelected: false },
    { id: 'central-bank-reporting', name: 'Central Bank Reporting', isSelected: false },
    { id: 'legal-compliance-data', name: 'Legal Compliance Data', isSelected: false },
    { id: 'mortgage-data', name: 'Mortgage Data', isSelected: false },
    { id: 'image-document-parsing', name: 'Image/Document Parsing', isSelected: false },
    { id: 'predictive-lead-generation', name: 'Predictive Lead Generation', isSelected: false },
  ]);

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKnowledgeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: KnowledgeBaseFile[] = Array.from(files).map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      
      setKnowledgeFiles([...knowledgeFiles, ...newFiles]);
    }
    
    // Reset the input to allow re-uploading the same file
    if (knowledgeFileInputRef.current) {
      knowledgeFileInputRef.current.value = '';
    }
  };

  const removeKnowledgeFile = (fileId: string) => {
    setKnowledgeFiles(knowledgeFiles.filter(file => file.id !== fileId));
  };

  const handleDelete = () => {
    onCancel();
  };

  const handleCreate = () => {
    const agentConfig = {
      id: `custom-agent-${Date.now()}`,
      name: modelName,
      fullName: fullName || modelName,
      icon: iconPreview,
      formats: selectedFormats,
      tone: selectedTone,
      length: selectedLength,
      priorityFeatures,
      performanceGoals,
      dataOptions: dataOptions.filter(option => option.isSelected).map(option => option.id),
      knowledgeBase: knowledgeFiles.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type
      }))
    };
    
    onSave(agentConfig);
  };

  const toggleCustomizationOptions = () => {
    setIsExpanded(!isExpanded);
  };

  // Define the Format options based on the UI screenshot
  const formatOptions = [
    { category: 'Email', options: ['Formal Email', 'Follow-up Email', 'Risk Assessment Inquiry Email', 'Essay'] }
  ];

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <button onClick={onCancel} className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-medium text-gray-800">Create Custom Ai</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDelete}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
            >
              Delete
            </button>
            <button 
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[500px]">
          {/* Left side */}
          <div className="w-1/2 p-6 overflow-y-auto">
            {/* Agent Icon & Name */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                {iconPreview ? (
                  <img src={iconPreview} alt="Agent Icon" className="w-full h-full object-cover" />
                ) : (
                  <img src="/brain-icon.svg" alt="Agent Icon" className="w-16 h-16 object-contain" />
                )}
              </div>
              <input 
                type="file" 
                id="agent-icon" 
                className="hidden" 
                accept="image/*" 
                onChange={handleIconUpload} 
                ref={fileInputRef}
              />
            </div>

            {/* Model Name Input with Label */}
            <div className="mb-6">
              <label htmlFor="model-name" className="block text-xs text-gray-500 mb-1">Modal Name</label>
              <input
                type="text"
                id="model-name"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={modelName}
                onChange={(e) => {
                  setModelName(e.target.value);
                  if (!fullName) setFullName(e.target.value);
                }}
                placeholder="Test AI"
              />
            </div>

            {/* Customization Options */}
            <div className="mb-6 bg-gray-100 p-4 rounded-md">
              <div 
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={toggleCustomizationOptions}
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
                    
                    {/* Format selection showing the selected format with X button */}
                    <div className="mb-4">
                      <div className="p-3 border border-gray-300 rounded-md flex justify-between items-center">
                        <span>Email</span>
                        <button className="text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Format options */}
                    <div className="flex flex-wrap gap-2">
                      {formatOptions[0].options.map((format) => (
                        <button
                          key={format}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selectedFormats.includes(format as FormatType) 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : 'bg-white text-gray-700 border-gray-300'
                          }`}
                          onClick={() => {
                            if (selectedFormats.includes(format as FormatType)) {
                              setSelectedFormats(selectedFormats.filter(f => f !== format as FormatType));
                            } else {
                              setSelectedFormats([...selectedFormats, format as FormatType]);
                            }
                          }}
                        >
                          {format}
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
                </div>
              )}
            </div>

            {/* Priority Features Input */}
            <div className="mb-4">
              <div className="p-3 border border-gray-300 rounded-md flex justify-between items-center">
                <input
                  type="text"
                  className="w-full outline-none"
                  value={priorityFeatures}
                  onChange={(e) => setPriorityFeatures(e.target.value)}
                  placeholder="Which features or data points do you want to prioritize in the model?"
                />
                {priorityFeatures && (
                  <button 
                    className="text-gray-500"
                    onClick={() => setPriorityFeatures('')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Performance Goals Input */}
            <div className="mb-4">
              <div className="p-3 border border-gray-300 rounded-md flex justify-between items-center">
                <input
                  type="text"
                  className="w-full outline-none"
                  value={performanceGoals}
                  onChange={(e) => setPerformanceGoals(e.target.value)}
                  placeholder="Do you have any specific performance metrics or goals for the model?"
                />
                {performanceGoals && (
                  <button 
                    className="text-gray-500"
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

          {/* Right side - Preview */}
          <div className="w-1/2 bg-gray-50 p-6 border-l flex flex-col">
            <h3 className="text-lg font-medium mb-6 text-gray-800">Preview</h3>
            
            <div className="flex-1 flex flex-col justify-between">
              {/* Agent Preview */}
              <div className="flex justify-center pt-8">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  {iconPreview ? (
                    <img src={iconPreview} alt="Agent Icon" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <img src="/brain-icon.svg" alt="Agent Icon" className="w-12 h-12 object-contain" />
                  )}
                </div>
              </div>
              
              {/* Chat Input */}
              <div className="mt-auto border-t pt-4">
                <div className="flex items-center gap-2">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <input
                    type="text"
                    className="w-full p-2 outline-none"
                    placeholder="Enter a prompt here and ask me something..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button className="text-blue-500 px-2 flex items-center gap-1">
                    Send
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCustomAIAgent; 