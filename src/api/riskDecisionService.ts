// Define API base URL directly instead of importing from config
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.eva-ai.com/v1';

// Import axios using require to avoid TypeScript module resolution issues
const axios = require('axios');

// Types
export interface HumanInLoopRequest {
  transactionId: string;
  reason: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  requestedBy: string;
}

export interface HardDeclineRequest {
  transactionId: string;
  reason: string;
  comments: string;
  declinedBy: string;
}

export interface SoftDeclineRequest {
  transactionId: string;
  reason: string;
  stepsToOvercome: string;
  reconsiderationTimeline: string;
  declinedBy: string;
}

export interface ApprovalRequest {
  transactionId: string;
  approvedBy: string;
  notes?: string;
}

export interface PendingRequest {
  id: string;
  transactionId: string;
  type: 'humanInLoop' | 'hardDecline' | 'softDecline';
  status: 'pending' | 'inProgress' | 'completed';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  data: HumanInLoopRequest | HardDeclineRequest | SoftDeclineRequest;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Make API requests function
const makeRequest = async <T>(method: string, url: string, data?: any): Promise<ApiResponse<T>> => {
  try {
    let response;
    const fullUrl = `${API_BASE_URL}${url}`;

    if (method === 'get') {
      response = await axios.get(fullUrl);
    } else if (method === 'post') {
      response = await axios.post(fullUrl, data);
    } else if (method === 'patch') {
      response = await axios.patch(fullUrl, data);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }

    return response.data as ApiResponse<T>;
  } catch (error) {
    console.error(`${method.toUpperCase()} request failed: ${url}`, error);
    return {
      success: false,
      error: `Request failed. Please try again.`,
    } as ApiResponse<T>;
  }
};

// Service functions
const riskDecisionService = {
  /**
   * Approve a transaction and move it to the next stage
   */
  approveTransaction: async (data: ApprovalRequest): Promise<ApiResponse<any>> => {
    const url = `/transactions/${data.transactionId}/approve`;
    return makeRequest<any>('post', url, data);
  },

  /**
   * Submit a hard decline for a transaction
   */
  hardDeclineTransaction: async (data: HardDeclineRequest): Promise<ApiResponse<any>> => {
    const url = `/transactions/${data.transactionId}/hard-decline`;
    return makeRequest<any>('post', url, data);
  },

  /**
   * Submit a soft decline for a transaction with steps to overcome
   */
  softDeclineTransaction: async (data: SoftDeclineRequest): Promise<ApiResponse<any>> => {
    const url = `/transactions/${data.transactionId}/soft-decline`;
    return makeRequest<any>('post', url, data);
  },

  /**
   * Request human review for a transaction (account manager call)
   */
  requestHumanReview: async (data: HumanInLoopRequest): Promise<ApiResponse<PendingRequest>> => {
    const url = `/transactions/${data.transactionId}/human-review`;
    return makeRequest<PendingRequest>('post', url, data);
  },

  /**
   * Get all pending human review requests for a transaction
   */
  getPendingRequests: async (transactionId: string): Promise<ApiResponse<PendingRequest[]>> => {
    const url = `/transactions/${transactionId}/pending-requests`;
    return makeRequest<PendingRequest[]>('get', url);
  },

  /**
   * Update the status of a pending request
   */
  updateRequestStatus: async (
    requestId: string,
    status: 'inProgress' | 'completed',
    notes?: string
  ): Promise<ApiResponse<PendingRequest>> => {
    const url = `/requests/${requestId}/status`;
    const data = { status, notes };
    return makeRequest<PendingRequest>('patch', url, data);
  },
};

export default riskDecisionService;
