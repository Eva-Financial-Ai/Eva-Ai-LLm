import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import PageLayout from '../components/layout/PageLayout';

// Define calendar interface
interface CalendarConnection {
  id: string;
  provider: 'google' | 'microsoft' | 'apple';
  name: string;
  email: string;
  connected: boolean;
  lastSynced?: string;
  calendars: CalendarDetails[];
}

interface CalendarDetails {
  id: string;
  name: string;
  color: string;
  selected: boolean;
  events?: number;
}

// Mock data for calendar connections
const initialCalendarConnections: CalendarConnection[] = [
  {
    id: 'google-1234',
    provider: 'google',
    name: 'Google Calendar',
    email: 'user@gmail.com',
    connected: true,
    lastSynced: new Date().toISOString(),
    calendars: [
      { id: 'g1', name: 'Primary Calendar', color: '#4285f4', selected: true, events: 24 },
      { id: 'g2', name: 'Work', color: '#34a853', selected: true, events: 18 },
      { id: 'g3', name: 'Family', color: '#fbbc05', selected: false, events: 6 },
    ]
  }
];

const CalendarIntegration: React.FC = () => {
  const navigate = useNavigate();
  const [calendarConnections, setCalendarConnections] = useState<CalendarConnection[]>(initialCalendarConnections);
  const [activeProvider, setActiveProvider] = useState<string | null>('google');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState<Record<string, boolean>>({});
  const [syncInProgress, setSyncInProgress] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    showNotifications: true,
    sendEmailReminders: true,
    autoSync: true,
    reminderTime: '15'
  });

  // Preselect all calendars on initial load
  useEffect(() => {
    const initialSelections: Record<string, boolean> = {};
    calendarConnections.forEach(connection => {
      connection.calendars.forEach(calendar => {
        initialSelections[calendar.id] = calendar.selected;
      });
    });
    setSelectedCalendars(initialSelections);
  }, []);

  // Enhanced function to connect calendar
  const connectCalendar = (provider: 'google' | 'microsoft' | 'apple') => {
    setIsConnecting(true);
    
    // If provider already exists, don't add another
    if (calendarConnections.some(c => c.provider === provider)) {
      setIsConnecting(false);
      return;
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newConnection: CalendarConnection = {
        id: `${provider}-${Date.now()}`,
        provider,
        name: getProviderName(provider),
        email: getProviderEmail(provider),
        connected: true,
        lastSynced: new Date().toISOString(),
        calendars: generateMockCalendars(provider),
      };
      
      setCalendarConnections(prev => [...prev, newConnection]);
      setActiveProvider(provider);
      setIsConnecting(false);
    }, 1500);
  };

  // Enhanced function to disconnect calendar with confirmation
  const disconnectCalendar = (connectionId: string) => {
    if (window.confirm('Are you sure you want to disconnect this calendar? All synced events will no longer be available.')) {
      setCalendarConnections(prev => prev.filter(conn => conn.id !== connectionId));
    }
  };

  // Helper function to get provider display name
  const getProviderName = (provider: string): string => {
    switch (provider) {
      case 'google':
        return 'Google Calendar';
      case 'microsoft':
        return 'Microsoft Outlook';
      case 'apple':
        return 'Apple iCloud Calendar';
      default:
        return 'Calendar';
    }
  };

  // Helper function to get provider email
  const getProviderEmail = (provider: string): string => {
    switch (provider) {
      case 'google':
        return 'user@gmail.com';
      case 'microsoft':
        return 'user@outlook.com';
      case 'apple':
        return 'user@icloud.com';
      default:
        return '';
    }
  };

  // Helper function to generate mock calendars
  const generateMockCalendars = (provider: string): CalendarDetails[] => {
    switch (provider) {
      case 'google':
        return [
          { id: 'g1', name: 'Primary Calendar', color: '#4285f4', selected: true, events: 24 },
          { id: 'g2', name: 'Work', color: '#34a853', selected: true, events: 18 },
          { id: 'g3', name: 'Family', color: '#fbbc05', selected: false, events: 6 },
        ];
      case 'microsoft':
        return [
          { id: 'm1', name: 'Default Calendar', color: '#0078d4', selected: true, events: 16 },
          { id: 'm2', name: 'Meetings', color: '#7719aa', selected: true, events: 12 },
        ];
      case 'apple':
        return [
          { id: 'a1', name: 'iCloud Calendar', color: '#ff2d55', selected: true, events: 8 },
          { id: 'a2', name: 'Work', color: '#5ac8fa', selected: false, events: 4 },
        ];
      default:
        return [];
    }
  };

  // Toggle calendar selection
  const toggleCalendarSelection = (connectionId: string, calendarId: string) => {
    setCalendarConnections(prevConnections => 
      prevConnections.map(conn => {
        if (conn.id === connectionId) {
          return {
            ...conn,
            calendars: conn.calendars.map(cal => {
              if (cal.id === calendarId) {
                return { ...cal, selected: !cal.selected };
              }
              return cal;
            }),
          };
        }
        return conn;
      })
    );
  };

  // Enhanced sync function with visual feedback
  const syncCalendars = (connectionId: string) => {
    setSyncInProgress(connectionId);
    
    // Simulate sync with timeout
    setTimeout(() => {
      setCalendarConnections(prevConnections => 
        prevConnections.map(conn => {
          if (conn.id === connectionId) {
            // Update events count randomly to simulate new events
            const updatedCalendars = conn.calendars.map(cal => ({
              ...cal,
              events: cal.selected ? cal.events! + Math.floor(Math.random() * 3) : cal.events
            }));
            
            return {
              ...conn,
              lastSynced: new Date().toISOString(),
              calendars: updatedCalendars
            };
          }
          return conn;
        })
      );
      setSyncInProgress(null);
    }, 2000);
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    // This would be an API call in a real implementation
    alert('Calendar notification settings saved successfully!');
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageLayout title="Calendar Integration">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar Integration</h1>
          <p className="text-gray-600">Connect and manage your calendars for seamless scheduling</p>
        </div>

        {/* Calendar Provider Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Google Calendar */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" 
                alt="Google Calendar" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Sync events and appointments with your Google Calendar
            </p>
            <button
              onClick={() => connectCalendar('google')}
              disabled={isConnecting || calendarConnections.some(c => c.provider === 'google')}
              className={`w-full py-2 px-4 rounded-md ${
                calendarConnections.some(c => c.provider === 'google')
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {calendarConnections.some(c => c.provider === 'google') 
                ? 'Connected ✓' 
                : isConnecting && activeProvider === 'google' ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
          </div>

          {/* Microsoft Outlook */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
            <div className="flex items-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" 
                alt="Microsoft Outlook" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-lg font-medium text-gray-900">Microsoft Outlook</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Integrate with Outlook Calendar for seamless scheduling
            </p>
            <button
              onClick={() => connectCalendar('microsoft')}
              disabled={isConnecting || calendarConnections.some(c => c.provider === 'microsoft')}
              className={`w-full py-2 px-4 rounded-md ${
                calendarConnections.some(c => c.provider === 'microsoft')
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {calendarConnections.some(c => c.provider === 'microsoft') 
                ? 'Connected ✓' 
                : isConnecting && activeProvider === 'microsoft' ? 'Connecting...' : 'Connect Microsoft Outlook'}
            </button>
          </div>

          {/* Apple iCloud */}
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <div className="flex items-center mb-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/ICloud_logo.svg" 
                alt="Apple iCloud" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-lg font-medium text-gray-900">Apple iCloud</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Sync with your Apple Calendar across all your devices
            </p>
            <button
              onClick={() => connectCalendar('apple')}
              disabled={isConnecting || calendarConnections.some(c => c.provider === 'apple')}
              className={`w-full py-2 px-4 rounded-md ${
                calendarConnections.some(c => c.provider === 'apple')
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {calendarConnections.some(c => c.provider === 'apple') 
                ? 'Connected ✓' 
                : isConnecting && activeProvider === 'apple' ? 'Connecting...' : 'Connect Apple Calendar'}
            </button>
          </div>
        </div>

        {/* Connected Calendars */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Connected Calendars</h2>
            <span className="text-sm text-gray-500">
              {calendarConnections.length} {calendarConnections.length === 1 ? 'calendar' : 'calendars'} connected
            </span>
          </div>
          
          {calendarConnections.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto h-20 w-20 text-gray-400 mb-4">
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">No calendars connected yet.</p>
              <p className="text-sm text-gray-400">Connect a calendar above to start managing your appointments.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {calendarConnections.map((connection) => (
                <div key={connection.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ 
                          backgroundColor: 
                            connection.provider === 'google' 
                              ? '#4285f4' 
                              : connection.provider === 'microsoft'
                                ? '#0078d4'
                                : '#ff2d55' 
                        }}
                      >
                        <span className="text-white text-lg font-bold">
                          {connection.provider.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{connection.name}</h3>
                        <p className="text-sm text-gray-500">{connection.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={() => syncCalendars(connection.id)}
                        disabled={syncInProgress === connection.id}
                        className={`text-blue-600 hover:text-blue-800 mr-4 ${syncInProgress === connection.id ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        {syncInProgress === connection.id ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button 
                        onClick={() => disconnectCalendar(connection.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last synchronized: {connection.lastSynced ? formatDate(connection.lastSynced) : 'Never'}
                  </div>
                  
                  {/* Synced Calendars */}
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Your Calendars</h4>
                    <ul className="space-y-2">
                      {connection.calendars.map(calendar => (
                        <li key={calendar.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={calendar.id}
                              checked={calendar.selected}
                              onChange={() => toggleCalendarSelection(connection.id, calendar.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={calendar.id} className="ml-2 flex items-center">
                              <span 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: calendar.color }}
                              ></span>
                              <span className="text-gray-700">{calendar.name}</span>
                            </label>
                          </div>
                          {calendar.events !== undefined && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {calendar.events} events
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Calendar Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Calendar Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={notificationSettings.showNotifications}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    showNotifications: e.target.checked
                  })}
                />
                <span className="ml-2 text-gray-700">Show appointment notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={notificationSettings.sendEmailReminders}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    sendEmailReminders: e.target.checked
                  })}
                />
                <span className="ml-2 text-gray-700">Send email reminders</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={notificationSettings.autoSync}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    autoSync: e.target.checked
                  })}
                />
                <span className="ml-2 text-gray-700">Automatically sync every hour</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default reminder time
              </label>
              <select 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={notificationSettings.reminderTime}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  reminderTime: e.target.value
                })}
              >
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>
            
            <div className="pt-4">
              <button
                onClick={saveNotificationSettings}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CalendarIntegration; 