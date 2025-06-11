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

    // Handle /api/rag-query for RAG integration
    if (request.method === 'POST' && url.pathname === '/api/rag-query') {
      try {
        const apiToken = env.CLOUDFLARE_API_TOKEN;
        if (!apiToken) {
          throw new Error('API token not configured');
        }
        const { query } = await request.json();
        if (!query) {
          return new Response(JSON.stringify({ success: false, error: 'Missing query' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        // Call the AutoRAG API for real estate
        const ragResponse = await fetch(
          'https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/real-estate-rag/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
              query,
              rewrite_query: true,
              max_num_results: 5,
              ranking_options: { score_threshold: 0.3 },
            }),
          }
        );
        const ragData = await ragResponse.json();
        // Assume ragData.result.answer and ragData.result.sources
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              answer: ragData.result?.answer || '',
              sources: ragData.result?.sources || [],
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message || 'Internal Server Error',
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle /api/equipment-rag-query for Equipment RAG integration
    if (request.method === 'POST' && url.pathname === '/api/equipment-rag-query') {
      try {
        const apiToken = env.CF_API_TOKEN;
        if (!apiToken) {
          throw new Error('API token not configured');
        }
        const { query } = await request.json();
        if (!query) {
          return new Response(JSON.stringify({ success: false, error: 'Missing query' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        // Call the AutoRAG API for equipment-vehicle-rag
        const ragResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/equipment-vehicle-rag/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            query,
            rewrite_query: true,
            max_num_results: 5,
            ranking_options: { score_threshold: 0.3 },
          }),
        });
        const ragData = await ragResponse.json();
        return new Response(JSON.stringify({ success: true, data: ragData.result }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle /api/sba-rag-query for SBA RAG integration
    if (request.method === 'POST' && url.pathname === '/api/sba-rag-query') {
      try {
        const apiToken = env.CF_API_TOKEN;
        if (!apiToken) {
          throw new Error('API token not configured');
        }
        const { query } = await request.json();
        if (!query) {
          return new Response(JSON.stringify({ success: false, error: 'Missing query' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        // Call the AutoRAG API for sba-rag
        const ragResponse = await fetch('https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/sba-rag/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
          },
          body: JSON.stringify({
            query,
            rewrite_query: true,
            max_num_results: 5,
            ranking_options: { score_threshold: 0.3 },
          }),
        });
        const ragData = await ragResponse.json();
        return new Response(JSON.stringify({ success: true, data: ragData.result }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle /chat endpoint (classic LLM)
    if (request.method === 'POST' && url.pathname === '/chat') {
      try {
        const apiToken = env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_API_KEY;
        const accountId = env.CLOUDFLARE_ACCOUNT_ID;
        const model = env.CLOUDFLARE_MODEL || '@cf/meta/llama-3-8b-instruct';
        if (!apiToken || !accountId || !model) {
          throw new Error('API credentials or model not configured');
        }
        const body = await request.text();
        // Forward to the correct Cloudflare LLM endpoint
        const cfResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiToken}`,
            },
            body,
          }
        );
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
    }

    // Fallback: 404 Not Found
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
  },
}; 