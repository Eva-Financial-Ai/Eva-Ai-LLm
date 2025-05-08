# Transaction Approval System with Human-in-the-Loop

The EVA AI Transaction Approval System provides a robust framework for evaluating, approving, declining, or escalating financial transactions based on risk assessment and other factors. This document explains the components, integration points, and configuration options for this system.

## Overview

The Transaction Approval System includes several decision paths for handling transactions:

1. **Direct Approval**: Transactions meeting all criteria can be approved and moved to the next stage (Deal Structuring)
2. **Hard Decline**: Definitive rejection of transactions that don't meet critical requirements
3. **Soft Decline**: Conditional rejection with specific steps to overcome issues
4. **Human-in-the-Loop**: Requesting expert human review when additional assessment is needed

## Key Features

- **Multi-path Decision Flow**: Support for different approval/decline paths with appropriate UI
- **Form State Management**: Structured data capture for all decision types
- **API Integration**: RESTful API service for decision submission and tracking
- **Pending Request Tracking**: System for monitoring human review requests
- **Configurable Criteria**: Customizable reason codes, thresholds, and timelines

## Components

### Frontend Components

- **Transaction Summary Card**: Displays transaction details with approval/decline actions
- **Decision Modals**: UI components for capturing decision details
- **Pending Requests Tracker**: Component for tracking human review requests
- **Success/Error Notifications**: Feedback on action results

### Backend Integration

The system integrates with backend services through the `riskDecisionService` API client:

- **Approval**: `POST /transactions/{id}/approve`
- **Hard Decline**: `POST /transactions/{id}/hard-decline`
- **Soft Decline**: `POST /transactions/{id}/soft-decline`
- **Human Review**: `POST /transactions/{id}/human-review`
- **Pending Requests**: `GET /transactions/{id}/pending-requests`
- **Update Request Status**: `PATCH /requests/{id}/status`

## Data Models

### Human-in-the-Loop Request

```typescript
interface HumanInLoopRequest {
  transactionId: string;
  reason: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
}
```

### Hard Decline Request

```typescript
interface HardDeclineRequest {
  transactionId: string;
  reason: string;
  comments: string;
  declinedBy: string;
}
```

### Soft Decline Request

```typescript
interface SoftDeclineRequest {
  transactionId: string;
  reason: string;
  stepsToOvercome: string;
  reconsiderationTimeline: string;
  declinedBy: string;
}
```

### Pending Request

```typescript
interface PendingRequest {
  id: string;
  transactionId: string;
  type: 'humanInLoop' | 'hardDecline' | 'softDecline';
  status: 'pending' | 'inProgress' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  data: HumanInLoopRequest | HardDeclineRequest | SoftDeclineRequest;
}
```

## Configuration Options

The system is configured through several options in the `config.ts` file:

### Risk Thresholds

```typescript
export const RISK_CONFIG = {
  DEFAULT_RISK_THRESHOLD: 65,
  HIGH_RISK_THRESHOLD: 50, // Scores below this are high risk
  LOW_RISK_THRESHOLD: 80,  // Scores above this are low risk
  AUTO_APPROVAL_THRESHOLD: 90, // Scores above this can be auto-approved
  AUTO_DECLINE_THRESHOLD: 30,  // Scores below this can be auto-declined
};
```

### Feature Flags

```typescript
export const FEATURE_FLAGS = {
  ENABLE_BLOCKCHAIN_VERIFICATION: true,
  ENABLE_AI_RISK_ADVISOR: true,
  ENABLE_AUTOMATED_CREDIT_DECISIONS: true,
  ENABLE_HUMAN_IN_THE_LOOP: true,
  ENABLE_QUANTUM_SECURE_LOGIN: true,
};
```

### Decline Reason Codes

```typescript
export const DECLINE_REASON_CODES = {
  HARD_DECLINE: [
    { value: 'credit_score', label: 'Insufficient Credit Score' },
    // ...other reasons
  ],
  SOFT_DECLINE: [
    { value: 'missing_documents', label: 'Missing Documentation' },
    // ...other reasons
  ],
};
```

## Workflow

1. User reviews transaction details in the Risk Assessment page
2. Based on assessment, user selects one of the actions:
   - Approve & Continue to Deal Structuring
   - Request Human-in-the-Loop (Account Manager Call)
   - Hard Decline
   - Soft Decline
3. Appropriate modal opens to capture additional details
4. On submission, API request is sent to the backend
5. Transaction status is updated and feedback is provided to the user
6. For human review requests, the request is tracked in the Pending Requests section

## Integration with Other Systems

The Transaction Approval System integrates with:

- **Risk Assessment System**: For risk score evaluation
- **User Management System**: For user permissions and assignment
- **Notification System**: For alerting users about pending requests
- **Workflow Engine**: For advancing transactions to next stage
- **Audit System**: For tracking all approval/decline decisions

## Performance Considerations

- Pending requests are fetched when the component mounts and when the transaction changes
- Form submissions include loading states to prevent multiple submissions
- Error handling is implemented to provide feedback on API failures

## Security Considerations

- All API calls should be authenticated
- User permissions should be enforced at the backend
- Sensitive transaction data should be transmitted securely
- Audit logs should be maintained for all decisions

## Future Enhancements

- **Approval/Decline Templates**: Pre-configured templates for common scenarios
- **Bulk Action Support**: Handling multiple transactions at once
- **Enhanced Reporting**: Analytics on approval/decline patterns
- **AI-Powered Recommendations**: Suggestions for handling edge cases
- **Enhanced User Assignment**: Intelligent routing of human review requests
- **Mobile Notifications**: Push notifications for pending requests

## FAQ

**Q: Can a soft declined transaction be reconsidered?**  
A: Yes, soft declined transactions can be reconsidered based on the reconsideration timeline when the applicant addresses the specified issues.

**Q: How are human review requests assigned?**  
A: Currently, requests are assigned manually by administrators. Future versions will include automatic assignment based on expertise and workload.

**Q: Can approval/decline decisions be reversed?**  
A: Hard declines cannot be reversed through the UI and require administrative intervention. Soft declines can be reconsidered through the standard process.

**Q: What happens when a transaction is approved?**  
A: The transaction advances to the Deal Structuring stage where terms are finalized. 