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

    // Unified RAG endpoint for all pipelines
    if (request.method === 'POST' && url.pathname === '/api/rag-query') {
      try {
        const { query, pipeline } = await request.json();
        if (!query || !pipeline) {
          return new Response(JSON.stringify({ success: false, error: 'Missing query or pipeline' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Map pipeline to endpoint and token
        const pipelineMap = {
          lender: {
            endpoint: 'https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/lender-rag/ai-search',
            token: env.CF_API_TOKEN_LENDER_RAG,
          },
          equipment: {
            endpoint: 'https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/equipment-vehicle-rag/ai-search',
            token: env.CF_API_TOKEN_EQUIPMENT_RAG,
          },
          realestate: {
            endpoint: 'https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/real-estate-rag/ai-search',
            token: env.CF_API_TOKEN_REALESTATE_RAG,
          },
          sba: {
            endpoint: 'https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/sba-rag/ai-search',
            token: env.CF_API_TOKEN_SBA_RAG,
          },
          lenderlist: {
            endpoint: 'https://api.cloudflare.com/client/v4/accounts/eace6f3c56b5735ae4a9ef385d6ee914/autorag/rags/lenderlist-rag/ai-search',
            token: env.CF_API_TOKEN_LENDERLIST_RAG,
          },
        };

        const selected = (pipeline || '').toLowerCase();
        const config = pipelineMap[selected];

        if (!config || !config.token) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid or missing pipeline/token' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Call the correct AutoRAG ai-search endpoint
        const ragResponse = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.token}`,
          },
          body: JSON.stringify({
            query,
            rewrite_query: true,
            max_num_results: 5,
            ranking_options: { score_threshold: 0.3 },
          }),
        });

        const ragData = await ragResponse.json();
        const answer = ragData.result?.answer;
        const sources = ragData.result?.sources || [];

        return new Response(
          JSON.stringify({
            success: true,
            data: {
              answer: answer && answer.trim()
                ? answer
                : "I'm sorry, I could not find an answer to your question in the current documents.",
              sources,
            },
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            errors: [{ code: 500, message: 'Internal Server Error' }],
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
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