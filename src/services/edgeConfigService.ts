import { createClient } from '@vercel/edge-config';

// Initialize the Edge Config client
const edgeConfig = createClient(process.env.REACT_APP_EDGE_CONFIG_TOKEN || '');

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
