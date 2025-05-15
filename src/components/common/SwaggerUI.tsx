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
  // Detect whether we're in a true non-browser context **before** we create the
  // stub so we can still show the fallback UI.
  const hadNoWindow = typeof window === 'undefined';

  if (hadNoWindow && typeof global !== 'undefined') {
    // Provide a minimal stub so ReactDOM doesn't crash while mounting.
    // The stub is only for the lifetime of the render; tests can overwrite it again.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.window = {} as any;
  }

  // Guard against rendering in environments without browser APIs
  if (hadNoWindow) {
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