/**
 * Input Sanitization Utility
 * 
 * This utility provides functions to sanitize user inputs to prevent XSS attacks
 * and other input-based vulnerabilities.
 */

/**
 * Sanitizes HTML string to prevent XSS attacks
 * Strips all HTML tags and encodes special characters
 * @param input - The input string to sanitize
 * @returns Sanitized string with HTML tags removed and special characters encoded
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // First, escape HTML special characters
  const escaped = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return escaped;
};

/**
 * Sanitizes user input for general text fields
 * Removes any potentially dangerous characters or sequences
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove script tags and their contents
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove other potentially dangerous HTML tags
  sanitized = sanitized.replace(/<(.*?)>/g, '');
  
  // Remove JS event handlers
  sanitized = sanitized.replace(/on\w+=/g, '');
  
  // Remove JS protocol links
  sanitized = sanitized.replace(/javascript:/g, '');
  
  // Remove data URIs
  sanitized = sanitized.replace(/data:/g, '');
  
  return sanitized.trim();
};

/**
 * Sanitizes an email address
 * @param email - Email address to sanitize
 * @returns Sanitized email address
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Simple email pattern validation and sanitization
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(email)) {
    return email.toLowerCase().trim();
  }
  
  // If input doesn't match email pattern, further sanitize it
  return sanitizeInput(email).toLowerCase().trim();
};

/**
 * Sanitizes a phone number
 * Only keeping digits, spaces, dashes, pluses, and parentheses
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all characters except digits, spaces, dashes, pluses, and parentheses
  return phone.replace(/[^0-9\s\-+()]/g, '').trim();
};

/**
 * Sanitizes a URL
 * @param url - URL to sanitize
 * @returns Sanitized URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Only allow http:// and https:// protocols
  if (!/^https?:\/\//i.test(url)) {
    return '';
  }
  
  try {
    // Use URL constructor to validate and parse the URL
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return '';
    }
    
    return parsedUrl.toString();
  } catch (e) {
    // If URL is invalid, return empty string
    return '';
  }
};

/**
 * Sanitizes a form data object
 * @param formData - Form data object to sanitize
 * @returns Sanitized form data
 */
export const sanitizeFormData = <T extends Record<string, any>>(formData: T): T => {
  const sanitized: Record<string, any> = {};
  
  Object.entries(formData).forEach(([key, value]) => {
    // Skip sanitization for non-string values
    if (typeof value !== 'string') {
      sanitized[key] = value;
      return;
    }
    
    // Apply field-specific sanitization
    if (key.includes('email')) {
      sanitized[key] = sanitizeEmail(value);
    } else if (key.includes('phone')) {
      sanitized[key] = sanitizePhone(value);
    } else if (key.includes('url') || key.includes('website') || key.includes('link')) {
      sanitized[key] = sanitizeUrl(value);
    } else if (key.includes('html') || key.includes('content')) {
      sanitized[key] = sanitizeHtml(value);
    } else {
      sanitized[key] = sanitizeInput(value);
    }
  });
  
  return sanitized as T;
};

/**
 * Escape SQL wildcards to prevent SQL injection
 * @param input - The input string to escape
 * @returns Escaped string
 */
export const escapeSqlWildcards = (input: string): string => {
  if (!input) return '';
  
  // Escape SQL wildcards
  return input
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
}; 