import React, { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'internal' | 'external';
  role: string;
  channels: string[];
  avatar?: string;
  lastContact?: Date;
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
}

// Custom modal implementation
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
          aria-hidden="true"
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-6">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
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
          </div>
          <div className="mt-2">{children}</div>
        </div>
      </div>
    </div>
  );
};

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onAddContact }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'internal' | 'external'>('external');
  const [role, setRole] = useState('');
  const [channels, setChannels] = useState<string[]>(['email']);

  const handleChannelToggle = (channel: string) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name || !email || !role) {
      alert('Please fill in all required fields (Name, Email, Role)');
      return;
    }

    // Create new contact
    const newContact: Omit<Contact, 'id'> = {
      name,
      email,
      phone: phone || undefined,
      type,
      role,
      channels,
      lastContact: new Date(),
    };

    onAddContact(newContact);

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setType('external');
    setRole('');
    setChannels(['email']);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
            Name*
          </label>
          <input
            type="text"
            id="contact-name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter contact name"
            required
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
            Email*
          </label>
          <input
            type="email"
            id="contact-email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="contact-phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Type*</label>
          <div className="mt-1 flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="text-primary-600 focus:ring-primary-500"
                checked={type === 'internal'}
                onChange={() => setType('internal')}
              />
              <span className="ml-2 text-sm text-gray-700">Internal</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="text-primary-600 focus:ring-primary-500"
                checked={type === 'external'}
                onChange={() => setType('external')}
              />
              <span className="ml-2 text-sm text-gray-700">External</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="contact-role" className="block text-sm font-medium text-gray-700">
            Role*
          </label>
          <input
            type="text"
            id="contact-role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Borrower, Broker, Loan Officer"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Communication Channels</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
                checked={channels.includes('email')}
                onChange={() => handleChannelToggle('email')}
              />
              <span className="ml-2 text-sm text-gray-700">Email</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
                checked={channels.includes('call')}
                onChange={() => handleChannelToggle('call')}
              />
              <span className="ml-2 text-sm text-gray-700">Call</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
                checked={channels.includes('sms')}
                onChange={() => handleChannelToggle('sms')}
              />
              <span className="ml-2 text-sm text-gray-700">SMS</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
                checked={channels.includes('meeting')}
                onChange={() => handleChannelToggle('meeting')}
              />
              <span className="ml-2 text-sm text-gray-700">Meeting</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="text-primary-600 focus:ring-primary-500"
                checked={channels.includes('portal')}
                onChange={() => handleChannelToggle('portal')}
              />
              <span className="ml-2 text-sm text-gray-700">Portal</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            Add Contact
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContactModal;
