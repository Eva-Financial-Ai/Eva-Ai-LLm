import debounce from 'lodash.debounce';
import apiService from './apiService';
import { mockInsights } from './mockData';
// Remove the imports that don't exist and create them below
// import { mockRatios, mockInsights, mockChatResponses, mockReferences } from './mockData';

// Define mock data with the correct structure
export const mockRatios = {
  profitability: [
    { name: 'Profit Margin', value: 8.5, benchmark: 12.0, status: 'below' },
    { name: 'Return on Assets', value: 5.2, benchmark: 7.0, status: 'below' },
    { name: 'Return on Equity', value: 12.1, benchmark: 15.0, status: 'below' },
  ],
  liquidity: [
    { name: 'Current Ratio', value: 1.2, benchmark: 2.0, status: 'below' },
    { name: 'Quick Ratio', value: 0.9, benchmark: 1.0, status: 'below' },
    { name: 'Cash Ratio', value: 0.5, benchmark: 0.2, status: 'above' },
  ],
  leverage: [
    { name: 'Debt to Equity', value: 2.3, benchmark: 1.5, status: 'above' },
    { name: 'Debt Ratio', value: 0.65, benchmark: 0.5, status: 'above' },
    { name: 'Interest Coverage', value: 3.8, benchmark: 5.0, status: 'below' },
  ],
  efficiency: [
    { name: 'Asset Turnover', value: 1.8, benchmark: 2.0, status: 'below' },
    { name: 'Inventory Turnover', value: 6.2, benchmark: 5.0, status: 'above' },
    { name: 'Receivables Turnover', value: 8.5, benchmark: 8.0, status: 'above' },
  ],
};

export const mockChatResponses = {
  portfolio: {
    query: 'Analyze our portfolio risk',
    response:
      'Your portfolio has a moderate risk level with a Sharpe ratio of 0.85. The concentration in technology stocks (42% of holdings) increases volatility. Consider diversifying across more sectors and including defensive assets.',
  },
  mitigation: {
    query: 'Suggest risk mitigation strategies',
    response:
      'To mitigate your financial risks: 1) Reduce debt-to-equity ratio by paying down high-interest loans, 2) Improve liquidity by optimizing inventory management, 3) Diversify customer base to reduce concentration risk, 4) Consider hedging against key commodity price fluctuations relevant to your business.',
  },
  benchmark: {
    query: 'How do we compare to industry benchmarks?',
    response:
      'Your company underperforms industry benchmarks in 7 of 12 key financial ratios. Particularly concerning are liquidity ratios (Current Ratio at 1.2 vs benchmark 2.0) and profitability metrics (Profit Margin at 8.5% vs benchmark 12%). Your leverage ratios show higher risk tolerance than peers.',
  },
  default: {
    query: 'Explain our debt to equity ratio',
    response:
      'Your debt to equity ratio is 2.3, which is higher than the industry benchmark of 1.5. This suggests that your company is using more debt financing than equity, which could increase financial risk. Consider strategies to either reduce debt or increase equity to improve this ratio.',
  },
};

export const mockReferences = [
  {
    source: 'Understanding Financial Ratios',
    relevance: 0.92,
    content:
      'Comprehensive guide to interpreting common financial ratios including liquidity, profitability, leverage, and efficiency metrics. Key insights on balance sheet analysis.',
  },
  {
    source: 'Industry Benchmarks 2023',
    relevance: 0.88,
    content:
      'Latest industry financial performance benchmarks across 12 key sectors. Includes quartile breakdowns for all major financial ratios and peer group comparisons.',
  },
  {
    source: 'Risk Mitigation Strategies for SMEs',
    relevance: 0.76,
    content:
      'Practical approaches to identifying and addressing financial risks for small and medium enterprises. Includes case studies and implementation frameworks.',
  },
];

