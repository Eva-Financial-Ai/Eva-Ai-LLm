import React from 'react';

interface EvaScoreLoaderProps {
  message?: string;
}

const EvaScoreLoader: React.FC<EvaScoreLoaderProps> = ({
  message = 'Loading Eva Score Analysis...',
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-8">
      <div className="flex flex-col items-center justify-center h-64">
        {/* Eva logo loading spinner */}
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-20 h-20 flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">EVA</span>
          </div>
        </div>

        {/* Loading message */}
        <p className="text-gray-700 text-lg font-medium mb-2">{message}</p>
        <p className="text-gray-500 text-sm text-center max-w-md">
          Our AI is analyzing risk factors and generating comprehensive credit insights
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-md mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full animate-pulse"
              style={{ width: '75%' }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Gathering data</span>
            <span>Processing</span>
            <span>Finalizing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaScoreLoader;
