// Type declarations for modules without TypeScript definitions

declare module 'dompurify' {
  export function sanitize(input: string): string;
  export default {
    sanitize: (input: string) => string
  };
}

declare module 'react-intl' {
  import { ReactNode } from 'react';
  
  export interface FormattedMessageProps {
    id: string;
    defaultMessage?: string;
    values?: Record<string, any>;
  }
  
  export const FormattedMessage: React.FC<FormattedMessageProps>;
}

// Helper functions
declare function getCsrfToken(): string;

// Extend Jest matchers for @testing-library/jest-dom
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
    }
  }
} 