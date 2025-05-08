import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  type: 'borrower' | 'broker' | 'vendor';
  email: string;
  businessName?: string;
  taxId?: string;
  profileData?: any;
}

interface UserSelectorProps {
  onSelectUser: (userData: any) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserType, setSelectedUserType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, [selectedUserType]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would call your API
      // For now, we'll simulate a network request with a timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real implementation, this would come from your API
      const mockUsers: User[] = [
        { id: 'b1', name: 'John Smith', type: 'borrower', email: 'john@example.com', businessName: 'Smith Enterprises', taxId: '12-3456789' },
        { id: 'b2', name: 'Jane Doe', type: 'borrower', email: 'jane@example.com', businessName: 'Doe Ventures', taxId: '98-7654321' },
        { id: 'br1', name: 'Michael Johnson', type: 'broker', email: 'michael@brokerage.com' },
        { id: 'br2', name: 'Sarah Williams', type: 'broker', email: 'sarah@finance.com' },
        { id: 'v1', name: 'Tech Supplies Inc', type: 'vendor', email: 'sales@techsupplies.com', businessName: 'Tech Supplies Inc' },
        { id: 'v2', name: 'Office Solutions', type: 'vendor', email: 'info@officesolutions.com', businessName: 'Office Solutions LLC' },
      ];
      
      // Filter by user type if needed
      const filteredUsers = selectedUserType === 'all' 
        ? mockUsers 
        : mockUsers.filter(user => user.type === selectedUserType);
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    // Transform user data to match form fields
    const userData = {
      // For borrowers and vendors, prefill business information
      ...(user.businessName && {
        businessName: user.businessName,
        taxId: user.taxId || '',
      }),
      // Always prefill owner information
      ownerName: user.name,
      ownerEmail: user.email,
      // In a real implementation, you would include all available profile data
      ...user.profileData
    };
    
    onSelectUser(userData);
  };

  // Filter users by search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.businessName && user.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Select Existing Contact</h3>
      
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, business, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Contacts</option>
            <option value="borrower">Borrowers</option>
            <option value="broker">Brokers</option>
            <option value="vendor">Vendors</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="max-h-64 overflow-y-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{user.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.businessName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No contacts found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default UserSelector; 