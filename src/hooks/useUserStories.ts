import { useState, useEffect } from 'react';
import userStoryService from '../utils/userStoryService';
import { UserStory, UserJourney } from '../utils/userStoryHelper';

interface UseUserStoriesResult {
  stories: UserStory[];
  journeys: UserJourney[];
  loading: boolean;
  error: Error | null;
  hasStories: boolean;
}

/**
 * Custom hook for accessing user stories and journeys for a component
 * Provides a React-friendly interface to the user story service
 *
 * @param componentName Name of the component to fetch stories for
 * @returns User stories and journeys, loading state, and error state
 */
const useUserStories = (componentName: string): UseUserStoriesResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [journeys, setJourneys] = useState<UserJourney[]>([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the service to get the stories
        const { stories, journeys } = userStoryService.getUserStoryData(componentName);

        setStories(stories);
        setJourneys(journeys);
      } catch (err) {
        console.error(`Error fetching user stories for ${componentName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [componentName]);

  return {
    stories,
    journeys,
    loading,
    error,
    hasStories: stories.length > 0 || journeys.length > 0,
  };
};

export default useUserStories;
