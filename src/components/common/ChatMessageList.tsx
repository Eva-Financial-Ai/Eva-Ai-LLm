import React, { useRef, useEffect } from 'react';

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

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  renderMessageAttachments: (attachments: Message['attachments']) => React.ReactNode;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages,
  isLoading = false,
  renderMessageAttachments
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
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
  );
};

export default React.memo(ChatMessageList); 