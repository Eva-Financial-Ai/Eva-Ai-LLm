import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/UserTypes';

interface SearchableFeature {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
}

interface SearchResultsProps {
  query: string;
  features: SearchableFeature[];
  pages: SearchableFeature[];
  users: User[];
  onClose: () => void;
  onSelect: (path: string) => void;
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  features,
  pages,
  users,
  onClose,
  onSelect,
  isLoading = false,
}) => {
  const hasResults = features.length > 0 || pages.length > 0 || users.length > 0;

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-1 border border-gray-200 max-h-[80vh] overflow-y-auto p-3 z-50">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  if (!query.trim()) {
    return null;
  }

  if (!hasResults) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-1 border border-gray-200 max-h-[80vh] overflow-y-auto p-3 z-50">
        <div className="text-center py-6 text-gray-500">No results found for "{query}"</div>
      </div>
    );
  }

  const handleSelect = (path: string) => {
    onSelect(path);
  };

  return (
    <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-1 border border-gray-200 max-h-[80vh] overflow-y-auto z-50 w-full">
      {features.length > 0 && (
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Features
          </h3>
          <ul className="space-y-1">
            {features.map(feature => (
              <li key={feature.id} className="rounded-md hover:bg-gray-50">
                <button
                  className="block w-full text-left px-4 py-3 cursor-pointer min-h-[44px]"
                  onClick={() => handleSelect(feature.path)}
                >
                  <div className="font-medium text-gray-900">{feature.name}</div>
                  <div className="text-sm text-gray-500">{feature.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pages.length > 0 && (
        <div className="p-3 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Pages
          </h3>
          <ul className="space-y-1">
            {pages.map(page => (
              <li key={page.id} className="rounded-md hover:bg-gray-50">
                <button
                  className="block w-full text-left px-4 py-3 cursor-pointer min-h-[44px]"
                  onClick={() => handleSelect(page.path)}
                >
                  <div className="font-medium text-gray-900">{page.name}</div>
                  <div className="text-sm text-gray-500">{page.description}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {users.length > 0 && (
        <div className="p-3 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Users
          </h3>
          <ul className="space-y-1">
            {users.map(user => (
              <li key={user.id} className="rounded-md hover:bg-gray-50">
                <button
                  className="block w-full text-left px-4 py-3 flex items-center cursor-pointer min-h-[44px]"
                  onClick={() => handleSelect(`/users/${user.id}`)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-800 font-medium text-base">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
