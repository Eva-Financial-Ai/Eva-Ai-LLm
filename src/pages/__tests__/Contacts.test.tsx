import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contacts from '../Contacts';

// Mock PageLayout component to isolate the Contacts component in testing
jest.mock('../../components/layout/PageLayout', () => {
  return ({ children }: { children: React.ReactNode }) => <div data-testid="page-layout">{children}</div>;
});

describe('Contacts Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <Contacts />
      </BrowserRouter>
    );
    
    // Check if basic component elements are rendered
    expect(screen.getByText(/Customer Contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage and track all your customer relationships/i)).toBeInTheDocument();
  });

  test('displays analytics cards', () => {
    render(
      <BrowserRouter>
        <Contacts />
      </BrowserRouter>
    );
    
    // Check if analytics cards are rendered
    expect(screen.getByText(/Total Contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending Follow-ups/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Communications/i)).toBeInTheDocument();
  });

  test('renders search and filter options', () => {
    render(
      <BrowserRouter>
        <Contacts />
      </BrowserRouter>
    );
    
    // Check if search and filter options are rendered
    expect(screen.getByPlaceholderText(/Search contacts.../i)).toBeInTheDocument();
    expect(screen.getByText(/All Statuses/i)).toBeInTheDocument();
  });

  test('renders the Add Contact button', () => {
    render(
      <BrowserRouter>
        <Contacts />
      </BrowserRouter>
    );
    
    // Check if the Add Contact button is rendered
    expect(screen.getByText(/Add Contact/i)).toBeInTheDocument();
  });
}); 