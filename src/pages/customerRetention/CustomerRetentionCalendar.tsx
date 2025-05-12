import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavigation from '../../components/layout/TopNavigation';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon, 
  BellIcon, 
  CalendarIcon, 
  CheckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Debug function to help diagnose navigation issues
const debugNavigation = (message: string, data: any = {}) => {
  console.log(`[Calendar Debug] ${message}`, data);
  return null;
};

interface CalendarConnection {
  id: string;
  provider: string;
  name: string;
  email: string;
  connected: boolean;
  lastSynced: string | null;
  color: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  participants: number;
  calendarId: string;
}

const initialCalendars: CalendarConnection[] = [
  {
    id: 'cal1',
    provider: 'google',
    name: 'Work Calendar',
    email: 'work@example.com',
    connected: true,
    lastSynced: '2023-06-20T14:30:00',
    color: '#4285F4' // Google blue
  },
  {
    id: 'cal2',
    provider: 'google',
    name: 'Personal Calendar',
    email: 'personal@gmail.com',
    connected: false,
    lastSynced: null,
    color: '#EA4335' // Google red
  },
  {
    id: 'cal3',
    provider: 'microsoft',
    name: 'Office 365',
    email: 'office@company.com',
    connected: false,
    lastSynced: null,
    color: '#0078D4' // Microsoft blue
  },
  {
    id: 'cal4',
    provider: 'apple',
    name: 'iCloud Calendar',
    email: 'user@icloud.com',
    connected: false,
    lastSynced: null,
    color: '#999999' // Apple gray
  }
];

const mockEvents: CalendarEvent[] = [
  {
    id: 'evt1',
    title: 'Client Meeting - Acme Corp',
    date: '2023-06-25',
    time: '10:00 AM - 11:30 AM',
    type: 'Meeting',
    participants: 4,
    calendarId: 'cal1'
  },
  {
    id: 'evt2',
    title: 'Equipment Demo with Prospect',
    date: '2023-06-26',
    time: '2:00 PM - 3:30 PM',
    type: 'Demo',
    participants: 5,
    calendarId: 'cal1'
  },
  {
    id: 'evt3',
    title: 'Quarterly Business Review',
    date: '2023-06-27',
    time: '9:00 AM - 12:00 PM',
    type: 'Review',
    participants: 8,
    calendarId: 'cal1'
  }
];

