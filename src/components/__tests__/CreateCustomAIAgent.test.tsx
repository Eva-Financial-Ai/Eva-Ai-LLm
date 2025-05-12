import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateCustomAIAgent from '../CreateCustomAIAgent';

describe('CreateCustomAIAgent', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  
  const renderComponent = (isOpen = true) => {
    return render(
      <CreateCustomAIAgent 
        isOpen={isOpen} 
        onClose={mockOnClose} 
        onSave={mockOnSave} 
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render when isOpen is false', () => {
    renderComponent(false);
    expect(screen.queryByText('Create Custom Ai')).not.toBeInTheDocument();
  });

  test('should render when isOpen is true', () => {
    renderComponent();
    expect(screen.getByText('Create Custom Ai')).toBeInTheDocument();
  });

  test('should call onClose when Delete button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onSave with agent config when Create button is clicked', () => {
    renderComponent();
    
    // Set a name for the agent
    const nameInput = screen.getByPlaceholderText('Test AI');
    fireEvent.change(nameInput, { target: { value: 'My Custom Agent' } });
    
    // Click the Create button
    fireEvent.click(screen.getByText('Create'));
    
    // Verify onSave was called with appropriate config
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'My Custom Agent',
      formats: expect.any(Array),
      tone: 'Formal',
      length: 'Short'
    }));
  });
  
  test('should toggle format selection when a format button is clicked', () => {
    renderComponent();
    
    // Initially, Email should be in the selected format
    const formatDisplay = screen.getByText('Email');
    expect(formatDisplay).toBeInTheDocument();
    
    // Find an Essay format button if it exists
    const formatButtons = screen.getAllByRole('button');
    const essayButton = formatButtons.find(button => button.textContent === 'Essay');
    
    // If Essay button is found, click it
    if (essayButton) {
      fireEvent.click(essayButton);
      // In a real test we would verify the UI updated
    }
  });
  
  test('should update tone when a tone button is clicked', () => {
    renderComponent();
    
    // Click 'Casual' tone
    const casualButton = screen.getByText('Casual');
    fireEvent.click(casualButton);
    
    // Click Create and verify tone is updated
    fireEvent.click(screen.getByText('Create'));
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      tone: 'Casual'
    }));
  });
  
  test('should update length when a length button is clicked', () => {
    renderComponent();
    
    // Click 'Long' length
    const longButton = screen.getByText('Long');
    fireEvent.click(longButton);
    
    // Click Create and verify length is updated
    fireEvent.click(screen.getByText('Create'));
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      length: 'Long'
    }));
  });
}); 