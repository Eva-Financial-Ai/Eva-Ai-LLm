/**
 * @component DocumentVerificationChat
 * @description An AI-powered chat interface for document verification and analysis
 *
 * @userStories
 * 1. As a lender, I want to interact with Eva's AI to analyze borrower documents so that I can quickly assess risk factors without manual review.
 * 2. As a borrower, I want to upload my financial documents to an interactive AI so that I can understand what information is being extracted and what it means for my application.
 * 3. As a broker, I want to facilitate document verification via an AI assistant so that I can streamline the intake process and focus on client relationships.
 * 4. As a compliance officer, I want to review AI-extracted document insights so that I can ensure regulatory requirements are met without reviewing each document manually.
 *
 * @userJourney Lender Using Document Verification
 * 1. Trigger: Lender needs to verify financial statements for a new loan application
 * 2. Entry Point: Clicks "Document Verification" in the main dashboard
 * 3. AI Greeting: Receives welcome message from Eva Financial Model AKA
 * 4. Initial Question: Selects or types in a question about borrower creditworthiness
 * 5. Document Request: AI requests relevant documents if not already uploaded
 * 6. Document Upload: Lender uploads financial statements
 * 7. Processing Indicator: Sees AI processing animation while documents are analyzed
 * 8. AI Analysis: Receives structured analysis of key financial data points
 * 9. Follow-up Questions: Asks clarifying questions about specific metrics
 * 10. Risk Assessment: Gets a risk assessment summary from the AI
 * 11. Action Recommendations: Receives recommended next steps from AI
 * 12. Export/Save: Saves analysis to loan application file
 * 13. Close: Closes the chat interface to continue loan processing
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  XMarkIcon,
  PaperClipIcon,
  ClockIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

interface DocumentVerificationChatProps {
  isOpen: boolean;
  onClose: () => void;
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

const DocumentVerificationChat: React.FC<DocumentVerificationChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Chat history shown in the sidebar
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: 'chat-1',
      title: 'Exploring the Universe',
      preview:
        'Embark on a journey through space and time as we delve into the mysteries of the cosmos',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'chat-2',
      title: 'Cooking Adventures',
      preview:
        'Join us in the kitchen for culinary explorations and delicious creations from around the world',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'chat-3',
      title: 'Creative Writing Prompts',
      preview:
        'Unleash your imagination with stimulating writing prompts and craft compelling stories',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: 'chat-4',
      title: 'Historical Mysteries',
      preview: 'Discover the secrets of the past as we unravel intriguing mysteries from history',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'chat-5',
      title: 'DIY Projects Galore',
      preview: 'Dive into the world of do-it-yourself crafts and projects to spark your creativity',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: 'chat-6',
      title: 'Environmental Awareness',
      preview:
        'Join the fight for a greener future by exploring environmental issues and solutions',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
  ]);

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Welcome to Eva Financial Model AKA,\nI'm here to help you assess risk with better intel and data quicker to make more intelligent decisions.",
          timestamp: new Date(),
        },
      ]);

      // Add suggested questions after a delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: 'suggestion-1',
            sender: 'ai',
            text: 'Financial Health and Stability:',
            bulletPoints: [
              "What is the borrower's current financial health, including liquidity, profitability, and solvency ratios?",
              "How will the new debt affect the borrower's overall financial stability?",
              'Are there any potential financial red flags or concerns that need to be addressed before approving the new debt?',
            ],
            timestamp: new Date(),
            isSuggestion: true,
          },
        ]);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      let aiResponse: Message;

      if (input.toLowerCase().includes('loan') || input.toLowerCase().includes('portfolio')) {
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
        input.toLowerCase().includes('fluctuation') ||
        input.toLowerCase().includes('account')
      ) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Significant Fluctuations Identified',
          bulletPoints: [
            '2024-08-05: Salary Credit\nAmount: $2,000.00\nBalance Change: Increased From $4,850.00 To $6,850.00\nSignificance: A Large Credit Inflow Due To Salary Payment.',
            '2024-08-20: Stock Purchase\nAmount: $3,000.00\nBalance Change: Decreased From $6,150.00 To $3,150.00\nSignificance: A Significant Debit Transaction, Reducing The Balance By Over 50%.',
            '2024-08-30: Freelance Payment\nAmount: $1,500.00\nBalance Change: Increased From $3,070.00 To $4,570.00\nSignificance: A Substantial Credit Inflow From Freelance Work.',
            'Summary of Fluctuations\nThe Most Significant Debit Transaction Occurred On 2024-08-20 With A Stock Purchase Of $3,000.00, Reducing The Account Balance By 41%.\nThe Most Significant Credit Transaction Was The Salary Payment On 2024-08-05, Increasing The Balance By 41%.\nOther Fluctuations, While Notable, Did Not Exceed A 50% Change In The Account Balance.',
          ],
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Financial Health and Stability:',
          bulletPoints: [
            "What is the borrower's current financial health, including liquidity, profitable.",
            "How will the new debt affect the borrower's overall financial stability?",
            'Are there any potential financial red flags or concerns that need to be addressed before approving the new debt?',
          ],
          timestamp: new Date(),
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Add this chat to history
      setChatHistory(prev => [
        {
          id: `history-${Date.now()}`,
          title: input.length > 25 ? input.substring(0, 25) + '...' : input,
          preview: aiResponse.text,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);

    // Submit automatically
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: suggestion,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "I'm analyzing this request. Let me provide you with some detailed insights based on the available data and current market conditions...",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Add this chat to history
      setChatHistory(prev => [
        {
          id: `history-${Date.now()}`,
          title: suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion,
          preview: aiResponse.text,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    }, 1500);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-gray-900 rounded-lg flex shadow-xl">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* Sidebar Header */}
            <div className="p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} className="mb-4">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {date}
                  </div>
                  <ul>
                    {items.map(item => (
                      <li key={item.id} className="px-2">
                        <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {item.preview}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleSidebar}
                className="mr-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>

              <div className="flex flex-col">
                <div className="flex items-center">
                  <div className="relative">
                    <button className="flex items-center font-medium text-gray-900 dark:text-white">
                      Eva Financial M. AKA
                      <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Chat area title */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm">
            <div className="flex items-center">
              <span className="text-gray-800 dark:text-gray-200">New Chat For Lead Vision AI</span>
              <span className="mx-1 text-gray-500 dark:text-gray-400">/</span>
              <span className="text-blue-500">Real Estate Model</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && !message.isSuggestion ? (
                  <div className="max-w-[80%]">
                    <div className="flex items-start mb-2">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          AI
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          LeadVision AI
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-gray-800 dark:text-gray-200">
                      <div className="whitespace-pre-line">{message.text}</div>

                      {message.bulletPoints && message.bulletPoints.length > 0 && (
                        <ul className="mt-2 space-y-2">
                          {message.bulletPoints.map((point, index) => (
                            <li key={index} className="flex">
                              <span className="mr-2">•</span>
                              <span className="whitespace-pre-line">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {message.attachment && (
                        <div className="mt-3 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {message.attachment.name}
                            </span>
                          </div>
                        </div>
                      )}

                      {message.text.includes('loan portfolio') && (
                        <div className="mt-4">
                          <button className="inline-flex items-center px-3 py-1.5 border border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                            <span>See Visual Charts</span>
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Message actions */}
                    <div className="mt-2 flex space-x-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <HandThumbUpIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <HandThumbDownIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : message.sender === 'user' ? (
                  <div className="max-w-[80%]">
                    <div className="flex items-start justify-end mb-2">
                      <div className="mr-2 text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">John</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          J
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500 text-white rounded-lg p-4">{message.text}</div>
                  </div>
                ) : (
                  // Suggestion message
                  <div className="max-w-[80%] w-full">
                    <div className="flex items-start mb-2">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                          AI
                        </div>
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          LeadVision AI
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-gray-800 dark:text-gray-200">
                      <div className="font-medium mb-2">{message.text}</div>

                      {message.bulletPoints && message.bulletPoints.length > 0 && (
                        <ul className="space-y-2">
                          {message.bulletPoints.map((point, index) => (
                            <li
                              key={index}
                              className="py-2 px-3 bg-white dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                              onClick={() => handleSuggestionClick(point)}
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      AI
                    </div>
                  </div>
                  <div className="ml-2 bg-gray-100 dark:bg-gray-800 rounded-lg py-2 px-4">
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
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex items-center">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-md focus:ring-0 focus:outline-none text-gray-900 dark:text-white"
                placeholder="Enter a prompt here and ask me something..."
              />

              <button
                type="button"
                className="p-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ClockIcon className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className={`ml-2 px-4 py-2 rounded-md text-white ${
                  input.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationChat;
