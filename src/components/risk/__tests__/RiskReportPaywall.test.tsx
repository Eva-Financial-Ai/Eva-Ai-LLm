import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkflowProvider } from '../../../contexts/WorkflowContext';
import RiskReportPaywall from '../RiskReportPaywall';
import riskMapService from '../RiskMapService';

// Mock the RiskMapService
jest.mock('../RiskMapService', () => ({
  getAvailableCredits: jest.fn(() => 5),
  purchaseReport: jest.fn(() => true),
  addCredits: jest.fn(),
  isReportPurchased: jest.fn(() => false)
}));

// Mock the WorkflowContext
jest.mock('../../../contexts/WorkflowContext', () => ({
  useWorkflow: () => ({
    currentTransaction: { id: 'test-transaction-123' }
  }),
  WorkflowProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('RiskReportPaywall Component', () => {
  const onPurchaseCompleteMock = jest.fn();
  const onCloseMock = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const renderPaywall = () => {
    return render(
      <BrowserRouter>
        <WorkflowProvider>
          <RiskReportPaywall
            riskMapType="unsecured"
            onPurchaseComplete={onPurchaseCompleteMock}
            onClose={onCloseMock}
          />
        </WorkflowProvider>
      </BrowserRouter>
    );
  };
  
  test('renders without crashing', () => {
    renderPaywall();
    expect(screen.getByText('Risk Report Paywall')).toBeInTheDocument();
  });
  
  test('displays package options', () => {
    renderPaywall();
    expect(screen.getByText('Single Report')).toBeInTheDocument();
    expect(screen.getByText('Standard (5 Credits)')).toBeInTheDocument();
    expect(screen.getByText('Premium (30 Credits)')).toBeInTheDocument();
  });
  
  test('displays payment methods', () => {
    renderPaywall();
    expect(screen.getByText('Account Credits')).toBeInTheDocument();
    expect(screen.getByText('ACH / Bank Transfer')).toBeInTheDocument();
    expect(screen.getByText('Wire Transfer')).toBeInTheDocument();
    expect(screen.getByText('Coinbase (USDC)')).toBeInTheDocument();
  });
  
  test('closes when close button is clicked', () => {
    renderPaywall();
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });
  
  test('processes payment and calls onPurchaseComplete when using credits', async () => {
    renderPaywall();
    
    // Select 'Account Credits' payment method
    const creditOption = screen.getByText('Account Credits');
    fireEvent.click(creditOption);
    
    // Click the payment button
    const paymentButton = screen.getByRole('button', { name: 'Proceed with Payment' });
    fireEvent.click(paymentButton);
    
    // Check if the payment was processed
    expect(riskMapService.purchaseReport).toHaveBeenCalledWith('test-transaction-123', 'unsecured');
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Report purchased successfully/i)).toBeInTheDocument();
    });
    
    // Check if onPurchaseComplete was called
    await waitFor(() => {
      expect(onPurchaseCompleteMock).toHaveBeenCalled();
    });
  });
  
  test('displays error message when purchase fails', async () => {
    // Mock purchaseReport to fail
    (riskMapService.purchaseReport as jest.Mock).mockReturnValueOnce(false);
    
    renderPaywall();
    
    // Select 'Account Credits' payment method
    const creditOption = screen.getByText('Account Credits');
    fireEvent.click(creditOption);
    
    // Click the payment button
    const paymentButton = screen.getByRole('button', { name: 'Proceed with Payment' });
    fireEvent.click(paymentButton);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to apply credits/i)).toBeInTheDocument();
    });
    
    // onPurchaseComplete should not be called
    expect(onPurchaseCompleteMock).not.toHaveBeenCalled();
  });
}); 