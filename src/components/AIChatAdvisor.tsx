import React, { useState, useRef, useEffect } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';
import ThirdPartyAuthModal from './ThirdPartyAuthModal';
import DocumentUploadModal from './DocumentUploadModal';
import PlaidLinkModal from './PlaidLinkModal';
import StripeConnectModal from './StripeConnectModal';

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

// Available AI models
const AI_MODELS = [
  { id: 'eva-default', name: 'EVA Default' },
  { id: 'document-specialist', name: 'Document Specialist' },
  { id: 'risk-analyst', name: 'Risk Analyst' },
  { id: 'deal-structuring', name: 'Deal Structuring Expert' },
  { id: 'finance-specialist', name: 'Finance Specialist' },
  { id: 'document-verification', name: 'Document Verification' },
  { id: 'data-orchestration', name: 'Data Orchestration' },
];

// Custom event interface
interface EVAAIPromptEvent extends CustomEvent {
  detail: {
    prompt: string;
  };
}

const EXAMPLE_PROMPTS = [
  'How do I prepare financial statements for my application?',
  'What documents are required for equipment financing?',
  "Can you analyze my applicant's credit profile?",
  'What are typical rates for this transaction type?',
  'Help me structure this deal for optimal approval',
  'I need to verify some documents',
  'Help me orchestrate data for this transaction',
];

// Define some preset sizes
const CHAT_SIZES = [
  { name: 'sm', width: '350px', height: '500px' },
  { name: 'md', width: '450px', height: '600px' },
  { name: 'lg', width: '600px', height: '700px' },
  { name: 'xl', width: '60vw', height: '70vh' },
];

// Define interfaces needed for data orchestration
interface MethodDetails {
  id: string;
  name: string;
  icon: string;
  description: string;
  details: string;
  isConnected: boolean;
  connectionDetails?: any;
  documentUploads?: any[];
}

interface DocumentUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  uploaded: Date;
  status: 'processing' | 'complete' | 'error';
  documentType: string;
}

interface IntegrationConfig {
  enabled: boolean;
  config?: Record<string, any>;
}

