import { UserType, EmployeeRole } from '../types/UserTypes';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  employeeRole?: EmployeeRole;
  organizationId: string;
  organizationName: string;
  phoneNumber?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

// Whitelist of allowed emails
const ALLOWED_EMAILS = [
  'justin@evafi.ai',
  'rao@evafi.ai',
  'abel@evafi.ai',
  'lahari@evafi.ai',
  'tech@evafi.ai',
  'demo@evafi.ai',
  'customer@lender.com',
  'investor@gmail.com',
];

// Allowed phone number for development access
const ALLOWED_PHONE = '7027654321';

/**
 * Authentication Service
 * Handles user authentication, token management, and role-based access
 */
class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login with email and password
   */
  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Check if email is in the whitelist
      if (!ALLOWED_EMAILS.includes(credentials.email.toLowerCase())) {
        throw new Error('Access denied. Your email is not authorized for this development system.');
      }

      // Check phone number if provided
      if (credentials.phoneNumber && credentials.phoneNumber !== ALLOWED_PHONE) {
        throw new Error('Invalid phone number for authentication.');
      }

      // In a real app, this would make an API call to a backend
      // For now, we'll simulate a successful response for a demo user

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock JWT token response
      const user: AuthUser = {
        id: 'usr_123456789',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        userType: UserType.LENDER, // Default to lender
        employeeRole: EmployeeRole.ADMIN,
        organizationId: 'org_123456789',
        organizationName: 'Demo Financial Services',
        phoneNumber: credentials.phoneNumber,
      };

      // Determine user type based on email domain
      if (credentials.email.includes('@evafi.ai')) {
        user.userType = UserType.LENDER;
        user.organizationName = 'EVA Financial';
      } else if (credentials.email.includes('@lender.com')) {
        user.userType = UserType.LENDER;
        user.organizationName = 'Customer Financial';
      } else if (credentials.email.includes('@gmail.com')) {
        user.userType = UserType.BROKERAGE;
        user.organizationName = 'Investor Services';
      }

      // Create expiry 2 hours from now
      const expiresAt = Date.now() + 2 * 60 * 60 * 1000;

      // Create mock tokens
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXIuaWR9IiwidXNlclR5cGUiOiIke3VzZXIudXNlclR5cGV9IiwiZW1wbG95ZWVSb2xlIjoiJHt1c2VyLmVtcGxveWVlUm9sZX0iLCJvcmdJZCI6IiR7dXNlci5vcmdhbml6YXRpb25JZH0iLCJleHAiOiR7ZXhwaXJlc0F0fX0`;
      const refreshToken = `refresh_${token}`;

      // Save to state and localStorage
      this.currentUser = user;
      this.token = token;
      this.refreshToken = refreshToken;
      this.tokenExpiry = expiresAt;

      this.saveToStorage();

      // Set user role in localStorage for demo purposes
      let userRole = 'lender';
      if (user.userType === UserType.BUSINESS) userRole = 'borrower';
      if (user.userType === UserType.VENDOR) userRole = 'vendor';
      if (user.userType === UserType.BROKERAGE) userRole = 'broker';
      localStorage.setItem('userRole', userRole);

      return {
        user,
        token,
        refreshToken,
        expiresAt,
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Authentication failed. Please check your credentials and try again.'
      );
    }
  }

  /**
   * Log out the current user
   */
  public logout(): void {
    this.currentUser = null;
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;

    // Clear storage
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_expires');
    localStorage.removeItem('userRole');

    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Get the current authenticated user
   */
  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  /**
   * Check if the user is authenticated
   */
  public isAuthenticated(): boolean {
    return !!this.currentUser && !!this.token && this.tokenExpiry > Date.now();
  }

  /**
   * Get the JWT access token
   */
  public getToken(): string | null {
    // Check if token is expired
    if (this.tokenExpiry && this.tokenExpiry < Date.now()) {
      this.refreshUserToken();
    }
    return this.token;
  }

  /**
   * Refresh the user token
   */
  private async refreshUserToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) {
        this.logout();
        return false;
      }

      // In a real app, this would make an API call to refresh the token
      // For demo purposes, just extend the expiry
      this.tokenExpiry = Date.now() + 2 * 60 * 60 * 1000;
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Get the HTTP Authorization header
   */
  public getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Check if the current user has a specific role
   */
  public hasRole(role: UserType): boolean {
    return this.currentUser?.userType === role;
  }

  /**
   * Check if the current user's employee role meets a minimum level
   */
  public hasEmployeeRole(minRole: EmployeeRole): boolean {
    if (!this.currentUser?.employeeRole) return false;

    const roleValues: Record<EmployeeRole, number> = {
      [EmployeeRole.VIEWER]: 1,
      [EmployeeRole.OPERATOR]: 2,
      [EmployeeRole.MANAGER]: 3,
      [EmployeeRole.ADMIN]: 4,
    };

    return roleValues[this.currentUser.employeeRole] >= roleValues[minRole];
  }

  /**
   * Save auth data to localStorage
   */
  private saveToStorage(): void {
    if (this.currentUser) {
      localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
    }
    if (this.token) {
      localStorage.setItem('auth_token', this.token);
    }
    if (this.refreshToken) {
      localStorage.setItem('auth_refresh_token', this.refreshToken);
    }
    if (this.tokenExpiry) {
      localStorage.setItem('auth_expires', this.tokenExpiry.toString());
    }
  }

  /**
   * Load auth data from localStorage
   */
  private loadFromStorage(): void {
    const userJson = localStorage.getItem('auth_user');
    if (userJson) {
      try {
        this.currentUser = JSON.parse(userJson);
      } catch (e) {
        console.error('Failed to parse auth user from storage', e);
        this.currentUser = null;
      }
    }

    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('auth_refresh_token');

    const expiryStr = localStorage.getItem('auth_expires');
    this.tokenExpiry = expiryStr ? parseInt(expiryStr, 10) : 0;

    // If token is expired, try to refresh, otherwise logout
    if (this.tokenExpiry && this.tokenExpiry < Date.now()) {
      this.refreshUserToken().catch(() => this.logout());
    }
  }
}

// Export singleton instance
export default AuthService.getInstance();
