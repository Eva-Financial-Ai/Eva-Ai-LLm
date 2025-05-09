import React from 'react';
import { FileItem } from './FilelockDriveApp';

interface SharedWithMeProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
  isGridView: boolean;
  sortBy: 'name' | 'date' | 'size';
  setSortBy: (sort: 'name' | 'date' | 'size') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const SharedWithMe: React.FC<SharedWithMeProps> = ({
  files,
  onFileSelect,
  isGridView,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => {
  // Format file size
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle sorting
  const handleSort = (column: 'name' | 'date' | 'size') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Render file icons based on type
  const renderFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return (
        <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
            clipRule="evenodd"
          />
          <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
        </svg>
      );
    } else if (file.type === 'pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
            clipRule="evenodd"
          />
          <path d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        </svg>
      );
    } else if (file.type === 'image') {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
            clipRule="evenodd"
          />
          <path d="M7 14h6v-1H7v1zm0-3h6v-1H7v1zm0-3h6V7H7v1z" />
        </svg>
      );
    }
  };

  // Function to render signature badge
  const renderSignatureBadge = (file: FileItem) => {
    if (!file.signatureStatus) return null;

    switch (file.signatureStatus) {
      case 'awaiting':
        return (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full">
            Awaiting Signature
          </span>
        );
      case 'completed':
        return (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full">
            Signed
          </span>
        );
      case 'rejected':
        return (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Shared With Me</h2>
        <p className="text-sm text-gray-500">Files and folders others have shared with you</p>
      </div>

      {/* Sort controls */}
      <div className="px-4 py-2 border-b border-gray-200 flex justify-end">
        <div className="relative">
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={e => {
              const [newSortBy, newSortDirection] = e.target.value.split('-');
              setSortBy(newSortBy as 'name' | 'date' | 'size');
              setSortDirection(newSortDirection as 'asc' | 'desc');
            }}
            className="block pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="size-asc">Size (Smallest)</option>
            <option value="size-desc">Size (Largest)</option>
          </select>
        </div>
      </div>

      {/* Files area */}
      <div className="flex-1 overflow-auto p-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18h8a2 2 0 002-2V8a2 2 0 00-2-2h-6l-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 5v10M10 10h6"
              />
            </svg>
            <p className="mt-4 text-gray-500">No files have been shared with you yet</p>
          </div>
        ) : isGridView ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => onFileSelect(file)}
                className="relative flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 cursor-pointer transition-all hover:bg-gray-50"
              >
                {renderFileIcon(file)}
                <p className="mt-2 text-sm font-medium text-gray-900 truncate w-full text-center">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 truncate w-full text-center">
                  {file.type !== 'folder' ? formatFileSize(file.size) : ''}
                </p>
                <p className="text-xs text-gray-500 truncate w-full text-center">
                  {file.sharedWith && file.sharedWith.length > 0 && file.sharedWith[0].name}
                </p>

                {renderSignatureBadge(file)}
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      <svg
                        className={`h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Shared By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Shared Date</span>
                    {sortBy === 'date' && (
                      <svg
                        className={`h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <button
                    onClick={() => handleSort('size')}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <span>Size</span>
                    {sortBy === 'size' && (
                      <svg
                        className={`h-4 w-4 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map(file => (
                <tr
                  key={file.id}
                  onClick={() => onFileSelect(file)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        {renderFileIcon(file)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">{file.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {file.sharedWith && file.sharedWith.length > 0 && file.sharedWith[0].name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {file.sharedWith && file.sharedWith.length > 0 && file.sharedWith[0].email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(file.lastModified)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {file.type !== 'folder' ? formatFileSize(file.size) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {file.signatureStatus ? (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          file.signatureStatus === 'awaiting'
                            ? 'bg-yellow-100 text-yellow-800'
                            : file.signatureStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {file.signatureStatus === 'awaiting'
                          ? 'Awaiting Signature'
                          : file.signatureStatus === 'completed'
                            ? 'Signed'
                            : 'Rejected'}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SharedWithMe;
