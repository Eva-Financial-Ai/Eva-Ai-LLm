// eslint-disable
import React, { useState } from 'react';
import ClearCommunicationsPanel from './communications/ClearCommunicationsPanel';

interface ClearCommunicationBarProps {
  transactionId?: string;
}

const ClearCommunicationBar: React.FC<ClearCommunicationBarProps> = ({ transactionId }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <>
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          aria-label="Open Communications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      )}
      
      <ClearCommunicationsPanel
        isOpen={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </>
  );
};

export default ClearCommunicationBar; 