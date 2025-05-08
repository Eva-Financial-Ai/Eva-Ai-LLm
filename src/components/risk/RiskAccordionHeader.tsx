import React from 'react';

interface RiskAccordionHeaderProps {
  title: string;
  score: number;
  maxScore?: number;
  isOpen?: boolean;
  onToggle: () => void;
  metrics?: {
    icon?: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
  }[];
}

const RiskAccordionHeader: React.FC<RiskAccordionHeaderProps> = ({
  title,
  score,
  maxScore = 100,
  isOpen = false,
  onToggle,
  metrics = []
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-600';
  };

  return (
    <div 
      onClick={onToggle}
      className="px-6 py-4 flex items-center justify-between cursor-pointer border-b border-gray-200 hover:bg-gray-50"
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        {metrics.length > 0 && (
          <div className="flex mt-2 flex-wrap gap-x-4 gap-y-1">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center text-xs text-gray-500">
                {metric.icon}
                <span className="mr-1">{metric.label}:</span>
                <span className="font-medium">{metric.value}{metric.unit}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <span className={`mr-4 text-2xl font-bold ${getScoreColor(score)}`}>
          {score}/{maxScore}
        </span>
        
        <div className="transform transition-transform duration-200 ease-in-out">
          <svg 
            className={`w-6 h-6 text-gray-500 ${isOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default RiskAccordionHeader; 