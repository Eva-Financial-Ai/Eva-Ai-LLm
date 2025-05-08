import React, { useState, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: SelectOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  handleOtherChange?: (name: string, otherValue: string) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  error,
  className = '',
  handleOtherChange
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState('');

  // Check if current value is "other" and show input field if needed
  useEffect(() => {
    const isOtherSelected = value === 'other';
    setShowOtherInput(isOtherSelected);
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const isOtherSelected = newValue === 'other';
    
    setShowOtherInput(isOtherSelected);
    onChange(e);
    
    // Reset other value when switching away from "other"
    if (!isOtherSelected) {
      setOtherValue('');
    }
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOtherValue = e.target.value;
    setOtherValue(newOtherValue);
    
    // If parent provided a handler for other field changes, call it
    if (handleOtherChange) {
      handleOtherChange(name, newOtherValue);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleSelectChange}
        disabled={disabled}
        required={required}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
      >
        {placeholder && <option value="">{placeholder}</option>}
        
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        
        {/* Always include "Other" option at the end */}
        <option value="other">Other</option>
      </select>
      
      {showOtherInput && (
        <div className="mt-2">
          <input
            type="text"
            value={otherValue}
            onChange={handleOtherInputChange}
            placeholder="Please specify"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={required}
          />
        </div>
      )}
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SelectField; 