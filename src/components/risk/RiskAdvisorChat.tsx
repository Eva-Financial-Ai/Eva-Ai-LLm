import React, { useState, useRef, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

// Available AI Risk models
const RISK_AI_MODELS = [
  { id: 'risk-analysis-default', name: 'Risk Analysis Default' },
  { id: 'industry-expert', name: 'Industry Expert' },
  { id: 'mitigation-specialist', name: 'Mitigation Specialist' },
  { id: 'compliance-expert', name: 'Compliance Expert' },
  { id: 'financial-risk-analyst', name: 'Financial Risk Analyst' }
];

// Example risk-related prompts
const RISK_EXAMPLE_PROMPTS = [
  "What are the key risk factors for this transaction?",
  "How can we mitigate the identified compliance risks?",
  "Compare this business's risk profile to industry benchmarks",
  "What additional documentation would strengthen this application?",
  "Recommend risk mitigation strategies for this specific case"
];

interface RiskAdvisorChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  mode?: 'mitigation' | 'benchmarking' | 'documentation' | 'general';
}

const RiskAdvisorChat: React.FC<RiskAdvisorChatProps> = ({ 
  isOpen, 
  onClose, 
  initialPrompt = '',
  mode = 'general'
}) => {
  const { currentTransaction } = useWorkflow();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hello! I\'m EVA Risk Advisor. I can help you analyze, understand, and mitigate risks for this transaction.',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(RISK_AI_MODELS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore - webkitSpeechRecognition is not in the types
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputValue(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Set initial prompt based on mode
  useEffect(() => {
    if (initialPrompt) {
      setInputValue(initialPrompt);
    } else {
      // Set default prompts based on mode
      switch (mode) {
        case 'mitigation':
          setInputValue("Please analyze the risk profile of this transaction and suggest mitigation strategies.");
          break;
        case 'benchmarking':
          setInputValue("How does this company's risk profile compare to industry benchmarks?");
          break;
        case 'documentation':
          setInputValue("What additional documentation would help reduce the risk of this transaction?");
          break;
        default:
          setInputValue("");
      }
    }
  }, [initialPrompt, mode]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Toggle voice recording
  const toggleVoiceRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileUploads(Array.from(e.target.files));
    }
  };

  // Trigger file upload
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const removeFile = (index: number) => {
    setFileUploads(prev => prev.filter((_, i) => i !== index));
  };

  // Send message
  const sendMessage = async () => {
    if (!inputValue.trim() && fileUploads.length === 0) return;
    
    const userMessageId = `user-${Date.now()}`;
    const aiMessageId = `ai-${Date.now()}`;
    
    // Add user message
    const userMessage: Message = {
      id: userMessageId,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: fileUploads.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }))
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setFileUploads([]);
    setIsLoading(true);
    
    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response based on transaction data and user query
      const aiResponseText = generateAIResponse(inputValue, mode, currentTransaction);
      
      // Add AI message
      const aiMessage: Message = {
        id: aiMessageId,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response', error);
      // Add error message
      const errorMessage: Message = {
        id: aiMessageId,
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI response based on input and transaction data
  const generateAIResponse = (input: string, mode: string, transaction: any): string => {
    // In a real implementation, this would call your AI service
    // For now, we'll simulate responses based on keywords and mode
    
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('mitigation') || mode === 'mitigation') {
      return `Based on my analysis of this transaction, here are recommended risk mitigation strategies:
      
1. **Credit Risk**: Require additional collateral or personal guarantees
2. **Operational Risk**: Implement quarterly financial reporting requirements
3. **Compliance Risk**: Verify and document all regulatory filings are current
4. **Market Risk**: Consider shorter loan term or adjustable rate structure

Would you like me to elaborate on any specific risk category?`;
    }
    
    if (lowerInput.includes('benchmark') || mode === 'benchmarking') {
      return `Industry Benchmarking Analysis:

• This company's leverage ratio (2.3x) is below industry average (3.1x) - POSITIVE
• Liquidity metrics are in the 65th percentile of peers - POSITIVE
• Revenue growth is in the 40th percentile - NEUTRAL
• Operating margin is in the 30th percentile - NEGATIVE

Overall: The business shows good financial stability but underperforms in profitability metrics. This suggests moderate risk with specific monitoring needed for cash flow and profitability.`;
    }
    
    if (lowerInput.includes('document') || mode === 'documentation') {
      return `To strengthen this application and reduce risk, I recommend requesting:

1. Accounts receivable aging report for the past 12 months
2. Detailed breakdown of any existing debt obligations
3. Customer concentration analysis (% revenue from top 5 clients)
4. Latest interim financial statements (if Q2 has ended)
5. Cash flow projections for the next 24 months

The AR aging and customer concentration data will be particularly valuable for assessing stability.`;
    }
    
    return `I've analyzed the transaction risk profile for ${transaction?.applicantData?.name || 'this applicant'}.

Key observations:
• Overall risk rating: ${transaction?.riskRating || 'Moderate'}
• Strengths: Strong business tenure (${transaction?.businessAge || '10+'} years), consistent revenue
• Concerns: ${transaction?.concernAreas || 'Industry volatility, moderate leverage'}

How would you like me to help with this risk assessment? I can provide mitigation strategies, industry comparisons, or documentation recommendations.`;
  };

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle prompt click
  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render file attachment
  const renderFileAttachment = (file: File, index: number) => {
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    return (
      <div key={`${file.name}-${index}`} className="flex items-center p-2 bg-gray-50 rounded-md mb-2">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded mr-2">
          {isImage ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ) : isPDF ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
        </div>
        <button 
          type="button" 
          onClick={() => removeFile(index)}
          className="ml-2 text-gray-400 hover:text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  // Render message attachments
  const renderMessageAttachments = (attachments: Message['attachments']) => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="inline-block mr-2 mb-2">
            <a
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100"
            >
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-900">{attachment.name}</p>
                <p className="text-xs text-gray-500">{Math.round(attachment.size / 1024)} KB</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl flex flex-col w-full max-w-3xl mx-4 h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium">EVA Risk Advisor</h3>
              <div className="flex items-center">
                <span className="bg-green-100 px-2 py-0.5 rounded-full text-xs text-green-800 font-medium">Active</span>
                <span className="mx-2 text-xs text-gray-500">•</span>
                <select
                  value={selectedModel.id}
                  onChange={(e) => {
                    const model = RISK_AI_MODELS.find(m => m.id === e.target.value);
                    if (model) setSelectedModel(model);
                  }}
                  className="text-xs bg-transparent border-none focus:ring-0 text-gray-500 px-0 py-0 font-medium"
                >
                  {RISK_AI_MODELS.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div 
                    className={`text-sm ${
                      message.sender === 'user' ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < message.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  {renderMessageAttachments(message.attachments)}
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Example prompts */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {RISK_EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          {/* File upload previews */}
          <div className="mb-2">
            {fileUploads.map((file, index) => renderFileAttachment(file, index))}
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={triggerFileUpload}
              className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-400 hover:text-gray-500"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </button>
            
            <button
              type="button"
              onClick={toggleVoiceRecording}
              className={`inline-flex items-center p-2 border border-transparent rounded-full ${
                isRecording ? 'text-red-500' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <div className="flex-1 rounded-md border border-gray-300 overflow-hidden focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 ml-2 bg-white">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about risk factors or mitigation strategies..."
                rows={1}
                className="block w-full py-2 pl-3 pr-10 resize-none border-0 bg-transparent focus:ring-0 sm:text-sm"
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading || (!inputValue.trim() && fileUploads.length === 0)}
              className={`inline-flex items-center justify-center p-2 ml-2 rounded-full ${
                isLoading || (!inputValue.trim() && fileUploads.length === 0)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAdvisorChat; 