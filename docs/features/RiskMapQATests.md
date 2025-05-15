# Risk Map QA Test Plan

This document outlines the test cases for the Risk Map feature of the EVA platform.

## Test Environment Setup

Before running the tests, ensure:

1. Development environment is properly set up with the latest code
2. Development server is running (`npm start`)
3. A test transaction exists in the system
4. You are logged in as a user with appropriate permissions

## Test Cases

### 1. Component Rendering

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 1.1 | RiskAssessmentPage loads successfully | Navigate to `/risk-assessment` or `/risk-assessment/:transactionId` | Page loads without errors and displays the Risk Dashboard | ❌ |
| 1.2 | RiskDashboard renders correctly | View the Risk Assessment page | RiskDashboard displays with both the navigator (left) and content (right) areas | ❌ |
| 1.3 | RiskMapNavigator renders correctly | View the Risk Assessment page | Left sidebar shows categories, transaction types, and view options | ❌ |
| 1.4 | RiskMapOptimized renders correctly | View the Risk Assessment page | Main content area shows risk data, score, and chart | ❌ |

### 2. Risk Category Selection

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 2.1 | Default category is 'all' | Load the Risk Assessment page | 'all' category is selected by default | ❌ |
| 2.2 | Select 'credit' category | Click on the 'Credit' button in the navigator | 'Credit' category is selected and relevant data is displayed | ❌ |
| 2.3 | Select 'capacity' category | Click on the 'Capacity' button in the navigator | 'Capacity' category is selected and relevant data is displayed | ❌ |
| 2.4 | Select 'collateral' category | Click on the 'Collateral' button in the navigator | 'Collateral' category is selected and relevant data is displayed | ❌ |
| 2.5 | Select 'capital' category | Click on the 'Capital' button in the navigator | 'Capital' category is selected and relevant data is displayed | ❌ |
| 2.6 | Select 'conditions' category | Click on the 'Conditions' button in the navigator | 'Conditions' category is selected and relevant data is displayed | ❌ |
| 2.7 | Select 'character' category | Click on the 'Character' button in the navigator | 'Character' category is selected and relevant data is displayed | ❌ |
| 2.8 | Select 'customer_retention' category | Click on the 'Customer Retention' button in the navigator | 'Customer Retention' category is selected and relevant data is displayed | ❌ |

### 3. Risk Map Type Selection

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 3.1 | Default type is 'unsecured' | Load the Risk Assessment page | 'Unsecured' type is selected by default | ❌ |
| 3.2 | Select 'equipment' type | Click on the 'Equipment' button in the navigator | 'Equipment' type is selected and data is reloaded with equipment-specific metrics | ❌ |
| 3.3 | Select 'realestate' type | Click on the 'Realestate' button in the navigator | 'Realestate' type is selected and data is reloaded with real estate-specific metrics | ❌ |
| 3.4 | Return to 'unsecured' type | Click on the 'Unsecured' button in the navigator | 'Unsecured' type is selected and data is reloaded with unsecured loan metrics | ❌ |

### 4. View Mode Selection

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 4.1 | Default view is 'standard' | Load the Risk Assessment page | 'Standard' view is selected by default | ❌ |
| 4.2 | Select 'lab' view | Click on the 'Lab' button in the navigator | Detailed view is displayed with comprehensive metrics | ❌ |
| 4.3 | Select 'score' view | Click on the 'Score' button in the navigator | Summary view is displayed with simplified metrics | ❌ |
| 4.4 | Return to 'standard' view | Click on the 'Standard' button in the navigator | Standard view is restored | ❌ |

### 5. Data Loading and Error Handling

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 5.1 | Loading indicators display correctly | Observe the UI when data is loading | Loading indicators are shown during data fetching | ❌ |
| 5.2 | Error handling works correctly | Simulate a network error (disconnect internet) | Error message is displayed with a "Try Again" button | ❌ |
| 5.3 | Empty state handling | View a transaction with no risk data | Appropriate empty state message is displayed | ❌ |
| 5.4 | Recovery from errors | Click "Try Again" after an error | System attempts to reload data and display it correctly | ❌ |

