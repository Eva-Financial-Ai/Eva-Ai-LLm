import React, { useState, useEffect, useCallback, memo } from 'react';

interface ComponentRenderMetric {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  totalRenderTime: number;
  avgRenderTime: number;
}

interface MemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Global metric store to maintain metrics across renders
const metricStore: Record<string, ComponentRenderMetric> = {};

// Export the measurement function to be used in components
export function measureComponentRender(componentName: string, renderTime: number): void {
  if (!metricStore[componentName]) {
    metricStore[componentName] = {
      componentName,
      renderCount: 0,
      lastRenderTime: 0,
      totalRenderTime: 0,
      avgRenderTime: 0,
    };
  }
  
  const metric = metricStore[componentName];
  metric.renderCount += 1;
  metric.lastRenderTime = renderTime;
  metric.totalRenderTime += renderTime;
  metric.avgRenderTime = metric.totalRenderTime / metric.renderCount;
}

// HOC to wrap components for performance monitoring
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  const DisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WrappedWithTracking = (props: P) => {
    const startTime = performance.now();
    
    useEffect(() => {
      const renderTime = performance.now() - startTime;
      measureComponentRender(componentName, renderTime);
    });
    
    return <WrappedComponent {...props} />;
  };
  
  WrappedWithTracking.displayName = `WithPerformanceTracking(${DisplayName})`;
  
  return memo(WrappedWithTracking);
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<ComponentRenderMetric[]>([]);
  const [fps, setFps] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<MemoryUsage | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<keyof ComponentRenderMetric>('avgRenderTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Update memory usage
  const updateMemoryUsage = useCallback(() => {
    if (window.performance && 'memory' in window.performance) {
      const memory = (window.performance as any).memory;
      setMemoryUsage({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    }
  }, []);
  
  // Calculate FPS
  const calculateFPS = useCallback(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrame);
    };
    
    requestAnimationFrame(countFrame);
  }, []);
  
  // Update metrics from store
  const updateMetrics = useCallback(() => {
    const updatedMetrics = Object.values(metricStore);
    
    // Sort metrics
    updatedMetrics.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    setMetrics(updatedMetrics);
  }, [sortBy, sortDirection]);
  
  // Initialize monitoring
  useEffect(() => {
    calculateFPS();
    
    const intervalId = setInterval(() => {
      updateMemoryUsage();
      updateMetrics();
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [calculateFPS, updateMemoryUsage, updateMetrics]);
  
  // Handle sort change
  const handleSort = (column: keyof ComponentRenderMetric) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Format bytes to human-readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="fixed bottom-0 right-0 z-50 bg-white shadow-lg rounded-tl-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium text-gray-700">Performance Monitor</h3>
        <div className="flex items-center space-x-4">
          <div className="text-xs">
            <span className="font-medium">FPS:</span>{' '}
            <span className={`${fps < 30 ? 'text-red-600' : fps < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
              {fps}
            </span>
          </div>
          {memoryUsage && (
            <div className="text-xs">
              <span className="font-medium">Memory:</span>{' '}
              <span className={`${memoryUsage.usedJSHeapSize / memoryUsage.jsHeapSizeLimit > 0.7 ? 'text-red-600' : 'text-gray-600'}`}>
                {formatBytes(memoryUsage.usedJSHeapSize)} / {formatBytes(memoryUsage.jsHeapSizeLimit)}
              </span>
            </div>
          )}
          <button className="text-gray-500 hover:text-gray-700">
            {expanded ? '↓' : '↑'}
          </button>
        </div>
      </div>
      
      {/* Component Metrics */}
      {expanded && (
        <div className="max-h-96 overflow-auto p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('componentName')}
                >
                  Component
                  {sortBy === 'componentName' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('renderCount')}
                >
                  Renders
                  {sortBy === 'renderCount' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastRenderTime')}
                >
                  Last (ms)
                  {sortBy === 'lastRenderTime' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('avgRenderTime')}
                >
                  Avg (ms)
                  {sortBy === 'avgRenderTime' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.map((metric) => (
                <tr key={metric.componentName}>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                    {metric.componentName}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                    {metric.renderCount}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className={`${metric.lastRenderTime > 16 ? 'text-red-600' : metric.lastRenderTime > 8 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {metric.lastRenderTime.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <span className={`${metric.avgRenderTime > 16 ? 'text-red-600' : metric.avgRenderTime > 8 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {metric.avgRenderTime.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default memo(PerformanceMonitor); 