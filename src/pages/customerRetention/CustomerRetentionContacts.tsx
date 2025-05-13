import React, { useState, useEffect } from 'react';
import TopNavigation from '../../components/layout/TopNavigation';
import { 
  UserIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, 
  PencilSquareIcon, EyeIcon, ChatBubbleLeftEllipsisIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import AddContactModal, { Contact } from '../../components/communications/AddContactModal';

interface Business {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  type?: string;
  website?: string;
  created_at?: string;
}

// Mock businesses data - will be replaced with API call to Supabase
const mockBusinesses: Business[] = [
  { id: 'b1', name: 'Acme Financial', industry: 'Financial Services' },
  { id: 'b2', name: 'Global Equities Inc', industry: 'Investment' },
  { id: 'b3', name: 'Capital Resources LLC', industry: 'Consulting' },
  { id: 'b4', name: 'Premier Funding Group', industry: 'Lending' },
  { id: 'b5', name: 'Innovative Equipment Solutions', industry: 'Manufacturing' }
];

const mockContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Johnson',
    company: 'Acme Financial',
    title: 'Chief Financial Officer',
    email: 'sarah.johnson@acmefinancial.com',
    phone: '(555) 123-4567',
    type: 'Business Owner',
    lastContacted: '2023-06-15',
    status: 'Active',
    business_id: 'b1'
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    company: 'Global Equities Inc',
    title: 'Investment Manager',
    email: 'mchen@globalequities.com',
    phone: '(555) 987-6543',
    type: 'Broker',
    lastContacted: '2023-06-01',
    status: 'Active',
    business_id: 'b2'
  },
  {
    id: 'c3',
    name: 'Jessica Williams',
    company: 'Capital Resources LLC',
    title: 'Director of Operations',
    email: 'jwilliams@capitalresources.com',
    phone: '(555) 234-5678',
    type: 'Asset Seller',
    lastContacted: '2023-05-22',
    status: 'Inactive',
    business_id: 'b3'
  },
  {
    id: 'c4',
    name: 'Robert Garcia',
    company: 'Premier Funding Group',
    title: 'Senior Loan Officer',
    email: 'rgarcia@premierfunding.com',
    phone: '(555) 876-5432',
    type: 'Service Provider',
    lastContacted: '2023-06-10',
    status: 'Active',
    business_id: 'b4'
  },
  {
    id: 'c5',
    name: 'Amanda Taylor',
    company: 'Innovative Equipment Solutions',
    title: 'Sales Director',
    email: 'ataylor@innovativeequipment.com',
    phone: '(555) 345-6789',
    type: 'Business Owner',
    lastContacted: '2023-04-30',
    status: 'Follow-up Required',
    business_id: 'b5'
  }
];

