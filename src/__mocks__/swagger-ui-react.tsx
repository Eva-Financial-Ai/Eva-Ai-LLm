import React from 'react';

const SwaggerUIMock = (props: Record<string, any>) => (
  <div data-testid="swagger-ui-mock">
    <div data-testid="swagger-props">
      {Object.entries(props).map(([key, value]) => (
        <div key={key} data-testid={`swagger-prop-${key}`}>
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </div>
      ))}
    </div>
  </div>
);

export default SwaggerUIMock; 