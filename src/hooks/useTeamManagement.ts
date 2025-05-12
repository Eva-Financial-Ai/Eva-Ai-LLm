import { useState, useEffect, useCallback } from 'react';
import userService, { TeamMember } from '../api/userService';
import { ApiErrorHandler } from '../utils/apiErrorHandler';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface TeamMemberFormState {
  name: string;
  email: string;
  role: TeamMember['role'];
  permissions: TeamMember['permissions'];
}

interface TeamMemberFormErrors {
  name?: string;
  email?: string;
  role?: string;
  general?: string;
}

interface UseTeamManagementReturn {
  teamMembers: TeamMember[];
  isLoading: boolean;
  isSaving: boolean;
  isRemoving: boolean;
  errors: TeamMemberFormErrors;
  formState: TeamMemberFormState;
  setFormState: React.Dispatch<React.SetStateAction<TeamMemberFormState>>;
  resetFormState: () => void;
  loadTeamMembers: () => Promise<void>;
  addTeamMember: () => Promise<boolean>;
  updateTeamMember: (id: string) => Promise<boolean>;
  removeTeamMember: (id: string) => Promise<boolean>;
  validateForm: () => boolean;
}

const initialPermissions = {
  canManageUsers: false,
  canViewDocuments: true,
  canEditDocuments: false,
  canApproveDeals: false,
  canManageSettings: false,
};

const initialFormState: TeamMemberFormState = {
  name: '',
  email: '',
  role: 'user',
  permissions: { ...initialPermissions },
};

const useTeamManagement = (): UseTeamManagementReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [errors, setErrors] = useState<TeamMemberFormErrors>({});
  const [formState, setFormState] = useState<TeamMemberFormState>(initialFormState);

  // Load team members from API
  const loadTeamMembers = useCallback(async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const members = await userService.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      const formattedError = ApiErrorHandler.formatError(error);
      setErrors({
        general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
      });
      console.error('Failed to load team members:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load team members on mount
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  // Validate form data
  const validateForm = useCallback((): boolean => {
    const newErrors: TeamMemberFormErrors = {};

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

    // Role validation
    if (!formState.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);

  // Add a new team member
  const addTeamMember = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const newMember: Omit<TeamMember, 'id'> = {
        name: formState.name,
        email: formState.email,
        role: formState.role,
        status: 'invited',
        joinedDate: new Date(),
        permissions: { ...formState.permissions },
      };

      const createdMember = await userService.addTeamMember(newMember);
      setTeamMembers(prev => [...prev, createdMember]);
      return true;
    } catch (error) {
      const formattedError = ApiErrorHandler.formatError(error);

      if (formattedError.status === 422 && formattedError.details) {
        // Validation errors from server
        const fieldErrors: TeamMemberFormErrors = {};
        Object.entries(formattedError.details).forEach(([key, value]) => {
          if (key in formState) {
            fieldErrors[key as keyof TeamMemberFormErrors] = value as string;
          }
        });

        setErrors(fieldErrors);
      } else if (formattedError.status === 409) {
        // Conflict - likely email already exists
        setErrors({
          email: 'A team member with this email already exists',
        });
      } else {
        // General error
        setErrors({
          general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
        });
      }

      console.error('Failed to add team member:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formState, validateForm]);

  // Update an existing team member
  const updateTeamMember = useCallback(
    async (id: string): Promise<boolean> => {
      if (!validateForm()) {
        return false;
      }

      setIsSaving(true);
      setErrors({});

      try {
        const updatedMember: Partial<TeamMember> = {
          name: formState.name,
          email: formState.email,
          role: formState.role,
          permissions: { ...formState.permissions },
        };

        const result = await userService.updateTeamMember(id, updatedMember);

        setTeamMembers(prev => prev.map(member => (member.id === id ? result : member)));

        return true;
      } catch (error) {
        const formattedError = ApiErrorHandler.formatError(error);

        if (formattedError.status === 422 && formattedError.details) {
          // Validation errors
          const fieldErrors: TeamMemberFormErrors = {};
          Object.entries(formattedError.details).forEach(([key, value]) => {
            if (key in formState) {
              fieldErrors[key as keyof TeamMemberFormErrors] = value as string;
            }
          });

          setErrors(fieldErrors);
        } else if (formattedError.status === 409) {
          // Conflict - likely email already exists
          setErrors({
            email: 'A team member with this email already exists',
          });
        } else if (formattedError.status === 404) {
          // Not found
          setErrors({
            general: 'Team member not found',
          });
          // Refresh the list to make sure we have up-to-date data
          loadTeamMembers();
        } else {
          // General error
          setErrors({
            general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
          });
        }

        console.error('Failed to update team member:', error);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [formState, validateForm, loadTeamMembers]
  );

  // Remove a team member
  const removeTeamMember = useCallback(
    async (id: string): Promise<boolean> => {
      setIsRemoving(true);
      setErrors({});

      try {
        await userService.removeTeamMember(id);
        setTeamMembers(prev => prev.filter(member => member.id !== id));
        return true;
      } catch (error) {
        const formattedError = ApiErrorHandler.formatError(error);

        if (formattedError.status === 404) {
          // Member not found - refresh the list
          loadTeamMembers();
          return true; // Consider this a success since the member doesn't exist anyway
        } else {
          setErrors({
            general: ApiErrorHandler.getUserFriendlyMessage(formattedError),
          });
        }

        console.error('Failed to remove team member:', error);
        return false;
      } finally {
        setIsRemoving(false);
      }
    },
    [loadTeamMembers]
  );

  // Reset form state to initial values
  const resetFormState = useCallback(() => {
    setFormState(initialFormState);
    setErrors({});
  }, []);

  return {
    teamMembers,
    isLoading,
    isSaving,
    isRemoving,
    errors,
    formState,
    setFormState,
    resetFormState,
    loadTeamMembers,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    validateForm,
  };
};

export default useTeamManagement;
