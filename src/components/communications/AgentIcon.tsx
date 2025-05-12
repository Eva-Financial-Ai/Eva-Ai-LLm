import React, { useState } from 'react';

interface AgentIconProps {
  agentId: string;
  agentName: string;
  iconUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

// Map agent IDs to specific background colors for fallback icons
const getAgentColor = (agentId: string): string => {
  const colorMap: Record<string, string> = {
    'eva-fin-risk': 'bg-blue-500',
    'doc-ocr': 'bg-green-500',
    'branding-steve': 'bg-purple-500',
    'neo-matrix': 'bg-gray-700',
    'del-spooner': 'bg-red-500',
    'john-conner': 'bg-yellow-500',
    'mira-sales': 'bg-pink-500',
    'ben-accounting': 'bg-teal-500',
    'leo-trading': 'bg-orange-500',
  };

  return colorMap[agentId] || 'bg-gray-400';
};

// Map agent types to specific fallback icons using Heroicon paths
const getFallbackIconPath = (agentId: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'eva-fin-risk': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    'doc-ocr': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
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
    ),
    'branding-steve': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
    'neo-matrix': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
    'del-spooner': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    'john-conner': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    'mira-sales': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    'ben-accounting': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    'leo-trading': (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  };

  return (
    iconMap[agentId] || (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    )
  );
};

const AgentIcon: React.FC<AgentIconProps> = ({
  agentId,
  agentName,
  iconUrl = '',
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!iconUrl || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden ${getAgentColor(agentId)} text-white flex items-center justify-center ${className}`}
        aria-label={`${agentName} icon`}
      >
        {getFallbackIconPath(agentId) || <span className="font-bold">{getInitial(agentName)}</span>}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <img
        src={iconUrl}
        alt={`${agentName} icon`}
        className="h-full w-full object-cover"
        onError={handleImageError}
      />
    </div>
  );
};

export default AgentIcon;
