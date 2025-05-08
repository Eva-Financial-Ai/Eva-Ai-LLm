import apiService from './apiService';

// Constants for optimization
const DEFAULT_CHUNK_SIZE = 512 * 1024; // 512KB chunks
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CONCURRENT_REQUESTS = 4;
const MAX_RETRIES = 2;

// Response type for API calls
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Cache implementation using Map for better performance than plain objects
class DataCache {
  // Change to allow access from exported methods
  cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttl = DEFAULT_CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Helper method to find keys by prefix
  getKeysByPrefix(prefix: string): string[] {
    const keys: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keys.push(key);
      }
    });
    return keys;
  }
}

// Data request tracking and optimization
interface RequestTracker {
  chunkIds: string[];
  inProgress: Set<string>;
  completed: Set<string>;
  failed: Set<string>;
  concurrency: number;
}

const dataCache = new DataCache();
const requestTrackers = new Map<string, RequestTracker>();

/**
 * Detect circular references in objects that would cause JSON stringification to fail
 * @param obj Object to check for circular references
 * @returns True if circular references are found
 */
function hasCircularReferences(obj: any): boolean {
  try {
    JSON.stringify(obj);
    return false;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('circular')) {
      console.error('[optimizedDataService] Circular reference detected:', err.message);
      return true;
    }
    return false;
  }
}

/**
 * Utility to safely stringify objects, handling circular references
 */
function safeStringify(obj: any): string {
  // Set to track visited objects
  const visited = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    // Skip null or primitive values
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    // Check for circular references
    if (visited.has(value)) {
      console.warn('[optimizedDataService] Circular reference found and removed');
      return '[Circular Reference]';
    }
    
    visited.add(value);
    return value;
  });
}

/**
 * Split data into manageable chunks
 */
function chunkData(data: any, chunkSize = DEFAULT_CHUNK_SIZE): any[] {
  if (typeof data !== 'object' || data === null) {
    return [data];
  }
  
  // For arrays, chunk by slicing
  if (Array.isArray(data)) {
    const chunks: any[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }
  
  // For objects, chunk by keys
  const keys = Object.keys(data);
  const chunks: any[] = [];
  
  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunkKeys = keys.slice(i, i + chunkSize);
    const chunk: Record<string, any> = {};
    
    for (const key of chunkKeys) {
      chunk[key] = data[key];
    }
    
    chunks.push(chunk);
  }
  
  return chunks;
}

/**
 * Merge chunks back into the original data structure
 */
function mergeChunks(chunks: any[]): any {
  if (chunks.length === 0) return null;
  if (chunks.length === 1) return chunks[0];
  
  // If array chunks, concatenate
  if (Array.isArray(chunks[0])) {
    return chunks.flat();
  }
  
  // If object chunks, merge
  return Object.assign({}, ...chunks);
}

/**
 * Fetch data with optimized chunking and streaming
 * 
 * @param url API endpoint
 * @param params Request parameters
 * @param options Configuration options
 * @returns Promise resolving to the complete data
 */
