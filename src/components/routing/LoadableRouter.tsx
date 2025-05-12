import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import loadable from '@loadable/component';
import PageLayout from '../layout/PageLayout';
import PortfolioWalletPage from '../../pages/PortfolioWalletPage';
import SideNavigationTest from '../layout/__tests__/SideNavigationTest';
import CustomerRetentionCustomers from '../../pages/customerRetention/CustomerRetentionCustomers';
import CustomerRetentionContacts from '../../pages/customerRetention/CustomerRetentionContacts';
import CustomerRetentionCommitments from '../../pages/customerRetention/CustomerRetentionCommitments';
import CustomerRetentionCalendar from '../../pages/customerRetention/CustomerRetentionCalendar';
import PostClosingCustomers from '../../pages/PostClosingCustomers';

// Loading spinner component
const LoadingSpinner = ({ pageName = 'page' }: { pageName?: string }) => (
  <div className="flex flex-col items-center justify-center h-screen w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
    <p className="text-primary-600 text-lg">Loading {pageName}...</p>
    <p className="text-gray-500 text-sm mt-2">Please wait while we prepare this page</p>
  </div>
);

// Error component
const LoadError = ({ pageName = 'page', retry }: { pageName: string; retry: () => void }) => (
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
  resolveComponent: components => components.default,
});

const CreditApplication = loadable(() => import('../../pages/CreditApplication'), {
  fallback: <LoadingSpinner pageName="Credit Application" />,
  resolveComponent: components => components.default,
});

const AutoOriginations = loadable(() => import('../../pages/AutoOriginationsPage'), {
  fallback: <LoadingSpinner pageName="Auto Originations" />,
  resolveComponent: components => components.default,
});

const Documents = loadable(() => import('../../pages/Documents'), {
  fallback: <LoadingSpinner pageName="Documents" />,
  resolveComponent: components => components.default,
});

const RiskAssessment = loadable(() => import('../../pages/RiskAssessment'), {
  fallback: <LoadingSpinner pageName="Risk Assessment" />,
  resolveComponent: components => components.default,
});

const DealStructuring = loadable(() => import('../../pages/DealStructuring'), {
  fallback: <LoadingSpinner pageName="Deal Structuring" />,
  resolveComponent: components => components.default,
});

const SmartMatchPage = loadable(() => import('../../pages/SmartMatchPage'), {
  fallback: <LoadingSpinner pageName="Smart Match" />,
  resolveComponent: components => components.default,
});

const Transactions = loadable(() => import('../../pages/Transactions'), {
  fallback: <LoadingSpinner pageName="Transactions" />,
  resolveComponent: components => components.default,
});

const ProfileSettings = loadable(() => import('../../pages/ProfileSettings'), {
  fallback: <LoadingSpinner pageName="Profile Settings" />,
  resolveComponent: components => components.default,
});

const ExampleTransactions = loadable(() => import('../../pages/ExampleTransactions'), {
  fallback: <LoadingSpinner pageName="Example Transactions" />,
  resolveComponent: components => components.default,
});

const EnhancedAssetPress = loadable(() => import('../../pages/EnhancedAssetPress'), {
  fallback: <LoadingSpinner pageName="Asset Press" />,
  resolveComponent: components => components.default,
});

const PortfolioNavigatorPage = loadable(
  () =>
    import('../../pages/PortfolioNavigatorPage').then(m => ({ default: m.PortfolioNavigatorPage })),
  {
    fallback: <LoadingSpinner pageName="Portfolio Navigator" />,
  }
);

const CommercialPaper = loadable(() => import('../../pages/CommercialPaper'), {
  fallback: <LoadingSpinner pageName="Commercial Paper" />,
  resolveComponent: components => components.default,
});

const CustomerRetention = loadable(() => import('../../pages/CustomerRetention'), {
  fallback: <LoadingSpinner pageName="Customer Retention" />,
  resolveComponent: components => components.default,
});

const FormTemplate = loadable(() => import('../../pages/FormTemplate'), {
  fallback: <LoadingSpinner pageName="Form Template" />,
  resolveComponent: components => components.default,
});

const CommercialMarket = loadable(() => import('../../pages/CommercialMarket'), {
  fallback: <LoadingSpinner pageName="Commercial Market" />,
  resolveComponent: components => components.default,
});

const ShieldVault = loadable(() => import('../../pages/ShieldVault'), {
  fallback: <LoadingSpinner pageName="Shield Vault" />,
  resolveComponent: components => components.default,
});

// Add AIAssistant Page
const AIAssistantPage = loadable(() => import('../../pages/AIAssistantPage'), {
  fallback: <LoadingSpinner pageName="AI Assistant" />,
  resolveComponent: components => components.default,
});

// Add FormsList component
const FormsList = loadable(() => import('../../pages/FormsList'), {
  fallback: <LoadingSpinner pageName="Forms List" />,
  resolveComponent: components => components.default,
});

// Update Loadable components with improved loading handling
const Contacts = loadable(() => import('../../pages/Contacts'), {
  fallback: <LoadingSpinner pageName="Contacts" />,
  resolveComponent: components => components.default,
});

const Commitments = loadable(() => import('../../pages/Commitments'), {
  fallback: <LoadingSpinner pageName="Commitments" />,
  resolveComponent: components => components.default,
});

// Add TransactionExecutionPage to imports
const TransactionExecutionPage = loadable(() => import('../../pages/TransactionExecutionPage'), {
  fallback: <LoadingSpinner pageName="Transaction Execution" />,
  resolveComponent: components => components.default,
});