const AIChatAdvisor: React.FC = () => {
  const { currentTransaction } = useWorkflow();
  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello! I'm EVA, your AI broker assistant. How can I help you with this transaction today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [chatHeight, setChatHeight] = useState(CHAT_SIZES[3].height);
  const [chatWidth, setChatWidth] = useState(CHAT_SIZES[3].width);
  const [resizing, setResizing] = useState(false);
  const [currentSizePreset, setCurrentSizePreset] = useState(3); // XL by default

  // State to track which direction we're resizing
  const [resizeDirection, setResizeDirection] = useState<'nw' | 'ne' | 'sw' | 'se' | null>(null);

  // Added state for positioning
  const [position, setPosition] = useState({ x: 8, y: 8 }); // right: 8, bottom: 8
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number; mouseX: number; mouseY: number } | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(
    null
  );

  // Data orchestration related states
  const [dataOrchestrationActive, setDataOrchestrationActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<any>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState('');
  const [collectionMethods, setCollectionMethods] = useState<Record<string, MethodDetails>>({
    document_upload: {
      id: 'document_upload',
      name: 'Document Upload',
      icon: '📄',
      description: 'Upload financial documents with AI OCR processing',
      details:
        'Upload documents for intelligent extraction using our advanced OCR engine. We support various formats including PDF, JPG, PNG and TIFF.',
      isConnected: false,
      documentUploads: [],
    },
    erp_connect: {
      id: 'erp_connect',
      name: 'ERP System',
      icon: '🏢',
      description: 'Connect to your ERP system via secure API',
      details:
        'Direct integration with major ERP systems including SAP, Oracle, Microsoft Dynamics, and NetSuite.',
      isConnected: false,
    },
    accounting_connect: {
      id: 'accounting_connect',
      name: 'Accounting Software',
      icon: '💼',
      description: 'Connect to QuickBooks, Xero, or other accounting systems',
      details:
        'Seamlessly sync with your accounting software to import financial data, invoices, and payment history.',
      isConnected: false,
    },
    banking_connect: {
      id: 'banking_connect',
      name: 'Banking Data',
      icon: '🏦',
      description: 'Connect bank accounts via Plaid integration',
      details:
        'Securely connect to 11,000+ financial institutions to retrieve account data, transactions, and balances.',
      isConnected: false,
    },
    payment_connect: {
      id: 'payment_connect',
      name: 'Payment Processors',
      icon: '💳',
      description: 'Connect to Stripe, Square, or PayPal',
      details:
        'Import transaction history, revenue data, and customer information from your payment processors.',
      isConnected: false,
    },
    credit_bureau: {
      id: 'credit_bureau',
      name: 'Credit Bureau',
      icon: '📊',
      description: 'Retrieve credit reports and scores',
      details:
        'Access comprehensive credit data from major credit bureaus with customer authorization.',
      isConnected: false,
    },
  });

  // Auth providers for data orchestration
  const authProviders = {
    erp_connect: {
      name: 'ERP System',
      description: 'Provide your ERP system credentials to establish secure API connection',
      fields: [
        {
          name: 'system',
          label: 'ERP System',
          type: 'text',
          required: true,
          placeholder: 'e.g., SAP, Oracle, Dynamics',
        },
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        {
          name: 'instanceUrl',
          label: 'Instance URL',
          type: 'text',
          required: true,
          placeholder: 'https://your-erp-instance.com',
        },
      ],
    },
    accounting_connect: {
      name: 'Accounting Software',
      description: 'Connect to your accounting software to import financial data',
      fields: [
        {
          name: 'provider',
          label: 'Provider',
          type: 'text',
          required: true,
          placeholder: 'QuickBooks, Xero, etc.',
        },
        { name: 'username', label: 'Username/Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
      ],
    },
    banking_connect: {
      name: 'Banking Data',
      description: 'Connect to your financial institution via secure Plaid integration',
      fields: [
        { name: 'institution', label: 'Financial Institution', type: 'text', required: true },
        { name: 'username', label: 'Online Banking Username', type: 'text', required: true },
        { name: 'password', label: 'Online Banking Password', type: 'password', required: true },
      ],
    },
    payment_connect: {
      name: 'Payment Processor',
      description: 'Connect to your payment processor account',
      fields: [
        {
          name: 'processor',
          label: 'Processor',
          type: 'text',
          required: true,
          placeholder: 'Stripe, Square, PayPal',
        },
        { name: 'apiKey', label: 'API Key/Secret', type: 'password', required: true },
        { name: 'accountId', label: 'Account ID', type: 'text', required: false },
      ],
    },
    credit_bureau: {
      name: 'Credit Bureau',
      description: 'Authorize access to credit report data',
      fields: [
        {
          name: 'bureau',
          label: 'Credit Bureau',
          type: 'text',
          required: true,
          placeholder: 'Experian, Equifax, TransUnion',
        },
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        { name: 'consentReference', label: 'Consent Reference ID', type: 'text', required: false },
      ],
    },
  };

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
    if (messagesEndRef.current && isOpen && !minimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, minimized]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !minimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, minimized]);

  // Listen for custom events to set prompts
  useEffect(() => {
    const handleCustomPrompt = (event: EVAAIPromptEvent) => {
      if (event.detail && event.detail.prompt) {
        setInputValue(event.detail.prompt);
        setIsOpen(true);
        setMinimized(false);
        if (inputRef.current) {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      }
    };

    window.addEventListener('eva-ai-prompt', handleCustomPrompt as EventListener);

    return () => {
      window.removeEventListener('eva-ai-prompt', handleCustomPrompt as EventListener);
    };
  }, []);

  // Handle resize mouse events
  useEffect(() => {
    if (!resizing || !resizeDirection) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing || !resizeStartRef.current || !chatRef.current) return;

      const currentRect = chatRef.current.getBoundingClientRect();
      let newWidth, newHeight, newX, newY;

      switch (resizeDirection) {
        case 'nw':
          // Top-left: Resize and reposition
          newWidth = Math.max(
            300,
            resizeStartRef.current.width - (e.clientX - resizeStartRef.current.x)
          );
          newHeight = Math.max(
            300,
            resizeStartRef.current.height - (e.clientY - resizeStartRef.current.y)
          );
          newX = Math.max(0, position.x - (newWidth - currentRect.width));
          newY = Math.max(0, position.y - (newHeight - currentRect.height));
          break;

        case 'ne':
          // Top-right: Resize height, reposition on y
          newWidth = Math.max(
            300,
            resizeStartRef.current.width + (e.clientX - resizeStartRef.current.x)
          );
          newHeight = Math.max(
            300,
            resizeStartRef.current.height - (e.clientY - resizeStartRef.current.y)
          );
          newX = position.x;
          newY = Math.max(0, position.y - (newHeight - currentRect.height));
          break;

        case 'sw':
          // Bottom-left: Resize width, reposition on x
          newWidth = Math.max(
            300,
            resizeStartRef.current.width - (e.clientX - resizeStartRef.current.x)
          );
          newHeight = Math.max(
            300,
            resizeStartRef.current.height + (e.clientY - resizeStartRef.current.y)
          );
          newX = Math.max(0, position.x - (newWidth - currentRect.width));
          newY = position.y;
          break;

        case 'se':
          // Bottom-right: Just resize
          newWidth = Math.max(
            300,
            resizeStartRef.current.width + (e.clientX - resizeStartRef.current.x)
          );
          newHeight = Math.max(
            300,
            resizeStartRef.current.height + (e.clientY - resizeStartRef.current.y)
          );
          newX = position.x;
          newY = position.y;
          break;

        default:
          return;
      }

      // Update state
      setChatWidth(`${newWidth}px`);
      setChatHeight(`${newHeight}px`);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setResizing(false);
      setResizeDirection(null);
      resizeStartRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, resizeDirection, position]);

  // Handle dragging for positioning
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging || !dragStartPos.current) return;

      // Calculate new position
      const newX = Math.max(0, dragStartPos.current.x + (dragStartPos.current.mouseX - e.clientX));
      const newY = Math.max(0, dragStartPos.current.y + (dragStartPos.current.mouseY - e.clientY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setDragging(false);
      dragStartPos.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // Adjust height automatically based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 800) {
        setChatHeight('80vh');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startResizing = (e: React.MouseEvent, direction: 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    e.stopPropagation();
    if (!chatRef.current) return;

    // Get current dimensions
    const { width, height } = chatRef.current.getBoundingClientRect();

    // Store start position and dimensions
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width,
      height,
    };

    // Set resize direction
    setResizeDirection(direction);
    setResizing(true);
  };

  // Begin dragging the chat window
  const startDragging = (e: React.MouseEvent) => {
    if (minimized) return;
    e.preventDefault();

    // Store starting position
    dragStartPos.current = {
      x: position.x,
      y: position.y,
      mouseX: e.clientX,
      mouseY: e.clientY,
    };

    setDragging(true);
  };

  const openChat = () => {
    setIsOpen(true);
    setMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const expandChat = () => {
    setMinimized(false);
  };

  // Function to reset position to default bottom-right
  const resetPosition = () => {
    setPosition({ x: 8, y: 8 });
    setChatWidth(CHAT_SIZES[3].width);
    setChatHeight(CHAT_SIZES[3].height);
    setCurrentSizePreset(3);
  };

  // Change chat size using presets
  const changeChatSize = (sizeIndex: number) => {
    if (sizeIndex >= 0 && sizeIndex < CHAT_SIZES.length) {
      setChatWidth(CHAT_SIZES[sizeIndex].width);
      setChatHeight(CHAT_SIZES[sizeIndex].height);
      setCurrentSizePreset(sizeIndex);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize textarea
    if (e.target) {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px';
    }
  };

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFileUploads(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    setFileUploads(files => files.filter((_, i) => i !== index));
  };

  // Data orchestration functions
  const handleConnectDataSource = (methodId: string) => {
    if (methodId === 'document_upload') {
      // Open document upload modal
      setCurrentDocumentType('Financial Documents');
      setShowUploadModal(true);
    } else if (methodId === 'banking_connect') {
      // Open Plaid modal for bank connection
      setShowPlaidModal(true);
    } else if (methodId === 'payment_connect') {
      // Open Stripe modal for payment processor connection
      setShowStripeModal(true);
    } else {
      // Open third-party auth modal for other providers
      setCurrentProvider(authProviders[methodId as keyof typeof authProviders]);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (credentials: any) => {
    // Update the connection status for the method
    const methodId = Object.keys(authProviders).find(
      key => authProviders[key as keyof typeof authProviders].name === credentials.provider
    );

    if (methodId) {
      setCollectionMethods(prev => ({
        ...prev,
        [methodId]: {
          ...prev[methodId],
          isConnected: true,
          connectionDetails: credentials,
        },
      }));

      // Add a success message to the chat
      const successMessage: Message = {
        id: `ai-${Date.now()}`,
        text: `Successfully connected to ${credentials.provider}. The data source is now available for orchestration.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, successMessage]);
    }
  };

  const handleUploadComplete = (uploads: DocumentUpload[]) => {
    setCollectionMethods(prev => ({
      ...prev,
      document_upload: {
        ...prev.document_upload,
        isConnected: true,
        documentUploads: [...(prev.document_upload.documentUploads || []), ...uploads],
      },
    }));

    // Add a success message to the chat
    const successMessage: Message = {
      id: `ai-${Date.now()}`,
      text: `Successfully uploaded ${uploads.length} document(s). They are now being processed for data extraction.`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const handlePlaidSuccess = (data: any) => {
    setCollectionMethods(prev => ({
      ...prev,
      banking_connect: {
        ...prev.banking_connect,
        isConnected: true,
        connectionDetails: data,
      },
    }));

    // Add a success message to the chat
    const successMessage: Message = {
      id: `ai-${Date.now()}`,
      text: `Banking connection established successfully. Your financial institution data is now available for analysis.`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const handleStripeSuccess = (data: any) => {
    setCollectionMethods(prev => ({
      ...prev,
      payment_connect: {
        ...prev.payment_connect,
        isConnected: true,
        connectionDetails: data,
      },
    }));

    // Add a success message to the chat
    const successMessage: Message = {
      id: `ai-${Date.now()}`,
      text: `Payment processor connection established. Your transaction data is now available for analysis.`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const runDataOrchestration = () => {
    // Check if any data sources are connected
    const connectedSources = Object.values(collectionMethods).filter(method => method.isConnected);

    if (connectedSources.length === 0) {
      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        text: `You need to connect at least one data source before running the orchestration. Would you like to connect a data source now?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Show processing message
    const processingMessage: Message = {
      id: `ai-${Date.now()}`,
      text: `Processing data from ${connectedSources.length} source(s). This might take a moment...`,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, processingMessage]);

    // Simulate orchestration process
    setTimeout(() => {
      const completionMessage: Message = {
        id: `ai-${Date.now()}`,
        text: `Data orchestration completed successfully! I've extracted, normalized, and prepared the following data for your transaction:
        
- Financial statements from uploaded documents
- Banking transaction history
${collectionMethods.payment_connect.isConnected ? '- Payment processing data\n' : ''}${collectionMethods.accounting_connect.isConnected ? '- Accounting system records\n' : ''}${collectionMethods.erp_connect.isConnected ? '- ERP system data\n' : ''}${collectionMethods.credit_bureau.isConnected ? '- Credit bureau information\n' : ''}
Would you like to view a summary of the orchestrated data or proceed with analysis?`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, completionMessage]);
      // Reset active state
      setDataOrchestrationActive(false);
    }, 3000);
  };

  const getAvailableDataSources = () => {
    return Object.values(collectionMethods)
      .map(
        method =>
          `- ${method.name}: ${method.description} ${method.isConnected ? '(✓ Connected)' : ''}`
      )
      .join('\n');
  };

  // Update the send message function to handle data orchestration
  const sendMessage = () => {
    if (!inputValue.trim() && fileUploads.length === 0) return;

    // Create user message object
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: fileUploads.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      })),
    };

    // Update the UI with the user's message
    setMessages(prev => [...prev, userMessage]);
    setInputValue(''); // Clear input
    setFileUploads([]); // Clear file uploads
    setIsLoading(true); // Show loading indicator

    // Process the message - check for specific tool requests
    const messageText = inputValue.toLowerCase();
    if (
      (messageText.includes('document verification') || messageText.includes('verify document')) &&
      selectedModel.id === 'document-verification'
    ) {
      // Handle document verification tool request
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          text: "I'll help you verify documents. You can either upload documents directly here or let me guide you through the verification process. What documents would you like to verify?",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } else if (
      (messageText.includes('data orchestration') || messageText.includes('orchestrate data')) &&
      selectedModel.id === 'data-orchestration'
    ) {
      // Handle data orchestration tool request
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          text: "I'll help you with data orchestration for your transaction. I can assist in collecting data from various sources, normalizing it, and preparing it for analysis. What specific data needs do you have?",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } else {
      // Regular message processing
      setTimeout(() => {
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          text: getAIResponse(inputValue, selectedModel.id),
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    }
  };

  // Generate AI responses based on input and model
  const getAIResponse = (userInput: string, modelId: string): string => {
    const modelPrefix = `[${AI_MODELS.find(m => m.id === modelId)?.name || 'AI'}] `;
    const input = userInput.toLowerCase();

    // Mock responses based on message content and selected model
    if (input.includes('financial statement')) {
      return (
        modelPrefix +
        "For financial statements, we typically need the past 2 years of statements. These should include the income statement, balance sheet, and cash flow statement. Would you like me to analyze them when they're uploaded?"
      );
    } else if (input.includes('document') && !input.includes('verify')) {
      return (
        modelPrefix +
        'For an equipment loan, we require: business financial statements, tax returns (last 2 years), bank statements (3 months), and the equipment invoice or quote. All documents should be in PDF format.'
      );
    } else if (input.includes('credit')) {
      return (
        modelPrefix +
        'I can analyze credit profiles once uploaded to the system. We typically look at personal credit scores above 680 for the best rates, but can work with scores as low as 600 with additional documentation.'
      );
    } else if (input.includes('rate')) {
      return (
        modelPrefix +
        'Current rates for equipment loans range from 5.99% to 9.99% depending on credit profile, time in business, and equipment type. For this specific transaction type, most approved applications are seeing rates around 7.25%.'
      );
    } else if (input.includes('structure') || input.includes('deal')) {
      return (
        modelPrefix +
        "Based on this transaction profile, I'd recommend a 60-month term with a 10% down payment. This optimizes monthly cash flow while maintaining an approval-friendly structure. Would you like me to prepare this deal structure for submission?"
      );
    } else if (input.includes('analysis') || input.includes('sufficient')) {
      return (
        modelPrefix +
        "Based on the documents you've uploaded so far (2 of 4 required), you still need to provide the tax returns and equipment invoice. The financial statements you provided show good cash flow, which is positive for approval. Would you like me to help you prepare the remaining documents?"
      );
    } else if (fileUploads.length > 0) {
      return (
        modelPrefix +
        `I've received your file${fileUploads.length > 1 ? 's' : ''} (${fileUploads.map(f => f.name).join(', ')}). Would you like me to analyze ${fileUploads.length > 1 ? 'these documents' : 'this document'} in the context of your ${currentTransaction?.type || 'application'}?`
      );
    } else {
      return (
        modelPrefix +
        `I'm analyzing this ${currentTransaction?.type || 'transaction'} based on your question. To provide more specific guidance, could you share more details about your specific needs? I can help with document preparation, credit analysis, deal structuring, or approval optimization.`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
      // Auto-resize the textarea
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(120, inputRef.current.scrollHeight) + 'px';
    }
  };

  // Render an individual file attachment preview
  const renderFileAttachment = (file: File, index: number) => {
    const isImage = file.type.startsWith('image/');

    return (
      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg mb-2">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-2">
          {isImage ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
        <button
          onClick={() => removeFile(index)}
          className="ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Remove file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
    );
  };

  // Render message attachments
  const renderMessageAttachments = (attachments: Message['attachments']) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="flex items-center p-2 bg-gray-100 rounded-md">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded flex items-center justify-center mr-2">
              {attachment.type.startsWith('image/') ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-grow">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {attachment.name}
              </a>
              <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Chat toggle button - repositioned */}
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-8 right-8 z-30 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center"
          aria-label="Open AI Chat Advisor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* Chat interface */}
      {isOpen && (
        <div
          ref={chatRef}
          className={`fixed z-20 transition-all duration-300 shadow-xl rounded-lg overflow-hidden ${
            minimized ? 'bottom-8 right-8 w-96 h-20 bg-primary-600' : ''
          }`}
          style={{
            width: minimized ? '24rem' : chatWidth,
            height: minimized ? '5rem' : chatHeight,
            right: minimized ? '2rem' : `${position.x}px`,
            bottom: minimized ? '2rem' : `${position.y}px`,
          }}
        >
          {/* Resize handles - only shown when not minimized */}
          {!minimized && (
            <>
              {/* Top-left resize handle */}
              <div
                className="absolute left-0 top-0 w-4 h-4 cursor-nwse-resize z-30"
                onMouseDown={e => startResizing(e, 'nw')}
              >
                <div className="absolute left-1 top-1 w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>

              {/* Top-right resize handle */}
              <div
                className="absolute right-0 top-0 w-4 h-4 cursor-nesw-resize z-30"
                onMouseDown={e => startResizing(e, 'ne')}
              >
                <div className="absolute right-1 top-1 w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>

              {/* Bottom-left resize handle */}
              <div
                className="absolute left-0 bottom-0 w-4 h-4 cursor-nesw-resize z-30"
                onMouseDown={e => startResizing(e, 'sw')}
              >
                <div className="absolute left-1 bottom-1 w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>

              {/* Bottom-right resize handle */}
              <div
                className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize z-30"
                onMouseDown={e => startResizing(e, 'se')}
              >
                <div className="absolute right-1 bottom-1 w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </>
          )}

          {/* Chat header or minimized state display */}
          {minimized ? (
            <div className="w-full h-full flex justify-between items-center">
              <div
                className="flex items-center space-x-3 p-3 flex-grow cursor-pointer"
                onClick={expandChat}
              >
                <div className="bg-primary-500 p-1.5 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">EVA AI Advisor - Click to expand</span>
              </div>
              <div className="flex items-center space-x-2 pr-3">
                <button
                  onClick={expandChat}
                  className="p-1.5 hover:bg-primary-500 rounded-md transition-colors"
                  aria-label="Expand chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 hover:bg-primary-500 rounded-md transition-colors"
                  aria-label="Close chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
            </div>
          ) : (
            <div
              className="bg-primary-600 text-white py-3 px-4 flex justify-between items-center cursor-move"
              onMouseDown={startDragging}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-primary-500 p-1.5 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-lg">EVA AI Advisor</span>
                  <p className="text-xs text-primary-100">Agentic Broker System</p>
                </div>
              </div>

              {/* Model selection dropdown */}
              <div className="flex items-center">
                <div className="relative mr-2">
                  <select
                    value={selectedModel.id}
                    onChange={e => {
                      const model = AI_MODELS.find(m => m.id === e.target.value);
                      if (model) setSelectedModel(model);
                    }}
                    className="appearance-none bg-primary-500 text-white rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    onClick={e => e.stopPropagation()} // Prevent dragging when interacting with dropdown
                  >
                    {AI_MODELS.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Size preset dropdown */}
                <div className="relative mr-2">
                  <select
                    value={currentSizePreset}
                    onChange={e => {
                      changeChatSize(parseInt(e.target.value));
                    }}
                    className="appearance-none bg-primary-500 text-white rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    onClick={e => e.stopPropagation()} // Prevent dragging when interacting with dropdown
                  >
                    <option value={0}>Small</option>
                    <option value={1}>Medium</option>
                    <option value={2}>Large</option>
                    <option value={3}>Full</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Reset position button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      resetPosition();
                    }}
                    className="p-1.5 hover:bg-primary-500 rounded-md transition-colors"
                    aria-label="Reset position"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleMinimize();
                    }}
                    className="p-1.5 hover:bg-primary-500 rounded-md transition-colors"
                    aria-label="Minimize chat"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      closeChat();
                    }}
                    className="p-1.5 hover:bg-primary-500 rounded-md transition-colors"
                    aria-label="Close chat"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
              </div>
            </div>
          )}

          {!minimized && (
            <div className="flex flex-col h-[calc(100%-3.5rem)] bg-white">
              {/* Messages container - Improved with flex-grow */}
              <div className="flex-grow flex flex-col bg-white p-4 overflow-y-auto">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-4 max-w-[80%] ${message.sender === 'user' ? 'self-end' : 'self-start'}`}
                  >
                    <div
                      className={`rounded-lg p-4 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.text}
                      {message.attachments && renderMessageAttachments(message.attachments)}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="self-start mb-4">
                    <div className="bg-gray-100 text-gray-800 rounded-lg p-4 shadow-sm flex space-x-2">
                      <div className="animate-bounce h-2.5 w-2.5 bg-gray-500 rounded-full"></div>
                      <div className="animate-bounce delay-100 h-2.5 w-2.5 bg-gray-500 rounded-full"></div>
                      <div className="animate-bounce delay-200 h-2.5 w-2.5 bg-gray-500 rounded-full"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom section wrapper with flex-shrink-0 to prevent it from being squeezed */}
              <div className="flex-shrink-0">
                {/* File uploads preview section */}
                {fileUploads.length > 0 && (
                  <div className="bg-white border-t border-gray-200 p-3">
                    <div className="flex flex-wrap gap-2">
                      {fileUploads.map((file, index) => renderFileAttachment(file, index))}
                    </div>
                  </div>
                )}

                {/* Example prompts - Enhanced with better spacing */}
                <div className="bg-gray-50 border-t border-gray-200 p-3 overflow-x-auto">
                  <p className="text-xs text-gray-500 mb-2 ml-1">Suggested questions:</p>
                  <div className="flex space-x-3 px-1">
                    {EXAMPLE_PROMPTS.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="text-sm flex-shrink-0 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-primary-600 whitespace-nowrap"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />

                {/* Input area - Enhanced for better UX with voice and file upload */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex">
                    <div className="flex-grow relative">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question here or use voice input..."
                        className="w-full resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[48px] max-h-[120px] text-base"
                        style={{ height: '48px' }}
                        rows={1}
                      />
                    </div>

                    <div className="flex ml-3 space-x-2 items-end">
                      {/* File upload button */}
                      <button
                        onClick={triggerFileUpload}
                        className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        aria-label="Upload files"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                      </button>

                      {/* Voice input button */}
                      <button
                        onClick={toggleVoiceRecording}
                        className={`p-3 rounded-full ${
                          isRecording
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        } transition-colors`}
                        aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                          />
                        </svg>
                      </button>

                      {/* Send button */}
                      <button
                        onClick={sendMessage}
                        disabled={(!inputValue.trim() && fileUploads.length === 0) || isLoading}
                        className={`p-3 rounded-full flex items-center justify-center w-12 h-12 ${
                          (!inputValue.trim() && fileUploads.length === 0) || isLoading
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        } transition-colors`}
                        aria-label="Send message"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatAdvisor;
