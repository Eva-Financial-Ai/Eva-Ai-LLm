import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RiskMapEvaReport } from '../RiskMapEvaReport';

// Mock the transaction store
jest.mock('../../../hooks/useTransactionStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    currentTransaction: {
      id: 'tx-123',
      applicantData: { name: 'Test Company' },
      riskProfile: {},
    },
    loading: false,
    error: null,
    fetchTransactions: jest.fn(),
    setCurrentTransaction: jest.fn(),
    transactions: [
      {
        id: 'tx-123',
        applicantData: { name: 'Test Company' },
        currentStage: 'risk_assessment',
        riskProfile: {},
      },
    ],
  })),
  getState: jest.fn(() => ({
    currentTransaction: {
      id: 'tx-123',
      applicantData: { name: 'Test Company' },
      riskProfile: {},
    },
    transactions: [
      {
        id: 'tx-123',
        applicantData: { name: 'Test Company' },
        currentStage: 'risk_assessment',
        riskProfile: {},
      },
    ],
    setCurrentTransaction: jest.fn(),
  })),
}));

describe('RiskMapEvaReport', () => {
  beforeEach(() => {
    // Mock the console
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Clear the setTimeout/setInterval
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders without crashing', async () => {
    render(<RiskMapEvaReport />);

    // Wait for component to finish initial loading
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      // Should render the credit tab by default
      expect(screen.getByText('Credit Worthiness')).toBeInTheDocument();
    });
  });

  test('loads different categories when clicking on tabs', async () => {
    render(<RiskMapEvaReport />);

    // Wait for initial render and credit tab to load
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      expect(screen.getByText('Credit Worthiness')).toBeInTheDocument();
    });

    // Find the capacity tab and click it
    const capacityTab = screen.getByText('Capacity Analysis');
    fireEvent.click(capacityTab);

    // Should be loading capacity data
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Selecting category: capacity')
    );

    // Wait for fake API call to resolve
    jest.advanceTimersByTime(600);

    // After loading, should show the capacity content
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      expect(screen.getByText('Capacity Analysis')).toBeInTheDocument();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Finished loading data for category capacity')
      );
    });
  });

  test('displays loading state for categories', async () => {
    render(<RiskMapEvaReport />);

    // Wait for initial render
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      expect(screen.getByText('Credit Worthiness')).toBeInTheDocument();
    });

    // Clear the console logs from initial render
    jest.clearAllMocks();

    // Find the collateral tab and click it
    const collateralTab = screen.getByText('Collateral Evaluation');
    fireEvent.click(collateralTab);

    // Should log loading for collateral category
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Loading data for category collateral')
      );
    });

    // Advance timers to finish loading
    jest.advanceTimersByTime(600);

    // Should log completion
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Finished loading data for category collateral')
      );
    });
  });

  test('does not reload already loaded categories', async () => {
    render(<RiskMapEvaReport />);

    // Wait for initial render (credit tab)
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    await waitFor(() => {
      expect(screen.getByText('Credit Worthiness')).toBeInTheDocument();
    });

    // Click on capacity tab to load it
    const capacityTab = screen.getByText('Capacity Analysis');
    fireEvent.click(capacityTab);

    // Advance timers to finish loading
    jest.advanceTimersByTime(600);

    // Clear console logs
    jest.clearAllMocks();

    // Click back to the credit tab
    const creditTab = screen.getByText('Credit Worthiness');
    fireEvent.click(creditTab);

    // Should log that we're selecting credit but NOT reloading it
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Selecting category: credit'));
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Category credit already loaded, skipping')
    );

    // No loading should occur
    expect(console.log).not.toHaveBeenCalledWith(
      expect.stringContaining('Loading data for category credit')
    );
  });
});
