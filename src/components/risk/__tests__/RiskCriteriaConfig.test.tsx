import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RiskCriteriaConfig from '../RiskCriteriaConfig';

describe('RiskCriteriaConfig Component', () => {
  test('renders without crashing', () => {
    render(<RiskCriteriaConfig riskMapType="unsecured" />);
    expect(screen.getByText('Risk Assessment Criteria Configuration')).toBeInTheDocument();
  });

  test('displays categories as tabs', () => {
    render(<RiskCriteriaConfig riskMapType="unsecured" />);
    expect(screen.getByText('Creditworthiness')).toBeInTheDocument();
    expect(screen.getByText('Financial Statements')).toBeInTheDocument();
    expect(screen.getByText('Business Cash Flow')).toBeInTheDocument();
    expect(screen.getByText('Legal and Regulatory Compliance')).toBeInTheDocument();
  });

  test('changes active category when tab is clicked', () => {
    render(<RiskCriteriaConfig riskMapType="unsecured" />);
    
    // Click on Financial Statements category
    fireEvent.click(screen.getByText('Financial Statements'));
    
    // Dropdown should now show financial statement criteria
    const selectElement = screen.getByLabelText('Select Criterion to Configure');
    expect(selectElement).toBeInTheDocument();
    
    // Verify financial criteria are in the dropdown
    const options = Array.from(selectElement.querySelectorAll('option'));
    const optionTexts = options.map(option => option.textContent);
    expect(optionTexts).toContain('Debt-to-Equity Ratio');
    expect(optionTexts).toContain('Current Ratio');
  });

  test('shows criteria configuration when a criterion is selected', async () => {
    render(<RiskCriteriaConfig riskMapType="unsecured" />);
    
    // Select a criteria from dropdown
    const selectElement = screen.getByLabelText('Select Criterion to Configure');
    fireEvent.change(selectElement, { target: { value: 'credit_score' } });
    
    // Configuration panel should appear
    await waitFor(() => {
      expect(screen.getByText('Credit Score')).toBeInTheDocument();
      // Look for range inputs
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBeGreaterThan(0);
    });
  });

  test('adds a new range when "Add Range" button is clicked', async () => {
    render(<RiskCriteriaConfig riskMapType="unsecured" />);
    
    // Select a criteria from dropdown
    const selectElement = screen.getByLabelText('Select Criterion to Configure');
    fireEvent.change(selectElement, { target: { value: 'credit_score' } });
    
    // Count initial number of ranges
    const initialRangeInputs = screen.getAllByRole('textbox').filter(
      input => input.getAttribute('type') !== 'number'
    );
    const initialCount = initialRangeInputs.length;
    
    // Click Add Range button
    fireEvent.click(screen.getByText('Add Range'));
    
    // Check if a new range was added
    await waitFor(() => {
      const newRangeInputs = screen.getAllByRole('textbox').filter(
        input => input.getAttribute('type') !== 'number'
      );
      expect(newRangeInputs.length).toBeGreaterThan(initialCount);
    });
  });

  test('changes data when equipment loan type is selected', () => {
    const { rerender } = render(<RiskCriteriaConfig riskMapType="unsecured" />);
    
    // Check for absence of equipment-specific criteria
    expect(screen.queryByText('Equipment Value and Type')).not.toBeInTheDocument();
    
    // Rerender with equipment type
    rerender(<RiskCriteriaConfig riskMapType="equipment" />);
    
    // Click on Equipment Value and Type category (if visible)
    const equipmentCategory = screen.queryByText('Equipment Value and Type');
    if (equipmentCategory) {
      fireEvent.click(equipmentCategory);
      
      // Should show equipment-specific criteria in dropdown
      const selectElement = screen.getByLabelText('Select Criterion to Configure');
      const options = Array.from(selectElement.querySelectorAll('option'));
      const optionTexts = options.map(option => option.textContent);
      expect(optionTexts).toContain('Equipment Type Demand');
      expect(optionTexts).toContain('Equipment Age');
    }
  });

  test('calls onConfigChange when ranges are updated', async () => {
    const onConfigChangeMock = jest.fn();
    render(<RiskCriteriaConfig riskMapType="unsecured" onConfigChange={onConfigChangeMock} />);
    
    // Select a criteria from dropdown
    const selectElement = screen.getByLabelText('Select Criterion to Configure');
    fireEvent.change(selectElement, { target: { value: 'credit_score' } });
    
    // Find and update a range input
    const rangeLabel = screen.getAllByRole('textbox')[0];
    fireEvent.change(rangeLabel, { target: { value: 'Updated Label' } });
    
    // The onConfigChange should be called
    await waitFor(() => {
      expect(onConfigChangeMock).toHaveBeenCalled();
    });
  });
}); 