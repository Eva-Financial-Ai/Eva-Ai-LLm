import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface DataChunk {
  id: string;
  size: number;
  data?: any;
  status: 'pending' | 'loading' | 'success' | 'error';
  progress: number;
  retryCount: number;
}

interface DataChunkLoaderProps {
  /**
   * Unique ID for this loader instance
   */
  id: string;
  
  /**
   * Function to fetch a data chunk
   * @param chunkId - ID of the chunk to fetch
   * @param retryCount - Number of retries attempted for this chunk
   * @returns Promise that resolves with the chunk data or rejects with an error
   */
  fetchChunk: (chunkId: string, retryCount: number) => Promise<any>;
  
  /**
   * Function called when all chunks are loaded successfully
   * @param chunks - Array of all loaded chunks
   */
  onComplete: (chunks: DataChunk[]) => void;
  
  /**
   * Function called when a fatal error occurs
   * @param error - Error message
   * @param failedChunks - Array of chunks that failed to load
   */
  onError?: (error: string, failedChunks: DataChunk[]) => void;
  
  /**
   * Total number of chunks to load
   * @default 1
   */
  totalChunks?: number;
  
  /**
   * Maximum number of concurrent chunk requests
   * @default 3
   */
  maxConcurrent?: number;
  
  /**
   * Maximum number of retries per chunk
   * @default 2
   */
  maxRetries?: number;
  
  /**
   * Whether to automatically retry failed chunks
   * @default true
   */
  autoRetry?: boolean;
  
  /**
   * Whether critical chunks must succeed for completion
   * @default true
   */
  requireCritical?: boolean;
  
  /**
   * IDs of critical chunks that must succeed
   * @default []
   */
  criticalChunkIds?: string[];
  
  /**
   * Custom component to render during loading
   */
  loadingComponent?: React.ReactNode;
  
  /**
   * Whether to show progress information
   * @default true
   */
  showProgress?: boolean;
  
  /**
   * Chunk fetch timeout in milliseconds
   * @default 15000
   */
  timeout?: number;
}

