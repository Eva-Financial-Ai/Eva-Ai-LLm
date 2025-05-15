import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkflowProvider } from '../../../contexts/WorkflowContext';
import RiskMapNavigator from '../RiskMapNavigator';
import riskMapService from '../RiskMapService';

// Mock the service and its functions
jest.mock('../RiskMapService', () => ({
  mapLoanTypeToRiskMapType: jest.fn(),
  mapRiskMapTypeToLoanType: jest.fn(),
  fetchRiskData: jest.fn().mockResolvedValue({
    score: 82,
    industry_avg: 74,
    confidence: 92,
    categories: {
      credit: { score: 85, status: 'green' },
      capacity: { score: 78, status: 'yellow' },
    },
    findings: []
  })
}));

// Mock the loading service
jest.mock('../../../services/LoadingService', () => {
  const useLoadingStatusMock = () => {
    return [
      { state: 'success', message: 'Loaded successfully' },
      {
        startLoading: jest.fn(),
        updateProgress: jest.fn(),
        completeLoading: jest.fn(),
        setError: jest.fn(),
        resetLoading: jest.fn()
      }
    ];
  };

  return {
    useLoadingStatus: useLoadingStatusMock
  };
});

// Helper function to render the component with necessary providers
const renderRiskMapNavigator = (props = {}) => {
  return render(
    <BrowserRouter>
      <WorkflowProvider>
        <RiskMapNavigator {...props} />
      </WorkflowProvider>
    </BrowserRouter>
  );
};

describe('RiskMapNavigator Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderRiskMapNavigator();
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
  });

  test('renders risk category buttons when loading is successful', () => {
    renderRiskMapNavigator();
    
    // Check for category buttons
    expect(screen.getByText('Credit')).toBeInTheDocument();
    expect(screen.getByText('Capacity')).toBeInTheDocument();
    expect(screen.getByText('Collateral')).toBeInTheDocument();
    expect(screen.getByText('Capital')).toBeInTheDocument();
    expect(screen.getByText('Conditions')).toBeInTheDocument();
    expect(screen.getByText('Character')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Customer Retention')).toBeInTheDocument();
  });

  test('calls onCategorySelect when a category is clicked', () => {
    const onCategorySelectMock = jest.fn();
    renderRiskMapNavigator({ onCategorySelect: onCategorySelectMock });
    
    // Click on a category
    fireEvent.click(screen.getByText('Credit'));
    
    // Check if the callback was called with the correct category
    expect(onCategorySelectMock).toHaveBeenCalledWith('credit');
  });

  test('renders transaction type buttons', () => {
    renderRiskMapNavigator();
    
    // Check for transaction type buttons
    expect(screen.getByText('Unsecured')).toBeInTheDocument();
    expect(screen.getByText('Equipment')).toBeInTheDocument();
    expect(screen.getByText('Realestate')).toBeInTheDocument();
  });

  test('calls onRiskMapTypeChange when a risk map type is clicked', () => {
    const onRiskMapTypeChangeMock = jest.fn();
    renderRiskMapNavigator({ onRiskMapTypeChange: onRiskMapTypeChangeMock });
    
    // Click on a transaction type
    fireEvent.click(screen.getByText('Equipment'));
    
    // Check if the callback was called with the correct type
    expect(onRiskMapTypeChangeMock).toHaveBeenCalledWith('equipment');
  });

  test('renders view mode buttons', () => {
    renderRiskMapNavigator();
    
    // Check for view mode buttons
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Lab')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
  });

  test('calls onViewChange when a view mode is clicked', () => {
    const onViewChangeMock = jest.fn();
    renderRiskMapNavigator({ onViewChange: onViewChangeMock });
    
    // Click on a view mode
    fireEvent.click(screen.getByText('Lab'));
    
    // Check if the callback was called with the correct view
    expect(onViewChangeMock).toHaveBeenCalledWith('lab');
  });

  test('fetches risk data when component mounts', async () => {
    renderRiskMapNavigator();
    
    // Verify service was called to fetch data
    await waitFor(() => {
      expect(riskMapService.fetchRiskData).toHaveBeenCalledWith('unsecured');
    });
  });

  test('highlights the selected category', () => {
    renderRiskMapNavigator({ selectedCategory: 'credit' });
    
    // Get the Credit button and check it has the active class
    const creditButton = screen.getByText('Credit').closest('button');
    expect(creditButton).toHaveClass('bg-primary-100');
  });

  test('highlights the selected risk map type', () => {
    renderRiskMapNavigator({ riskMapType: 'equipment' });
    
    // Get the Equipment button and check it has the active class
    const equipmentButton = screen.getByText('Equipment').closest('button');
    expect(equipmentButton).toHaveClass('bg-primary-100');
  });
}); 