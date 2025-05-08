import React, { useState, useEffect } from 'react';

// Interface for borrower data
export interface Borrower {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  taxId: string;
  lastTransactionDate?: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'business' | 'individual';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface BorrowerSelectorProps {
  onSelect: (borrower: Borrower) => void;
  showSearch?: boolean;
}

const BorrowerSelector: React.FC<BorrowerSelectorProps> = ({ onSelect, showSearch = true }) => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [filteredBorrowers, setFilteredBorrowers] = useState<Borrower[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);

  // Fetch borrowers (mock data for demo)
  useEffect(() => {
    const fetchBorrowers = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For demo, using mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockBorrowers: Borrower[] = [
          {
            id: 'brw-001',
            businessName: 'Quantum Innovations LLC',
            contactName: 'Sarah Thompson',
            email: 'sarah@quantuminnovations.com',
            phone: '(415) 555-1234',
            taxId: '82-4291042',
            lastTransactionDate: '2023-08-15',
            status: 'active',
            type: 'business',
            address: '123 Innovation Dr',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94105'
          },
          {
            id: 'brw-002',
            businessName: 'TechForward Solutions',
            contactName: 'David Chen',
            email: 'david@techforward.io',
            phone: '(628) 555-9876',
            taxId: '46-8273910',
            lastTransactionDate: '2023-07-22',
            status: 'active',
            type: 'business',
            address: '456 Market St',
            city: 'San Francisco',
            state: 'CA',
            zipCode: '94103'
          },
          {
            id: 'brw-003',
            businessName: 'Evergreen Properties',
            contactName: 'Michael Rodriguez',
            email: 'michael@evergreenproperties.com',
            phone: '(510) 555-3456',
            taxId: '35-7091284',
            lastTransactionDate: '2023-06-05',
            status: 'inactive',
            type: 'business',
            address: '789 Cedar Ave',
            city: 'Oakland',
            state: 'CA',
            zipCode: '94610'
          },
          {
            id: 'brw-004',
            businessName: 'Johnson Family Trust',
            contactName: 'Robert Johnson',
            email: 'robert@johnsonft.com',
            phone: '(408) 555-7890',
            taxId: '91-5372810',
            status: 'active',
            type: 'business',
            address: '555 Maple Ln',
            city: 'San Jose',
            state: 'CA',
            zipCode: '95113'
          },
          {
            id: 'brw-005',
            businessName: 'Emily Williams (Individual)',
            contactName: 'Emily Williams',
            email: 'emily.williams@email.com',
            phone: '(925) 555-2468',
            taxId: '576-29-4801',
            lastTransactionDate: '2023-09-01',
            status: 'active',
            type: 'individual',
            address: '321 Oak St',
            city: 'Pleasanton',
            state: 'CA',
            zipCode: '94588'
          }
        ];
        
        setBorrowers(mockBorrowers);
        setFilteredBorrowers(mockBorrowers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching borrowers:', error);
        setLoading(false);
      }
    };
    
    fetchBorrowers();
  }, []);

  // Filter borrowers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBorrowers(borrowers);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = borrowers.filter(borrower => 
      borrower.businessName.toLowerCase().includes(term) ||
      borrower.contactName.toLowerCase().includes(term) ||
      borrower.email.toLowerCase().includes(term) ||
      borrower.taxId.includes(term)
    );
    
    setFilteredBorrowers(filtered);
  }, [searchTerm, borrowers]);

  // Handle selecting a borrower
  const handleSelectBorrower = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    onSelect(borrower);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900">Select Existing Borrower</h3>
        {showSearch && (
          <div className="mt-2 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or tax ID"
              className="w-full p-2 pr-10 border border-gray-300 rounded-md text-gray-700 bg-white focus:ring-primary-500 focus:border-primary-500"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredBorrowers.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500">No borrowers found matching your search.</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBorrowers.map(borrower => (
                  <tr 
                    key={borrower.id} 
                    className={`hover:bg-blue-50 transition-colors duration-150 cursor-pointer ${selectedBorrower?.id === borrower.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectBorrower(borrower)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{borrower.businessName}</div>
                      {borrower.lastTransactionDate && (
                        <div className="text-xs text-gray-500">
                          Last transaction: {new Date(borrower.lastTransactionDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{borrower.contactName}</div>
                      <div className="text-xs text-gray-500">{borrower.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {borrower.taxId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        borrower.status === 'active' ? 'bg-green-100 text-green-800' :
                        borrower.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {borrower.status.charAt(0).toUpperCase() + borrower.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleSelectBorrower(borrower);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowerSelector; 