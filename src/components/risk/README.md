# Risk Assessment Components

This directory contains the components necessary to provide comprehensive risk assessment and analysis capabilities within the Eva AI financial services platform. These components enable intelligent credit risk evaluation, scenario modeling, and data-driven decision making using both traditional financial metrics and AI-driven insights.

## Overview

The Risk Assessment system implements several sophisticated analytical capabilities:

1. **Eva Risk Report**: AI-powered comprehensive credit analysis using 5Cs framework (Character, Capacity, Capital, Collateral, Conditions)
2. **Credit Bureau Integration**: Aggregated business and owner credit data from multiple sources
3. **Financial Ratio Analysis**: Automated calculation and benchmarking of key financial ratios
4. **Risk Configuration**: Customizable risk parameters and thresholds
5. **Risk Advisor Chat**: Interactive AI assistant for risk-related questions
6. **Scenario Modeling**: Advanced "what-if" analysis for evaluating different business scenarios

These components provide a complete risk assessment infrastructure for:
- Credit worthiness evaluation
- Cash flow and capacity analysis
- Collateral valuation
- Business stability assessment
- Market condition analysis
- Decision recommendations
- Industry benchmark comparison

## Components

### 1. RiskMapEvaReport

The flagship risk analysis component that delivers a comprehensive 5Cs credit analysis with detailed credit bureau data:

```jsx
import RiskMapEvaReport from '../components/risk/RiskMapEvaReport';

// Example usage
<RiskMapEvaReport 
  transactionId={transactionId}
  onScoreUpdate={handleScoreUpdate}
/>
```

This component provides:
- Credit worthiness analysis with detailed bureau data (D&B, Experian, Equifax, TransUnion)
- Business and owner credit profiles
- Credit utilization trends and payment history
- Tradeline analysis and account mix breakdowns
- Risk confidence scoring

### 2. RiskAssessment

The container component that orchestrates the risk assessment process:

```jsx
import RiskAssessment from '../components/risk/RiskAssessment';

// Example usage
<RiskAssessment 
  transactionId={transactionId}
  includeFinancials={true}
  onAssessmentComplete={handleComplete}
/>
```

### 3. RiskConfiguration

Allows administrators to customize risk parameters and thresholds:

```jsx
import RiskConfiguration from '../components/risk/RiskConfiguration';

// Example usage
<RiskConfiguration 
  onConfigurationChange={handleConfigChange}
  defaultSettings={currentSettings}
  industryDefaults={industrySettings}
/>
```

### 4. RiskAdvisorChat

Interactive AI assistant specifically trained for risk-related inquiries:

```jsx
import RiskAdvisorChat from '../components/risk/RiskAdvisorChat';

// Example usage
<RiskAdvisorChat 
  transactionId={transactionId}
  initialContext={riskContext}
  position="floating"
/>
```

### 5. RiskMetricsDisplay

Visualizes key risk metrics in an easily digestible format:

```jsx
import RiskMetricsDisplay from '../components/risk/RiskMetricsDisplay';

// Example usage
<RiskMetricsDisplay 
  metrics={riskMetrics}
  showTrends={true}
  compareToIndustry={true}
/>
```

### 6. ScenarioModeling

New component for creating and evaluating "what-if" business scenarios:

```jsx
import ScenarioModeling from '../components/risk/ScenarioModeling';

// Example usage
<ScenarioModeling
  baselineFinancials={financials}
  industryBenchmarks={benchmarks}
  onScenarioSave={handleSavedScenario}
/>
```

## Implementation Details

### Risk Assessment Flow

1. Transaction data is loaded and initial risk metrics are calculated
2. Credit bureau data is retrieved and processed
3. Financial statements are analyzed for key ratios and trends
4. Industry benchmarks are applied for contextual comparison
5. The Eva AI model evaluates all data points to generate category-specific risk scores
6. A final recommendation is provided based on the comprehensive analysis

### Risk Configuration

Administrators can configure various risk parameters:
- Credit score thresholds
- Debt-to-income ratio limits
- Industry-specific risk factors
- Required documentation based on risk level
- Automatic approval/denial conditions
- Custom scoring weights for different risk factors

## Integration with Other Services

The Risk components integrate with several other Eva AI services:

- **Document Service**: Retrieves and validates financial documents
- **Transaction Service**: Accesses deal details and applicant information
- **Eva AI Core**: Leverages the Nemotron 70B model for advanced risk analysis
- **External APIs**: Connects with credit bureaus and industry databases
- **Blockchain Service**: Verifies document authenticity and data integrity

## Performance Considerations

For optimal performance when using risk components:
- Implement data loading in stages to improve perceived performance
- Use the `useMemo` hook for expensive calculations
- Implement virtualization for large data displays
- Consider using Web Workers for CPU-intensive operations
- Apply skeleton loading states for better user experience

## Recent Updates

- Added scenario modeling capabilities for "what-if" analysis
- Improved risk visualization with interactive charts
- Enhanced integration with EVA AI Nemotron 70B model
- Added industry-specific risk analysis templates
- Implemented drill-down capability for risk factor exploration

## Usage Examples

### Complete Risk Assessment Flow

```jsx
// In your transaction review component
import { useState } from 'react';
import RiskAssessment from '../components/risk/RiskAssessment';
import RiskAdvisorChat from '../components/risk/RiskAdvisorChat';
import { useTransaction } from '../../hooks/useTransaction';

const TransactionReviewPage = () => {
  const { currentTransaction } = useTransaction();
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  
  const handleAssessmentComplete = (result) => {
    setAssessmentComplete(true);
    // Additional handling logic
  };
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Risk Assessment</h1>
      
      {currentTransaction && (
        <>
          <RiskAssessment 
            transactionId={currentTransaction.id}
            onAssessmentComplete={handleAssessmentComplete} 
            includeFinancials={true}
          />
          
          {assessmentComplete && (
            <div className="fixed bottom-4 right-4">
              <RiskAdvisorChat 
                transactionId={currentTransaction.id}
                position="floating"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
```

### Using the Scenario Modeling Tool

```jsx
// In your risk analysis component
import { useState } from 'react';
import ScenarioModeling from '../components/risk/ScenarioModeling';
import RiskMetricsDisplay from '../components/risk/RiskMetricsDisplay';

const ScenarioAnalysisPage = ({ financials, industryBenchmarks }) => {
  const [scenarioResults, setScenarioResults] = useState(null);
  
  const handleScenarioSave = (results) => {
    setScenarioResults(results);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Scenario Modeling</h2>
        <ScenarioModeling
          baselineFinancials={financials}
          industryBenchmarks={industryBenchmarks}
          onScenarioSave={handleScenarioSave}
        />
      </div>
      
      {scenarioResults && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Impact Analysis</h2>
          <RiskMetricsDisplay 
            metrics={scenarioResults.metrics}
            showTrends={true}
            compareToBaseline={true}
          />
        </div>
      )}
    </div>
  );
}; 