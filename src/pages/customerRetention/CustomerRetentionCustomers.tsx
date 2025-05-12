import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import TopNavigation from '../../components/layout/TopNavigation';

const CustomerRetentionCustomers: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [customerType, setCustomerType] = useState<string>('businesses');
  
  // Extract the customer type from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam) {
      setCustomerType(typeParam);
    }
  }, [location.search]);
  
  // Handler for type change
  const handleTypeChange = (type: string) => {
    setCustomerType(type);
    navigate(`/customer-retention/customers?type=${type}`);
  };
  
  return (
    <div className="w-full">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 max-w-7xl">
        <TopNavigation title="Customer Retention - Customers" currentTransactionId="TX-123" />
        
        <div className="bg-white shadow rounded-lg p-4 md:p-6 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Customers</h1>
          <p className="text-gray-600 mb-4">Manage your customer relationships by type</p>
          
          {/* Customer Type Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button 
              onClick={() => handleTypeChange('businesses')}
              className={`px-4 py-2 rounded-full ${
                customerType === 'businesses' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              Businesses
            </button>
            <button 
              onClick={() => handleTypeChange('business-owners')}
              className={`px-4 py-2 rounded-full ${
                customerType === 'business-owners' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              Business Owners
            </button>
            <button 
              onClick={() => handleTypeChange('asset-sellers')}
              className={`px-4 py-2 rounded-full ${
                customerType === 'asset-sellers' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              Asset Sellers
            </button>
            <button 
              onClick={() => handleTypeChange('brokers-originators')}
              className={`px-4 py-2 rounded-full ${
                customerType === 'brokers-originators' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              Brokers & Originators
            </button>
            <button 
              onClick={() => handleTypeChange('service-providers')}
              className={`px-4 py-2 rounded-full ${
                customerType === 'service-providers' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-blue-600 border border-blue-600'
              }`}
            >
              Service Providers
            </button>
          </div>
          
          {/* Display based on customer type */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold capitalize mb-4">
              {customerType === 'business-owners' 
                ? 'Business Owners' 
                : customerType === 'asset-sellers'
                  ? 'Asset Sellers'
                  : customerType === 'brokers-originators'
                    ? 'Brokers & Originators'
                    : customerType === 'service-providers'
                      ? 'Service Providers'
                      : 'Businesses'}
            </h2>
            <p className="text-gray-500">
              This page would display a list of customers filtered by the selected type. 
              Currently showing: <span className="font-semibold capitalize">{customerType.replace('-', ' ')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRetentionCustomers; 