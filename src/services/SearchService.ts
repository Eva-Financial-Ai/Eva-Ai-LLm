import { User } from '../types/UserTypes';

interface SearchableFeature {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
}

interface SearchResult {
  features: SearchableFeature[];
  pages: SearchableFeature[];
  users: User[];
}

// Mock data - This would be replaced with API calls
const allFeatures: SearchableFeature[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with overview of all activities',
    path: '/',
    category: 'core',
  },
  {
    id: 'eva-assistant',
    name: 'EVA AI Assistant',
    description: 'AI-powered assistant for financial tasks',
    path: '/assistant',
    category: 'ai',
  },
  {
    id: 'credit-application',
    name: 'Credit Application',
    description: 'Apply for credit and manage applications',
    path: '/credit',
    category: 'finance',
  },
  {
    id: 'customer-retention',
    name: 'Customer Retention',
    description: 'Tools for improving customer retention',
    path: '/retention',
    category: 'customers',
  },
  {
    id: 'customers',
    name: 'Customers',
    description: 'View and manage customer information',
    path: '/customers',
    category: 'customers',
  },
];

const allPages: SearchableFeature[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard view',
    path: '/',
    category: 'page',
  },
  {
    id: 'assistant',
    name: 'AI Assistant',
    description: 'EVA AI Assistant interface',
    path: '/assistant',
    category: 'page',
  },
  {
    id: 'credit',
    name: 'Credit Application',
    description: 'Credit application form',
    path: '/credit/apply',
    category: 'page',
  },
  {
    id: 'credit-review',
    name: 'Application Review',
    description: 'Review credit applications',
    path: '/credit/review',
    category: 'page',
  },
  {
    id: 'retention-analytics',
    name: 'Retention Analytics',
    description: 'Customer retention metrics and analysis',
    path: '/retention/analytics',
    category: 'page',
  },
  {
    id: 'customer-list',
    name: 'Customer List',
    description: 'List of all customers',
    path: '/customers',
    category: 'page',
  },
  {
    id: 'customer-details',
    name: 'Customer Details',
    description: 'Detailed customer information',
    path: '/customers/:id',
    category: 'page',
  },
];

// Mock users - This would be fetched from an API in a real application
const allUsers: User[] = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'admin',
    profilePhoto: '/avatars/john.jpg',
  },
  {
    id: 'user2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
    profilePhoto: '/avatars/jane.jpg',
  },
  {
    id: 'user3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'manager',
    profilePhoto: '/avatars/robert.jpg',
  },
  {
    id: 'user4',
    name: 'Emily Chen',
    email: 'emily@example.com',
    role: 'user',
    profilePhoto: '/avatars/emily.jpg',
  },
];

/**
 * Search across all features, pages, and users
 * @param query Search query string
 * @returns Search results organized by type
 */
export const searchAll = (query: string): SearchResult => {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return {
      features: [],
      pages: [],
      users: [],
    };
  }

  const features = allFeatures.filter(
    feature =>
      feature.name.toLowerCase().includes(normalizedQuery) ||
      feature.description.toLowerCase().includes(normalizedQuery)
  );

  const pages = allPages.filter(
    page =>
      page.name.toLowerCase().includes(normalizedQuery) ||
      page.description.toLowerCase().includes(normalizedQuery)
  );

  const users = allUsers.filter(
    user =>
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery) ||
      (user.role && user.role.toLowerCase().includes(normalizedQuery))
  );

  return {
    features,
    pages,
    users,
  };
};

/**
 * Get a feature by its ID
 * @param id Feature ID
 */
export const getFeatureById = (id: string): SearchableFeature | undefined => {
  return allFeatures.find(feature => feature.id === id);
};

/**
 * Get a page by its ID
 * @param id Page ID
 */
export const getPageById = (id: string): SearchableFeature | undefined => {
  return allPages.find(page => page.id === id);
};

/**
 * Get a user by their ID
 * @param id User ID
 */
export const getUserById = (id: string): User | undefined => {
  return allUsers.find(user => user.id === id);
};

export default {
  searchAll,
  getFeatureById,
  getPageById,
  getUserById,
};
