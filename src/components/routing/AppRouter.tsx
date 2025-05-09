import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import page components
import Dashboard from '../../pages/Dashboard';
import { PortfolioNavigatorPage } from '../../pages/PortfolioNavigatorPage';
import CreditApplication from '../../pages/CreditApplication';
// DocumentCenter page is missing, commenting out import until file is created
// import DocumentCenter from '../../pages/DocumentCenter';
import AssetPress from '../../pages/AssetPress';
import CustomerRetention from '../../pages/CustomerRetention';
import FormTemplate from '../../pages/FormTemplate';

const AppRouter: React.FC = () => {
  return (
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
  );
};

export default AppRouter;
