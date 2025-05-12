import apiService from './apiService';

// Define API endpoints
const API_ENDPOINTS = {
  PROFILE: '/users/profile',
  TEAM: '/users/team',
  TEAM_MEMBER: (id: string) => `/users/team/${id}`,
  PERMISSIONS: '/users/permissions',
  PREFERENCES: '/users/preferences',
};

// Define interfaces
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  notificationTypes: {
    transactions: boolean;
    documents: boolean;
    messages: boolean;
    reminders: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  status: 'active' | 'invited' | 'inactive';
  joinedDate: Date;
  lastActive?: Date;
  permissions: {
    canManageUsers: boolean;
    canViewDocuments: boolean;
    canEditDocuments: boolean;
    canApproveDeals: boolean;
    canManageSettings: boolean;
  };
}

// Mock data for development
const USE_MOCK_DATA = true;

const mockProfileData: ProfileData = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  role: 'manager',
  preferredLanguage: 'en',
  createdAt: new Date(2022, 1, 15).toISOString(),
  updatedAt: new Date(2023, 6, 10).toISOString(),
};

const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-001',
    name: 'Agha Saad',
    email: 'agha.saad@example.com',
    role: 'manager',
    status: 'active',
    joinedDate: new Date(2023, 1, 15),
    lastActive: new Date(),
    permissions: {
      canManageUsers: true,
      canViewDocuments: true,
      canEditDocuments: true,
      canApproveDeals: false,
      canManageSettings: false,
    },
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'user',
    status: 'active',
    joinedDate: new Date(2023, 3, 10),
    lastActive: new Date(Date.now() - 86400000), // 1 day ago
    permissions: {
      canManageUsers: false,
      canViewDocuments: true,
      canEditDocuments: true,
      canApproveDeals: false,
      canManageSettings: false,
    },
  },
];

const mockNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  smsNotifications: false,
  inAppNotifications: true,
  notificationTypes: {
    transactions: true,
    documents: true,
    messages: true,
    reminders: true,
  },
};

class UserService {
  /**
   * Get user profile data
   */
  async getProfile(): Promise<ProfileData> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProfileData;
    }

    return apiService.get<ProfileData>(API_ENDPOINTS.PROFILE);
  }

  /**
   * Update user profile data
   */
  async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 700));

      const updatedProfile = {
        ...mockProfileData,
        ...profileData,
        updatedAt: new Date().toISOString(),
      };

      return updatedProfile;
    }

    return apiService.put<ProfileData>(API_ENDPOINTS.PROFILE, profileData);
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockNotificationPreferences;
    }

    return apiService.get<NotificationPreferences>(API_ENDPOINTS.PREFERENCES);
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 700));
      return preferences;
    }

    return apiService.put<NotificationPreferences>(API_ENDPOINTS.PREFERENCES, preferences);
  }

  /**
   * Get team members
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockTeamMembers;
    }

    return apiService.get<TeamMember[]>(API_ENDPOINTS.TEAM);
  }

  /**
   * Add a new team member
   */
  async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      const newMember: TeamMember = {
        ...member,
        id: `user-${Date.now()}`,
      };

      mockTeamMembers.push(newMember);
      return newMember;
    }

    return apiService.post<TeamMember>(API_ENDPOINTS.TEAM, member);
  }

  /**
   * Update an existing team member
   */
  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 700));

      const index = mockTeamMembers.findIndex(m => m.id === id);
      if (index === -1) {
        throw new Error('Team member not found');
      }

      mockTeamMembers[index] = {
        ...mockTeamMembers[index],
        ...member,
      };

      return mockTeamMembers[index];
    }

    return apiService.put<TeamMember>(API_ENDPOINTS.TEAM_MEMBER(id), member);
  }

  /**
   * Remove a team member
   */
  async removeTeamMember(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockTeamMembers.findIndex(m => m.id === id);
      if (index === -1) {
        throw new Error('Team member not found');
      }

      mockTeamMembers.splice(index, 1);
      return;
    }

    return apiService.delete(API_ENDPOINTS.TEAM_MEMBER(id));
  }

  /**
   * Change user password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check if current password would be correct in a real environment
      if (currentPassword === 'password') {
        return {
          success: true,
          message: 'Password updated successfully',
        };
      } else {
        throw new Error('Current password is incorrect');
      }
    }

    return apiService.post<{ success: boolean; message: string }>(
      `${API_ENDPOINTS.PROFILE}/change-password`,
      { currentPassword, newPassword }
    );
  }

  /**
   * Enable or disable two-factor authentication
   */
  async toggleTwoFactorAuth(enable: boolean): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_DATA) {
      // Add a delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        success: true,
        message: enable
          ? 'Two-factor authentication enabled'
          : 'Two-factor authentication disabled',
      };
    }

    return apiService.post<{ success: boolean; message: string }>(`${API_ENDPOINTS.PROFILE}/2fa`, {
      enable,
    });
  }
}

export default new UserService();
