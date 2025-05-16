// Type definitions for external modules
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// @ts-ignore
import axiosRetry from 'axios-retry';
// @ts-ignore
import { setupCache } from 'axios-cache-interceptor';
import demoModeService from './demoModeService';

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
        // Check if in demo mode
        if (demoModeService.isEnabled()) {
          console.log(`[apiService] Demo mode active - intercepting request to ${config.url}`);
          // Let request proceed for now, we'll handle mock data in the response interceptor
        }

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

        // If in demo mode, don't retry or throw errors
        if (demoModeService.isEnabled()) {
          console.log('[apiService] Demo mode active - suppressing network error');
          // Return a resolved promise with an empty data object
          return Promise.resolve({ data: {} });
        }

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

  // Simulate network latency for demo mode
  private async simulateLatency(): Promise<void> {
    if (demoModeService.isEnabled() && demoModeService.getConfig().simulateNetworkLatency) {
      const baseDelay = 300; // Base delay in ms
      const randomFactor = Math.random() * 200; // Random additional delay up to 200ms
      const delay = baseDelay + randomFactor;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      console.log(`[apiService] Demo mode - simulated network latency: ${delay.toFixed(0)}ms`);
    }
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    // If in demo mode, don't actually make the request
    if (demoModeService.isEnabled()) {
      await this.simulateLatency();
      console.log(`[apiService] Demo mode - mock request to ${config.url}`);
      return {} as T; // Return empty object, specific mock providers will override this
    }

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
    // Always return true in demo mode
    if (demoModeService.isEnabled()) {
      console.log('[apiService] Demo mode - reporting API as connected');
      return true;
    }

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
    // Always report as online in demo mode
    if (demoModeService.isEnabled()) {
      return false;
    }
    return this.isNetworkIssue;
  }
}

const apiService = new ApiService();
export default apiService;
