import React, { useState } from 'react';
import ChatWidget from '../components/communications/ChatWidget';
import AgentManagementDialog from '../components/communications/AgentManagementDialog';
import { AgentModel } from '../components/communications/CustomAgentManager';

const CustomAgentDemo: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentModel | null>(null);
  const [isAgentManagementOpen, setIsAgentManagementOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">EVA Custom Agents</h1>
            <button
              onClick={() => setIsAgentManagementOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Manage Agents
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Custom Agents Demo</h2>
              <p className="mb-6 text-gray-600">
                This page demonstrates the custom agent creation and management functionality in the
                EVA platform. You can create specialized AI assistants tailored to specific tasks,
                formats, and communication styles. EVA monitors and analyzes the effectiveness of
                these agents to optimize your workflow.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">How to use:</h3>
                  <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                    <li>Click "Manage Agents" to create custom AI agents</li>
                    <li>Configure agents with specific formats, tones, and expertise areas</li>
                    <li>Use the chat widget to interact with EVA and your custom agents</li>
                    <li>Switch between agents using the selector in the chat header</li>
                    <li>Provide feedback to help EVA monitor agent effectiveness</li>
                  </ol>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Agent Features:</h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    <li>Specialized knowledge domains for focused assistance</li>
                    <li>Customizable output formats (emails, reports, etc.)</li>
                    <li>Adjustable communication tones to match your needs</li>
                    <li>Performance monitoring to track usefulness</li>
                    <li>Seamless integration with the EVA platform</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Chat Widget */}
      <ChatWidget
        isOpen={true}
        mode="communications"
        initialPosition={{ x: window.innerWidth - 500, y: 100 }}
      />

      {/* Agent Management Dialog */}
      <AgentManagementDialog
        isOpen={isAgentManagementOpen}
        onClose={() => setIsAgentManagementOpen(false)}
        onSelectAgent={setSelectedAgent}
      />
    </div>
  );
};

export default CustomAgentDemo;
