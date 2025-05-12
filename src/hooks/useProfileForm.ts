import { useState, useEffect, useCallback } from 'react';
import { ProfileData } from '../api/userService';
import userService from '../api/userService';
import { ApiErrorHandler } from '../utils/apiErrorHandler';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex - accepts various formats
const PHONE_REGEX = /^(\+\d{1,3}[- ]?)?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
  preferredLanguage: string;
}

interface ProfileFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  preferredLanguage?: string;
  general?: string;
}

interface UseProfileFormReturn {
  formState: ProfileFormState;
  errors: ProfileFormErrors;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const useProfileForm = (): UseProfileFormReturn => {
  // Default initial state
  const initialState: ProfileFormState = {
    name: '',
    email: '',
    phone: '',
    preferredLanguage: 'en',
  };

  // Form state
  const [formState, setFormState] = useState<ProfileFormState>(initialState);
  const [originalState, setOriginalState] = useState<ProfileFormState>(initialState);
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load profile data from API
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const profileData = await userService.getProfile();

        // Map API data to form state
        const newFormState = {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || '',
          preferredLanguage: profileData.preferredLanguage || 'en',
        };

        setFormState(newFormState);
        setOriginalState(newFormState);
      } catch (error) {
        const formattedError = ApiErrorHandler.formatError(error);
        setErrors({
          general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
        });

        console.error('Failed to load profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Handle form changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      // Clear field error when user starts typing
      if (errors[name as keyof ProfileFormErrors]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof ProfileFormErrors];
          return newErrors;
        });
      }

      setFormState(prev => ({
        ...prev,
        [name]: value,
      }));
    },
    [errors]
  );

  // Validate form inputs
  const validateForm = useCallback((): boolean => {
    const newErrors: ProfileFormErrors = {};

    // Name validation
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formState.name.trim().length < 2) {
      newErrors.name = 'Name is too short';
    }

    // Email validation
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional)
    if (formState.phone && !PHONE_REGEX.test(formState.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Language validation
    if (!formState.preferredLanguage) {
      newErrors.preferredLanguage = 'Please select a language';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Map form state to API data
      const updatedProfile: Partial<ProfileData> = {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        preferredLanguage: formState.preferredLanguage,
      };

      // Submit to API
      const result = await userService.updateProfile(updatedProfile);

      // Update original state to mark form as "pristine" again
      setOriginalState({
        name: result.name,
        email: result.email,
        phone: result.phone || '',
        preferredLanguage: result.preferredLanguage,
      });
    } catch (error) {
      const formattedError = ApiErrorHandler.formatError(error);

      // Check for specific error types
      if (formattedError.status === 422 && formattedError.details) {
        // Validation errors
        const fieldErrors: ProfileFormErrors = {};
        Object.entries(formattedError.details).forEach(([key, value]) => {
          if (key in formState) {
            fieldErrors[key as keyof ProfileFormErrors] = value as string;
          }
        });

        setErrors(fieldErrors);
      } else {
        // General error
        setErrors({
          general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
        });
      }

      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to original state
  const resetForm = useCallback(() => {
    setFormState(originalState);
    setErrors({});
  }, [originalState]);

  // Calculate if form has changed
  const isDirty = JSON.stringify(formState) !== JSON.stringify(originalState);

  return {
    formState,
    errors,
    isLoading,
    isSaving,
    isDirty,
    handleChange,
    handleSubmit,
    resetForm,
  };
};

export default useProfileForm;
