import React, { useState, useEffect } from 'react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'broker' | 'originator' | 'vendor' | 'lender';
  company?: string;
}

interface ShareApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  businessName?: string;
  onShare: (recipients: Recipient[], message: string, expirationDays: number) => void;
}

const ShareApplicationModal: React.FC<ShareApplicationModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  businessName = 'Application',
  onShare
}) => {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [customRecipientEmail, setCustomRecipientEmail] = useState('');
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [customRecipientRole, setCustomRecipientRole] = useState<'broker' | 'originator' | 'vendor' | 'lender'>('broker');
  const [customRecipientCompany, setCustomRecipientCompany] = useState('');
  const [expirationDays, setExpirationDays] = useState(14);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch recipients (mock data for demo)
  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For demo, using mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockRecipients: Recipient[] = [
          { 
            id: 'rec-001', 
            name: 'John Smith', 
            email: 'john.smith@financialbrokers.com', 
            role: 'broker', 
            company: 'Financial Brokers Inc.' 
          },
          { 
            id: 'rec-002', 
            name: 'Maria Rodriguez', 
            email: 'maria@loanorigination.com', 
            role: 'originator', 
            company: 'Loan Origination Partners' 
          },
          { 
            id: 'rec-003', 
            name: 'Robert Chen', 
            email: 'robert.chen@capitallenders.com', 
            role: 'lender', 
            company: 'Capital Lenders LLC' 
          },
          { 
            id: 'rec-004', 
            name: 'Sophia Williams', 
            email: 'swilliams@docuverify.com', 
            role: 'vendor', 
            company: 'DocuVerify Services' 
          },
          { 
            id: 'rec-005', 
            name: 'Thomas Johnson', 
            email: 'tjohnson@mortgagepro.com', 
            role: 'broker', 
            company: 'Mortgage Professionals' 
          }
        ];
        
        setRecipients(mockRecipients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipients:', error);
        setLoading(false);
      }
    };
    
    if (isOpen) {
      fetchRecipients();
      // Set default message
      setMessage(`I'm sharing the credit application for ${businessName} for your review. Please help us process this application.`);
    }
  }, [isOpen, businessName]);

  // Handle recipient selection
  const toggleRecipient = (id: string) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(selectedRecipients.filter(recipientId => recipientId !== id));
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
    }
  };

  // Handle custom recipient addition
  const addCustomRecipient = () => {
    // Basic email validation
    if (!customRecipientEmail.match(/^\S+@\S+\.\S+$/)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!customRecipientName.trim()) {
      setError('Please enter a recipient name');
      return;
    }
    
    const newRecipient: Recipient = {
      id: `custom-${Date.now()}`,
      name: customRecipientName,
      email: customRecipientEmail,
      role: customRecipientRole,
      company: customRecipientCompany || undefined
    };
    
    setRecipients([...recipients, newRecipient]);
    setSelectedRecipients([...selectedRecipients, newRecipient.id]);
    
    // Reset form
    setCustomRecipientEmail('');
    setCustomRecipientName('');
    setCustomRecipientCompany('');
    setShowAddCustom(false);
    setError('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRecipients.length === 0) {
      setError('Please select at least one recipient');
      return;
    }
    
    const selectedRecipientObjects = recipients.filter(recipient => 
      selectedRecipients.includes(recipient.id)
    );
    
    onShare(selectedRecipientObjects, message, expirationDays);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Share Application
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Send a pre-filled credit application for {businessName} to brokers, originators, or vendors.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-4">
                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Recipients
                  </label>
                  
                  {loading ? (
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <ul className="divide-y divide-gray-200 max-h-48 overflow-y-auto">
                        {recipients.map(recipient => (
                          <li key={recipient.id} className="p-3 hover:bg-gray-50">
                            <label className="flex items-start cursor-pointer">
                              <div className="flex items-center h-5">
                                <input
                                  type="checkbox"
                                  checked={selectedRecipients.includes(recipient.id)}
                                  onChange={() => toggleRecipient(recipient.id)}
                                  className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <div className="font-medium text-gray-700">{recipient.name}</div>
                                <div className="text-gray-500">{recipient.email}</div>
                                <div className="text-xs text-gray-400">
                                  {recipient.role.charAt(0).toUpperCase() + recipient.role.slice(1)} 
                                  {recipient.company && ` • ${recipient.company}`}
                                </div>
                              </div>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!showAddCustom ? (
                    <button
                      type="button"
                      onClick={() => setShowAddCustom(true)}
                      className="mt-2 text-sm text-primary-600 hover:text-primary-500 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Custom Recipient
                    </button>
                  ) : (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Recipient</h4>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Name*</label>
                          <input
                            type="text"
                            value={customRecipientName}
                            onChange={(e) => setCustomRecipientName(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Email*</label>
                          <input
                            type="email"
                            value={customRecipientEmail}
                            onChange={(e) => setCustomRecipientEmail(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Role*</label>
                          <select
                            value={customRecipientRole}
                            onChange={(e) => setCustomRecipientRole(e.target.value as any)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="broker">Broker</option>
                            <option value="originator">Originator</option>
                            <option value="vendor">Vendor</option>
                            <option value="lender">Lender</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                          <input
                            type="text"
                            value={customRecipientCompany}
                            onChange={(e) => setCustomRecipientCompany(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                            placeholder="Company Name"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowAddCustom(false)}
                          className="px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={addCustomRecipient}
                          className="px-3 py-1 text-xs text-white bg-primary-600 rounded-md hover:bg-primary-700"
                        >
                          Add Recipient
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add a personal message..."
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Expiration
                  </label>
                  <select
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Share Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareApplicationModal; 