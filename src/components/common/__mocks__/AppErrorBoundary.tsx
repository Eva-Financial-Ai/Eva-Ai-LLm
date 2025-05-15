import React from 'react';

const MockAppErrorBoundary: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div data-testid="error-boundary">{children}</div>
);

export default MockAppErrorBoundary; 