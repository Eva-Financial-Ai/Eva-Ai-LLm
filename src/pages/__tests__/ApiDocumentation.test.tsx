import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ApiDocumentationContent from '../ApiDocumentation';
import * as AppErrorBoundary from '../../components/common/AppErrorBoundary';

// Mock the SwaggerUI component
jest.mock('../../components/common/SwaggerUI', () => {
  return {
    __esModule: true,
    default: jest.fn(props => (
      <div data-testid="swagger-ui-component">
        {props.url && <div data-testid="swagger-url">{props.url}</div>}
        {props.spec && <div data-testid="swagger-spec">Spec provided</div>}
      </div>
    )),
  };
});

// Mock the AppErrorBoundary component
jest.mock('../../components/common/AppErrorBoundary', () => {
  return {
    __esModule: true,
    default: jest.fn(({ children }) => <div data-testid="error-boundary">{children}</div>),
  };
});

describe('ApiDocumentation', () => {
  // Mock implementations for fetch
  const mockSuccessfulFetch = (data) => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data),
      })
    );
  };

  const mockFailedFetch = (error) => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: error,
      })
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders loading state initially', async () => {
    // Set up a delayed response
    global.fetch = jest.fn().mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({}) }), 100))
    );

    render(<ApiDocumentationContent />);
    
    // Check for loading state
    expect(screen.getByText(/Loading API documentation/i)).toBeInTheDocument();

    // Wait for component to update after fetch resolves
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  test('renders SwaggerUI when API spec is successfully fetched', async () => {
    const mockApiSpec = { openapi: '3.0.0', info: { title: 'Test API' } };
    mockSuccessfulFetch(mockApiSpec);

    render(<ApiDocumentationContent />);

    // Wait for fetch to complete and component to update
    await waitFor(() => {
      expect(screen.getByTestId('swagger-ui-component')).toBeInTheDocument();
      expect(screen.getByTestId('swagger-spec')).toBeInTheDocument();
    });

    // Verify fetch was called with expected URL
    expect(global.fetch).toHaveBeenCalledWith('/docs/api-schemas/transaction-decisions.json');
  });

  test('shows error message when API spec fetching fails', async () => {
    mockFailedFetch('Not Found');

    render(<ApiDocumentationContent />);

    // Wait for fetch to complete and component to update
    await waitFor(() => {
      expect(screen.getByText(/Failed to load API documentation/i)).toBeInTheDocument();
      expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
    });
  });

  test('shows error message when fetch throws an exception', async () => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      throw new Error('Network error');
    });

    render(<ApiDocumentationContent />);

    // Wait for fetch to complete and component to update
    await waitFor(() => {
      expect(screen.getByText(/Error loading API documentation/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  test('uses AppErrorBoundary to handle rendering errors', () => {
    render(<ApiDocumentationContent />);
    
    // Verify AppErrorBoundary is used
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
  });
}); 