import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
}

interface TopNavigationProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  backPath?: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ title, breadcrumbs, showBackButton, backPath }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if back button should be shown
  // If showBackButton is explicitly provided, use that, otherwise show back button except on dashboard
  const shouldShowBackButton = showBackButton !== undefined 
    ? showBackButton 
    : location.pathname !== '/' && location.pathname !== '/dashboard';

  // Generate breadcrumbs automatically if not provided
  const generatedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;

    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [];

    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        name,
        href,
        current: index === paths.length - 1,
      };
    });
  }, [location.pathname, breadcrumbs]);

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1); // Go back in history if no specific path is provided
    }
  };

  const handleExit = () => {
    navigate('/dashboard'); // Go to dashboard
  };

  return (
    <div className="bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* Title with optional back button */}
          <div className="flex items-center">
            {shouldShowBackButton && (
              <button
                onClick={handleBack}
                className="mr-3 p-1 rounded-full hover:bg-gray-100"
                title="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Exit to dashboard button - only show when not on dashboard */}
        {location.pathname !== '/' && location.pathname !== '/dashboard' && (
          <button
            onClick={handleExit}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-base font-medium transition-colors"
            title="Return to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TopNavigation;
