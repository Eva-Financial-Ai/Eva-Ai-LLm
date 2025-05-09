import React, { useState, useEffect } from 'react';

export interface BusinessRecord {
  id: string;
  businessName: string;
  dba?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  taxId: string;
  isNew?: boolean;
  owners: OwnerRecord[];
  createdAt: string;
  lastUpdated: string;
}

export interface OwnerRecord {
  mobile: string;
  id: string;
  name: string;
  ownershipPercentage: string;
  ssn?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  isNew?: boolean;
}

export interface DatabaseSearchProps {
  onSelectBusiness: (business: BusinessRecord) => void;
  onSelectOwner: (owner: OwnerRecord) => void;
  onNewBusiness: () => void;
  onNewOwner: () => void;
  currentEIN?: string;
}

const DatabaseSearch: React.FC<DatabaseSearchProps> = ({
  onSelectBusiness,
  onSelectOwner,
  onNewBusiness,
  onNewOwner,
  currentEIN,
}) => {
  const [searchType, setSearchType] = useState<'business' | 'owner'>('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BusinessRecord[] | OwnerRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Mock database for demonstration purposes
  const mockBusinesses: BusinessRecord[] = [
    {
      id: 'b1',
      businessName: 'Quantum Innovations LLC',
      dba: 'Quantum Tech',
      address: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      taxId: '82-1234567',
      owners: [
        {
          id: 'o1',
          name: 'Sarah Thompson',
          ownershipPercentage: '72',
          ssn: '333-33-3333',
          phone: '(123) 456-7890',
          mobile: '(123) 456-7890',
          email: 'sarah@example.com',
        },
        {
          id: 'o2',
          name: 'Michael Rodriguez',
          ownershipPercentage: '28',
          ssn: '444-44-4444',
          phone: '(123) 456-7891',
          mobile: '(123) 456-7891',
          email: 'michael@example.com',
        },
      ],
      createdAt: '2022-04-15',
      lastUpdated: '2023-11-20',
    },
    {
      id: 'b2',
      businessName: 'Horizon Enterprises Inc',
      dba: 'Horizon',
      address: '456 Business Ave',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94612',
      taxId: '45-6789012',
      owners: [
        {
          id: 'o3',
          name: 'Jessica Williams',
          ownershipPercentage: '100',
          ssn: '555-55-5555',
          phone: '(123) 456-7892',
          mobile: '(123) 456-7892',
          email: 'jessica@example.com',
        },
      ],
      createdAt: '2021-08-10',
      lastUpdated: '2023-10-05',
    },
    {
      id: 'b3',
      businessName: 'Pinnacle Solutions LLC',
      address: '789 Tech Blvd',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95113',
      taxId: '33-4567890',
      owners: [
        {
          id: 'o4',
          name: 'David Chen',
          ownershipPercentage: '50',
          ssn: '666-66-6666',
          phone: '(123) 456-7893',
          mobile: '(123) 456-7893',
          email: 'david@example.com',
        },
        {
          id: 'o5',
          name: 'Michelle Lee',
          ownershipPercentage: '50',
          ssn: '777-77-7777',
          phone: '(123) 456-7894',
          mobile: '(123) 456-7894',
          email: 'michelle@example.com',
        },
      ],
      createdAt: '2020-12-01',
      lastUpdated: '2023-09-15',
    },
  ];

  // Get all owners from the mockBusinesses for owner search
  const allOwners = mockBusinesses.flatMap(business =>
    business.owners.map(owner => ({
      ...owner,
      businessName: business.businessName,
    }))
  );

  const handleSearch = () => {
    setIsSearching(true);
    setSearchPerformed(true);

    // In a real implementation, this would be an API call to your database
    setTimeout(() => {
      if (searchType === 'business') {
        const filteredBusinesses = mockBusinesses.filter(
          business =>
            business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (business.dba && business.dba.toLowerCase().includes(searchQuery.toLowerCase())) ||
            business.taxId.includes(searchQuery)
        );
        setSearchResults(filteredBusinesses);
      } else {
        const filteredOwners = allOwners.filter(
          owner =>
            owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (owner.ssn && owner.ssn.includes(searchQuery))
        );
        setSearchResults(filteredOwners as any);
      }
      setIsSearching(false);
    }, 500);
  };

  // If currentEIN is provided, pre-populate the search field and perform a search
  useEffect(() => {
    if (currentEIN && searchType === 'business') {
      setSearchQuery(currentEIN);
      handleSearch();
    }
  }, [currentEIN, searchType]);

  const handleSelect = (item: BusinessRecord | OwnerRecord) => {
    if (searchType === 'business') {
      onSelectBusiness(item as BusinessRecord);
    } else {
      onSelectOwner(item as OwnerRecord);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Pre-fill from Database</h3>

      <div className="flex mb-4">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-l-md ${
            searchType === 'business'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSearchType('business')}
        >
          Search Businesses
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-r-md ${
            searchType === 'owner'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setSearchType('owner')}
        >
          Search Owners
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              searchType === 'business'
                ? 'Search by business name, DBA, or Tax ID'
                : 'Search by owner name or SSN'
            }
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Search
        </button>
        <button
          type="button"
          onClick={searchType === 'business' ? onNewBusiness : onNewOwner}
          className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Add New {searchType === 'business' ? 'Business' : 'Owner'}
        </button>
      </div>

      {isSearching && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      )}

      {!isSearching && searchPerformed && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {searchType === 'business' ? 'businesses' : 'owners'} found matching your search
          criteria.
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {searchType === 'business' ? (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owners
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ownership %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {searchType === 'business' ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {(item as BusinessRecord).businessName}
                        </div>
                        {(item as BusinessRecord).dba && (
                          <div className="text-sm text-gray-500">
                            DBA: {(item as BusinessRecord).dba}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item as BusinessRecord).taxId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item as BusinessRecord).city}, {(item as BusinessRecord).state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item as BusinessRecord).owners.length}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{(item as any).name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item as any).businessName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item as any).ownershipPercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item as any).email}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleSelect(item)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Use Data
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DatabaseSearch;
