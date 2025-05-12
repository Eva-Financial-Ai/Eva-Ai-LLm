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
    
    // Initially only the toggle button should be visible
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeInTheDocument();
    
    // The panel should not be visible yet
    expect(screen.queryByText('Responsive Testing')).not.toBeInTheDocument();
  });

  test('shows testing panel when toggle button is clicked', () => {
    render(<ResponsiveTestingPanel />);
    
    // Click toggle button
    fireEvent.click(screen.getByRole('button'));
    
    // Panel should now be visible
    expect(screen.getByText('Responsive Testing')).toBeInTheDocument();
    expect(screen.getByText('Select a screen size to test:')).toBeInTheDocument();
  });

  test('updates dimensions when screen size preset is selected', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel
    fireEvent.click(screen.getByRole('button'));
    
    // Click on a preset size (Mobile Medium - iPhone 8)
    fireEvent.click(screen.getByText('Mobile Medium'));
    
    // Check if appropriate size buttons and inputs are updated
    expect(screen.getByText('iPhone 8')).toBeInTheDocument();
    
    // Width input should be updated to 375 (iPhone 8 width)
    const widthInput = screen.getByLabelText('Width (px)');
    expect(widthInput).toHaveValue(375);
  });

  test('opens new window with iframe when "Open in New Window" is clicked', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel
    fireEvent.click(screen.getByRole('button'));
    
    // Click "Open in New Window" button
    fireEvent.click(screen.getByText('Open in New Window'));
    
    // Check if window.open was called
    expect(mockOpen).toHaveBeenCalled();
  });

  test('creates iframe in test container when "Test in Preview" is clicked', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel
    fireEvent.click(screen.getByRole('button'));
    
    // Mock that test container has no children
    mockElement.children.length = 0;
    
    // Click "Test in Preview" button
    fireEvent.click(screen.getByText('Test in Preview'));
    
    // Check if iframe was created
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockAppendChild.mock.calls[0][0].tagName).toBe('IFRAME');
  });

  test('clears test container if it already has children', () => {
    render(<ResponsiveTestingPanel />);
    
    // Open panel
    fireEvent.click(screen.getByRole('button'));
    
    // Mock that test container has children
    mockElement.children.length = 1;
    
    // Click "Test in Preview" button
    fireEvent.click(screen.getByText('Test in Preview'));
    
    // Check if innerHTML was cleared
    expect(mockElement.innerHTML).toBe('');
  });
}); 