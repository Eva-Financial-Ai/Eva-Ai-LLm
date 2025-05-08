import React, { useState, useEffect } from 'react';
import { NotificationSystem, Notification } from '../services/DocumentGenerationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  useEffect(() => {
    // Get initial notifications
    setNotifications(NotificationSystem.getAll());
    
    // Subscribe to notification updates
    const unsubscribe = NotificationSystem.subscribe((notification) => {
      setNotifications(prev => [notification, ...prev]);
      setNewNotificationCount(prev => prev + 1);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Mark all as read
  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        NotificationSystem.markAsRead(notification.id);
      }
    });
    
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    
    setNewNotificationCount(0);
  };

  // Mark a specific notification as read
  const handleMarkAsRead = (id: string) => {
    NotificationSystem.markAsRead(id);
    
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true } 
        : notification
    ));
    
    setNewNotificationCount(prev => Math.max(0, prev - 1));
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: 'success' | 'warning' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  // Format time elapsed
  const formatTimeElapsed = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  // If not open, don't render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                  <div className="flex">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-primary-600 hover:text-primary-500"
                    >
                      Mark all as read
                    </button>
                    <button
                      className="ml-4 text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {newNotificationCount > 0 && (
                  <div className="mt-1">
                    <span className="text-sm text-gray-500">{newNotificationCount} new notification{newNotificationCount !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              
              <ul className="flex-1 divide-y divide-gray-200 overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="py-6 px-5">
                    <div className="text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  </li>
                ) : (
                  notifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`py-5 px-6 ${!notification.isRead ? 'bg-primary-50' : ''}`}
                      onClick={() => {
                        if (!notification.isRead) {
                          handleMarkAsRead(notification.id);
                        }
                        
                        if (notification.actionUrl) {
                          // In a real app, we would use a router to navigate
                          console.log(`Navigate to: ${notification.actionUrl}`);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        {getNotificationIcon(notification.type)}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTimeElapsed(notification.timestamp)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          {notification.actionUrl && (
                            <div className="mt-2">
                              <button className="text-xs text-primary-600 hover:text-primary-500">
                                View details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter; 