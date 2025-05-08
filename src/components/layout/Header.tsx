import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotificationCenter from '../NotificationCenter';
import { NotificationSystem } from '../../services/DocumentGenerationService';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'EVA AI' }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Get initial notification count
    const allNotifications = NotificationSystem.getAll();
    setUnreadCount(allNotifications.filter(notification => !notification.isRead).length);
    
    // Subscribe to new notifications
    const unsubscribe = NotificationSystem.subscribe((notification) => {
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    
    // Reset unread count when notifications are opened
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-primary-600 text-2xl font-bold mr-1">EVA</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md">BETA</span>
              </Link>
            </div>
            {title && (
              <div className="hidden lg:ml-6 lg:flex lg:items-center">
                <span className="text-gray-900 text-lg font-medium">{title}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center lg:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          
          <div className="hidden lg:ml-4 lg:flex lg:items-center">
            {/* Notification bell */}
            <button
              onClick={toggleNotifications}
              className="relative p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Center */}
      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </header>
  );
};

export default Header; 