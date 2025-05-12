/**
 * User Story Service - A microservice-like abstraction for user stories
 *
 * This service provides resilient methods for fetching user stories and journeys.
 * Each feature's data is isolated, so failures in one feature's stories won't affect others.
 */

import { UserStory, UserJourney } from './userStoryHelper';

// Cache for story data to prevent redundant parsing
const storyCache: Record<string, { stories: UserStory[]; journeys: UserJourney[] }> = {};

/**
 * Safely extracts user stories from JSDoc comments
 * In a real implementation, this would parse actual code files
 */
export const extractUserStories = (componentName: string): UserStory[] => {
  try {
    // For demonstration purposes, return mock data based on component name
    // In a real implementation, this would parse JSDoc comments from the component file
    return getMockUserStories(componentName);
  } catch (error) {
    console.error(`Error extracting user stories for ${componentName}:`, error);
    return [];
  }
};

/**
 * Safely extracts user journeys from JSDoc comments
 * In a real implementation, this would parse actual code files
 */
export const extractUserJourneys = (componentName: string): UserJourney[] => {
  try {
    // For demonstration purposes, return mock data based on component name
    // In a real implementation, this would parse JSDoc comments from the component file
    return getMockUserJourneys(componentName);
  } catch (error) {
    console.error(`Error extracting user journeys for ${componentName}:`, error);
    return [];
  }
};

/**
 * Gets all user stories and journeys for a component
 * Uses caching to improve performance
 */
export const getUserStoryData = (componentName: string) => {
  try {
    // Check cache first
    if (storyCache[componentName]) {
      return storyCache[componentName];
    }

    // Extract data
    const stories = extractUserStories(componentName);
    const journeys = extractUserJourneys(componentName);

    // Cache for future use
    storyCache[componentName] = { stories, journeys };

    return { stories, journeys };
  } catch (error) {
    console.error(`Error getting user story data for ${componentName}:`, error);
    return { stories: [], journeys: [] };
  }
};

/**
 * Checks if a component has user stories defined
 */
export const hasUserStories = (componentName: string): boolean => {
  try {
    const { stories, journeys } = getUserStoryData(componentName);
    return stories.length > 0 || journeys.length > 0;
  } catch (error) {
    return false;
  }
};

// Mock data for demonstration purposes
// In a real implementation, this would be replaced with actual parsing logic
function getMockUserStories(componentName: string): UserStory[] {
  switch (componentName) {
    case 'DocumentVerificationChat':
      return [
        {
          id: 'DVS-1',
          role: 'lender',
          goal: "interact with Eva's AI to analyze borrower documents",
          benefit: 'I can quickly assess risk factors without manual review',
        },
        {
          id: 'DVS-2',
          role: 'borrower',
          goal: 'upload my financial documents to an interactive AI',
          benefit:
            'I can understand what information is being extracted and what it means for my application',
        },
      ];
    case 'SmartMatching':
      return [
        {
          id: 'SM-1',
          role: 'borrower',
          goal: 'be matched with lenders most likely to approve my loan',
          benefit: 'I can avoid wasting time with rejections',
        },
        {
          id: 'SM-2',
          role: 'lender',
          goal: 'see borrowers who meet my lending criteria',
          benefit: 'I can focus on qualified leads with higher conversion potential',
        },
      ];
    default:
      return [];
  }
}

function getMockUserJourneys(componentName: string): UserJourney[] {
  switch (componentName) {
    case 'DocumentVerificationChat':
      return [
        {
          id: 'DVJ-1',
          title: 'Lender Using Document Verification',
          role: 'lender',
          steps: [
            { id: 1, name: 'Trigger', description: 'Lender needs to verify financial statements' },
            {
              id: 2,
              name: 'Entry Point',
              description: 'Clicks "Document Verification" in dashboard',
            },
            { id: 3, name: 'AI Greeting', description: 'Receives welcome message from Eva AI' },
          ],
        },
      ];
    case 'SmartMatching':
      return [
        {
          id: 'SMJ-1',
          title: 'Borrower Using Smart Matching',
          role: 'borrower',
          steps: [
            {
              id: 1,
              name: 'Trigger',
              description: 'Borrower needs financing for equipment purchase',
            },
            {
              id: 2,
              name: 'Entry Point',
              description: 'Navigates to Smart Matching from dashboard',
            },
            { id: 3, name: 'Role Selection', description: 'Confirms borrower role' },
          ],
        },
      ];
    default:
      return [];
  }
}

export default {
  extractUserStories,
  extractUserJourneys,
  getUserStoryData,
  hasUserStories,
};
