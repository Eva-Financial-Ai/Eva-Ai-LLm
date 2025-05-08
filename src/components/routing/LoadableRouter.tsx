import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';

// Loading spinner component
const LoadingSpinner = ({ pageName = 'page' }: { pageName?: string }) => (
  <div className="flex flex-col items-center justify-center h-screen w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-primary-600 text-lg">Loading {pageName}...</p>
    <p className="text-gray-500 text-sm mt-2">Please wait while we prepare this page</p>
  </div>
);

// Error component
const LoadError = ({ pageName = 'page', retry }: { pageName: string, retry: () => void }) => (
  <div className="p-8 text-center">
    <h2 className="text-xl text-red-600 font-bold mb-4">Failed to load {pageName}</h2>
    <p className="mb-4">There was a problem loading this page.</p>
    <button 
      onClick={retry}
      className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
    >
      Try Again
    </button>
  </div>
);

// Loadable components with specific fallback and error UIs
const Dashboard = loadable(() => import('../../pages/Dashboard'), {
  fallback: <LoadingSpinner pageName="Dashboard" />,
  resolveComponent: (components) => components.default
});

const CreditApplication = loadable(() => import('../../pages/CreditApplication'), {
  fallback: <LoadingSpinner pageName="Credit Application" />,
  resolveComponent: (components) => components.default
});

const Documents = loadable(() => import('../../pages/Documents'), {
  fallback: <LoadingSpinner pageName="Documents" />,
  resolveComponent: (components) => components.default
});

const RiskAssessment = loadable(() => import('../../pages/RiskAssessment'), {
  fallback: <LoadingSpinner pageName="Risk Assessment" />,
  resolveComponent: (components) => components.default
});

const DealStructuring = loadable(() => import('../../pages/DealStructuring'), {
  fallback: <LoadingSpinner pageName="Deal Structuring" />,
  resolveComponent: (components) => components.default
});

const Transactions = loadable(() => import('../../pages/Transactions'), {
  fallback: <LoadingSpinner pageName="Transactions" />,
  resolveComponent: (components) => components.default
});

const ProfileSettings = loadable(() => import('../../pages/ProfileSettings'), {
  fallback: <LoadingSpinner pageName="Profile Settings" />,
  resolveComponent: (components) => components.default
});

const ExampleTransactions = loadable(() => import('../../pages/ExampleTransactions'), {
  fallback: <LoadingSpinner pageName="Example Transactions" />,
  resolveComponent: (components) => components.default
});

const EnhancedAssetPress = loadable(() => import('../../pages/EnhancedAssetPress'), {
  fallback: <LoadingSpinner pageName="Asset Press" />,
  resolveComponent: (components) => components.default
});

const PortfolioNavigatorPage = loadable(() => import('../../pages/PortfolioNavigatorPage').then(m => ({ default: m.PortfolioNavigatorPage })), {
  fallback: <LoadingSpinner pageName="Portfolio Navigator" />,
});

const CommercialPaper = loadable(() => import('../../pages/CommercialPaper'), {
  fallback: <LoadingSpinner pageName="Commercial Paper" />,
  resolveComponent: (components) => components.default
});

const CustomerRetention = loadable(() => import('../../pages/CustomerRetention'), {
  fallback: <LoadingSpinner pageName="Customer Retention" />,
  resolveComponent: (components) => components.default
});

const FormTemplate = loadable(() => import('../../pages/FormTemplate'), {
  fallback: <LoadingSpinner pageName="Form Template" />,
  resolveComponent: (components) => components.default
});

const LoadableRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/risk-assessment" element={<RiskAssessment />} />
      <Route path="/credit-application" element={<CreditApplication />} />
      <Route path="/deal-structuring" element={<DealStructuring />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/examples" element={<ExampleTransactions />} />
      <Route path="/asset-press" element={<EnhancedAssetPress />} />
      <Route path="/portfolio-wallet" element={<PortfolioNavigatorPage />} />
      <Route path="/asset-portfolio" element={<PortfolioNavigatorPage />} />
      <Route path="/commercial-paper" element={<CommercialPaper />} />
      <Route path="/customer-retention" element={<CustomerRetention />} />
      <Route path="/forms/:templateId" element={<FormTemplate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default LoadableRouter; 