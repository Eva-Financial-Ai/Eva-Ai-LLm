# EVA RAG API Integration

This document describes how the frontend connects to the RAG-only backend via Cloudflare Worker endpoints.

## Endpoints

### 1. RAG Query Endpoint

- **URL**: `/api/rag-query`
- **Method**: POST
- **Content-Type**: application/json
- **Request**: `{ query: string, pipeline: string }`
- **Response**: `{ success: boolean, data: { answer: string, sources: any[] } }`

### 2. PDF Upload Endpoint

- **URL**: `/api/upload-pdf`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Request**: PDF file + pipeline
- **Response**: `{ success: boolean, ... }`

## Integration Instructions

- Use the `sendToRAG` function from `cloudflareAIService.ts` for all chat and RAG queries.
- All API calls must use root-relative paths (e.g., `/api/rag-query`).
- The Worker handles routing and authentication to the correct AutoRAG pipeline.

## Environment

Set the following in your `.env.production`:

```
REACT_APP_API_URL=/api
REACT_APP_RAG_API_URL=/api/rag-query
```

## Legacy Endpoints

> All legacy LLM and /chat endpoints have been removed. Use only the RAG endpoints above.
