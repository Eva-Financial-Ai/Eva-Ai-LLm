/**
 * API Response Types
 * 
 * This file contains TypeScript interfaces for API responses to ensure type safety
 * throughout the application.
 */

/**
 * Base API Response interface that all responses should extend
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  meta?: ApiMetadata;
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Metadata for paginated responses
 */
export interface ApiMetadata {
  pagination?: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    links?: {
      next?: string;
      prev?: string;
    };
  };
}

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  refresh_token: string;
  expires_at: number;
  user: UserData;
}

/**
 * User data
 */
export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Transaction data
 */
export interface Transaction {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  borrower_id: string;
  borrower_name: string;
  lender_id?: string;
  lender_name?: string;
  created_at: string;
  updated_at: string;
  risk_score?: number;
  risk_category?: 'low' | 'medium' | 'high';
}

/**
 * Contact data
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  title?: string;
  type: string;
  created_at: string;
  updated_at: string;
}

/**
 * Document data
 */
export interface Document {
  id: string;
  name: string;
  file_name: string;
  file_type: string;
  file_size: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  transaction_id?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  download_url: string;
  thumbnail_url?: string;
}

/**
 * Risk assessment data
 */
export interface RiskAssessment {
  id: string;
  transaction_id: string;
  overall_score: number;
  risk_category: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    name: string;
    score: number;
    weight: number;
    details?: string;
  }[];
  recommendations: string[];
  created_at: string;
  assessor_id?: string;
  assessor_name?: string;
}

/**
 * Notification data
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  action_url?: string;
  action_text?: string;
}

/**
 * Dashboard metrics data
 */
export interface DashboardMetrics {
  active_deals: number;
  deal_volume: number;
  avg_processing_time: number;
  completed_deals: number;
  pending_reviews: number;
  risk_distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  trending_data: {
    date: string;
    value: number;
  }[];
} 