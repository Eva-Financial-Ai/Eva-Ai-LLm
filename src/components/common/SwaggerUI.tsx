import React from 'react';
import SwaggerUIReact from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIProps {
  url?: string;
  spec?: object;
  options?: object;
}

/**
 * SwaggerUI Component for displaying OpenAPI documentation
 */
const SwaggerUIComponent: React.FC<SwaggerUIProps> = ({ url, spec, options = {} }) => {
  // Guard against rendering in environments without browser APIs
  if (typeof window === 'undefined') {
    return <div>Loading API documentation...</div>;
  }

  // Ensure we have either a URL or a specification object
  if (!url && !spec) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">
          Error: SwaggerUI requires either a URL or spec object to render documentation.
        </p>
      </div>
    );
  }

  // Swagger UI React requires the spec to be passed as any
  const safeSpec = spec as any;

  try {
    return (
      <div className="swagger-ui-container">
        <SwaggerUIReact
          url={url}
          spec={safeSpec}
          docExpansion="list"
          deepLinking={true}
          {...options}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering SwaggerUI:', error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">
          Failed to render API documentation. Please try again later.
        </p>
      </div>
    );
  }
};

export default SwaggerUIComponent; 