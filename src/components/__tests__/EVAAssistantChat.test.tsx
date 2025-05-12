import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EVAAssistantChat from '../EVAAssistantChat';
import { CustomAgentConfig } from '../EVAAssistantWithCustomAgents';

describe('EVAAssistantChat', () => {
  const mockCustomAgent: CustomAgentConfig = {
    id: 'custom-agent-1',
    name: 'Custom Test Agent',
    fullName: 'Custom Test Agent Full Name',
    icon: null,
    formats: ['Email'],
    tone: 'Formal',
    length: 'Short',
    dataOptions: [],
    priorityFeatures: '',
    performanceGoals: ''
  };

  const mockOnSelectAgent = jest.fn();
  const mockOnCreateCustomAgent = jest.fn();

  const renderComponent = (props = {}) => {
    return render(
      <EVAAssistantChat 
        customAgents={[mockCustomAgent]}
        selectedAgentId={null}
        onSelectAgent={mockOnSelectAgent}
        onCreateCustomAgent={mockOnCreateCustomAgent}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders agent list including custom agents', () => {
    renderComponent();
    
    // Check if default agents are rendered
    expect(screen.getByText('EVA Risk')).toBeInTheDocument();
    expect(screen.getByText('Neo Matrix Master')).toBeInTheDocument();
    expect(screen.getByText('Ben The Accountant')).toBeInTheDocument();
    expect(screen.getByText('Leo Wolf')).toBeInTheDocument();
    
    // Check if custom agent is rendered
    expect(screen.getByText('Custom Test Agent Full Name')).toBeInTheDocument();
  });

  test('calls onSelectAgent when custom agent is clicked', () => {
    renderComponent();
    
    // Find and click the custom agent
    const customAgentElements = screen.getAllByText('Custom Test Agent Full Name');
    const customAgentElement = customAgentElements[0];
    
    fireEvent.click(customAgentElement);
    
    expect(mockOnSelectAgent).toHaveBeenCalledWith('custom-agent-1');
  });

  test('calls onCreateCustomAgent when Create AI button is clicked', () => {
    renderComponent();
    
    // Find and click the Create AI button
    const createButton = screen.getByText('Create AI');
    fireEvent.click(createButton);
    
    expect(mockOnCreateCustomAgent).toHaveBeenCalled();
  });

  test('updates displayed agent name when selectedAgentId changes', () => {
    const { rerender } = renderComponent({ selectedAgentId: null });
    
    // Initial state should show default agent
    expect(screen.getByText('Welcome to a new conversation with EVA Risk.')).toBeInTheDocument();
    
    // Re-render with selected custom agent
    rerender(
      <EVAAssistantChat 
        customAgents={[mockCustomAgent]}
        selectedAgentId="custom-agent-1"
        onSelectAgent={mockOnSelectAgent}
        onCreateCustomAgent={mockOnCreateCustomAgent}
      />
    );
    
    // Now should show custom agent name
    expect(screen.getByText('Welcome to a new conversation with Custom Test Agent Full Name.')).toBeInTheDocument();
  });

  test('initiates dragging when header is clicked', () => {
    renderComponent();
    
    const header = screen.getAllByText('EVA Assistant')[0];
    const headerParent = header.closest('.chat-header');
    
    expect(headerParent).not.toBeNull();
    
    if (headerParent) {
      // Mouse down on the header should set isDragging to true
      // We can't directly test state changes, but we can test for the cursor style
      expect(headerParent).toHaveClass('cursor-move');
      
      // Simulate mouse down (the actual dragging is handled by event listeners that we can't fully test in this environment)
      fireEvent.mouseDown(headerParent);
      
      // We'd need a more complex setup to test the actual dragging behavior
    }
  });
}); 