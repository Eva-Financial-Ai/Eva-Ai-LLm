import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import CustomAgentCreationModal from './CustomAgentCreationModal';

export interface AgentModel {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  tone: string;
  length: string;
  features: string[];
  performanceMetrics: string[];
  customProblem: string;
  imageUrl?: string;
  createdAt?: Date;
  usageCount?: number;
  effectiveness?: number;
}

interface CustomAgentManagerProps {
  onSelectAgent?: (agent: AgentModel) => void;
}

const CustomAgentManager: React.FC<CustomAgentManagerProps> = ({ onSelectAgent }) => {
  const [agents, setAgents] = useState<AgentModel[]>([]);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Load agents from local storage on component mount
  useEffect(() => {
    const savedAgents = localStorage.getItem('eva-custom-agents');
    if (savedAgents) {
      setAgents(JSON.parse(savedAgents));
    }
  }, []);

  // Save agents to local storage when they change
  useEffect(() => {
    localStorage.setItem('eva-custom-agents', JSON.stringify(agents));
  }, [agents]);

  const handleCreateAgent = (agent: AgentModel) => {
    // Add created date and initial metrics
    const newAgent = {
      ...agent,
      createdAt: new Date(),
      usageCount: 0,
      effectiveness: 0,
    };

    setAgents(prev => [...prev, newAgent]);
    setIsCreationModalOpen(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId));
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
    }
  };

  const handleSelectAgent = (agent: AgentModel) => {
    setSelectedAgentId(agent.id);
    if (onSelectAgent) {
      onSelectAgent(agent);
    }

    // Update usage count for the selected agent
    setAgents(prev =>
      prev.map(a => (a.id === agent.id ? { ...a, usageCount: (a.usageCount || 0) + 1 } : a))
    );
  };

  const filteredAgents = searchQuery
    ? agents.filter(
        agent =>
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.customProblem.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : agents;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Custom Agents</h2>
        <button
          onClick={() => setIsCreationModalOpen(true)}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Create Agent
        </button>
      </div>

      {/* Search bar */}
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Agent list */}
      <div className="overflow-y-auto max-h-96">
        {filteredAgents.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 text-sm">
              No agents found. Create your first agent to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredAgents.map(agent => (
              <li
                key={agent.id}
                className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${selectedAgentId === agent.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelectAgent(agent)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={agent.imageUrl || '/icons/ai-default-avatar.svg'}
                        alt={agent.name}
                        onError={e => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/icons/ai-default-avatar.svg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-sm text-gray-900">{agent.name}</div>
                      <div className="text-xs text-gray-500">
                        {agent.type.split(',').slice(0, 2).join(', ')}
                        {agent.type.split(',').length > 2 && '...'}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {agent.format}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteAgent(agent.id);
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-xs text-gray-500">Used {agent.usageCount || 0} times</div>
                  <div className="text-xs">
                    {agent.createdAt && (
                      <span className="text-gray-500">
                        Created {new Date(agent.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agent creation modal */}
      <CustomAgentCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSubmit={handleCreateAgent}
      />
    </div>
  );
};

export default CustomAgentManager;
