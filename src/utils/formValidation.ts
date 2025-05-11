/**
 * Form Validation Utility
 * 
 * This utility provides form validation using Zod schemas
 */

import { z } from 'zod';

/**
 * Wrapper around Zod validation that provides standardized error handling
 */
export const validateForm = <T>(
  data: unknown,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert Zod error format to a more usable format for form errors
      const errors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      
      return { success: false, errors };
    }
    
    // If it's not a Zod error, throw it again
    throw error;
  }
};

/**
 * Common validation schemas
 */

// Email validation
export const emailSchema = z.string().email('Please enter a valid email address');

// Password validation with at least 8 characters, 1 uppercase, 1 lowercase, and 1 number
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone number validation (US format)
export const phoneSchema = z.string()
  .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Please enter a valid phone number');

// Common validation with error messages
export const commonValidators = {
  required: (field: string) => z.string().min(1, `${field} is required`),
  minLength: (field: string, length: number) => 
    z.string().min(length, `${field} must be at least ${length} characters`),
  maxLength: (field: string, length: number) => 
    z.string().max(length, `${field} must be at most ${length} characters`),
  numeric: (field: string) => 
    z.string().regex(/^\d+$/, `${field} must contain only numbers`),
  decimal: (field: string) => 
    z.string().regex(/^\d+(\.\d+)?$/, `${field} must be a valid number`),
  positive: (field: string) => 
    z.number().positive(`${field} must be a positive number`),
};

// Custom hook for form validation
export const useFormValidation = () => {
  return {
    validateForm,
    validators: {
      ...commonValidators,
      email: emailSchema,
      password: passwordSchema,
      phone: phoneSchema,
    }
  };
}; 