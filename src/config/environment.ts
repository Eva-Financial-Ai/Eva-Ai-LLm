// EVA AI Environment Configuration
// Financial Application Security-Compliant Configuration

export interface EnvironmentConfig {
  // Environment
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  
  // Auth0 Configuration
  auth0: {
    domain: string;
    clientId: string;
    audience: string;
  };
  
  // Financial Services
  plaid: {
    clientId: string;
    publicKey: string;
    environment: 'sandbox' | 'development' | 'production';
  };
  
  stripe: {
    publishableKey: string;
  };
  
  // External Services
  geoapify: {
    apiKey: string;
  };
  
  // Cloudflare Configuration
  cloudflare: {
    accountId: string;
    zoneId: string;
    apiToken: string;
    email: string;
    imagesApi: string;
    streamSubdomain: string;
  };
  
  // Supabase Configuration
  supabase: {
    url: string;
    key: string;
  };
  
  // Feature Flags
  features: {
    demoMode: boolean;
    enableChat: boolean;
    enableDocuments: boolean;
    enableKYC: boolean;
  };
  
  // Performance Configuration
  performance: {
    requestTimeout: number;
    maxRetries: number;
    cacheTTL: number;
  };
  
  // Debug Configuration
  debug: boolean;
  
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };
}

// Environment-specific configurations
const configs: Record<string, EnvironmentConfig> = {
  development: {
    environment: 'development',
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    
    auth0: {
      domain: process.env.REACT_APP_AUTH0_DOMAIN || 'evafi.us.auth0.com',
      clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'BbrWazHbCMd33mlvcZVQMDWRjWsIpd6c',
      audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://evafi-api',
    },
    
    plaid: {
      clientId: process.env.REACT_APP_PLAID_CLIENT_ID || '6418eb26d9bca8001387b1db',
      publicKey: process.env.REACT_APP_PLAID_PUBLIC_KEY || '4c46ca78f07d8973872ecd9d8bc03b',
      environment: 'sandbox',
    },
    
    stripe: {
      publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-stripe-key',
    },
    
    geoapify: {
      apiKey: process.env.REACT_APP_GEOAPIFY_API_KEY || 'a2abd490437d48db9a12c37f4a52e570',
    },
    
    cloudflare: {
      accountId: process.env.CLOUDFLARE_ACCOUNT_ID || 'eace6f3c56b5735ae4a9ef385d6ee914',
      zoneId: process.env.CLOUDFLARE_ZONE_ID || '79cbd8176057c91e2e2329ffd8b386a5',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      email: process.env.CLOUDFLARE_EMAIL || 'support@evafi.ai',
      imagesApi: process.env.CLOUDLFARE_IMAGES_API || 'QG4Ku8w8UNM29vIZV1VoMeHEAOi9U7UF',
      streamSubdomain: process.env.CLOUDFLARE_STREAM_SUBDOMAIN || 'customer-9eikf9ekxbfirnkc.cloudflarestream.com',
    },
    
    supabase: {
      url: process.env.SUPABASE_URL || 'https://qvtecrqbtblajnzoqial.supabase.co',
      key: process.env.SUPABASE_KEY || '',
    },
    
    features: {
      demoMode: process.env.DEMO_MODE === 'true',
      enableChat: true,
      enableDocuments: true,
      enableKYC: true,
    },
    
    performance: {
      requestTimeout: 30000, // 30 seconds
      maxRetries: 3,
      cacheTTL: 300, // 5 minutes
    },
    
    debug: true,
    
    auth: {
      tokenKey: process.env.AUTH_TOKEN_KEY || '',
      refreshTokenKey: process.env.AUTH_REFRESH_TOKEN_KEY || '',
    },
  },
  
  staging: {
    environment: 'staging',
    apiUrl: 'https://api.evafin.ai',
    
    auth0: {
      domain: 'evafi.us.auth0.com',
      clientId: 'BbrWazHbCMd33mlvcZVQMDWRjWsIpd6c',
      audience: 'https://evafi-api',
    },
    
    plaid: {
      clientId: '6418eb26d9bca8001387b1db',
      publicKey: '4c46ca78f07d8973872ecd9d8bc03b',
      environment: 'sandbox',
    },
    
    stripe: {
      publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
    },
    
    geoapify: {
      apiKey: 'a2abd490437d48db9a12c37f4a52e570',
    },
    
    cloudflare: {
      accountId: 'eace6f3c56b5735ae4a9ef385d6ee914',
      zoneId: '79cbd8176057c91e2e2329ffd8b386a5',
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      email: 'support@evafi.ai',
      imagesApi: 'QG4Ku8w8UNM29vIZV1VoMeHEAOi9U7UF',
      streamSubdomain: 'customer-9eikf9ekxbfirnkc.cloudflarestream.com',
    },
    
    supabase: {
      url: 'https://qvtecrqbtblajnzoqial.supabase.co',
      key: process.env.SUPABASE_KEY || '',
    },
    
    features: {
      demoMode: false,
      enableChat: true,
      enableDocuments: true,
      enableKYC: true,
    },
    
    performance: {
      requestTimeout: 15000, // 15 seconds
      maxRetries: 2,
      cacheTTL: 600, // 10 minutes
    },
    
    debug: false,
    
    auth: {
      tokenKey: process.env.AUTH_TOKEN_KEY || '',
      refreshTokenKey: process.env.AUTH_REFRESH_TOKEN_KEY || '',
    },
  },
  
  production: {
    environment: 'production',
    apiUrl: 'https://api.evafi.ai',
    
    auth0: {
      domain: 'evafi.us.auth0.com',
      clientId: 'BbrWazHbCMd33mlvcZVQMDWRjWsIpd6c',
      audience: 'https://evafi-api',
    },
    
    plaid: {
      clientId: '6418eb26d9bca8001387b1db',
      publicKey: '4c46ca78f07d8973872ecd9d8bc03b',
      environment: 'production',
    },
    
    stripe: {
      publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
    },
    
    geoapify: {
      apiKey: 'a2abd490437d48db9a12c37f4a52e570',
    },
    
    cloudflare: {
      accountId: 'eace6f3c56b5735ae4a9ef385d6ee914',
      zoneId: '913680b4428f2f4d1c078dd841cd8cdb', // Production zone
      apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
      email: 'support@evafi.ai',
      imagesApi: 'QG4Ku8w8UNM29vIZV1VoMeHEAOi9U7UF',
      streamSubdomain: 'customer-9eikf9ekxbfirnkc.cloudflarestream.com',
    },
    
    supabase: {
      url: 'https://qvtecrqbtblajnzoqial.supabase.co',
      key: process.env.SUPABASE_KEY || '',
    },
    
    features: {
      demoMode: false,
      enableChat: true,
      enableDocuments: true,
      enableKYC: true,
    },
    
    performance: {
      requestTimeout: 10000, // 10 seconds 
      maxRetries: 1,
      cacheTTL: 900, // 15 minutes
    },
    
    debug: false,
    
    auth: {
      tokenKey: process.env.AUTH_TOKEN_KEY || '',
      refreshTokenKey: process.env.AUTH_REFRESH_TOKEN_KEY || '',
    },
  },
};

// Get current environment
const currentEnv = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
export const config = configs[currentEnv] || configs.development;

// Export default
export default config; 