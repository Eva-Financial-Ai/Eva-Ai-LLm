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

  // Default values if context is not available
  const sidebarCollapsed = userContext?.sidebarCollapsed || false;
  const theme = userContext?.theme || 'light';
  const showSmartMatching = userContext?.showSmartMatching || false;
  const showDataOrchestrator = userContext?.showDataOrchestrator || false;
  const showDocVerification = userContext?.showDocVerification || false;
  const showCreditAnalysis = userContext?.showCreditAnalysis || false;
  const showAILifecycleAssistant = userContext?.showAILifecycleAssistant || false;
  const setShowSmartMatching = userContext?.setShowSmartMatching;
  const setShowDataOrchestrator = userContext?.setShowDataOrchestrator;
  const setShowDocVerification = userContext?.setShowDocVerification;
  const setShowCreditAnalysis = userContext?.setShowCreditAnalysis;
  const setShowAILifecycleAssistant = userContext?.setShowAILifecycleAssistant;

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
    <div className={`app ${theme} text-sm`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex h-screen overflow-hidden">
          <SideNavigation />
          <div
            className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
              sidebarCollapsed ? 'ml-14' : 'ml-56'
            }`}
            style={{
              maxWidth: sidebarCollapsed ? 'calc(100% - 3.5rem)' : 'calc(100% - 14rem)',
              padding: '0',
            }}
          >
            <Navbar />
            <main
              className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900"
              style={{
                padding: '1rem 1.5rem',
                maxWidth: '100%',
              }}
            >
              <LoadableRouter />

              {/* Chat widgets */}
              <div className="fixed bottom-4 right-4 flex flex-col space-y-4 z-40">
                <ChatWidget
                  mode="communications"
                  initialPosition={{ x: 24, y: -240 }}
                  zIndexBase={50}
                />
                <ChatWidget mode="eva" initialPosition={{ x: 24, y: 0 }} zIndexBase={45} />
              </div>

              {/* PWA Install Prompt */}
              <PWAInstallPrompt />
            </main>

            {/* Smart Matching Component */}
            {showSmartMatching && (
              <SmartMatching
                isOpen={showSmartMatching}
                onClose={() => setShowSmartMatching?.(false)}
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
