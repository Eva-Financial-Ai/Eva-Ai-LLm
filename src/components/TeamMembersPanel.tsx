import React, { useState } from 'react';
import { UserRoleType, UserSpecificRoleType } from './layout/TopNavbar';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  specificRole: UserSpecificRoleType;
  dateAdded: string;
  addedBy: string;
  permissions: string[];
  status: 'active' | 'pending' | 'inactive';
}

interface TeamMembersPanelProps {
  userType: UserRoleType;
  currentUserRole: UserRoleType;
  currentSpecificRole: UserSpecificRoleType;
  // Optional initial team members list
  initialTeamMembers?: TeamMember[];
}

const TeamMembersPanel: React.FC<TeamMembersPanelProps> = ({
  userType,
  currentUserRole,
  currentSpecificRole,
  initialTeamMembers = []
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    role: userType,
    specificRole: 'default_role' as UserSpecificRoleType,
    permissions: ['view'],
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Check if current user has permission to manage team members
  const canManageTeam = () => {
    return (
      currentUserRole === 'admin' ||
      currentSpecificRole === 'managers' ||
      currentUserRole === 'portfolio_manager' ||
      currentSpecificRole === 'business_owner' ||
      (currentUserRole === 'borrower' && currentSpecificRole === 'owners')
    );
  };

  // Available permissions based on user type
  const getAvailablePermissions = () => {
    const basePermissions = ['view', 'edit'];
    
    switch (userType) {
      case 'lender':
        return [...basePermissions, 'approve_loans', 'view_financials', 'manage_documents'];
      case 'broker':
        return [...basePermissions, 'submit_applications', 'view_commissions', 'client_communication'];
      case 'borrower':
        return [...basePermissions, 'sign_documents', 'payment_access', 'document_upload'];
      case 'vendor':
        return [...basePermissions, 'manage_inventory', 'view_financing_status', 'quote_generation'];
      default:
        return basePermissions;
    }
  };

  // Get available specific roles based on user type
  const getAvailableSpecificRoles = () => {
    switch (userType) {
      case 'vendor':
        return [
          { value: 'business_owner', label: 'Business Owner' },
          { value: 'finance_department', label: 'Finance Department & Titling' },
          { value: 'sales_department', label: 'Sales Department' },
          { value: 'marketing', label: 'Marketing' },
          { value: 'maintenance_service', label: 'Maintenance and Service' },
          { value: 'managers', label: 'Managers' }
        ];
      case 'borrower':
        return [
          { value: 'owners', label: 'Owners' },
          { value: 'employees', label: 'Employees' },
          { value: 'cpa_bookkeeper', label: 'CPA, Bookkeeper' },
          { value: 'authorized_proxy', label: 'Authorized Proxy' }
        ];
      case 'lender':
      case 'broker':
        return [
          { value: 'default_role', label: 'Standard User' },
          { value: 'cpa_bookkeeper', label: 'CPA, Bookkeeper' }
        ];
      default:
        return [{ value: 'default_role', label: 'Default Role' }];
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  // Handle permission checkbox changes
  const handlePermissionChange = (permission: string) => {
    const updatedPermissions = newMember.permissions ? [...newMember.permissions] : [];
    if (updatedPermissions.includes(permission)) {
      // Remove permission if already selected
      const index = updatedPermissions.indexOf(permission);
      updatedPermissions.splice(index, 1);
    } else {
      // Add permission if not selected
      updatedPermissions.push(permission);
    }
    setNewMember({ ...newMember, permissions: updatedPermissions });
  };

  // Add new team member
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;

    const newTeamMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: newMember.name || '',
      email: newMember.email || '',
      role: newMember.role || userType,
      specificRole: newMember.specificRole as UserSpecificRoleType || 'default',
      dateAdded: new Date().toISOString().split('T')[0],
      addedBy: 'Current User', // Would get this from auth context in a real app
      permissions: newMember.permissions || ['view'],
      status: 'pending'
    };

    setTeamMembers([...teamMembers, newTeamMember]);
    setNewMember({
      name: '',
      email: '',
      role: userType,
      specificRole: 'default_role' as UserSpecificRoleType,
      permissions: ['view'],
      status: 'pending'
    });
    setShowAddMemberForm(false);
  };

  // Remove team member
  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  // Update team member status
  const handleUpdateStatus = (id: string, newStatus: 'active' | 'pending' | 'inactive') => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === id ? { ...member, status: newStatus } : member
      )
    );
  };

  // Filter team members by search term
  const filteredTeamMembers = teamMembers.filter(
    member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-gray-900">Team Members</h2>
        {canManageTeam() && (
          <button
            onClick={() => setShowAddMemberForm(!showAddMemberForm)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {showAddMemberForm ? 'Cancel' : 'Add Team Member'}
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
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
      </div>

      {/* Add member form */}
      {showAddMemberForm && canManageTeam() && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newMember.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newMember.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="specificRole" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="specificRole"
                name="specificRole"
                value={newMember.specificRole as string}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {getAvailableSpecificRoles().map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={newMember.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {getAvailablePermissions().map(permission => (
                <div key={permission} className="flex items-center">
                  <input
                    id={`permission-${permission}`}
                    type="checkbox"
                    checked={newMember.permissions?.includes(permission) || false}
                    onChange={() => handlePermissionChange(permission)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`permission-${permission}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddMember}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Member
            </button>
          </div>
        </div>
      )}

      {/* Team members list */}
      {filteredTeamMembers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {canManageTeam() && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 rounded-full">
                        <span className="text-xl text-primary-700">{member.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getAvailableSpecificRoles().find(r => r.value === member.specificRole)?.label || member.specificRole}
                    </div>
                    <div className="text-xs text-gray-500">Added by: {member.addedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.dateAdded}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  {canManageTeam() && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {member.status !== 'active' && (
                          <button
                            onClick={() => handleUpdateStatus(member.id, 'active')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                        {member.status !== 'inactive' && (
                          <button
                            onClick={() => handleUpdateStatus(member.id, 'inactive')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deactivate
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
          <p className="mt-1 text-sm text-gray-500">
            {canManageTeam()
              ? "Get started by adding a new team member."
              : "No team members have been added yet."}
          </p>
          {canManageTeam() && !showAddMemberForm && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAddMemberForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Team Member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMembersPanel; 