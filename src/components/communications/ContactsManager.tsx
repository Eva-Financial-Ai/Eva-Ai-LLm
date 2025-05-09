import React, { useState, useEffect, useRef } from 'react';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';

// Contact interface
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  type: 'client' | 'vendor' | 'broker' | 'lender' | 'other';
  notes: string;
  lastContactDate?: Date;
  createdAt: Date;
}

// Mock data for initial contacts
const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: 'John Smith',
    email: 'john.smith@abcindustries.com',
    phone: '(555) 123-4567',
    company: 'ABC Industries',
    role: 'CFO',
    type: 'client',
    notes: 'Key decision maker for equipment financing',
    lastContactDate: new Date('2023-03-15'),
    createdAt: new Date('2022-11-10'),
  },
  {
    id: 'contact-2',
    name: 'Sarah Johnson',
    email: 'sjohnson@xyzfinancial.com',
    phone: '(555) 987-6543',
    company: 'XYZ Financial',
    role: 'Loan Officer',
    type: 'lender',
    notes: 'Primary contact for commercial real estate loans',
    lastContactDate: new Date('2023-04-02'),
    createdAt: new Date('2022-12-05'),
  },
  {
    id: 'contact-3',
    name: 'Michael Wong',
    email: 'mwong@techsuppliers.com',
    phone: '(555) 456-7890',
    company: 'Tech Suppliers Inc.',
    role: 'Sales Manager',
    type: 'vendor',
    notes: 'Handles all equipment orders over $50k',
    lastContactDate: new Date('2023-03-28'),
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 'contact-4',
    name: 'Emily Rodriguez',
    email: 'erodriguez@brokerfirm.com',
    phone: '(555) 234-5678',
    company: 'Capital Brokers LLC',
    role: 'Senior Broker',
    type: 'broker',
    notes: 'Specializes in manufacturing equipment financing',
    lastContactDate: new Date('2023-04-05'),
    createdAt: new Date('2023-02-10'),
  },
];

const ContactsManager: React.FC = () => {
  const { userType } = useUserType();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Contact, 'id' | 'createdAt'>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    type: 'client',
    notes: '',
    lastContactDate: undefined,
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Filter contacts based on search and filter type
  useEffect(() => {
    let results = [...contacts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        contact =>
          contact.name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.company.toLowerCase().includes(term)
      );
    }

    if (filterType !== 'all') {
      results = results.filter(contact => contact.type === filterType);
    }

    setFilteredContacts(results);
  }, [contacts, searchTerm, filterType]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission for adding or editing a contact
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && selectedContact) {
      // Update existing contact
      const updatedContacts = contacts.map(contact =>
        contact.id === selectedContact.id ? { ...selectedContact, ...formData } : contact
      );
      setContacts(updatedContacts);
      setIsEditing(false);
    } else {
      // Add new contact
      const newContact: Contact = {
        ...formData,
        id: `contact-${Date.now()}`,
        createdAt: new Date(),
      };
      setContacts(prev => [...prev, newContact]);
    }

    // Reset form
    setShowAddForm(false);
    setSelectedContact(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      role: '',
      type: 'client',
      notes: '',
      lastContactDate: undefined,
    });
  };

  // Function to edit contact
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      role: contact.role,
      type: contact.type,
      notes: contact.notes,
      lastContactDate: contact.lastContactDate,
    });
    setIsEditing(true);
    setShowAddForm(true);
  };

  // Function to delete contact
  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    }
  };

  // Log a contact interaction
  const logInteraction = (contactId: string) => {
    const updated = contacts.map(contact =>
      contact.id === contactId ? { ...contact, lastContactDate: new Date() } : contact
    );
    setContacts(updated);
    alert('Interaction logged successfully');
  };

  // Import contacts from CSV
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // This is just a demo - in a real app we'd parse the CSV
    // For demo purposes, let's just add some mock imported contacts
    const newMockContacts: Contact[] = [
      {
        id: `contact-import-${Date.now()}-1`,
        name: 'Robert Chen',
        email: 'rchen@importedcontact.com',
        phone: '(555) 111-2233',
        company: 'Imported Tech Solutions',
        role: 'CTO',
        type: 'client',
        notes: 'Imported contact - interested in equipment financing',
        lastContactDate: new Date(),
        createdAt: new Date(),
      },
      {
        id: `contact-import-${Date.now()}-2`,
        name: 'Jessica Martinez',
        email: 'jmartinez@importedvendor.com',
        phone: '(555) 444-5566',
        company: 'Imported Vendor Inc.',
        role: 'Sales Director',
        type: 'vendor',
        notes: 'Imported contact - manufacturing equipment provider',
        lastContactDate: new Date(),
        createdAt: new Date(),
      },
    ];

    setContacts(prevContacts => [...prevContacts, ...newMockContacts]);

    // Show success message
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);

    // Reset file input
    e.target.value = '';
  };

  // Export contacts to CSV
  const handleExportContacts = () => {
    // In a real app, we would generate a CSV file from the contacts data
    // For demo purposes, we'll just simulate a download

    // Create a "fake" download by showing a success message
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);

    // In a real implementation, we would do something like:
    // const csvContent = generateCsvFromContacts(contacts);
    // const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'contacts.csv');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Contact Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-0.5 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Contact
          </button>
          {/* Import/Export buttons */}
          <button
            onClick={handleImportClick}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-0.5 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import
          </button>
          <button
            onClick={handleExportContacts}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-0.5 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
          {/* Hidden file input for import */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Success messages */}
      {importSuccess && (
        <div className="m-4 p-2 bg-green-100 text-green-800 rounded-md text-sm flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Contacts imported successfully! (Demo version)
        </div>
      )}

      {exportSuccess && (
        <div className="m-4 p-2 bg-green-100 text-green-800 rounded-md text-sm flex items-center">
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Contacts exported successfully! (Demo version)
        </div>
      )}

      {/* Search and filter */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
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
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="all">All Contacts</option>
              <option value="client">Clients</option>
              <option value="vendor">Vendors</option>
              <option value="broker">Brokers</option>
              <option value="lender">Lenders</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Contact Form */}
      {showAddForm && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {isEditing ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company *
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Contact Type *
                </label>
                <select
                  name="type"
                  id="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="client">Client</option>
                  <option value="vendor">Vendor</option>
                  <option value="broker">Broker</option>
                  <option value="lender">Lender</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditing(false);
                  setSelectedContact(null);
                }}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isEditing ? 'Update Contact' : 'Save Contact'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Company
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
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="ml-4">
                        <div className="text-xs text-gray-500">{contact.email}</div>
                        <div className="text-xs text-gray-500">{contact.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.company}</div>
                    <div className="text-xs text-gray-500">{contact.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${contact.type === 'client' ? 'bg-green-100 text-green-800' : ''}
                      ${contact.type === 'vendor' ? 'bg-blue-100 text-blue-800' : ''}
                      ${contact.type === 'broker' ? 'bg-purple-100 text-purple-800' : ''}
                      ${contact.type === 'lender' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${contact.type === 'other' ? 'bg-gray-100 text-gray-800' : ''}
                    `}
                    >
                      {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.lastContactDate
                      ? new Date(contact.lastContactDate).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => logInteraction(contact.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Log Interaction"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit Contact"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Contact"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No contacts found. {searchTerm && 'Try adjusting your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (simplified) */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredContacts.length}</span> of{' '}
              <span className="font-medium">{contacts.length}</span> contacts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsManager;
