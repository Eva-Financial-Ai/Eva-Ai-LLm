import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SwaggerUIComponent from '../SwaggerUI';

// Mock swagger-ui-react
jest.mock('swagger-ui-react', () => {
  return jest.fn(props => (
    <div data-testid="swagger-ui-mock">
      <div data-testid="swagger-props">
        {Object.entries(props).map(([key, value]) => (
          <div key={key} data-testid={`swagger-prop-${key}`}>
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </div>
        ))}
      </div>
    </div>
  ));
});

describe('SwaggerUIComponent', () => {
  beforeEach(() => {
    // Reset all mocks between tests
    jest.clearAllMocks();
  });

  test('renders loading message when window is undefined', () => {
    // Store original window object
    const originalWindow = global.window;

    // Make window undefined
    delete (global as any).window;

    // Render component
    const { getByText } = render(<SwaggerUIComponent url="https://example.com/api.json" />);
    
    // Verify loading message is shown
    expect(getByText('Loading API documentation...')).toBeInTheDocument();

    // Restore window object
    (global as any).window = originalWindow;
  });

  test('renders error message when no URL or spec is provided', () => {
    const { getByText } = render(<SwaggerUIComponent />);
    expect(getByText(/SwaggerUI requires either a URL or spec object/i)).toBeInTheDocument();
  });

  test('renders SwaggerUI with URL', async () => {
    render(<SwaggerUIComponent url="https://example.com/api.json" />);
    
    await waitFor(() => {
      expect(screen.getByTestId('swagger-ui-mock')).toBeInTheDocument();
      expect(screen.getByTestId('swagger-prop-url')).toHaveTextContent('https://example.com/api.json');
      expect(screen.getByTestId('swagger-prop-docExpansion')).toHaveTextContent('list');
      expect(screen.getByTestId('swagger-prop-deepLinking')).toHaveTextContent('true');
    });
  });

  test('renders SwaggerUI with spec object', async () => {
    const mockSpec = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' }
    };
    
    render(<SwaggerUIComponent spec={mockSpec} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('swagger-ui-mock')).toBeInTheDocument();
      expect(screen.getByTestId('swagger-prop-spec')).toHaveTextContent(JSON.stringify(mockSpec));
    });
  });

  test('renders SwaggerUI with custom options', async () => {
    const customOptions = {
      filter: true,
      displayRequestDuration: true
    };
    
    render(
      <SwaggerUIComponent 
        url="https://example.com/api.json" 
        options={customOptions} 
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('swagger-ui-mock')).toBeInTheDocument();
      expect(screen.getByTestId('swagger-prop-filter')).toHaveTextContent('true');
      expect(screen.getByTestId('swagger-prop-displayRequestDuration')).toHaveTextContent('true');
    });
  });

  test('renders error message when SwaggerUI throws an error', async () => {
    // Mock console.error to avoid test output noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock SwaggerUIReact to throw an error
    const mockSwaggerUIReact = require('swagger-ui-react');
    mockSwaggerUIReact.mockImplementation(() => {
      throw new Error('Failed to render');
    });
    
    const { getByText } = render(<SwaggerUIComponent url="https://example.com/api.json" />);
    
    expect(getByText(/Failed to render API documentation/i)).toBeInTheDocument();
    
    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });
}); 