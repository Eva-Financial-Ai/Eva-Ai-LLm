// Type definitions for external modules
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// @ts-ignore
import axiosRetry from 'axios-retry';
// @ts-ignore
import { setupCache } from 'axios-cache-interceptor';

// NOTE: This service connects to the eva-platform-backend repository
// which is now maintained separately from the frontend codebase.

type AxiosRetryConfig = {
  retries?: number;
  retryDelay?: (retryCount: number) => number;
  retryCondition?: (error: any) => boolean;
};

type AxiosRetryStatic = {
  (axios: any, options?: AxiosRetryConfig): void;
  isNetworkOrIdempotentRequestError: (error: any) => boolean;
};

type CacheOptions = {
  ttl?: number;
  methods?: string[];
};

type CachedAxiosInstance = any & {
  storage?: {
    remove: (key: string) => void;
    clear: () => void;
  };
};

// API base URL - points to the separate backend service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 15000;

// Maximum number of retries
const MAX_RETRIES = 2;

class ApiService {
  private instance: AxiosInstance;
  private isNetworkIssue = false;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.instance.interceptors.request.use(
      config => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`[apiService] Request to ${config.url}`, { method: config.method });
        return config;
      },
      error => {
        console.error('[apiService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.instance.interceptors.response.use(
      response => {
        // Reset network issue flag on successful response
        if (this.isNetworkIssue) {
          console.log('[apiService] Network connectivity restored');
          this.isNetworkIssue = false;
        }
        return response;
      },
      async error => {
        const originalRequest = error.config;

        // Check if error is a network error (offline, timeout, etc.)
        if (axios.isAxiosError(error) && !error.response) {
          console.warn('[apiService] Network error detected:', error.message);
          this.isNetworkIssue = true;

          // If request hasn't been retried yet
          if (!originalRequest._retry && (originalRequest._retryCount || 0) < MAX_RETRIES) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            const retryDelay = Math.pow(2, originalRequest._retryCount) * 1000; // Exponential backoff

            console.log(
              `[apiService] Retrying request to ${originalRequest.url} in ${retryDelay}ms (attempt ${originalRequest._retryCount}/${MAX_RETRIES})`
            );

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay));

            return this.instance(originalRequest);
          }
        }

        // Log detailed error information
        console.error('[apiService] Response error:', {
          url: originalRequest?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          response: error.response?.data,
        });

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>(config);
      return response.data;
    } catch (error) {
      // Check for connection issues and handle gracefully
      if (axios.isAxiosError(error) && !error.response) {
        console.error('[apiService] Connection error:', error.message);
        throw new Error(
          `Connection error: ${error.message}. Please check your internet connection.`
        );
      }

      throw error;
    }
  }

  // GET request
  async get<T>(url: string, params?: any): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }

  // POST request
  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  // PUT request
  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  // DELETE request
  async delete<T>(url: string): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
    });
  }

  // Check API connectivity - useful for diagnostics
  async checkConnectivity(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      console.error('[apiService] API connectivity check failed:', error);
      return false;
    }
  }

  // Get network status
  isNetworkOffline(): boolean {
    return this.isNetworkIssue;
  }
}

const apiService = new ApiService();
export default apiService;
