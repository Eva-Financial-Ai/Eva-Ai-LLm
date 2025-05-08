import { useState } from 'react';

interface FormValues {
  [key: string]: any;
}

interface UseFormWithOtherOptions {
  initialValues: FormValues;
  otherFieldSuffix?: string;
}

/**
 * A custom hook for managing forms with "Other" options in select fields
 * When a field has value "other", this hook manages the corresponding text input field
 */
const useFormWithOther = ({ 
  initialValues, 
  otherFieldSuffix = '_other' 
}: UseFormWithOtherOptions) => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handle changes to regular form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For select fields, when switching away from "other" option, clear the corresponding other field
    if (e.target.type === 'select-one' && formValues[name] === 'other' && value !== 'other') {
      const otherFieldName = `${name}${otherFieldSuffix}`;
      setFormValues(prev => ({
        ...prev,
        [name]: value,
        [otherFieldName]: ''
      }));
    } else {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle changes to "other" text input fields
  const handleOtherChange = (fieldName: string, otherValue: string) => {
    const otherFieldName = `${fieldName}${otherFieldSuffix}`;
    setFormValues(prev => ({
      ...prev,
      [otherFieldName]: otherValue
    }));
  };

  // Validate that if an "other" option is selected, the corresponding text field is filled
  const validateOtherFields = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Check all fields to see if any have "other" selected
    Object.keys(formValues).forEach(fieldName => {
      if (
        formValues[fieldName] === 'other' && 
        !fieldName.endsWith(otherFieldSuffix)
      ) {
        const otherFieldName = `${fieldName}${otherFieldSuffix}`;
        
        // If the corresponding other field is empty, add an error
        if (!formValues[otherFieldName] || formValues[otherFieldName].trim() === '') {
          newErrors[fieldName] = 'Please specify a value for "Other"';
        }
      }
    });
    
    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Get the final values, transforming any "other" selections with their corresponding text values
  const getTransformedValues = () => {
    const transformedValues = { ...formValues };
    
    Object.keys(formValues).forEach(fieldName => {
      if (
        formValues[fieldName] === 'other' && 
        !fieldName.endsWith(otherFieldSuffix)
      ) {
        const otherFieldName = `${fieldName}${otherFieldSuffix}`;
        
        // If the other field has a value, use it as the main field value
        if (formValues[otherFieldName] && formValues[otherFieldName].trim() !== '') {
          transformedValues[`${fieldName}_display`] = formValues[otherFieldName];
        }
      }
    });
    
    return transformedValues;
  };

  return {
    formValues,
    setFormValues,
    errors,
    setErrors,
    handleChange,
    handleOtherChange,
    validateOtherFields,
    getTransformedValues
  };
};

export default useFormWithOther; 