### 6. Component Integration

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 6.1 | Category change updates all components | Change the category from 'all' to 'credit' | Both navigator and content area reflect the change | ❌ |
| 6.2 | Type change updates all components | Change the type from 'unsecured' to 'equipment' | Both navigator and content area reflect the change | ❌ |
| 6.3 | View mode change updates all components | Change the view mode from 'standard' to 'lab' | Both navigator and content area reflect the change | ❌ |
| 6.4 | Combination of changes works correctly | Change category, type, and view mode in sequence | All changes are reflected correctly across components | ❌ |

### 7. Visual Appearance and Responsiveness

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 7.1 | Desktop layout | View on a desktop screen (>1024px width) | Two-column layout with navigator on left and content on right | ❌ |
| 7.2 | Tablet layout | View on a tablet screen (768px-1024px width) | Responsive layout adjusts to maintain usability | ❌ |
| 7.3 | Mobile layout | View on a mobile screen (<768px width) | Stacked layout with navigator above content | ❌ |
| 7.4 | Color scheme and styling | Observe UI elements | Consistent color scheme and styling across all components | ❌ |

### 8. Transaction Context

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 8.1 | Load with transaction ID in URL | Navigate to `/risk-assessment/123` where 123 is a valid transaction ID | Risk data for the specific transaction is loaded | ❌ |
| 8.2 | Load with current transaction | Navigate to `/risk-assessment` when a transaction is selected in the workflow | Risk data for the current transaction is loaded | ❌ |
| 8.3 | Changing transactions | Select a different transaction in the workflow | Risk data updates for the newly selected transaction | ❌ |

### 9. Data Updates

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 9.1 | Refresh data | Click a refresh button or change transaction | Fresh data is loaded from the API | ❌ |
| 9.2 | Data consistency | Compare data across different views | Data is consistent when changing view modes | ❌ |
| 9.3 | Chart data accuracy | View the risk score chart | Chart accurately reflects the risk scores for each category | ❌ |

### 10. Edge Cases

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 10.1 | Very high scores | View a transaction with very high risk scores (>95) | UI correctly displays and formats high scores | ❌ |
| 10.2 | Very low scores | View a transaction with very low risk scores (<10) | UI correctly displays and formats low scores | ❌ |
| 10.3 | Missing data | View a transaction with some missing risk category data | UI handles missing data gracefully | ❌ |
| 10.4 | Rapid interactions | Quickly change categories, types, and views | UI handles rapid changes without breaking | ❌ |

### 11. Risk Criteria Configuration

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 11.1 | Toggle to configuration view | Click the "Configure Criteria" button in the navigator | Configuration panel is displayed instead of the category/type selection | ❌ |
| 11.2 | Default criteria display | Open the configuration panel | Default configuration criteria for each category are loaded and displayed | ❌ |
| 11.3 | Category tab switching | Click on different category tabs (Creditworthiness, Financial Statements, etc.) | Appropriate criteria for that category are displayed in the dropdown | ❌ |
| 11.4 | Selecting a criterion | Select a criterion from the dropdown | Configuration panel displays the ranges for that criterion | ❌ |
| 11.5 | Modify range values | Change min/max values for a range | Changes are saved and reflected in the summary view | ❌ |
| 11.6 | Add new range | Click "Add Range" button | A new range is added to the criterion | ❌ |
| 11.7 | Remove a range | Click the delete button for a range | The range is removed from the criterion | ❌ |
| 11.8 | Equipment-specific criteria | Set risk map type to "equipment" and open the configuration | Equipment-specific criteria (Equipment Type Demand, Equipment Age, etc.) are available | ❌ |
| 11.9 | Real estate-specific criteria | Set risk map type to "realestate" and open the configuration | Real estate-specific criteria (Loan-to-Value Ratio, Property Class, etc.) are available | ❌ |
| 11.10 | Criteria persistence | Make changes to criteria, toggle back to map view, then back to configuration | Changes to criteria are preserved | ❌ |
| 11.11 | Test different point values | Modify the points assigned to different ranges | Summary view correctly calculates total points based on updated values | ❌ |
| 11.12 | Test data source selection | Select different data sources for a criterion | Selected data source is saved and displayed | ❌ |

