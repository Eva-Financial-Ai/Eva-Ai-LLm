import React, { useState, useEffect, Suspense, useCallback, useRef, memo } from 'react';
import useTransactionStore from '../../hooks/useTransactionStore';
import { useRiskConfig, RiskConfigType } from '../../contexts/RiskConfigContext';

type RiskCategory = 'character' | 'capacity' | 'collateral' | 'capital' | 'conditions' | 'credit';
type CreditSectionView = 'all' | 'business' | 'owner';
type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

// Add these types for the credit scoring models
type PersonalCreditModel =
  | 'FICO'
  | 'Vantage2'
  | 'Vantage3'
  | 'Vantage4'
  | 'Vantage5'
  | 'Vantage6'
  | 'Vantage8'
  | 'Vantage9';
type BusinessCreditModel =
  | 'PayNetMasterScore'
  | 'EquifaxCommercialOne'
  | 'EquifaxDelinquency'
  | 'EquifaxBusinessFailure'
  | 'ExperianIntelliScore'
  | 'LexisNexisBusinessID';

// Add the type definition at the top
type CategoryType = 'credit' | 'character' | 'capacity' | 'collateral' | 'capital' | 'conditions';

interface RiskMapEvaReportProps {
  transactionId?: string;
  creditSectionView?: CreditSectionView;
  riskMapType?: RiskMapType;
}

interface RiskScore {
  business: number;
  owner: number;
  total: number;
}

interface RatioData {
  name: string;
  value: number | string;
  benchmark: string;
  status: 'good' | 'warning' | 'danger' | 'neutral';
}

// Add these near the top with other interfaces
interface Owner {
  id: string;
  name: string;
  title: string;
  creditScore: {
    score: number;
    max: number;
    rating: string;
    lastUpdated: string;
    agency: 'equifax' | 'experian' | 'transunion';
  };
}

