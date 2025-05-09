import React, { useState, useEffect } from 'react';
import { SelectOption } from './SelectField';

interface FormFieldWithOtherProps {
  label: string;
  name: string;
  type: 'text' | 'select' | 'textarea' | 'number' | 'email' | 'password' | 'date';
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  options?: SelectOption[];
  otherValue?: string;
  onOtherChange?: (name: string, value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  rows?: number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

/**
 * A versatile form field component that handles various input types and
 * supports an "Other" option for select fields.
 */
const FormFieldWithOther: React.FC<FormFieldWithOtherProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  otherValue = '',
  onOtherChange,
  placeholder = '',
  required = false,
  error,
  className = '',
  disabled = false,
  rows = 3,
  min,
  max,
  step,
}) => {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [localOtherValue, setLocalOtherValue] = useState(otherValue);

  // Update local other value when prop changes
  useEffect(() => {
    setLocalOtherValue(otherValue);
  }, [otherValue]);

  // Check if "Other" is selected
  useEffect(() => {
    setShowOtherInput(type === 'select' && value === 'other');
  }, [type, value]);

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalOtherValue(newValue);

    if (onOtherChange) {
      onOtherChange(name, newValue);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'select' ? (
        // Select field
        <>
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            required={required}
            disabled={disabled}
          >
            {placeholder && <option value="">{placeholder}</option>}

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
                value={localOtherValue}
                onChange={handleOtherInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Please specify"
                required={required}
                disabled={disabled}
              />
            </div>
          )}
        </>
      ) : type === 'textarea' ? (
        // Textarea field
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      ) : (
        // Other input types (text, number, email, password, date)
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormFieldWithOther;
