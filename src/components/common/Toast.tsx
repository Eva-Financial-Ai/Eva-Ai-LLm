import React, { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  id: string;
}

const typeClasses = {
  success: 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-green-500/30',
  error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 ring-red-500/30',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 ring-yellow-500/30',
  info: 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 ring-blue-500/30',
};

const typeIcons = {
  success: (
    <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" aria-hidden="true" />
  ),
  error: <XCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />,
  warning: (
    <ExclamationCircleIcon
      className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
      aria-hidden="true"
    />
  ),
  info: (
    <InformationCircleIcon
      className="h-5 w-5 text-blue-500 dark:text-blue-400"
      aria-hidden="true"
    />
  ),
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000, id }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set up auto-dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);

      // Add a small delay for animation to complete before fully removing
      setTimeout(onClose, 300);
    }, duration);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);

    // Add a small delay for animation to complete
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 overflow-hidden transition-all duration-300 ease-in-out ${
        typeClasses[type]
      } ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      id={`toast-${id}`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{typeIcons[type]}</div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleClose}
              aria-label="Close notification"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
