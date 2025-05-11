import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import TopNavigation from '../components/layout/TopNavigation';

// Define the Contact interface
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastContactDate: string;
  nextFollowUpDate?: string;
  notes?: string;
}

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're coming from the customer retention page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromCRM = params.get('from');
    
    if (fromCRM === 'customer-retention') {
      // Navigate to customer retention with contacts tab selected
      navigate('/customer-retention?tab=contacts', { replace: true });
    }
  }, [location, navigate]);

  // Mock data for contacts
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'c1',
      name: 'John Smith',
      email: 'john.smith@acmecorp.com',
      phone: '(555) 123-4567',
      company: 'Acme Corporation',
      role: 'CFO',
      status: 'active',
      lastContactDate: '2023-11-15',
      nextFollowUpDate: '2023-12-10',
      notes: 'Interested in equipment financing options for Q1 2024.',
    },
    {
      id: 'c2',
      name: 'Sarah Johnson',
      email: 'sjohnson@globexinc.com',
      phone: '(555) 987-6543',
      company: 'Globex Inc.',
      role: 'Procurement Director',
      status: 'active',
      lastContactDate: '2023-11-20',
      nextFollowUpDate: '2023-12-05',
      notes: 'Need to follow up about the commercial real estate proposal.',
    },
    {
      id: 'c3',
      name: 'Michael Rodriguez',
      email: 'mrodriguez@techtron.com',
      phone: '(555) 234-5678',
      company: 'TechTron Solutions',
      role: 'CEO',
      status: 'inactive',
      lastContactDate: '2023-09-28',
      notes: 'Was interested in fleet financing but decided to postpone until next fiscal year.',
    },
    {
      id: 'c4',
      name: 'Lisa Chen',
      email: 'lchen@innovatefin.com',
      phone: '(555) 345-6789',
      company: 'Innovate Financial',
      role: 'Investment Manager',
      status: 'active',
      lastContactDate: '2023-11-25',
      nextFollowUpDate: '2023-12-15',
      notes: 'Looking for joint venture opportunities in commercial lending.',
    },
    {
      id: 'c5',
      name: 'David Williams',
      email: 'dwilliams@constructionpro.com',
      phone: '(555) 456-7890',
      company: 'Construction Professionals LLC',
      role: 'Operations Manager',
      status: 'pending',
      lastContactDate: '2023-11-30',
      nextFollowUpDate: '2023-12-07',
      notes: 'Sent proposal for heavy equipment financing. Awaiting their review.',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>(
    'all'
  );

  // Filter contacts based on search term and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Handle adding a contact (would be implemented in a real app)
  const handleAddContact = () => {
    alert('In a real app, this would open a form to add a new contact.');
  };

  // Function to render the status badge with appropriate colors
  const renderStatusBadge = (status: 'active' | 'inactive' | 'pending') => {
    const classes = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <PageLayout title="Contacts" showBackButton={true} backPath="/customer-retention?tab=contacts">
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Contacts</h1>
          <p className="text-gray-600">Manage and track all your customer relationships</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  className="border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Add Contact Button */}
            <button
              onClick={handleAddContact}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Contact
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Info
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-800 font-semibold">
                            {contact.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.email}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(contact.lastContactDate).toLocaleDateString()}
                      </div>
                      {contact.nextFollowUpDate && (
                        <div className="text-xs text-gray-500">
                          Follow-up: {new Date(contact.nextFollowUpDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">View</button>
                        <button className="text-gray-600 hover:text-gray-900">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="mt-2 text-gray-500">No contacts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Contacts;
