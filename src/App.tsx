import React, { useState, useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { WorkflowProvider } from './contexts/WorkflowContext';
import { RiskConfigProvider } from './contexts/RiskConfigContext';
import { UserTypeProvider } from './contexts/UserTypeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import SideNavigation from './components/layout/SideNavigation';
import RouterSelector from './components/routing/RouterSelector';
import LoadableRouter from './components/routing/LoadableRouter';
import AILifecycleAssistant from './components/AILifecycleAssistant';
import SmartMatching from './components/SmartMatching';
import { PQCryptographyProvider } from './components/security/PQCryptographyProvider';
import { UserContext } from './contexts/UserContext';
import ChatWidget from './components/communications/ChatWidget';

// Import Portfolio Navigator Page
import { PortfolioNavigatorPage } from './pages/PortfolioNavigatorPage';

// Import new pages
import CustomerRetention from './pages/CustomerRetention';
import FormTemplate from './pages/FormTemplate';

// Add the import for TransactionExecutionPage
import TransactionExecutionPage from './pages/TransactionExecutionPage';

// Define user role type
type AppUserRole = 'borrower' | 'lender' | 'admin' | 'broker' | 'vendor' | '';

function App() {
  const [showSmartMatching, setShowSmartMatching] = useState(false);
  const [showDataOrchestrator, setShowDataOrchestrator] = useState(false);
  const [showDocVerification, setShowDocVerification] = useState(false);
  const [showCreditAnalysis, setShowCreditAnalysis] = useState(false);
  const [showAILifecycleAssistant, setShowAILifecycleAssistant] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [userRole, setUserRole] = useState<AppUserRole>('lender');

  // Toggle tool visibility
  const toggleTool = (tool: string) => {
    switch (tool) {
      case 'smartMatching':
        setShowSmartMatching(!showSmartMatching);
        break;
      case 'dataOrchestrator':
        setShowDataOrchestrator(!showDataOrchestrator);
        break;
      case 'docVerification':
        setShowDocVerification(!showDocVerification);
        break;
      case 'creditAnalysis':
        setShowCreditAnalysis(!showCreditAnalysis);
        break;
      case 'lifecycleAssistant':
        setShowAILifecycleAssistant(!showAILifecycleAssistant);
        break;
      default:
        break;
    }
  };

  // Helper function to convert AppUserRole to SmartMatching's expected UserRole type
  const getSmartMatchingUserRole = (
    role: AppUserRole
  ): 'borrower' | 'lender' | 'broker' | 'vendor' => {
    // Only return roles that are valid for SmartMatching component
    if (role === 'borrower' || role === 'lender' || role === 'broker' || role === 'vendor') {
      return role;
    }
    // For 'admin' or empty roles, default to 'lender'
    return 'lender';
  };

  return (
    <AuthProvider>
      <UserContext.Provider
        value={{
          userRole,
          showSmartMatching,
          setShowSmartMatching,
          showDataOrchestrator,
          setShowDataOrchestrator,
          showDocVerification,
          setShowDocVerification,
          showCreditAnalysis,
          setShowCreditAnalysis,
          showAILifecycleAssistant,
          setShowAILifecycleAssistant,
          toggleTool,
          sidebarCollapsed,
          setSidebarCollapsed,
          theme,
          setTheme,
          isPQCAuthenticated: true, // Default to true for now
          setPQCAuthenticated: () => {}, // No-op
          isAuthenticated: true, // Use AuthContext now instead
          setIsAuthenticated: () => {}, // No-op
          userName: '', // Use AuthContext
          setUserName: () => {}, // No-op
          userId: '', // Use AuthContext
          setUserId: () => {}, // No-op
          userProfileImage: '/avatars/default-avatar.png',
          setUserProfileImage: () => {}, // No-op
        }}
      >
        <PQCryptographyProvider>
          <RiskConfigProvider>
            <UserTypeProvider>
              <Router>
                <WorkflowProvider>
                  <div className={`app ${theme} text-sm`}>
                    <div className="min-h-screen bg-gray-100">
                      <div className="flex h-screen overflow-hidden">
                        <SideNavigation />
                        <div
                          className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-72'}`}
                        >
                          <Navbar />
                          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
                            <LoadableRouter />

                            {/* Chat widgets */}
                            <div className="fixed bottom-4 right-4 flex flex-col space-y-4 z-40">
                              <ChatWidget
                                mode="communications"
                                initialPosition={{ x: 24, y: -240 }}
                                zIndexBase={50}
                              />
                              <ChatWidget
                                mode="eva"
                                initialPosition={{ x: 24, y: 0 }}
                                zIndexBase={45}
                              />
                            </div>
                          </main>

                          {/* Smart Matching Component */}
                          {showSmartMatching && (
                            <SmartMatching
                              isOpen={showSmartMatching}
                              onClose={() => setShowSmartMatching(false)}
                              userRole={getSmartMatchingUserRole(userRole)}
                            />
                          )}

                          {/* AI Lifecycle Assistant Component */}
                          {showAILifecycleAssistant && (
                            <AILifecycleAssistant
                              isOpen={showAILifecycleAssistant}
                              onClose={() => setShowAILifecycleAssistant(false)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </WorkflowProvider>
              </Router>
            </UserTypeProvider>
          </RiskConfigProvider>
        </PQCryptographyProvider>
      </UserContext.Provider>
    </AuthProvider>
  );
}

export default App;
