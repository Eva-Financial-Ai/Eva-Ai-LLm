import axios from 'axios';

// Configuration for the Nemotron 70B API
interface NemotronConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
}

// Default configuration
const defaultConfig: NemotronConfig = {
  apiUrl: process.env.REACT_APP_NEMOTRON_API_URL || 'https://api.aws-lambda.nemotron.example.com',
  apiKey: process.env.REACT_APP_NEMOTRON_API_KEY || '',
  model: 'eva-nemotron-70b-v1',
  maxTokens: 2048
};

// Response interface
interface NemotronResponse {
  id: string;
  choices: {
    text: string;
    index: number;
    score: number;
    metadata?: Record<string, any>;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: string;
}

// Request interface
interface NemotronRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
  metadata?: Record<string, any>;
}

/**
 * Nemotron API Connector
 * Provides access to the NVIDIA Nemotron 70B parameter model fine-tuned as "EVA"
 */
class NemotronConnector {
  private config: NemotronConfig;

  constructor(customConfig?: Partial<NemotronConfig>) {
    this.config = { ...defaultConfig, ...customConfig };
  }

  /**
   * Initialize the connector
   * @param apiKey - Optional API key to override the default
   */
  initialize(apiKey?: string): void {
    if (apiKey) {
      this.config.apiKey = apiKey;
    }

    // Validate configuration
    if (!this.config.apiKey) {
      console.warn('Nemotron API key not provided. API calls will likely fail.');
    }
  }

  /**
   * Get a completion from the Nemotron model
   * @param prompt - The input prompt for the model
   * @param options - Additional options for the request
   */
  async getCompletion(
    prompt: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      topP?: number;
      stop?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<NemotronResponse> {
    try {
      const requestData: NemotronRequest = {
        prompt,
        max_tokens: options?.maxTokens || this.config.maxTokens,
        temperature: options?.temperature || 0.7,
        top_p: options?.topP || 1.0,
        stop: options?.stop,
        metadata: options?.metadata
      };

      const response = await axios.post<NemotronResponse>(
        `${this.config.apiUrl}/completions`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error calling Nemotron API:', error);
      throw error;
    }
  }

  /**
   * Get embeddings for a text input
   * @param text - The text to embed
   */
  async getEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/embeddings`,
        { input: text },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data.embedding;
    } catch (error) {
      console.error('Error getting embeddings from Nemotron API:', error);
      throw error;
    }
  }

  /**
   * Perform a specific task with the EVA fine-tuned model
   * @param task - The specific task type (e.g., 'financial_analysis', 'risk_assessment')
   * @param input - The input data for the task
   * @param options - Additional options
   */
  async performEvaTask(
    task: string,
    input: Record<string, any>,
    options?: {
      maxTokens?: number;
      temperature?: number;
    }
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/eva/tasks/${task}`,
        {
          input,
          max_tokens: options?.maxTokens || this.config.maxTokens,
          temperature: options?.temperature || 0.3
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error performing EVA task '${task}':`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const nemotronConnector = new NemotronConnector();
export default nemotronConnector; 