import React, { useState } from 'react';
import FileLock, { FileLockRequest, FileLockRequestAdvanced } from './FileLock';

const FileLockDemo: React.FC = () => {
  const [requestedDocs, setRequestedDocs] = useState<any[]>([]);

  const handleRequestComplete = (docs: any[]) => {
    setRequestedDocs(docs);
    console.log('Documents requested:', docs);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">FileLock Component Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Simple FileLock</h2>
          <p className="text-gray-600 mb-4">
            Basic document request with standard form.
          </p>
          <div className="border border-gray-200 rounded-lg p-4 h-64 relative">
            <p className="text-center text-gray-400">Demo container (click the lock icon)</p>
            <FileLockRequest 
              position="bottom-right" 
              onRequestComplete={handleRequestComplete}
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Advanced FileLock</h2>
          <p className="text-gray-600 mb-4">
            Multi-step document request with form categories.
          </p>
          <div className="border border-gray-200 rounded-lg p-4 h-64 relative">
            <p className="text-center text-gray-400">Demo container (click the lock icon)</p>
            <FileLockRequestAdvanced 
              position="bottom-right"
              onRequestComplete={handleRequestComplete} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Default FileLock</h2>
        <p className="text-gray-600 mb-4">
          Default component that can be configured to use either simple or advanced version.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 h-40 relative">
            <p className="text-center text-gray-400">Simple variant</p>
            <FileLock 
              variant="simple"
              position="bottom-right"
              onRequestComplete={handleRequestComplete}
            />
          </div>
          <div className="border border-gray-200 rounded-lg p-4 h-40 relative">
            <p className="text-center text-gray-400">Advanced variant</p>
            <FileLock 
              variant="advanced"
              position="bottom-right"
              onRequestComplete={handleRequestComplete}
            />
          </div>
        </div>
      </div>
      
      {requestedDocs.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Requested Documents</h2>
          <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-auto">
            {JSON.stringify(requestedDocs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FileLockDemo; 