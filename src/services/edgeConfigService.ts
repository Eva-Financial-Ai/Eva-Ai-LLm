import { createClient } from '@vercel/edge-config';

// Initialize the Edge Config client only if the token is available
// This prevents build-time errors when the token is not available
const getEdgeConfigClient = () => {
  const token = process.env.REACT_APP_EDGE_CONFIG_TOKEN;

  // Return null during build if token is not available
  if (!token || token === '' || token === 'your_edge_config_token_here') {
    return null;
  }

  try {
    return createClient(token);
  } catch (error) {
    console.error('Failed to initialize Edge Config client:', error);
    return null;
  }
};

const edgeConfig = getEdgeConfigClient();

/**
 * Fetch a value from Vercel Edge Config
 * @param key The key to fetch from Edge Config
 * @returns The value from Edge Config or null if not found
 */
export async function getEdgeConfigValue<T>(key: string): Promise<T | null> {
  if (!edgeConfig) {
    console.warn(
      'Edge Config client not initialized. Make sure REACT_APP_EDGE_CONFIG_TOKEN is set.'
    );
    return null;
  }

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
  if (!edgeConfig) {
    console.warn(
      'Edge Config client not initialized. Make sure REACT_APP_EDGE_CONFIG_TOKEN is set.'
    );
    return {};
  }

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
  if (!edgeConfig) {
    console.warn(
      'Edge Config client not initialized. Make sure REACT_APP_EDGE_CONFIG_TOKEN is set.'
    );
    return {};
  }

  try {
    return await edgeConfig.getAll();
  } catch (error) {
    console.error('Error fetching all Edge Config values:', error);
    return {};
  }
}