const CustomerRetentionCalendar: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const navigate = useNavigate();
  const location = window.location;
  const [calendars, setCalendars] = useState<CalendarConnection[]>(initialCalendars);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(['cal1']);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [notificationSettings, setNotificationSettings] = useState({
    reminderEmail: true,
    reminderPush: true,
    meetingRequest: true,
    syncAlerts: false
  });
  
  // Log mounting for debugging
  useEffect(() => {
    debugNavigation('Component mounted', { 
      pathname: location.pathname,
      provider, 
      href: location.href 
    });
    
    if (provider) {
      setActiveTab(provider);
    } else {
      setActiveTab('all');
    }
    
    // Cleanup function
    return () => {
      debugNavigation('Component unmounted');
    };
  }, []);
  
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName !== 'all') {
      navigate(`/customer-retention/calendar/${tabName}`, { replace: true });
    } else {
      navigate('/customer-retention/calendar', { replace: true });
    }
  };
  
  const getProviderName = (providerValue?: string) => {
    const providerToUse = providerValue || activeTab;
    
    if (providerToUse === 'all') {
      return 'All Calendars';
    }
    
    switch (providerToUse) {
      case 'microsoft':
        return 'Microsoft';
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      default:
        return 'Calendar';
    }
  };

  const getProviderLogo = (providerValue?: string) => {
    const providerToUse = providerValue || activeTab;
    
    switch (providerToUse) {
      case 'microsoft':
        return 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg';
      case 'google':
        return 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg';
      case 'apple':
        return 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
      default:
        return 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Calendar_icon_from_Office_2013.svg';
    }
  };

  const filteredCalendars = activeTab === 'all'
    ? calendars
    : calendars.filter(cal => cal.provider === activeTab);
  
  const filteredEvents = selectedCalendars.length > 0
    ? events.filter(event => selectedCalendars.includes(event.calendarId))
    : [];
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate API connection - normally this would trigger OAuth flow
    setTimeout(() => {
      setCalendars(prevCalendars => 
        prevCalendars.map(cal => 
          cal.provider === activeTab ? { ...cal, connected: true, lastSynced: new Date().toISOString() } : cal
        )
      );
      setIsConnecting(false);
      setShowSyncSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSyncSuccess(false), 3000);
    }, 2000);
  };
  
  const handleSync = (calendarId?: string) => {
    setIsSyncing(true);
    
    // Simulate API sync
    setTimeout(() => {
      setCalendars(prevCalendars => 
        prevCalendars.map(cal => 
          !calendarId || cal.id === calendarId 
            ? { ...cal, lastSynced: new Date().toISOString() } 
            : cal
        )
      );
      setIsSyncing(false);
      setShowSyncSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSyncSuccess(false), 3000);
    }, 1500);
  };
  
  const toggleCalendarSelection = (calendarId: string) => {
    setSelectedCalendars(prev => 
      prev.includes(calendarId) 
        ? prev.filter(id => id !== calendarId) 
        : [...prev, calendarId]
    );
  };
  
  const formatLastSynced = (dateString: string | null) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Determine if any calendars for the current provider are connected
  const hasConnectedCalendars = filteredCalendars.some(cal => cal.connected);
  
  return (
    <div className="pl-20 sm:pl-72 w-full">
      {/* Log render for debugging - call without embedding in JSX */}
      {debugNavigation('Rendering component', { activeTab }) && null}
      
      <div className="container mx-auto px-2 py-6 max-w-full">
        <TopNavigation 
          title={activeTab !== 'all' ? `Calendar Integration - ${getProviderName()}` : 'Calendar Integration'} 
          currentTransactionId="TX-123" 
        />
        
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Calendar Integration</h1>
              <p className="text-gray-600">
                Connect your calendars to manage appointments and meetings
              </p>
            </div>
            <div className="flex gap-3">
              {isSyncing ? (
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 flex items-center gap-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>Syncing...</span>
                </button>
              ) : (
                <button 
                  onClick={() => handleSync()}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Sync All</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Provider Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => handleTabChange('all')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Calendars
              </button>
              <button
                onClick={() => handleTabChange('google')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'google'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Google
              </button>
              <button
                onClick={() => handleTabChange('microsoft')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'microsoft'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Microsoft
              </button>
              <button
                onClick={() => handleTabChange('apple')}
                className={`px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'apple'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Apple
              </button>
            </nav>
          </div>
          
          {/* Success Message */}
          {showSyncSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800">Calendar synchronized successfully!</span>
            </div>
          )}

          {/* Upcoming Events */}
          {hasConnectedCalendars && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-800">Upcoming Events</h2>
                <p className="text-sm text-gray-600">
                  Your schedule for the next few days
                </p>
              </div>
              
              <div className="p-2">
                {filteredEvents.length === 0 ? (
                  <div className="py-10 text-center">
                    <CalendarIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-gray-500">No upcoming events</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredEvents.map(event => (
                      <div key={event.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          <span className="text-sm text-gray-500">{event.date}</span>
                        </div>
                        <div className="mt-1 flex justify-between">
                          <div className="text-sm text-gray-500">{event.time}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {event.participants} participants
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Calendar Connections */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Connected Calendars</h2>
              <p className="text-sm text-gray-600">
                Manage and sync your calendar connections
              </p>
            </div>
            
            <div className="p-2">
              {filteredCalendars.length === 0 ? (
                <div className="py-10 text-center">
                  <CalendarIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-gray-500">No calendars available for this provider</p>
                </div>
              ) : (
                <div>
                  {filteredCalendars.map(calendar => (
                    <div 
                      key={calendar.id} 
                      className="p-3 border-b border-gray-100 last:border-0 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-5 w-5 rounded-full" 
                          style={{ backgroundColor: calendar.color }}
                        ></div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{calendar.name}</p>
                            {calendar.connected && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                Connected
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{calendar.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {calendar.connected ? (
                          <>
                            <div className="text-right mr-4">
                              <p className="text-sm text-gray-900">Last synced</p>
                              <p className="text-xs text-gray-500">{formatLastSynced(calendar.lastSynced)}</p>
                            </div>
                            
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                checked={selectedCalendars.includes(calendar.id)}
                                onChange={() => toggleCalendarSelection(calendar.id)}
                              />
                            </label>
                            
                            <button 
                              onClick={() => handleSync(calendar.id)} 
                              disabled={isSyncing}
                              className="text-primary-600 hover:text-primary-800 rounded p-1"
                              title="Sync now"
                            >
                              <ArrowPathIcon className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 flex items-center gap-1"
                          >
                            {isConnecting ? 'Connecting...' : 'Connect'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab !== 'all' && !hasConnectedCalendars && (
                <div className="p-6 flex flex-col items-center justify-center">
                  <img 
                    src={getProviderLogo()} 
                    alt={`${getProviderName()} Logo`}
                    className="h-12 w-12 mb-4 object-contain"
                    style={{ filter: activeTab === 'apple' ? 'invert(1)' : 'none' }}
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Connect your {getProviderName()} Calendar
                  </h3>
                  <p className="text-gray-500 text-center max-w-md mb-4">
                    Connecting your {getProviderName()} Calendar allows you to sync appointments, 
                    set up meetings, and manage your schedule directly within EVA.
                  </p>
                  <button 
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <CalendarIcon className="h-5 w-5" />
                        <span>Connect {getProviderName()} Calendar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Notification Settings</h2>
              <p className="text-sm text-gray-600">
                Configure how you want to be notified about calendar events
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Email Reminders</p>
                    <p className="text-sm text-gray-500">Receive email notifications for upcoming events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings.reminderEmail}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        reminderEmail: !notificationSettings.reminderEmail
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Get push notifications on your devices</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings.reminderPush}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        reminderPush: !notificationSettings.reminderPush
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Meeting Requests</p>
                    <p className="text-sm text-gray-500">Notifications for new meeting invitations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings.meetingRequest}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        meetingRequest: !notificationSettings.meetingRequest
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">Sync Alerts</p>
                    <p className="text-sm text-gray-500">Get notified about calendar sync issues</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings.syncAlerts}
                      onChange={() => setNotificationSettings({
                        ...notificationSettings,
                        syncAlerts: !notificationSettings.syncAlerts
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerRetentionCalendar; 