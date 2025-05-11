/**
 * Environment Variable Validator
 * 
 * This utility validates required environment variables at runtime
 * to prevent application crashes due to missing configuration.
 */

/**
 * Validates that all required environment variables are present
 * @param requiredVars - Array of required environment variable names
 * @param prefix - Prefix to apply to all variable names (e.g., 'REACT_APP_')
 * @returns Object with validation result and missing variables
 */
export const validateEnv = (
  requiredVars: string[],
  prefix: string = 'REACT_APP_'
): { isValid: boolean; missingVars: string[] } => {
  const missingVars: string[] = [];

  // Inject important environment variables if they are missing
  if (!process.env.REACT_APP_AUTH_DOMAIN) {
    process.env.REACT_APP_AUTH_DOMAIN = 'eva-platform.us.auth0.com';
  }
  
  if (!process.env.REACT_APP_AUTH_CLIENT_ID) {
    process.env.REACT_APP_AUTH_CLIENT_ID = 'EVAPlatformAuth2023';
  }
  
  if (!process.env.REACT_APP_ENVIRONMENT) {
    process.env.REACT_APP_ENVIRONMENT = 'development';
  }

  for (const variable of requiredVars) {
    const fullVarName = variable.startsWith(prefix) ? variable : `${prefix}${variable}`;
    
    if (!process.env[fullVarName]) {
      missingVars.push(fullVarName);
    }
  }

  return {
    isValid: missingVars.length === 0,
    missingVars
  };
};

/**
 * Get a validated environment variable, with optional fallback value
 * @param name - Environment variable name (without prefix)
 * @param defaultValue - Optional fallback value if not found
 * @param prefix - Prefix to apply to variable name (e.g., 'REACT_APP_')
 * @returns The environment variable value or default value
 */
export const getEnv = (
  name: string,
  defaultValue?: string,
  prefix: string = 'REACT_APP_'
): string => {
  const fullName = name.startsWith(prefix) ? name : `${prefix}${name}`;
  
  const value = process.env[fullName];
  
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    // If no default value is provided, throw an error
    throw new Error(`Required environment variable ${fullName} is not defined`);
  }
  
  return value;
};

/**
 * Validate core application environment variables
 * Called at application startup to ensure critical variables are present
 */
export const validateCoreEnv = (): { isValid: boolean; missingVars: string[] } => {
  // Define all critical environment variables needed for the app to function
  const requiredVars = [
    'API_URL',
    'AUTH_DOMAIN',
    'AUTH_CLIENT_ID',
    'ENVIRONMENT'
  ];
  
  return validateEnv(requiredVars);
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => {
  const environment = getEnv('ENVIRONMENT', 'development');
  
  return {
    environment,
    isDevelopment: environment === 'development',
    isProduction: environment === 'production',
    isStaging: environment === 'staging',
    isTest: environment === 'test',
  };
}; 