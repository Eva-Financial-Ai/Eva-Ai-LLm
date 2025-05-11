import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserProfileSimulator from '../UserProfileSimulator';
import { UserTypeProvider } from '../../../contexts/UserTypeContext';
import { UserType } from '../../../types/UserTypes';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock useUserType hook
const mockSetUserType = jest.fn();
jest.mock('../../../contexts/UserTypeContext', () => ({
  ...jest.requireActual('../../../contexts/UserTypeContext'),
  useUserType: () => ({
    setUserType: mockSetUserType,
    userType: null,
  }),
}));

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <UserTypeProvider>{ui}</UserTypeProvider>
    </BrowserRouter>
  );
};

describe('UserProfileSimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  test('renders with borrower role selected by default', () => {
    renderWithProviders(<UserProfileSimulator />);

    // Check for component title
    expect(screen.getByText('User Profile Simulator')).toBeInTheDocument();
    
    // Check that borrower role button has active styling
    const borrowerButton = screen.getByText('borrower');
    expect(borrowerButton.className).toContain('bg-primary-600 text-white');
    
    // Check that initial profile is selected
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Tech Innovators LLC')).toBeInTheDocument();
  });

  test('changes role when user clicks on a different role button', async () => {
    renderWithProviders(<UserProfileSimulator />);

    // Click lender role button
    fireEvent.click(screen.getByText('lender'));
    
    // Check that lender role button has active styling
    await waitFor(() => {
      const lenderButton = screen.getByText('lender');
      expect(lenderButton.className).toContain('bg-primary-600 text-white');
    });
    
    // Check that lender profiles are displayed
    expect(screen.getByText('Thomas Wilson')).toBeInTheDocument();
    expect(screen.getByText('First Capital Bank')).toBeInTheDocument();
    
    // Verify localStorage was updated with the role
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userRole', 'lender');
    
    // Verify setUserType was called with the right UserType enum value
    expect(mockSetUserType).toHaveBeenCalledWith(UserType.LENDER);
  });

  test('changes profile when user selects a different profile', async () => {
    renderWithProviders(<UserProfileSimulator />);

    // First check current profile
    expect(screen.getByText('Active Profile')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Click second profile for current role
    fireEvent.click(screen.getByText('Robert Chen'));
    
    // Check that profile details have updated
    await waitFor(() => {
      expect(screen.getByText('Robert Chen')).toBeInTheDocument();
      expect(screen.getByText('GreenGrow Farms')).toBeInTheDocument();
    });
    
    // Verify localStorage was updated with the profile
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userProfile', expect.any(String));
    const savedProfile = JSON.parse(mockLocalStorage.setItem.mock.calls[1][1]);
    expect(savedProfile.name).toBe('Robert Chen');
  });

  test('navigates to recommended pages when clicked', async () => {
    renderWithProviders(<UserProfileSimulator />);

    // Check that recommended pages section exists
    expect(screen.getByText('Recommended Pages')).toBeInTheDocument();
    
    // Click on a recommended page button
    const creditAppButton = screen.getByText('Credit Application');
    fireEvent.click(creditAppButton);
    
    // Verify navigate was called with correct path
    expect(mockNavigate).toHaveBeenCalledWith('/credit-application');
    
    // Change role and check that recommended pages update
    fireEvent.click(screen.getByText('lender'));
    
    // Check that lender recommended pages appear
    await waitFor(() => {
      expect(screen.getByText('Deal Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    });
    
    // Click new recommended page
    const pipelineButton = screen.getByText('Deal Pipeline');
    fireEvent.click(pipelineButton);
    
    // Verify navigate was called with new path
    expect(mockNavigate).toHaveBeenCalledWith('/pipeline');
  });
}); 