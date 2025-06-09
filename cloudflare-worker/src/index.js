export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Robust CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests to /chat endpoint
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response(JSON.stringify({
        success: false,
        errors: [{ code: 404, message: 'Not Found' }]
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      });
    }

    try {
      const apiToken = env.CLOUDFLARE_API_TOKEN;
      if (!apiToken) {
        throw new Error('API token not configured');
      }

      const body = await request.text();

      // Forward to the correct Cloudflare LLM endpoint
      const cfResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/ai/run/@cf/meta/llama-2-7b-chat-int8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`,
        },
        body,
      });

      const data = await cfResponse.text();
      return new Response(data, {
        status: cfResponse.status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        errors: [{ code: 500, message: error.message || 'Internal Server Error' }]
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      });
    }
  },
}; 