async function fetchDataOptimized<T>(
  url: string, 
  params: any = {}, 
  options: {
    chunkSize?: number;
    cacheTTL?: number;
    bypassCache?: boolean;
    priority?: 'high' | 'normal' | 'low';
    concurrency?: number;
    timeout?: number;
    retries?: number;
    onProgress?: (progress: number) => void;
  } = {}
): Promise<T> {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE,
    cacheTTL = DEFAULT_CACHE_TTL,
    bypassCache = false,
    priority = 'normal',
    concurrency = MAX_CONCURRENT_REQUESTS,
    timeout = 30000,
    retries = MAX_RETRIES,
    onProgress
  } = options;
  
  // Create a unique key for this request
  let cacheKey: string;
  try {
    cacheKey = `${url}:${JSON.stringify(params)}`;
  } catch (err) {
    // Handle circular reference in params
    if (err instanceof TypeError && err.message.includes('circular')) {
      console.warn('[optimizedDataService] Circular reference in params, using fallback key generation');
      cacheKey = `${url}:${Object.keys(params).join('-')}`;
    } else {
      throw err;
    }
  }
  
  // Check cache first if not bypassing
  if (!bypassCache && dataCache.has(cacheKey)) {
    const cachedData = dataCache.get(cacheKey);
    return Promise.resolve(cachedData);
  }
  
  // Create request tracker if not exists
  if (!requestTrackers.has(cacheKey)) {
    requestTrackers.set(cacheKey, {
      chunkIds: [`${cacheKey}-chunk-1`],
      inProgress: new Set<string>(),
      completed: new Set<string>(),
      failed: new Set<string>(),
      concurrency
    });
  }
  
  const tracker = requestTrackers.get(cacheKey)!;
  
  // Create a promise for the entire request
  return new Promise<T>((resolve, reject) => {
    const chunks: any[] = [];
    let overallProgress = 0;
    
    // Process a single chunk
    const processChunk = async (chunkId: string, retryCount = 0) => {
      // Track in-progress requests
      tracker.inProgress.add(chunkId);
      
      try {
        // Adjust timeout based on retry count (exponential backoff)
        const adjustedTimeout = timeout * Math.pow(1.5, retryCount);
        
        // Make the API call with timeout
        const response = await Promise.race([
          apiService.get<ApiResponse<any>>(`${url}`, { 
            ...params, 
            _chunkId: chunkId,
            _retry: retryCount
          }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), adjustedTimeout)
          )
        ]);
        
        // Store successful chunk - add type assertion since we know the structure
        const typedResponse = response as ApiResponse<any>;
        chunks.push(typedResponse.data);
        tracker.completed.add(chunkId);
        tracker.inProgress.delete(chunkId);
        
        // Update progress
        overallProgress = (tracker.completed.size / tracker.chunkIds.length) * 100;
        if (onProgress) onProgress(overallProgress);
        
        // Check if all chunks are completed
        if (tracker.completed.size === tracker.chunkIds.length) {
          const mergedData = mergeChunks(chunks);
          
          // Before caching, check for circular references
          if (hasCircularReferences(mergedData)) {
            console.warn('[optimizedDataService] Detected circular reference in API response data. This may cause issues when caching.');
            // Try to remove circular references before caching
            try {
              const safeData = JSON.parse(safeStringify(mergedData));
              dataCache.set(cacheKey, safeData, cacheTTL);
            } catch (err) {
              console.error('[optimizedDataService] Failed to safely cache data with circular references:', err);
              // Skip caching this response
            }
          } else {
            // Cache the result normally
            dataCache.set(cacheKey, mergedData, cacheTTL);
          }
          
          // Clean up tracker
          requestTrackers.delete(cacheKey);
          
          // Final progress update
          if (onProgress) onProgress(100);
          
          // Return the complete data
          resolve(mergedData as T);
        }
      } catch (error) {
        console.error(`Error fetching chunk ${chunkId}:`, error);
        tracker.inProgress.delete(chunkId);
        
        // Retry logic
        if (retryCount < retries) {
          console.log(`Retrying chunk ${chunkId}, attempt ${retryCount + 1}/${retries}`);
          
          // Exponential backoff
          const backoffDelay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            processChunk(chunkId, retryCount + 1);
          }, backoffDelay);
        } else {
          // Mark as failed after max retries
          tracker.failed.add(chunkId);
          
          // If any chunk fails permanently, fail the entire request
          reject(new Error(`Failed to load data chunk: ${chunkId}`));
        }
      }
    };
    
    // Start processing chunks with concurrency limit
    const processQueue = () => {
      // Skip if we've reached concurrency limit
      if (tracker.inProgress.size >= tracker.concurrency) return;
      
      // Find chunks that haven't been processed yet
      const pendingChunks = tracker.chunkIds.filter(
        id => !tracker.inProgress.has(id) && 
              !tracker.completed.has(id) && 
              !tracker.failed.has(id)
      );
      
      // Process up to concurrency limit
      const chunksToProcess = pendingChunks.slice(
        0, 
        tracker.concurrency - tracker.inProgress.size
      );
      
      // Start processing each chunk
      for (const chunkId of chunksToProcess) {
        processChunk(chunkId);
      }
    };
    
    // Initial queue processing
    processQueue();
    
    // Continue processing as chunks complete
    const interval = setInterval(() => {
      if (
        tracker.completed.size === tracker.chunkIds.length || 
        tracker.failed.size > 0
      ) {
        clearInterval(interval);
      } else {
        processQueue();
      }
    }, 100);
  });
}

/**
 * Upload data with optimized chunking
 */