const DataChunkLoader: React.FC<DataChunkLoaderProps> = ({
  id,
  fetchChunk,
  onComplete,
  onError,
  totalChunks = 1,
  maxConcurrent = 3,
  maxRetries = 2,
  autoRetry = true,
  requireCritical = true,
  criticalChunkIds = [],
  loadingComponent,
  showProgress = true,
  timeout = 15000
}) => {
  // Generate chunk IDs if not provided
  const chunkIds = useMemo(() => {
    return Array.from({ length: totalChunks }, (_, i) => 
      `${id}-chunk-${i + 1}`
    );
  }, [id, totalChunks]);
  
  // Initialize chunks state
  const [chunks, setChunks] = useState<DataChunk[]>(() => 
    chunkIds.map((chunkId) => ({
      id: chunkId,
      size: 0,
      status: 'pending',
      progress: 0,
      retryCount: 0
    }))
  );
  
  const [activeRequests, setActiveRequests] = useState(0);
  const [pendingQueue, setPendingQueue] = useState<string[]>(chunkIds);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  
  // Update a specific chunk's state
  const updateChunk = useCallback((
    chunkId: string, 
    updates: Partial<DataChunk>
  ) => {
    setChunks(prevChunks => {
      const newChunks = prevChunks.map(chunk => 
        chunk.id === chunkId ? { ...chunk, ...updates } : chunk
      );
      
      // Calculate overall progress
      const totalProgress = newChunks.reduce((sum, chunk) => sum + chunk.progress, 0);
      const newOverallProgress = Math.floor(totalProgress / newChunks.length);
      setOverallProgress(newOverallProgress);
      
      return newChunks;
    });
  }, []);
  
  // Process a single chunk
  const processChunk = useCallback(async (chunkId: string) => {
    // Update status to loading
    updateChunk(chunkId, { status: 'loading', progress: 0 });
    
    try {
      // Find the chunk and get its retry count
      const chunk = chunks.find(c => c.id === chunkId);
      if (!chunk) throw new Error(`Chunk ${chunkId} not found`);
      
      // Create a promise that will timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Timeout fetching chunk ${chunkId}`)), timeout);
      });
      
      // Race between the fetch and the timeout
      const data = await Promise.race([
        fetchChunk(chunkId, chunk.retryCount),
        timeoutPromise
      ]);
      
      // Update chunk with successful data
      updateChunk(chunkId, { 
        status: 'success', 
        progress: 100, 
        data 
      });
      
      return true;
    } catch (err) {
      console.error(`Error loading chunk ${chunkId}:`, err);
      
      // Get current retry count
      const chunk = chunks.find(c => c.id === chunkId);
      const retryCount = (chunk?.retryCount || 0) + 1;
      
      // Check if we can retry
      if (retryCount <= maxRetries && autoRetry) {
        // Mark for retry and add back to queue
        updateChunk(chunkId, { 
          status: 'pending', 
          progress: 0, 
          retryCount 
        });
        
        // Add to end of queue for retry
        setPendingQueue(prev => [...prev, chunkId]);
      } else {
        // Mark as failed
        updateChunk(chunkId, { 
          status: 'error', 
          progress: 0
        });
        
        // Check if this is a critical chunk
        if (criticalChunkIds.includes(chunkId) && requireCritical) {
          setError(`Failed to load critical data chunk: ${chunkId}`);
          return false;
        }
      }
      
      return false;
    }
  }, [chunks, fetchChunk, maxRetries, autoRetry, criticalChunkIds, requireCritical, timeout, updateChunk]);
  
  // Process the queue of pending chunks
  const processQueue = useCallback(async () => {
    if (error || completed) return;
    
    if (pendingQueue.length === 0 || activeRequests >= maxConcurrent) {
      // If queue is empty and no active requests, check for completion
      if (pendingQueue.length === 0 && activeRequests === 0) {
        // Check if all chunks succeeded or if failed chunks are acceptable
        const failedChunks = chunks.filter(chunk => chunk.status === 'error');
        const criticalFailed = failedChunks.some(chunk => 
          criticalChunkIds.includes(chunk.id)
        );
        
        if (failedChunks.length === 0 || (!criticalFailed && !requireCritical)) {
          // We succeeded with all chunks or acceptable failures
          setCompleted(true);
          onComplete(chunks);
        } else if (onError) {
          // We failed with unacceptable failures
          setError(`Failed to load ${failedChunks.length} data chunks`);
          onError(
            `Failed to load ${failedChunks.length} chunks ${criticalFailed ? 'including critical chunks' : ''}`, 
            failedChunks
          );
        }
      }
      return;
    }
    
    // Get next chunk from queue
    const nextChunkId = pendingQueue[0];
    setPendingQueue(queue => queue.slice(1));
    
    // Increment active requests counter
    setActiveRequests(count => count + 1);
    
    try {
      // Process this chunk
      await processChunk(nextChunkId);
    } finally {
      // Decrement active requests counter
      setActiveRequests(count => count - 1);
    }
    
    // Continue processing queue
    processQueue();
  }, [
    error,
    completed,
    pendingQueue,
    activeRequests,
    maxConcurrent,
    chunks,
    criticalChunkIds,
    requireCritical,
    onComplete,
    onError,
    processChunk
  ]);
  
  // Start processing queue whenever it changes
  useEffect(() => {
    processQueue();
  }, [pendingQueue, activeRequests, processQueue]);
  
  // Show custom loading component if provided
  if (loadingComponent) {
    return (
      <div className="data-chunk-loader">
        {loadingComponent}
        {showProgress && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Loading data...</span>
              <span className="text-xs text-gray-500">{overallProgress}%</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Default loading UI
  return (
    <div className="data-chunk-loader p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-center mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="ml-3 text-gray-700">Loading data...</span>
      </div>
      
      {showProgress && (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-500">
              {chunks.filter(c => c.status === 'success').length} of {chunks.length} chunks loaded
            </span>
            <span className="text-sm text-gray-500">{overallProgress}%</span>
          </div>
          
          {error && (
            <div className="mt-3 text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(DataChunkLoader); 