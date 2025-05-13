import React, { useState } from 'react';
import EVAAssistantChat from './EVAAssistantChat';
import TaskManagement from './tasks/TaskManagement';

interface EVATaskIntegrationProps {
  // Add any props needed
}

const EVATaskIntegration: React.FC<EVATaskIntegrationProps> = () => {
  const [showChat, setShowChat] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  // Toggle chat visibility
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  // Toggle task manager visibility
  const toggleTaskManager = () => {
    setShowTaskManager(!showTaskManager);
  };

  // Close both interfaces
  const closeAll = () => {
    setShowChat(false);
    setShowTaskManager(false);
  };

  // Open task manager from chat
  const openTaskManagerFromChat = () => {
    setShowTaskManager(true);
  };

  return (
    <div>
      {/* Button to open chat */}
      {!showChat && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Open EVA Assistant"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* EVA Assistant Chat */}
      {showChat && (
        <EVAAssistantChat
          onClose={() => setShowChat(false)}
          onCreateTask={openTaskManagerFromChat}
        />
      )}

      {/* Task Management */}
      {showTaskManager && <TaskManagement onClose={() => setShowTaskManager(false)} />}
    </div>
  );
};

export default EVATaskIntegration;
