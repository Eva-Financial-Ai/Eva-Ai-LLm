import React, { useEffect } from 'react';
import { Input, InputProps } from '../Input/Input';
import { createFormContext, useFormContext } from './Form';

interface FormFieldProps<T extends Record<string, any>>
  extends Omit<InputProps, 'value' | 'onChange' | 'onBlur' | 'error'> {
  /**
   * Name of the field (must match a key in the form values)
   */
  name: string;
  /**
   * Form context instance created with createFormContext
   */
  formContext: ReturnType<typeof createFormContext<T>>;
  /**
   * Custom change handler (optional)
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Custom blur handler (optional)
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * FormField component integrates Input with Form validation
 */
export function FormField<T extends Record<string, any>>({
  name,
  formContext,
  onChange,
  onBlur,
  ...inputProps
}: FormFieldProps<T>) {
  // Use the form context to connect to the form state
  const { values, errors, touched, setFieldValue, setFieldTouched, validateField } =
    useFormContext(formContext);

  // Validate on mount and when value changes
  useEffect(() => {
    if (touched[name as keyof T]) {
      validateField(name as keyof T);
    }
  }, [values[name as keyof T], name, touched, validateField]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update form state
    setFieldValue(name as keyof T, e.target.value);

    // Call custom handler if provided
    if (onChange) {
      onChange(e);
    }
  };

  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Mark field as touched
    setFieldTouched(name as keyof T, true);

    // Call custom handler if provided
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <Input
      {...inputProps}
      name={name}
      value={(values[name as keyof T] as string) || ''}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched[name as keyof T] ? errors[name as keyof T] : undefined}
    />
  );
}

export default FormField;