const CustomerRetentionContacts: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  
  // State for managing businesses and contacts
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);

  const filteredContacts = filterStatus === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.status.toLowerCase() === filterStatus.toLowerCase());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
    setSelectedContact(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'follow-up required':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Handle adding a new contact
  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    // In a real application, this would be an API call to Supabase
    // For now, we'll simulate by generating an ID and adding to our state
    
    // Generate a temporary ID
    const tempId = `c${Date.now()}`;
    
    // Find the business if a business_id was provided
    let company = '';
    if (newContact.business_id) {
      const business = businesses.find(b => b.id === newContact.business_id);
      if (business) {
        company = business.name;
      }
    }
    
    // Create the new contact
    const contactToAdd: Contact = {
      id: tempId,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || '',
      title: newContact.title || '',
      company: company || newContact.company,
      type: newContact.type,
      lastContacted: newContact.lastContacted || new Date().toISOString(),
      status: newContact.status,
      business_id: newContact.business_id,
      notes: newContact.notes
    };
    
    // Add the contact to our state
    setContacts(prevContacts => [...prevContacts, contactToAdd]);
    
    // Close the modal
    setShowAddContactModal(false);
  };
  
  // Handle adding a new business
  const handleAddBusiness = (newBusiness: Omit<Business, 'id'>) => {
    // In a real application, this would be an API call to Supabase
    // For now, we'll simulate by generating an ID and adding to our state
    
    // Generate a temporary ID
    const tempId = `b${Date.now()}`;
    
    // Create the new business
    const businessToAdd: Business = {
      id: tempId,
      name: newBusiness.name,
      industry: newBusiness.industry,
      size: newBusiness.size,
      type: newBusiness.type,
      website: newBusiness.website,
      created_at: new Date().toISOString()
    };
    
    // Add the business to our state
    setBusinesses(prevBusinesses => [...prevBusinesses, businessToAdd]);
    
    // Return the ID so it can be used in the contact form
    return tempId;
  };

  return (
    <div className="pl-20 sm:pl-72 w-full">
      <div className="container mx-auto px-2 py-6 max-w-full">
        <TopNavigation title="Customer Retention - Contacts" currentTransactionId="TX-123" />
        
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Contacts</h1>
              <p className="text-gray-600">Manage your business contacts and relationships</p>
            </div>
            <div className="flex gap-3">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Import</span>
              </button>
              <button 
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
                onClick={() => setShowAddContactModal(true)}
              >
                <UserIcon className="h-5 w-5" />
                <span>Add Contact</span>
              </button>
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                className="px-4 py-2 border border-gray-300 rounded-md w-64"
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="follow-up required">Follow-up Required</option>
            </select>
          </div>
          
          {/* Contacts Table */}
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
                    Contact
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Contacted
                  </th>
                  <th 
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
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
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {contact.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(contact.lastContacted)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewContact(contact)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Showing 1 to 5 of 5 results
            </div>
            <div className="inline-flex shadow-sm">
              <button 
                className="px-3 py-2 border border-gray-300 rounded-l-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button 
                className="px-3 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700"
              >
                1
              </button>
              <button 
                className="px-3 py-2 border border-gray-300 rounded-r-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Contact Details</h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-primary-600 text-2xl font-bold">
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 text-center">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-500 text-center">{selectedContact.title}</p>
                    <p className="text-sm text-gray-700 text-center font-medium mt-2">{selectedContact.company}</p>
                    
                    <div className="mt-4 w-full">
                      <span className={`px-3 py-1 w-full text-center block text-sm font-semibold rounded-full ${getStatusBadgeClass(selectedContact.status)}`}>
                        {selectedContact.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="p-2 bg-primary-100 text-primary-600 rounded-full">
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-primary-100 text-primary-600 rounded-full">
                        <EnvelopeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 bg-primary-100 text-primary-600 rounded-full">
                        <CalendarIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="bg-white p-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium">{selectedContact.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-sm font-medium">{selectedContact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="text-sm font-medium">{selectedContact.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Contacted</p>
                        <p className="text-sm font-medium">{formatDate(selectedContact.lastContacted)}</p>
                      </div>
                      {selectedContact.notes && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm font-medium">{selectedContact.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Communication History</h3>
                    
                    <div className="border border-gray-200 rounded-lg mb-4">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Quarterly Review Call</p>
                            <p className="text-sm text-gray-500">Email, Phone Call</p>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate('2023-06-15')}</p>
                        </div>
                        <p className="text-sm mt-2">Discussed current financing needs and upcoming equipment purchase plans.</p>
                      </div>
                      
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Follow-up on Equipment Financing</p>
                            <p className="text-sm text-gray-500">Email</p>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate('2023-05-23')}</p>
                        </div>
                        <p className="text-sm mt-2">Sent options for financing new manufacturing equipment.</p>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Initial Contact</p>
                            <p className="text-sm text-gray-500">Email, In-Person</p>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate('2023-04-12')}</p>
                        </div>
                        <p className="text-sm mt-2">Introduced our services and discussed potential collaboration.</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        View All Communications
                      </button>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                        Schedule Follow-up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Contact Modal */}
      <AddContactModal 
        isOpen={showAddContactModal}
        onClose={() => setShowAddContactModal(false)}
        onAddContact={handleAddContact}
        businesses={businesses}
        onAddBusiness={handleAddBusiness}
      />
    </div>
  );
};

export default CustomerRetentionContacts; 