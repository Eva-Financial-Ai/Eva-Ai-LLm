import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import Modal from '../common/Modal/Modal';
import { validateForm, emailSchema, phoneSchema } from '../../utils/formValidation';
import { ApiErrorHandler } from '../../utils/apiErrorHandler';
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFormData,
} from '../../utils/inputSanitizer';

// Business interface to match Supabase schema
interface Business {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  type?: string;
  website?: string;
  created_at?: string;
}

// Enhanced Contact interface with business relation
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string; // Make this required to match CustomerRetentionContacts
  title: string; // Make this required to match CustomerRetentionContacts
  company: string;
  business_id?: string;
  business?: Business;
  type: string;
  status: string;
  lastContacted: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  businesses?: Business[]; // List of businesses from your database
  onAddBusiness?: (business: Omit<Business, 'id'>) => void;
}

// Define validation schema for contact form with business
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.string().length(0)),
  title: z.string().optional(),
  business_id: z.string().optional(),
  type: z.string().min(1, 'Contact type is required'),
  status: z.string().default('Active'),
  notes: z.string().optional(),
});

// Define validation schema for new business
const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  industry: z.string().optional(),
  size: z.string().optional(),
  type: z.string().optional(),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;
type BusinessFormData = z.infer<typeof businessSchema>;

// Mock data for businesses - will be replaced by props or API call
const mockBusinesses: Business[] = [
  { id: 'b1', name: 'Acme Financial', industry: 'Financial Services' },
  { id: 'b2', name: 'Global Equities Inc', industry: 'Investment' },
  { id: 'b3', name: 'Capital Resources LLC', industry: 'Consulting' },
  { id: 'b4', name: 'Premier Funding Group', industry: 'Lending' },
  { id: 'b5', name: 'Innovative Equipment Solutions', industry: 'Manufacturing' },
];

// Contact type options
const contactTypeOptions = [
  'Business Owner',
  'Broker',
  'Asset Seller',
  'Service Provider',
  'Lender',
  'Partner',
  'Other',
];

// Contact status options
const contactStatusOptions = ['Active', 'Inactive', 'Follow-up Required'];

