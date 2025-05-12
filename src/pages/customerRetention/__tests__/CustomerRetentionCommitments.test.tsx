import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerRetentionCommitments from '../CustomerRetentionCommitments';

// Mock TopNavigation component to isolate the CustomerRetentionCommitments component in testing
jest.mock('../../../components/layout/TopNavigation', () => {
  return ({ title }: { title: string }) => <div data-testid="top-navigation">{title}</div>;
});

describe('CustomerRetentionCommitments Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <CustomerRetentionCommitments />
      </BrowserRouter>
    );
    
    // Check if basic component elements are rendered
    expect(screen.getByText(/Commitments/i)).toBeInTheDocument();
    expect(screen.getByText(/Track and manage customer agreements and commitments/i)).toBeInTheDocument();
  });

  test('displays dashboard cards', () => {
    render(
      <BrowserRouter>
        <CustomerRetentionCommitments />
      </BrowserRouter>
    );
    
    // Check if dashboard cards are rendered
    expect(screen.getByText(/Active Commitments/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Renewals/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual Commitment Value/i)).toBeInTheDocument();
  });

  test('renders search and filter options', () => {
    render(
      <BrowserRouter>
        <CustomerRetentionCommitments />
      </BrowserRouter>
    );
    
    // Check if search and filter options are rendered
    expect(screen.getByPlaceholderText(/Search commitments.../i)).toBeInTheDocument();
    expect(screen.getByText(/All Statuses/i)).toBeInTheDocument();
    expect(screen.getByText(/All Types/i)).toBeInTheDocument();
  });

  test('renders the Add Commitment button', () => {
    render(
      <BrowserRouter>
        <CustomerRetentionCommitments />
      </BrowserRouter>
    );
    
    // Check if the Add Commitment button is rendered
    expect(screen.getByText(/Add Commitment/i)).toBeInTheDocument();
  });

  test('commitments table has correct columns', () => {
    render(
      <BrowserRouter>
        <CustomerRetentionCommitments />
      </BrowserRouter>
    );
    
    // Check if table columns are rendered
    expect(screen.getByText(/Commitment/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer/i)).toBeInTheDocument();
    expect(screen.getByText(/Type\/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Dates/i)).toBeInTheDocument();
    expect(screen.getByText(/Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Actions/i)).toBeInTheDocument();
  });

  test('add commitment modal opens when Add Commitment button is clicked', () => {
    render(
      <BrowserRouter>
        <CustomerRetentionCommitments />
      </BrowserRouter>
    );
    
    // Find and click the Add Commitment button
    const addButton = screen.getByText(/Add Commitment/i);
    fireEvent.click(addButton);
    
    // Check if modal appears
    expect(screen.getByText(/Add New Commitment/i)).toBeInTheDocument();
  });
}); 