import React from 'react';
import { FileItem } from './FilelockDriveApp';

interface DocumentComparisonViewerProps {
  file1: FileItem | null;
  file2: FileItem | null;
  onBack: () => void;
}

const DocumentComparisonViewer: React.FC<DocumentComparisonViewerProps> = ({
  file1,
  file2,
  onBack,
}) => {
  if (!file1 || !file2) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Please select two files to compare.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-lg font-medium text-gray-800">Document Comparison</h2>
        </div>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            onClick={onBack}
          >
            Exit Comparison
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-1 bg-gray-100">
        <div className="bg-white p-4 overflow-auto">
          <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="font-medium">{file1.name}</div>
            <div className="text-sm text-gray-500">
              Last modified: {new Date(file1.lastModified).toLocaleString()}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            {file1.type === 'pdf' ? (
              <iframe
                src={file1.downloadUrl || ''}
                className="w-full h-[calc(100vh-300px)]"
                title={file1.name}
              />
            ) : file1.type.includes('image') ? (
              <img src={file1.downloadUrl || ''} alt={file1.name} className="max-w-full h-auto" />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Preview not available for this file type
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 overflow-auto">
          <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="font-medium">{file2.name}</div>
            <div className="text-sm text-gray-500">
              Last modified: {new Date(file2.lastModified).toLocaleString()}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            {file2.type === 'pdf' ? (
              <iframe
                src={file2.downloadUrl || ''}
                className="w-full h-[calc(100vh-300px)]"
                title={file2.name}
              />
            ) : file2.type.includes('image') ? (
              <img src={file2.downloadUrl || ''} alt={file2.name} className="max-w-full h-auto" />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Preview not available for this file type
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border-t border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">AI Analysis: </span>
          <span>Analyzing differences between documents...</span>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-1">Added in {file2.name}</h3>
            <ul className="text-green-600 list-disc pl-5 space-y-1">
              <li>Section 3.4: Additional payment terms</li>
              <li>Appendix B: Updated compliance requirements</li>
            </ul>
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-1">Removed from {file1.name}</h3>
            <ul className="text-red-600 list-disc pl-5 space-y-1">
              <li>Section 2.1: Previous cancellation clause</li>
              <li>Exhibit A: Outdated reference documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComparisonViewer;
