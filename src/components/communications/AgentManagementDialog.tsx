import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CustomAgentManager from './CustomAgentManager';
import { AgentModel } from './CustomAgentManager';

interface AgentManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent?: (agent: AgentModel) => void;
}

const AgentManagementDialog: React.FC<AgentManagementDialogProps> = ({
  isOpen,
  onClose,
  onSelectAgent,
}) => {
  const handleAgentSelect = (agent: AgentModel) => {
    if (onSelectAgent) {
      onSelectAgent(agent);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Manage AI Agents</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-6rem)]">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">About Custom Agents</h3>
            <p className="text-sm text-gray-600">
              Custom AI agents allow you to create specialized assistants tailored to specific tasks
              and communication styles. Each agent can be configured with different formats, tones,
              and specialized knowledge domains. EVA monitors the usage and effectiveness of all
              agents to help optimize your workflow.
            </p>
          </div>

          <div className="mb-6">
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Most Used Agent</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">EVA</p>
                  <p className="text-xs text-blue-700 mt-1">Used 43 times this week</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-800">Highest Effectiveness</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">Finance Data Agent</p>
                  <p className="text-xs text-green-700 mt-1">95% effectiveness rating</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">Agent Diversity</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">7 Active Agents</p>
                  <p className="text-xs text-purple-700 mt-1">Covering 5 different domains</p>
                </div>
              </div>
            </div>
          </div>

          <CustomAgentManager onSelectAgent={handleAgentSelect} />
        </div>
      </div>
    </div>
  );
};

export default AgentManagementDialog;
