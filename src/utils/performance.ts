import type { Metric } from 'web-vitals';

// Performance monitoring for transactions loading and other critical operations
class PerformanceMonitor {
  private eventTimings: Map<string, {
    startTime: number;
    endTime?: number;
    duration?: number;
    success: boolean;
    error?: string;
  }> = new Map();

  private slowThreshold = 2000; // 2 seconds
  private verySlowThreshold = 5000; // 5 seconds
  
  // Track when an operation starts
  startTracking(operationId: string): void {
    console.log(`[Performance] Starting operation: ${operationId}`);
    this.eventTimings.set(operationId, {
      startTime: performance.now(),
      success: false
    });
  }
  
  // Track when an operation ends successfully
  endTracking(operationId: string): void {
    const timing = this.eventTimings.get(operationId);
    if (!timing) {
      console.warn(`[Performance] Trying to end tracking for unknown operation: ${operationId}`);
      return;
    }
    
    const endTime = performance.now();
    const duration = endTime - timing.startTime;
    
    this.eventTimings.set(operationId, {
      ...timing,
      endTime,
      duration,
      success: true
    });
    
    // Log performance information
    if (duration > this.verySlowThreshold) {
      console.warn(`[Performance] Operation ${operationId} was VERY SLOW: ${duration.toFixed(2)}ms`);
    } else if (duration > this.slowThreshold) {
      console.warn(`[Performance] Operation ${operationId} was SLOW: ${duration.toFixed(2)}ms`);
    } else {
      console.log(`[Performance] Operation ${operationId} completed in ${duration.toFixed(2)}ms`);
    }
  }
  
  // Track when an operation fails
  trackError(operationId: string, error: Error | string): void {
    const timing = this.eventTimings.get(operationId);
    if (!timing) {
      console.warn(`[Performance] Trying to track error for unknown operation: ${operationId}`);
      return;
    }
    
    const endTime = performance.now();
    const duration = endTime - timing.startTime;
    const errorMessage = error instanceof Error ? error.message : error;
    
    this.eventTimings.set(operationId, {
      ...timing,
      endTime,
      duration,
      success: false,
      error: errorMessage
    });
    
    console.error(`[Performance] Operation ${operationId} FAILED after ${duration.toFixed(2)}ms: ${errorMessage}`);
  }
  
  // Get performance report for all operations
  getReport(): Record<string, any> {
    const report: Record<string, any> = {};
    this.eventTimings.forEach((timing, operationId) => {
      report[operationId] = {
        duration: timing.duration ? `${timing.duration.toFixed(2)}ms` : 'ongoing',
        success: timing.success,
        error: timing.error || undefined
      };
    });
    return report;
  }
  
  // Get timing for a specific operation
  getOperationTiming(operationId: string): number | undefined {
    return this.eventTimings.get(operationId)?.duration;
  }
  
  // Clear all timing data
  clear(): void {
    this.eventTimings.clear();
  }
  
  // Check for any ongoing operations that might be hung
  checkForHungOperations(): string[] {
    const hungOperations: string[] = [];
    const now = performance.now();
    
    this.eventTimings.forEach((timing, operationId) => {
      if (!timing.endTime && (now - timing.startTime > this.verySlowThreshold)) {
        hungOperations.push(operationId);
        console.warn(`[Performance] Potential hung operation: ${operationId} (${((now - timing.startTime) / 1000).toFixed(1)}s and still running)`);
      }
    });
    
    return hungOperations;
  }
  
  // Diagnostic utilities for specific transaction issues
  
  // Specifically monitor transaction loading operations
  monitorTransactionLoading(): () => void {
    const operationId = `transaction_load_${Date.now()}`;
    this.startTracking(operationId);
    
    return () => {
      this.endTracking(operationId);
    };
  }
  
  // Track API calls with payload size measurement
  trackApiCall(url: string, payload: any): () => void {
    const operationId = `api_${url}_${Date.now()}`;
    
    try {
      // Estimate payload size
      const payloadSize = payload ? JSON.stringify(payload).length : 0;
      console.log(`[Performance] API call to ${url} with payload size: ${(payloadSize / 1024).toFixed(2)} KB`);
    } catch (e) {
      console.warn(`[Performance] Could not measure payload size for ${url}: ${e}`);
    }
    
    this.startTracking(operationId);
    
    return () => {
      this.endTracking(operationId);
    };
  }
  
  // Report web vitals metrics using the updated API
  reportWebVitals(onPerfEntry?: (metric: Metric) => void): void {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor; 