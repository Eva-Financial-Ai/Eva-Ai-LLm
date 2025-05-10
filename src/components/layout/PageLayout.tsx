import React, { ReactNode } from 'react';
import TopNavigation from './TopNavigation';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  hideTopNav?: boolean;
}

/**
 * PageLayout component that wraps all pages and provides consistent navigation
 * This helps avoid duplicate TopNavigation components across multiple pages
 */
const PageLayout: React.FC<PageLayoutProps> = ({ children, title, hideTopNav = false }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideTopNav && (
        <div className="mb-4">
          <TopNavigation title={title} />
        </div>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default PageLayout;
