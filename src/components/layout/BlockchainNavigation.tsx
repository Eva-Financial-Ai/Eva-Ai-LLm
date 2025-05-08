import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Icons
const AssetPressIcon = () => (
  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const CommercialPaperIcon = () => (
  <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

interface BlockchainNavigationProps {
  userId: string;
  organizationId: string;
}

const BlockchainNavigation: React.FC<BlockchainNavigationProps> = ({ userId, organizationId }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState<string>(location.pathname);
  
  const navigationItems = [
    {
      name: 'Asset Press',
      description: 'Tokenize your assets on the blockchain',
      href: '/asset-press',
      icon: AssetPressIcon,
      status: 'complete',
    },
    {
      name: 'Portfolio Wallet',
      description: 'Manage your tokenized assets and debt instruments',
      href: '/portfolio-wallet',
      icon: PortfolioIcon,
      status: 'complete',
    },
    {
      name: 'Commercial Paper Market Place',
      description: 'Buy and sell tokenized assets securely',
      href: '/commercial-paper',
      icon: CommercialPaperIcon,
      status: 'complete',
    },
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Blockchain Financial Infrastructure
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Secure, immutable, and transparent financial records using blockchain technology
        </p>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <Link 
              to={item.href} 
              onClick={() => setActivePath(item.href)}
              className={`block hover:bg-gray-50 ${activePath === item.href ? 'bg-gray-50' : ''}`}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-primary-600">
                      <item.icon />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div>
                    {item.status === 'coming' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Coming Soon
                      </span>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              All records secured by blockchain technology
            </p>
            <p className="text-xs text-gray-500">
              Immutable, verifiable, and instantly accessible
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainNavigation; 