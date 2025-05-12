// Mock implementation for Edge Config when not available
const mockEdgeConfig = {
  get: async () => null,
  getAll: async () => ({}),
  has: async () => false,
  digest: async () => '',
};

// Safe import of the Edge Config library
let createClient;
try {
  // Dynamic import to prevent build-time errors
  const importedModule = require('@vercel/edge-config');
  createClient = importedModule.createClient;
} catch (error) {
  console.warn('Failed to import @vercel/edge-config:', error);
  // Mock implementation if the import fails
  createClient = () => mockEdgeConfig;
}

// Initialize the Edge Config client only if the token is available
const getEdgeConfigClient = () => {
  try {
    const token = process.env.REACT_APP_EDGE_CONFIG_TOKEN;

    // Return mock during build if token is not available
    if (!token || token === '' || token === 'your_edge_config_token_here') {
      console.warn('Edge Config token not found, using mock implementation');
      return mockEdgeConfig;
    }

    return createClient(token);
  } catch (error) {
    console.error('Failed to initialize Edge Config client:', error);
    return mockEdgeConfig;
  }
};

// Get the Edge Config client (or mock if unavailable)
const edgeConfig = getEdgeConfigClient();

/**
 * Fetch a value from Vercel Edge Config
 * @param key The key to fetch from Edge Config
 * @returns The value from Edge Config or null if not found
 */
export async function getEdgeConfigValue<T>(key: string): Promise<T | null> {
  try {
    return await edgeConfig.get<T>(key);
  } catch (error) {
    console.error(`Error fetching Edge Config value for key "${key}":`, error);
    return null;
  }
}

/**
 * Fetch multiple values from Vercel Edge Config
 * @param keys Array of keys to fetch from Edge Config
 * @returns Object containing the key-value pairs from Edge Config
 */
export async function getEdgeConfigBatch(keys: string[]): Promise<Record<string, any>> {
  try {
    const values = await edgeConfig.getAll();
    const result: Record<string, any> = {};

    keys.forEach(key => {
      if (key in values) {
        result[key] = values[key];
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching batch of Edge Config values:', error);
    return {};
  }
}

/**
 * Fetch all values from Vercel Edge Config
 * @returns Object containing all key-value pairs from Edge Config
 */
export async function getAllEdgeConfigValues(): Promise<Record<string, any>> {
  try {
    return await edgeConfig.getAll();
  } catch (error) {
    console.error('Error fetching all Edge Config values:', error);
    return {};
  }
}
