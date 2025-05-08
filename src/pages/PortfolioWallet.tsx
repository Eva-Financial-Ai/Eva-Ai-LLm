import React from 'react';

const PortfolioWallet: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Portfolio Navigator</h1>
        <p className="text-gray-600">Manage your tokenized assets and debt instruments</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="ml-6">
            <h2 className="text-xl font-semibold">Portfolio Summary</h2>
            <p className="text-gray-600">Current total portfolio value: $4,250,000</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Asset Classes</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Real Estate</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Equipment</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Vehicles</span>
                <span className="font-medium">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>IP & Digital</span>
                <span className="font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Recent Performance</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Annual Return</span>
                <span className="font-medium text-green-600">+8.2%</span>
              </div>
              <div className="flex justify-between">
                <span>MTD Change</span>
                <span className="font-medium text-green-600">+1.4%</span>
              </div>
              <div className="flex justify-between">
                <span>YTD Change</span>
                <span className="font-medium text-green-600">+5.3%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Generated Income</span>
                <span className="font-medium">$345,000</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm">
                Add New Asset
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm">
                Manage Tokens
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                Portfolio Analysis
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors text-sm">
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assets Overview</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded p-2 text-sm">
              <option>All Categories</option>
              <option>Real Estate</option>
              <option>Equipment</option>
              <option>Vehicles</option>
              <option>IP & Digital</option>
            </select>
            <select className="border border-gray-300 rounded p-2 text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>For Sale</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Office Building - Downtown</td>
                <td className="px-6 py-4 whitespace-nowrap">Real Estate</td>
                <td className="px-6 py-4 whitespace-nowrap">$1,250,000</td>
                <td className="px-6 py-4 whitespace-nowrap">1,250 BLDG</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">View Details</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Manufacturing Equipment</td>
                <td className="px-6 py-4 whitespace-nowrap">Equipment</td>
                <td className="px-6 py-4 whitespace-nowrap">$875,000</td>
                <td className="px-6 py-4 whitespace-nowrap">875 EQIP</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">View Details</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Delivery Fleet Vehicles</td>
                <td className="px-6 py-4 whitespace-nowrap">Vehicles</td>
                <td className="px-6 py-4 whitespace-nowrap">$625,000</td>
                <td className="px-6 py-4 whitespace-nowrap">625 VHCL</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">For Sale</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">View Details</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Software Patent Bundle</td>
                <td className="px-6 py-4 whitespace-nowrap">IP & Digital</td>
                <td className="px-6 py-4 whitespace-nowrap">$500,000</td>
                <td className="px-6 py-4 whitespace-nowrap">500 PTNT</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-900">View Details</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioWallet; 