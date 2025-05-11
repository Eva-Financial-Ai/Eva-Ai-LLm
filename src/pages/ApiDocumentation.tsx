import React, { useState, useEffect } from 'react';
import SwaggerUIComponent from '../components/common/SwaggerUI';
import AppErrorBoundary from '../components/common/AppErrorBoundary';

const ApiDocumentationContent: React.FC = () => {
  const [apiSpec, setApiSpec] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiSpecs = async () => {
      try {
        setLoading(true);
        // Try to load the Swagger spec from the docs directory
        const response = await fetch('/docs/api-schemas/transaction-decisions.json');
        if (!response.ok) {
          throw new Error(`Failed to load API documentation: ${response.statusText}`);
        }
        const data = await response.json();
        setApiSpec(data);
      } catch (err) {
        setError('Could not load API documentation. Please try again later.');
        console.error('Error loading API documentation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApiSpecs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <span className="text-xl font-medium text-gray-700">Loading API documentation...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-8 rounded-lg border-2 border-red-200 text-center shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-3">Error Loading Documentation</h2>
          <p className="text-xl text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-6 py-3 bg-primary-600 text-white text-lg font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">API Documentation</h1>
          <p className="text-xl text-gray-600 mt-1">
            Interactive documentation for EVA Platform APIs
          </p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/docs/api-schemas/"
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded text-lg font-medium hover:bg-gray-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            View All Schemas
          </a>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {apiSpec ? (
          <SwaggerUIComponent spec={apiSpec} />
        ) : (
          <div className="text-center p-8">
            <p className="text-xl text-gray-700">No API documentation available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap the component with AppErrorBoundary
const ApiDocumentation: React.FC = () => {
  return (
    <AppErrorBoundary>
      <ApiDocumentationContent />
    </AppErrorBoundary>
  );
};

export default ApiDocumentation; 