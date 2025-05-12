import React, { useState, useRef } from 'react';
import { XMarkIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface FormField {
  type: string;
  value: string;
  label: string;
  options?: string[];
}

interface AgentType {
  id: string;
  name: string;
}

interface AgentModel {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  tone: string;
  length: string;
  features: string[];
  performanceMetrics: string[];
  customProblem: string;
  imageUrl?: string;
}

interface CustomAgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agent: AgentModel) => void;
}

const AGENT_FORMATS = [
  { id: 'email', name: 'Email' },
  { id: 'formal-email', name: 'Formal Email' },
  { id: 'followup-email', name: 'Follow-up Email' },
  { id: 'risk-assessment-inquiry-email', name: 'Risk Assessment Inquiry Email' },
  { id: 'essay', name: 'Essay' },
  { id: 'report', name: 'Report' },
  { id: 'outline', name: 'Outline' },
  { id: 'paragraph', name: 'Paragraph' },
  { id: 'multi-column', name: 'Multi-Column' },
  { id: 'press-release', name: 'Press Release' },
  { id: 'proposal', name: 'Proposal' },
  { id: 'to-do-list', name: 'To Do List' },
  { id: 'script', name: 'Script' },
];

const AGENT_TONES = [
  { id: 'formal', name: 'Formal' },
  { id: 'professional', name: 'Professional' },
  { id: 'casual', name: 'Casual' },
  { id: 'informational', name: 'Informational' },
];

const AGENT_LENGTHS = [
  { id: 'short', name: 'Short' },
  { id: 'medium', name: 'Medium' },
  { id: 'long', name: 'Long' },
];

const AGENT_TYPES = [
  { id: 'customer-data', name: 'Customer Data' },
  { id: 'financial-data', name: 'Financial Data' },
  { id: 'central-bank-reporting', name: 'Central Bank Reporting' },
  { id: 'legal-compliance-data', name: 'Legal Compliance Data' },
  { id: 'marketing-data', name: 'Marketing Data' },
  { id: 'integrated-business-banking', name: 'Integrated Business Banking' },
  { id: 'predictive-lead-generation', name: 'Predictive Lead Generation' },
];

