import React, { useState } from 'react';
import { FileVersion } from './FilelockDriveApp';

interface VersionHistoryProps {
  versions: FileVersion[];
  selectedVersion: FileVersion | null;
  onSelectVersion: (version: FileVersion) => void;
  formatDate: (dateString: string) => string;
  formatFileSize: (bytes: number) => string;
  isLoading?: boolean;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  selectedVersion,
  onSelectVersion,
  formatDate,
  formatFileSize,
  isLoading = false,
}) => {
  const [visibleVersions, setVisibleVersions] = useState<number>(10);

  // Load more versions
  const loadMoreVersions = () => {
    setVisibleVersions(prev => Math.min(prev + 10, versions.length));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading version history...</p>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">No version history available</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white flex-1 overflow-auto">
        <ul className="divide-y divide-gray-200">
          {versions.slice(0, visibleVersions).map(version => (
            <li key={version.id}>
              <button
                onClick={() => onSelectVersion(version)}
                className={`w-full text-left block hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out ${
                  selectedVersion?.id === version.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                        {version.versionNumber}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Version {version.versionNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {version.createdBy ? `Created by ${version.createdBy}` : 'Created'} on{' '}
                        {formatDate(version.createdAt)}
                      </div>
                      {version.notes && (
                        <div className="text-sm text-gray-600 mt-1">{version.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="text-sm text-gray-500">{formatFileSize(version.size)}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {visibleVersions < versions.length && (
          <div className="px-4 py-4 text-center">
            <button
              onClick={loadMoreVersions}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              Load more versions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionHistory;
