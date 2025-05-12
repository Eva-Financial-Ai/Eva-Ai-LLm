# EVA Custom AI Agent Documentation

This document provides an overview of the custom AI agent creation feature in the EVA platform.

## Components

The custom AI agent feature consists of three primary components:

1. `EVAAssistantWithCustomAgents` - The parent component that integrates the chat interface with custom agent management
2. `CreateCustomAIAgent` - The modal component for creating and configuring custom agents 
3. `AIAgentCustomizationOptions` - A reusable component for agent customization settings

## Usage

### Creating a Custom AI Agent

1. Click the "Create Custom AI" button in the EVA Assistant interface
2. In the modal that appears:
   - Add an icon (optional) - Default brain icon will be used if none provided
   - Enter a name for your custom agent
   - Configure customization options:
     - **Format**: Select response formats (Email, Formal Email, etc.)
     - **Tone**: Choose a tone (Formal, Professional, Casual, Informational)
     - **Length**: Set preferred response length (Short, Medium, Long)
   - Optionally, specify:
     - Features/data points to prioritize
     - Performance metrics or goals for the model
3. Click "Create" to save your custom agent

### Testing Your Custom Agent

After creating a custom agent, you can interact with it in the chat interface. The agent will respond according to your specified parameters:

- Using the selected tone (Formal, Professional, etc.)
- Respecting the length preference (Short, Medium, Long)
- Formatting responses based on your selected formats
- Prioritizing features you specified

## Implementation Notes

### File Structure

```
src/components/
├── EVAAssistantWithCustomAgents.tsx  # Parent component
├── CreateCustomAIAgent.tsx           # Modal for creating agents
├── AIAgentCustomizationOptions.tsx   # Reusable customization component
└── README-CustomAI.md                # This file
```

### Assets

The brain icon is stored at:
```
public/brain-icon.svg
```

## Technical Details

### Agent Configuration

Each agent's configuration is stored in the following format:

```typescript
interface CustomAgentConfig {
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
```

### Integration

The custom agents integrate with the EVA platform's existing AI capabilities, allowing for specialized agents that focus on specific tasks or knowledge domains while maintaining the core EVA experience. 