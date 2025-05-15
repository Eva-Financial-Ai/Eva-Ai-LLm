import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RiskMapOptimized } from '../RiskMapOptimized';
import { WorkflowProvider } from '../../../contexts/WorkflowContext';

// Mock the lazy-loaded components
jest.mock('../RiskScoreChart', () => ({
  __esModule: true,
  default: () => <div data-testid="risk-score-chart">RiskScoreChart Component</div>,
}));

jest.mock('../RiskCategoryDetail', () => ({
  __esModule: true,
  default: () => <div data-testid="risk-category-detail">RiskCategoryDetail Component</div>,
}));

jest.mock('../RiskMapNavigator', () => ({
  __esModule: true,
  default: ({ onCategorySelect }) => (
    <div data-testid="risk-map-navigator">
      <button data-testid="credit-button" onClick={() => onCategorySelect('credit')}>
        Credit
      </button>
      <button data-testid="capacity-button" onClick={() => onCategorySelect('capacity')}>
        Capacity
      </button>
    </div>
  ),
}));

// Mock the performance monitor
jest.mock('../../../utils/performance', () => ({
  monitorTransactionLoading: jest.fn(() => jest.fn()),
  trackError: jest.fn(),
}));

// Mock WorkflowContext
const mockWorkflowContext = {
  transactions: [],
  currentTransaction: null,
  loading: false,
  error: null,
  fetchTransactions: jest.fn(),
};

jest.mock('../../../contexts/WorkflowContext', () => ({
  WorkflowProvider: ({ children }) => children,
  useWorkflow: () => mockWorkflowContext,
}));

// Mock the useRiskScores hook
jest.mock('../../../hooks/useRiskCategoryData', () => ({
  useRiskScores: jest.fn(() => ({
    loading: false,
    error: null,
    scores: {
      credit: 85,
      capacity: 78,
      collateral: 82,
      capital: 90,
      conditions: 94,
      character: 95,
      all: 87,
      customer_retention: 88
    }
  }))
}));

describe('RiskMapOptimized', () => {
  // Helper function to render the component with the required context
  const renderWithProviders = ui => {
    return render(<WorkflowProvider>{ui}</WorkflowProvider>);
  };

  beforeEach(() => {
    // Mock the console
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', async () => {
    renderWithProviders(<RiskMapOptimized transactionId="TX-TEST" />);

    // Wait for component to finish initial loading
    await waitFor(() => {
      // Initial category should be loaded
      expect(screen.getByTestId('risk-map-navigator')).toBeInTheDocument();
    });
  });

  test('loads new category data when clicking on a category', async () => {
    renderWithProviders(<RiskMapOptimized transactionId="TX-TEST" initialCategory="all" />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByTestId('risk-map-navigator')).toBeInTheDocument();
    });

    // Click on the credit category
    fireEvent.click(screen.getByTestId('credit-button'));

    // Should show loading state briefly
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Selecting category: credit'));

    // After loading, should show the credit category details
    await waitFor(() => {
      expect(screen.getByTestId('risk-category-detail')).toBeInTheDocument();
    });
  });

  test('displays error message when there is an error', async () => {
    // Mock fetchTransactions to throw an error
    mockWorkflowContext.fetchTransactions.mockRejectedValueOnce(new Error('Test error'));

    render(<RiskMapOptimized />);

    // Should show error message
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  test('renders RiskScoreChart component', async () => {
    renderWithProviders(<RiskMapOptimized />);
    await waitFor(() => {
      expect(screen.getByTestId('risk-score-chart')).toBeInTheDocument();
    });
  });

  test('renders RiskCategoryDetail component for non-all categories', async () => {
    renderWithProviders(<RiskMapOptimized initialCategory="credit" />);
    await waitFor(() => {
      expect(screen.getByTestId('risk-category-detail')).toBeInTheDocument();
    });
  });

  test('updates when riskMapType prop changes', async () => {
    const { rerender } = renderWithProviders(<RiskMapOptimized riskMapType="unsecured" />);
    await waitFor(() => {
      expect(screen.queryByText('Overall Risk Profile')).toBeInTheDocument();
    });

    // Rerender with different risk map type
    rerender(
      <WorkflowProvider>
        <RiskMapOptimized riskMapType="equipment" />
      </WorkflowProvider>
    );
    
    // Test that component updates based on new props
    await waitFor(() => {
      expect(screen.queryByText('Overall Risk Profile')).toBeInTheDocument();
    });
  });

  test('shows loading state when scores are loading', async () => {
    // Override the mock once for this test
    require('../../../hooks/useRiskCategoryData').useRiskScores.mockReturnValueOnce({
      loading: true,
      error: null,
      scores: null
    });

    renderWithProviders(<RiskMapOptimized />);
    
    // Should show loading placeholder instead of content
    expect(screen.queryByText('Overall Risk Profile')).not.toBeInTheDocument();
    const loadingElements = document.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  test('shows error state when there is an error', async () => {
    // Override the mock for this test
    require('../../../hooks/useRiskCategoryData').useRiskScores.mockReturnValueOnce({
      loading: false,
      error: 'Failed to load risk scores',
      scores: null
    });

    renderWithProviders(<RiskMapOptimized />);
    
    await waitFor(() => {
      expect(screen.queryByText('Failed to load risk scores')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });
});
