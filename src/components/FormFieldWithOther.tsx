import React, { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormFieldWithOtherProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (name: string, value: string, otherValue?: string) => void;
  otherValue?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}

const FormFieldWithOther: React.FC<FormFieldWithOtherProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  otherValue = '',
  required = false,
  placeholder = 'Please select',
  error,
  className = '',
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState(otherValue);

  // Check if "Other" is selected when component mounts or value changes
  useEffect(() => {
    const isOtherSelected = value === 'other';
    setShowOtherInput(isOtherSelected);
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    const isOtherSelected = newValue === 'other';

    setShowOtherInput(isOtherSelected);

    // Pass the new value to the parent component
    onChange(name, newValue, isOtherSelected ? otherText : undefined);
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOtherValue = e.target.value;
    setOtherText(newOtherValue);

    // Pass the updated "other" value to the parent component
    onChange(name, value, newOtherValue);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={handleSelectChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        <option value="other">Other</option>
      </select>

      {showOtherInput && (
        <div className="mt-2">
          <input
            type="text"
            value={otherText}
            onChange={handleOtherInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Please specify"
            required={required}
          />
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormFieldWithOther;