// Create calendar integration loadable component
const CalendarIntegration = loadable(() => import('../../pages/CalendarIntegration'), {
  fallback: <LoadingSpinner pageName="Calendar Integration" />,
  resolveComponent: components => components.default,
});

// Create page wrappers with PageLayout
const PageWrapper = (Component: React.ComponentType, title: string) => {
  return () => (
    <PageLayout title={title}>
      <Component />
    </PageLayout>
  );
};

const LoadableRouter: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageLayout title="Dashboard">
            <Dashboard />
          </PageLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <PageLayout title="Transactions">
            <Transactions />
          </PageLayout>
        }
      />
      <Route
        path="/transaction-execution"
        element={
          <PageLayout title="Transaction Execution">
            <TransactionExecutionPage />
          </PageLayout>
        }
      />
      <Route
        path="/documents"
        element={
          <PageLayout title="Documents">
            <Documents />
          </PageLayout>
        }
      />
      <Route
        path="/shield-vault"
        element={
          <PageLayout title="Shield Vault">
            <ShieldVault />
          </PageLayout>
        }
      />
      <Route
        path="/ai-assistant"
        element={
          <PageLayout title="AI Assistant" fullWidth>
            <AIAssistantPage />
          </PageLayout>
        }
      />
      <Route
        path="/risk-assessment"
        element={
          <PageLayout title="Risk Assessment">
            <RiskAssessment />
          </PageLayout>
        }
      />
      <Route
        path="/risk-assessment/:view"
        element={
          <PageLayout title="Risk Assessment">
            <RiskAssessment />
          </PageLayout>
        }
      />
      <Route
        path="/risk-assessment/standard"
        element={
          <PageLayout title="Standard Risk Assessment">
            <RiskAssessment />
          </PageLayout>
        }
      />
      <Route
        path="/risk-assessment/report"
        element={
          <PageLayout title="Eva Risk Report">
            <RiskAssessment />
          </PageLayout>
        }
      />
      <Route
        path="/risk-assessment/lab"
        element={
          <PageLayout title="Risk Lab">
            <RiskAssessment />
          </PageLayout>
        }
      />
      <Route
        path="/risk-assessment/score"
        element={
          <PageLayout title="Eva Score">
            <RiskAssessment />
          </PageLayout>
        }
      />
      <Route
        path="/credit-application"
        element={
          <PageLayout title="Credit Application">
            <CreditApplication />
          </PageLayout>
        }
      />
      <Route
        path="/auto-originations"
        element={
          <PageLayout title="Auto Originations">
            <AutoOriginations />
          </PageLayout>
        }
      />
      <Route
        path="/post-closing"
        element={<PostClosingCustomers />}
      />
      <Route
        path="/deal-structuring"
        element={
          <PageLayout title="Deal Structuring">
            <DealStructuring />
          </PageLayout>
        }
      />
      <Route
        path="/deal-structuring/smart-match"
        element={
          <PageLayout title="Smart Match">
            <SmartMatchPage />
          </PageLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PageLayout title="Profile Settings">
            <ProfileSettings />
          </PageLayout>
        }
      />
      <Route
        path="/examples"
        element={
          <PageLayout title="Example Transactions">
            <ExampleTransactions />
          </PageLayout>
        }
      />
      <Route
        path="/asset-press"
        element={
          <PageLayout title="Asset Press">
            <EnhancedAssetPress />
          </PageLayout>
        }
      />
      <Route
        path="/portfolio-wallet"
        element={
          <PageLayout title="Portfolio Wallet">
            <PortfolioWalletPage />
          </PageLayout>
        }
      />
      <Route
        path="/asset-portfolio"
        element={
          <PageLayout title="Asset Portfolio">
            <PortfolioNavigatorPage />
          </PageLayout>
        }
      />
      <Route
        path="/commercial-paper"
        element={
          <PageLayout title="Commercial Paper">
            <CommercialPaper />
          </PageLayout>
        }
      />
      <Route
        path="/customer-retention"
        element={
          <PageLayout title="Customer Retention">
            <CustomerRetention />
          </PageLayout>
        }
      />
      <Route
        path="/customer-retention/customers"
        element={<CustomerRetentionCustomers />}
      />
      <Route
        path="/customer-retention/contacts"
        element={<CustomerRetentionContacts />}
      />
      <Route
        path="/customer-retention/commitments"
        element={<CustomerRetentionCommitments />}
      />
      <Route
        path="/customer-retention/calendar/:provider"
        element={<CustomerRetentionCalendar />}
      />
      <Route
        path="/contacts"
        element={<Contacts />}
      />
      <Route
        path="/commitments"
        element={<Commitments />}
      />
      <Route
        path="/forms"
        element={
          <PageLayout title="Safe Forms Templates">
            <FormsList />
          </PageLayout>
        }
      />
      <Route
        path="/forms/:templateId"
        element={
          <PageLayout title="Form Template">
            <FormTemplate />
          </PageLayout>
        }
      />
      <Route
        path="/commercial-market"
        element={
          <PageLayout title="Commercial Market">
            <CommercialMarket />
          </PageLayout>
        }
      />
      <Route
        path="/asset-marketplace"
        element={
          <PageLayout title="Asset Marketplace">
            <PortfolioWalletPage />
          </PageLayout>
        }
      />
      <Route path="/test/navigation" element={<SideNavigationTest />} />
      <Route path="/calendar-integration" element={<CalendarIntegration />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default LoadableRouter;
