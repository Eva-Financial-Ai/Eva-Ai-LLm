# Communications Components

This directory contains the components necessary for secure, compliant communication within the Eva AI financial services platform. These components enable seamless messaging, document sharing, and collaboration between users, clients, and external stakeholders throughout the credit origination process.

## Overview

The Communications system implements several advanced communication capabilities:

1. **Multi-Channel Messaging**: Secure communication across various channels (in-app, SMS, email)
2. **AI-Assisted Communication**: Intelligent message suggestions and content generation
3. **Contact Management**: Organization and management of communication contacts
4. **Compliance Integration**: Automated compliance checks and archiving for regulatory requirements
5. **ClearCommunication Bar**: Accessible communication interface available throughout the application

These components provide a complete communication infrastructure for:
- Secure in-app messaging
- SMS text message integration
- Document sharing and collaboration
- Contact management
- Compliance monitoring and archiving
- AI-assisted communication

## Components

### 1. ChannelCommunication

The core communication interface that enables messaging across different channels:

```jsx
import ChannelCommunication from './components/communications/ChannelCommunication';

// Example usage
<ChannelCommunication 
  transactionId={transactionId}
  participants={participants}
  defaultChannel="in-app"
/>
```

### 2. AddContactModal

Modal component for adding and managing communication contacts:

```jsx
import AddContactModal from './components/communications/AddContactModal';

// Example usage
<AddContactModal
  onContactAdded={handleContactAdded}
  onClose={() => setShowAddContact(false)}
  existingContacts={contactList}
/>
```

### 3. ClearCommunicationBar

The main communication interface available throughout the application (located in parent components directory):

```jsx
import ClearCommunicationBar from '../ClearCommunicationBar';

// Example usage
<ClearCommunicationBar 
  transactionId={transactionId}
  position="right"
  initialExpanded={false}
/>
```

## Implementation Details

### Communication Flow

1. User initiates communication through the ClearCommunicationBar or ChannelCommunication component
2. The system identifies available communication channels for the recipient
3. User selects the appropriate channel and composes the message
4. AI-assisted suggestions provide content recommendations and compliance checks
5. Message is sent through the selected channel and archived for compliance
6. Recipients receive notifications based on their notification preferences

### Compliance Features

- All communications are automatically archived for regulatory compliance
- AI-powered content scanning ensures adherence to communication policies
- Sensitive information detection with automatic redaction suggestions
- Audit logs for all communication activities
- Automated retention periods based on regulatory requirements

## Security Considerations

- End-to-end encryption for all in-app messages
- Secure handling of SMS and email communication
- Role-based access controls for communication threads
- Secure document sharing with access tracking
- Communication isolation between unrelated transactions

## Integration with Other Services

The Communications components integrate with several other Eva AI services:

- **Document Service**: Enables secure document sharing within conversations
- **Risk Assessment**: Provides risk context for communication threads
- **Eva AI Core**: Powers intelligent message suggestions and compliance checks
- **User Management**: Handles user permissions and access control
- **Transaction Service**: Links communications to specific deals and transactions

## Future Enhancements

- Video conferencing integration for face-to-face meetings
- Advanced natural language processing for improved AI suggestions
- Expanded channel integrations (WhatsApp, Slack, Teams)
- Enhanced analytics for communication effectiveness
- Template library for common communication scenarios
- Voice transcription and analysis

## Usage Examples

### Complete Communication Flow

```jsx
// In your transaction management component
import ChannelCommunication from './components/communications/ChannelCommunication';
import { useState, useEffect } from 'react';

const TransactionCommunication = ({ transactionId }) => {
  const [participants, setParticipants] = useState([]);
  
  useEffect(() => {
    // Fetch transaction participants
    const fetchParticipants = async () => {
      const response = await getTransactionParticipants(transactionId);
      setParticipants(response.data);
    };
    
    fetchParticipants();
  }, [transactionId]);
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Communication</h1>
      
      <div className="bg-white shadow-md rounded-lg">
        <ChannelCommunication
          transactionId={transactionId}
          participants={participants}
          defaultChannel="in-app"
          allowAttachments={true}
          complianceLevel="standard"
        />
      </div>
    </div>
  );
};
```

### Adding a New Contact

```jsx
// In your contact management component
import AddContactModal from './components/communications/AddContactModal';
import { useState } from 'react';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [showAddContact, setShowAddContact] = useState(false);
  
  const handleContactAdded = (newContact) => {
    setContacts([...contacts, newContact]);
    setShowAddContact(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Communication Contacts</h2>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded-md"
          onClick={() => setShowAddContact(true)}
        >
          Add Contact
        </button>
      </div>
      
      {/* Contact list rendering */}
      <div className="space-y-2">
        {contacts.map(contact => (
          <div key={contact.id} className="p-3 border rounded-md flex justify-between items-center">
            <div>
              <p className="font-medium">{contact.name}</p>
              <p className="text-sm text-gray-600">{contact.email}</p>
            </div>
            <div className="flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">Message</button>
              <button className="text-gray-600 hover:text-gray-800">Edit</button>
            </div>
          </div>
        ))}
      </div>
      
      {showAddContact && (
        <AddContactModal
          onContactAdded={handleContactAdded}
          onClose={() => setShowAddContact(false)}
          existingContacts={contacts}
        />
      )}
    </div>
  );
}; 