import React, { useState } from 'react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'vendor' | 'broker' | 'other';
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
}

interface DocumentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSent: (recipients: Recipient[], documents: DocumentType[], deadline: Date | null, message: string) => void;
  transactionId: string;
}

const DocumentRequestModal: React.FC<DocumentRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestSent,
  transactionId
}) => {
  // Sample list of potential recipients - in a real app, this would be fetched from API
  const [availableRecipients, setAvailableRecipients] = useState<Recipient[]>([
    { id: 'rec-001', name: 'John Smith', email: 'john@acmecorp.com', role: 'owner' },
    { id: 'rec-002', name: 'Acme Equipment LLC', email: 'vendor@acmeequipment.com', role: 'vendor' },
    { id: 'rec-003', name: 'Capital Brokers Inc', email: 'agent@capitalbrokers.com', role: 'broker' },
    { id: 'rec-004', name: 'Jane Wilson', email: 'jane@othercompany.com', role: 'other' }
  ]);

  // Sample document types - in a real app, this would be fetched from API
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState<DocumentType[]>([
    { id: 'doc-001', name: 'Business Financial Statements', description: 'Last 2 years of financial statements including P&L and balance sheet' },
    { id: 'doc-002', name: 'Tax Returns', description: 'Last 2 years of business tax returns' },
    { id: 'doc-003', name: 'Bank Statements', description: 'Last 3 months of business bank statements' },
    { id: 'doc-004', name: 'Equipment Invoice/Quote', description: 'Detailed invoice or quote for equipment being financed' },
    { id: 'doc-005', name: 'Business License', description: 'Current business license or registration' },
    { id: 'doc-006', name: 'Proof of Insurance', description: 'Insurance certificate for business and/or equipment' },
    { id: 'doc-007', name: 'Property Appraisal', description: 'Recent appraisal for property being financed' },
    { id: 'doc-008', name: 'Vendor W-9', description: 'W-9 form from equipment vendor' },
    { id: 'doc-009', name: 'Articles of Incorporation', description: 'Legal formation documents for the business' },
    { id: 'doc-010', name: 'Purchase Agreement', description: 'Signed purchase agreement for asset acquisition' }
  ]);

  // State for new recipient form
  const [showNewRecipientForm, setShowNewRecipientForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState<Omit<Recipient, 'id'>>({
    name: '',
    email: '',
    role: 'other'
  });

  // State for selected recipients and documents
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [deadline, setDeadline] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // State for filtering
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter recipients by role and search term
  const filteredRecipients = availableRecipients.filter(recipient => {
    const matchesRole = roleFilter === 'all' || recipient.role === roleFilter;
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Handle form submission
  const handleSubmit = () => {
    if (selectedRecipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    if (selectedDocuments.length === 0) {
      alert('Please select at least one document to request');
      return;
    }

    const recipients = availableRecipients.filter(r => selectedRecipients.includes(r.id));
    const documents = availableDocumentTypes.filter(d => selectedDocuments.includes(d.id));
    const deadlineDate = deadline ? new Date(deadline) : null;

    onRequestSent(recipients, documents, deadlineDate, message);
    onClose();
  };

  // Handle new recipient form submission
  const handleAddNewRecipient = () => {
    if (!newRecipient.name || !newRecipient.email) {
      alert('Please provide both name and email for the new recipient');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient.email)) {
      alert('Please provide a valid email address');
      return;
    }

    const newId = `rec-${Date.now()}`;
    const recipient: Recipient = {
      id: newId,
      ...newRecipient
    };

    setAvailableRecipients([...availableRecipients, recipient]);
    setSelectedRecipients([...selectedRecipients, newId]);
    setShowNewRecipientForm(false);
    setNewRecipient({
      name: '',
      email: '',
      role: 'other'
    });
  };

  // Toggle recipient selection
  const toggleRecipientSelection = (id: string) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter(r => r !== id));
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
    }
  };

  // Toggle document selection
  const toggleDocumentSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(d => d !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Request Documents</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left side: Recipients */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select Recipients</h3>
              
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex-1">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="owner">Owners</option>
                    <option value="vendor">Vendors</option>
                    <option value="broker">Brokers</option>
                    <option value="other">Others</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search recipients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="border rounded-md max-h-72 overflow-y-auto mb-4">
                {filteredRecipients.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {filteredRecipients.map(recipient => (
                      <li key={recipient.id} className="p-3 hover:bg-gray-50">
                        <label className="flex items-start cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRecipients.includes(recipient.id)}
                            onChange={() => toggleRecipientSelection(recipient.id)}
                            className="h-5 w-5 text-primary-600 rounded mt-0.5"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                            <div className="text-sm text-gray-500">{recipient.email}</div>
                            <div className="mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${recipient.role === 'owner' ? 'bg-blue-100 text-blue-800' : 
                                  recipient.role === 'vendor' ? 'bg-green-100 text-green-800' :
                                  recipient.role === 'broker' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'}`}
                              >
                                {recipient.role.charAt(0).toUpperCase() + recipient.role.slice(1)}
                              </span>
                            </div>
                          </div>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No recipients match your filters
                  </div>
                )}
              </div>

              {showNewRecipientForm ? (
                <div className="border rounded-md p-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Recipient</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={newRecipient.name}
                        onChange={(e) => setNewRecipient({...newRecipient, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={newRecipient.email}
                        onChange={(e) => setNewRecipient({...newRecipient, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        value={newRecipient.role}
                        onChange={(e) => setNewRecipient({
                          ...newRecipient, 
                          role: e.target.value as 'owner' | 'vendor' | 'broker' | 'other'
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="owner">Owner</option>
                        <option value="vendor">Vendor</option>
                        <option value="broker">Broker</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowNewRecipientForm(false)}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewRecipient}
                        className="px-3 py-1.5 text-sm border border-transparent rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Add Recipient
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewRecipientForm(true)}
                  className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Recipient
                </button>
              )}
            </div>

            {/* Right side: Documents & Options */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Select Documents to Request</h3>
              
              <div className="border rounded-md max-h-72 overflow-y-auto mb-4">
                <ul className="divide-y divide-gray-200">
                  {availableDocumentTypes.map(document => (
                    <li key={document.id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document.id)}
                          onChange={() => toggleDocumentSelection(document.id)}
                          className="h-5 w-5 text-primary-600 rounded mt-0.5"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{document.name}</div>
                          <div className="text-sm text-gray-500">{document.description}</div>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                  <input
                    type="date"
                    value={deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Add a message to the recipients explaining what documents you need and why"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequestModal; 