const CustomAgentCreationModal: React.FC<CustomAgentCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1);
  const [customizationOpen, setCustomizationOpen] = useState(true);
  const [modelName, setModelName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(AGENT_FORMATS[0].id);
  const [selectedTone, setSelectedTone] = useState(AGENT_TONES[0].id);
  const [selectedLength, setSelectedLength] = useState(AGENT_LENGTHS[0].id);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [features, setFeatures] = useState('');
  const [performanceMetrics, setPerformanceMetrics] = useState('');
  const [agentType, setAgentType] = useState('');
  const [customProblem, setCustomProblem] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState('/icons/ai-default-avatar.svg');

  const clearField = (setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter('');
  };

  const toggleCustomizationSection = () => {
    setCustomizationOpen(!customizationOpen);
  };

  const handleTypeSelection = (typeId: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const handleSubmit = () => {
    const agent: AgentModel = {
      id: `agent-${Date.now()}`,
      name: modelName,
      description: '',
      type: selectedTypes.join(','),
      format: selectedFormat,
      tone: selectedTone,
      length: selectedLength,
      features: features ? [features] : [],
      performanceMetrics: performanceMetrics ? [performanceMetrics] : [],
      customProblem: customProblem,
      imageUrl,
    };

    onSubmit(agent);
    resetForm();
  };

  const resetForm = () => {
    setModelName('');
    setSelectedFormat(AGENT_FORMATS[0].id);
    setSelectedTone(AGENT_TONES[0].id);
    setSelectedLength(AGENT_LENGTHS[0].id);
    setSelectedTypes([]);
    setFeatures('');
    setPerformanceMetrics('');
    setAgentType('');
    setCustomProblem('');
    setStep(1);
  };

  const isNextButtonDisabled = () => {
    if (step === 1) {
      return !modelName.trim();
    }
    return false;
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-md shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className={`rounded-full p-1 ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}
              disabled={step === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h2 className="text-xl font-medium">Create Custom AI</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium"
            >
              Delete
            </button>
            <button
              onClick={step < 3 ? handleNext : handleSubmit}
              disabled={isNextButtonDisabled()}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isNextButtonDisabled()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {step < 3 ? 'Next' : 'Create'}
            </button>
          </div>
        </div>

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Agent icon and name */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <img
                    src={imageUrl}
                    alt="Agent Icon"
                    className="w-16 h-16"
                    onError={() => setImageUrl('/icons/ai-default-avatar.svg')}
                  />
                </div>
                <div className="w-full max-w-md">
                  <label htmlFor="modelName" className="sr-only">
                    Model Name
                  </label>
                  <input
                    type="text"
                    id="modelName"
                    placeholder="Modal Name"
                    value={modelName}
                    onChange={e => setModelName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Customization Options Section */}
              <div className="mb-6">
                <button
                  onClick={toggleCustomizationSection}
                  className="w-full flex justify-between items-center mb-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  <span className="text-lg font-medium text-gray-800">Customization Options</span>
                  {customizationOpen ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {customizationOpen && (
                  <div className="space-y-4">
                    {step === 1 && (
                      <>
                        {/* Format Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Format
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {AGENT_FORMATS.map(format => (
                              <button
                                key={format.id}
                                onClick={() => setSelectedFormat(format.id)}
                                className={`px-3 py-2 rounded-full text-sm ${
                                  selectedFormat === format.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {format.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tone Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tone
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {AGENT_TONES.map(tone => (
                              <button
                                key={tone.id}
                                onClick={() => setSelectedTone(tone.id)}
                                className={`px-3 py-2 rounded-full text-sm ${
                                  selectedTone === tone.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {tone.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Length Options */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Length
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {AGENT_LENGTHS.map(length => (
                              <button
                                key={length.id}
                                onClick={() => setSelectedLength(length.id)}
                                className={`px-3 py-2 rounded-full text-sm ${
                                  selectedLength === length.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {length.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        {/* Features field */}
                        <div className="relative">
                          <label
                            htmlFor="features"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Which features or data points do you want to prioritize in the model?
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="features"
                              value={features}
                              onChange={e => setFeatures(e.target.value)}
                              placeholder="Enter features or data points"
                              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            />
                            {features && (
                              <button
                                onClick={() => clearField(setFeatures)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Performance Metrics field */}
                        <div className="relative">
                          <label
                            htmlFor="performanceMetrics"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Do you have any specific performance metrics or goals for the model?
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="performanceMetrics"
                              value={performanceMetrics}
                              onChange={e => setPerformanceMetrics(e.target.value)}
                              placeholder="Enter performance metrics or goals"
                              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            />
                            {performanceMetrics && (
                              <button
                                onClick={() => clearField(setPerformanceMetrics)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Agent Type field */}
                        <div className="relative">
                          <label
                            htmlFor="agentType"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            AI Type
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="agentType"
                              value={agentType}
                              onChange={e => setAgentType(e.target.value)}
                              placeholder="Enter AI type"
                              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            />
                            {agentType && (
                              <button
                                onClick={() => clearField(setAgentType)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        {/* Type Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Agent Type(s)
                          </label>
                          <div className="space-y-2">
                            {AGENT_TYPES.map(type => (
                              <div key={type.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`type-${type.id}`}
                                  checked={selectedTypes.includes(type.id)}
                                  onChange={() => handleTypeSelection(type.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`type-${type.id}`}
                                  className="ml-2 text-sm text-gray-700"
                                >
                                  {type.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Custom Problem field */}
                        <div className="mt-4">
                          <label
                            htmlFor="customProblem"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            What specific problem are you trying to solve with the custom model?
                          </label>
                          <textarea
                            id="customProblem"
                            value={customProblem}
                            onChange={e => setCustomProblem(e.target.value)}
                            rows={5}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Describe the problem you're trying to solve..."
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="w-1/3 border-l border-gray-200 bg-gray-50">
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Preview</h3>
              <div className="flex flex-col items-center" ref={previewRef}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <img
                    src={imageUrl}
                    alt="Agent Preview"
                    className="w-10 h-10"
                    onError={() => setImageUrl('/icons/ai-default-avatar.svg')}
                  />
                </div>
                <p className="text-center font-medium">{modelName || 'Test AI'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAgentCreationModal;
