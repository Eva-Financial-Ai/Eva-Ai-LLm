import React, { useState, useEffect } from 'react';
import CreditApplication from '../components/CreditApplication';
import PageLayout from '../components/layout/PageLayout';
import ErrorBoundary from '../components/common/ErrorBoundary';

const CreditApplicationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout title="Origination Creator Tool">
      <div className="flex-grow overflow-hidden">
        <ErrorBoundary
          fallback={
            <div className="p-8 text-center">
              There was an error loading the Origination Creator Tool. Please try again.
            </div>
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 mb-4"></div>
                <div className="h-4 w-48 bg-primary-100 rounded mb-3"></div>
                <div className="h-3 w-32 bg-primary-100 rounded"></div>
              </div>
            </div>
          ) : (
            <CreditApplication />
          )}
        </ErrorBoundary>
      </div>
    </PageLayout>
  );
};

export default CreditApplicationPage;
