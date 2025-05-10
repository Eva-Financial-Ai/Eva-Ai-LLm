import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User types
export enum UserRole {
  LENDER = 'lender',
  BORROWER = 'borrower',
  BROKER = 'broker',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  phoneNumber?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, phoneNumber?: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

// Whitelist (for demo purposes only)
const ALLOWED_EMAILS = [
  'justin@evafi.ai',
  'rao@evafi.ai',
  'abel@evafi.ai',
  'lahari@evafi.ai',
  'tech@evafi.ai',
  'demo@evafi.ai',
  'customer@lender.com',
  'investor@gmail.com',
  // Add a catch-all option for easy demo purposes
  'demo@demo.com',
];

// Allowed phone number (for demo purposes only)
const ALLOWED_PHONE = '7027654321';
const DEMO_PHONE = '1234567890'; // Easy to remember demo phone

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('eva_user');
        const storedToken = localStorage.getItem('eva_token');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error loading user from localStorage:', err);
        // Clear potentially corrupt data
        localStorage.removeItem('eva_user');
        localStorage.removeItem('eva_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string, phoneNumber?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if the email is in the allowed whitelist or is the demo email
      if (
        !ALLOWED_EMAILS.includes(email.toLowerCase()) &&
        email.toLowerCase() !== 'demo@demo.com'
      ) {
        setError('Access denied. This email is not authorized for demo access.');
        return false;
      }

      // Check phone number only if provided and not the demo phone
      if (phoneNumber && phoneNumber !== ALLOWED_PHONE && phoneNumber !== DEMO_PHONE) {
        setError('Invalid phone number for demo access.');
        return false;
      }

      // For demo purposes, any non-empty password will work
      if (!password.trim()) {
        setError('Password is required.');
        return false;
      }

      // Simulate network delay for realism
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create a user object
      let role = UserRole.LENDER; // Default role
      let organizationName = 'EVA Financial';

      // Determine role based on email pattern
      if (email.includes('@lender.com')) {
        role = UserRole.LENDER;
        organizationName = 'Lender Financial';
      } else if (email.includes('@gmail.com') || email.includes('broker')) {
        role = UserRole.BROKER;
        organizationName = 'Brokerage Services';
      } else if (email.includes('borrower')) {
        role = UserRole.BORROWER;
        organizationName = 'Borrower Corp';
      } else if (email.includes('vendor')) {
        role = UserRole.VENDOR;
        organizationName = 'Vendor Services';
      }

      // Create user object
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: email,
        firstName: email.split('@')[0].split('.')[0],
        lastName: email.split('@')[0].split('.')[1] || 'User',
        role: role,
        organizationId: `org_${Date.now()}`,
        organizationName: organizationName,
        phoneNumber: phoneNumber || '',
      };

      // Create a mock token
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ userId: newUser.id, role: newUser.role, exp: Date.now() + 24 * 60 * 60 * 1000 }))}`;

      // Store in localStorage
      localStorage.setItem('eva_user', JSON.stringify(newUser));
      localStorage.setItem('eva_token', token);
      localStorage.setItem('eva_token_expiry', (Date.now() + 24 * 60 * 60 * 1000).toString());

      // Update state
      setUser(newUser);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('eva_user');
    localStorage.removeItem('eva_token');
    localStorage.removeItem('eva_token_expiry');
    setUser(null);

    // Redirect to login page
    window.location.href = '/login';
  };

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
