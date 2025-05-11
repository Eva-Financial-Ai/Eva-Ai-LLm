import React, { useState, useRef, useEffect } from 'react';
import { FileItem } from './FilelockDriveApp';

interface FileChatPanelProps {
  file: FileItem;
  onClose: () => void;
}

const FileChatPanel: React.FC<FileChatPanelProps> = ({ file, onClose }) => {
  // Check if this is a cloud-imported file
  const isCloudImported = file.tags?.some(
    tag =>
      tag.includes('Imported from google-drive') ||
      tag.includes('Imported from onedrive') ||
      tag.includes('Imported from icloud')
  );

  // Get the cloud source if it's a cloud-imported file
  const getCloudSource = (): string | null => {
    if (!isCloudImported || !file.tags) return null;

    const importTag = file.tags.find(tag => tag.includes('Imported from'));
    if (!importTag) return null;

    if (importTag.includes('google-drive')) return 'Google Drive';
    if (importTag.includes('onedrive')) return 'Microsoft OneDrive';
    if (importTag.includes('icloud')) return 'Apple iCloud';

    return null;
  };

  const cloudSource = getCloudSource();

  const [messages, setMessages] = useState<
    Array<{
      id: string;
      text: string;
      sender: 'user' | 'ai';
      timestamp: string;
    }>
  >([
    {
      id: 'welcome',
      text: `Hello! I'm your AI assistant. I can help you understand and analyze the content of "${file.name}"${
        cloudSource ? ` that was imported from ${cloudSource}` : ''
      }. What would you like to know about this file?`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate AI response after a short delay
    setTimeout(() => {
      // In a real implementation, this would call an API to analyze the file
      const fileType = file.type;
      let aiResponse = '';

      // Handle cloud-specific questions
      if (
        isCloudImported &&
        (inputValue.toLowerCase().includes('cloud') ||
          inputValue.toLowerCase().includes('import') ||
          inputValue.toLowerCase().includes('source'))
      ) {
        aiResponse = `This file was imported from ${cloudSource}. I can analyze its contents just like any other file in your FileLock system. Is there something specific about the file you'd like to know?`;
      } else if (
        inputValue.toLowerCase().includes('summary') ||
        inputValue.toLowerCase().includes('summarize')
      ) {
        aiResponse = `Here's a summary of "${file.name}"${
          cloudSource ? ` (imported from ${cloudSource})` : ''
        }: This document appears to contain information related to a loan application. It includes sections on terms and conditions, applicant information, and financial details.`;
      } else if (
        inputValue.toLowerCase().includes('key points') ||
        inputValue.toLowerCase().includes('highlights')
      ) {
        aiResponse = `Key points from "${file.name}":\n1. Loan amount requested\n2. Applicant's financial history\n3. Terms of repayment\n4. Collateral information\n5. Signature requirements`;
      } else if (
        inputValue.toLowerCase().includes('extract') ||
        inputValue.toLowerCase().includes('data')
      ) {
        aiResponse = `I've extracted the following data from "${file.name}":\n- Applicant: John Smith\n- Business: Smith Logistics LLC\n- Loan Amount: $250,000\n- Purpose: Equipment financing\n- Term: 60 months`;
      } else {
        aiResponse = `I've analyzed "${file.name}" and can help answer specific questions about its content. You can ask me to summarize the document, extract key information, or explain specific sections.`;
      }

      const aiMessageObj = {
        id: `msg-${Date.now()}`,
        text: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessageObj]);
      setIsProcessing(false);
    }, 1500);
  };

  // Handle pressing Enter to send a message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="file-chat-panel flex flex-col h-full border-l border-gray-200 bg-white">
      {/* Header */}
      <div className="chat-header flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="file-icon mr-2">
            {file.type === 'pdf' ? (
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            ) : file.type === 'folder' ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            )}
          </div>
          <div className="file-info">
            <h3 className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</h3>
            {cloudSource && (
              <span className="text-xs text-gray-500">Imported from {cloudSource}</span>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3/4 rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm whitespace-pre-line">{message.text}</div>
              <div
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Loading indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-1">
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
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input border-t border-gray-200 p-3">
        <div className="flex items-end space-x-2">
          <textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about this file..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 min-h-[40px] max-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className={`p-2 rounded-full ${
              !inputValue.trim() || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  );
};

export default FileChatPanel;
