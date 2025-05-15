import React, { memo, useMemo } from 'react';
import { LoadingStatus } from '../../services/LoadingService';

// Props for the ModularLoading component
interface ModularLoadingProps {
  status: LoadingStatus;
  size?: 'sm' | 'md' | 'lg' | 'full';
  theme?: 'light' | 'dark' | 'red';
  showMessage?: boolean;
  showProgress?: boolean;
  overlay?: boolean;
  spinnerType?: 'circle' | 'dots' | 'bar';
  showThoughtProcess?: boolean;
  className?: string;
}

// Loading bar animation - memoized for better performance
const LoadingBarAnimation = memo(({ progress, theme }: { progress?: number; theme: string }) => {
  const themeClasses = {
    light: 'bg-blue-600',
    dark: 'bg-indigo-600',
    red: 'bg-red-600',
  };
  
  // Round progress to nearest integer to reduce unnecessary re-renders
  const roundedProgress = Math.round(progress || 0);
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
      <div 
        className={`h-1.5 rounded-full ${themeClasses[theme as keyof typeof themeClasses]}`} 
        style={{ width: `${roundedProgress}%`, transition: 'width 0.3s ease-in-out' }}
      ></div>
    </div>
  );
});

// Loading spinner with various types - memoized for better performance
const LoadingSpinner = memo(({ type, theme }: { type: string; theme: string }) => {
  const themeClasses = {
    light: 'text-blue-600',
    dark: 'text-indigo-600',
    red: 'text-red-600',
  };
  
  if (type === 'dots') {
    return (
      <div className="flex space-x-1 justify-center items-center h-6">
        <div className={`w-2 h-2 ${themeClasses[theme as keyof typeof themeClasses]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 ${themeClasses[theme as keyof typeof themeClasses]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 ${themeClasses[theme as keyof typeof themeClasses]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }
  
  if (type === 'bar') {
    return (
      <div className="flex justify-center items-center h-6 space-x-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 h-5 ${themeClasses[theme as keyof typeof themeClasses]} animate-pulse`}
            style={{ animationDelay: `${i * 100}ms`, height: `${(i % 2 === 0 ? 16 : 10) + 4}px` }}
          ></div>
        ))}
      </div>
    );
  }
  
  // Default circle spinner
  return (
    <div className="flex justify-center items-center h-10">
      <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${themeClasses[theme as keyof typeof themeClasses]}`}></div>
    </div>
  );
});

// Eva's thought process component - memoized for better performance
const ThoughtProcess = memo(({ thoughts }: { thoughts: string[] }) => {
  if (!thoughts || thoughts.length === 0) return null;
  
  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-2">EVA Analysis Process:</h4>
      <ul className="text-xs space-y-2 text-gray-600">
        {thoughts.map((thought, index) => (
          <li key={index} className="flex items-start">
            <span className="inline-block w-5 h-5 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center mr-2">
              {index + 1}
            </span>
            <span>{thought}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

// Main component - memoized for better performance
const ModularLoading: React.FC<ModularLoadingProps> = memo(({
  status,
  size = 'md',
  theme = 'red',
  showMessage = true,
  showProgress = true,
  overlay = false,
  spinnerType = 'circle',
  showThoughtProcess = false,
  className = '',
}) => {
  const { state, message, progress, error, thoughtProcess } = status;
  
  // If not in loading state and not showing errors, don't render
  if (state !== 'loading' && (state !== 'error' || !error)) {
    return null;
  }
  
  // Size classes - memoized to prevent recalculation
  const sizeClasses = useMemo(() => ({
    sm: 'max-w-xs p-3',
    md: 'max-w-md p-4',
    lg: 'max-w-lg p-6',
    full: 'w-full p-8',
  }), []);
  
  // Theme classes - memoized to prevent recalculation
  const textColorClasses = useMemo(() => ({
    light: 'text-blue-600',
    dark: 'text-indigo-800',
    red: 'text-red-600',
  }), []);
  
  // Calculate rounded progress once to avoid re-calculations
  const roundedProgress = Math.round(progress || 0);
  
  // Base content
  const content = (
    <div className={`${sizeClasses[size]} bg-white rounded-lg shadow-xl ${className}`}>
      {/* Spinner */}
      <LoadingSpinner type={spinnerType} theme={theme} />
      
      {/* Progress bar */}
      {showProgress && state === 'loading' && (
        <div className="mt-3">
          <LoadingBarAnimation progress={progress} theme={theme} />
          {progress !== undefined && (
            <div className="text-xs text-gray-500 text-right">
              {roundedProgress}%
            </div>
          )}
        </div>
      )}
      
      {/* Message */}
      {showMessage && (
        <div className={`text-center mt-3 ${
          state === 'error' 
            ? 'text-red-600' 
            : textColorClasses[theme as keyof typeof textColorClasses]
        }`}>
          {state === 'error' ? error : message}
        </div>
      )}
      
      {/* Eva's chain of thought - only shown when thoughtProcess exists and showThoughtProcess is true */}
      {showThoughtProcess && thoughtProcess && thoughtProcess.length > 0 && (
        <ThoughtProcess thoughts={thoughtProcess} />
      )}
    </div>
  );
  
  // With overlay
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }
  
  // Without overlay
  return content;
});

export default ModularLoading; 