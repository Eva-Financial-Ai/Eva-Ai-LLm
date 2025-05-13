import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll } from '../../services/SearchService';
import SearchResults from './SearchResults';
import { User } from '../../types/UserTypes';

interface SearchableFeature {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
}

interface SearchBarProps {
  placeholder?: string;
  width?: string;
  className?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search EVA Platform...',
  width = 'w-96',
  className = '',
  deviceType = 'desktop',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<{
    features: SearchableFeature[];
    pages: SearchableFeature[];
    users: User[];
  }>({
    features: [],
    pages: [],
    users: [],
  });

  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const isMobile = deviceType === 'mobile';

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim().length > 1) {
      setIsSearching(true);
      setShowResults(true);

      // Perform search with a slight delay to avoid too many searches while typing
      const timerId = setTimeout(() => {
        const results = searchAll(query);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timerId);
    } else {
      setShowResults(false);
    }
  };

  // Handle direct navigation when selecting a search result
  const handleResultSelect = (path: string) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // If we have results, navigate to the first result
      if (searchResults.features.length > 0) {
        handleResultSelect(searchResults.features[0].path);
      } else if (searchResults.pages.length > 0) {
        handleResultSelect(searchResults.pages[0].path);
      } else {
        // If no results, go to search results page
        setShowResults(false);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const closeResults = () => {
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className={`relative ${width}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
          placeholder={isMobile ? 'Search...' : placeholder}
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery.trim().length > 1) {
              setShowResults(true);
            }
          }}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 pr-4 flex items-center min-h-[44px] min-w-[44px] justify-end"
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
            }}
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {showResults && (
        <SearchResults
          query={searchQuery}
          features={searchResults.features}
          pages={searchResults.pages}
          users={searchResults.users}
          onClose={closeResults}
          isLoading={isSearching}
          onSelect={handleResultSelect}
        />
      )}
    </div>
  );
};

export default SearchBar;
