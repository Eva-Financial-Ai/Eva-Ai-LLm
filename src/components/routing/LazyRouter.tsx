import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    <p className="ml-3 text-primary-600">Loading...</p>
  </div>
);

// Define RouteConfig interface
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  isProtected?: boolean;
}

// Lazily loaded components
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const Borrowers = lazy(() => import('../../pages/Borrowers'));
const Lenders = lazy(() => import('../../pages/Lenders'));
const Security = lazy(() => import('../../pages/Security'));
const TransactionExecution = lazy(() => import('../../pages/TransactionExecution'));
const TransactionExecutionPage = lazy(() => import('../../pages/TransactionExecutionPage'));
const ProfileSettings = lazy(() => import('../../pages/ProfileSettings'));
const TransactionExplorer = lazy(() => import('../../pages/TransactionExplorer'));
const Contacts = lazy(() => import('../../pages/Contacts'));
const Commitments = lazy(() => import('../../pages/Commitments'));
const Login = lazy(() => import('../../pages/Login'));
const Documents = lazy(() => import('../../pages/Documents'));
const DealStructuring = lazy(() => import('../../pages/DealStructuring'));
const CreditApplication = lazy(() => import('../../pages/CreditApplicationPage'));
const AutoOriginationsPage = lazy(() => import('../../pages/AutoOriginationsPage'));
const CustomerRetention = lazy(() => import('../../pages/CustomerRetention'));
const RiskAssessment = lazy(() => import('../../pages/RiskAssessment'));
const ShieldVault = lazy(() => import('../../pages/ShieldVault'));
const FormsList = lazy(() => import('../../pages/FormsList'));
const FormTemplate = lazy(() => import('../../pages/FormTemplate'));
const PortfolioWallet = lazy(() => import('../../pages/PortfolioWallet'));
const AssetPress = lazy(() => import('../../pages/AssetPress'));
const EnhancedAssetPress = lazy(() => import('../../pages/EnhancedAssetPress'));
const CommercialMarket = lazy(() => import('../../pages/CommercialMarket'));
const Transactions = lazy(() => import('../../pages/Transactions'));
const SmartMatchPage = lazy(() => import('../../pages/SmartMatchPage'));

// Define routes
const routes: RouteConfig[] = [
  { path: '/', component: Dashboard, isProtected: true },
  { path: '/dashboard', component: Dashboard, isProtected: true },
  { path: '/borrowers', component: Borrowers, isProtected: true },
  { path: '/lenders', component: Lenders, isProtected: true },
  { path: '/security', component: Security, isProtected: true },
  { path: '/transaction-execution', component: TransactionExecution, isProtected: true },
  {
    path: '/transactions/:transactionId/execute',
    component: TransactionExecutionPage,
    isProtected: true,
  },
  { path: '/profile-settings', component: ProfileSettings, isProtected: true },
  { path: '/transaction-explorer', component: TransactionExplorer, isProtected: true },
  { path: '/contacts', component: Contacts, isProtected: true },
  { path: '/commitments', component: Commitments, isProtected: true },
  { path: '/login', component: Login, isProtected: false },

  // Credit Application routes
  { path: '/credit-application', component: CreditApplication, isProtected: true },
  { path: '/auto-originations', component: AutoOriginationsPage, isProtected: true },

  // Customer Retention
  { path: '/customer-retention', component: CustomerRetention, isProtected: true },

  // Filelock Drive routes
  { path: '/documents', component: Documents, isProtected: true },
  { path: '/shield-vault', component: ShieldVault, isProtected: true },
  { path: '/forms', component: FormsList, isProtected: true },
  { path: '/forms/:templateId', component: FormTemplate, isProtected: true },

  // Risk Map Navigator routes
  { path: '/risk-assessment', component: RiskAssessment, isProtected: true },
  { path: '/risk-assessment/standard', component: RiskAssessment, isProtected: true },
  { path: '/risk-assessment/report', component: RiskAssessment, isProtected: true },
  { path: '/risk-assessment/lab', component: RiskAssessment, isProtected: true },
  { path: '/risk-assessment/score', component: RiskAssessment, isProtected: true },

  // Deal Structuring routes
  { path: '/deal-structuring', component: DealStructuring, isProtected: true },
  { path: '/deal-structuring/editor', component: DealStructuring, isProtected: true },
  { path: '/deal-structuring/smart-match', component: SmartMatchPage, isProtected: true },
  { path: '/transactions', component: Transactions, isProtected: true },

  // Asset Press
  { path: '/asset-press', component: AssetPress, isProtected: true },
  { path: '/enhanced-asset-press', component: EnhancedAssetPress, isProtected: true },

  // Portfolio Navigator
  { path: '/portfolio-wallet', component: PortfolioWallet, isProtected: true },
  { path: '/asset-portfolio', component: PortfolioWallet, isProtected: true },

  // Commercial Market
  { path: '/commercial-market', component: CommercialMarket, isProtected: true },
];

const LazyRouter: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routes.map(route => {
          const Component = route.component;

          return route.isProtected ? (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              }
            />
          ) : (
            <Route key={route.path} path={route.path} element={<Component />} />
          );
        })}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default LazyRouter;
