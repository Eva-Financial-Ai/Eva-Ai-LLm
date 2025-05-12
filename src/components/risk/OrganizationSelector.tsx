import React, { useState, useEffect, useRef } from 'react';

// Mock data for organizations - in a real implementation, this would come from an API
const SAMPLE_ORGANIZATIONS = [
  { id: 'org1', name: 'Acme Industries', type: 'manufacturing', riskScore: 78 },
  { id: 'org2', name: 'Global Tech Solutions', type: 'technology', riskScore: 85 },
  { id: 'org3', name: 'Horizon Financial', type: 'financial', riskScore: 92 },
  { id: 'org4', name: 'Evergreen Construction', type: 'construction', riskScore: 73 },
  { id: 'org5', name: 'Metro Health Services', type: 'healthcare', riskScore: 88 },
  { id: 'org6', name: 'Sunset Retail Group', type: 'retail', riskScore: 68 },
  { id: 'org7', name: 'Alpine Logistics', type: 'transportation', riskScore: 81 },
  { id: 'org8', name: 'Coastal Energy', type: 'energy', riskScore: 76 },
  { id: 'org9', name: 'Northstar Communications', type: 'telecom', riskScore: 83 },
  { id: 'org10', name: 'United Hospitality', type: 'hospitality', riskScore: 71 },
];

export interface Organization {
  id: string;
  name: string;
  type: string;
  riskScore: number;
}

interface OrganizationSelectorProps {
  onOrganizationChange: (organization: Organization) => void;
  currentOrganizationId?: string;
}

const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  onOrganizationChange,
  currentOrganizationId,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>(SAMPLE_ORGANIZATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter organizations based on search term
  const filteredOrganizations = searchTerm.trim() === ''
    ? organizations
    : organizations.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.type.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Initialize the selected organization on mount or when currentOrganizationId changes
  useEffect(() => {
    if (currentOrganizationId) {
      const org = organizations.find(org => org.id === currentOrganizationId);
      if (org) {
        setSelectedOrganization(org);
      }
    } else if (organizations.length > 0 && !selectedOrganization) {
      setSelectedOrganization(organizations[0]);
    }
  }, [currentOrganizationId, organizations, selectedOrganization]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle organization selection
  const handleOrganizationSelect = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsDropdownOpen(false);
    setSearchTerm('');
    onOrganizationChange(organization);
  };

  // Get risk score color based on value
  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center">
        <label htmlFor="organization-selector" className="mb-2 sm:mb-0 sm:mr-2 text-sm font-medium text-gray-700">
          Organization:
        </label>
        <div className="relative w-full sm:w-64">
          <button
            type="button"
            className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span className="flex items-center">
              {selectedOrganization ? (
                <>
                  <span className="block truncate">{selectedOrganization.name}</span>
                  <span className={`ml-2 ${getRiskScoreColor(selectedOrganization.riskScore)}`}>
                    ({selectedOrganization.riskScore})
                  </span>
                </>
              ) : (
                <span className="block truncate text-gray-500">Select an organization</span>
              )}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md overflow-auto focus:outline-none sm:text-sm">
              <div className="sticky top-0 z-50 bg-white p-2">
                <input
                  type="text"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <ul className="py-2">
                {filteredOrganizations.length > 0 ? (
                  filteredOrganizations.map((org) => (
                    <li
                      key={org.id}
                      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                        selectedOrganization?.id === org.id ? 'bg-primary-50' : ''
                      }`}
                      onClick={() => handleOrganizationSelect(org)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block font-medium">{org.name}</span>
                          <span className="block text-xs text-gray-500 capitalize">{org.type}</span>
                        </div>
                        <span className={`text-sm font-medium ${getRiskScoreColor(org.riskScore)}`}>
                          {org.riskScore}
                        </span>
                      </div>
                      
                      {selectedOrganization?.id === org.id && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            className="h-5 w-5 text-primary-600"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="py-2 px-3 text-gray-500 text-center">No organizations found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelector; 