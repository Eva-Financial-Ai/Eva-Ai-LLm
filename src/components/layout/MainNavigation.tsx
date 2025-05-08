import RiskAdvisorWrapper from '../risk/RiskAdvisorWrapper';
import { useState } from 'react';

const MainNavigation = () => {
  const [showRiskChat, setShowRiskChat] = useState(false);
  
  return (
    <>
      <div className="bg-white border-r border-gray-200 w-64 fixed top-0 left-0 bottom-0 z-30 overflow-y-auto">
        <div className="fixed bottom-6 left-6">
          <button
            onClick={() => setShowRiskChat(true)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            title="Open Risk Advisor Chat"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>
      </div>
      
      {showRiskChat && (
        <RiskAdvisorWrapper
          isOpen={showRiskChat}
          onClose={() => setShowRiskChat(false)}
          mode="general"
        />
      )}
    </>
  );
};

export default MainNavigation; 