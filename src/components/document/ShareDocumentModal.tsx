import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';

interface ShareDocumentModalProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onShare: (
    recipients: Array<{
      email: string;
      phoneNumber?: string;
      permission: string;
      needsPassword: boolean;
      notificationMethods: string[];
    }>
  ) => void;
}

const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  file,
  isOpen,
  onClose,
  onShare,
}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [permission, setPermission] = useState<'viewer' | 'editor' | 'signer' | 'commenter'>(
    'viewer'
  );
  const [recipients, setRecipients] = useState<
    Array<{
      email: string;
      phoneNumber?: string;
      permission: string;
      needsPassword: boolean;
      notificationMethods: string[];
    }>
  >([]);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [requireForAll, setRequireForAll] = useState(false);
  const [notificationMethods, setNotificationMethods] = useState<string[]>(['email']);
  const [error, setError] = useState<string | null>(null);

  // Add recipient to the list
  const handleAddRecipient = () => {
    // Validate email
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate phone if notification method is selected
    if (notificationMethods.includes('sms') && !phoneNumber) {
      setError('Please enter a phone number for SMS notifications');
      return;
    }

    if (email && !recipients.some(r => r.email === email)) {
      setRecipients([
        ...recipients,
        {
          email,
          phoneNumber: phoneNumber || undefined,
          permission,
          needsPassword: passwordProtect && requireForAll,
          notificationMethods,
        },
      ]);
      setEmail('');
      setPhoneNumber('');
      setError(null);
    }
  };

  // Remove recipient from the list
  const handleRemoveRecipient = (email: string) => {
    setRecipients(recipients.filter(r => r.email !== email));
  };

  // Toggle notification method
  const toggleNotificationMethod = (method: string) => {
    if (notificationMethods.includes(method)) {
      setNotificationMethods(notificationMethods.filter(m => m !== method));
    } else {
      setNotificationMethods([...notificationMethods, method]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password if enabled
    if (passwordProtect && (!password || password !== passwordConfirm)) {
      setError('Please ensure your password and confirmation match.');
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
    } else {
      setError('Please add at least one recipient');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-medium text-gray-700">Share Document</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <svg
                className="w-10 h-10 text-gray-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-500">
                  {file.size ? `${Math.round(file.size / 1024)} KB` : ''} •{' '}
                  {file.type.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="share-email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="share-email"
                placeholder="Enter email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="share-phone" className="block text-sm font-medium text-gray-700">
                Phone Number (for SMS notifications)
              </label>
              <input
                type="tel"
                id="share-phone"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="share-permission" className="block text-sm font-medium text-gray-700">
                Permission
              </label>
              <select
                id="share-permission"
                value={permission}
                onChange={e => setPermission(e.target.value as any)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="viewer">Viewer (can view only)</option>
                <option value="editor">Editor (can make changes)</option>
                <option value="commenter">Commenter (can add comments)</option>
                <option value="signer">Signer (can sign document)</option>
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Notification Methods</p>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationMethods.includes('email')}
                    onChange={() => toggleNotificationMethod('email')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationMethods.includes('sms')}
                    onChange={() => toggleNotificationMethod('sms')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationMethods.includes('app')}
                    onChange={() => toggleNotificationMethod('app')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">In-App</span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={handleAddRecipient}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Recipient
              </button>
            </div>

            {recipients.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recipients</h4>
                <div className="border border-gray-200 rounded-md overflow-hidden max-h-40 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {recipients.map((recipient, index) => (
                      <li key={index} className="p-2 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{recipient.email}</p>
                          <div className="flex space-x-2">
                            <span className="text-xs text-gray-500">{recipient.permission}</span>
                            {recipient.phoneNumber && (
                              <span className="text-xs text-gray-500">{recipient.phoneNumber}</span>
                            )}
                            <span className="text-xs text-gray-500">
                              {recipient.notificationMethods.join(', ')}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(recipient.email)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={passwordProtect}
                  onChange={e => setPasswordProtect(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Password protect this document</span>
              </label>
            </div>

            {passwordProtect && (
              <div className="space-y-4 mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <label
                    htmlFor="share-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="share-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="share-password-confirm"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="share-password-confirm"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={requireForAll}
                    onChange={e => setRequireForAll(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Require password for all recipients
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
