import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import TopNavigation from '../components/layout/TopNavigation';

// Define types for our calendar components
interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  color: string;
}

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants: string[];
  conferenceLink?: string;
  provider: string;
  recording?: string;
  transcript?: string;
  analysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    keyTopics: string[];
    actionItems: string[];
  };
}

const CalendarIntegration: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'connect' | 'meetings' | 'recordings' | 'schedule'>(
    'connect'
  );
  const [activeProvider, setActiveProvider] = useState<string>('all');
  const [providers, setProviders] = useState<CalendarProvider[]>([
    {
      id: 'google',
      name: 'Google Calendar',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
      connected: false,
      color: '#4285F4',
    },
    {
      id: 'microsoft',
      name: 'Microsoft 365',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
      connected: false,
      color: '#0078D4',
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/IcalIcon.png',
      connected: false,
      color: '#FF3B30',
    },
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectSuccess, setConnectSuccess] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState<boolean>(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    participants: [''],
    provider: 'google',
  });

  // Load mock data for demo
  useEffect(() => {
    // Mock meetings data
    const mockMeetings: Meeting[] = [
      {
        id: 'm1',
        title: 'Equipment Financing Consultation',
        date: new Date(Date.now() + 86400000), // Tomorrow
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        participants: ['John Smith', 'Sarah Johnson', 'Mike Williams'],
        provider: 'google',
        conferenceLink: 'https://meet.google.com/abc-defg-hij',
      },
      {
        id: 'm2',
        title: 'Quarterly Business Review',
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        startTime: '2:00 PM',
        endTime: '3:30 PM',
        participants: ['Lisa Thompson', 'James Davidson', 'Karen Peters', 'Robert Miller'],
        provider: 'microsoft',
        conferenceLink: 'https://teams.microsoft.com/meet/123456',
      },
      {
        id: 'm3',
        title: 'Client Onboarding',
        date: new Date(Date.now() - 86400000), // Yesterday
        startTime: '9:00 AM',
        endTime: '10:00 AM',
        participants: ['Emma Wilson', 'David Brown'],
        provider: 'google',
        recording: 'https://storage.example.com/recordings/onboarding-123.mp4',
        transcript: 'https://storage.example.com/transcripts/onboarding-123.txt',
        analysis: {
          sentiment: 'positive',
          keyTopics: ['Equipment needs', 'Financing options', 'Timeline expectations'],
          actionItems: [
            'Send contract by Friday',
            'Schedule follow-up in 2 weeks',
            'Prepare financing proposal',
          ],
        },
      },
    ];

    setMeetings(mockMeetings);
  }, []);

  // Connect calendar provider function
  const connectProvider = (providerId: string) => {
    setActiveProvider(providerId);
    setIsConnecting(true);

    // Simulate OAuth flow with a popup window
    const width = 500;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    // Create a mock popup that will self-close
    const popup = window.open(
      'about:blank',
      'calendar-oauth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>${providers.find(p => p.id === providerId)?.name} Login</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                padding: 2rem;
                text-align: center;
                background-color: #f9fafb;
              }
              .container {
                max-width: 400px;
                margin: 0 auto;
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
              }
              h2 {
                color: #111827;
                margin-bottom: 1.5rem;
              }
              p {
                color: #6b7280;
                margin-bottom: 2rem;
              }
              .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border-left-color: #3b82f6;
                animation: spin 1s linear infinite;
                margin: 0 auto 1.5rem;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .auth-btn {
                background-color: ${providers.find(p => p.id === providerId)?.color || '#3b82f6'};
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                font-weight: 500;
                cursor: pointer;
              }
              .auth-btn:hover {
                opacity: 0.9;
              }
              .logo {
                width: 64px;
                height: 64px;
                margin: 0 auto 1.5rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img class="logo" src="${providers.find(p => p.id === providerId)?.icon}" alt="Calendar Logo" />
              <h2>Connecting to ${providers.find(p => p.id === providerId)?.name}</h2>
              <p>Authorizing EVA Platform to access your calendar data...</p>
              <div class="spinner"></div>
              <p>This window will close automatically when completed.</p>
              <button class="auth-btn" onclick="simulateAuth()">Authorize</button>
            </div>
            <script>
              function simulateAuth() {
                document.querySelector('.auth-btn').style.display = 'none';
                document.querySelector('.spinner').style.display = 'block';
                setTimeout(() => {
                  window.close();
                }, 2000);
              }
            </script>
          </body>
        </html>
      `);

      // Set an interval to check if the popup has closed
      const checkPopupInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupInterval);

          // Update the provider state
          setProviders(prevProviders =>
            prevProviders.map(provider =>
              provider.id === providerId ? { ...provider, connected: true } : provider
            )
          );
          setIsConnecting(false);
          setConnectSuccess(true);

          // Hide success message after 3 seconds
          setTimeout(() => {
            setConnectSuccess(false);
          }, 3000);
        }
      }, 500);

      // Fallback if the user doesn't interact with the popup
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          setIsConnecting(false);
        }
      }, 30000); // 30 seconds timeout
    } else {
      // If popup blocked, simulate without popup
      setTimeout(() => {
        setProviders(prevProviders =>
          prevProviders.map(provider =>
            provider.id === providerId ? { ...provider, connected: true } : provider
          )
        );
        setIsConnecting(false);
        setConnectSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setConnectSuccess(false);
        }, 3000);
      }, 2000);
    }
  };

  // Schedule new meeting function
  const scheduleMeeting = () => {
    setIsNewMeetingModalOpen(true);
  };

  // Function to handle creating a new meeting
  const createNewMeeting = () => {
    if (!newMeeting.title || newMeeting.participants.length === 0) {
      return; // Validation check
    }

    const meeting: Meeting = {
      id: `m${Date.now()}`,
      title: newMeeting.title,
      date: new Date(newMeeting.date),
      startTime: newMeeting.startTime,
      endTime: newMeeting.endTime,
      participants: newMeeting.participants.filter(p => p.trim() !== ''),
      provider: newMeeting.provider,
    };

    setMeetings([...meetings, meeting]);
    setIsNewMeetingModalOpen(false);
    setNewMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      participants: [''],
      provider: 'google',
    });
  };

  // Handle adding a participant field
  const addParticipantField = () => {
    setNewMeeting({
      ...newMeeting,
      participants: [...newMeeting.participants, ''],
    });
  };

  // Handle updating a participant field
  const updateParticipant = (index: number, value: string) => {
    const updatedParticipants = [...newMeeting.participants];
    updatedParticipants[index] = value;
    setNewMeeting({
      ...newMeeting,
      participants: updatedParticipants,
    });
  };

  // Render the calendar connections tab
  const renderConnectTab = () => (
    <div className="space-y-6">
      {connectSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800">Calendar connected successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Connect Your Calendars</h2>
          <p className="text-sm text-gray-600">
            Link your calendar accounts to manage meetings and schedule events
          </p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providers.map(provider => (
              <div key={provider.id} className="border rounded-lg p-6 flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src={provider.icon} alt={provider.name} className="max-h-full max-w-full" />
                </div>
                <h3 className="text-lg font-medium mb-2">{provider.name}</h3>
                <p className="text-gray-500 text-center mb-4">
                  {provider.connected
                    ? 'Connected and synced'
                    : 'Connect to sync meetings and enable scheduling'}
                </p>

                <button
                  onClick={() => connectProvider(provider.id)}
                  disabled={provider.connected || isConnecting}
                  className={`px-4 py-2 rounded-md ${
                    provider.connected
                      ? 'bg-gray-100 text-gray-600 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } font-medium`}
                >
                  {isConnecting && provider.id === activeProvider ? (
                    <span className="flex items-center">
                      <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                      Connecting...
                    </span>
                  ) : provider.connected ? (
                    <span className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Connected
                    </span>
                  ) : (
                    'Connect'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render the meetings tab
  const renderMeetingsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-md ${
              viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-md ${
              viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-md ${
              viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Month
          </button>
        </div>
        <button
          onClick={scheduleMeeting}
          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Schedule Meeting
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Upcoming Meetings</h2>
          <p className="text-sm text-gray-600">Your schedule for the next few days</p>
        </div>

        <div className="p-4">
          {meetings
            .filter(meeting => meeting.date >= new Date(Date.now() - 86400000))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map(meeting => (
              <div
                key={meeting.id}
                className="border-b border-gray-100 last:border-0 p-4 flex items-start hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => setSelectedMeeting(meeting)}
              >
                <div
                  className="w-2 h-12 rounded-full mr-4"
                  style={{
                    backgroundColor:
                      providers.find(p => p.id === meeting.provider)?.color || '#CBD5E1',
                  }}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    {meeting.conferenceLink && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Video Meeting
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {meeting.startTime} - {meeting.endTime} (
                    {new Date(meeting.date).toLocaleDateString()})
                  </div>
                  <div className="mt-1 text-sm text-gray-500 flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {meeting.participants.length} participants
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Render meeting recordings tab
  const renderRecordingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Meeting Recordings & Transcripts</h2>
          <p className="text-sm text-gray-600">Access past meeting recordings and AI analysis</p>
        </div>

        <div className="p-4">
          {meetings
            .filter(meeting => meeting.recording)
            .map(meeting => (
              <div
                key={meeting.id}
                className="border-b border-gray-100 last:border-0 p-4 hover:bg-gray-50 rounded-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(meeting.date).toLocaleDateString()} ({meeting.startTime} -{' '}
                      {meeting.endTime})
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {meeting.recording && (
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <VideoCameraIcon className="h-4 w-4 mr-1" />
                        Recording
                      </button>
                    )}
                    {meeting.transcript && (
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        Transcript
                      </button>
                    )}
                  </div>
                </div>

                {meeting.analysis && (
                  <div className="mt-4 bg-gray-50 rounded-md p-3">
                    <h4 className="font-medium text-gray-800 mb-2">AI Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <h5 className="text-xs text-gray-500 uppercase">Sentiment</h5>
                        <p
                          className={`text-sm ${
                            meeting.analysis.sentiment === 'positive'
                              ? 'text-green-600'
                              : meeting.analysis.sentiment === 'negative'
                                ? 'text-red-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {meeting.analysis.sentiment.charAt(0).toUpperCase() +
                            meeting.analysis.sentiment.slice(1)}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-xs text-gray-500 uppercase">Key Topics</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {meeting.analysis.keyTopics.map(topic => (
                            <span
                              key={topic}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-xs text-gray-500 uppercase">Action Items</h5>
                        <ul className="text-sm text-gray-700 list-disc pl-4 mt-1">
                          {meeting.analysis.actionItems.map(item => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Render the schedule assistant tab
  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Meeting Scheduling Assistant</h2>
          <p className="text-sm text-gray-600">Let EVA AI help schedule your next meeting</p>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">EVA AI Scheduling Assistant</h3>
            <p className="text-blue-700 mb-4">
              Our AI assistant can help you schedule meetings based on everyone's availability and
              suggest the best times.
            </p>
            <div className="mt-2 flex">
              <button
                onClick={() => setIsNewMeetingModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create New Meeting
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Template Library</h3>
              <div className="space-y-2">
                <div className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Client Consultation</h4>
                  <p className="text-sm text-gray-600">
                    30-minute meeting template for initial client consultations
                  </p>
                </div>
                <div className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Team Check-in</h4>
                  <p className="text-sm text-gray-600">15-minute quick update with your team</p>
                </div>
                <div className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium">Quarterly Business Review</h4>
                  <p className="text-sm text-gray-600">
                    60-minute comprehensive business review with clients
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">Recent Scheduling Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Equipment Demo scheduled with Acme Corp</p>
                    <p className="text-xs text-gray-500">Tomorrow at 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Awaiting response from 2 participants</p>
                    <p className="text-xs text-gray-500">For Strategy Meeting on Friday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Meeting details modal
  const renderMeetingDetailsModal = () => {
    if (!selectedMeeting) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Meeting Details</h2>
            <button
              onClick={() => setSelectedMeeting(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-medium mb-2">{selectedMeeting.title}</h3>
            <div className="flex items-center text-gray-500 mb-4">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>
                {new Date(selectedMeeting.date).toLocaleDateString()} ({selectedMeeting.startTime} -{' '}
                {selectedMeeting.endTime})
              </span>
            </div>

            {selectedMeeting.conferenceLink && (
              <a
                href={selectedMeeting.conferenceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
              >
                Join Video Meeting
              </a>
            )}

            <div className="mb-4">
              <h4 className="font-medium mb-2">Participants</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                {selectedMeeting.participants.map((participant, index) => (
                  <div key={index} className="flex items-center mb-2 last:mb-0">
                    <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span>{participant}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                <CalendarIcon className="h-5 w-5 mr-1" />
                Add to Calendar
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 border border-blue-600 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                <PlusIcon className="h-5 w-5 mr-1" />
                Invite More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // New Meeting Modal
  const renderNewMeetingModal = () => {
    if (!isNewMeetingModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Create New Meeting</h2>
            <button
              onClick={() => setIsNewMeetingModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="meeting-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meeting Title
                </label>
                <input
                  type="text"
                  id="meeting-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newMeeting.title}
                  onChange={e => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="Enter meeting title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="meeting-date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="meeting-date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.date}
                    onChange={e => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="meeting-start"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="meeting-start"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.startTime}
                    onChange={e => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="meeting-end"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="meeting-end"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newMeeting.endTime}
                    onChange={e => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                <div className="space-y-2">
                  {newMeeting.participants.map((participant, index) => (
                    <input
                      key={index}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter participant name or email"
                      value={participant}
                      onChange={e => updateParticipant(index, e.target.value)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addParticipantField}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Participant
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="calendar-provider"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Calendar Provider
                </label>
                <select
                  id="calendar-provider"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newMeeting.provider}
                  onChange={e => setNewMeeting({ ...newMeeting, provider: e.target.value })}
                >
                  <option value="google">Google Calendar</option>
                  <option value="microsoft">Microsoft 365</option>
                  <option value="apple">Apple Calendar</option>
                </select>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsNewMeetingModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createNewMeeting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Meeting
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pl-20 sm:pl-72 w-full">
      <div className="container mx-auto px-2 py-6 max-w-full">
        <TopNavigation title="Calendar Integration" currentTransactionId="TX-123" />

        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Calendar Integration</h1>
              <p className="text-gray-600">
                Connect calendars, manage meetings, and schedule appointments
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('connect')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'connect'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Connect Calendars
              </button>
              <button
                onClick={() => setActiveTab('meetings')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'meetings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meetings
              </button>
              <button
                onClick={() => setActiveTab('recordings')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'recordings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recordings & Transcripts
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Scheduling Assistant
              </button>
            </nav>
          </div>

          {/* Tab content */}
          {activeTab === 'connect' && renderConnectTab()}
          {activeTab === 'meetings' && renderMeetingsTab()}
          {activeTab === 'recordings' && renderRecordingsTab()}
          {activeTab === 'schedule' && renderScheduleTab()}
        </div>
      </div>

      {/* Meeting details modal */}
      {selectedMeeting && renderMeetingDetailsModal()}
      {/* New meeting modal */}
      {renderNewMeetingModal()}
    </div>
  );
};

export default CalendarIntegration;