// Loading skeleton component
const RiskMapLoadingSkeleton = () => (
  <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
    <div className="h-12 bg-gray-200 border-b border-gray-200"></div>
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 w-48 rounded-md"></div>
        <div className="h-6 bg-gray-200 w-24 rounded-full"></div>
      </div>
      <div className="h-16 bg-gray-200 w-full rounded-md"></div>
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="h-6 bg-gray-200 w-36 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-40 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-36 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-24 rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="h-6 bg-gray-200 w-40 rounded-md mb-4"></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 w-40 rounded-md"></div>
              <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Category loading skeleton component - smaller for tab-specific loading
const CategoryLoadingSkeleton = () => (
  <div className="animate-pulse mt-4">
    <div className="h-6 bg-gray-200 w-48 rounded-md mb-6"></div>
    <div className="space-y-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="h-6 bg-gray-200 w-36 rounded-md mb-4"></div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 w-32 rounded-md"></div>
            <div className="h-4 bg-gray-200 w-20 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 w-40 rounded-md"></div>
            <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Error state component
const RiskMapError = ({ message }: { message: string }) => (
  <div className="bg-white shadow rounded-lg p-6 text-center">
    <div className="text-risk-red mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p className="text-gray-700">{message}</p>
  </div>
);

// Extract the business credit score gauge into a memoized component
const BusinessCreditGauge = memo(({ score, maxScore, rating, lastUpdated }: {
  score: number;
  maxScore: number;
  rating: string;
  lastUpdated: string;
}) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <h5 className="text-sm text-gray-600 mb-2 text-center">Business Credit</h5>

      <div className="flex items-center justify-center mb-2">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
            {/* Progress circle with gradient */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#businessGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${339.292 * (score / maxScore)}, 339.292`}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="businessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">
              {score}
            </span>
            <span className="text-xs text-gray-500">/{maxScore}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {rating}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-600 flex justify-between items-center mb-1">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            style={{
              width: `${(score / maxScore) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
});

// Extract the owner credit score gauge into a memoized component
const OwnerCreditGauge = memo(({ owner, owners, selectedOwner, setSelectedOwner }: {
  owner: Owner;
  owners: Owner[];
  selectedOwner: string;
  setSelectedOwner: (id: string) => void;
}) => {
  const ownerScore = owner.creditScore;

  return (
    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-sm text-gray-600">Owner Credit</h5>
        <select
          className="text-xs border-gray-200 rounded-md py-1"
          value={selectedOwner}
          onChange={e => setSelectedOwner(e.target.value)}
        >
          {owners.map(owner => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.title})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center mb-2">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress circle with gradient */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#ownerGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${339.292 * (ownerScore.score / ownerScore.max)}, 339.292`}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="ownerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">
              {ownerScore.score}
            </span>
            <span className="text-xs text-gray-500">/{ownerScore.max}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {ownerScore.rating}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {owner.name} | Last updated: {ownerScore.lastUpdated}
        </p>
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-600 flex justify-between items-center mb-1">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
            style={{ width: `${(ownerScore.score / ownerScore.max) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});

// Extract the credit score history chart into a memoized component
const CreditScoreHistory = memo(() => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-sm font-medium text-gray-700">Credit Score History</h5>
        <select className="text-xs border-gray-200 rounded-md py-1">
          <option value="6m">Last 6 months</option>
          <option value="1y">Last year</option>
          <option value="2y">Last 2 years</option>
        </select>
      </div>

      <div className="h-40 w-full">
        <div className="w-full h-full flex items-end justify-between px-2">
          {/* Sample chart bars for business score history */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-4 bg-blue-500 rounded-t-sm"></div>
            <div className="mt-1 text-xs text-gray-500">Jan</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-24 w-4 bg-blue-500 rounded-t-sm"></div>
            <div className="mt-1 text-xs text-gray-500">Feb</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-28 w-4 bg-blue-500 rounded-t-sm"></div>
            <div className="mt-1 text-xs text-gray-500">Mar</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-20 w-4 bg-blue-500 rounded-t-sm"></div>
            <div className="mt-1 text-xs text-gray-500">Apr</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-24 w-4 bg-blue-500 rounded-t-sm"></div>
            <div className="mt-1 text-xs text-gray-500">May</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-32 w-4 bg-blue-500 rounded-t-sm"></div>
            <div className="mt-1 text-xs text-gray-500">Jun</div>
          </div>

          {/* Sample overlay bars for personal credit */}
          <div className="flex flex-col items-center absolute left-[calc(16.666%+40px)]">
            <div className="h-20 w-4 bg-purple-500 rounded-t-sm"></div>
          </div>
          <div className="flex flex-col items-center absolute left-[calc(33.333%+48px)]">
            <div className="h-24 w-4 bg-purple-500 rounded-t-sm"></div>
          </div>
          <div className="flex flex-col items-center absolute left-[calc(50%+56px)]">
            <div className="h-20 w-4 bg-purple-500 rounded-t-sm"></div>
          </div>
          <div className="flex flex-col items-center absolute left-[calc(66.666%+64px)]">
            <div className="h-24 w-4 bg-purple-500 rounded-t-sm"></div>
          </div>
          <div className="flex flex-col items-center absolute left-[calc(83.333%+72px)]">
            <div className="h-28 w-4 bg-purple-500 rounded-t-sm"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
          <span className="text-xs text-gray-600">Business</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
          <span className="text-xs text-gray-600">Owner</span>
        </div>
      </div>
    </div>
  );
});

// Extract the business credit score analysis into a memoized component
const BusinessCreditAnalysis = memo(({ businessScoreDetails }: {
  businessScoreDetails: {
    score: number;
    max: number;
    rating: string;
    description: string;
    lastUpdated: string;
  }
}) => {
  return (
    <div className="my-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <div className="mr-6">
            <div className="relative w-32 h-32 mx-auto md:mx-0">
              {/* Score gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#businessGradient2)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${339.292 * (businessScoreDetails.score / businessScoreDetails.max)}, 339.292`}
                />

                <defs>
                  <linearGradient id="businessGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {businessScoreDetails.score}
                </span>
                <span className="text-xs text-gray-500">/{businessScoreDetails.max}</span>
              </div>
            </div>
            <div className="mt-2 text-center md:text-left">
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {businessScoreDetails.rating}
              </span>
            </div>
          </div>

          <div className="flex-grow mt-4 md:mt-0">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Business Credit Analysis</h4>
            <p className="text-sm text-gray-600 mb-3">
              This {businessScoreDetails.score} score indicates a{' '}
              {businessScoreDetails.rating.toLowerCase()} business credit profile, representing
              low risk for lenders. The business demonstrates strong payment history and
              appropriate credit utilization.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">98%</div>
                <div className="text-xs text-gray-500">On-Time Payments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">42%</div>
                <div className="text-xs text-gray-500">Credit Utilization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-600">6.3</div>
                <div className="text-xs text-gray-500">Years History</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Extract the Credit View Tabs into a memoized component
const CreditViewTabs = memo(({
  selectedCreditView,
  setSelectedCreditView
}: {
  selectedCreditView: CreditSectionView;
  setSelectedCreditView: (view: CreditSectionView) => void;
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`w-1/3 py-3 px-1 text-center border-b-2 ${
              selectedCreditView === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
            } font-medium text-sm transition-colors duration-200`}
            onClick={() => setSelectedCreditView('all')}
          >
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              All Reports
            </span>
          </button>
          <button
            className={`w-1/3 py-3 px-1 text-center border-b-2 ${
              selectedCreditView === 'business'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
            } font-medium text-sm transition-colors duration-200`}
            onClick={() => setSelectedCreditView('business')}
          >
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Business Credit
            </span>
          </button>
          <button
            className={`w-1/3 py-3 px-1 text-center border-b-2 ${
              selectedCreditView === 'owner'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent hover:text-gray-700 hover:border-gray-300 text-gray-500'
            } font-medium text-sm transition-colors duration-200`}
            onClick={() => setSelectedCreditView('owner')}
          >
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Owner Credit
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
});

// Extract the Owner Credit Report Section into a memoized component
const OwnerCreditReport = memo(({
  selectedCreditView,
  selectedCreditAgency,
  setSelectedCreditAgency,
  showHistoricalReports,
  setShowHistoricalReports
}: {
  selectedCreditView: CreditSectionView;
  selectedCreditAgency: 'all' | 'equifax' | 'experian' | 'transunion';
  setSelectedCreditAgency: (agency: 'all' | 'equifax' | 'experian' | 'transunion') => void;
  showHistoricalReports: boolean;
  setShowHistoricalReports: (show: boolean) => void;
}) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg border ${selectedCreditView === 'owner' ? 'border-purple-300 shadow-md' : 'border-gray-200'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-800 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Owner Credit Report
        </h4>

        {/* Credit agency selector */}
        <div className="flex items-center space-x-3">
          <div>
            <select
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={selectedCreditAgency}
              onChange={e => setSelectedCreditAgency(e.target.value as any)}
            >
              <option value="all">Tri-Merged</option>
              <option value="equifax">Equifax</option>
              <option value="experian">Experian</option>
              <option value="transunion">TransUnion</option>
            </select>
          </div>

          <button
            onClick={() => setShowHistoricalReports(!showHistoricalReports)}
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {showHistoricalReports ? 'Hide History' : 'View History'}
          </button>

          <button
            onClick={() => window.open('/documents?folder=credit-reports', '_blank')}
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Open in Filelock
          </button>
        </div>
      </div>

      {/* Historical reports section */}
      {showHistoricalReports && (
        <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h5 className="font-medium text-gray-700 mb-3">Historical Credit Reports</h5>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Table content would go here */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
});

export const RiskMapEvaReport: React.FC<RiskMapEvaReportProps> = ({
  transactionId,
  creditSectionView,
  riskMapType = 'unsecured',
}) => {
  const {
    currentTransaction,
    loading,
    error: storeError,
    fetchTransactions,
  } = useTransactionStore();
  const { configType, loadConfigForType } = useRiskConfig();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('credit');
  const [selectedCreditView, setSelectedCreditView] = useState<CreditSectionView>('all');
  const [selectedRiskMapType, setSelectedRiskMapType] = useState<RiskMapType>(riskMapType);
  const [selectedCreditAgency, setSelectedCreditAgency] = useState<
    'all' | 'equifax' | 'experian' | 'transunion'
  >('all');
  const [showHistoricalReports, setShowHistoricalReports] = useState(false);
  const [selectedHistoricalReport, setSelectedHistoricalReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref to store timeouts for each category
  const categoryTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  const [categoriesLoading, setCategoriesLoading] = useState<Record<string, boolean>>({
    credit: false,
    capacity: false,
    character: false,
    collateral: false,
    capital: false,
    conditions: false,
  });
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [personalCreditModel, setPersonalCreditModel] = useState<PersonalCreditModel>('FICO');
  const [businessCreditModel, setBusinessCreditModel] =
    useState<BusinessCreditModel>('PayNetMasterScore');
  const [showKYBModal, setShowKYBModal] = useState(false);
  const [kybVerificationStatus, setKybVerificationStatus] = useState<
    'pending' | 'verified' | 'unverified' | null
  >(null);
  const [maxLoadingTime] = useState(5000); // 5 seconds maximum loading time
  const [owners, setOwners] = useState<Owner[]>([
    {
      id: 'owner-1',
      name: 'John Smith',
      title: 'CEO',
      creditScore: {
        score: 755,
        max: 850,
        rating: 'Very Good',
        lastUpdated: '2023-08-15',
        agency: 'equifax',
      },
    },
    {
      id: 'owner-2',
      name: 'Sarah Johnson',
      title: 'CFO',
      creditScore: {
        score: 792,
        max: 850,
        rating: 'Excellent',
        lastUpdated: '2023-07-22',
        agency: 'transunion',
      },
    },
    {
      id: 'owner-3',
      name: 'Michael Chang',
      title: 'CTO',
      creditScore: {
        score: 735,
        max: 850,
        rating: 'Good',
        lastUpdated: '2023-08-05',
        agency: 'experian',
      },
    },
  ]);
  const [selectedOwner, setSelectedOwner] = useState<string>('owner-1');

  // Mock data for tri-merged credit scores
  const creditScores = {
    equifax: {
      score: 765,
      max: 850,
      rating: 'Excellent',
      lastUpdated: '2023-08-15',
    },
    experian: {
      score: 742,
      max: 850,
      rating: 'Good',
      lastUpdated: '2023-08-12',
    },
    transunion: {
      score: 758,
      max: 850,
      rating: 'Very Good',
      lastUpdated: '2023-08-10',
    },
  };

  // Mock historical reports
  const historicalReports = [
    {
      id: 'report-2023-08',
      date: '2023-08-15',
      type: 'Tri-Merged',
      scores: { equifax: 765, experian: 742, transunion: 758 },
      fileUrl: '/reports/credit-2023-08.pdf',
    },
    {
      id: 'report-2023-05',
      date: '2023-05-22',
      type: 'Tri-Merged',
      scores: { equifax: 745, experian: 738, transunion: 752 },
      fileUrl: '/reports/credit-2023-05.pdf',
    },
    {
      id: 'report-2023-02',
      date: '2023-02-10',
      type: 'Tri-Merged',
      scores: { equifax: 722, experian: 715, transunion: 730 },
      fileUrl: '/reports/credit-2023-02.pdf',
    },
    {
      id: 'report-2022-11',
      date: '2022-11-18',
      type: 'Tri-Merged',
      scores: { equifax: 695, experian: 702, transunion: 710 },
      fileUrl: '/reports/credit-2022-11.pdf',
    },
  ];

  // Mock data for personal credit score
  const personalScore = {
    score: 755,
    max: 850,
    rating: 'Very Good',
    description: 'This score ranks highly among other consumers.',
    lastUpdated: '2023-08-15',
  };

  // Mock data for business credit score
  const businessScore = {
    score: 82,
    max: 100,
    rating: 'Low Risk',
    description: 'This business score indicates a low risk of delinquency or default.',
    lastUpdated: '2023-08-10',
  };

  // Effect to update selectedCreditView when creditSectionView prop changes
  useEffect(() => {
    if (creditSectionView) {
      setSelectedCreditView(creditSectionView);
    }
  }, [creditSectionView]);

  // Effect to ensure we start with credit category selected and load it
  useEffect(() => {
    setSelectedCategory('credit');
    // We'll load the credit category when transaction is ready
  }, []);

  // Add a timeout to prevent infinite loading for the initial transaction fetch
  useEffect(() => {
    let initialLoadTimeoutId: NodeJS.Timeout | null = null;

    if (isLoading) { // This isLoading is for the initial transaction fetch
      initialLoadTimeoutId = setTimeout(() => {
        console.log('RiskMapEvaReport: Initial transaction loading timeout reached');
        // Ensure we only set error if still loading and no transaction/error yet
        if (useTransactionStore.getState().loading && !useTransactionStore.getState().currentTransaction && !error) {
          setError('Loading transaction data timed out. Please check your connection or try again.');
        }
        setIsLoading(false); // Stop global loading indicator
      }, maxLoadingTime);
    }

    return () => {
      if (initialLoadTimeoutId) clearTimeout(initialLoadTimeoutId);
    };
  }, [isLoading, maxLoadingTime, error]);

  // Effect to initialize data and handle loading state - optimized
  useEffect(() => {
    const loadData = async () => {
      try {
        // Only set loading if really needed
        if (!currentTransaction && loading) {
          console.log('RiskMapEvaReport: Setting isLoading to true - waiting for transaction from store');
          setIsLoading(true);
        } else if (currentTransaction && isLoading) {
          // If transaction arrived while we were in isLoading state
          setIsLoading(false);
        }

        setError(null);

        // If we still don't have a transaction, try to fetch one
        if (!currentTransaction && !loading) {
          console.log('RiskMapEvaReport: No current transaction, fetching transactions...');
          setIsLoading(true);
          await fetchTransactions();

          // Log what we got after fetching
          console.log(
            'RiskMapEvaReport: Fetched transactions, current transaction:',
            useTransactionStore.getState().currentTransaction
          );
        }

        // After fetching, if we still don't have a transaction, show appropriate message
        if (!currentTransaction && !loading) {
          console.warn('RiskMapEvaReport: No transaction data available after fetch');

          // Check if there are any transactions in risk_assessment stage
          const allTransactions = useTransactionStore.getState().transactions;
          const riskTransaction = allTransactions.find(t => t.currentStage === 'risk_assessment');

          if (riskTransaction) {
            console.log(
              'RiskMapEvaReport: Found a risk_assessment transaction, setting as current:',
              riskTransaction.id
            );
            useTransactionStore.getState().setCurrentTransaction(riskTransaction);
          } else {
            console.error('RiskMapEvaReport: No transactions in risk_assessment stage');
            setError('No transaction found in the risk assessment stage. Please create one first.');
          }
        }

        if (currentTransaction) {
          console.log(
            'RiskMapEvaReport: Current transaction loaded successfully:',
            currentTransaction.id
          );
          console.log('RiskMapEvaReport: Risk profile data:', currentTransaction.riskProfile);
          // Automatically load the 'credit' category data once transaction is available
          if (!loadedCategories.has('credit') && !categoriesLoading.credit) {
            loadCategoryData('credit');
          }
        }
        
        // If loading from store is finished and we still don't have a transaction,
        // and we are not already in an error state from timeout
        if (!loading && !currentTransaction && !error) {
           setIsLoading(false); // Ensure component loading is false if store loading finishes
        }

      } catch (err) {
        console.error('Error loading risk map data:', err);
        setError('Failed to load risk map data. Please try again.');
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentTransaction, loading, fetchTransactions, error]);

  // Add handling for store errors
  useEffect(() => {
    if (storeError) {
      setError(`Transaction store error: ${storeError.message}`);
      setIsLoading(false);
    }
  }, [storeError]);

  // Categories for the risk map report - memoized to avoid re-renders
  const categories = React.useMemo(
    () => [
      { id: 'credit', name: 'Credit Worthiness' },
      { id: 'capacity', name: 'Capacity Analysis' },
      { id: 'character', name: 'Character Assessment' },
      { id: 'collateral', name: 'Collateral Evaluation' },
      { id: 'capital', name: 'Capital Structure' },
      { id: 'conditions', name: 'Market Conditions' },
    ],
    []
  );

  // Function to load data for a specific category
  const loadCategoryData = useCallback((category: string) => {
    // If this category is already loaded or currently loading, don't reload it
    if (loadedCategories.has(category) || categoriesLoading[category]) {
      console.log(`RiskMapEvaReport: Category ${category} already loaded or loading, skipping`);
      return;
    }

    console.log(`RiskMapEvaReport: Initiating load for category ${category}`);

    // Set loading state for this specific category
    setCategoriesLoading(prev => ({
      ...prev,
      [category]: true,
    }));

    // Clear any existing timeout for this category to prevent conflicts
    if (categoryTimeoutsRef.current[category]) {
      clearTimeout(categoryTimeoutsRef.current[category]);
    }

    // Simulate an API call with a slight delay
    categoryTimeoutsRef.current[category] = setTimeout(() => {
      console.log(`RiskMapEvaReport: Mock API call finished for category ${category}`);
      // Mark this category as loaded
      setLoadedCategories(prev => new Set(Array.from(prev).concat([category])));

      // Clear loading state for this category
      setCategoriesLoading(prev => ({
        ...prev,
        [category]: false,
      }));
      
      delete categoryTimeoutsRef.current[category]; // Clean up the stored timeout ID
      console.log(`RiskMapEvaReport: Finished loading data for category ${category}`);
    }, 600);
  }, [categoriesLoading, loadedCategories]);

  // Handle category selection with lazy loading
  const handleCategorySelect = useCallback((category: string) => {
    console.log(`RiskMapEvaReport: Selecting category: ${category}`);
    setSelectedCategory(category as CategoryType);

    // Load data for this category if it hasn't been loaded yet and isn't already loading
    if (!loadedCategories.has(category) && !categoriesLoading[category]) {
      loadCategoryData(category);
    }
  }, [loadCategoryData, loadedCategories, categoriesLoading]);

  // Cleanup timeouts on component unmount
  useEffect(() => {
    return () => {
      console.log("RiskMapEvaReport: Unmounting, clearing all category timeouts.");
      Object.values(categoryTimeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  // Direct reference to credit section handling for easier access
  const showCreditSection = selectedCategory === 'credit';

  // Get the score based on selected credit model
  const getPersonalCreditScore = (model: PersonalCreditModel) => {
    // In a real application, this would fetch based on the model selected
    switch (model) {
      case 'FICO':
        return {
          score: 755,
          max: 850,
          rating: 'Very Good',
          description: 'This score ranks highly among other consumers.',
          lastUpdated: '2023-08-15',
        };
      case 'Vantage3':
        return {
          score: 782,
          max: 850,
          rating: 'Excellent',
          description: 'This is among the top 20% of consumers.',
          lastUpdated: '2023-08-12',
        };
      default:
        return {
          score: 755,
          max: 850,
          rating: 'Very Good',
          description: 'This score ranks highly among other consumers.',
          lastUpdated: '2023-08-15',
        };
    }
  };

  // Get the score based on selected business credit model
  const getBusinessCreditScore = (model: BusinessCreditModel) => {
    // In a real application, this would fetch based on the model selected
    switch (model) {
      case 'PayNetMasterScore':
        return {
          score: 82,
          max: 100,
          rating: 'Low Risk',
          description: 'This business score indicates a low risk of delinquency or default.',
          lastUpdated: '2023-08-10',
        };
      case 'ExperianIntelliScore':
        return {
          score: 92,
          max: 100,
          rating: 'Very Low Risk',
          description: 'This score indicates minimal risk.',
          lastUpdated: '2023-08-05',
        };
      default:
        return {
          score: 82,
          max: 100,
          rating: 'Low Risk',
          description: 'This business score indicates a low risk of delinquency or default.',
          lastUpdated: '2023-08-10',
        };
    }
  };

  // KYB Request handler
  const handleKYBRequest = () => {
    setShowKYBModal(true);
  };

  // KYB Verification handler
  const verifyKYBOnChain = () => {
    // In a real application, this would verify the data on a private blockchain
    setKybVerificationStatus('verified');
    setShowKYBModal(false);
  };

  // Format the model name for display
  const formatModelName = (model: string) => {
    if (model.startsWith('Vantage')) {
      return `VantageScore ${model.replace('Vantage', '')}`;
    }

    switch (model) {
      case 'PayNetMasterScore':
        return 'PayNet MasterScore';
      case 'EquifaxCommercialOne':
        return 'Equifax Commercial One';
      case 'EquifaxDelinquency':
        return 'Equifax Delinquency Score';
      case 'EquifaxBusinessFailure':
        return 'Equifax Business Failure';
      case 'ExperianIntelliScore':
        return 'Experian IntelliScore';
      case 'LexisNexisBusinessID':
        return 'LexisNexis Business InstantID';
      default:
        return model;
    }
  };

  // Get the current credit score details
  const personalScoreDetails = getPersonalCreditScore(personalCreditModel);
  const businessScoreDetails = getBusinessCreditScore(businessCreditModel);

  // Update risk map type based on the risk map type - optimize to only load for current type
  useEffect(() => {
    if (riskMapType) {
      console.log(`[RiskMapEvaReport] Setting risk map type to: ${riskMapType}`);
      setSelectedRiskMapType(riskMapType);
      
      // Reset loaded categories when risk map type changes to ensure fresh data
      setLoadedCategories(new Set());
      setCategoriesLoading({
        credit: false,
        capacity: false,
        character: false,
        collateral: false,
        capital: false,
        conditions: false,
      });
    }
  }, [riskMapType]);

  // Update risk config type based on the risk map type - optimize to only load for current type
  useEffect(() => {
    // Map the riskMapType to a RiskConfigType
    let newConfigType: RiskConfigType = 'general';

    if (riskMapType === 'equipment') {
      newConfigType = 'equipment_vehicles';
    } else if (riskMapType === 'realestate') {
      newConfigType = 'real_estate';
    }

    // Only load the config if it's different and we don't have it loaded already
    if (newConfigType !== configType) {
      console.log(`[RiskMapEvaReport] Loading risk config for type: ${newConfigType}`);
      loadConfigForType(newConfigType);
    } else {
      console.log(`[RiskMapEvaReport] Using existing risk config for type: ${newConfigType}`);
    }
  }, [riskMapType, configType, loadConfigForType]);

  // Modified render for the credit section to include risk map type-specific content
  const renderCreditSection = () => {
    if (selectedCategory !== 'credit') return null;

    return (
      <div className="space-y-6">
        {/* Risk Type Specific Header */}
        {selectedRiskMapType === 'unsecured' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">Unsecured Commercial Paper Report</h4>
            <p className="text-sm text-blue-600">
              This report analyzes creditworthiness for unsecured commercial paper and general
              credit applications.
            </p>
          </div>
        )}

        {selectedRiskMapType === 'equipment' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
            <h4 className="font-medium text-green-800 mb-2">Commercial Equipment Report</h4>
            <p className="text-sm text-green-600">
              This report evaluates risk factors for equipment, vehicles, machines, and technology
              assets.
            </p>
          </div>
        )}

        {selectedRiskMapType === 'realestate' && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-6">
            <h4 className="font-medium text-amber-800 mb-2">Commercial Real Estate Report</h4>
            <p className="text-sm text-amber-600">
              This report assesses real estate valuation, market conditions, and property-specific
              risk factors.
            </p>
          </div>
        )}

        {/* Credit Score Summary - Enhanced Version */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h4 className="font-medium text-gray-800 mb-4 text-center">Credit Score Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Credit Score - Enhanced Gauge */}
            <BusinessCreditGauge 
              score={businessScoreDetails.score}
              maxScore={businessScoreDetails.max}
              rating={businessScoreDetails.rating}
              lastUpdated={businessScoreDetails.lastUpdated}
            />

            {/* Owner Credit Score - Enhanced Gauge with Owner Selector */}
            {(() => {
              const owner = owners.find(o => o.id === selectedOwner) || owners[0];
              return (
                <OwnerCreditGauge 
                  owner={owner}
                  owners={owners}
                  selectedOwner={selectedOwner}
                  setSelectedOwner={setSelectedOwner}
                />
              );
            })()}
          </div>

          {/* Score Timeline Chart */}
          <CreditScoreHistory />
        </div>

        {/* Business credit score visualization */}
        <BusinessCreditAnalysis businessScoreDetails={businessScoreDetails} />

        {/* Credit View Tabs */}
        <CreditViewTabs 
          selectedCreditView={selectedCreditView}
          setSelectedCreditView={setSelectedCreditView}
        />

        {/* Business Credit Report Section */}
        {(selectedCreditView === 'all' || selectedCreditView === 'business') && (
          <div
            className={`bg-white p-4 rounded-lg border ${selectedCreditView === 'business' ? 'border-primary-300 shadow-md' : 'border-gray-200'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Business Credit Report
              </h4>

              {/* Model selector for business credit */}
              <div>
                <select
                  className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  value={businessCreditModel}
                  onChange={e => setBusinessCreditModel(e.target.value as BusinessCreditModel)}
                >
                  <option value="dun">Dun & Bradstreet</option>
                  <option value="experian">Experian Business</option>
                  <option value="equifax">Equifax Business</option>
                </select>
              </div>
            </div>

            {/* Business credit score visualization */}
            <BusinessCreditAnalysis businessScoreDetails={businessScoreDetails} />
          </div>
        )}

        {/* Owner Credit Report Section */}
        {(selectedCreditView === 'all' || selectedCreditView === 'owner') && (
          <OwnerCreditReport
            selectedCreditView={selectedCreditView}
            selectedCreditAgency={selectedCreditAgency}
            setSelectedCreditAgency={setSelectedCreditAgency}
            showHistoricalReports={showHistoricalReports}
            setShowHistoricalReports={setShowHistoricalReports}
          />
        )}
      </div>
    );
  };

  // Add the renderContent function definition
  const renderContent = () => {
    if (isLoading || loading) {
      return <CategoryLoadingSkeleton />;
    }

    if (error) {
      return <RiskMapError message={error} />;
    }

    switch (selectedCategory) {
      case 'credit':
        return renderCreditSection();
      default:
        return (
          <div className="py-12 text-center text-gray-500">
            <p>Data for this category is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`py-4 px-6 text-sm font-medium ${
                selectedCategory === category.id
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
              {categoriesLoading[category.id] && (
                <span className="ml-2 inline-block h-3 w-3 rounded-full bg-primary-200 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

// Export as memo to prevent unnecessary re-renders
export default memo(RiskMapEvaReport);
