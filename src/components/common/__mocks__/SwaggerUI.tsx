import React from 'react';

const SwaggerUIMock = (props: Record<string, any>) => (
  <div data-testid="swagger-ui-component">
    {props.url && <div data-testid="swagger-url">{props.url}</div>}
    {props.spec && <div data-testid="swagger-spec">Spec provided</div>}
  </div>
);

export default SwaggerUIMock; 