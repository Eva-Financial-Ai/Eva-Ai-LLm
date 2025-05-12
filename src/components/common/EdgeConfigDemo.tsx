import React, { useState, useEffect } from 'react';
import { getEdgeConfigValue, getAllEdgeConfigValues } from '../../services/edgeConfigService';

interface EdgeConfigDemoProps {
  configKey?: string;
}

const EdgeConfigDemo: React.FC<EdgeConfigDemoProps> = ({ configKey = 'greeting' }) => {
  const [value, setValue] = useState<any>(null);
  const [allValues, setAllValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip data fetching during build
    if (typeof window === 'undefined') {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch specific key
        if (configKey) {
          const keyValue = await getEdgeConfigValue(configKey);
          setValue(keyValue);
        }

        // Fetch all values
        const values = await getAllEdgeConfigValues();
        setAllValues(values);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Edge Config values');
        setLoading(false);
        console.error('Edge Config fetch error:', err);
      }
    };

    fetchData();
  }, [configKey]);

  // Check if the token is configured
  const isConfigMissing =
    !process.env.REACT_APP_EDGE_CONFIG_TOKEN ||
    process.env.REACT_APP_EDGE_CONFIG_TOKEN === '' ||
    process.env.REACT_APP_EDGE_CONFIG_TOKEN === 'your_edge_config_token_here';

  if (isConfigMissing) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h3 className="text-amber-700 font-medium">Edge Config Not Configured</h3>
        <p className="text-amber-600">
          The Edge Config token is not configured. Set the REACT_APP_EDGE_CONFIG_TOKEN environment
          variable.
        </p>
        <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
          <p>In Vercel:</p>
          <ol className="list-decimal list-inside">
            <li>Go to Project Settings</li>
            <li>Navigate to Environment Variables</li>
            <li>Add REACT_APP_EDGE_CONFIG_TOKEN</li>
          </ol>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-md shadow-sm">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="ml-2 text-gray-600">Loading Edge Config values...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-600 font-medium">Error</h3>
        <p className="text-red-500">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Make sure you have set up your Edge Config correctly and provided the token in your
          environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Vercel Edge Config Values</h2>

      {configKey && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Requested Key: {configKey}</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="whitespace-pre-wrap text-sm">
              {value !== null ? JSON.stringify(value, null, 2) : 'No value found'}
            </pre>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-md font-medium mb-2">All Available Values</h3>
        <div className="bg-gray-50 p-3 rounded-md max-h-80 overflow-auto">
          <pre className="whitespace-pre-wrap text-sm">
            {Object.keys(allValues).length > 0
              ? JSON.stringify(allValues, null, 2)
              : 'No values found in Edge Config'}
          </pre>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Edge Config is best used for configuration that changes infrequently.</p>
      </div>
    </div>
  );
};

export default EdgeConfigDemo;
