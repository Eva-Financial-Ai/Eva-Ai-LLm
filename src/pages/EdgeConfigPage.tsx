import React from 'react';
import EdgeConfigDemo from '../components/common/EdgeConfigDemo';

const EdgeConfigPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Vercel Edge Config Integration</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">About Edge Config</h2>
        <p className="mb-4">
          Vercel Edge Config is a key-value data store that allows you to store and retrieve
          configuration at the edge. It's perfect for feature flags, A/B tests, global settings, and
          more.
        </p>
        <p className="mb-4">
          Unlike environment variables, Edge Config can be updated without redeploying your
          application.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Create an Edge Config in the Vercel dashboard</li>
          <li>Add your configuration key-value pairs</li>
          <li>
            Set the <code className="bg-gray-200 p-1 rounded">REACT_APP_EDGE_CONFIG_TOKEN</code>{' '}
            environment variable with your Edge Config token
          </li>
          <li>
            Use the <code className="bg-gray-200 p-1 rounded">vercel env pull</code> command to sync
            environment variables
          </li>
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Edge Config Values</h2>
        <EdgeConfigDemo configKey="greeting" />
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Usage Examples</h2>
        <ul className="list-disc list-inside space-y-2 text-blue-900">
          <li>Feature flags for enabling/disabling features</li>
          <li>Global application settings</li>
          <li>UI configuration that changes infrequently</li>
          <li>A/B testing configuration</li>
          <li>Maintenance mode settings</li>
        </ul>
      </div>
    </div>
  );
};

export default EdgeConfigPage;
