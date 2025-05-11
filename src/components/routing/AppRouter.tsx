import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen w-full bg-white bg-opacity-80">
    <div className="animate-pulse flex flex-col items-center">
      <div className="rounded-full bg-gray-200 h-12 w-12 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
      <div className="h-2 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

// Lazy load page components for code splitting
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const PortfolioNavigatorPage = lazy(() => import('../../pages/PortfolioNavigatorPage').then(module => ({ default: module.PortfolioNavigatorPage })));
const CreditApplication = lazy(() => import('../../pages/CreditApplication'));
// DocumentCenter page is missing, commenting out import until file is created
// import DocumentCenter from '../../pages/DocumentCenter';
const AssetPress = lazy(() => import('../../pages/AssetPress'));
const CustomerRetention = lazy(() => import('../../pages/CustomerRetention'));
const FormTemplate = lazy(() => import('../../pages/FormTemplate'));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio-navigator" element={<PortfolioNavigatorPage />} />
        <Route path="/credit-application" element={<CreditApplication />} />
        {/* Temporarily commenting out DocumentCenter route until component is created */}
        {/* <Route path="/document-center" element={<DocumentCenter />} /> */}
        <Route path="/asset-press" element={<AssetPress />} />
        <Route path="/customer-retention" element={<CustomerRetention />} />
        <Route path="/form-template" element={<FormTemplate />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
