import React, { useState, useEffect, useRef, useContext } from 'react';
import Draggable from 'react-draggable';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { UserContext } from '../../contexts/UserContext';
import {
  XMarkIcon,
  PaperClipIcon,
  ClockIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  AdjustmentsHorizontalIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  Cog6ToothIcon,
  ShareIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import AgentSelector from './AgentSelector';
import AgentManagementDialog from './AgentManagementDialog';
import { AgentModel } from './CustomAgentManager';
import AddParticipantDialog from './AddParticipantDialog';
import { DEFAULT_AGENTS } from './AgentSelector';
import AgentIcon from './AgentIcon';

interface ChatWidgetProps {
  mode?: 'eva' | 'risk' | 'communications';
  initialPosition?: { x: number; y: number };
  isOpen?: boolean;
  onClose?: () => void;
  zIndexBase?: number;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'pdf' | 'document';
    name: string;
    url: string;
  };
  bulletPoints?: string[];
  isSuggestion?: boolean;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
}

// Speech recognition type definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  mozSpeechRecognition: any;
  msSpeechRecognition: any;
}

// At the top, add a debug flag
const DEBUG_CHAT = true; // Set to true to see debug logs

// New types for conversation management
interface Conversation {
  id: string;
  title: string;
  agentId: string;
  messages: Message[];
  participants: string[];
  sharedWithManagers: boolean;
  sentimentScore?: number;
  computeEfficiencyScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Add a Manager interface
interface Manager {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  mode = 'eva',
  initialPosition = {
    x: window.innerWidth - window.innerWidth * 0.85 - 40,
    y: window.innerHeight - window.innerHeight * 0.85 - 120,
  },
  isOpen: isOpenProp,
  onClose: onCloseProp,
  zIndexBase = 50,
}) => {
  // Internal visibility state, used if isOpenProp is not provided
  const [internalIsVisible, setInternalIsVisible] = useState(isOpenProp !== undefined ? isOpenProp : false);
  const { setIsEvaChatOpen } = useContext(UserContext); // Consume from context for default close

  // Determine effective visibility: prop takes precedence
  const effectiveIsVisible = isOpenProp !== undefined ? isOpenProp : internalIsVisible;

  // Sync internal state if isOpenProp changes
  useEffect(() => {
    if (isOpenProp !== undefined) {
      setInternalIsVisible(isOpenProp);
    }
  }, [isOpenProp]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { currentTransaction } = useWorkflow();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // New state for custom agents
  const [customAgents, setCustomAgents] = useState<AgentModel[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentModel | null>(null);
  const [isAgentManagementOpen, setIsAgentManagementOpen] = useState(false);
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  // Chat history shown in the sidebar
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: 'chat-1',
      title: 'Loan Portfolio Analysis',
      preview: 'Overview of loan portfolio performance and risk metrics',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'chat-2',
      title: 'Document Verification',
      preview: 'Analysis of financial statements and verification of key metrics',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'chat-3',
      title: 'Risk Assessment',
      preview: 'Detailed risk factors and mitigation strategies',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: 'chat-4',
      title: 'Compliance Check',
      preview: 'Regulatory compliance verification and requirements',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]);

  // New state for conversation management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [sharedWithManagers, setSharedWithManagers] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([
    { id: 'mgr1', name: 'Alex Johnson', email: 'alex@evafin.com', role: 'Team Lead' },
    { id: 'mgr2', name: 'Samantha Rodriguez', email: 'sam@evafin.com', role: 'Department Manager' },
    { id: 'mgr3', name: 'Taylor Washington', email: 'taylor@evafin.com', role: 'VP Operations' },
  ]);
  const [showSentimentAnalysis, setShowSentimentAnalysis] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [computeEfficiencyScore, setComputeEfficiencyScore] = useState(0);

  const hasInitialized = React.useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let welcomeMessage = '';
    if (mode === 'eva') {
      welcomeMessage =
        "Welcome to EVA Financial. I'm here to help you assess risk and make more intelligent decisions.";
    } else if (mode === 'risk') {
      welcomeMessage =
        'Risk Advisor here. I can help identify and mitigate risks in your transaction.';
    } else {
      welcomeMessage =
        'Welcome to Clear Communications. How can I assist with your client interactions?';
    }

    // Set welcome message
    setMessages([
      {
        id: 'welcome',
        text: welcomeMessage,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);

    // Add clear suggestions that work
    setTimeout(() => {
      setMessages(prev => {
        // prevent duplicate suggestions
        if (prev.some(m => m.id === 'initial-suggestions')) return prev;
        return [
          ...prev,
          {
            id: 'initial-suggestions',
            sender: 'ai',
            text: 'What would you like to know about? You can type your own query or select one below:',
            bulletPoints: [
              "Analyze the borrower's current financial ratios and highlight any concerning trends.",
              "What's the collateral value compared to the loan amount for this application?",
              "How does this loan's risk profile compare to similar loans in our portfolio?",
              'Can you summarize the cash flow projections for the next 12 months?',
              'What regulatory compliance issues should I be aware of for this transaction?',
              'Based on industry benchmarks, is the debt service coverage ratio adequate?',
            ],
            timestamp: new Date(),
          },
        ];
      });
    }, 800);
  }, [mode]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when chat opens
  useEffect(() => {
    if (effectiveIsVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [effectiveIsVisible]);

  // Set up speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);

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

  // Simple function to toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Error starting speech recognition', e);
      }
    }
  };

  // Handle submission of a query
  const handleQuery = async (query: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse: Message;

      if (query.toLowerCase().includes('loan') || query.toLowerCase().includes('portfolio')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "Here's an overview of your loan portfolio's performance:",
          bulletPoints: [
            '**Total Outstanding Loans**: $2,500,000\n- The total value of all outstanding loans in the portfolio.',
            '**Average Interest Rate**: 7%\n- The average interest rate across all loans.',
            '**Loan Type Distribution**:\n- Equipment Loans: 40%\n- Working Capital Loans: 30%\n- Real Estate Loans: 30%',
            '**Top Performing Loan Type**:\n- Equipment Loans\n- Average ROI: 10%',
            '**Delinquency Rate**:\n- Equipment Loans: 5%\n- Working Capital Loans: 3%\n- Real Estate Loans: 7%',
            '**Loan Growth Rate**: 5%\n- The overall growth rate of the loan portfolio.',
            '**Risk Assessment**:\n- Low Risk Loans: 60%\n- Medium Risk Loans: 30%\n- High Risk Loans: 10%',
            '**Loan Performance Trends**:\n- Equipment Loans: Steady growth, minimal delinquencies.\n- Working Capital Loans: Increasing demand, low default rates.\n- Real Estate Loans: Stable performance, slight increase in delinquencies.',
          ],
          timestamp: new Date(),
        };
      } else if (
        query.toLowerCase().includes('document') ||
        query.toLowerCase().includes('upload')
      ) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'To upload and manage documents, navigate to the Filelock Drive section. You can upload files by dragging and dropping them or clicking the upload button. All documents are securely stored and can be shared with appropriate permissions.',
          timestamp: new Date(),
        };
      } else if (query.toLowerCase().includes('risk')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Based on my analysis, here are several risk factors to consider:',
          bulletPoints: [
            "The borrower's debt-to-income ratio is above industry average",
            'Recent market volatility in this sector suggests higher than normal risk',
            'There are some regulatory compliance concerns that should be addressed before proceeding',
          ],
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "I'm here to help with any aspect of the EVA platform. I can assist with document management, transaction processing, risk assessment, or communications. What would you like to know more about?",
          timestamp: new Date(),
        };
      }

      // Add AI response to messages
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Set text in input field
    setInputText(suggestion);

    // Then immediately submit
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: suggestion,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Generate response based on the suggestion
    setTimeout(() => {
      let responseText = `I've analyzed your question about "${suggestion}". Here's what I found:

1. This appears to be a financial analysis request that needs detailed attention.
2. I'll need to retrieve the latest data to provide accurate insights.
3. Would you like me to prepare a full report on this topic?`;

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // File handling functions
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Input handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea
    if (e.target) {
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(120, e.target.scrollHeight) + 'px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && (inputText.trim() || uploadedFiles.length > 0)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to create a new conversation
  const createNewConversation = (selectedAgentId: string = 'eva-fin-risk') => {
    const newConversationId = `conv-${Date.now()}`;
    const selectedAgentInfo =
      DEFAULT_AGENTS.find(agent => agent.id === selectedAgentId) || DEFAULT_AGENTS[0];

    const welcomeMessage = `Welcome to a new conversation with ${selectedAgentInfo.name}. ${selectedAgentInfo.description}`;

    const newConversation: Conversation = {
      id: newConversationId,
      title: `Conversation with ${selectedAgentInfo.name}`,
      agentId: selectedAgentId,
      messages: [
        {
          id: `welcome-${newConversationId}`,
          sender: 'ai',
          text: welcomeMessage,
          timestamp: new Date(),
        },
      ],
      participants: [...participants],
      sharedWithManagers: sharedWithManagers,
      sentimentScore: 0,
      computeEfficiencyScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setConversations(prev => [...prev, newConversation]);
    setActiveConversationId(newConversationId);
    setMessages([
      {
        id: `welcome-${newConversationId}`,
        sender: 'ai',
        text: welcomeMessage,
        timestamp: new Date(),
      },
    ]);

    // Add to chat history
    setChatHistory(prev => [
      {
        id: newConversationId,
        title: `Conversation with ${selectedAgentInfo.name}`,
        preview: welcomeMessage,
        timestamp: new Date(),
      },
      ...prev,
    ]);

    return newConversationId;
  };

  // Initialize first conversation
  useEffect(() => {
    if (!activeConversationId && conversations.length === 0) {
      createNewConversation(selectedAgent?.id || 'eva-fin-risk');
    }
  }, []);

  // Modified handleSelectAgent to create a new conversation with selected agent
  const handleSelectAgent = (agent: AgentModel) => {
    setSelectedAgent(agent);

    // Create a new conversation when selecting a different agent
    const newConversationId = createNewConversation(agent.id);

    // System notification about new conversation
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      sender: 'ai',
      text: `Starting a new conversation with ${agent.name}. This agent specializes in ${agent.type.split(',')[0] || 'various tasks'}.`,
      timestamp: new Date(),
      isSuggestion: true,
    };

    // Add the message to the new conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === newConversationId
          ? {
              ...conv,
              messages: [...conv.messages, systemMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

    setMessages(prev => [...prev, systemMessage]);
  };

  // Modified handleSendMessage to update the active conversation
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!inputText.trim() && uploadedFiles.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
      attachment:
        uploadedFiles.length > 0
          ? {
              type: uploadedFiles[0].type.includes('image')
                ? 'image'
                : uploadedFiles[0].type.includes('pdf')
                  ? 'pdf'
                  : 'document',
              name:
                uploadedFiles.length === 1
                  ? uploadedFiles[0].name
                  : `${uploadedFiles.length} files uploaded`,
              url: uploadedFiles.length === 1 ? URL.createObjectURL(uploadedFiles[0]) : '',
            }
          : undefined,
    };

    setMessages(prev => [...prev, userMessage]);

    // Update active conversation with new message
    if (activeConversationId) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                updatedAt: new Date(),
              }
            : conv
        )
      );
    }

    setInputText('');
    setUploadedFiles([]);
    setIsTyping(true);

    // Perform sentiment analysis
    analyzeSentiment(inputText);

    // Simulate AI response
    setTimeout(() => {
      let responseText = `I've analyzed your message. `;

      if (uploadedFiles.length > 0) {
        responseText += `I've also received your files and can help you with processing them. `;
      }

      responseText += `Is there anything specific you'd like me to focus on?`;

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update active conversation with AI response
      if (activeConversationId) {
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, aiMessage],
                  updatedAt: new Date(),
                }
              : conv
          )
        );
      }

      setIsTyping(false);
    }, 1500);
  };

  // Simple sentiment analysis function
  const analyzeSentiment = (text: string) => {
    // In a real implementation, this would call a sentiment analysis API
    // This is a simple mock implementation
    const words = text.toLowerCase().split(/\s+/);

    // Very basic sentiment words (would be much more sophisticated in production)
    const positiveWords = [
      'good',
      'great',
      'excellent',
      'helpful',
      'thank',
      'thanks',
      'appreciate',
      'clear',
      'perfect',
    ];
    const negativeWords = [
      'bad',
      'poor',
      'terrible',
      'useless',
      'waste',
      'confusing',
      'difficult',
      'wrong',
      'incorrect',
    ];

    let score = 50; // Neutral starting point

    // Count positive and negative words
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 5;
      if (negativeWords.includes(word)) score -= 5;
    });

    // Analyze prompt efficiency - shorter, focused prompts score better
    const wordCount = words.length;
    let efficiencyScore = 100;

    if (wordCount > 50) efficiencyScore -= 10;
    if (wordCount > 100) efficiencyScore -= 20;
    if (wordCount > 150) efficiencyScore -= 30;

    // Check for clear question structure
    if (text.includes('?')) efficiencyScore += 10;

    // Ensure scores stay in range
    score = Math.max(0, Math.min(100, score));
    efficiencyScore = Math.max(0, Math.min(100, efficiencyScore));

    setSentimentScore(score);
    setComputeEfficiencyScore(efficiencyScore);

    // Update active conversation with scores
    if (activeConversationId) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                sentimentScore: score,
                computeEfficiencyScore: efficiencyScore,
              }
            : conv
        )
      );
    }
  };

  // Toggle sharing with managers
  const toggleManagerSharing = () => {
    setSharedWithManagers(!sharedWithManagers);

    // Update active conversation sharing status
    if (activeConversationId) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, sharedWithManagers: !sharedWithManagers }
            : conv
        )
      );

      // Add system message about sharing
      const sharingMessage: Message = {
        id: `system-${Date.now()}`,
        sender: 'ai',
        text: !sharedWithManagers
          ? 'This conversation is now shared with your management team.'
          : 'This conversation is no longer shared with your management team.',
        timestamp: new Date(),
        isSuggestion: true,
      };

      setMessages(prev => [...prev, sharingMessage]);
    }
  };

  // Switch to a different conversation
  const switchConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setActiveConversationId(conversationId);
      setMessages(conversation.messages);
      setSharedWithManagers(conversation.sharedWithManagers);

      // Find and set the agent for this conversation
      const agent = DEFAULT_AGENTS.find(a => a.id === conversation.agentId);
      if (agent) {
        setSelectedAgent(agent);
      }
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'TODAY';
    } else if (isYesterday) {
      return 'YESTERDAY';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    }
  };

  const groupHistoryByDate = () => {
    const groups: Record<string, ChatHistoryItem[]> = {};

    chatHistory.forEach(item => {
      const dateStr = formatDate(item.timestamp);
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(item);
    });

    return groups;
  };

  const groupedHistory = groupHistoryByDate();

  const getTitle = () => {
    if (selectedAgent) {
      return `${selectedAgent.name}`;
    }

    switch (mode) {
      case 'risk':
        return 'Risk Analysis Chat';
      case 'communications':
        return 'Team Communications';
      default:
        return 'EVA Assistant';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'risk':
        return 'Risk Assessment Model';
      case 'communications':
        return 'Client Communications';
      default:
        return 'New Chat For Lead Vision AI';
    }
  };

  // Text-to-Speech function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Add these UI components to the appropriate places in the return statement

  // Add these in the header section of the chat interface
  const renderAnalyticsButton = () => (
    <button
      className="p-2 text-gray-500 hover:text-blue-600 relative"
      onClick={() => setShowSentimentAnalysis(!showSentimentAnalysis)}
      title="Sentiment Analysis"
    >
      <ChartBarIcon className="h-5 w-5" />
    </button>
  );

  const renderShareButton = () => (
    <button
      className={`p-2 ${sharedWithManagers ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'} relative`}
      onClick={toggleManagerSharing}
      title={sharedWithManagers ? 'Shared with managers' : 'Share with managers'}
    >
      <ShareIcon className="h-5 w-5" />
      {sharedWithManagers && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500"></span>
      )}
    </button>
  );

  const renderSentimentAnalysis = () =>
    showSentimentAnalysis && (
      <div className="bg-white border-t border-gray-200 p-4">
        <h3 className="text-sm font-semibold mb-2">Prompt Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Sentiment Score</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${sentimentScore > 70 ? 'bg-green-500' : sentimentScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${sentimentScore}%` }}
              ></div>
            </div>
            <p className="text-right text-xs mt-1">{sentimentScore}/100</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Compute Efficiency</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${computeEfficiencyScore > 70 ? 'bg-green-500' : computeEfficiencyScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${computeEfficiencyScore}%` }}
              ></div>
            </div>
            <p className="text-right text-xs mt-1">{computeEfficiencyScore}/100</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Prompts that are clear, concise, and specific help optimize compute resources and deliver
          better results.
        </p>
      </div>
    );

  const handleClose = () => {
    if (onCloseProp) {
      onCloseProp();
    } else {
      // Fallback for internally managed state, or if it's the EVA chat that should use context
      if (mode === 'eva' && setIsEvaChatOpen) {
         setIsEvaChatOpen(false);
      } else {
         setInternalIsVisible(false);
      }
    }
  };

  // CHAT BUTTON COMPONENT
  if (!effectiveIsVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
        }}
      >
        <button
          onClick={() => {
            if (isOpenProp === undefined) {
                setInternalIsVisible(true);
            } else if (mode === 'eva' && setIsEvaChatOpen) {
                setIsEvaChatOpen(true);
            }
          }}
          className="rounded-full p-3 text-white shadow-lg bg-blue-600 hover:bg-blue-700"
          aria-label="Open chat"
        >
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
        </button>
      </div>
    );
  }

  // MAIN CHAT INTERFACE
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: '95%',
          height: '95%',
          maxWidth: '1800px',
          maxHeight: '1200px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Main container with sidebar and chat area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-64 border-r border-gray-200 flex flex-col bg-white">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date} className="p-4">
                    <h3 className="text-xs font-semibold text-gray-500 mb-2">{date}</h3>
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-gray-100 rounded-md cursor-pointer mb-1"
                        onClick={() => switchConversation(item.id)}
                      >
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <p className="text-xs text-gray-500 truncate">{item.preview}</p>
                        {conversations.find(c => c.id === item.id)?.sharedWithManagers && (
                          <div className="flex items-center mt-1">
                            <ShareIcon className="h-3 w-3 text-blue-500 mr-1" />
                            <span className="text-xs text-blue-500">Shared with management</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <button className="mr-2 text-gray-500 hover:text-gray-700" onClick={toggleSidebar}>
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
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </button>
                <div>
                  <h2 className="text-2xl font-semibold">{getTitle()}</h2>
                  <div className="flex items-center">
                    <p className="text-base text-gray-500">{getSubtitle()}</p>
                  </div>
                </div>
              </div>

              {/* Header Right Side */}
              <div className="flex items-center space-x-2">
                {renderAnalyticsButton()}
                {renderShareButton()}
                <AgentSelector
                  selectedAgent={selectedAgent}
                  onSelectAgent={handleSelectAgent}
                  onManageAgents={() => setIsAgentManagementOpen(true)}
                  customAgents={customAgents}
                />

                <button
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={handleClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Quick Agent Bar */}
            <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center space-x-2 overflow-x-auto">
              {DEFAULT_AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`flex items-center rounded-full px-2 py-1 space-x-1 text-xs ${
                    selectedAgent?.id === agent.id
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AgentIcon
                    agentId={agent.id}
                    agentName={agent.name}
                    iconUrl={agent.imageUrl}
                    size="sm"
                    className="w-4 h-4"
                  />
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'user' ? (
                    // User message
                    <div className="max-w-[70%]">
                      <div className="flex items-start justify-end mb-1">
                        <p className="text-base font-medium text-gray-900 mr-2">You</p>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {message.sender === 'user' ? 'U' : selectedAgent?.name?.charAt(0) || 'E'}
                        </div>
                      </div>
                      <div className="bg-blue-600 text-white rounded-lg p-4 shadow-sm text-base">
                        {message.text}

                        {message.attachment && (
                          <div className="mt-2 p-2 bg-blue-700 rounded-md">
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-5 w-5 text-blue-200 mr-2" />
                              <span className="text-base font-medium text-white">
                                {message.attachment.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // AI message
                    <div className="max-w-[70%]">
                      <div className="flex items-start mb-1">
                        <AgentIcon
                          agentId={selectedAgent?.id || 'eva-fin-risk'}
                          agentName={selectedAgent?.name || 'EVA'}
                          iconUrl={selectedAgent?.imageUrl || '/icons/eva-avatar.svg'}
                          size="md"
                          className="mr-2 w-10 h-10"
                        />
                        <p className="text-base font-medium text-gray-900">
                          {selectedAgent?.name || 'EVA'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 text-gray-800 shadow-sm text-base">
                        <div className="whitespace-pre-line">{message.text}</div>

                        {/* Suggestions or bulletpoints */}
                        {message.bulletPoints && message.bulletPoints.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.bulletPoints.map((point, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(point)}
                                className="w-full text-left py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 
                                         transition-colors border border-gray-200 text-base"
                              >
                                {point}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message actions */}
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => {}}
                          className="p-1 text-gray-400 hover:text-blue-600"
                        >
                          <HandThumbUpIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => {}} className="p-1 text-gray-400 hover:text-red-600">
                          <HandThumbDownIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => speakText(message.text)}
                          className="p-1 text-gray-400 hover:text-green-600"
                        >
                          <SpeakerWaveIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start">
                    <AgentIcon
                      agentId={selectedAgent?.id || 'eva-fin-risk'}
                      agentName={selectedAgent?.name || 'EVA'}
                      iconUrl={selectedAgent?.imageUrl || '/icons/eva-avatar.svg'}
                      size="md"
                      className="mr-2"
                    />
                    <div className="bg-white rounded-lg py-2 px-4 shadow-sm">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Sentiment Analysis Panel */}
            {renderSentimentAnalysis()}

            {/* Message Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-start">
                {/* File Upload Button */}
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className="p-3 text-gray-500 hover:text-gray-700 rounded-md mr-2 mt-1"
                >
                  <PaperClipIcon className="h-6 w-6" />
                </button>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files);
                      setUploadedFiles(prev => [...prev, ...newFiles]);
                    }
                  }}
                  className="hidden"
                  multiple
                />

                {/* Message Input */}
                <div className="flex-1 rounded-lg border border-gray-300 bg-white overflow-hidden">
                  <textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 text-base focus:outline-none resize-none"
                    style={{
                      minHeight: '60px',
                      maxHeight: '120px',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />

                  {/* Uploaded Files Display */}
                  {uploadedFiles.length > 0 && (
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-1" />
                          <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))} className="ml-1 text-gray-500">
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Send button and other controls */}
              <div className="flex justify-end mt-3">
                <button 
                  onClick={toggleListening}
                  className={`p-3 mr-3 rounded-full ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <MicrophoneIcon className="h-6 w-6" />
                </button>
                
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputText.trim() && uploadedFiles.length === 0) || isTyping}
                  className={`px-6 py-3 rounded-lg text-white font-medium flex items-center ${
                    (inputText.trim() || uploadedFiles.length > 0) && !isTyping
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="mr-2">Send</span>
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
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
              
              {/* Listening indicator */}
              {isListening && (
                <div className="mt-2 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-md flex items-center">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Listening... speak now
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
