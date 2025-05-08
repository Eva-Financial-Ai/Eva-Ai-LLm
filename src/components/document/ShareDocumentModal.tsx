import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';

interface ShareDocumentModalProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onShare: (recipients: Array<{email: string, permission: string, needsPassword: boolean}>) => void;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({ file, isOpen, onClose, onShare }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [permission, setPermission] = useState<'viewer' | 'editor' | 'signer' | 'commenter'>('viewer');
  const [recipients, setRecipients] = useState<Array<{email: string, permission: string, needsPassword: boolean}>>([]);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [requireForAll, setRequireForAll] = useState(false);
  const [sendTextNotification, setSendTextNotification] = useState(false);
  
  // Add recipient to the list
  const handleAddRecipient = () => {
    if (email && !recipients.some(r => r.email === email)) {
      setRecipients([...recipients, { 
        email, 
        permission,
        needsPassword: passwordProtect && requireForAll
      }]);
      setEmail('');
    }
  };
  
  // Remove recipient from the list
  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r.email !== email));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password if enabled
    if (passwordProtect && (!password || password !== passwordConfirm)) {
      alert('Please ensure your password and confirmation match.');
      return;
    }
    
    // If we have recipients, share the document
    if (recipients.length > 0) {
      // In a real implementation, you would hash the password before sending
      if (passwordProtect) {
        // Update file with password protection
        file.isPasswordProtected = true;
        file.passwordHash = password; // In reality, this would be hashed
      }
      
      onShare(recipients);
      onClose();
    }
  };
  
  // Get permission label
  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'viewer': return 'Can view';
      case 'editor': return 'Can edit';
      case 'signer': return 'Can sign';
      case 'commenter': return 'Can comment';
      default: return 'Unknown';
    }
  };

  const handleShare = () => {
    // In a real implementation, this would call an API to share the document
    console.log('Sharing document:', file.id);
    console.log('With email:', email);
    console.log('With phone:', phoneNumber);
    console.log('With permission:', permission);
    console.log('Send text notification:', sendTextNotification);
    
    // Mock successful share
    alert(`Document shared with ${email} successfully!`);
    
    // Reset form and close modal
    setEmail('');
    setPhoneNumber('');
    setPermission('viewer');
    setSendTextNotification(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-medium text-gray-700">Share Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <svg className="w-10 h-10 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-500">{file.size ? `${Math.round(file.size / 1024)} KB` : ''} • {file.type.toUpperCase()}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add people</label>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as any)}
                className="ml-2 shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-32 sm:text-sm border-gray-300 rounded-md"
              >
                <option value="viewer">Viewer</option>
                <option value="commenter">Commenter</option>
                <option value="editor">Editor</option>
                <option value="signer">Signer</option>
              </select>
              <button
                type="button"
                onClick={handleAddRecipient}
                disabled={!email}
                className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Mobile Phone Number (for notifications)
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          {/* Password Protection Section */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={passwordProtect}
                  onChange={(e) => setPasswordProtect(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Password protect this document</span>
              </label>
            </div>
            
            {passwordProtect && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={requireForAll}
                      onChange={(e) => setRequireForAll(e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Require password for all recipients</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Recipients List */}
          {recipients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recipients</h4>
              <div className="bg-gray-50 rounded-md border divide-y">
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex justify-between items-center p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{recipient.email}</p>
                      <p className="text-xs text-gray-500">
                        {getPermissionLabel(recipient.permission)} 
                        {recipient.needsPassword && ' • Password required'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRecipient(recipient.email)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="sendTextNotification"
              type="checkbox"
              checked={sendTextNotification}
              onChange={(e) => setSendTextNotification(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="sendTextNotification" className="ml-2 block text-sm text-gray-900">
              Send SMS notification when document is ready to view
            </label>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recipients.length === 0}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareDocumentModal; 