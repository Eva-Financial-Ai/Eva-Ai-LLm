import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EVAAssistantWithCustomAgents from '../EVAAssistantWithCustomAgents';

// Mock the child components to simplify testing
jest.mock('../EVAAssistantChat', () => {
  return function MockEVAAssistantChat() {
    return <div data-testid="eva-assistant-chat">EVA Assistant Chat Mock</div>;
  };
});

jest.mock('../CreateCustomAIAgent', () => {
  return function MockCreateCustomAIAgent({ isOpen, onClose, onSave }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="create-custom-ai-modal">
        <button onClick={() => onSave({ name: 'Test Agent', formats: ['Email'], tone: 'Formal', length: 'Short' })}>
          Save Agent
        </button>
        <button onClick={onClose}>Close Modal</button>
      </div>
    );
  };
});

describe('EVAAssistantWithCustomAgents', () => {
  test('renders EVA Assistant Chat', () => {
    render(<EVAAssistantWithCustomAgents />);
    expect(screen.getByTestId('eva-assistant-chat')).toBeInTheDocument();
  });

  test('renders Create Custom AI button', () => {
    render(<EVAAssistantWithCustomAgents />);
    expect(screen.getByText('Create Custom AI')).toBeInTheDocument();
  });

  test('opens CreateCustomAIAgent modal when button is clicked', () => {
    render(<EVAAssistantWithCustomAgents />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('create-custom-ai-modal')).not.toBeInTheDocument();
    
    // Click the Create Custom AI button
    fireEvent.click(screen.getByText('Create Custom AI'));
    
    // Modal should now be visible
    expect(screen.getByTestId('create-custom-ai-modal')).toBeInTheDocument();
  });

  test('closes modal when close function is called', () => {
    render(<EVAAssistantWithCustomAgents />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Create Custom AI'));
    expect(screen.getByTestId('create-custom-ai-modal')).toBeInTheDocument();
    
    // Close the modal
    fireEvent.click(screen.getByText('Close Modal'));
    
    // Modal should no longer be visible
    expect(screen.queryByTestId('create-custom-ai-modal')).not.toBeInTheDocument();
  });

  test('adds a new agent when modal save function is called', () => {
    render(<EVAAssistantWithCustomAgents />);
    
    // Open the modal
    fireEvent.click(screen.getByText('Create Custom AI'));
    
    // Save a new agent
    fireEvent.click(screen.getByText('Save Agent'));
    
    // Modal should close
    expect(screen.queryByTestId('create-custom-ai-modal')).not.toBeInTheDocument();
    
    // New agent should be added (would need to check the UI if it shows agents)
    // This would require more detailed testing if the UI actually displays agents
  });
}); 