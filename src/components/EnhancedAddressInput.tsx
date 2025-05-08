import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface AddressSuggestion {
  id: string;
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  confidence?: number;
  verified?: boolean;
}

export interface EnhancedAddressInputProps {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  unit?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;  // 'US', 'CA', 'MX'
  error?: string;
  onChange: (addressData: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => void;
  className?: string;
  placeholder?: string;
}

const EnhancedAddressInput: React.FC<EnhancedAddressInputProps> = ({
  id,
  label,
  required = false,
  disabled = false,
  value = '',
  unit = '',
  city = '',
  state = '',
  zipCode = '',
  country = 'US',
  error,
  onChange,
  className = '',
  placeholder = 'Enter street address'
}) => {
  const [addressInput, setAddressInput] = useState(value || '');
  const [unitInput, setUnitInput] = useState(unit || '');
  const [cityInput, setCityInput] = useState(city || '');
  const [stateInput, setStateInput] = useState(state || '');
  const [zipInput, setZipInput] = useState(zipCode || '');
  const [countryInput, setCountryInput] = useState(country || 'US');
  
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const addressRef = useRef<HTMLDivElement>(null);
  
  // Update component state when props change (for pre-fill functionality)
  useEffect(() => {
    if (value !== addressInput) setAddressInput(value);
    if (unit !== unitInput) setUnitInput(unit);
    if (city !== cityInput) setCityInput(city);
    if (state !== stateInput) setStateInput(state);
    if (zipCode !== zipInput) setZipInput(zipCode);
    if (country !== countryInput) setCountryInput(country);
  }, [value, unit, city, state, zipCode, country]);
  
  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle input changes and search for suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddressInput(value);
    
    // Only search for suggestions if enough characters and not disabled
    if (value.length >= 3 && !disabled) {
      setIsSearching(true);
      setShowSuggestions(true);
      
      // Debounce the search to prevent too many requests
      const debounce = setTimeout(() => {
        searchAddresses(value, countryInput);
      }, 300);
      
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle individual field changes and notify parent
  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'unit':
        setUnitInput(value);
        break;
      case 'city':
        setCityInput(value);
        break;
      case 'state':
        setStateInput(value);
        break;
      case 'zipCode':
        setZipInput(value);
        break;
      case 'country':
        setCountryInput(value);
        break;
    }
    
    // Notify parent of all address fields
    onChange({
      street: addressInput,
      unit: field === 'unit' ? value : unitInput,
      city: field === 'city' ? value : cityInput,
      state: field === 'state' ? value : stateInput,
      zipCode: field === 'zipCode' ? value : zipInput,
      country: field === 'country' ? value : countryInput
    });
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setAddressInput(suggestion.street);
    setUnitInput(suggestion.unit || '');
    setCityInput(suggestion.city);
    setStateInput(suggestion.state);
    setZipInput(suggestion.zipCode);
    setCountryInput(suggestion.country);
    setShowSuggestions(false);
    
    // Notify parent component of selected address
    onChange({
      street: suggestion.street,
      unit: suggestion.unit,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
      country: suggestion.country
    });
  };
  
  // Search for address suggestions using either Nominatim API or mock data
  const searchAddresses = async (query: string, countryCode: string) => {
    try {
      // Create country filter based on selected country
      const countryFilter = countryCode ? `&countrycodes=${countryCode.toLowerCase()}` : '';
      
      // Using OpenStreetMap Nominatim API for address lookup
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}${countryFilter}&addressdetails=1&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'EVA Credit Application (https://www.evaplatform.com)'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions');
      }
      
      const data = await response.json();
      
