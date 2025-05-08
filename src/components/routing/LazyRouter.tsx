import React, { Suspense, lazy, ComponentType } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Enhanced LoadingSpinner component with customized messages
const LoadingSpinner = ({ pageName = 'page' }: { pageName?: string }) => (
  <div className="flex flex-col items-center justify-center h-screen w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-primary-600 text-lg">Loading {pageName}...</p>
    <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
  </div>
);

// Error boundary for catching lazy loading errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error loading component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Helper function to create lazy-loaded routes with appropriate loading states
const createLazyRoute = (
  path: string, 
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  displayName: string
) => {
  const LazyComponent = lazy(importFunc);
  
  return (
    <Route 
      key={path}
      path={path} 
      element={
        <ErrorBoundary
          fallback={
            <div className="p-8 text-center">
              <h2 className="text-xl text-red-600 font-bold mb-4">Failed to load {displayName}</h2>
              <p className="mb-4">There was a problem loading this page.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          }
        >
          <Suspense fallback={<LoadingSpinner pageName={displayName} />}>
            <LazyComponent />
          </Suspense>
        </ErrorBoundary>
      } 
    />
  );
};

const LazyRouter: React.FC = () => {
  const routes = [
    { path: "/", importFunc: () => import('../../pages/Dashboard'), displayName: "Dashboard" },
    { path: "/transactions", importFunc: () => import('../../pages/Transactions'), displayName: "Transactions" },
    { path: "/documents", importFunc: () => import('../../pages/Documents'), displayName: "Documents" },
    { path: "/risk-assessment", importFunc: () => import('../../pages/RiskAssessment'), displayName: "Risk Assessment" },
    { path: "/credit-application", importFunc: () => import('../../pages/CreditApplication'), displayName: "Credit Application" },
    { path: "/deal-structuring", importFunc: () => import('../../pages/DealStructuring'), displayName: "Deal Structuring" },
    { path: "/profile", importFunc: () => import('../../pages/ProfileSettings'), displayName: "Profile Settings" },
    { path: "/examples", importFunc: () => import('../../pages/ExampleTransactions'), displayName: "Example Transactions" },
    { path: "/asset-press", importFunc: () => import('../../pages/EnhancedAssetPress'), displayName: "Asset Press" },
    { 
      path: "/portfolio-wallet", 
      importFunc: () => import('../../pages/PortfolioNavigatorPage').then(m => ({ default: m.PortfolioNavigatorPage })), 
      displayName: "Portfolio Wallet" 
    },
    { 
      path: "/asset-portfolio", 
      importFunc: () => import('../../pages/PortfolioNavigatorPage').then(m => ({ default: m.PortfolioNavigatorPage })), 
      displayName: "Asset Portfolio" 
    },
    { path: "/commercial-paper", importFunc: () => import('../../pages/CommercialPaper'), displayName: "Commercial Paper" },
    { path: "/customer-retention", importFunc: () => import('../../pages/CustomerRetention'), displayName: "Customer Retention" },
    { path: "/forms/:templateId", importFunc: () => import('../../pages/FormTemplate'), displayName: "Form Template" },
    { path: "/transactions/:transactionId/execute", importFunc: () => import('../../pages/TransactionExecutionPage'), displayName: "Transaction Execution" },
  ];

  return (
    <Routes>
      {routes.map(route => createLazyRoute(route.path, route.importFunc, route.displayName))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default LazyRouter; 