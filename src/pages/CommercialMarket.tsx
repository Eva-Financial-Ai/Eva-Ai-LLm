import React, { useEffect, useState } from 'react';
import { useUserType } from '../contexts/UserTypeContext';
import { UserType } from '../types/UserTypes';
import TopNavigation from '../components/layout/TopNavigation';
import { useLocation } from 'react-router-dom';

const CommercialMarket: React.FC = () => {
  const { userType } = useUserType();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'buyer' | 'seller' | 'broker' | 'lender'>('buyer');

  // Set view mode based on URL query parameter or user type
  useEffect(() => {
    // Parse the view from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const viewParam = queryParams.get('view');

    if (
      viewParam === 'seller' ||
      viewParam === 'broker' ||
      viewParam === 'lender' ||
      viewParam === 'buyer'
    ) {
      setViewMode(viewParam);
    } else if (userType === UserType.VENDOR) {
      setViewMode('seller');
    } else if (userType === UserType.BROKERAGE) {
      setViewMode('broker');
    } else if (userType === UserType.LENDER) {
      setViewMode('lender');
    } else {
      // Default to buyer view for business or any other type
      setViewMode('buyer');
    }
  }, [userType, location.search]);

  // Mock equipment data
  const equipment = [
    {
      id: 1,
      name: 'CAT D8 Bulldozer',
      category: 'Heavy Equipment',
      condition: 'Excellent',
      year: 2019,
      price: 380000,
      location: 'Denver, CO',
      image: 'https://via.placeholder.com/300x200?text=Bulldozer',
      seller: 'Rocky Mountain Equipment',
      availability: 'Immediate',
      financingOptions: ['Lease', 'Purchase', 'Lease-to-Own'],
    },
    {
      id: 2,
      name: 'Freightliner Cascadia',
      category: 'Commercial Truck',
      condition: 'Good',
      year: 2020,
      price: 125000,
      location: 'Chicago, IL',
      image: 'https://via.placeholder.com/300x200?text=Truck',
      seller: 'Midwest Truck Sales',
      availability: '2 weeks',
      financingOptions: ['Purchase', 'Finance'],
    },
    {
      id: 3,
      name: 'John Deere Excavator 350G',
      category: 'Construction',
      condition: 'Like New',
      year: 2021,
      price: 290000,
      location: 'Dallas, TX',
      image: 'https://via.placeholder.com/300x200?text=Excavator',
      seller: 'Texas Construction Equipment',
      availability: 'Immediate',
      financingOptions: ['Lease', 'Purchase'],
    },
    {
      id: 4,
      name: 'Kenworth T680',
      category: 'Commercial Truck',
      condition: 'Excellent',
      year: 2022,
      price: 195000,
      location: 'Atlanta, GA',
      image: 'https://via.placeholder.com/300x200?text=Kenworth',
      seller: 'Southeast Truck Center',
      availability: '1 week',
      financingOptions: ['Lease', 'Purchase', 'Finance'],
    },
    {
      id: 5,
      name: 'Case 621G Wheel Loader',
      category: 'Construction',
      condition: 'Very Good',
      year: 2018,
      price: 155000,
      location: 'Phoenix, AZ',
      image: 'https://via.placeholder.com/300x200?text=Loader',
      seller: 'Desert Equipment Sales',
      availability: '3 weeks',
      financingOptions: ['Lease', 'Finance'],
    },
    {
      id: 6,
      name: 'Peterbilt 579',
      category: 'Commercial Truck',
      condition: 'Good',
      year: 2019,
      price: 135000,
      location: 'Seattle, WA',
      image: 'https://via.placeholder.com/300x200?text=Peterbilt',
      seller: 'Northwest Trucks',
      availability: 'Immediate',
      financingOptions: ['Purchase', 'Finance'],
    },
  ];

  // Special options based on user type
  const renderUserSpecificOptions = () => {
    switch (viewMode) {
      case 'seller':
        return (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Seller Tools</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                List New Equipment
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Manage Inventory
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Financing Partners
              </button>
            </div>
          </div>
        );
      case 'broker':
        return (
          <div className="mb-6 bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Broker Tools</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Match Buyers & Sellers
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Financing Solutions
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                Commission Calculator
              </button>
            </div>
          </div>
        );
      case 'lender':
        return (
          <div className="mb-6 bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Lender Tools</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Financing Options
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Asset Valuation
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Risk Assessment
              </button>
            </div>
          </div>
        );
      default: // buyer
        return (
          <div className="mb-6 bg-amber-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-amber-800 mb-2">Buyer Tools</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
                Save to Wishlist
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
                Financing Calculator
              </button>
              <button className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
                Compare Equipment
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation title="Commercial Market" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Commercial Truck & Equipment Market
          </h1>
          <p className="text-gray-600">
            Browse and finance commercial trucks and equipment from trusted vendors
          </p>
        </div>

        {/* User-specific options */}
        {renderUserSpecificOptions()}

        {/* Filter options */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                <option value="truck">Commercial Trucks</option>
                <option value="construction">Construction Equipment</option>
                <option value="agricultural">Agricultural Equipment</option>
                <option value="forklifts">Forklifts & Material Handling</option>
              </select>
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Any Condition</option>
                <option value="new">New</option>
                <option value="likeNew">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <select
                id="price"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Any Price</option>
                <option value="0-50000">Under $50,000</option>
                <option value="50000-100000">$50,000 - $100,000</option>
                <option value="100000-200000">$100,000 - $200,000</option>
                <option value="200000-500000">$200,000 - $500,000</option>
                <option value="500000+">$500,000+</option>
              </select>
            </div>

            <div>
              <label htmlFor="financing" className="block text-sm font-medium text-gray-700 mb-1">
                Financing Options
              </label>
              <select
                id="financing"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Any Option</option>
                <option value="lease">Lease</option>
                <option value="purchase">Purchase</option>
                <option value="finance">Financing Available</option>
                <option value="lease-to-own">Lease-to-Own</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Equipment grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipment.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-gray-600">Category:</div>
                  <div className="font-medium">{item.category}</div>
                  <div className="text-gray-600">Condition:</div>
                  <div className="font-medium">{item.condition}</div>
                  <div className="text-gray-600">Year:</div>
                  <div className="font-medium">{item.year}</div>
                  <div className="text-gray-600">Price:</div>
                  <div className="font-medium">${item.price.toLocaleString()}</div>
                  <div className="text-gray-600">Location:</div>
                  <div className="font-medium">{item.location}</div>
                  <div className="text-gray-600">Availability:</div>
                  <div className="font-medium">{item.availability}</div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Seller: {item.seller}</span>
                  <button className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700">
                    View Details
                  </button>
                </div>
                {viewMode === 'buyer' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      Apply for Financing
                    </button>
                  </div>
                )}
                {viewMode === 'lender' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                      Offer Financing
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommercialMarket;