      // Transform API response to our format
      const addressSuggestions: AddressSuggestion[] = data.map((item: any, index: number) => {
        const addr = item.address;
        
        // Extract street address components
        let street = '';
        let unit = '';
        
        // Handle different street address formats
        if (addr.house_number && addr.road) {
          street = `${addr.house_number} ${addr.road}`;
        } else if (addr.road) {
          street = addr.road;
        } else if (addr.pedestrian) {
          street = addr.pedestrian;
        } else if (addr.street || addr.address_line1) {
          street = addr.street || addr.address_line1;
        }
        
        // Extract unit/building information if available
        if (addr.unit || addr.apartment || addr.floor) {
          unit = addr.unit || addr.apartment || addr.floor;
        }
        
        // Determine country code
        let countryCode = 'US';
        if (addr.country_code) {
          if (addr.country_code.toUpperCase() === 'CA') {
            countryCode = 'CA';
          } else if (addr.country_code.toUpperCase() === 'MX') {
            countryCode = 'MX';
          }
        }
        
        // Get state or province (depends on country)
        let stateOrProvince = '';
        if (countryCode === 'US') {
          stateOrProvince = addr.state_code || addr.state || '';
        } else if (countryCode === 'CA') {
          stateOrProvince = addr.state_code || addr.province || addr.state || '';
        } else if (countryCode === 'MX') {
          stateOrProvince = addr.state || '';
        }
        
        return {
          id: `addr-${uuidv4().substring(0, 8)}`,
          street: street,
          unit: unit || undefined,
          city: addr.city || addr.town || addr.village || addr.hamlet || addr.municipality || '',
          state: stateOrProvince,
          zipCode: addr.postcode || '',
          country: countryCode,
          fullAddress: item.display_name,
          confidence: parseFloat(item.importance) * 100 || 0,
          verified: false
        };
      }).filter((item: AddressSuggestion) => 
        // Filter out suggestions without complete address information
        item.street && item.city && item.state
      );
      
