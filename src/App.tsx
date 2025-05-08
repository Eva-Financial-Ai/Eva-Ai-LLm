import React, { useState, useContext, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { WorkflowProvider, useWorkflow } from './contexts/WorkflowContext';
import { RiskConfigProvider } from './contexts/RiskConfigContext';
import { UserTypeProvider } from './contexts/UserTypeContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import TopNavigation from './components/layout/TopNavigation';
import RouterSelector from './components/routing/RouterSelector';
import AILifecycleAssistant from './components/AILifecycleAssistant';
import SmartMatching from './components/SmartMatching';
import IntelligentDataOrchestrator from './components/IntelligentDataOrchestrator';
import DocumentVerificationSystem from './components/DocumentVerificationSystem';
import CreditAnalysisChatInterface from './components/CreditAnalysisChatInterface';
import PQCLogin from './components/security/PQCLogin';
import { PQCryptographyProvider, usePQCryptography } from './components/security/PQCryptographyProvider';
import Login from './pages/Login';
import SessionExpiryNotification from './components/security/SessionExpiryNotification';
import DocumentVerificationWrapper from './components/DocumentVerificationWrapper';
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

// Create a wrapper component for document verification that has access to workflow context
const DocVerificationSystem = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  // This component can safely use the useWorkflow hook since it's rendered inside WorkflowProvider
  const { currentTransaction } = useWorkflow();
  
  return (
    <DocumentVerificationSystem
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPQCAuthenticated, setPQCAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userProfileImage, setUserProfileImage] = useState('/avatars/default-avatar.png');
  const [showPQCReauth, setShowPQCReauth] = useState(false);
  const [showDataOrchestrator, setShowDataOrchestrator] = useState(false);
  const [showDocVerification, setShowDocVerification] = useState(false);
  const [showCreditAnalysis, setShowCreditAnalysis] = useState(false);
  const [showAILifecycleAssistant, setShowAILifecycleAssistant] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const { showSmartMatching, setShowSmartMatching, userRole } = useContext(UserContext);

  // Check for authentication on mount
  useEffect(() => {
    // Check stored authentication (this is a simple example, not secure for production)
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserId = localStorage.getItem('userId');
    const storedUserProfileImage = localStorage.getItem('userProfileImage');
    
    if (storedAuth === 'true' && storedUserName) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
      setUserId(storedUserId || '');
      if (storedUserProfileImage) {
        setUserProfileImage(storedUserProfileImage);
      }
    }
    
    // Check for PQC authentication
    const storedPQCAuth = localStorage.getItem('isPQCAuthenticated');
    if (storedPQCAuth === 'true') {
      setPQCAuthenticated(true);
    }
  }, []);
  
  // Function to handle authentication in one place
  const handleLoginSuccess = (userData: any) => {
    setIsAuthenticated(true);
    setUserName(userData.name || 'User');
    
    // Safely cast the role to AppUserRole type
    const role = userData.role;
    setUserId(userData.id || '');
    
    // Store authentication
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', userData.name || 'User');
    localStorage.setItem('userRole', userData.role || '');
    localStorage.setItem('userId', userData.id || '');
    
    if (userData.profileImage) {
      setUserProfileImage(userData.profileImage);
      localStorage.setItem('userProfileImage', userData.profileImage);
    }
  };
  
  // Function to handle PQC session re-authentication
  const handleReauthenticate = () => {
    setShowPQCReauth(true);
    setPQCAuthenticated(false);
    localStorage.setItem('isPQCAuthenticated', 'false');
  };
  
  // Function to handle successful PQC authentication
  const handlePQCLoginSuccess = () => {
    setPQCAuthenticated(true);
    setShowPQCReauth(false);
    localStorage.setItem('isPQCAuthenticated', 'true');
  };

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
  const getSmartMatchingUserRole = (role: AppUserRole): 'borrower' | 'lender' | 'broker' | 'vendor' => {
    // Only return roles that are valid for SmartMatching component
    if (role === 'borrower' || role === 'lender' || role === 'broker' || role === 'vendor') {
      return role;
    }
    // For 'admin' or empty roles, default to 'lender'
    return 'lender';
  };

  return (
    <UserContext.Provider value={{
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
      isPQCAuthenticated,
      setPQCAuthenticated,
      isAuthenticated,
      setIsAuthenticated,
      userName,
      setUserName,
      userId,
      setUserId,
      userProfileImage,
      setUserProfileImage
    }}>
      <PQCryptographyProvider>
        <RiskConfigProvider>
          <UserTypeProvider>
            <Router>
              <WorkflowProvider>
                {/* We define RouterDocVerificationWrapper inside the Router context */}
                {(function() {
                  // This component is defined inside a function to ensure it's in the Router context
                  const RouterDocVerificationWrapper = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
                    const navigate = useNavigate();
                    const { currentTransaction } = useWorkflow();
                    
                    return (
                      <DocumentVerificationWrapper
                        isOpen={isOpen}
                        onClose={onClose}
                        documentId={currentTransaction?.id || undefined}
                        navigate={navigate}
                      />
                    );
                  };
                  
                  // Return the main application UI with access to the wrapper component
                  return isAuthenticated ? (
                  isPQCAuthenticated || showPQCReauth ? (
                    <div className={`app ${theme} text-sm`}>
                      <div className="min-h-screen bg-gray-100">
                        <div className="flex h-screen overflow-hidden">
                          {!sidebarCollapsed && <Sidebar />}
                          <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-14' : 'ml-56'}`}>
                            <Navbar />
                            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                              <RouterSelector />
                              
                              {/* Replace the Communication bar with only two chat widgets - EVA and Clear Communications */}
                              <div className="fixed bottom-4 right-4 flex flex-col space-y-4 z-40">
                                <ChatWidget mode="communications" initialPosition={{ x: 24, y: -240 }} zIndexBase={50} />
                                <ChatWidget mode="eva" initialPosition={{ x: 24, y: 0 }} zIndexBase={45} />
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
                            
                            {/* Intelligent Data Orchestrator Component - now part of AI Chat */}
                            {/* Data Orchestrator will be accessed from AI Chat interface */}
                            
                            {/* Document Verification System Component - only accessible from chat */}
                            {/* Document Verification will only be accessible from the AI Chat interface */}
                            
                            {/* AI Lifecycle Assistant Component */}
                            {showAILifecycleAssistant && (
                              <AILifecycleAssistant
                                isOpen={showAILifecycleAssistant}
                                onClose={() => setShowAILifecycleAssistant(false)}
                              />
                            )}
                            
                            {/* Credit Analysis is disabled - coming soon */}
                            
                            {/* PQC Session Expiry Notification */}
                            <SessionExpiryNotification onReauthenticate={handleReauthenticate} />
                            
                            {/* Re-authentication Modal */}
                            {showPQCReauth && !isPQCAuthenticated && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                  <h2 className="text-xl font-bold mb-4">Session Expired</h2>
                                  <p className="mb-4">Your cryptographic session has expired. Please re-authenticate to continue.</p>
                                  <PQCLogin onLoginSuccess={handlePQCLoginSuccess} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <PQCLogin onLoginSuccess={handlePQCLoginSuccess} />
                  )
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              })()}
              </WorkflowProvider>
            </Router>
          </UserTypeProvider>
        </RiskConfigProvider>
      </PQCryptographyProvider>
    </UserContext.Provider>
  );
}

export default App; 