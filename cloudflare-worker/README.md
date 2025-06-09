# Cloudflare LLM Proxy Worker

This Worker acts as a secure proxy for forwarding LLM requests from your frontend to the Cloudflare AI API, keeping your API token safe and resolving CORS issues.

## Cloudflare Configuration (Account: eace6f3c56b5735ae4a9ef385d6ee914)

- **CLOUDFLARE_ACCOUNT_ID:** `eace6f3c56b5735ae4a9ef385d6ee914`
- **Staging Domain CLOUDFLARE_ZONE_ID:** `79cbd8176057c91e2e2329ffd8b386a5`
- **Production Domain CLOUDFLARE_ZONE_ID:** `913680b4428f2f4d1c078dd841cd8cdb`
- **CLOUDFLARE_API_TOKEN:** `qCC_PYqqlXW6ufNP_SuGW8CrhPoKB9BfFZEPuOiT`  
  _This token works for both staging and production._
- **CLOUDFLARE_EMAIL:** `support@evafi.ai`
- **Support Phone Number (Twilio):** `7025762013`

> **IMPORTANT:**
> - **Before releasing to production, update all keys and secrets as needed.**
> - Never commit sensitive keys or tokens to public repositories.

## Setup

1. **Install Wrangler:**
   ```sh
   npm install -g wrangler
   ```
2. **Login to Cloudflare:**
   ```sh
   wrangler login
   ```
3. **Add your Cloudflare API token as a secret:**
   ```sh
   wrangler secret put CLOUDFLARE_API_TOKEN
   ```

## Deploy

From the `cloudflare-worker` directory:
```sh
wrangler deploy
```

## Usage

- The Worker will be deployed to a URL like:
  `https://cloudflare-llm-proxy.<your-account>.workers.dev`
- Update your frontend to POST to this URL instead of the Cloudflare API directly.

## CORS

- The Worker handles CORS preflight and adds the necessary headers for browser compatibility.

## Security

- The API token is never exposed to the frontend or client devices.
- All requests are securely proxied through the Worker. 