### 12. Risk Criteria Display in Views

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 12.1 | Summary view with custom criteria | Configure custom criteria, then view the summary view | Summary view displays data organized by the custom criteria | ❌ |
| 12.2 | Detailed view with custom criteria | Configure custom criteria, then view the detailed view | Detailed view shows data according to custom criteria thresholds | ❌ |
| 12.3 | Range color coding | Configure different status levels (good, average, negative) and view the map | Values are properly color-coded according to configured ranges | ❌ |
| 12.4 | Risk point calculation | Configure different point values for ranges and view the summary | Total risk score is correctly calculated based on configured points | ❌ |
| 12.5 | Display of custom text thresholds | Configure text-based thresholds (e.g., "High demand" vs "Low demand") | Custom text thresholds are displayed correctly in the assessment | ❌ |
| 12.6 | Category score display | Configure multiple criteria in a category with different points | Category-level scores are correctly calculated from criteria scores | ❌ |
| 12.7 | Changing a criterion affects overall score | Modify a criterion range and observe the overall score | Overall risk score is updated based on the criterion change | ❌ |

### 13. Risk Report Purchase Flow

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 13.1 | Paywall displays correctly | Open the Risk Map and click "Purchase Report" | Paywall modal appears with package options and payment methods | ❌ |
| 13.2 | Credit purchase option works | Select "Account Credits" and proceed with payment (ensure credits are available) | Payment processes, report becomes available, credits are reduced | ❌ |
| 13.3 | Purchase button visibility | View Risk Map when report is not purchased | "Purchase Report" button should be visible | ❌ |
| 13.4 | Purchase confirmation | Complete a purchase | Success message is shown and report content is displayed | ❌ |
| 13.5 | Purchased report persistence | Purchase a report, then refresh the page | Report should still be accessible without requiring another purchase | ❌ |
| 13.6 | Payment method selection | Click on different payment methods in the paywall | Selected payment method should be highlighted | ❌ |
| 13.7 | Credit package selection | Click on different credit packages | Selected package should be highlighted, price should update | ❌ |
| 13.8 | Insufficient credits message | Try to purchase with credits when none are available | "Insufficient Credits" message should appear | ❌ |
| 13.9 | Credit purchase adds credits | Purchase the Standard package (5 credits) | 5 credits should be added to your account | ❌ |
| 13.10 | Multiple report types | Purchase report for one loan type (e.g., "unsecured") | Only that loan type should be unlocked, others still require purchase | ❌ |

### 14. Risk Report Content After Purchase

| Test ID | Test Description | Steps | Expected Result | Status |
|---------|-----------------|-------|-----------------|--------|
| 14.1 | Full report content | Purchase report and view | All report sections should be visible with complete data | ❌ |
| 14.2 | Risk score visibility | Purchase report and check score display | Risk score should be visible and match expected calculation | ❌ |
| 14.3 | Report PDF export | Look for PDF export option after purchase | Option to export/download PDF report should be available | ❌ |
| 14.4 | Detailed metrics | Purchase report and view detailed metrics | All detailed metrics should be visible and correctly formatted | ❌ |
| 14.5 | Report history | Purchase multiple reports and check history | All purchased reports should be listed in history section | ❌ |
| 14.6 | Report expiration | Check purchased report after expiration date | Report should require repurchase after expiration (30 days) | ❌ |

## Verification Checklist

After completing all tests, verify the following:

- [ ] All components render correctly
- [ ] All user interactions work as expected
- [ ] Data is displayed correctly in all views
- [ ] Error states are handled properly
- [ ] UI is responsive across different device sizes
- [ ] No console errors are present during normal operation
- [ ] Performance is acceptable (no noticeable lag)

## Execution Notes

Record any bugs, issues, or observations during testing here:

1. 
2. 
3. 

## Final Sign-off

- QA Engineer: ________________________ Date: ____________
- Developer: __________________________ Date: ____________ 