// Import mock data
import { mockLoginResponse } from './mockData';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA = true; // Set to false when your API is ready

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

// Define types
interface LoginCredentials {
  email: string;
  password: string;
  phoneNumber?: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
  };
  error?: string;
}

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Check if email is in the whitelist
  if (!ALLOWED_EMAILS.includes(credentials.email.toLowerCase())) {
    return {
      success: false,
      error: 'Access denied. Your email is not authorized for this development system.',
    };
  }

  // Check phone number if provided
  if (credentials.phoneNumber && credentials.phoneNumber !== ALLOWED_PHONE) {
    return {
      success: false,
      error: 'Invalid phone number for authentication.',
    };
  }

  // Use mock data if flag is set
  if (USE_MOCK_DATA) {
    console.log('Using mock authentication data');

    // Check if credentials are provided (basic validation)
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: 'Email and password are required.',
      };
    }

    // Create a customized mock response based on the actual email
    const customResponse = {
      ...mockLoginResponse,
      user: {
        ...mockLoginResponse.user,
        email: credentials.email,
        name: credentials.email
          .split('@')[0]
          .replace('.', ' ')
          .replace(/\b\w/g, l => l.toUpperCase()),
        phoneNumber: credentials.phoneNumber,
      },
    };

    // Store the mock token and user data
    localStorage.setItem('auth_token', customResponse.token);
    localStorage.setItem('user', JSON.stringify(customResponse.user));

    return customResponse;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (data.success && data.token) {
      // Store the token in localStorage
      localStorage.setItem('auth_token', data.token);

      // Store user data if needed
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    }

    return data;
  } catch (error) {
    console.error('Login failed:', error);

    if (USE_MOCK_DATA) {
      console.log('Falling back to mock authentication');

      // Create a customized mock response based on the actual email
      const customResponse = {
        ...mockLoginResponse,
        user: {
          ...mockLoginResponse.user,
          email: credentials.email,
          name: credentials.email
            .split('@')[0]
            .replace('.', ' ')
            .replace(/\b\w/g, l => l.toUpperCase()),
          phoneNumber: credentials.phoneNumber,
        },
      };

      localStorage.setItem('auth_token', customResponse.token);
      localStorage.setItem('user', JSON.stringify(customResponse.user));

      return customResponse;
    }

    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

// Get current user
export const getCurrentUser = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

// Logout
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  // You might want to redirect to login page here
  window.location.href = '/login';
};

// Refresh token
export const refreshToken = async (): Promise<boolean> => {
  const token = localStorage.getItem('auth_token');

  if (!token) return false;

  if (USE_MOCK_DATA) {
    console.log('Using mock token refresh');
    return true;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data: AuthResponse = await response.json();

    if (data.success && data.token) {
      localStorage.setItem('auth_token', data.token);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return USE_MOCK_DATA; // Return true if using mock data
  }
};
