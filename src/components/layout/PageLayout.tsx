import React, { ReactNode, useEffect, useState } from 'react';
import TopNavigation from './TopNavigation';

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  hideTopNav?: boolean;
  showBackButton?: boolean;
  backPath?: string;
  fullWidth?: boolean;
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
  backPath,
  fullWidth = false
}) => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Set device type based on width
      if (width < 640) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
      
      // Set orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    // Set initial device type and orientation
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive padding based on device type but keep it minimal
  const getPadding = () => {
    if (fullWidth) return 'px-0';
    
    switch (deviceType) {
      case 'mobile':
        return 'px-3 py-2';
      case 'tablet':
        return 'px-4 py-3';
      case 'desktop':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  // Always use full width
  const getContentMaxWidth = () => 'w-full max-w-full';

  return (
    <div 
      className={`flex flex-col min-h-screen w-full ${getPadding()}`}
      data-device-type={deviceType}
      data-orientation={orientation}
    >
      {!hideTopNav && (
        <div className="mb-2">
          <TopNavigation 
            title={title} 
            showBackButton={showBackButton} 
            backPath={backPath} 
            deviceType={deviceType}
            orientation={orientation}
          />
        </div>
      )}
      <main className={`flex-1 ${getContentMaxWidth()}`}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
