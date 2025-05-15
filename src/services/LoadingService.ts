import { useState, useEffect, useCallback } from 'react';

// Loading state types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Loading module types - can be extended with specific module types as needed
export type LoadingModuleType = 
  | 'risk-map' 
  | 'risk-data' 
  | 'risk-score' 
  | 'document-processing'
  | 'cloud-import'
  | 'blockchain-verification'
  | 'dashboard'
  | 'payment-processing'
  | 'eva-analysis';

// Interface for loading status
export interface LoadingStatus {
  state: LoadingState;
  message?: string;
  progress?: number;
  error?: string;
  timestamp: number;
  thoughtProcess?: string[]; // Eva's chain of thought reasoning
}

// Loading service singleton
class LoadingService {
  private static instance: LoadingService;
  private moduleStates: Map<string, LoadingStatus>;
  private listeners: Map<string, Set<(status: LoadingStatus) => void>>;
  private timeouts: Map<string, NodeJS.Timeout>;

  private constructor() {
    this.moduleStates = new Map();
    this.listeners = new Map();
    this.timeouts = new Map();
  }

  public static getInstance(): LoadingService {
    if (!LoadingService.instance) {
      LoadingService.instance = new LoadingService();
    }
    return LoadingService.instance;
  }

  // Start loading for a module
  public startLoading(moduleType: LoadingModuleType, moduleId: string = 'default', message: string = 'Loading...'): void {
    const key = `${moduleType}-${moduleId}`;
    const status: LoadingStatus = {
      state: 'loading',
      message,
      progress: 0,
      timestamp: Date.now(),
      thoughtProcess: moduleType === 'eva-analysis' ? [] : undefined
    };
    this.moduleStates.set(key, status);
    this.notifyListeners(key, status);
    
    // If it's risk-map type, start automatic progress increment simulation
    if (moduleType === 'risk-map' || moduleType === 'risk-score' || moduleType === 'eva-analysis') {
      this.simulateProgress(key, moduleType);
    }
  }

  // Update loading progress
  public updateProgress(moduleType: LoadingModuleType, moduleId: string = 'default', progress: number, message?: string): void {
    const key = `${moduleType}-${moduleId}`;
    const currentStatus = this.moduleStates.get(key);
    
    if (currentStatus) {
      const updatedStatus: LoadingStatus = {
        ...currentStatus,
        progress: Math.min(progress, 99), // Never reach 100% with updateProgress
        message: message || currentStatus.message,
        timestamp: Date.now()
      };
      this.moduleStates.set(key, updatedStatus);
      this.notifyListeners(key, updatedStatus);
    }
  }

