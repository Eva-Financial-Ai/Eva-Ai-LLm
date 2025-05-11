# API Schemas Documentation

This directory contains OpenAPI/Swagger schema definitions that document the REST API endpoints provided by the EVA Platform backend services. These schemas serve as the contract between frontend and backend services.

## Important Note

These schemas are automatically generated from the backend repository and should not be manually edited. They serve as documentation for frontend developers and are used to generate TypeScript types for frontend API integration.

## Backend Repository Reference

The authoritative source for these API schemas is the separate backend repository:

```
https://github.com/your-organization/eva-platform-backend
```

## Using API Schemas

Frontend developers can use these schemas to:

1. Understand available endpoints, their parameters, and expected responses
2. Generate TypeScript types for API requests and responses
3. Set up mock services for testing and development
4. Ensure type safety when interacting with backend services

## Primary API Domains

The EVA Platform API is divided into several domains:

1. **Authentication** - User login, registration, and token management
2. **Transaction** - Deal/loan application management
3. **Document** - Document upload, verification, and management
4. **Risk** - Risk assessment and credit analysis
5. **User** - User profile and permission management
6. **Organization** - Company and team management
7. **Communication** - Messaging and notification services
8. **Analytics** - Reporting and data analysis
9. **Blockchain** - Document verification and timestamping

## Types Generation

To generate TypeScript types from these schemas, run:

```bash
npm run generate-api-types
```

This will create type definitions in `src/types/api/` based on the OpenAPI schemas. These types can then be imported into your components:

```typescript
import { TransactionDto, RiskAssessmentResponse } from '../../types/api';
```

## API Client Integration

The generated types can be used with the API client in `src/api`:

```typescript
import { getTransaction, updateTransactionStatus } from '../../api/transactionApi';

// Type-safe API calls
const transaction = await getTransaction(transactionId);
await updateTransactionStatus(transactionId, { status: 'APPROVED' });
```

## Endpoint Documentation

For detailed API documentation, refer to:

1. The Swagger UI at https://api.eva-platform.com/swagger/ (production)
2. The local Swagger UI at http://localhost:8080/swagger/ (development)
3. Individual schema files in this directory (e.g., `transaction-api.yaml`)

## Mock Services

For development without a backend, mock services are available:

```typescript
import { enableMocks } from '../../api/mockService';

// Enable mocks (typically controlled by environment variable)
if (process.env.REACT_APP_ENABLE_MOCKS === 'true') {
  enableMocks();
}
```

## API Changes and Versioning

When the backend team updates the API:

1. They will update the OpenAPI schemas in their repository
2. The CI/CD pipeline will copy the updated schemas to this directory
3. Frontend developers should regenerate types after pulling the latest changes
4. API version changes are indicated in the schema files

## API Authentication

All authenticated endpoints require a valid JWT token in the Authorization header:

```typescript
// Example API call with authentication
const response = await fetch('/api/transactions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

The auth token is automatically managed by the API client in `src/api/apiClient.ts`.

## Rate Limiting

The API implements rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit information is provided in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed in the period
- `X-RateLimit-Remaining`: Requests remaining in the current period
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

## Error Handling

API errors follow a standard format:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid transaction status",
  "details": [
    {
      "field": "status",
      "message": "Status must be one of: DRAFT, SUBMITTED, APPROVED, REJECTED"
    }
  ]
}
```

Frontend components should handle these errors consistently using the error handling utilities in `src/utils/errorHandling.ts`. 