import React, { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';
import CommunicationChannelManager from './CommunicationChannelManager';
import ChannelCommunication from './ChannelCommunication';
import { useWorkflow } from '../../contexts/WorkflowContext';

// Import the right type from ChannelCommunication
// type ChannelType = 'email' | 'sms' | 'call' | 'meeting' | 'portal' | 'in-app';

// We need to redefine these types to match what ChannelCommunication expects
type ChannelType = 'email' | 'call' | 'sms' | 'meeting' | 'portal';

interface ClearCommunicationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Example contact interface for the communication channels matching ChannelCommunication's requirements
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'internal' | 'external';
  role: string;
  avatar?: string;
  channels: string[];
  lastContact?: Date;
}

const ClearCommunicationsPanel: React.FC<ClearCommunicationsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'chat'>('chat');
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>('email');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { currentTransaction } = useWorkflow();
  
  // Example list of contacts - in a real app, this would come from an API or context
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'contact-1',
      name: 'Sarah Johnson (Smith Enterprises)',
      email: 'sarah@smithenterprises.com',
      phone: '(555) 123-4567',
      role: 'CFO',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      type: 'external',
      channels: ['email', 'sms', 'call']
    },
    {
      id: 'contact-2',
      name: 'Michael Chen (Smith Enterprises)',
      email: 'mchen@smithenterprises.com',
      phone: '(555) 987-6543',
      role: 'Controller',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      type: 'external',
      channels: ['email', 'call']
    },
    {
      id: 'contact-3',
      name: 'Emma Rodriguez (Legal Partners LLC)',
      email: 'erodriguez@legalfirm.com',
      phone: '(555) 234-5678',
      role: 'Attorney',
      avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
      type: 'external',
      channels: ['email', 'sms', 'call', 'meeting']
    }
  ]);
  
  // Map channel type from CommunicationChannelManager to ChannelCommunication
  const mapChannelType = (type: string): ChannelType => {
    if (type === 'in-app') return 'email'; // Default to email for in-app
    return type as ChannelType;
  };
  
  // Function to handle selecting a contact and channel
  const handleContactSelect = (contact: Contact, channelTypeInput: string) => {
    setSelectedContact(contact);
    setSelectedChannel(mapChannelType(channelTypeInput));
    setShowChannelModal(true);
  };
  
  // Function to handle communication sending
  const handleSendCommunication = (content: string) => {
    console.log('Sending communication:', {
      channel: selectedChannel,
      contact: selectedContact,
      content,
      transactionId: currentTransaction?.id
    });
    
    // In a real app, this would send the communication via the appropriate service
    setShowChannelModal(false);
    
    // Add to communication history (simplified)
    // In a real app, this would come from a backend service
    // setContactHistory(prev => [...prev, { timestamp: new Date(), content, sender: 'user' }]);
  };
  
  // Cast selected channel for the CommunicationChannelManager component
  const handleChannelSelect = (channelType: string) => {
    console.log(`Selected channel: ${channelType}`);
    // We don't need to set the channel here as we'll map it when the modal opens
  };
  
  // Helper to extract organization from contact name
  const extractOrganization = (name: string): string => {
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  };
  
  // Helper to get display name without organization
  const getDisplayName = (name: string): string => {
    return name.replace(/\s*\([^)]*\)\s*/, '');
  };
  
  return (
    <div className={`fixed inset-y-0 right-0 w-2/3 max-w-lg bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Header */}
      <div className="bg-primary-600 text-white py-3 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-500 p-1.5 rounded-lg">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="font-medium text-lg">Clear Communications</span>
            <p className="text-xs text-primary-100">Client transaction tools</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="p-1.5 hover:bg-primary-500 rounded-md transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'chat' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-3 px-4 font-medium text-sm ${activeTab === 'channels' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('channels')}
        >
          Channels & Connections
        </button>
      </div>
      
      {/* Tab content */}
      <div className="h-[calc(100%-108px)] overflow-y-auto">
        {activeTab === 'chat' ? (
          <div className="h-full">
            {/* Chat messages */}
            <ChatWidget 
              mode="communications" 
              initialPosition={{ x: 0, y: 0 }} 
              isOpen={true} 
              zIndexBase={40}
            />
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Communication channel manager */}
            <CommunicationChannelManager
              selectedChannel={selectedChannel as any}
              onChannelSelect={handleChannelSelect}
            />
            
            {/* Contacts section */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Contacts</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="space-y-2">
                {contacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      {contact.avatar ? (
                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                          {contact.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{getDisplayName(contact.name)}</h4>
                        <p className="text-sm text-gray-600">{contact.role}, {extractOrganization(contact.name)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {/* Email button */}
                      <button
                        onClick={() => handleContactSelect(contact, 'email')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Send Email"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                      
                      {/* SMS button */}
                      <button
                        onClick={() => handleContactSelect(contact, 'sms')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Send SMS"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </button>
                      
                      {/* Call button */}
                      <button
                        onClick={() => handleContactSelect(contact, 'call')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Call"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      
                      {/* Meeting button */}
                      <button
                        onClick={() => handleContactSelect(contact, 'meeting')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                        title="Schedule Meeting"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Contact
                </button>
              </div>
            </div>
            
            {/* Communication history (simplified) */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Recent Communications</h3>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-primary-500 bg-gray-50 rounded-r-md">
                  <div className="flex justify-between">
                    <span className="font-medium">Email to Sarah Johnson</span>
                    <span className="text-xs text-gray-500">10:30 AM today</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">Regarding document review for Smith Enterprises loan application</p>
                </div>
                <div className="p-3 border-l-4 border-green-500 bg-gray-50 rounded-r-md">
                  <div className="flex justify-between">
                    <span className="font-medium">Call with Michael Chen</span>
                    <span className="text-xs text-gray-500">Yesterday, 2:15 PM</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">Discussed financial projections, 15 min call</p>
                </div>
                <div className="p-3 border-l-4 border-blue-500 bg-gray-50 rounded-r-md">
                  <div className="flex justify-between">
                    <span className="font-medium">Meeting with Legal Team</span>
                    <span className="text-xs text-gray-500">Monday, 11:00 AM</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">Contract review session scheduled with Emma Rodriguez</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Communication channel modal */}
      {showChannelModal && selectedContact && (
        <ChannelCommunication
          isOpen={showChannelModal}
          onClose={() => setShowChannelModal(false)}
          channelType={selectedChannel}
          contact={selectedContact}
          onSendCommunication={handleSendCommunication}
        />
      )}
    </div>
  );
};

export default ClearCommunicationsPanel; 