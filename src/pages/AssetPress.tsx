import React, { useState } from 'react';

const AssetPress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'borrowers' | 'brokers' | 'lenders' | 'assets' | 'debtInstruments' | 'portfolioItems' | 'portfolioOptimizer'
  >('borrowers');

  // Mock data for each category
  const mockData = {
    borrowers: [
      { id: 'b1', name: 'Acme Corporation', creditScore: 'A+', industry: 'Manufacturing', yearsFounded: 15 },
      { id: 'b2', name: 'TechSolutions Inc', creditScore: 'A', industry: 'Technology', yearsFounded: 8 },
      { id: 'b3', name: 'Global Logistics', creditScore: 'B+', industry: 'Transportation', yearsFounded: 22 }
    ],
    brokers: [
      { id: 'br1', name: 'Premier Finance Partners', deals: 156, rating: 4.8, specialty: 'Equipment Financing' },
      { id: 'br2', name: 'CommLease Advisors', deals: 98, rating: 4.6, specialty: 'Commercial Real Estate' },
      { id: 'br3', name: 'Industrial Funding Group', deals: 120, rating: 4.7, specialty: 'Manufacturing Equipment' }
    ],
    lenders: [
      { id: 'l1', name: 'First National Bank', category: 'Bank', rateRange: '4.5-7.2%', minDeal: '$250,000' },
      { id: 'l2', name: 'Equipment Capital Corp', category: 'Specialty Finance', rateRange: '6.0-9.5%', minDeal: '$100,000' },
      { id: 'l3', name: 'Regional Credit Union', category: 'Credit Union', rateRange: '4.8-8.0%', minDeal: '$50,000' }
    ],
    assets: [
      { id: 'a1', name: 'CNC Machine - Model X5', category: 'Manufacturing', value: '$450,000', age: 'New' },
      { id: 'a2', name: '2023 Freight Truck Fleet', category: 'Transportation', value: '$1,850,000', age: 'New' },
      { id: 'a3', name: 'Commercial Property - Downtown', category: 'Real Estate', value: '$3,200,000', age: '12 years' }
    ],
    debtInstruments: [
      { id: 'd1', name: 'Term Loan - 5yr', type: 'Term Loan', rate: '5.2%', term: '60 months' },
      { id: 'd2', name: 'Equipment Lease', type: 'Finance Lease', rate: '6.5%', term: '48 months' },
      { id: 'd3', name: 'Commercial Mortgage', type: 'Mortgage', rate: '4.8%', term: '180 months' }
    ],
    portfolioItems: [
      { id: 'p1', name: 'Manufacturing Equipment Bundle', value: '$2.5M', performance: 'Strong', risk: 'Low' },
      { id: 'p2', name: 'Mixed Use Real Estate', value: '$5.2M', performance: 'Moderate', risk: 'Medium' },
      { id: 'p3', name: 'Transportation Fleet', value: '$3.1M', performance: 'Strong', risk: 'Low-Medium' }
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'borrowers':
        return (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Borrower Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Credit Score</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Industry</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Years in Business</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.borrowers.map((borrower) => (
                  <tr key={borrower.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{borrower.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{borrower.creditScore}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{borrower.industry}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{borrower.yearsFounded}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View<span className="sr-only">, {borrower.name}</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'brokers':
        return (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Broker Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Deals Closed</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Specialty</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.brokers.map((broker) => (
                  <tr key={broker.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{broker.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{broker.deals}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{broker.rating}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{broker.specialty}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View<span className="sr-only">, {broker.name}</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'lenders':
        return (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Lender Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate Range</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Minimum Deal</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.lenders.map((lender) => (
                  <tr key={lender.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{lender.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lender.category}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lender.rateRange}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{lender.minDeal}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View<span className="sr-only">, {lender.name}</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'assets':
        return (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Asset Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age/Condition</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{asset.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{asset.category}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{asset.value}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{asset.age}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View<span className="sr-only">, {asset.name}</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'debtInstruments':
        return (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Instrument Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rate</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Term</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.debtInstruments.map((instrument) => (
                  <tr key={instrument.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{instrument.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{instrument.type}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{instrument.rate}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{instrument.term}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View<span className="sr-only">, {instrument.name}</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'portfolioItems':
        return (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Portfolio Item</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Performance</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Risk Level</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockData.portfolioItems.map((item) => (
                  <tr key={item.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.value}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.performance}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.risk}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">View<span className="sr-only">, {item.name}</span></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'portfolioOptimizer':
        return (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Optimizer</h2>
              <p className="text-gray-600">Analyze and optimize your commercial lending portfolio for maximum return with balanced risk.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Portfolio Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Assets:</span>
                    <span className="font-medium">$10.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average ROI:</span>
                    <span className="font-medium">7.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Factor:</span>
                    <span className="font-medium">Medium-Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diversification:</span>
                    <span className="font-medium">4.7/5.0</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Risk Analysis</h3>
                <div className="h-40 flex items-center justify-center bg-white rounded border border-gray-200 p-2">
                  <p className="text-gray-500 text-sm">Risk distribution chart will appear here</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Optimization Targets</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Target ROI</label>
                    <input 
                      type="range" 
                      min="5" 
                      max="15" 
                      value="8"
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Lower Risk</span>
                      <span>Higher Return</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Diversification</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value="7"
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Focused</span>
                      <span>Diverse</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Optimization Recommendations</h3>
              <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700">
                Generate New Recommendations
              </button>
            </div>
            
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Recommendation</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Impact</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">ROI Change</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Risk Change</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">Increase manufacturing equipment allocation by 5%</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">High</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">+0.3%</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-orange-600">+0.1</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">Apply</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">Reduce exposure to retail properties by 7%</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Medium</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-red-600">-0.2%</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">-0.4</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">Apply</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">Diversify into medical equipment sector</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">High</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">+0.5%</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-orange-600">+0.2</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href="#" className="text-primary-600 hover:text-primary-900">Apply</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Asset Press</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and optimize your commercial lending assets and portfolios
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('borrowers')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'borrowers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Verified Borrowers
            </button>
            <button
              onClick={() => setActiveTab('brokers')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'brokers'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Brokers
            </button>
            <button
              onClick={() => setActiveTab('lenders')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'lenders'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lenders
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'assets'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assets
            </button>
          </nav>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('debtInstruments')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'debtInstruments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Debt Instruments
            </button>
            <button
              onClick={() => setActiveTab('portfolioItems')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'portfolioItems'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Portfolio Items
            </button>
            <button
              onClick={() => setActiveTab('portfolioOptimizer')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'portfolioOptimizer'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Portfolio Optimizer
            </button>
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AssetPress; 