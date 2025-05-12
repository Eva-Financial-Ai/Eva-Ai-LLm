import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import the components we want to test
import Contacts from '../pages/Contacts';
import CalendarIntegration from '../pages/CalendarIntegration';
import CustomerRetentionCommitments from '../pages/customerRetention/CustomerRetentionCommitments';

// Create test wrapper components to manage mocks and contexts
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/test', search: '' }),
}));

// Mock PageLayout component
jest.mock('../components/layout/PageLayout', () => {
  return ({ children, title }: { children: React.ReactNode, title: string }) => (
    <div data-testid="page-layout" data-title={title}>
      {children}
    </div>
  );
});

// Mock TopNavigation component
jest.mock('../components/layout/TopNavigation', () => {
  return ({ title, currentTransactionId }: { title: string, currentTransactionId?: string }) => (
    <div data-testid="top-navigation" data-title={title} data-transaction-id={currentTransactionId}>
      {title}
    </div>
  );
});

// Tests for each component plus integration
describe('Customer Retention Feature Integration Tests', () => {
  
  // Reset mocks between tests
  beforeEach(() => {
    mockNavigate.mockReset();
  });
  
  describe('Contacts Component Tests', () => {
    test('Contacts component renders basic elements', () => {
      render(
        <BrowserRouter>
          <Contacts />
        </BrowserRouter>
      );
      
      // Check for page title and description
      expect(screen.getByText(/Customer Contacts/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage and track all your customer relationships/i)).toBeInTheDocument();
      
      // Check for search functionality
      expect(screen.getByPlaceholderText(/Search contacts.../i)).toBeInTheDocument();
      
      // Verify navigation button to Calendar Integration exists
      const calendarButton = screen.getByRole('button', { name: /Calendar/i });
      expect(calendarButton).toBeInTheDocument();
      
      // Click calendar button should navigate to calendar integration
      fireEvent.click(calendarButton);
      expect(mockNavigate).toHaveBeenCalledWith('/calendar-integration');
    });
  });
  
  describe('Calendar Integration Component Tests', () => {
    test('Calendar Integration component renders properly', () => {
      render(
        <BrowserRouter>
          <CalendarIntegration />
        </BrowserRouter>
      );
      
      // Check for section headers
      expect(screen.getByText(/Calendar Integration/i)).toBeInTheDocument();
      expect(screen.getByText(/Connected Calendars/i)).toBeInTheDocument();
      expect(screen.getByText(/Calendar Settings/i)).toBeInTheDocument();
      
      // Check for provider options (need exact text matches for consistent testing)
      const googleCalendarText = screen.getAllByText("Google Calendar")[0];
      expect(googleCalendarText).toBeInTheDocument();
      
      // Check for notification settings
      expect(screen.getByText(/Show appointment notifications/i)).toBeInTheDocument();
      expect(screen.getByText(/Send email reminders/i)).toBeInTheDocument();
      
      // Verify calendar sync functionality is available
      // This is a bit complex to test, so we're just checking for the basics
      expect(screen.getByText(/Last synchronized:/i)).toBeInTheDocument();
    });
  });
  
  describe('Commitments Component Tests', () => {
    test('Commitments component renders key elements', () => {
      // We need a lighter wrapper for this test due to styling dependencies
      render(
        <BrowserRouter>
          <div className="pl-20 sm:pl-72 w-full">
            <CustomerRetentionCommitments />
          </div>
        </BrowserRouter>
      );
      
      // Check for main section text
      expect(screen.getByText(/Commitments/i)).toBeInTheDocument();
      expect(screen.getByText(/Track and manage customer agreements and commitments/i)).toBeInTheDocument();
      
      // Check for dashboard metrics sections
      expect(screen.getByText(/Active Commitments/i)).toBeInTheDocument();
      expect(screen.getByText(/Upcoming Renewals/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Commitment Value/i)).toBeInTheDocument();
      
      // Verify Add Commitment button exists
      const addButton = screen.getByRole('button', { name: /Add Commitment/i });
      expect(addButton).toBeInTheDocument();
      
      // Check for search functionality
      expect(screen.getByPlaceholderText(/Search commitments.../i)).toBeInTheDocument();
    });
  });
  
  // Integration test that would verify the connections between components
  describe('Customer Retention Integration Tests', () => {
    // This would be a more complex test that verifies integration points
    // For example, adding a contact and then scheduling a calendar event with that contact
    // Or creating a commitment linked to a contact
    // These would typically require more complex test setups with mocked data
    
    test('Navigation between Customer Retention pages works correctly', () => {
      // We would test that navigation between related pages works
      // In a real test, this would involve more complex mocking of the router
      // For now, we're just testing that navigation functions are called
      
      render(
        <BrowserRouter>
          <Contacts />
        </BrowserRouter>
      );
      
      // Test navigation to calendar integration
      const calendarButton = screen.getByRole('button', { name: /Calendar/i });
      fireEvent.click(calendarButton);
      expect(mockNavigate).toHaveBeenCalledWith('/calendar-integration');
    });
  });
}); 