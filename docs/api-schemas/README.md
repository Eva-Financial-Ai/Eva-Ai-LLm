# API Schemas

This directory contains OpenAPI/Swagger schema definitions that document the API endpoints provided by the backend.

## Important Note

These schemas are automatically generated from the backend repository and should not be manually edited. They serve as documentation for frontend developers.

## Backend Repository Reference

The authoritative source for these API schemas is the separate backend repository:

```
https://github.com/your-organization/eva-platform-backend
```

## Using API Schemas

Frontend developers can use these schemas to:

1. Understand available endpoints and their parameters
2. Generate TypeScript types for API responses
3. Set up mock services for testing

## Types Generation

To generate TypeScript types from these schemas, run:

```bash
npm run generate-api-types
```

This will create type definitions in `src/types/api/` based on the OpenAPI schemas.

## Endpoint Documentation

For a more detailed documentation of endpoints, refer to:

1. The Swagger UI at https://api.eva-platform.com/swagger/ (production)
2. The local Swagger UI at http://localhost:8080/swagger/ (development)

## API Changes

When the backend team updates the API:

1. They will update the OpenAPI schemas in their repository
2. The CI/CD pipeline will copy the updated schemas to this directory
3. Frontend developers should regenerate types after pulling the latest changes 