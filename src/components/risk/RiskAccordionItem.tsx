import React, { useState } from 'react';
import RiskAccordionHeader from './RiskAccordionHeader';

interface RiskAccordionItemProps {
  title: string;
  score: number;
  maxScore?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  metrics?: {
    icon?: React.ReactNode;
    label: string;
    value: string | number;
    unit?: string;
  }[];
}

const RiskAccordionItem: React.FC<RiskAccordionItemProps> = ({
  title,
  score,
  maxScore = 100,
  children,
  defaultOpen = false,
  metrics = [],
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <RiskAccordionHeader
        title={title}
        score={score}
        maxScore={maxScore}
        isOpen={isOpen}
        onToggle={toggleAccordion}
        metrics={metrics}
      />

      {isOpen && <div className="p-6 bg-white border-t border-gray-200">{children}</div>}
    </div>
  );
};

export default RiskAccordionItem;