  // Complete loading successfully
  public completeLoading(moduleType: LoadingModuleType, moduleId: string = 'default', message: string = 'Loaded successfully'): void {
    const key = `${moduleType}-${moduleId}`;
    
    // Clear any active simulation
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key)!);
      this.timeouts.delete(key);
    }
    
    const status: LoadingStatus = {
      state: 'success',
      message,
      progress: 100,
      timestamp: Date.now()
    };
    this.moduleStates.set(key, status);
    this.notifyListeners(key, status);
  }

  // Set loading to error state
  public setError(moduleType: LoadingModuleType, moduleId: string = 'default', error: string): void {
    const key = `${moduleType}-${moduleId}`;
    
    // Clear any active simulation
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key)!);
      this.timeouts.delete(key);
    }
    
    const status: LoadingStatus = {
      state: 'error',
      message: 'Error loading data',
      error,
      timestamp: Date.now()
    };
    this.moduleStates.set(key, status);
    this.notifyListeners(key, status);
  }

  // Reset loading state back to idle
  public resetLoading(moduleType: LoadingModuleType, moduleId: string = 'default'): void {
    const key = `${moduleType}-${moduleId}`;
    
    // Clear any active simulation
    if (this.timeouts.has(key)) {
      clearTimeout(this.timeouts.get(key)!);
      this.timeouts.delete(key);
    }
    
    const status: LoadingStatus = {
      state: 'idle',
      timestamp: Date.now()
    };
    this.moduleStates.set(key, status);
    this.notifyListeners(key, status);
  }

  // Get current loading status
  public getLoadingStatus(moduleType: LoadingModuleType, moduleId: string = 'default'): LoadingStatus {
    const key = `${moduleType}-${moduleId}`;
    return this.moduleStates.get(key) || { 
      state: 'idle', 
      timestamp: Date.now() 
    };
  }

  // Subscribe to loading status changes
  public subscribe(moduleType: LoadingModuleType, moduleId: string = 'default', callback: (status: LoadingStatus) => void): () => void {
    const key = `${moduleType}-${moduleId}`;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)?.add(callback);
    
    // Notify with current status immediately
    const currentStatus = this.getLoadingStatus(moduleType, moduleId);
    callback(currentStatus);
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
      if (this.listeners.get(key)?.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  // Simulate progress for better UX
  private simulateProgress(key: string, moduleType: LoadingModuleType): void {
    const currentStatus = this.moduleStates.get(key);
    
    if (currentStatus && currentStatus.state === 'loading') {
      const currentProgress = currentStatus.progress || 0;
      
      // Calculate next progress increment (slows down as it approaches 95%)
      let nextProgress = currentProgress;
      let delay = 300;
      
      // Demo mode - longer loading time but with fewer DOM updates to prevent freezing
      if (moduleType === 'risk-map' || moduleType === 'eva-analysis') {
        // Distribute progress over 9 seconds but with fewer update steps
        const maxTicks = 12; // Reduced number of progress updates (from 25)
        const targetTime = 9000; // 9 seconds in ms
        delay = targetTime / maxTicks;
        
        // Each tick increases by ~8% (to reach 95% in fewer ticks)
        if (currentProgress < 95) {
          nextProgress = currentProgress + 95/maxTicks;
        }
      } else {
        // Standard progress simulation for other module types
        if (currentProgress < 30) {
          nextProgress += Math.random() * 5 + 5; // Faster initially (5-10%)
        } else if (currentProgress < 70) {
          nextProgress += Math.random() * 3 + 2; // Medium speed (2-5%)
        } else if (currentProgress < 90) {
          nextProgress += Math.random() * 1 + 0.5; // Slower (0.5-1.5%)
        } else {
          nextProgress += 0.2; // Very slow at the end
        }
      }
      
      // Add Eva's chain of thought at specific progress points, but with fewer updates
      if (moduleType === 'eva-analysis') {
        const thoughtProcess = currentStatus.thoughtProcess || [];
        
        // Only add thoughts at key milestones instead of many small increments
        if (currentProgress < 15 && nextProgress >= 15) {
          thoughtProcess.push('Evaluating credit history and payment patterns...');
        } else if (currentProgress < 30 && nextProgress >= 30) {
          thoughtProcess.push('Analyzing debt service coverage ratio against industry benchmarks...');
        } else if (currentProgress < 45 && nextProgress >= 45) {
          thoughtProcess.push('Evaluating capital structure and liquidity positions...');
        } else if (currentProgress < 60 && nextProgress >= 60) {
          thoughtProcess.push('Assessing collateral value and coverage metrics...');
        } else if (currentProgress < 75 && nextProgress >= 75) {
          thoughtProcess.push('Reviewing market conditions and industry outlook...');
        } else if (currentProgress < 90 && nextProgress >= 90) {
          thoughtProcess.push('Performing final character assessment and compliance checks...');
        }
        
        // Cap at 95% - the actual completion should call completeLoading
        nextProgress = Math.min(nextProgress, 95);
        
        const updatedStatus: LoadingStatus = {
          ...currentStatus,
          progress: nextProgress,
          timestamp: Date.now(),
          thoughtProcess
        };
        
        // Use requestAnimationFrame to prevent blocking the main thread
        window.requestAnimationFrame(() => {
          this.moduleStates.set(key, updatedStatus);
          this.notifyListeners(key, updatedStatus);
        });
      } else {
        // Cap at 95% - the actual completion should call completeLoading
        nextProgress = Math.min(nextProgress, 95);
        
        const updatedStatus: LoadingStatus = {
          ...currentStatus,
          progress: nextProgress,
          timestamp: Date.now()
        };
        
        // Use requestAnimationFrame to prevent blocking the main thread
        window.requestAnimationFrame(() => {
          this.moduleStates.set(key, updatedStatus);
          this.notifyListeners(key, updatedStatus);
        });
      }
      
      // Schedule next progress update using requestAnimationFrame for better performance
      const timeout = setTimeout(() => {
        window.requestAnimationFrame(() => {
          this.simulateProgress(key, moduleType);
        });
      }, delay);
      
      this.timeouts.set(key, timeout);
    }
  }

  // Notify all listeners of status change
  private notifyListeners(key: string, status: LoadingStatus): void {
    this.listeners.get(key)?.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in loading status listener:', error);
      }
    });
  }
}

// React hook for using the loading service
export function useLoadingStatus(moduleType: LoadingModuleType, moduleId: string = 'default'): [
  LoadingStatus,
  {
    startLoading: (message?: string) => void;
    updateProgress: (progress: number, message?: string) => void;
    completeLoading: (message?: string) => void;
    setError: (error: string) => void;
    resetLoading: () => void;
  }
] {
  const [status, setStatus] = useState<LoadingStatus>({ 
    state: 'idle', 
    timestamp: Date.now() 
  });
  
  useEffect(() => {
    const service = LoadingService.getInstance();
    const unsubscribe = service.subscribe(moduleType, moduleId, setStatus);
    
    return () => {
      unsubscribe();
    };
  }, [moduleType, moduleId]);
  
  const startLoading = useCallback((message?: string) => {
    LoadingService.getInstance().startLoading(moduleType, moduleId, message);
  }, [moduleType, moduleId]);
  
  const updateProgress = useCallback((progress: number, message?: string) => {
    LoadingService.getInstance().updateProgress(moduleType, moduleId, progress, message);
  }, [moduleType, moduleId]);
  
  const completeLoading = useCallback((message?: string) => {
    LoadingService.getInstance().completeLoading(moduleType, moduleId, message);
  }, [moduleType, moduleId]);
  
  const setError = useCallback((error: string) => {
    LoadingService.getInstance().setError(moduleType, moduleId, error);
  }, [moduleType, moduleId]);
  
  const resetLoading = useCallback(() => {
    LoadingService.getInstance().resetLoading(moduleType, moduleId);
  }, [moduleType, moduleId]);
  
  return [
    status,
    {
      startLoading,
      updateProgress,
      completeLoading,
      setError,
      resetLoading
    }
  ];
}

export default LoadingService.getInstance(); 