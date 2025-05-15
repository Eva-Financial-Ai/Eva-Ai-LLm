/**
 * Date utility functions for consistent date formatting across the application
 */

/**
 * Format a date string consistently
 * @param dateString - ISO date string or Date object
 * @param format - Optional format specification
 * @returns Formatted date string
 */
export function formatDate(dateString: string | Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Return empty string if invalid date
  if (isNaN(date.getTime())) return '';
  
  try {
    switch (format) {
      case 'short':
        // MM/DD/YY
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: '2-digit'
        });
        
      case 'long':
        // Month DD, YYYY
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        
      case 'medium':
      default:
        // MM/DD/YYYY
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format a date with time
 * @param dateString - ISO date string or Date object
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string | Date, includeSeconds = false): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Return empty string if invalid date
  if (isNaN(date.getTime())) return '';
  
  try {
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
}

/**
 * Get a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Return empty string if invalid date
  if (isNaN(date.getTime())) return '';
  
  try {
    // Use the Intl.RelativeTimeFormat API if available
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const diffInSeconds = (date.getTime() - now.getTime()) / 1000;
    
    // Convert to appropriate units
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(Math.round(diffInSeconds), 'second');
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.round(diffInSeconds / 60), 'minute');
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
    } else if (Math.abs(diffInSeconds) < 2592000) {
      return rtf.format(Math.round(diffInSeconds / 86400), 'day');
    } else if (Math.abs(diffInSeconds) < 31536000) {
      return rtf.format(Math.round(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(Math.round(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    // Fallback to regular date format if RelativeTimeFormat is not supported
    console.error('Error getting relative time:', error);
    return formatDate(date);
  }
}

/**
 * Determine if a date is in the past
 * @param dateString - ISO date string or Date object
 * @returns Boolean indicating if date is in the past
 */
export function isPastDate(dateString: string | Date): boolean {
  if (!dateString) return false;
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Return false if invalid date
  if (isNaN(date.getTime())) return false;
  
  return date.getTime() < Date.now();
}

export default {
  formatDate,
  formatDateTime,
  getRelativeTime,
  isPastDate
}; 