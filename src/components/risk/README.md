# Risk Assessment Components

This directory contains the components necessary to provide comprehensive risk assessment and analysis capabilities within the Eva AI financial services platform. These components enable intelligent credit risk evaluation, scenario modeling, and data-driven decision making using both traditional financial metrics and AI-driven insights.

## Overview

The Risk Assessment system implements several sophisticated analytical capabilities:

1. **Eva Risk Report**: AI-powered comprehensive credit analysis using 5Cs framework (Character, Capacity, Capital, Collateral, Conditions)
2. **Credit Bureau Integration**: Aggregated business and owner credit data from multiple sources
3. **Financial Ratio Analysis**: Automated calculation and benchmarking of key financial ratios
4. **Risk Configuration**: Customizable risk parameters and thresholds
5. **Risk Advisor Chat**: Interactive AI assistant for risk-related questions

These components provide a complete risk assessment infrastructure for:
- Credit worthiness evaluation
- Cash flow and capacity analysis
- Collateral valuation
- Business stability assessment
- Market condition analysis
- Decision recommendations

## Components

### 1. RiskMapEvaReport

The flagship risk analysis component that delivers a comprehensive 5Cs credit analysis with detailed credit bureau data:

```jsx
import RiskMapEvaReport from './components/risk/RiskMapEvaReport';

// Example usage
<RiskMapEvaReport />
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
import RiskAssessment from './components/risk/RiskAssessment';

// Example usage
<RiskAssessment transactionId={transactionId} />
```

### 3. RiskConfiguration

Allows administrators to customize risk parameters and thresholds:

```jsx
import RiskConfiguration from './components/risk/RiskConfiguration';

// Example usage
<RiskConfiguration 
  onConfigurationChange={handleConfigChange}
  defaultSettings={currentSettings}
/>
```

### 4. RiskAdvisorChat

Interactive AI assistant specifically trained for risk-related inquiries:

```jsx
import RiskAdvisorChat from './components/risk/RiskAdvisorChat';

// Example usage
<RiskAdvisorChat transactionId={transactionId} />
```

### 5. RiskMetricsDisplay

Visualizes key risk metrics in an easily digestible format:

```jsx
import RiskMetricsDisplay from './components/risk/RiskMetricsDisplay';

// Example usage
<RiskMetricsDisplay metrics={riskMetrics} />
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

## Integration with Other Services

The Risk components integrate with several other Eva AI services:

- **Document Service**: Retrieves and validates financial documents
- **Transaction Service**: Accesses deal details and applicant information
- **Eva AI Core**: Leverages the Nemotron 70B model for advanced risk analysis
- **External APIs**: Connects with credit bureaus and industry databases

## Future Enhancements

- Machine learning-based risk score optimization based on portfolio performance
- Alternative data sources for improved risk assessment
- Automated financial statement analysis and fraud detection
- Real-time market condition monitoring and impact analysis
- Customizable risk dashboards and reporting

## Usage Examples

### Complete Risk Assessment Flow

```jsx
// In your transaction review component
import RiskAssessment from './components/risk/RiskAssessment';
import { useTransaction } from '../../hooks/useTransactionStore';

const TransactionReviewPage = () => {
  const { currentTransaction } = useTransaction();
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Review</h1>
      
      {currentTransaction && (
        <RiskAssessment 
          transactionId={currentTransaction.id}
          onAssessmentComplete={handleAssessmentComplete} 
        />
      )}
    </div>
  );
};
```

### Using the Risk Advisor

```jsx
// In your risk analysis component
import RiskAdvisorChat from './components/risk/RiskAdvisorChat';
import RiskMapEvaReport from './components/risk/RiskMapEvaReport';

const RiskAnalysisPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <RiskMapEvaReport />
      </div>
      <div className="lg:col-span-1">
        <RiskAdvisorChat transactionId={transactionId} />
      </div>
    </div>
  );
};
``` 