async function uploadDataOptimized<T>(
  url: string,
  data: any,
  options: {
    chunkSize?: number;
    onProgress?: (progress: number) => void;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
  } = {}
): Promise<T> {
  const {
    chunkSize = DEFAULT_CHUNK_SIZE,
    onProgress,
    headers = {},
    timeout = 30000,
    retries = MAX_RETRIES
  } = options;
  
  // Split data into chunks
  const dataChunks = chunkData(data, chunkSize);
  
  // If only one chunk, do a simple upload
  if (dataChunks.length === 1) {
    try {
      const response = await apiService.post<ApiResponse<T>>(url, data);
      if (onProgress) onProgress(100);
      // Type assertion since we know the structure
      const typedResponse = response as ApiResponse<T>;
      return typedResponse.data;
    } catch (error) {
      console.error('Error uploading data:', error);
      throw error;
    }
  }
  
  // For multiple chunks, we need to track and upload each
  let uploadedChunks = 0;
  const chunkResponses: any[] = [];
  
  // Create unique upload ID
  const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Upload each chunk
  for (let i = 0; i < dataChunks.length; i++) {
    const chunk = dataChunks[i];
    let retryCount = 0;
    let success = false;
    
    // Retry logic
    while (!success && retryCount <= retries) {
      try {
        // Upload with chunk metadata
        const response = await apiService.post<ApiResponse<any>>(url, {
          data: chunk,
          metadata: {
            uploadId,
            chunkIndex: i,
            totalChunks: dataChunks.length,
            isLastChunk: i === dataChunks.length - 1
          }
        });
        
        // Store response with type assertion
        const typedResponse = response as ApiResponse<any>;
        chunkResponses[i] = typedResponse.data;
        success = true;
        
        // Update progress
        uploadedChunks++;
        if (onProgress) {
          onProgress((uploadedChunks / dataChunks.length) * 100);
        }
      } catch (error) {
        console.error(`Error uploading chunk ${i}:`, error);
        retryCount++;
        
        // Exponential backoff
        if (retryCount <= retries) {
          const backoffDelay = Math.pow(2, retryCount - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        } else {
          throw new Error(`Failed to upload data chunk ${i} after ${retries} retries`);
        }
      }
    }
  }
  
  // All chunks uploaded successfully, tell the server to combine them
  try {
    const finalResponse = await apiService.post<ApiResponse<T>>(`${url}/complete`, {
      uploadId,
      totalChunks: dataChunks.length
    });
    
    // Type assertion since we know the structure
    const typedFinalResponse = finalResponse as ApiResponse<T>;
    return typedFinalResponse.data;
  } catch (error) {
    console.error('Error completing chunked upload:', error);
    throw error;
  }
}

/**
 * Preload data that may be needed soon
 */
function preloadData(
  url: string,
  params: any = {},
  options: {
    priority?: 'high' | 'normal' | 'low';
    cacheTTL?: number;
  } = {}
): void {
  const { priority = 'low', cacheTTL = DEFAULT_CACHE_TTL } = options;
  
  // Create a unique key for this request
  const cacheKey = `${url}:${JSON.stringify(params)}`;
  
  // Skip if already cached
  if (dataCache.has(cacheKey)) return;
  
  // Adjust concurrency based on priority
  const concurrency = priority === 'high' ? MAX_CONCURRENT_REQUESTS :
                     priority === 'normal' ? 2 : 1;
  
  // Start loading in background
  fetchDataOptimized(url, params, {
    cacheTTL,
    concurrency,
    priority
  }).catch(error => {
    console.warn(`Preload failed for ${url}:`, error);
  });
}

/**
 * Clear data from cache
 */
function clearCache(url?: string, params?: any): void {
  if (!url) {
    // Clear entire cache
    dataCache.clear();
    return;
  }
  
  if (!params) {
    // Clear all entries for this URL
    const keysToDelete = dataCache.getKeysByPrefix(`${url}:`);
    keysToDelete.forEach(key => dataCache.delete(key));
    return;
  }
  
  // Clear specific cache entry
  const cacheKey = `${url}:${JSON.stringify(params)}`;
  dataCache.delete(cacheKey);
}

// Export the optimized data service
const optimizedDataService = {
  fetchData: fetchDataOptimized,
  uploadData: uploadDataOptimized,
  preloadData,
  clearCache,
  
  // Expose cache for direct access if needed
  cache: dataCache
};

export default optimizedDataService; 