import axios from 'axios';

/**
 * Shield Authentication API Configuration
 */
interface ShieldAuthConfig {
  apiUrl: string;
  apiKey: string;
  clientId: string;
  clientSecret?: string;
  redirectUri?: string;
}

/**
 * User verification levels
 */
enum VerificationLevel {
  BASIC = 'basic', // Email verification only
  STANDARD = 'standard', // Identity verification
  ENHANCED = 'enhanced', // Identity + Financial verification
  COMPLETE = 'complete', // Identity + Financial + Background check
}

/**
 * Verification status types
 */
enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  REQUIRES_REVIEW = 'requires_review',
}

/**
 * Basic user profile information
 */
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  verificationLevel: VerificationLevel;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

/**
 * KYC verification request
 */
interface KYCVerificationRequest {
  userId: string;
  documentType: 'passport' | 'drivers_license' | 'id_card' | 'other';
  documentFront?: File | string; // File object or base64 encoded string
  documentBack?: File | string;
  selfie?: File | string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  dateOfBirth?: string; // ISO format YYYY-MM-DD
  ssn?: string; // Social Security Number (for US)
}

/**
 * KYB verification request
 */
interface KYBVerificationRequest {
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  incorporationDate?: string; // ISO format YYYY-MM-DD
  legalStructure?: string;
  businessType?: string;
  documents?: {
    type: 'incorporation' | 'registration' | 'tax' | 'utility_bill' | 'other';
    file: File | string; // File object or base64 encoded string
    description?: string;
  }[];
  ubo?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    ownershipPercentage: number;
  }[];
}

/**
 * Financial account information
 */
interface FinancialAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'other';
  accountName: string;
  accountNumber: string; // Masked except last 4 digits
  balance: {
    current: number;
    available?: number;
    limit?: number;
  };
  currency: string;
  linkedAt: string;
}

/**
 * Default configuration
 */
const defaultConfig: ShieldAuthConfig = {
  apiUrl: process.env.REACT_APP_SHIELD_AUTH_API_URL || 'https://api.shield-auth.example.com',
  apiKey: process.env.REACT_APP_SHIELD_AUTH_API_KEY || '',
  clientId: process.env.REACT_APP_SHIELD_AUTH_CLIENT_ID || '',
  redirectUri:
    process.env.REACT_APP_SHIELD_AUTH_REDIRECT_URI || window.location.origin + '/auth/callback',
};

/**
 * Shield Authentication Connector
 * Provides KYC, KYB, and financial account verification services
 * Combines functionality similar to Auth0, Plaid, and LexisNexis
 */
class ShieldAuthConnector {
  private config: ShieldAuthConfig;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  constructor(customConfig?: Partial<ShieldAuthConfig>) {
    this.config = { ...defaultConfig, ...customConfig };
  }

  /**
   * Initialize the connector
   * @param apiKey - Optional API key to override the default
   */
  initialize(apiKey?: string): void {
    if (apiKey) {
      this.config.apiKey = apiKey;
    }

    // Validate configuration
    if (!this.config.apiKey || !this.config.clientId) {
      console.warn('Shield Auth API key or Client ID not provided. API calls will likely fail.');
    }
  }

