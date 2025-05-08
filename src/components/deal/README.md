# Deal Structuring Components

This directory contains the components necessary for intelligent deal structuring and management within the Eva AI financial services platform. These components enable sophisticated financial modeling, payment calculations, and deal optimization to create optimal financing structures for both lenders and borrowers.

## Overview

The Deal Structuring system implements several advanced financial capabilities:

1. **AI-Optimized Deal Structures**: Intelligent financing options based on risk profile and needs
2. **Payment Simulation**: Interactive payment calculators with visualization tools
3. **Amortization Scheduling**: Detailed payment schedules with principal and interest breakdowns
4. **Rate Comparison**: Competitive analysis of available rates and terms
5. **Deal Management**: Complete lifecycle management of financing arrangements

These components provide a complete deal structuring infrastructure for:
- Optimizing financing terms and structures
- Calculating and visualizing payment scenarios
- Generating amortization schedules
- Comparing financing options
- Managing the full deal lifecycle
- Structuring complex multi-party transactions

## Components

### 1. DealStructuring

The core deal optimization component that leverages AI to suggest optimal deal structures:

```jsx
import DealStructuring from './components/deal/DealStructuring';

// Example usage
<DealStructuring 
  transactionId={transactionId}
  riskProfile={riskProfile}
  onStructureSelected={handleStructureSelection}
/>
```

### 2. PaymentCalculator

Interactive calculator for simulating different payment scenarios:

```jsx
import PaymentCalculator from './components/deal/PaymentCalculator';

// Example usage
<PaymentCalculator
  loanAmount={500000}
  defaultRate={5.25}
  defaultTerm={60}
  onCalculationChange={handleCalculationUpdate}
/>
```

### 3. AmortizationSchedule

Detailed visualization of the complete payment schedule over the life of the financing:

```jsx
import AmortizationSchedule from './components/deal/AmortizationSchedule';

// Example usage
<AmortizationSchedule
  principal={loanAmount}
  interestRate={rate}
  term={term}
  paymentFrequency="monthly"
  showFullSchedule={true}
/>
```

### 4. RateComparison

Analysis tool for comparing different rate options and their impact:

```jsx
import RateComparison from './components/deal/RateComparison';

// Example usage
<RateComparison
  baseRate={5.25}
  competitorRates={competitorData}
  termOptions={[36, 48, 60, 84]}
  onRateSelect={handleRateSelection}
/>
```

### 5. DealManagement

Comprehensive deal management interface for tracking the deal lifecycle:

```jsx
import DealManagement from './components/deal/DealManagement';

// Example usage
<DealManagement
  dealId={dealId}
  userRole="lender"
  onStatusChange={handleStatusUpdate}
/>
```

## Implementation Details

### Deal Structuring Flow

1. Risk profile and transaction requirements are analyzed
2. The AI model generates multiple optimized deal structure options
3. Each option is scored based on multiple financial and risk factors
4. The user can compare and customize the suggested structures
5. Selected structure is finalized and prepared for approval
6. Complete documentation is generated based on the chosen structure

### Deal Optimization Factors

The system considers multiple factors when optimizing deal structures:
- Borrower's risk profile and credit strength
- Cash flow analysis and debt service coverage
- Collateral value and quality
- Current market rates and competitive landscape
- Regulatory and compliance requirements
- Lender's portfolio strategy and balance sheet considerations

## Integration with Other Services

The Deal components integrate with several other Eva AI services:

- **Risk Assessment**: Incorporates risk profiles into deal structuring
- **Document Service**: Generates term sheets and financing agreements
- **Eva AI Core**: Powers deal optimization algorithms
- **Blockchain Service**: Enables smart contract-based deal execution
- **Communication Service**: Facilitates deal negotiation and approvals

## Future Enhancements

- Advanced scenario modeling with Monte Carlo simulations
- Multi-currency support for international transactions
- Enhanced tax optimization capabilities
- Integration with external rate sources and market data
- Portfolio-level optimization for lenders
- Custom covenant and condition management

## Usage Examples

### Complete Deal Structuring Flow

```jsx
// In your deal structuring page component
import DealStructuring from './components/deal/DealStructuring';
import AmortizationSchedule from './components/deal/AmortizationSchedule';
import { useState } from 'react';

const DealStructuringPage = ({ transactionId, riskProfile }) => {
  const [selectedStructure, setSelectedStructure] = useState(null);
  
  const handleStructureSelection = (structure) => {
    setSelectedStructure(structure);
    // Additional handling for the selected structure
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Deal Structuring</h1>
      
      <DealStructuring
        transactionId={transactionId}
        riskProfile={riskProfile}
        onStructureSelected={handleStructureSelection}
      />
      
      {selectedStructure && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Payment Schedule</h2>
          <AmortizationSchedule
            principal={selectedStructure.principal}
            interestRate={selectedStructure.rate}
            term={selectedStructure.term}
            paymentFrequency={selectedStructure.paymentFrequency}
            showFullSchedule={true}
          />
        </div>
      )}
    </div>
  );
};
```

### Payment Calculator Example

```jsx
// In your financing options component
import PaymentCalculator from './components/deal/PaymentCalculator';
import RateComparison from './components/deal/RateComparison';
import { useState } from 'react';

const FinancingOptionsPage = ({ availableRates, competitorRates }) => {
  const [calculationParams, setCalculationParams] = useState({
    amount: 500000,
    rate: 5.25,
    term: 60
  });
  
  const handleCalculationUpdate = (params) => {
    setCalculationParams(params);
    // Additional handling for updated calculation
  };
  
  const handleRateSelection = (selectedRate) => {
    setCalculationParams({
      ...calculationParams,
      rate: selectedRate.rate,
      term: selectedRate.term
    });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment Calculator</h2>
        <PaymentCalculator
          loanAmount={calculationParams.amount}
          defaultRate={calculationParams.rate}
          defaultTerm={calculationParams.term}
          onCalculationChange={handleCalculationUpdate}
        />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Rate Comparison</h2>
        <RateComparison
          baseRate={calculationParams.rate}
          competitorRates={competitorRates}
          termOptions={[36, 48, 60, 84]}
          onRateSelect={handleRateSelection}
        />
      </div>
    </div>
  );
};
``` 