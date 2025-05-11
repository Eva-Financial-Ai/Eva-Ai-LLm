import { useState, useEffect } from 'react';
import { validateCoreEnv } from '../utils/envValidator';

interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  isLoading: boolean;
}

// Type for Sentry
interface SentryType {
  captureMessage(message: string, level: string): void;
}

// Extend Window interface to support Sentry
declare global {
  interface Window {
    Sentry?: SentryType;
  }
}

/**
 * Hook to validate environment variables at application startup
 * Shows warnings in development and prevents app startup in production if critical vars are missing
 */
export const useEnvValidation = (): EnvValidationResult => {
  const [result, setResult] = useState<EnvValidationResult>({
    isValid: true,
    missingVars: [],
    isLoading: true,
  });

  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        // Validate core environment variables
        const validationResult = validateCoreEnv();
        
        setResult({
          isValid: validationResult.isValid,
          missingVars: validationResult.missingVars,
          isLoading: false,
        });
        
        // Log warnings in development, throw errors in production for missing vars
        if (!validationResult.isValid) {
          const message = `Missing required environment variables: ${validationResult.missingVars.join(', ')}`;
          
          if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️ ${message}`);
            console.warn('The application may not function correctly without these variables.');
          } else {
            // In production, log error to monitoring and show error screen
            console.error(`🚨 ${message}`);
            
            // Send error to Sentry if available
            if (typeof window !== 'undefined' && window.Sentry) {
              window.Sentry.captureMessage(message, 'fatal');
            }
          }
        }
      } catch (error) {
        console.error('Error validating environment variables:', error);
        setResult({
          isValid: false,
          missingVars: ['Error validating environment'],
          isLoading: false,
        });
      }
    };

    validateEnvironment();
  }, []);

  return result;
};

export default useEnvValidation; 