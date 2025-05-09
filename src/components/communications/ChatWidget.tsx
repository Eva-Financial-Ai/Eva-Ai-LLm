import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { useWorkflow } from '../../contexts/WorkflowContext';

interface ChatWidgetProps {
  mode?: 'eva' | 'risk' | 'communications';
  initialPosition?: { x: number; y: number };
  isOpen?: boolean;
  zIndexBase?: number;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  mode = 'eva',
  initialPosition = { x: 0, y: 0 },
  isOpen: initialIsOpen = false,
  zIndexBase = 50,
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: 'user' | 'ai'; timestamp: Date }>
  >([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { currentTransaction } = useWorkflow();
  const [position, setPosition] = useState(initialPosition);
  const [zIndex, setZIndex] = useState(zIndexBase);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize with welcome message based on mode
  useEffect(() => {
    let welcomeMessage = '';
    if (mode === 'eva') {
      welcomeMessage = "Hello! I'm EVA, your AI assistant. How can I help you today?";
    } else if (mode === 'risk') {
      welcomeMessage =
        'Risk Advisor here. I can help identify and mitigate risks in your transaction.';
    } else {
      welcomeMessage =
        'Welcome to Clear Communications. How can I assist with your client interactions?';
    }

    setMessages([{ text: welcomeMessage, sender: 'ai', timestamp: new Date() }]);
  }, [mode]);

  // Listen for chat prompt events
  useEffect(() => {
    const handlePromptEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.prompt) {
        handleQuery(customEvent.detail.prompt);
      }
    };

    window.addEventListener('eva-ai-prompt', handlePromptEvent);

    return () => {
      window.removeEventListener('eva-ai-prompt', handlePromptEvent);
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle global click to manage z-index
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // If the chat widget receives a click, bring it to the front
      if (chatEndRef.current && chatEndRef.current.contains(e.target as Node)) {
        setZIndex(100); // Set to a higher z-index when selected
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, []);

  // Reset z-index when not dragging
  useEffect(() => {
    if (!isDragging) {
      // Delay to prevent flickering
      const timeout = setTimeout(() => {
        setZIndex(zIndexBase);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [isDragging, zIndexBase]);

  const getWelcomeMessage = () => {
    const contextMessage = currentTransaction
      ? `I see you're working on the ${currentTransaction.type || 'unknown'} transaction${currentTransaction.applicantData?.name ? ` for ${currentTransaction.applicantData.name}` : ''}.`
      : "I don't see an active transaction. Need help starting one?";

    return contextMessage;
  };

  const handleQuery = async (query: string) => {
    // Add user message
    setMessages(prevMessages => [
      ...prevMessages,
      { text: query, sender: 'user', timestamp: new Date() },
    ]);

    setIsLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      let response = '';

      if (mode === 'risk') {
        response = generateRiskResponse(query);
      } else if (mode === 'communications') {
        response = generateCommunicationsResponse(query);
      } else {
        response = generateEVAResponse(query);
      }

      setMessages(prevMessages => [
        ...prevMessages,
        { text: response, sender: 'ai', timestamp: new Date() },
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const generateRiskResponse = (query: string) => {
    if (query.toLowerCase().includes('risk')) {
      return "Based on my analysis, there are several risk factors to consider: 1) The borrower's debt-to-income ratio is above industry average, 2) Recent market volatility in this sector suggests higher than normal risk, 3) There are some regulatory compliance concerns that should be addressed before proceeding.";
    } else if (query.toLowerCase().includes('mitigate')) {
      return 'To mitigate these risks, I recommend: 1) Requiring additional collateral of at least 15%, 2) Implementing quarterly compliance reviews, 3) Setting up a contingency reserve of 5% of the total loan amount.';
    } else {
      return "I've analyzed the transaction risk profile. Would you like me to elaborate on specific risk factors or suggest mitigation strategies?";
    }
  };

  const generateCommunicationsResponse = (query: string) => {
    if (query.toLowerCase().includes('email') || query.toLowerCase().includes('message')) {
      return "I've drafted a clear and professional message addressing the client's concerns. Would you like me to show you the template now?";
    } else if (query.toLowerCase().includes('explain') || query.toLowerCase().includes('terms')) {
      return "Here's a simplified explanation of those terms you can share with the client: [Plain language explanation]. This keeps the information accurate while making it accessible.";
    } else {
      return 'I can help draft clear communications to the client or explain complex terms in accessible language. What specific assistance do you need?';
    }
  };

  const generateEVAResponse = (query: string) => {
    if (query.toLowerCase().includes('document') || query.toLowerCase().includes('upload')) {
      return 'To upload and manage documents, navigate to the Filelock Drive section. You can upload files by dragging and dropping them or clicking the upload button. All documents are securely stored and can be shared with appropriate permissions.';
    } else if (
      query.toLowerCase().includes('transaction') ||
      query.toLowerCase().includes('loan')
    ) {
      return "To create a new transaction, go to the Dashboard and click 'New Transaction'. You'll need to enter basic information about the borrower and loan terms. I can guide you through each step if you'd like.";
    } else {
      return "I'm here to help with any aspect of the EVA platform. I can assist with document management, transaction processing, risk assessment, or communications. What would you like to know more about?";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleQuery(inputText);
      setInputText('');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setZIndex(100); // Bring to front while dragging
  };

  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
    setIsDragging(false);
    // Keep it at the higher z-index briefly to prevent flickering
    setTimeout(() => {
      setZIndex(zIndexBase);
    }, 200);
  };

  const getButtonColor = () => {
    switch (mode) {
      case 'risk':
        return 'bg-red-600 hover:bg-red-700';
      case 'communications':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-primary-600 hover:bg-primary-700';
    }
  };

  const getButtonIcon = () => {
    switch (mode) {
      case 'risk':
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case 'communications':
        return (
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        );
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'risk':
        return 'Risk Advisor';
      case 'communications':
        return 'Clear Communications';
      default:
        return 'EVA AI Assistant';
    }
  };

  return (
    <Draggable
      handle=".chat-drag-handle"
      defaultPosition={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        className={`fixed bottom-4 right-4 transition-all duration-300 ${isOpen ? (mode === 'communications' ? 'w-3/4 md:w-2/3' : 'w-3/4 md:w-2/3') : 'w-auto'}`}
        style={{ zIndex }}
      >
        {isOpen ? (
          <div
            className={`flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 ${mode === 'communications' ? 'h-[600px]' : 'h-[600px]'}`}
            onMouseDown={() => setZIndex(100)} // Bring to front when clicked
          >
            {/* Chat header with drag handle */}
            <div
              className={`${mode === 'risk' ? 'bg-red-600' : mode === 'communications' ? 'bg-blue-600' : 'bg-primary-600'} px-4 py-3 flex justify-between items-center chat-drag-handle cursor-move`}
            >
              <h3 className="text-white font-medium flex items-center">
                {getButtonIcon()}
                <span className="ml-2">{getTitle()}</span>
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <div key={index} className={`mb-3 ${message.sender === 'user' ? 'ml-auto' : ''}`}>
                  <div
                    className={`p-3 rounded-lg inline-block max-w-xs ${
                      message.sender === 'user'
                        ? 'bg-primary-100 text-primary-800 rounded-br-none'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                  <div
                    className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center mb-3">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className={`px-4 py-2 text-white rounded-r-md ${getButtonColor()} disabled:opacity-50`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className={`rounded-full p-3 text-white shadow-lg ${getButtonColor()}`}
            aria-label="Open chat"
          >
            {getButtonIcon()}
          </button>
        )}
      </div>
    </Draggable>
  );
};

export default ChatWidget;
