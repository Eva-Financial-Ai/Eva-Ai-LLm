import React from 'react';

export type AssetClassType =
  | 'cash_equivalents'
  | 'commercial_paper'
  | 'government_bonds'
  | 'corporate_bonds'
  | 'equities'
  | 'mutual_funds'
  | 'real_estate'
  | 'commodities'
  | 'crypto'
  | 'derivatives'
  | 'private_equity'
  | 'forex'
  | 'equipment'
  | 'vehicles'
  | 'unsecured_debt'
  | 'intellectual_property'
  | 'digital_assets'
  | 'other';

export interface AssetClass {
  id: AssetClassType;
  name: string;
  description: string;
  icon: React.ReactNode;
  depreciationType: string;
  appreciationPotential: string;
  blockchainEnabled: boolean;
  dataFields: string[];
}

export const ASSET_CLASSES: AssetClass[] = [
  {
    id: 'cash_equivalents',
    name: 'Cash & Cash Equivalents',
    description:
      'Highly liquid assets including cash, checking accounts, savings accounts, money market accounts, and short-term CDs.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    depreciationType: 'Not applicable',
    appreciationPotential: 'Generally stable; interest-bearing accounts may generate income',
    blockchainEnabled: true,
    dataFields: ['Account Type', 'Institution', 'Interest Rate', 'Liquidity', 'FDIC Insured'],
  },
  {
    id: 'commercial_paper',
    name: 'Commercial Paper (Secured)',
    description: 'Short-term debt instruments issued by corporations and backed by collateral.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    depreciationType: 'Not applicable; short-term financial instruments',
    appreciationPotential: 'Held at face value; appreciation not typical',
    blockchainEnabled: true,
    dataFields: ['Issuer', 'Maturity Date', 'Interest Rate', 'Collateral Type', 'Credit Rating'],
  },
  {
    id: 'government_bonds',
    name: 'Government Bonds',
    description:
      'Debt securities issued by government entities at federal, state, or municipal levels.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
        />
      </svg>
    ),
    depreciationType: 'Not applicable; subject to market fluctuations',
    appreciationPotential: 'May appreciate if interest rates decline',
    blockchainEnabled: true,
    dataFields: ['Government Level', 'Maturity Date', 'Coupon Rate', 'Tax Status', 'Credit Rating'],
  },
  {
    id: 'corporate_bonds',
    name: 'Corporate Bonds',
    description: 'Debt securities issued by corporations to raise capital.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    depreciationType: 'Not depreciated; market value may decrease with creditworthiness',
    appreciationPotential: 'Potential if credit rating improves or interest rates fall',
    blockchainEnabled: true,
    dataFields: ['Issuer', 'Credit Rating', 'Maturity Date', 'Coupon Rate', 'Callable Provisions'],
  },
  {
    id: 'equities',
    name: 'Equities (Stocks & Shares)',
    description: 'Ownership shares in public and private companies.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    depreciationType: 'Not applicable; values may decline with market conditions',
    appreciationPotential: 'Significant potential based on company performance',
    blockchainEnabled: true,
    dataFields: ['Company', 'Ticker Symbol', 'Sector', 'Share Class', 'Dividend Yield'],
  },
  {
    id: 'mutual_funds',
    name: 'Mutual Funds / ETFs',
    description: 'Pooled investment vehicles that invest in various securities.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    depreciationType: 'Not directly applicable; values can decrease with underlying assets',
    appreciationPotential: 'Dependent on fund holdings performance',
    blockchainEnabled: true,
    dataFields: ['Fund Type', 'Fund Manager', 'NAV', 'Expense Ratio', 'Asset Allocation'],
  },
  {
    id: 'real_estate',
    name: 'Real Estate (REITs & Property)',
    description: 'Physical property and real estate investment trusts.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    depreciationType:
      'REITs: Corporate level; Property: 27.5 years residential, 39 years commercial',
    appreciationPotential: 'Market conditions, location, improvements can increase value',
    blockchainEnabled: true,
    dataFields: ['Property Type', 'Location', 'Square Footage', 'Occupancy Rate', 'NOI'],
  },
  {
    id: 'commodities',
    name: 'Commodities (Gold, Oil, Materials)',
    description: 'Raw materials and primary agricultural products.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    depreciationType: 'Not applicable; prices fluctuate',
    appreciationPotential: 'Based on supply-demand dynamics',
    blockchainEnabled: true,
    dataFields: ['Commodity Type', 'Quantity', 'Storage Location', 'Grade/Quality', 'Market Price'],
  },
  {
    id: 'crypto',
    name: 'Crypto & Blockchain Assets',
    description: 'Digital currencies and blockchain-based assets.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    depreciationType:
      'Not subject to traditional depreciation; values may decrease with volatility',
    appreciationPotential: 'Significant potential with market adoption',
    blockchainEnabled: true,
    dataFields: [
      'Coin/Token',
      'Blockchain',
      'Wallet Address',
      'Acquisition Cost',
      'Staking Status',
    ],
  },
  {
    id: 'derivatives',
    name: 'Derivatives (Futures, Options, Swaps)',
    description: 'Financial contracts deriving value from underlying assets.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>
    ),
    depreciationType: 'Not applicable; value loss based on underlying asset',
    appreciationPotential: 'Depends on underlying asset movement',
    blockchainEnabled: true,
    dataFields: [
      'Derivative Type',
      'Underlying Asset',
      'Strike Price',
      'Expiration Date',
      'Counterparty',
    ],
  },
  {
    id: 'private_equity',
    name: 'Private Equity / Venture Capital',
    description: 'Investments in private companies not publicly traded.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    depreciationType: 'May be written down if portfolio companies underperform',
    appreciationPotential: 'High potential if portfolio companies succeed',
    blockchainEnabled: true,
    dataFields: [
      'Investment Stage',
      'Portfolio Company',
      'Ownership Stake',
      'Valuation',
      'Investment Date',
    ],
  },
  {
    id: 'forex',
    name: 'Forex (Foreign Exchange)',
    description: 'Currencies and foreign exchange holdings.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
        />
      </svg>
    ),
    depreciationType: 'Can depreciate due to economic factors',
    appreciationPotential: 'Based on economic strength and market conditions',
    blockchainEnabled: true,
    dataFields: ['Currency Pair', 'Exchange Rate', 'Holding Amount', 'Acquisition Date', 'Purpose'],
  },
  {
    id: 'equipment',
    name: 'Equipment & Machinery',
    description: 'Business equipment, industrial machinery, and production assets.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    depreciationType: '5-7 years under MACRS',
    appreciationPotential: 'Uncommon; typically loses value',
    blockchainEnabled: true,
    dataFields: [
      'Equipment Type',
      'Manufacturer',
      'Purchase Date',
      'Serial Number',
      'Maintenance Schedule',
    ],
  },
  {
    id: 'vehicles',
    name: 'Motor Vehicles & Aircraft',
    description: 'Cars, trucks, aircraft, and other transportation equipment.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    depreciationType: 'Vehicles: 5 years; Aircraft: 7 years',
    appreciationPotential: 'Rare; classic vehicles may appreciate',
    blockchainEnabled: true,
    dataFields: ['Vehicle Type', 'Make/Model', 'Year', 'VIN/Serial Number', 'Mileage/Hours'],
  },
  {
    id: 'unsecured_debt',
    name: 'Unsecured Commercial Paper',
    description: 'Non-collateralized debt holdings and instruments.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    depreciationType: 'Not applicable; held at face value',
    appreciationPotential: 'Uncommon; fluctuates with market conditions',
    blockchainEnabled: true,
    dataFields: ['Issuer', 'Credit Rating', 'Maturity Date', 'Interest Rate', 'Issue Date'],
  },
  {
    id: 'intellectual_property',
    name: 'Patents, Trademarks, & IP',
    description: 'Intellectual property rights and assets.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    depreciationType: 'Amortized over legal or useful life',
    appreciationPotential: 'Can appreciate if IP gains market value',
    blockchainEnabled: true,
    dataFields: ['IP Type', 'Registration Number', 'Filing Date', 'Expiration Date', 'Territory'],
  },
  {
    id: 'digital_assets',
    name: 'Digital Assets (Non-Crypto)',
    description: 'Media, podcasts, SaaS licenses, and other digital assets.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
    depreciationType: 'Amortized over 3-5 years',
    appreciationPotential: 'Possible if content gains popularity',
    blockchainEnabled: true,
    dataFields: ['Asset Type', 'Platform', 'Creator', 'Acquisition Date', 'License Terms'],
  },
  {
    id: 'other',
    name: 'Other Asset Types',
    description: 'Miscellaneous and specialized asset types.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    depreciationType: 'Varies by asset type',
    appreciationPotential: 'Varies by asset type',
    blockchainEnabled: true,
    dataFields: [
      'Asset Type',
      'Description',
      'Acquisition Date',
      'Estimated Value',
      'Custom Fields',
    ],
  },
];

interface AssetClassificationProps {
  selectedClass?: AssetClassType;
  onSelectClass: (assetClass: AssetClassType) => void;
}

const AssetClassification: React.FC<AssetClassificationProps> = ({
  selectedClass,
  onSelectClass,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Classification</h3>
      <p className="text-sm text-gray-500 mb-6">
        Select the appropriate asset class to ensure proper classification, data structure, and
        regulatory compliance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ASSET_CLASSES.map(assetClass => (
          <div
            key={assetClass.id}
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              selectedClass === assetClass.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectClass(assetClass.id)}
          >
            <div className="flex items-center mb-2">
              <div
                className={`p-2 rounded-full mr-3 ${
                  selectedClass === assetClass.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {assetClass.icon}
              </div>
              <h4 className="font-medium text-gray-900">{assetClass.name}</h4>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2">{assetClass.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetClassification;
