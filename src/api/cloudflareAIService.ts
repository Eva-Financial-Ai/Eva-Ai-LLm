import { ModelContextProtocol, ChatResponse } from './creditAnalysisApi';

// Cloudflare AI API configuration
const CLOUDFLARE_ACCOUNT_ID =
  process.env.REACT_APP_CLOUDFLARE_ACCOUNT_ID || 'eace6f3c56b5735ae4a9ef385d6ee914';
const CLOUDFLARE_LLM_MODEL =
  process.env.REACT_APP_CLOUDFLARE_LLM_MODEL || '@cf/meta/llama-2-7b-chat-int8';
const CLOUDFLARE_AI_API_URL = 'https://llm-worker-unique-987654.evafiai.workers.dev/chat'; // Use deployed Worker as proxy

// Available Cloudflare AI models
export const CLOUDFLARE_AI_MODELS = {
  '@cf/meta/llama-2-7b-chat-int8': {
    name: 'Llama 2 7B Chat',
    description: "Meta's Llama 2 7B model optimized for chat",
    maxTokens: 4096,
  },
  '@cf/mistai/mistral-7b-instruct-v0.1': {
    name: 'Mistral 7B Instruct',
    description: "Mistral AI's 7B parameter model for instruction following",
    maxTokens: 4096,
  },
  '@cf/thebloke/zephyr-7b-beta-awq': {
    name: 'Zephyr 7B Beta',
    description: "Hugging Face's Zephyr 7B model optimized for chat",
    maxTokens: 4096,
  },
};

interface CloudflareAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

interface CloudflareAIResponse {
  result: {
    response: string;
    model: string;
    created: number;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  success: boolean;
  errors?: any[];
}

// Helper to get Cloudflare API token from environment (React)
const getCloudflareApiToken = () => {
  // @ts-ignore
  return typeof process !== 'undefined' && process.env && process.env.REACT_APP_CLOUDFLARE_API_TOKEN
    ? process.env.REACT_APP_CLOUDFLARE_API_TOKEN
    : 'FXA-wKm4Vkzp4JhW35_CTxaR3ZCGrJkYeGp8koDJ'; // fallback for local testing
};

/**
 * Sends a request to Cloudflare AI API (direct from frontend, for testing only)
 */
export const sendToCloudflareAI = async (
  request: CloudflareAIRequest
): Promise<CloudflareAIResponse['result']> => {
  try {
    const response = await fetch(CLOUDFLARE_AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCloudflareApiToken()}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let errorMsg = `Cloudflare AI API error: ${response.statusText}`;
      try {
        const errJson = await response.json();
        errorMsg = errJson.errors?.[0]?.message || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Unknown error from Cloudflare AI');
    }
    return data.result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Network error or CORS issue. Please check your connection and CORS settings.'
      );
    }
    console.error('Error calling Cloudflare AI:', error);
    throw error;
  }
};

/**
 * Converts chat context to Cloudflare AI format
 */
const convertContextToAIFormat = (
  context: ModelContextProtocol,
  modelId: string = '@cf/meta/llama-2-7b-chat-int8'
): CloudflareAIRequest => {
  // System message to set the context and behavior
  const systemMessage = {
    role: 'system' as const,
    content: `You are EVA, an AI financial assistant specializing in credit analysis and risk assessment. 
    You help users understand their financial situation and provide insights based on their data.
    Always maintain a professional and helpful tone.`,
  };

  // Convert message history to the format expected by Cloudflare AI
  const messages = context.messageHistory
    ? context.messageHistory.map(msg => ({
        role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.text,
      }))
    : [];

  // Add the current message if it exists
  if (context.message) {
    messages.push({
      role: 'user',
      content: context.message,
    });
  }

  return {
    model: modelId,
    messages: [systemMessage, ...messages],
    max_tokens: CLOUDFLARE_AI_MODELS[modelId]?.maxTokens || 4096,
    temperature: 0.7, // Adjust for more or less creative responses
  };
};

/**
 * Processes a chat request using Cloudflare AI
 */
export const processChatWithCloudflareAI = async (
  context: ModelContextProtocol
): Promise<ChatResponse> => {
  try {
    const modelId = context.modelId || '@cf/meta/llama-2-7b-chat-int8';
    const aiRequest = convertContextToAIFormat(context, modelId);

    const response = await sendToCloudflareAI(aiRequest);

    return {
      messageId: `msg-${Date.now()}`,
      text: response.response,
      timestamp: new Date().toISOString(),
      aiModel: modelId,
      confidence: 0.95, // Cloudflare AI responses are generally high confidence
      references: [], // Add references if available from the response
    };
  } catch (error) {
    console.error('Error processing chat with Cloudflare AI:', error);
    return {
      messageId: '',
      text: 'Sorry, I encountered an error while processing your request. Please try again.',
      timestamp: new Date().toISOString(),
      aiModel: '',
      confidence: 0,
      error: 'Failed to communicate with EVA AI. Please try again.',
    };
  }
};
