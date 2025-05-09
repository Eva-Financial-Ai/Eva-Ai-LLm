import React, { useState, useEffect } from 'react';
import { Tooltip } from '../common/Tooltip';

// Channel types
export type ChannelType = 'email' | 'sms' | 'call' | 'meeting' | 'portal' | 'in-app';

// Define interface for a communication channel
interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  icon: React.ReactNode;
  isConnected: boolean;
  lastSynced: Date | null;
  provider: string;
  accountDetails?: string;
}

interface CommunicationChannelManagerProps {
  onChannelSelect: (channelType: ChannelType) => void;
  selectedChannel: ChannelType;
}

const CommunicationChannelManager: React.FC<CommunicationChannelManagerProps> = ({
  onChannelSelect,
  selectedChannel,
}) => {
  // Mock channels data - in a real implementation, this would come from an API or context
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'email-outlook',
      type: 'email',
      name: 'Outlook Email',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      isConnected: true,
      lastSynced: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      provider: 'Microsoft',
      accountDetails: 'user@example.com',
    },
    {
      id: 'sms-twilio',
      type: 'sms',
      name: 'SMS Messaging',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      isConnected: true,
      lastSynced: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      provider: 'Twilio',
      accountDetails: '+1234567890',
    },
    {
      id: 'call-service',
      type: 'call',
      name: 'Phone Calls',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      isConnected: true,
      lastSynced: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      provider: 'VoIP Service',
      accountDetails: 'Business Line',
    },
    {
      id: 'calendar-google',
      type: 'meeting',
      name: 'Calendar',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      isConnected: false, // Not connected
      lastSynced: null,
      provider: 'Google',
      accountDetails: 'Not connected',
    },
    {
      id: 'client-portal',
      type: 'portal',
      name: 'Client Portal',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      isConnected: true,
      lastSynced: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      provider: 'Internal',
      accountDetails: 'EVA Portal',
    },
    {
      id: 'in-app-chat',
      type: 'in-app',
      name: 'In-App Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      isConnected: true,
      lastSynced: new Date(), // Just now
      provider: 'EVA',
      accountDetails: 'Internal',
    },
  ]);

  // Function to format time since last sync
  const formatTimeSince = (date: Date | null): string => {
    if (!date) return 'Never';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 60 * 24) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / (60 * 24))}d ago`;
  };

  // Function to reconnect a channel
  const handleReconnect = (channelId: string) => {
    // In a real app, this would initiate OAuth flow or similar
    console.log(`Reconnecting channel: ${channelId}`);

    // Simulate reconnection
    setTimeout(() => {
      setChannels(prevChannels =>
        prevChannels.map(channel =>
          channel.id === channelId
            ? { ...channel, isConnected: true, lastSynced: new Date() }
            : channel
        )
      );
    }, 1500);
  };

  // Function to refresh a channel's sync
  const handleRefreshSync = (channelId: string) => {
    // In a real app, this would trigger a sync with the external service
    console.log(`Refreshing sync for channel: ${channelId}`);

    // Simulate sync
    const channelToUpdate = channels.find(c => c.id === channelId);
    if (channelToUpdate && channelToUpdate.isConnected) {
      // Show syncing state (would be more elaborate in real app)
      setChannels(prevChannels =>
        prevChannels.map(channel =>
          channel.id === channelId ? { ...channel, lastSynced: null } : channel
        )
      );

      // After "sync" completes
      setTimeout(() => {
        setChannels(prevChannels =>
          prevChannels.map(channel =>
            channel.id === channelId ? { ...channel, lastSynced: new Date() } : channel
          )
        );
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Channels</h3>

      <div className="space-y-4">
        {/* Channel Selector */}
        <div className="flex overflow-x-auto pb-2 mb-2 border-b">
          {channels.map(channel => (
            <button
              key={channel.id}
              onClick={() => onChannelSelect(channel.type)}
              className={`flex items-center px-3 py-2 mr-2 rounded-md text-sm font-medium whitespace-nowrap ${
                selectedChannel === channel.type
                  ? 'bg-primary-100 text-primary-700 border-primary-500'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={`mr-2 ${!channel.isConnected ? 'text-gray-400' : ''}`}>
                {channel.icon}
              </span>
              <span>{channel.name}</span>
              {!channel.isConnected && (
                <span
                  className="ml-1 h-2 w-2 rounded-full bg-gray-400"
                  title="Not connected"
                ></span>
              )}
            </button>
          ))}
        </div>

        {/* Selected Channel Details */}
        {channels.map(
          channel =>
            channel.type === selectedChannel && (
              <div key={`details-${channel.id}`} className="bg-gray-50 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{channel.name}</h4>
                    <p className="text-sm text-gray-600">Provider: {channel.provider}</p>
                    <p className="text-sm text-gray-600">Account: {channel.accountDetails}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <span
                        className={`h-2 w-2 rounded-full mr-2 ${channel.isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                      <span className="text-sm">
                        {channel.isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last synced: {formatTimeSince(channel.lastSynced)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  {channel.isConnected ? (
                    <>
                      <button
                        onClick={() => handleRefreshSync(channel.id)}
                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700"
                      >
                        Refresh Sync
                      </button>
                      <Tooltip content="Disconnect this channel">
                        <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700">
                          Disconnect
                        </button>
                      </Tooltip>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReconnect(channel.id)}
                      className="px-3 py-1 text-xs bg-primary-600 text-white rounded shadow-sm hover:bg-primary-700"
                    >
                      Connect
                    </button>
                  )}
                  <Tooltip content="Configure channel settings">
                    <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700">
                      Settings
                    </button>
                  </Tooltip>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default CommunicationChannelManager;
