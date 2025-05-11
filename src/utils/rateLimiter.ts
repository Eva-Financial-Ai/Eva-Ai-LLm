/**
 * Rate Limiter Utility
 * 
 * This utility provides client-side rate limiting functionality to prevent abuse of
 * sensitive operations, especially authentication endpoints.
 */

interface RateLimitOptions {
  maxAttempts: number;   // Max number of attempts allowed in time window
  windowMs: number;      // Time window in milliseconds
  blockDurationMs: number; // How long to block after max attempts (ms)
}

interface RateLimitRecord {
  attempts: number;      // Number of attempts made
  firstAttempt: number;  // Timestamp of first attempt
  blocked: boolean;      // Whether the action is currently blocked
  blockedUntil: number;  // Timestamp when block expires
}

// Default rate limit store in LocalStorage
const RATE_LIMIT_STORAGE_KEY = 'eva-rate-limits';

/**
 * Client-side rate limiter
 * Helps prevent abuse by limiting frequency of actions like login attempts
 */
export class RateLimiter {
  private storage: Storage;
  private storageKey: string;
  
  /**
   * Create a new rate limiter instance
   * @param storageKey - Optional custom storage key
   * @param storage - Storage implementation (defaults to localStorage)
   */
  constructor(storageKey?: string, storage?: Storage) {
    this.storage = storage || localStorage;
    this.storageKey = storageKey || RATE_LIMIT_STORAGE_KEY;
  }
  
  /**
   * Initialize the rate limiter storage
   */
  private initialize(): Record<string, RateLimitRecord> {
    try {
      const existing = this.storage.getItem(this.storageKey);
      return existing ? JSON.parse(existing) : {};
    } catch (error) {
      console.error('Failed to initialize rate limiter:', error);
      return {};
    }
  }
  
  /**
   * Save rate limit data to storage
   */
  private saveToStorage(data: Record<string, RateLimitRecord>): void {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save rate limit data:', error);
    }
  }
  
  /**
   * Check if an action is allowed based on rate limits
   * @param actionKey - Unique identifier for the action (e.g., 'login', 'password-reset')
   * @param options - Rate limit options
   */
  checkLimit(actionKey: string, options: RateLimitOptions): {
    allowed: boolean;
    remaining: number;
    msBeforeNext: number;
  } {
    const now = Date.now();
    const limits = this.initialize();
    const record = limits[actionKey] || { 
      attempts: 0, 
      firstAttempt: now, 
      blocked: false,
      blockedUntil: 0
    };
    
    // Check if currently blocked
    if (record.blocked) {
      if (now < record.blockedUntil) {
        // Still blocked
        return {
          allowed: false,
          remaining: 0,
          msBeforeNext: record.blockedUntil - now
        };
      } else {
        // Block has expired, reset
        record.blocked = false;
        record.attempts = 0;
        record.firstAttempt = now;
      }
    }
    
    // Check if window has expired
    const windowExpired = (now - record.firstAttempt) > options.windowMs;
    if (windowExpired) {
      // Reset window
      record.attempts = 0;
      record.firstAttempt = now;
    }
    
    // Check if limit reached
    const remaining = Math.max(0, options.maxAttempts - record.attempts);
    if (record.attempts >= options.maxAttempts) {
      // Block the action
      record.blocked = true;
      record.blockedUntil = now + options.blockDurationMs;
      
      this.saveToStorage({
        ...limits,
        [actionKey]: record
      });
      
      return {
        allowed: false,
        remaining: 0,
        msBeforeNext: options.blockDurationMs
      };
    }
    
    // Action is allowed, increment attempt counter
    record.attempts++;
    
    this.saveToStorage({
      ...limits,
      [actionKey]: record
    });
    
    return {
      allowed: true,
      remaining: remaining - 1, // We just used one attempt
      msBeforeNext: 0
    };
  }
  
  /**
   * Reset rate limit for an action
   * @param actionKey - The action to reset
   */
  resetLimit(actionKey: string): void {
    const limits = this.initialize();
    delete limits[actionKey];
    this.saveToStorage(limits);
  }
  
  /**
   * Reset all rate limits
   */
  resetAllLimits(): void {
    this.storage.removeItem(this.storageKey);
  }
}

// Default rate limiter instance
export const rateLimiter = new RateLimiter();

// Standard rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  login: {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDurationMs: 15 * 60 * 1000 // 15 minutes
  },
  passwordReset: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000 // 1 hour
  },
  verification: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
    blockDurationMs: 30 * 60 * 1000 // 30 minutes
  },
  registration: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 24 * 60 * 60 * 1000 // 24 hours
  }
}; 