  /**
   * Get a valid token for API requests
   */
  private async getToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.tokenExpiry - 60000) {
      return this.token;
    }

    // Request a new token
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/v1/auth/token`,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey,
          },
        }
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      // Ensure we never return null for token
      if (!this.token) {
        throw new Error('Failed to obtain auth token: Token is null');
      }

      return this.token;
    } catch (error) {
      console.error('Error getting Shield Auth token:', error);
      throw new Error('Failed to obtain auth token');
    }
  }

  /**
   * Generate an authentication URL for user login
   * @param options - Authentication options
   */
  getAuthenticationUrl(options?: {
    state?: string;
    scope?: string;
    verificationLevel?: VerificationLevel;
  }): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || '',
      response_type: 'code',
      state: options?.state || Math.random().toString(36).substring(2, 15),
      scope: options?.scope || 'openid profile email',
      verification_level: options?.verificationLevel || VerificationLevel.BASIC,
    });

    return `${this.config.apiUrl}/v1/auth/authorize?${params.toString()}`;
  }

  /**
   * Exchange auth code for token
   * @param code - Authorization code from redirect
   */
  async exchangeAuthCode(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/v1/auth/token`,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.config.redirectUri,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey,
          },
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        idToken: response.data.id_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error('Error exchanging auth code:', error);
      throw error;
    }
  }

  /**
   * Get user profile information
   * @param userId - User ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${this.config.apiUrl}/v1/users/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': this.config.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Start KYC verification process
   * @param request - KYC verification request
   */
  async startKYCVerification(request: KYCVerificationRequest): Promise<{
    verificationId: string;
    status: VerificationStatus;
    redirectUrl?: string; // URL to verification flow if applicable
  }> {
    try {
      const token = await this.getToken();
      const formData = new FormData();

      // Add all fields to form data
      formData.append('userId', request.userId);
      formData.append('documentType', request.documentType);

      if (request.documentFront) {
        if (typeof request.documentFront === 'string') {
          formData.append('documentFront', request.documentFront);
        } else {
          formData.append('documentFront', request.documentFront);
        }
      }

      if (request.documentBack) {
        if (typeof request.documentBack === 'string') {
          formData.append('documentBack', request.documentBack);
        } else {
          formData.append('documentBack', request.documentBack);
        }
      }

      if (request.selfie) {
        if (typeof request.selfie === 'string') {
          formData.append('selfie', request.selfie);
        } else {
          formData.append('selfie', request.selfie);
        }
      }

      if (request.address) {
        formData.append('address', JSON.stringify(request.address));
      }

      if (request.dateOfBirth) {
        formData.append('dateOfBirth', request.dateOfBirth);
      }

      if (request.ssn) {
        formData.append('ssn', request.ssn);
      }

      const response = await axios.post(`${this.config.apiUrl}/v1/verifications/kyc`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': this.config.apiKey,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error starting KYC verification:', error);
      throw error;
    }
  }

  /**
   * Start KYB verification process
   * @param request - KYB verification request
   */
  async startKYBVerification(request: KYBVerificationRequest): Promise<{
    verificationId: string;
    status: VerificationStatus;
    redirectUrl?: string; // URL to verification flow if applicable
  }> {
    try {
      const token = await this.getToken();
      const formData = new FormData();

      // Add all fields to form data
      formData.append('userId', request.userId);
      formData.append('companyName', request.companyName);
      formData.append('registrationNumber', request.registrationNumber);
      formData.append('taxId', request.taxId);
      formData.append('address', JSON.stringify(request.address));

      if (request.incorporationDate) {
        formData.append('incorporationDate', request.incorporationDate);
      }

      if (request.legalStructure) {
        formData.append('legalStructure', request.legalStructure);
      }

      if (request.businessType) {
        formData.append('businessType', request.businessType);
      }

      if (request.documents && request.documents.length > 0) {
        request.documents.forEach((doc, index) => {
          formData.append(`documents[${index}][type]`, doc.type);
          if (typeof doc.file === 'string') {
            formData.append(`documents[${index}][file]`, doc.file);
          } else {
            formData.append(`documents[${index}][file]`, doc.file);
          }
          if (doc.description) {
            formData.append(`documents[${index}][description]`, doc.description);
          }
        });
      }

      if (request.ubo && request.ubo.length > 0) {
        formData.append('ubo', JSON.stringify(request.ubo));
      }

      const response = await axios.post(`${this.config.apiUrl}/v1/verifications/kyb`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': this.config.apiKey,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error starting KYB verification:', error);
      throw error;
    }
  }

  /**
   * Get verification status
   * @param verificationId - ID of the verification process
   */
  async getVerificationStatus(verificationId: string): Promise<{
    id: string;
    userId: string;
    type: 'kyc' | 'kyb';
    status: VerificationStatus;
    details?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
  }> {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${this.config.apiUrl}/v1/verifications/${verificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': this.config.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting verification status:', error);
      throw error;
    }
  }

  /**
   * Link financial accounts (similar to Plaid)
   * @param userId - User ID
   */
  async initiateAccountLinking(userId: string): Promise<{
    linkToken: string;
    expiration: string;
    redirectUri: string;
  }> {
    try {
      const token = await this.getToken();
      const response = await axios.post(
        `${this.config.apiUrl}/v1/financial/link/create`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating account linking:', error);
      throw error;
    }
  }

  /**
   * Exchange public token for access token (after account linking)
   * @param publicToken - Public token from account linking flow
   * @param userId - User ID
   */
  async exchangePublicToken(
    publicToken: string,
    userId: string
  ): Promise<{
    accessToken: string;
    accountIds: string[];
  }> {
    try {
      const token = await this.getToken();
      const response = await axios.post(
        `${this.config.apiUrl}/v1/financial/link/exchange`,
        {
          publicToken,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  /**
   * Get linked financial accounts for a user
   * @param userId - User ID
   */
  async getLinkedAccounts(userId: string): Promise<FinancialAccount[]> {
    try {
      const token = await this.getToken();
      const response = await axios.get(
        `${this.config.apiUrl}/v1/financial/accounts?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': this.config.apiKey,
          },
        }
      );

      return response.data.accounts;
    } catch (error) {
      console.error('Error getting linked accounts:', error);
      throw error;
    }
  }

  /**
   * Get account transactions
   * @param accountId - Account ID
   * @param options - Filter options
   */
  async getAccountTransactions(
    accountId: string,
    options?: {
      startDate?: string; // YYYY-MM-DD
      endDate?: string; // YYYY-MM-DD
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    transactions: Array<{
      id: string;
      accountId: string;
      amount: number;
      currency: string;
      date: string;
      description: string;
      category?: string;
      pending: boolean;
      merchantName?: string;
      merchantLogoUrl?: string;
    }>;
    total: number;
  }> {
    try {
      const token = await this.getToken();
      const params = new URLSearchParams();

      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await axios.get(
        `${this.config.apiUrl}/v1/financial/accounts/${accountId}/transactions?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': this.config.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting account transactions:', error);
      throw error;
    }
  }

  /**
   * Run LexisNexis-style enhanced background check
   * @param userId - User ID
   * @param options - Background check options
   */
  async runBackgroundCheck(
    userId: string,
    options?: {
      checkTypes?: Array<'criminal' | 'credit' | 'watchlist' | 'employment' | 'education'>;
      locale?: string;
    }
  ): Promise<{
    checkId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    estimatedCompletionTime?: string;
  }> {
    try {
      const token = await this.getToken();
      const response = await axios.post(
        `${this.config.apiUrl}/v1/background-checks`,
        {
          userId,
          checkTypes: options?.checkTypes || ['criminal', 'watchlist'],
          locale: options?.locale || 'en-US',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error running background check:', error);
      throw error;
    }
  }

  /**
   * Get background check results
   * @param checkId - Background check ID
   */
  async getBackgroundCheckResults(checkId: string): Promise<{
    id: string;
    userId: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    results: Record<string, any>;
    summary: {
      pass: boolean;
      riskLevel: 'low' | 'medium' | 'high';
      flags: string[];
    };
    createdAt: string;
    completedAt?: string;
  }> {
    try {
      const token = await this.getToken();
      const response = await axios.get(`${this.config.apiUrl}/v1/background-checks/${checkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-API-Key': this.config.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting background check results:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const shieldAuthConnector = new ShieldAuthConnector();
export default shieldAuthConnector;
