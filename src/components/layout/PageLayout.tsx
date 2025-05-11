import React, { ReactNode } from 'react';
import TopNavigation from './TopNavigation';

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  hideTopNav?: boolean;
  showBackButton?: boolean;
  backPath?: string;
}

/**
 * PageLayout component that wraps all pages and provides consistent navigation
 * This helps avoid duplicate TopNavigation components across multiple pages
 */
const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  hideTopNav = false,
  showBackButton,
  backPath 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideTopNav && (
        <div className="mb-4">
          <TopNavigation title={title} showBackButton={showBackButton} backPath={backPath} />
        </div>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default PageLayout;
