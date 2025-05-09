import React, { createContext, useState, useEffect } from 'react';

// Define user role type
export type AppUserRole = 'borrower' | 'lender' | 'admin' | 'broker' | 'vendor' | '';

// Define UserContext interface
export interface UserContextType {
  userRole: AppUserRole;
  showSmartMatching: boolean;
  setShowSmartMatching: (show: boolean) => void;
  showDataOrchestrator: boolean;
  setShowDataOrchestrator: (show: boolean) => void;
  showDocVerification: boolean;
  setShowDocVerification: (show: boolean) => void;
  showCreditAnalysis: boolean;
  setShowCreditAnalysis: (show: boolean) => void;
  showAILifecycleAssistant: boolean;
  setShowAILifecycleAssistant: (show: boolean) => void;
  toggleTool: (tool: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
  isPQCAuthenticated: boolean;
  setPQCAuthenticated: (authenticated: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  userId: string;
  setUserId: (id: string) => void;
  userProfileImage: string;
  setUserProfileImage: (image: string) => void;
}

// Create context with default value
export const UserContext = createContext<UserContextType>({
  userRole: 'lender',
  showSmartMatching: false,
  setShowSmartMatching: (show: boolean) => {
    /* Implementation not needed for default context */
  },
  showDataOrchestrator: false,
  setShowDataOrchestrator: (show: boolean) => {
    /* Implementation not needed for default context */
  },
  showDocVerification: false,
  setShowDocVerification: (show: boolean) => {
    /* Implementation not needed for default context */
  },
  showCreditAnalysis: false,
  setShowCreditAnalysis: (show: boolean) => {
    /* Implementation not needed for default context */
  },
  showAILifecycleAssistant: false,
  setShowAILifecycleAssistant: (show: boolean) => {
    /* Implementation not needed for default context */
  },
  toggleTool: (tool: string) => {
    /* Implementation not needed for default context */
  },
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed: boolean) => {
    /* Implementation not needed for default context */
  },
  theme: 'light',
  setTheme: (theme: string) => {
    /* Implementation not needed for default context */
  },
  isPQCAuthenticated: false,
  setPQCAuthenticated: (authenticated: boolean) => {
    /* Implementation not needed for default context */
  },
  isAuthenticated: false,
  setIsAuthenticated: (authenticated: boolean) => {
    /* Implementation not needed for default context */
  },
  userName: '',
  setUserName: (name: string) => {
    /* Implementation not needed for default context */
  },
  userId: '',
  setUserId: (id: string) => {
    /* Implementation not needed for default context */
  },
  userProfileImage: '/avatars/default-avatar.png',
  setUserProfileImage: (image: string) => {
    /* Implementation not needed for default context */
  },
});

// Provider component
export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPQCAuthenticated, setPQCAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<AppUserRole>('');
  const [userId, setUserId] = useState('');
  const [userProfileImage, setUserProfileImage] = useState('/avatars/default-avatar.png');
  const [showSmartMatching, setShowSmartMatching] = useState(false);
  const [showDataOrchestrator, setShowDataOrchestrator] = useState(false);
  const [showDocVerification, setShowDocVerification] = useState(false);
  const [showCreditAnalysis, setShowCreditAnalysis] = useState(false);
  const [showAILifecycleAssistant, setShowAILifecycleAssistant] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

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

      // Safely cast the role to AppUserRole type
      if (
        storedUserRole === 'borrower' ||
        storedUserRole === 'lender' ||
        storedUserRole === 'admin' ||
        storedUserRole === 'broker' ||
        storedUserRole === 'vendor'
      ) {
        setUserRole(storedUserRole as AppUserRole);
      } else {
        setUserRole('');
      }

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
      case 'assetPress':
        // Navigate to Asset Press page
        window.location.href = '/asset-press';
        break;
      case 'portfolioNavigator':
        // Navigate to Portfolio Wallet page
        window.location.href = '/portfolio-wallet';
        break;
      case 'commercialPaper':
        // Navigate to Commercial Paper page
        window.location.href = '/commercial-paper';
        break;
      default:
        break;
    }
  };

  return (
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
        isPQCAuthenticated,
        setPQCAuthenticated,
        isAuthenticated,
        setIsAuthenticated,
        userName,
        setUserName,
        userId,
        setUserId,
        userProfileImage,
        setUserProfileImage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
