import React, { useState } from 'react';
import EVAAssistantWithCustomAgents from '../components/EVAAssistantWithCustomAgents';
import ResponsiveTestingPanel from '../components/ResponsiveTestingPanel';

interface AIAssistantPageProps {
  showResponsiveTester?: boolean;
}

const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ showResponsiveTester = true }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const pageStyles = isFullscreen
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: '#f8fafc' }
    : {};

  return (
    <div style={pageStyles as React.CSSProperties} className="relative h-full min-h-[calc(100vh-64px)]">
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-blue-100 text-blue-800 p-2 rounded-full z-10 hover:bg-blue-200"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        )}
      </button>
      
      <EVAAssistantWithCustomAgents />
      
      {showResponsiveTester && <ResponsiveTestingPanel />}
    </div>
  );
};

export default AIAssistantPage; 