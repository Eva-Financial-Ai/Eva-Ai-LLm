import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import TopNavigation from '../components/layout/TopNavigation';
import ContactTypeFilter, { ContactType } from '../components/customerRetention/ContactTypeFilter';

// Define the Contact interface with expanded properties
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
  tags?: string[];
  communicationPreference?: 'email' | 'phone' | 'in-person' | 'any';
  linkedinProfile?: string;
  assignedTo?: string;
  lifecycleStage?: 'lead' | 'prospect' | 'customer' | 'former-customer';
  // Calendar integration fields
  calendarLink?: string;
  scheduledMeetings?: Meeting[];
}

// Meeting interface for calendar integration
interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  videoLink?: string;
  notes?: string;
  calendarProvider: 'google' | 'microsoft' | 'apple' | 'other';
}

// Communication interface for tracking contact interactions
interface Communication {
  id: string;
  contactId: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'other';
  direction: 'inbound' | 'outbound';
  date: string;
  subject?: string;
  content?: string;
  duration?: number; // in minutes for calls/meetings
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
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
      tags: ['finance', 'decision-maker', 'equipment-finance'],
      communicationPreference: 'email',
      linkedinProfile: 'linkedin.com/in/johnsmith',
      lifecycleStage: 'customer',
      calendarLink: 'calendly.com/johnsmith',
      scheduledMeetings: [
        {
          id: 'm1',
          title: 'Quarterly Review',
          date: '2023-12-15',
          startTime: '10:00',
          endTime: '11:00',
          attendees: ['John Smith', 'Sarah Parker'],
          location: 'Virtual',
          videoLink: 'zoom.us/meeting/123',
          calendarProvider: 'google'
        }
      ]
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
      tags: ['procurement', 'real-estate'],
      communicationPreference: 'phone',
      lifecycleStage: 'prospect',
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
      tags: ['executive', 'fleet-financing'],
      communicationPreference: 'in-person',
      lifecycleStage: 'lead',
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
      tags: ['investment', 'partnerships'],
      communicationPreference: 'email',
      lifecycleStage: 'customer',
      calendarLink: 'calendly.com/lisachen',
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
      tags: ['construction', 'equipment-finance'],
      communicationPreference: 'any',
      lifecycleStage: 'prospect',
    },
  ]);

  // Mock data for communications
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 'comm1',
      contactId: 'c1',
      type: 'email',
      direction: 'outbound',
      date: '2023-11-15',
      subject: 'Equipment Financing Options',
      content: 'Sent information about Q1 2024 equipment financing options and rates.',
      outcome: 'Interested, requested follow-up in December',
      followUpRequired: true,
      followUpDate: '2023-12-10',
    },
    {
      id: 'comm2',
      contactId: 'c1',
      type: 'call',
      direction: 'inbound',
      date: '2023-11-10',
      duration: 15,
      content: 'Called to inquire about equipment financing rates for Q1 2024.',
      outcome: 'Requested email with financing options',
      followUpRequired: true,
      followUpDate: '2023-11-15',
    },
    {
      id: 'comm3',
      contactId: 'c2',
      type: 'meeting',
      direction: 'outbound',
      date: '2023-11-20',
      subject: 'Commercial Real Estate Proposal Discussion',
      duration: 45,
      content: 'Met to discuss commercial real estate financing options for their new location.',
      outcome: 'Interested in proposal for 15-year term',
      followUpRequired: true,
      followUpDate: '2023-12-05',
    },
  ]);

  // State for search, filter, and modals
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [filterContactType, setFilterContactType] = useState<ContactType>('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newCommunication, setNewCommunication] = useState<Partial<Communication>>({
    type: 'email',
    direction: 'outbound',
    date: new Date().toISOString().split('T')[0],
    followUpRequired: false,
  });
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    calendarProvider: 'google',
  });

  // Modal states - let's ensure they're properly implemented
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Filter contacts based on search term, status, and contact type
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    
    const matchesType = filterContactType === 'all' || 
      (filterContactType === 'customer' && contact.lifecycleStage === 'customer') ||
      (filterContactType === 'prospect' && contact.lifecycleStage === 'prospect') ||
      (filterContactType === 'partner' && contact.tags?.includes('partner')) ||
      (filterContactType === 'vendor' && contact.tags?.includes('vendor')) ||
      (filterContactType === 'employee' && contact.tags?.includes('employee'));

    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle adding a new contact
  const handleAddContact = () => {
    setSelectedContact(null);
    setShowContactModal(true);
  };

  // Handle viewing a contact's details
  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  // Enhanced function to handle editing a contact
  const handleEditContact = (contact: Contact) => {
    setSelectedContact({...contact});
    setShowContactModal(true);
  };

  // Handle logging a communication
  const handleLogCommunication = (contact: Contact) => {
    setSelectedContact(contact);
    setNewCommunication({
      contactId: contact.id,
      type: 'email',
      direction: 'outbound',
      date: new Date().toISOString().split('T')[0],
      followUpRequired: false,
    });
    setShowCommunicationModal(true);
  };

  // Handle scheduling a meeting
  const handleScheduleMeeting = (contact: Contact) => {
    setSelectedContact(contact);
    setNewMeeting({
      title: `Meeting with ${contact.name}`,
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      attendees: [contact.name],
      calendarProvider: 'google',
    });
    setShowScheduleModal(true);
  };

  // Save a new communication
  const saveCommunication = () => {
    if (!selectedContact || !newCommunication.type) return;

    const communication: Communication = {
      id: `comm${communications.length + 1}`,
      contactId: selectedContact.id,
      type: newCommunication.type as 'email' | 'call' | 'meeting' | 'note' | 'other',
      direction: newCommunication.direction as 'inbound' | 'outbound',
      date: newCommunication.date || new Date().toISOString().split('T')[0],
      subject: newCommunication.subject,
      content: newCommunication.content,
      duration: newCommunication.duration,
      outcome: newCommunication.outcome,
      followUpRequired: newCommunication.followUpRequired,
      followUpDate: newCommunication.followUpDate,
    };

    setCommunications([...communications, communication]);

    // Update the last contact date for the contact
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return {
          ...c,
          lastContactDate: communication.date,
          nextFollowUpDate: communication.followUpRequired ? communication.followUpDate : c.nextFollowUpDate
        };
      }
      return c;
    });
    setContacts(updatedContacts);

    setShowCommunicationModal(false);
    setNewCommunication({
      type: 'email',
      direction: 'outbound',
      date: new Date().toISOString().split('T')[0],
      followUpRequired: false,
    });
  };

  // Save a scheduled meeting
  const saveScheduledMeeting = () => {
    if (!selectedContact || !newMeeting.title) return;

    const meeting: Meeting = {
      id: `m${Date.now()}`,
      title: newMeeting.title as string,
      date: newMeeting.date as string,
      startTime: newMeeting.startTime as string,
      endTime: newMeeting.endTime as string,
      attendees: newMeeting.attendees || [selectedContact.name],
      location: newMeeting.location,
      videoLink: newMeeting.videoLink,
      notes: newMeeting.notes,
      calendarProvider: newMeeting.calendarProvider as 'google' | 'microsoft' | 'apple' | 'other',
    };

    // Add meeting to contact's scheduled meetings
    const updatedContacts = contacts.map(c => {
      if (c.id === selectedContact.id) {
        return {
          ...c,
          scheduledMeetings: [...(c.scheduledMeetings || []), meeting],
          nextFollowUpDate: meeting.date
        };
      }
      return c;
    });
    setContacts(updatedContacts);

    // Also log this as a communication (scheduled meeting)
    const communication: Communication = {
      id: `comm${communications.length + 1}`,
      contactId: selectedContact.id,
      type: 'meeting',
      direction: 'outbound',
      date: new Date().toISOString().split('T')[0],
      subject: `Scheduled: ${meeting.title}`,
      content: `Meeting scheduled for ${meeting.date} at ${meeting.startTime}`,
      followUpRequired: true,
      followUpDate: meeting.date,
    };
    setCommunications([...communications, communication]);

    setShowScheduleModal(false);
    setNewMeeting({
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      calendarProvider: 'google',
    });
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

  // Format date helper
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <PageLayout title="Contacts" showBackButton={true} backPath="/customer-retention?tab=contacts">
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Customer Contacts</h1>
          <p className="text-gray-600">Manage and track all your customer relationships</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Contacts</p>
            <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Active Contacts</p>
            <p className="text-2xl font-bold text-gray-900">{contacts.filter(c => c.status === 'active').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Pending Follow-ups</p>
            <p className="text-2xl font-bold text-gray-900">{contacts.filter(c => c.nextFollowUpDate).length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Recent Communications</p>
            <p className="text-2xl font-bold text-gray-900">{communications.filter(c => 
              new Date(c.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
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

              {/* Contact Type Filter */}
              <div className="ml-2">
                <ContactTypeFilter
                  selectedType={filterContactType}
                  onChange={setFilterContactType}
                />
              </div>

              {/* Calendar Filter */}
              <div>
                <select
                  className="border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 p-2"
                  defaultValue="all"
                >
                  <option value="all">All Calendar Events</option>
                  <option value="scheduled">Scheduled Meetings</option>
                  <option value="today">Today's Events</option>
                  <option value="tomorrow">Tomorrow's Events</option>
                  <option value="thisWeek">This Week</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => navigate('/calendar-integration')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 flex items-center"
              >
                <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </button>
              
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
                        {formatDate(contact.lastContactDate)}
                      </div>
                      {contact.nextFollowUpDate && (
                        <div className="text-xs text-gray-500">
                          Follow-up: {formatDate(contact.nextFollowUpDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleViewContact(contact)} 
                          className="text-primary-600 hover:text-primary-900">
                          View
                        </button>
                        <button 
                          onClick={() => handleEditContact(contact)} 
                          className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        <button 
                          onClick={() => handleLogCommunication(contact)} 
                          className="text-indigo-600 hover:text-indigo-900">
                          Log
                        </button>
                        <button 
                          onClick={() => handleScheduleMeeting(contact)} 
                          className="text-green-600 hover:text-green-900">
                          Schedule
                        </button>
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

      {/* Contact View Modal */}
      {isViewModalOpen && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 md:mx-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Contact Details</h3>
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-800 text-2xl font-bold">
                    {selectedContact.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h2>
                  <p className="text-gray-600">{selectedContact.role} at {selectedContact.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-700">
                      <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedContact.email}
                    </p>
                    <p className="flex items-center text-gray-700">
                      <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {selectedContact.phone}
                    </p>
                    {selectedContact.linkedinProfile && (
                      <p className="flex items-center text-gray-700">
                        <svg className="h-5 w-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        {selectedContact.linkedinProfile}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Status & Follow-up</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700">Status:</span>
                      {renderStatusBadge(selectedContact.status)}
                    </div>
                    <p className="text-gray-700">
                      Last Contact: {formatDate(selectedContact.lastContactDate)}
                    </p>
                    {selectedContact.nextFollowUpDate && (
                      <p className="text-gray-700">
                        Next Follow-up: {formatDate(selectedContact.nextFollowUpDate)}
                      </p>
                    )}
                    {selectedContact.lifecycleStage && (
                      <p className="text-gray-700">
                        Lifecycle Stage: <span className="capitalize">{selectedContact.lifecycleStage.replace('-', ' ')}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedContact.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded border border-gray-200">
                    <p className="text-gray-700">{selectedContact.notes}</p>
                  </div>
                </div>
              )}

              {selectedContact.tags && selectedContact.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedContact.scheduledMeetings && selectedContact.scheduledMeetings.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upcoming Meetings</h3>
                  <div className="space-y-3">
                    {selectedContact.scheduledMeetings.map(meeting => (
                      <div key={meeting.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(meeting.date)} {meeting.startTime} - {meeting.endTime}
                          </span>
                        </div>
                        {meeting.location && (
                          <p className="text-sm text-gray-600 mt-1">Location: {meeting.location}</p>
                        )}
                        {meeting.videoLink && (
                          <p className="text-sm text-gray-600 mt-1">
                            Video: <a href={`https://${meeting.videoLink}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{meeting.videoLink}</a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditContact(selectedContact);
                }}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Edit Contact
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleLogCommunication(selectedContact);
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Log Communication
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleScheduleMeeting(selectedContact);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other existing modals */}
      {/* ... existing code ... */}
    </PageLayout>
  );
};

export default Contacts;
