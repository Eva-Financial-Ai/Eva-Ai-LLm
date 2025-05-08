import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
// @ts-ignore
import { animated, useSpring } from '@react-spring/web';
import { useWorkflow, Transaction } from '../contexts/WorkflowContext';
// @ts-ignore
import { ErrorBoundary } from 'react-error-boundary';
import { 
  performCreditAnalysis, 
  getChatResponse,
  getChatResponseDebounced,
  clearAnalysisCache,
  ModelContextProtocol, 
  Message as ApiMessage 
} from '../api/creditAnalysisApi';

// --- Types (from RiskAdvisorChat) ---
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

// Type for a single message attachment
type MessageAttachmentType = {
  name: string;
  type: string;
  size: number;
  url: string;
};
// Lazy-loaded components
const ChatMessageList = lazy(() => import('./common/ChatMessageList'));
const ModelSelector = lazy(() => import('./common/ModelSelector'));

// --- Constants (from RiskAdvisorChat) ---
const RISK_AI_MODELS = [
  { id: 'risk-analysis-default', name: 'Risk Analysis Default' },
  { id: 'industry-expert', name: 'Industry Expert' },
  { id: 'mitigation-specialist', name: 'Mitigation Specialist' },
  { id: 'compliance-expert', name: 'Compliance Expert' },
  { id: 'financial-risk-analyst', name: 'Financial Risk Analyst' }
];

const RISK_EXAMPLE_PROMPTS = [
  "Provide insights into my portfolio's credit analysis.",
  "Summarize decisions made by individual operators.",
  "Give an overview of originations, monitoring, and servicing risks.",
  "What are the key risk factors for this transaction?",
  "How can we mitigate the identified compliance risks?",
  "Compare this business's risk profile to industry benchmarks",
];

// --- Component Props ---
interface CreditAnalysisChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Extracted Components for Better Performance ---
const ExamplePrompt = React.memo(({ prompt, onClick }: { prompt: string; onClick: (prompt: string) => void }) => (
  <button
    type="button"
    onClick={() => onClick(prompt)}
    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded truncate"
  >
    {prompt}
  </button>
));

