import React, { useState } from 'react';
import { z } from 'zod';
import Modal from '../common/Modal/Modal';
import { validateForm, emailSchema, phoneSchema } from '../../utils/formValidation';
import { ApiErrorHandler } from '../../utils/apiErrorHandler';
import { sanitizeInput, sanitizeEmail, sanitizePhone, sanitizeFormData } from '../../utils/inputSanitizer';

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

// Define validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.string().length(0)),
  type: z.enum(['internal', 'external']),
  role: z.string().min(1, 'Role is required'),
  channels: z.array(z.string()).min(1, 'At least one channel is required'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const AddContactModal: React.FC<AddContactModalProps> = ({ isOpen, onClose, onAddContact }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'internal' | 'external'>('external');
  const [role, setRole] = useState('');
  const [channels, setChannels] = useState<string[]>(['email']);
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChannelToggle = (channel: string) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter(c => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  // Handle input with sanitization
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(sanitizeInput(e.target.value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(sanitizeEmail(e.target.value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(sanitizePhone(e.target.value));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(sanitizeInput(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare form data
      const formData: ContactFormData = {
        name,
        email,
        phone: phone || undefined,
        type,
        role,
        channels,
      };

      // Sanitize all form data as an extra layer of protection
      const sanitizedData = sanitizeFormData(formData);
      
      // Validate form data using Zod schema
      const result = validateForm(sanitizedData, contactSchema);

      if (!result.success) {
        setErrors(result.errors);
        setIsSubmitting(false);
        return;
      }

      // Create new contact with validated data
      const newContact: Omit<Contact, 'id'> = {
        ...result.data,
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
      setIsSubmitting(false);

      onClose();
    } catch (error) {
      // Handle unexpected errors
      ApiErrorHandler.handleError(error, undefined, (message) => {
        setErrors({ _form: message });
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Show global form error if present */}
        {errors._form && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{errors._form}</div>
        )}
      
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
            Name*
          </label>
          <input
            type="text"
            id="contact-name"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
              errors.name 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            value={name}
            onChange={handleNameChange}
            placeholder="Enter contact name"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            required
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
            Email*
          </label>
          <input
            type="email"
            id="contact-email"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
              errors.email 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter email address"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            required
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="contact-phone"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
              errors.phone 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-role" className="block text-sm font-medium text-gray-700">
            Role*
          </label>
          <input
            type="text"
            id="contact-role"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
              errors.role 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-primary-500'
            }`}
            value={role}
            onChange={handleRoleChange}
            placeholder="Enter contact role"
            aria-invalid={errors.role ? 'true' : 'false'}
            aria-describedby={errors.role ? 'role-error' : undefined}
            required
          />
          {errors.role && (
            <p id="role-error" className="mt-1 text-sm text-red-600">
              {errors.role}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Type*</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600"
                checked={type === 'internal'}
                onChange={() => setType('internal')}
              />
              <span className="ml-2">Internal</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600"
                checked={type === 'external'}
                onChange={() => setType('external')}
              />
              <span className="ml-2">External</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Communication Channels*
          </label>
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600"
                checked={channels.includes('email')}
                onChange={() => handleChannelToggle('email')}
              />
              <span className="ml-2">Email</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600"
                checked={channels.includes('phone')}
                onChange={() => handleChannelToggle('phone')}
              />
              <span className="ml-2">Phone</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600"
                checked={channels.includes('sms')}
                onChange={() => handleChannelToggle('sms')}
              />
              <span className="ml-2">SMS</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600"
                checked={channels.includes('in-person')}
                onChange={() => handleChannelToggle('in-person')}
              />
              <span className="ml-2">In-Person</span>
            </label>
          </div>
          {errors.channels && (
            <p className="mt-1 text-sm text-red-600">{errors.channels}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Add Contact'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContactModal;