// Import insights from mockData.ts if it exists
// import { mockInsights } from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Types for credit analysis context and communication
export interface ModelContextProtocol {
  requestType: 'analysis' | 'chat';
  userId: string;
  transactionId?: string;
  modelId?: string;
  message?: string;
  messageHistory?: Message[];
  financialData?: any;
  debtType?: string;
  collateralInfo?: any;
  guarantorInfo?: any;
  attachments?: File[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

export interface AnalysisResult {
  ratios: {
    profitability: Array<{
      name: string;
      value: number;
      benchmark: number;
      status: string;
    }>;
    liquidity: Array<{
      name: string;
      value: number;
      benchmark: number;
      status: string;
    }>;
    leverage: Array<{
      name: string;
      value: number;
      benchmark: number;
      status: string;
    }>;
    efficiency: Array<{
      name: string;
      value: number;
      benchmark: number;
      status: string;
    }>;
  };
  insights: Array<{
    category: 'critical' | 'warning' | 'positive' | 'info';
    title: string;
    description: string;
    ratios: string[];
    recommendation: string;
  }>;
  industryBenchmarks: {
    code: string;
    name: string;
    dataQuality: string;
    regionalAdjustment: boolean;
  };
  overallRiskScore: number;
  recommendations: string[];
  analysisId: string;
  analysisTimestamp: string;
  error?: string;
}

export interface ChatResponse {
  messageId: string;
  text: string;
  timestamp: string;
  aiModel: string;
  confidence: number;
  references?: {
    source: string;
    relevance: number;
    content: string;
  }[];
  error?: string;
}

// Cache key generator
const generateCacheKey = (context: ModelContextProtocol): string => {
  return `${context.requestType}-${context.userId}-${context.transactionId || ''}-${context.modelId || ''}`;
};

/**
 * Performs a credit analysis using EVA AI - with circuit breaker and caching
 */
export const performCreditAnalysis = async (
  context: ModelContextProtocol
): Promise<AnalysisResult> => {
  try {
    // In a real implementation, this would call the backend API
    // For now, simulate network request with timeout
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Cache key for this specific analysis
    const cacheKey = generateCacheKey(context);

    /*
    // Real implementation would use the optimized apiService
    const response = await apiService.post<AnalysisResult>(
      '/api/credit/analyze', 
      {
        userId: context.userId,
        transactionId: context.transactionId,
        financialData: context.financialData,
        debtType: context.debtType,
        collateralInfo: context.collateralInfo,
        guarantorInfo: context.guarantorInfo
      }
    );
    
    return response;
    */

    // Mock result
    return {
      ratios: mockRatios,
      insights: mockInsights,
      industryBenchmarks: {
        code: context.debtType ? context.debtType : '45322',
        name: 'Commercial Equipment Financing',
        dataQuality: 'High (231 companies)',
        regionalAdjustment: true,
      },
      overallRiskScore: 68,
      recommendations: [
        'Review capital structure to address high debt levels',
        'Implement cash flow monitoring system',
        'Consider working capital optimization strategy',
      ],
      analysisId: `analysis-${Date.now()}`,
      analysisTimestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in credit analysis:', error);
    return {
      ratios: { profitability: [], liquidity: [], leverage: [], efficiency: [] },
      insights: [],
      industryBenchmarks: { code: '', name: '', dataQuality: '', regionalAdjustment: false },
      overallRiskScore: 0,
      recommendations: [],
      analysisId: '',
      analysisTimestamp: new Date().toISOString(),
      error: 'Failed to perform credit analysis. Please try again.',
    };
  }
};

// Debounced chat function to prevent rapid API calls
export const getChatResponseDebounced = debounce(
  async (
    context: ModelContextProtocol,
    callback: (response: ChatResponse) => void
  ): Promise<void> => {
    try {
      const response = await getChatResponse(context);
      callback(response);
    } catch (error) {
      console.error('Debounced chat error:', error);
      callback({
        messageId: '',
        text: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        aiModel: '',
        confidence: 0,
        error: 'Failed to communicate with EVA AI. Please try again.',
      });
    }
  },
  500
); // 500ms debounce time

/**
 * Sends a message to EVA AI and gets a response
 */
export const getChatResponse = async (context: ModelContextProtocol): Promise<ChatResponse> => {
  try {
    // In a real implementation, this would call the backend AI service
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    /*
    // For file uploads, we'd use formData
    if (context.attachments && context.attachments.length > 0) {
      const formData = new FormData();
      formData.append('userId', context.userId);
      if (context.transactionId) formData.append('transactionId', context.transactionId);
      if (context.modelId) formData.append('modelId', context.modelId);
      if (context.message) formData.append('message', context.message);
      
      // Add message history as JSON
      if (context.messageHistory) {
        formData.append('messageHistory', JSON.stringify(context.messageHistory));
      }
      
      // Add any attachments
      context.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
      
      return await apiService.uploadFormData<ChatResponse>(
        '/api/eva/chat',
        formData
      );
    } else {
      // For regular text messages without attachments
      return await apiService.post<ChatResponse>(
        '/api/eva/chat',
        {
          userId: context.userId,
          transactionId: context.transactionId,
          modelId: context.modelId,
          message: context.message,
          messageHistory: context.messageHistory
        }
      );
    }
    */

    // Generate a mock response based on the incoming message
    const input = context.message?.toLowerCase() || '';
    let responseText = '';

    if (input.includes('portfolio') || input.includes('operators') || input.includes('servicing')) {
      responseText = mockChatResponses.portfolio.response;
    } else if (input.includes('mitigation')) {
      responseText = mockChatResponses.mitigation.response;
    } else if (input.includes('benchmark')) {
      responseText = mockChatResponses.benchmark.response;
    } else {
      responseText = mockChatResponses.default.response.replace(
        'your account',
        context.userId || 'your account'
      );
    }

    return {
      messageId: `msg-${Date.now()}`,
      text: responseText,
      timestamp: new Date().toISOString(),
      aiModel: context.modelId || 'EVA-Financial-Analyst-v1',
      confidence: 0.92,
      references: mockReferences,
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
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

// Add this function to handle cache clearing since clearCache doesn't exist on the new ApiService
export const clearAnalysisCache = () => {
  console.log(
    '[creditAnalysisApi] Cache clearing requested but not implemented in current ApiService'
  );
  // This is a placeholder for the functionality that used to be there
  // In a real implementation, you would add proper cache clearing logic
};

export default {
  performCreditAnalysis,
  getChatResponse,
  getChatResponseDebounced,
  clearAnalysisCache,
};
