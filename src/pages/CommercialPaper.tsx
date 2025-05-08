import React from 'react';

const CommercialPaper: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Commercial Paper Market Place</h1>
        <p className="text-gray-600">Buy and sell tokenized assets securely on the blockchain</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Market Overview</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                <option>Latest</option>
                <option>Value: High to Low</option>
                <option>Value: Low to High</option>
                <option>Rate: High to Low</option>
                <option>Rate: Low to High</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        MF
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">MegaFinance Corp</div>
                        <div className="text-sm text-gray-500">A-Rated</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Term Note</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$500,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.2%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">180 days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        ET
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">EcoTech Industries</div>
                        <div className="text-sm text-gray-500">B-Rated</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Commercial Paper</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$750,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5.1%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90 days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        GF
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Global Freight</div>
                        <div className="text-sm text-gray-500">A+-Rated</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Asset-Backed</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,250,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3.8%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">365 days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">View</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        TI
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">TechInnovate</div>
                        <div className="text-sm text-gray-500">B+-Rated</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bond</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4.5%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">730 days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Market Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Total Trading Volume (24h)</span>
                  <span className="text-sm font-medium text-gray-900">$12.5M</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Active Listings</span>
                  <span className="text-sm font-medium text-gray-900">28</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Average Rate</span>
                  <span className="text-sm font-medium text-gray-900">4.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Maturity Range</span>
                  <span className="text-sm font-medium text-gray-900">30-730 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Post New Offering
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                Browse by Industry
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                My Watchlist
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Transaction History
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Market News</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Interest Rate Update</h3>
                <p className="text-sm text-gray-600 mt-1">Federal Reserve signals potential rate adjustments in the coming quarter.</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">New Tokenization Standards</h3>
                <p className="text-sm text-gray-600 mt-1">Industry leaders agree on new tokenization standards for commercial paper.</p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Record Trading Volume</h3>
                <p className="text-sm text-gray-600 mt-1">Last week saw record trading volumes across all digital debt instruments.</p>
                <p className="text-xs text-gray-400 mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialPaper; 