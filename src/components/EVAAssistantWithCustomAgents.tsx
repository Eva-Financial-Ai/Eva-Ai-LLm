import React, { useState } from 'react';
import EVAAssistantChat from './EVAAssistantChat';
import CreateCustomAIAgent from './CreateCustomAIAgent';

export interface CustomAgentConfig {
  id: string;
  name: string;
  fullName: string;
  icon: string | null;
  formats: string[];
  tone: string;
  length: string;
  dataOptions: string[];
  priorityFeatures: string;
  performanceGoals: string;
  knowledgeBase?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
  }>;
}

const EVAAssistantWithCustomAgents: React.FC = () => {
  const [customAgents, setCustomAgents] = useState<CustomAgentConfig[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('eva-risk');

  const handleCreateAgent = (newAgent: CustomAgentConfig) => {
    setCustomAgents([...customAgents, newAgent]);
    setSelectedAgentId(newAgent.id);
    setShowCreateModal(false);
  };

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  return (
    <div className="bg-white h-full w-full overflow-hidden flex flex-col">
      <EVAAssistantChat 
        customAgents={customAgents} 
        selectedAgentId={selectedAgentId}
        onSelectAgent={handleSelectAgent}
        onCreateCustomAgent={() => setShowCreateModal(true)}
      />
      
      {showCreateModal && (
        <CreateCustomAIAgent
          onSave={handleCreateAgent}
          onCancel={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default EVAAssistantWithCustomAgents; 