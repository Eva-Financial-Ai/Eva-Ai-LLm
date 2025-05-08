import React, { useState, useEffect } from 'react';
import { NAICSIndustry, naicsIndustries } from '../utils/naicsData';

interface NAICSSelectorProps {
  onChange: (selectedCodes: string[], displayValue: string) => void;
  initialValue?: string;
}

const NAICSSelector: React.FC<NAICSSelectorProps> = ({ onChange, initialValue = '' }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<NAICSIndustry | null>(null);
  const [selectedSubcodes, setSelectedSubcodes] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  // Initialize with initial value if provided
  useEffect(() => {
    if (initialValue) {
      const parts = initialValue.split(':');
      if (parts.length > 0) {
        // Find the industry
        const industryCode = parts[0].trim();
        const industry = naicsIndustries.find(ind => ind.code === industryCode);
        
        if (industry) {
          setSelectedIndustry(industry);
          
          // Set selected subcodes if included in initial value
          if (parts.length > 1) {
            const subcodes = parts[1].split(',').map(s => s.trim());
            setSelectedSubcodes(subcodes);
          }
        }
      }
    }
  }, [initialValue]);

  // Update display value and call onChange whenever selections change
  useEffect(() => {
    if (selectedIndustry) {
      let display = `${selectedIndustry.code} - ${selectedIndustry.title}`;
      
      if (selectedSubcodes.length > 0) {
        const subcodeStr = selectedSubcodes.map(code => {
          const subcode = selectedIndustry.subcodes.find(s => s.code === code);
          return subcode ? `${code} - ${subcode.title}` : code;
        }).join(', ');
        
        display += `: ${subcodeStr}`;
      }
      
      setDisplayValue(display);
      
      // Format value for saving
      const value = selectedIndustry.code + (selectedSubcodes.length > 0 ? `:${selectedSubcodes.join(',')}` : '');
      onChange(selectedSubcodes.length > 0 ? selectedSubcodes : [selectedIndustry.code], value);
    } else {
      setDisplayValue('');
      onChange([], '');
    }
  }, [selectedIndustry, selectedSubcodes, onChange]);

  const handleIndustrySelect = (industry: NAICSIndustry) => {
    if (selectedIndustry?.code === industry.code) {
      setSelectedIndustry(null);
      setSelectedSubcodes([]);
    } else {
      setSelectedIndustry(industry);
      setSelectedSubcodes([]);
    }
  };

  const handleSubcodeSelect = (subcodeId: string) => {
    setSelectedSubcodes(prev => {
      if (prev.includes(subcodeId)) {
        return prev.filter(id => id !== subcodeId);
      } else {
        return [...prev, subcodeId];
      }
    });
  };

  const handleSelectAll = () => {
    if (!selectedIndustry) return;
    
    if (selectedSubcodes.length === selectedIndustry.subcodes.length) {
      // If all subcodes are already selected, deselect all
      setSelectedSubcodes([]);
    } else {
      // Otherwise, select all subcodes
      setSelectedSubcodes(selectedIndustry.subcodes.map(sc => sc.code));
    }
  };

  return (
    <div className="relative">
      <div 
        className="w-full p-2 border border-light-border rounded-md text-light-text bg-white flex justify-between items-center cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="truncate">
          {displayValue || 'Select Industry Code (NAICS)'}
        </div>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </div>
      
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-96 overflow-y-auto border border-light-border">
          <div className="p-1">
            {naicsIndustries.map(industry => (
              <div key={industry.code} className="mb-1">
                <div 
                  className={`p-2 rounded cursor-pointer ${selectedIndustry?.code === industry.code ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                  onClick={() => handleIndustrySelect(industry)}
                >
                  <div className="font-medium">{industry.code} - {industry.title}</div>
                </div>
                
                {selectedIndustry?.code === industry.code && (
                  <div className="ml-4 mt-1 border-l-2 border-primary-200 pl-2">
                    <div 
                      className="p-1 text-sm text-primary-700 cursor-pointer hover:bg-primary-50 rounded"
                      onClick={handleSelectAll}
                    >
                      {selectedSubcodes.length === industry.subcodes.length ? "Deselect All" : "Select All Subcodes"}
                    </div>
                    
                    {industry.subcodes.map(subcode => (
                      <div 
                        key={subcode.code} 
                        className="flex items-center p-1 text-sm hover:bg-gray-50"
                      >
                        <input 
                          type="checkbox"
                          id={`subcode-${subcode.code}`}
                          checked={selectedSubcodes.includes(subcode.code)}
                          onChange={() => handleSubcodeSelect(subcode.code)}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={`subcode-${subcode.code}`}
                          className="flex-grow cursor-pointer"
                        >
                          {subcode.code} - {subcode.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NAICSSelector; 