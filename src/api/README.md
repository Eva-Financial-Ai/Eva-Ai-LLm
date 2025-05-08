# EVA Credit Analysis API Integration

This document provides information on how to connect the EVA Credit Analysis frontend to your backend API service.

## 🔌 API Connection Schema

The frontend uses a Model Context Protocol (MCP) approach for communication with the EVA AI backend. This protocol is designed to be flexible and scalable, allowing for various types of credit analysis operations and AI interactions.

### Environment Configuration

The frontend expects an API base URL defined in a `.env` file:

```env
REACT_APP_API_BASE_URL=http://your-backend-url.com
```

## 📋 API Endpoints

The frontend expects two primary endpoints to be available:

### 1. Credit Analysis Endpoint

- **URL**: `/api/credit/analyze`
- **Method**: POST
- **Content-Type**: application/json

#### Request Payload

```typescript
{
  requestType: 'analysis',
  userId: string,
  transactionId?: string,
  modelId?: string,
  financialData?: any,
  debtType?: string,
  collateralInfo?: any,
  guarantorInfo?: any
}
```

#### Expected Response

```typescript
{
  ratios: {
    profitability: Array<{
      name: string;
      value: number;
      benchmark: number;
      status: string;
    }>;
    liquidity: Array<{...}>;
    leverage: Array<{...}>;
    efficiency: Array<{...}>;
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
```

### 2. EVA Chat Endpoint

- **URL**: `/api/eva/chat`
- **Method**: POST
- **Content-Type**: multipart/form-data

#### Request Payload

```typescript
{
  requestType: 'chat',
  userId: string,
  transactionId?: string,
  modelId?: string,
  message?: string,
  messageHistory?: Array<{
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
  }>,
  attachments?: File[]
}
```

#### Expected Response

```typescript
{
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
```

## 🧩 Integration Instructions

To connect the frontend to your backend service:

1. Create a backend API server with the endpoints described above.
2. In `src/api/creditAnalysisApi.ts`:
   - Uncomment the real API calls in `performCreditAnalysis` and `getChatResponse` functions
   - Comment out or remove the mock response generation code
3. Set your backend URL in the `.env` file as `REACT_APP_API_BASE_URL`

## 🔍 Additional API Requirements

### Authentication

- Your backend should handle authentication through the standard headers
- If using token-based auth, consider adding headers to the API calls:

```typescript
// Example of adding auth headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
};

const response = await axios.post(`${API_BASE_URL}/api/credit/analyze`, requestData, { headers });
```

### Error Handling

The frontend expects error responses in the following format:

```typescript
{
  error: string;  // Human-readable error message
  errorCode?: string;  // Optional code for frontend error handling
}
```

### File Handling

For the chat endpoint that accepts file uploads:

1. Files are sent as `multipart/form-data`
2. Each file is attached with a key like `attachment_0`, `attachment_1`, etc.
3. Your backend should process these files and either:
   - Store them and return URLs
   - Process them and extract data relevant to the credit analysis

## 📊 Machine Learning Model Integration

The EVA AI analysis system expects integration with your ML model backend:

1. The frontend can specify different model types via the `modelId` parameter
2. Your backend should route requests to the appropriate model based on this ID
3. For portfolio analysis, consider supporting these models:
   - Credit risk assessment
   - Portfolio monitoring
   - Early warning systems
   - Origination recommendation

## 🧪 Testing the Integration

To test your backend integration:

1. Start your backend server
2. Configure the frontend with the correct API URL
3. Run the frontend and test the following:
   - Clicking "Run Analysis" button to test the credit analysis endpoint
   - Sending messages to test the chat endpoint
   - Uploading files to test the multipart/form-data handling

## 🔮 Future Enhancements

Consider implementing these additional backend features:

1. Real-time updates via WebSockets for long-running analyses
2. Caching of analysis results for performance optimization
3. Batch processing for portfolio-wide analysis
4. Versioning of ML models and clear indication of which version was used 