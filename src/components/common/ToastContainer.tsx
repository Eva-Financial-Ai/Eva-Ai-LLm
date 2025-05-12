import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastType } from './Toast';

// Define toast object type
interface ToastObject {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Context for toast operations
interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastObject[]>([]);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Create portal container on mount
  useEffect(() => {
    // Check if the container already exists
    let container = document.getElementById('toast-portal-container');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-portal-container';
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(container);
    }

    setPortalContainer(container);

    // Clean up on unmount
    return () => {
      // Only remove if it's empty
      if (container && container.childElementCount === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Show a new toast
  const showToast = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    setToasts(prev => [...prev, { id, message, type, duration }]);

    // Set up auto-removal after duration + animation time
    if (duration) {
      setTimeout(() => {
        hideToast(id);
      }, duration + 300);
    }

    return id;
  }, []);

  // Hide a specific toast
  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Value for the context provider
  const contextValue = {
    showToast,
    hideToast,
    clearToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {portalContainer &&
        createPortal(
          <div className="toast-container" aria-live="polite" aria-atomic="true">
            {toasts.map(toast => (
              <Toast
                key={toast.id}
                id={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration || 5000}
                onClose={() => hideToast(toast.id)}
              />
            ))}
          </div>,
          portalContainer
        )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