      setSuggestions(addressSuggestions);
      setIsSearching(false);
    } catch (error) {
      console.error('Error searching addresses:', error);
      
      // Fallback to mock suggestions if API fails
      const mockSuggestions: AddressSuggestion[] = [
        {
          id: `mock-${uuidv4().substring(0, 8)}`,
          street: `${Math.floor(Math.random() * 1000) + 100} ${query} St`,
          unit: `Unit ${Math.floor(Math.random() * 100) + 1}`,
          city: getRandomCity(countryCode),
          state: getRandomState(countryCode),
          zipCode: getRandomZipCode(countryCode),
          country: countryCode,
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} St, ${getRandomCity(countryCode)}, ${getRandomState(countryCode)} ${getRandomZipCode(countryCode)}`,
          confidence: 70,
          verified: false
        },
        {
          id: `mock-${uuidv4().substring(0, 8)}`,
          street: `${Math.floor(Math.random() * 1000) + 100} ${query} Ave`,
          city: getRandomCity(countryCode),
          state: getRandomState(countryCode),
          zipCode: getRandomZipCode(countryCode),
          country: countryCode,
          fullAddress: `${Math.floor(Math.random() * 1000) + 100} ${query} Ave, ${getRandomCity(countryCode)}, ${getRandomState(countryCode)} ${getRandomZipCode(countryCode)}`,
          confidence: 65,
          verified: false
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsSearching(false);
    }
  };
  
  // Helper functions for generating mock data based on country
  const getRandomCity = (countryCode: string): string => {
    if (countryCode === 'US') {
      const cities = ['San Francisco', 'New York', 'Chicago', 'Los Angeles', 'Miami'];
      return cities[Math.floor(Math.random() * cities.length)];
    } else if (countryCode === 'CA') {
      const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'];
      return cities[Math.floor(Math.random() * cities.length)];
    } else if (countryCode === 'MX') {
      const cities = ['Mexico City', 'Guadalajara', 'Monterrey', 'Tijuana', 'Cancun'];
      return cities[Math.floor(Math.random() * cities.length)];
    }
    return 'San Francisco';
  };
  
  const getRandomState = (countryCode: string): string => {
    if (countryCode === 'US') {
      const states = ['CA', 'NY', 'IL', 'TX', 'FL'];
      return states[Math.floor(Math.random() * states.length)];
    } else if (countryCode === 'CA') {
      const provinces = ['ON', 'BC', 'QC', 'AB', 'NS'];
      return provinces[Math.floor(Math.random() * provinces.length)];
    } else if (countryCode === 'MX') {
      const states = ['CDMX', 'JAL', 'NL', 'BC', 'QROO'];
      return states[Math.floor(Math.random() * states.length)];
    }
    return 'CA';
  };
  
  const getRandomZipCode = (countryCode: string): string => {
    if (countryCode === 'US') {
      return `${Math.floor(Math.random() * 90000) + 10000}`;
    } else if (countryCode === 'CA') {
      // Canadian postal code format A1A 1A1
      const letters = 'ABCEGHJKLMNPRSTVXY';
      const letter1 = letters.charAt(Math.floor(Math.random() * letters.length));
      const letter2 = letters.charAt(Math.floor(Math.random() * letters.length));
      const letter3 = letters.charAt(Math.floor(Math.random() * letters.length));
      return `${letter1}${Math.floor(Math.random() * 10)}${letter2} ${Math.floor(Math.random() * 10)}${letter3}${Math.floor(Math.random() * 10)}`;
    } else if (countryCode === 'MX') {
      // Mexican postal code is 5 digits
      return `${Math.floor(Math.random() * 90000) + 10000}`;
    }
    return `${Math.floor(Math.random() * 90000) + 10000}`;
  };
  
  // Render input fields for the address form
  return (
    <div className={`space-y-4 ${className}`} ref={addressRef}>
      {/* Street Address field with autocomplete */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            id={id}
            value={addressInput}
            onChange={handleInputChange}
            disabled={disabled}
            className={`block w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            placeholder={placeholder}
            required={required}
          />
          {isSearching && (
            <div className="absolute right-3 top-2">
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        {/* Display address suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {suggestions.map(suggestion => (
                <li 
                  key={suggestion.id} 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="font-medium">
                    {suggestion.street}
                    {suggestion.unit && <span className="ml-1 text-gray-500">({suggestion.unit})</span>}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                    {suggestion.country !== 'US' && <span className="ml-1">({suggestion.country})</span>}
                  </div>
                  {suggestion.confidence && (
                    <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden w-full">
                      <div 
                        className="h-full bg-primary-600 rounded-full" 
                        style={{ width: `${Math.min(suggestion.confidence, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Unit/Apartment/Building number */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${id}-unit`}>
          Apartment/Unit/Building # (optional)
        </label>
        <input
          type="text"
          id={`${id}-unit`}
          value={unitInput}
          onChange={(e) => handleFieldChange('unit', e.target.value)}
          disabled={disabled}
          className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Apt, Suite, Unit, Building, Floor, etc."
        />
      </div>
      
      {/* City, State/Province, Zip in one row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-2/5">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${id}-city`}>
            City {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id={`${id}-city`}
            value={cityInput}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            disabled={disabled}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="City"
            required={required}
          />
        </div>
        
        <div className="w-full sm:w-1/5">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${id}-state`}>
            State/Province {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id={`${id}-state`}
            value={stateInput}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            disabled={disabled}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="State/Province"
            required={required}
          />
        </div>
        
        <div className="w-full sm:w-1/5">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${id}-zip`}>
            Zip/Postal Code {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id={`${id}-zip`}
            value={zipInput}
            onChange={(e) => handleFieldChange('zipCode', e.target.value)}
            disabled={disabled}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Zip/Postal Code"
            required={required}
          />
        </div>
        
        <div className="w-full sm:w-1/5">
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={`${id}-country`}>
            Country {required && <span className="text-red-500">*</span>}
          </label>
          <select
            id={`${id}-country`}
            value={countryInput}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            disabled={disabled}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required={required}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAddressInput; 