const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
  businesses = mockBusinesses,
  onAddBusiness,
}) => {
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [businessId, setBusinessId] = useState<string>('');
  const [contactType, setContactType] = useState<string>('Business Owner');
  const [contactStatus, setContactStatus] = useState<string>('Active');
  const [notes, setNotes] = useState<string>('');

  // Business creation state
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessIndustry, setNewBusinessIndustry] = useState('');
  const [newBusinessSize, setNewBusinessSize] = useState('');
  const [newBusinessType, setNewBusinessType] = useState('');
  const [newBusinessWebsite, setNewBusinessWebsite] = useState('');

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingBusiness, setIsAddingBusiness] = useState(false);

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(sanitizeInput(e.target.value));
  };

  const handleBusinessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBusinessId(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContactType(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContactStatus(e.target.value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(sanitizeInput(e.target.value));
  };

  // Handle new business form inputs
  const handleNewBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBusinessName(sanitizeInput(e.target.value));
  };

  const handleNewBusinessIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBusinessIndustry(sanitizeInput(e.target.value));
  };

  const handleNewBusinessSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewBusinessSize(e.target.value);
  };

  const handleNewBusinessTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBusinessType(sanitizeInput(e.target.value));
  };

  const handleNewBusinessWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBusinessWebsite(sanitizeInput(e.target.value));
  };

  // Handle adding a new business
  const handleAddBusiness = () => {
    setIsAddingBusiness(true);
    setErrors({});

    try {
      // Prepare business data
      const businessData: BusinessFormData = {
        name: newBusinessName,
        industry: newBusinessIndustry || undefined,
        size: newBusinessSize || undefined,
        type: newBusinessType || undefined,
        website: newBusinessWebsite || undefined,
      };

      // Validate form data
      const result = validateForm(businessData, businessSchema);

      if (!result.success) {
        setErrors(result.errors);
        setIsAddingBusiness(false);
        return;
      }

      // Call onAddBusiness if provided, otherwise simulate
      if (onAddBusiness) {
        onAddBusiness(result.data);

        // In a real implementation, you would get the new business ID from the response
        // For now, simulate by generating a temporary ID
        const tempId = `b${Date.now()}`;
        setBusinessId(tempId);
      }

      // Reset form and close business form
      setNewBusinessName('');
      setNewBusinessIndustry('');
      setNewBusinessSize('');
      setNewBusinessType('');
      setNewBusinessWebsite('');
      setShowAddBusiness(false);
      setIsAddingBusiness(false);
    } catch (error) {
      ApiErrorHandler.handleError(error, undefined, message => {
        setErrors({ _businessForm: message });
      });
      setIsAddingBusiness(false);
    }
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
        title: title || undefined,
        business_id: businessId || undefined,
        type: contactType,
        status: contactStatus,
        notes: notes || undefined,
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
        company: '',
        phone: result.data.phone || '',
        title: result.data.title || '',
        status: result.data.status || 'Active',
        lastContacted: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onAddContact(newContact);

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setTitle('');
      setBusinessId('');
      setContactType('Business Owner');
      setContactStatus('Active');
      setNotes('');
      setIsSubmitting(false);

      onClose();
    } catch (error) {
      // Handle unexpected errors
      ApiErrorHandler.handleError(error, undefined, message => {
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
          <label htmlFor="contact-title" className="block text-sm font-medium text-gray-700">
            Title/Position
          </label>
          <input
            type="text"
            id="contact-title"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
              errors.title
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-primary-500'
            }`}
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter job title or position"
            aria-invalid={errors.title ? 'true' : 'false'}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="mt-1 text-sm text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Business selection with create option */}
        <div>
          <div className="flex justify-between items-center">
            <label htmlFor="contact-business" className="block text-sm font-medium text-gray-700">
              Associated Business
            </label>

            {!showAddBusiness && (
              <button
                type="button"
                onClick={() => setShowAddBusiness(true)}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                + Add New Business
              </button>
            )}
          </div>

          {!showAddBusiness ? (
            <select
              id="contact-business"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                errors.business_id
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary-500'
              }`}
              value={businessId}
              onChange={handleBusinessChange}
            >
              <option value="">Select a business</option>
              {businesses.map(business => (
                <option key={business.id} value={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="mt-2 p-4 border border-gray-300 rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-800">Create New Business</h4>
                <button
                  type="button"
                  onClick={() => setShowAddBusiness(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {errors._businessForm && (
                <div className="p-2 mb-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {errors._businessForm}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="business-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Name*
                  </label>
                  <input
                    type="text"
                    id="business-name"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
                      errors['business.name']
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-primary-500'
                    }`}
                    value={newBusinessName}
                    onChange={handleNewBusinessNameChange}
                    placeholder="Enter business name"
                    required
                  />
                  {errors['business.name'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['business.name']}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="business-industry"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Industry
                  </label>
                  <input
                    type="text"
                    id="business-industry"
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    value={newBusinessIndustry}
                    onChange={handleNewBusinessIndustryChange}
                    placeholder="Enter industry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="business-size"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Size
                  </label>
                  <select
                    id="business-size"
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    value={newBusinessSize}
                    onChange={handleNewBusinessSizeChange}
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="business-type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Type
                  </label>
                  <input
                    type="text"
                    id="business-type"
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    value={newBusinessType}
                    onChange={handleNewBusinessTypeChange}
                    placeholder="Enter business type"
                  />
                </div>

                <div>
                  <label
                    htmlFor="business-website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="business-website"
                    className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                    value={newBusinessWebsite}
                    onChange={handleNewBusinessWebsiteChange}
                    placeholder="Enter website URL"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAddBusiness}
                    disabled={isAddingBusiness}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isAddingBusiness ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isAddingBusiness ? (
                      <>
                        <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding...
                      </>
                    ) : (
                      'Add Business'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {errors.business_id && <p className="mt-1 text-sm text-red-600">{errors.business_id}</p>}
        </div>

        <div>
          <label htmlFor="contact-type" className="block text-sm font-medium text-gray-700">
            Contact Type*
          </label>
          <select
            id="contact-type"
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 ${
              errors.type
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-primary-500'
            }`}
            value={contactType}
            onChange={handleTypeChange}
            required
          >
            {contactTypeOptions.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label htmlFor="contact-status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="contact-status"
            className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            value={contactStatus}
            onChange={handleStatusChange}
          >
            {contactStatusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="contact-notes"
            rows={3}
            className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary-500 focus:border-primary-500"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add notes about this contact"
          ></textarea>
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
