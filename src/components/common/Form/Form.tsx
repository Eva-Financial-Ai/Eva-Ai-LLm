import React, { useState, useCallback, createContext, useContext } from 'react';
import { z } from 'zod';

// Define the validation context
interface FormContextType<T extends Record<string, any>> {
  values: T;
  errors: Record<keyof T, string | undefined>;
  touched: Record<keyof T, boolean>;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
  validateField: (name: keyof T) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

interface FormProps<T extends Record<string, any>> {
  /**
   * Initial form values
   */
  initialValues: T;
  /**
   * Zod schema for validation
   */
  validationSchema?: z.ZodSchema<T>;
  /**
   * Function called on form submission
   */
  onSubmit: (values: T) => void | Promise<void>;
  /**
   * Form child elements
   */
  children: React.ReactNode;
  /**
   * Additional CSS class
   */
  className?: string;
}

export function createFormContext<T extends Record<string, any>>() {
  return createContext<FormContextType<T> | undefined>(undefined);
}

// Helper hook to use form context
export function useFormContext<T extends Record<string, any>>(
  FormContext: React.Context<FormContextType<T> | undefined>
) {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

/**
 * Form component with built-in validation
 */
export function Form<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className = '',
}: FormProps<T>) {
  // Create a context for this specific form
  const FormContext = createFormContext<T>();

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | undefined>>(
    {} as Record<keyof T, string | undefined>
  );
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set a field value
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Mark a field as touched
  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T) => {
      if (!validationSchema) return;

      try {
        // Create a partial schema to validate just this field
        const fieldSchema = z.object({
          [name]: (validationSchema as any).shape[name],
        });

        fieldSchema.parse({ [name]: values[name] });

        // Clear error if validation succeeds
        setErrors(prev => ({
          ...prev,
          [name]: undefined,
        }));
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Find the error message for this field
          const fieldError = error.errors.find(err => err.path[0] === name);

          setErrors(prev => ({
            ...prev,
            [name]: fieldError?.message,
          }));
        }
      }
    },
    [values, validationSchema]
  );

  // Validate the entire form
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(values);
      setErrors({} as Record<keyof T, string | undefined>);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {} as Record<keyof T, string | undefined>;

        error.errors.forEach(err => {
          const field = err.path[0] as keyof T;
          newErrors[field] = err.message;
        });

        setErrors(newErrors);
      }
      return false;
    }
  }, [values, validationSchema]);

  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string | undefined>);
    setTouched({} as Record<keyof T, boolean>);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Touch all fields on submit to show all errors
    const touchedFields = {} as Record<keyof T, boolean>;
    Object.keys(values).forEach(key => {
      touchedFields[key as keyof T] = true;
    });
    setTouched(touchedFields);

    // Validate form before submission
    const isValid = validateForm();

    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  };

  const contextValue: FormContextType<T> = {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    isSubmitting,
    setIsSubmitting,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={className} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export default Form;
