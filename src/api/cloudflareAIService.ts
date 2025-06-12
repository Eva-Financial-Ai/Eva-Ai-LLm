import { ModelContextProtocol, ChatResponse } from './creditAnalysisApi';

// RAG-only API service

const RAG_API_URL = process.env.REACT_APP_RAG_API_URL || '/api/rag-query';

export interface RAGRequest {
  query: string;
  pipeline: string;
  [key: string]: any;
}

export interface RAGResponse {
  result: any;
  success: boolean;
  errors?: any[];
}

/**
 * Sends a request to the RAG API endpoint
 */
export const sendToRAG = async (request: RAGRequest): Promise<RAGResponse['result']> => {
  const response = await fetch(RAG_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMsg = `RAG API error: ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.errors?.[0]?.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0] || 'Unknown RAG API error');
  }
  return data.result;
};
