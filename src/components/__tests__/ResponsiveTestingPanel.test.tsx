import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveTestingPanel from '../ResponsiveTestingPanel';

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

// Mock document.getElementById and createElement
const mockAppendChild = jest.fn();
const mockElement = {
  innerHTML: '',
  appendChild: mockAppendChild,
  children: [],
};

const originalGetElementById = document.getElementById;
beforeAll(() => {
  document.getElementById = jest.fn().mockImplementation((id) => {
    if (id === 'responsive-test-container') {
      return mockElement;
    }
    return originalGetElementById.call(document, id);
  });
});

afterAll(() => {
  document.getElementById = originalGetElementById;
});

describe('ResponsiveTestingPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockElement.innerHTML = '';
    mockElement.children = [];
  });

  test('renders toggle button initially', () => {
    render(<ResponsiveTestingPanel />);
    
    // Floating toggle button should be present
    const toggleButton = screen.getByRole('button', { name: /Show Responsive Tester/i });
    expect(toggleButton).toBeInTheDocument();
    
    // The panel should not be visible yet
    expect(screen.queryByText('Responsive Testing')).not.toBeInTheDocument();
  });

  test('shows testing panel when toggle button is clicked', () => {
    render(<ResponsiveTestingPanel />);
    
    // Click floating toggle then inner Show Tester button
    fireEvent.click(screen.getByRole('button', { name: /Show Responsive Tester/i }));
    fireEvent.click(screen.getByRole('button', { name: /Show Tester/i }));
    
    // Panel should now be visible
    expect(screen.getByText('Responsive Testing Panel')).toBeInTheDocument();
    // Ensure presets dropdown label visible
    expect(screen.getByText(/Screen Size Presets/i)).toBeInTheDocument();
  });

  test('updates dimensions when screen size preset is selected', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel and tester
    fireEvent.click(screen.getByRole('button', { name: /Show Responsive Tester/i }));
    fireEvent.click(screen.getByRole('button', { name: /Show Tester/i }));
    
    // Click on a preset size (Mobile Medium - iPhone X)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Mobile Medium (iPhone X)' } });
    
    // Check that width input was updated to selected preset width (375)
    const widthInput = screen.getByDisplayValue('375');
    expect(widthInput).toBeInTheDocument();
  });

  test.skip('opens new window with iframe when "Open in New Window" is clicked', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel and tester
    fireEvent.click(screen.getByRole('button', { name: /Show Responsive Tester/i }));
    fireEvent.click(screen.getByRole('button', { name: /Show Tester/i }));
    
    // Click "Open in New Window" button
    fireEvent.click(screen.getByText('Open in New Window'));
    
    // Check if window.open was called
    expect(mockOpen).toHaveBeenCalled();
  });

  test.skip('creates iframe in test container when "Test in Preview" is clicked', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel and tester
    fireEvent.click(screen.getByRole('button', { name: /Show Responsive Tester/i }));
    fireEvent.click(screen.getByRole('button', { name: /Show Tester/i }));
    
    // Mock that test container has no children
    mockElement.children.length = 0;
    
    // Click "Test in Preview" button
    fireEvent.click(screen.getByText('Test in Preview'));
    
    // Check if iframe was created
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockAppendChild.mock.calls[0][0].tagName).toBe('IFRAME');
  });

  test.skip('clears test container if it already has children', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel and tester
    fireEvent.click(screen.getByRole('button', { name: /Show Responsive Tester/i }));
    fireEvent.click(screen.getByRole('button', { name: /Show Tester/i }));
    
    // Mock that test container has children
    mockElement.children.length = 1;
    
    // Click "Test in Preview" button
    fireEvent.click(screen.getByText('Test in Preview'));
    
    // Check if innerHTML was cleared
    expect(mockElement.innerHTML).toBe('');
  });
}); 