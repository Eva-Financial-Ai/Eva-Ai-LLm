# Cloudflare RAG Proxy Worker

This Worker acts as a secure proxy for forwarding RAG chat and PDF upload requests from your frontend to the correct AutoRAG pipeline, keeping your API tokens safe and resolving CORS issues.

## Required Secrets

- `CF_API_TOKEN_LENDER_RAG`
- `CF_API_TOKEN_EQUIPMENT_RAG`
- `CF_API_TOKEN_REALESTATE_RAG`
- `CF_API_TOKEN_SBA_RAG`
- `CF_API_TOKEN_LENDERLIST_RAG`

## Setup

1. **Install Wrangler:**
   ```sh
   npm install -g wrangler
   ```
2. **Login to Cloudflare:**
   ```sh
   wrangler login
   ```
3. **Add your API tokens as secrets:**
   ```sh
   wrangler secret put CF_API_TOKEN_LENDER_RAG
   wrangler secret put CF_API_TOKEN_EQUIPMENT_RAG
   wrangler secret put CF_API_TOKEN_REALESTATE_RAG
   wrangler secret put CF_API_TOKEN_SBA_RAG
   wrangler secret put CF_API_TOKEN_LENDERLIST_RAG
   ```

## Deploy

From the `cloudflare-worker` directory:
```sh
npx wrangler deploy
```

## Usage

- The Worker is routed at `/api/*` on your production domain (e.g., `https://evafi.ai/api/rag-query`).
- The frontend should always use root-relative API paths (e.g., `/api/rag-query`).

## Debugging

To view live logs:
```sh
npx wrangler tail
```

## Security

- The API tokens are never exposed to the frontend or client devices.
- All requests are securely proxied through the Worker. 