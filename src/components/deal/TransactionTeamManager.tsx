import React, { useState, useEffect } from 'react';

// Define types for transaction team member
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  type: 'borrower' | 'lender' | 'broker' | 'vendor' | 'other';
  inviteStatus: 'pending' | 'accepted' | 'declined' | 'active';
  permissions: string[];
  profileImage?: string;
}

interface TransactionTeamManagerProps {
  dealId: string;
  onSave?: (members: TeamMember[]) => void;
  onCancel?: () => void;
  isOpen: boolean;
}

// Pre-defined roles for each party type
const roleOptions = {
  borrower: ['Primary Contact', 'Financial Officer', 'Legal Counsel', 'Authorized Signer'],
  lender: ['Account Manager', 'Underwriter', 'Credit Officer', 'Relationship Manager', 'Auditor'],
  broker: ['Deal Owner', 'Originator', 'Processor', 'Administrator'],
  vendor: ['Sales Representative', 'Finance Manager', 'Technical Support'],
  other: ['Observer', 'Consultant', 'Third-Party Service Provider']
};

// Pre-defined permission sets
const permissionSets = {
  fullAccess: ['view', 'edit', 'approve', 'sign', 'admin'],
  editAccess: ['view', 'edit'],
  viewOnly: ['view'],
  approver: ['view', 'approve'],
  signer: ['view', 'sign']
};

const TransactionTeamManager: React.FC<TransactionTeamManagerProps> = ({ 
  dealId, 
  onSave, 
  onCancel,
  isOpen
}) => {
  // State for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [selectedRoleType, setSelectedRoleType] = useState<'borrower' | 'lender' | 'broker' | 'vendor' | 'other'>('borrower');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissionSet, setSelectedPermissionSet] = useState('viewOnly');
  
  // Mock function to search contacts
  const searchContacts = (query: string) => {
    // In a real app, this would call an API
    const mockResults = [
      { id: '1', name: 'John Smith', email: 'john@example.com', organization: 'ABC Corp', type: 'borrower' },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', organization: 'First Capital Bank', type: 'lender' },
      { id: '3', name: 'Robert Williams', email: 'robert@example.com', organization: 'Broker Associates', type: 'broker' },
      { id: '4', name: 'Emily Davis', email: 'emily@example.com', organization: 'Equipment Suppliers Inc', type: 'vendor' },
      { id: '5', name: 'Michael Brown', email: 'michael@example.com', organization: 'Legal Services LLC', type: 'other' }
    ];
    
    return mockResults.filter(contact => 
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  // Update search results when search term changes
  useEffect(() => {
    if (searchTerm.length > 2) {
      const results = searchContacts(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);
  
  // Handle adding a new team member
  const handleAddTeamMember = () => {
    if (!selectedContact || !selectedRole) return;
    
    const newMember: TeamMember = {
      id: selectedContact.id,
      name: selectedContact.name,
      email: selectedContact.email,
      role: selectedRole,
      organization: selectedContact.organization,
      type: selectedContact.type,
      inviteStatus: 'pending',
      permissions: permissionSets[selectedPermissionSet as keyof typeof permissionSets]
    };
    
    setTeamMembers([...teamMembers, newMember]);
    
    // Reset form
    setSelectedContact(null);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedRole('');
  };
  
  // Handle removing a team member
  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };
  
  // Handle saving the team
  const handleSave = () => {
    if (onSave) {
      onSave(teamMembers);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Transaction Team</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Current team members */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Current Team Members</h3>
          {teamMembers.length === 0 ? (
            <p className="text-gray-500 italic">No team members added yet.</p>
          ) : (
            <div className="bg-gray-50 rounded-md p-4">
              <div className="space-y-3">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-lg text-gray-600">{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                        <div className="text-xs text-gray-500">{member.email}</div>
                        <div className="text-xs text-gray-500">{member.organization}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${
                        member.inviteStatus === 'active' ? 'text-green-600' :
                        member.inviteStatus === 'pending' ? 'text-yellow-600' : 
                        member.inviteStatus === 'declined' ? 'text-red-600' : ''
                      }`}>
                        {member.inviteStatus.charAt(0).toUpperCase() + member.inviteStatus.slice(1)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{member.role}</div>
                      <div className="flex mt-1">
                        <button className="text-xs text-primary-600 mr-2">Edit</button>
                        <button 
                          className="text-xs text-red-600"
                          onClick={() => handleRemoveTeamMember(member.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Add new team member */}
        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Add Team Member</h3>
          
          {/* Search contacts */}
          <div className="mb-4">
            <label htmlFor="search-contacts" className="block text-sm font-medium text-gray-700 mb-1">
              Search Contacts
            </label>
            <input
              type="text"
              id="search-contacts"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            
            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-1 rounded-md bg-white shadow-lg border border-gray-300 max-h-60 overflow-y-auto z-10">
                <ul className="py-1">
                  {searchResults.map(contact => (
                    <li 
                      key={contact.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedContact(contact);
                        setSelectedRoleType(contact.type);
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                          <span className="text-sm text-gray-600">{contact.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-xs text-gray-500">{contact.email}</div>
                          <div className="text-xs text-gray-500">{contact.organization}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Selected contact */}
          {selectedContact && (
            <div className="bg-white rounded-md p-3 border border-gray-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span className="text-lg text-gray-600">{selectedContact.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{selectedContact.name}</h4>
                    <div className="text-xs text-gray-500">{selectedContact.email}</div>
                    <div className="text-xs text-gray-500">{selectedContact.organization}</div>
                  </div>
                </div>
                <button
                  className="text-xs text-gray-500"
                  onClick={() => setSelectedContact(null)}
                >
                  Change
                </button>
              </div>
            </div>
          )}
          
          {/* Role and permissions */}
          {selectedContact && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="role-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Party Type
                </label>
                <select
                  id="role-type"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={selectedRoleType}
                  onChange={e => {
                    setSelectedRoleType(e.target.value as any);
                    setSelectedRole('');
                  }}
                >
                  <option value="borrower">Borrower</option>
                  <option value="lender">Lender</option>
                  <option value="broker">Broker</option>
                  <option value="vendor">Vendor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  <option value="">Select a role</option>
                  {roleOptions[selectedRoleType].map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="permissions" className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <select
                  id="permissions"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={selectedPermissionSet}
                  onChange={e => setSelectedPermissionSet(e.target.value)}
                >
                  <option value="fullAccess">Full Access (view, edit, approve, sign, admin)</option>
                  <option value="editAccess">Edit Access (view, edit)</option>
                  <option value="viewOnly">View Only</option>
                  <option value="approver">Approver (view, approve)</option>
                  <option value="signer">Signer (view, sign)</option>
                </select>
              </div>
              
              <div className="md:col-span-2 text-right">
                <button
                  onClick={handleAddTeamMember}
                  disabled={!selectedRole}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  Add to Team
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTeamManager; 