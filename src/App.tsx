import React, { useState, useEffect, useCallback, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { RiskConfigProvider } from './contexts/RiskConfigContext';
import { UserTypeProvider } from './contexts/UserTypeContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserContextProvider, UserContext } from './contexts/UserContext';
import Navbar from './components/layout/Navbar';
import SideNavigation from './components/layout/SideNavigation';
import RouterSelector from './components/routing/RouterSelector';
import LoadableRouter from './components/routing/LoadableRouter';
import AILifecycleAssistant from './components/AILifecycleAssistant';
import SmartMatching from './components/SmartMatching';
import IntelligentDataOrchestrator from './components/IntelligentDataOrchestrator';
import DocumentVerificationChat from './components/DocumentVerificationChat';
import { PQCryptographyProvider } from './components/security/PQCryptographyProvider';
import ChatWidget from './components/communications/ChatWidget';
import useEnvValidation from './hooks/useEnvValidation';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import PWAInstallPrompt from './components/common/PWAInstallPrompt';
import { ToastProvider } from './components/common/ToastContainer';
import { Analytics } from '@vercel/analytics/react';
import ResponsiveTestingPanel from './components/ResponsiveTestingPanel';
import SideNavigationTest from './components/layout/__tests__/SideNavigationTest';

// Import Portfolio Navigator Page
import { PortfolioNavigatorPage } from './pages/PortfolioNavigatorPage';

// Import new pages
import CustomerRetention from './pages/CustomerRetention';
import FormTemplate from './pages/FormTemplate';

// Add the import for TransactionExecutionPage
import TransactionExecutionPage from './pages/TransactionExecutionPage';

// Environment Error Component
const EnvironmentError: React.FC<{ missingVars: string[] }> = ({ missingVars }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-4 text-red-600">
        <svg className="w-8 h-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-xl font-bold">Configuration Error</h2>
      </div>

      <p className="mb-4 text-gray-700">
        The application is missing required environment variables and cannot start properly:
      </p>

      <ul className="mb-4 ml-5 list-disc text-red-600">
        {missingVars.map(variable => (
          <li key={variable}>{variable}</li>
        ))}
      </ul>

      <p className="text-sm text-gray-600">
        Please check your environment configuration and restart the application.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
          <p className="font-medium">Development Info:</p>
          <p>
            Create or update the <code className="px-1 bg-gray-200 rounded">.env.local</code> file
            with the missing variables.
          </p>
        </div>
      )}
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const userContext = React.useContext(UserContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  // Update window dimensions and device info on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowWidth(width);
      setWindowHeight(height);
      
      // Determine device type
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
      
      // Determine orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Default values if context is not available
  const sidebarCollapsed = userContext?.sidebarCollapsed || false;
  const theme = userContext?.theme || 'light';
  const showSmartMatching = userContext?.showSmartMatching || false;
  const showDataOrchestrator = userContext?.showDataOrchestrator || false;
  const showDocVerification = userContext?.showDocVerification || false;
  const showCreditAnalysis = userContext?.showCreditAnalysis || false;
  const showAILifecycleAssistant = userContext?.showAILifecycleAssistant || false;
  const isEvaChatOpen = userContext?.isEvaChatOpen || false;
  const setIsEvaChatOpen = userContext?.setIsEvaChatOpen;

  const setShowSmartMatching = userContext?.setShowSmartMatching;
  const setShowDataOrchestrator = userContext?.setShowDataOrchestrator;
  const setShowDocVerification = userContext?.setShowDocVerification;
  const setShowCreditAnalysis = userContext?.setShowCreditAnalysis;
  const setShowAILifecycleAssistant = userContext?.setShowAILifecycleAssistant;

  // Determine if the UI should be in compact mode for smaller screens
  const isCompactMode = deviceType === 'mobile' || (deviceType === 'tablet' && orientation === 'portrait');

  // Calculate sidebar and content widths based on device type
  const getSidebarWidth = () => {
    if (sidebarCollapsed) return '3.5rem'; // 56px when collapsed
    if (deviceType === 'mobile') return '100%'; // Full width for mobile when expanded (overlay)
    if (deviceType === 'tablet') return '14rem'; // 224px for tablet
    return '16rem'; // 256px for desktop
  };

  const getContentMargin = () => {
    if (deviceType === 'mobile' && !sidebarCollapsed) return '0'; // No margin when sidebar is overlay
    if (sidebarCollapsed) return 'ml-14'; // 3.5rem (56px) when collapsed
    if (deviceType === 'tablet') return 'ml-56'; // 14rem (224px) for tablet
    return 'ml-64'; // 16rem (256px) for desktop
  };

  const getContentMaxWidth = () => {
    if (deviceType === 'mobile' && !sidebarCollapsed) return '100%'; // Full width when sidebar is overlay
    if (sidebarCollapsed) return 'calc(100% - 3.5rem)'; // Subtract collapsed sidebar width
    if (deviceType === 'tablet') return 'calc(100% - 14rem)'; // Subtract tablet sidebar width
    return 'calc(100% - 16rem)'; // Subtract desktop sidebar width
  };

  const getContentPadding = () => {
    if (deviceType === 'mobile') return '0.5rem 0.75rem 0.5rem 1.25rem';
    if (deviceType === 'tablet') return '0.75rem 1rem 0.75rem 1.5rem';
    return '1rem 1.5rem 1rem 2rem';
  };

  // Smart matching user role (from UserContext)
  const getSmartMatchingUserRole = () => {
    const role = userContext?.userRole || 'lender';
    // Only return roles that are valid for SmartMatching component
    if (role === 'borrower' || role === 'lender' || role === 'broker' || role === 'vendor') {
      return role;
    }
    // For 'admin' or empty roles, default to 'lender'
    return 'lender';
  };

  return (
    <div className={`app ${theme} text-sm`} data-device-type={deviceType} data-orientation={orientation}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex h-screen overflow-hidden">
          <SideNavigation />
          <div
            className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${getContentMargin()}`}
            style={{
              maxWidth: getContentMaxWidth(),
              padding: '0',
              width: '100%',
            }}
          >
            <Navbar />
            <main
              className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900"
              style={{
                padding: getContentPadding(),
                maxWidth: '100%',
                width: '100%',
              }}
            >
              <LoadableRouter />

              {/* Chat widgets - conditionally render based on device */}
              {deviceType !== 'mobile' && (
                <div className="fixed bottom-4 right-4 flex flex-col space-y-4 z-40">
                  <ChatWidget
                    mode="communications"
                    initialPosition={{ x: 24, y: -240 }}
                    zIndexBase={50}
                  />
                  <ChatWidget
                    mode="eva"
                    isOpen={isEvaChatOpen}
                    onClose={() => setIsEvaChatOpen && setIsEvaChatOpen(false)}
                    initialPosition={{ x: 24, y: 0 }}
                    zIndexBase={45}
                  />
                </div>
              )}

              {/* Mobile chat widgets - simplified for mobile */}
              {deviceType === 'mobile' && (
                <div className="fixed bottom-4 right-4 z-40">
                  <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* PWA Install Prompt */}
              <PWAInstallPrompt />
              
              {/* Responsive Testing Panel */}
              <ResponsiveTestingPanel />
            </main>

            {/* Smart Matching Component */}
            {showSmartMatching && (
              <SmartMatching
                isOpen={showSmartMatching}
                onClose={() => {
                  if (setShowSmartMatching) {
                    setShowSmartMatching(false);
                  }
                }}
                userRole={getSmartMatchingUserRole()}
              />
            )}

            {/* Data Orchestrator Component */}
            {showDataOrchestrator && (
              <IntelligentDataOrchestrator
                isOpen={showDataOrchestrator}
                onClose={() => setShowDataOrchestrator?.(false)}
              />
            )}

            {/* Document Verification Chat Component */}
            {showDocVerification && (
              <DocumentVerificationChat
                isOpen={showDocVerification}
                onClose={() => setShowDocVerification?.(false)}
              />
            )}

            {/* AI Lifecycle Assistant Component */}
            {showAILifecycleAssistant && (
              <AILifecycleAssistant
                isOpen={showAILifecycleAssistant}
                onClose={() => setShowAILifecycleAssistant?.(false)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Force set environment variables in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (!process.env.REACT_APP_AUTH_DOMAIN) {
        (process.env as any).REACT_APP_AUTH_DOMAIN = 'eva-platform.us.auth0.com';
      }
      if (!process.env.REACT_APP_AUTH_CLIENT_ID) {
        (process.env as any).REACT_APP_AUTH_CLIENT_ID = 'EVAPlatformAuth2023';
      }
      if (!process.env.REACT_APP_ENVIRONMENT) {
        (process.env as any).REACT_APP_ENVIRONMENT = 'development';
      }
    }
  }, []);

  // Validate environment variables
  const { isValid, missingVars, isLoading } = useEnvValidation();

  // If environment validation is still loading, show a loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading application configuration...</p>
        </div>
      </div>
    );
  }

  // If environment validation failed, show an error
  if (!isValid && process.env.NODE_ENV === 'production') {
    return <EnvironmentError missingVars={missingVars} />;
  }

  // Override environment validation for development mode
  const overriddenIsValid = process.env.NODE_ENV === 'development' ? true : isValid;
  const overriddenMissingVars = process.env.NODE_ENV === 'development' ? [] : missingVars;

  return (
    <AppErrorBoundary>
      <UserContextProvider>
        <AuthProvider>
          <RiskConfigProvider>
            <UserTypeProvider>
              <ToastProvider>
                <Router>
                  <WorkflowProvider>
                    <AppContent />
                    <Analytics />
                  </WorkflowProvider>
                </Router>
              </ToastProvider>
            </UserTypeProvider>
          </RiskConfigProvider>
        </AuthProvider>
      </UserContextProvider>
    </AppErrorBoundary>
  );
}

export default App;
