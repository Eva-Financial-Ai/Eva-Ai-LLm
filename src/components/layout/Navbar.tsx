import React, { useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserContext } from '../../contexts/UserContext';

interface NavbarProps {
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  orientation?: 'portrait' | 'landscape';
}

const Navbar: React.FC<NavbarProps> = ({ 
  deviceType = 'desktop',
  orientation = 'landscape'
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme, sidebarCollapsed, setSidebarCollapsed } = useContext(UserContext);

  // State for user menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isPortrait = orientation === 'portrait';

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Add the missing functions
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-2 sm:px-3">
        <div className="flex justify-between h-14">
          {/* Mobile menu button and logo */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-1.5 mr-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search bar - simplified and responsive */}
            <div className={`ml-2 ${isMobile ? 'w-32' : 'w-64'}`}>
              <input
                type="text"
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder={isMobile ? "Search..." : "Search EVA Platform..."}
              />
            </div>
          </div>

          {/* Right side - user menu */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Theme Toggle - only shown on larger screens */}
            {!isMobile && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                {theme === 'dark' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            )}

            {/* User profile */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none"
                onClick={() => {}}
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span className="text-sm font-medium">U</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
