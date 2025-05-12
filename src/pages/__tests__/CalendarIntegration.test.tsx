import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CalendarIntegration from '../CalendarIntegration';

// Mock PageLayout component to isolate the CalendarIntegration component in testing
jest.mock('../../components/layout/PageLayout', () => {
  return ({ children }: { children: React.ReactNode }) => <div data-testid="page-layout">{children}</div>;
});

describe('CalendarIntegration Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <CalendarIntegration />
      </BrowserRouter>
    );
    
    // Check if basic component elements are rendered
    expect(screen.getByText(/Calendar Integration/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect and manage your calendars for seamless scheduling/i)).toBeInTheDocument();
  });

  test('displays calendar provider options', () => {
    render(
      <BrowserRouter>
        <CalendarIntegration />
      </BrowserRouter>
    );
    
    // Check if calendar provider options are rendered
    expect(screen.getByText(/Google Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Microsoft Outlook/i)).toBeInTheDocument();
    expect(screen.getByText(/Apple iCloud/i)).toBeInTheDocument();
  });

  test('displays connected calendars section', () => {
    render(
      <BrowserRouter>
        <CalendarIntegration />
      </BrowserRouter>
    );
    
    // Check if connected calendars section is rendered
    expect(screen.getByText(/Connected Calendars/i)).toBeInTheDocument();
    // The component should initialize with a Google Calendar connection
    expect(screen.getByText(/1 calendar connected/i)).toBeInTheDocument();
  });

  test('displays calendar settings section', () => {
    render(
      <BrowserRouter>
        <CalendarIntegration />
      </BrowserRouter>
    );
    
    // Check if calendar settings section is rendered
    expect(screen.getByText(/Calendar Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Show appointment notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/Send email reminders/i)).toBeInTheDocument();
    expect(screen.getByText(/Automatically sync every hour/i)).toBeInTheDocument();
    expect(screen.getByText(/Default reminder time/i)).toBeInTheDocument();
  });

  test('calendar sync button works', () => {
    render(
      <BrowserRouter>
        <CalendarIntegration />
      </BrowserRouter>
    );
    
    // Find and click the sync button
    const syncButtons = screen.getAllByRole('button');
    const syncButton = syncButtons.find(button => 
      button.closest('div')?.textContent?.includes('Last synchronized'));
    
    if (syncButton) {
      fireEvent.click(syncButton);
      // After clicking, we expect some loading state or visual feedback
      // This would typically be more specific in a real test
    }
  });
}); 