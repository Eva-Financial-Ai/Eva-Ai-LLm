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
}

const TopNavigation: React.FC<TopNavigationProps> = ({ title, breadcrumbs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Always show back button except on dashboard
  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';

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
    navigate(-1); // Go back in history
  };

  const handleExit = () => {
    navigate('/dashboard'); // Go to dashboard
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6 flex flex-col rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors flex items-center"
              title="Go back"
              aria-label="Go back to previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              <span className="ml-2 text-base font-medium">Back</span>
            </button>
          )}
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
        </div>

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

      {/* Breadcrumbs */}
      {generatedBreadcrumbs.length > 0 && (
        <nav className="mt-3" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link to="/dashboard" className="text-gray-500 hover:text-primary-600 text-base">
                Dashboard
              </Link>
            </li>
            {generatedBreadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                <svg className="h-5 w-5 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <Link
                  to={crumb.href}
                  className={`${
                    crumb.current
                      ? 'text-primary-600 font-medium'
                      : 'text-gray-500 hover:text-primary-600'
                  } text-base`}
                  aria-current={crumb.current ? 'page' : undefined}
                >
                  {crumb.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
};

export default TopNavigation;
