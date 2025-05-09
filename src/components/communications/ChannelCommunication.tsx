import React, { useState, useEffect, useCallback, useMemo } from 'react';
import optimizedDataService from '../../api/optimizedDataService';
import DataChunkLoader from '../common/DataChunkLoader';

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

interface CommunicationTemplate {
  id: string;
  title: string;
  body: string;
  channelType: ChannelType;
}

type ChannelType = 'email' | 'call' | 'sms' | 'meeting' | 'portal';

interface ChannelCommunicationProps {
  isOpen: boolean;
  onClose: () => void;
  channelType: ChannelType;
  contact: Contact | null;
  onSendCommunication?: (content: string) => void;
}

// Custom modal implementation
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
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

const ChannelCommunication: React.FC<ChannelCommunicationProps> = ({
  isOpen,
  onClose,
  channelType,
  contact,
  onSendCommunication,
}) => {
  // State for form fields
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [callDuration, setCallDuration] = useState(0);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [isMeetingScheduled, setIsMeetingScheduled] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDuration, setMeetingDuration] = useState(30);

  // State for data loading
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch templates based on channel type
  const fetchTemplates = useCallback(async () => {
    if (!channelType || !contact) return;

    setLoading(true);
    setLoadError(null);

    try {
      // Use optimized data service for template loading
      const data = await optimizedDataService.fetchData<CommunicationTemplate[]>(
        '/api/communication-templates',
        {
          channelType,
          contactType: contact.type,
        },
        {
          priority: 'high',
          onProgress: progress => {
            console.log(`Loading templates: ${progress}%`);
          },
        }
      );

      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading communication templates:', error);
      setLoadError('Unable to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [channelType, contact]);

  // Load templates when contact or channel type changes
  useEffect(() => {
    if (isOpen && contact) {
      fetchTemplates();
    }
  }, [isOpen, contact, channelType, fetchTemplates]);

  // Apply template to current message
  const applyTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      setSubject(template.title);
      setMessage(template.body.replace(/{name}/g, contact?.name || ''));
    },
    [templates, contact]
  );

  // Reset form fields when modal opens with new contact
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setSubject('');
      setCallDuration(0);
      setIsCallInProgress(false);
      setIsMeetingScheduled(false);
      setMeetingDate('');
      setMeetingTime('');
    }
  }, [isOpen, contact, channelType]);

  const handleSendEmail = async () => {
    if (!contact) return;

    try {
      // In a real app, send using the optimized data service
      await optimizedDataService.uploadData('/api/send-email', {
        recipient: contact.email,
        subject,
        message,
        contactId: contact.id,
      });

      // If onSendCommunication is provided, use it to send the communication
      if (onSendCommunication) {
        const fullMessage = `Subject: ${subject}\n\n${message}`;
        onSendCommunication(fullMessage);
      } else {
        alert(`Email sent to ${contact.name}`);
        onClose();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const handleSendSMS = () => {
    // In a real app, this would connect to an SMS API
    console.log('Sending SMS:', { to: contact?.phone, message });

    // If onSendCommunication is provided, use it to send the communication
    if (onSendCommunication) {
      onSendCommunication(message);
    } else {
      alert(`SMS sent to ${contact?.name}`);
      onClose();
    }
  };

  const handleStartCall = () => {
    // In a real app, this would initiate a call through a telephony API
    setIsCallInProgress(true);
    // Start timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Store timer ID in a ref or state to clear it later
    return () => clearInterval(timer);
  };

  const handleEndCall = () => {
    // In a real app, this would end the call
    setIsCallInProgress(false);
    console.log(`Call ended after ${callDuration} seconds`);

    // If onSendCommunication is provided, use it to send the communication record
    if (onSendCommunication) {
      const callSummary = `Call with ${contact?.name} lasted ${formatTime(callDuration)}`;
      onSendCommunication(callSummary);
    } else {
      alert(`Call with ${contact?.name} ended`);
      onClose();
    }
  };

  const handleScheduleMeeting = () => {
    // In a real app, this would schedule a meeting in a calendar system
    console.log('Scheduling meeting:', {
      with: contact?.name,
      date: meetingDate,
      time: meetingTime,
      durationMinutes: meetingDuration,
    });
    setIsMeetingScheduled(true);

    // If onSendCommunication is provided, use it to send the communication
    if (onSendCommunication) {
      const meetingDetails = `Meeting scheduled with ${contact?.name} on ${meetingDate} at ${meetingTime} for ${meetingDuration} minutes. Agenda: ${message}`;
      setTimeout(() => {
        onSendCommunication(meetingDetails);
      }, 1000);
    } else {
      setTimeout(() => {
        alert(`Meeting scheduled with ${contact?.name}`);
        onClose();
      }, 1500);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Memoized function to render the template selector
  const renderTemplateSelector = useMemo(() => {
    if (templates.length === 0) return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Choose a template</label>
        <select
          className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          onChange={e => applyTemplate(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a template
          </option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.title}
            </option>
          ))}
        </select>
      </div>
    );
  }, [templates, applyTemplate]);

  // Loading state component
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <DataChunkLoader
        id="communication-templates"
        fetchChunk={() => Promise.resolve({})}
        onComplete={() => {}}
        loadingComponent={
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading communication options...</p>
          </div>
        }
      />
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="email-to" className="block text-sm font-medium text-gray-700">
          To
        </label>
        <input
          type="text"
          id="email-to"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={contact?.email || ''}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="email-subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="email-subject"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Enter subject"
        />
      </div>
      <div>
        <label htmlFor="email-message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="email-message"
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message here"
        />
      </div>
      <div className="pt-2 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={handleSendEmail}
        >
          Send Email
        </button>
      </div>
    </div>
  );

  const renderSMSForm = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="sms-to" className="block text-sm font-medium text-gray-700">
          To
        </label>
        <input
          type="text"
          id="sms-to"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={contact?.phone || 'No phone number available'}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="sms-message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="sms-message"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your message here"
          maxLength={160}
        />
        <p className="text-xs text-gray-500 mt-1">{message.length}/160 characters</p>
      </div>
      <div className="pt-2 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={handleSendSMS}
        >
          Send SMS
        </button>
      </div>
    </div>
  );

  const renderCallInterface = () => (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center justify-center">
        {contact?.avatar ? (
          <img src={contact.avatar} alt={contact.name} className="h-20 w-20 rounded-full mb-3" />
        ) : (
          <div className="h-20 w-20 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center mb-3 text-2xl font-bold">
            {contact?.name.charAt(0)}
          </div>
        )}
        <h3 className="text-lg font-medium">{contact?.name}</h3>
        <p className="text-gray-500">{contact?.phone || 'No phone number available'}</p>
      </div>

      {isCallInProgress ? (
        <div className="space-y-4">
          <div className="text-2xl font-mono">{formatTime(callDuration)}</div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              className="bg-gray-200 p-4 rounded-full hover:bg-gray-300"
              title="Mute"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="bg-red-600 p-4 rounded-full hover:bg-red-700 text-white"
              onClick={handleEndCall}
              title="End Call"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="bg-gray-200 p-4 rounded-full hover:bg-gray-300"
              title="Speaker"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-green-600 p-4 rounded-full hover:bg-green-700 text-white"
            onClick={handleStartCall}
            disabled={!contact?.phone}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
        </div>
      )}

      {!isCallInProgress && (
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={onClose}
        >
          Cancel
        </button>
      )}
    </div>
  );

  const renderMeetingScheduler = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="meeting-with" className="block text-sm font-medium text-gray-700">
          Meeting with
        </label>
        <input
          type="text"
          id="meeting-with"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={contact?.name || ''}
          readOnly
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="meeting-date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="meeting-date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={meetingDate}
            onChange={e => setMeetingDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="meeting-time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <input
            type="time"
            id="meeting-time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={meetingTime}
            onChange={e => setMeetingTime(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="meeting-duration" className="block text-sm font-medium text-gray-700">
          Duration (minutes)
        </label>
        <select
          id="meeting-duration"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={meetingDuration}
          onChange={e => setMeetingDuration(parseInt(e.target.value))}
        >
          <option value={15}>15</option>
          <option value={30}>30</option>
          <option value={45}>45</option>
          <option value={60}>60</option>
        </select>
      </div>
      <div>
        <label htmlFor="meeting-agenda" className="block text-sm font-medium text-gray-700">
          Agenda
        </label>
        <textarea
          id="meeting-agenda"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Meeting agenda"
        />
      </div>
      <div className="pt-2 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={handleScheduleMeeting}
          disabled={!meetingDate || !meetingTime || isMeetingScheduled}
        >
          {isMeetingScheduled ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </div>
    </div>
  );

  const renderPortalMessage = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="portal-message" className="block text-sm font-medium text-gray-700">
          Portal Message
        </label>
        <textarea
          id="portal-message"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your portal message here"
        />
      </div>
      <div className="pt-2 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          onClick={() => {
            if (onSendCommunication) {
              onSendCommunication(message);
            } else {
              alert(`Portal message sent to ${contact?.name}`);
              onClose();
            }
          }}
        >
          Send to Portal
        </button>
      </div>
    </div>
  );

  // Map channel type to title
  const channelTitles: Record<ChannelType, string> = {
    email: 'Send Email',
    call: 'Phone Call',
    sms: 'Send SMS',
    meeting: 'Schedule Meeting',
    portal: 'Portal Message',
  };

  // Render appropriate form based on channel type
  const renderForm = () => {
    if (!contact) {
      return <div className="text-center py-4">No contact selected</div>;
    }

    switch (channelType) {
      case 'email':
        return renderEmailForm();
      case 'call':
        return renderCallInterface();
      case 'sms':
        return renderSMSForm();
      case 'meeting':
        return renderMeetingScheduler();
      case 'portal':
        return renderPortalMessage();
      default:
        return <div>Unsupported channel type</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${channelTitles[channelType]} ${contact ? `- ${contact.name}` : ''}`}
    >
      {renderForm()}
    </Modal>
  );
};

export default ChannelCommunication;