const FileAttachment = React.memo(({ file, index, onRemove }: { 
  file: File; 
  index: number; 
  onRemove: (index: number) => void 
}) => {
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  
  return (
    <div className="flex items-center p-2 bg-gray-50 rounded-md mb-2">
      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded mr-2">
        {isImage ? (
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        ) : isPDF ? (
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        ) : (
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
      </div>
      <button type="button" onClick={() => onRemove(index)} className="ml-2 text-gray-400 hover:text-gray-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
});

const MessageAttachment = React.memo(({ attachment }: { attachment: MessageAttachmentType }) => (
  <a
    href={attachment.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100"
  >
    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
    <div>
      <p className="text-xs font-medium text-gray-900">{attachment.name}</p>
      <p className="text-xs text-gray-500">{Math.round(attachment.size / 1024)} KB</p>
    </div>
  </a>
));

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-500 rounded-md bg-red-50 text-red-700">
    <h2 className="text-lg font-medium mb-2">Something went wrong:</h2>
    <p className="mb-3">{error.message}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
    >
      Try again
    </button>
  </div>
);

// Add custom transaction properties that are not in the original Transaction type
interface EnhancedTransaction extends Transaction {
  debtType?: string;
  financialData?: any;
  collateralInfo?: any;
  guarantorInfo?: any;
}

// --- Main Component ---
const CreditAnalysisChatInterface: React.FC<CreditAnalysisChatProps> = ({ 
  isOpen, 
  onClose, 
}) => {
  // --- State Variables ---
  const { currentTransaction } = useWorkflow();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [userId, setUserId] = useState('user-123'); // Would come from auth context in a real app
  
  // Cast the transaction to include our additional properties
  const enhancedTransaction = currentTransaction as EnhancedTransaction | null;
  
  // Chat state (from RiskAdvisorChat)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Hello! I\'m EVA, your Credit Analysis Assistant. Run the analysis or ask me anything about portfolio insights, operator decisions, or lifecycle risks (originations, monitoring, servicing).',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(RISK_AI_MODELS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  
  // --- Refs ---
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // --- Animation ---
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 280, friction: 60 }
  });

  // --- Effects ---
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
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

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (analysisResults) {
      const summaryText = `Analysis Complete.
Overall Risk Score: ${analysisResults.overallRiskScore}/100
Key Metrics:
  - DSCR: ${analysisResults.ratios.leverage.find((r:any) => r.name === 'Debt Service Coverage Ratio')?.value || 'N/A'}x
  - D/E: ${analysisResults.ratios.leverage.find((r:any) => r.name === 'Debt to Equity')?.value || 'N/A'}x
Recommendations: ${analysisResults.recommendations.length} actions suggested.

Ask me for details, mitigation strategies, or portfolio comparisons.`;

      const analysisMessage: Message = {
        id: `analysis-${Date.now()}`,
        text: summaryText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMessage]);
    }
  }, [analysisResults]);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      // Clean up object URLs to prevent memory leaks
      messages.forEach(message => {
        if (message.attachments) {
          message.attachments.forEach(attachment => {
            if (attachment.url.startsWith('blob:')) {
              URL.revokeObjectURL(attachment.url);
            }
          });
        }
      });
      
      // Clear any pending debounced calls
      getChatResponseDebounced.cancel();
    };
  }, [messages]);

  // --- Core Functions ---
  const runFinancialAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    const startMessage: Message = {
      id: `analysis-start-${Date.now()}`,
      text: 'Running credit analysis using EVA...',
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, startMessage]);

    try {
      // Clear any cached analysis first
      clearAnalysisCache();
      
      // Prepare context object for the API
      const context: ModelContextProtocol = {
        requestType: 'analysis',
        userId: userId,
        transactionId: currentTransaction?.id || undefined,
        debtType: (currentTransaction as any)?.debtType || '45322', // Default to equipment financing if not specified
        financialData: (currentTransaction as any)?.financialData || {},
        collateralInfo: (currentTransaction as any)?.collateralInfo || {},
        guarantorInfo: (currentTransaction as any)?.guarantorInfo || {}
      };
      
      // Make the API call
      const result = await performCreditAnalysis(context);
      
      if (result.error) {
        // Handle error
        const errorMessage: Message = {
          id: `analysis-error-${Date.now()}`,
          text: `Error during analysis: ${result.error}`,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        // Success - store the result
        setAnalysisResults(result);
      }
    } catch (error) {
      console.error('Error running financial analysis:', error);
      const errorMessage: Message = {
        id: `analysis-error-${Date.now()}`,
        text: 'Sorry, I encountered an error while running the analysis. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userId, currentTransaction]);
  
  const sendMessage = useCallback(() => {
    if (!inputValue.trim() && fileUploads.length === 0) return;
    
    const userMessageId = `user-${Date.now()}`;
    
    // Create user message object
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
    
    // Update the UI with the user's message
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setFileUploads([]);
    setIsLoading(true);
    
    // Process message with debounce
    getChatResponseDebounced(
      {
        requestType: 'chat',
        userId: userId,
        transactionId: currentTransaction?.id,
        modelId: selectedModel.id,
        message: currentInput,
        messageHistory: messages.map(msg => ({
          id: msg.id,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
          attachments: msg.attachments
        })),
        attachments: fileUploads
      },
      (response) => {
        setIsLoading(false);
        
        if (response.error) {
          // Handle error
          const errorMessage: Message = {
            id: response.messageId || `error-${Date.now()}`,
            text: response.error,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        } else {
          // Create AI message from response
          const aiMessage: Message = {
            id: response.messageId,
            text: response.text,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      }
    );
  }, [inputValue, fileUploads, userId, currentTransaction, selectedModel, messages]);

  // --- Event Handlers ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => { 
    setInputValue(e.target.value); 
  }, []);
  
  const toggleVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
      } else {
        recognitionRef.current.start();
        setIsRecording(true);
      }
    }
  }, [isRecording]);
  
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileUploads(prev => [...prev, ...Array.from(e.target.files!)]);
    }
    // Reset file input value to allow uploading the same file again
    if (e.target) e.target.value = '';
  }, []);
  
  const triggerFileUpload = useCallback(() => { 
    fileInputRef.current?.click(); 
  }, []);
  
  const removeFile = useCallback((index: number) => {
    setFileUploads(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => { 
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage(); 
    } 
  }, [sendMessage]);
  
  const handlePromptClick = useCallback((prompt: string) => { 
    setInputValue(prompt); 
    inputRef.current?.focus(); 
  }, []);

  // --- Helper Functions ---
  const handleExportReport = useCallback(async () => {
    if (!analysisResults) return;
    
    setIsExporting(true);
    
    try {
      // In a real application, you'd call an API endpoint to generate and download a PDF report
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const exportData = {
        filename: `Financial_Analysis_${currentDate()}.pdf`,
        data: analysisResults,
        timestamp: new Date().toISOString()
      };
      
      console.log('Exporting report:', exportData);
      
      // In a real app, this would trigger a file download
      alert(`Report exported successfully as ${exportData.filename}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [analysisResults]);
  
  const currentDate = useCallback(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, []);

  // --- Render Functions ---
  const renderFileAttachments = useCallback(() => {
    return fileUploads.map((file, index) => (
      <FileAttachment 
        key={`${file.name}-${index}`}
        file={file}
        index={index}
        onRemove={removeFile}
      />
    ));
  }, [fileUploads, removeFile]);
  
  const renderMessageAttachments = useCallback((attachments: Message['attachments']) => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="inline-block mr-2 mb-2">
            <MessageAttachment attachment={attachment} />
          </div>
        ))}
      </div>
    );
  }, []);

  // --- Component Return ---
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Main modal */}
      <div 
        style={{
          opacity: modalAnimation.opacity.toString(),
          transform: modalAnimation.transform.toString()
        }}
        className="relative bg-white rounded-lg shadow-xl flex flex-col w-full max-w-4xl mx-4 h-[85vh] overflow-hidden"
      >
        {/* Header (Combined/Simplified) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
             <div className="bg-primary-100 rounded-full p-2 mr-3">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
             </div>
            <div>
              <h3 className="text-lg font-medium">Credit Analysis Assistant (EVA)</h3>
              <div className="flex items-center">
                 {/* Simplified header info - can add model selector back if needed */}
                 <span className="bg-green-100 px-2 py-0.5 rounded-full text-xs text-green-800 font-medium">Active</span>
                 <span className="ml-2 text-xs text-gray-500">Using: {selectedModel.name}</span> 
              </div>
            </div>
          </div>
           {/* Header Buttons (Run Analysis, Export) */}
           <div className="flex items-center space-x-2">
             <button
               onClick={runFinancialAnalysis}
               disabled={isAnalyzing || isLoading}
               className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                 isAnalyzing || isLoading
                   ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                   : 'bg-primary-600 text-white hover:bg-primary-700'
               }`}
             >
               {isAnalyzing ? (
                 <><div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-1"></div> Analyzing...</>
               ) : (
                 <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> Run Analysis</>
               )}
             </button>
             <button
               onClick={handleExportReport}
               disabled={!analysisResults || isExporting}
               className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                 !analysisResults || isExporting
                   ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                   : 'bg-gray-800 text-white hover:bg-gray-900'
               }`}
             >
               {isExporting ? (
                 <><div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full mr-1"></div> Exporting...</>
               ) : (
                 <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Export Report</>
               )}
             </button>
             <button 
               type="button"
               onClick={onClose}
               className="text-gray-400 hover:text-gray-500 p-1 ml-2"
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
        </div>

        {/* Chat Messages Area */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg p-3 shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </div>
                    {renderMessageAttachments(message.attachments)}
                    <div className={`text-xs mt-1 text-right ${
                        message.sender === 'user' ? 'text-primary-100' : 'text-gray-400'
                      }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ErrorBoundary>

        {/* Example Prompts */}
        <div className="px-4 py-2 border-t border-gray-100 bg-white">
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1">Suggested questions:</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {RISK_EXAMPLE_PROMPTS.map((prompt, index) => (
                <ExamplePrompt 
                  key={index} 
                  prompt={prompt} 
                  onClick={handlePromptClick} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* File Attachments */}
        {fileUploads.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-500 mb-1">Attachments:</p>
            <div className="space-y-2">
              {renderFileAttachments()}
            </div>
          </div>
        )}
        
        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or question..."
              className="w-full pl-4 pr-20 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <div className="absolute right-3 bottom-3 flex space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                hidden
              />
              <button
                type="button"
                onClick={triggerFileUpload}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-1.5 ${isRecording ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded-full`}
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
              <button
                type="button"
                onClick={sendMessage}
                className={`p-1.5 text-white bg-primary-600 hover:bg-primary-700 rounded-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CreditAnalysisChatInterface); 