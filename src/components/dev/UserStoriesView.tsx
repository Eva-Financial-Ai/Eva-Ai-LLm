import React, { useState } from 'react';
import {
  UserStoryElement,
  UserJourneyElement,
  UserStory,
  UserJourney,
} from '../../utils/userStoryHelper';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ErrorBoundary from './ErrorBoundary';
import useUserStories from '../../hooks/useUserStories';

interface UserStoriesViewProps {
  componentName: string;
  isOpen: boolean;
  onClose: () => void;
  // Optional override for stories and journeys
  stories?: UserStory[];
  journeys?: UserJourney[];
}

// Fallback UI for when a single story fails to render
const StoryErrorFallback: React.FC<{ id: string }> = ({ id }) => (
  <div className="p-3 border border-orange-200 bg-orange-50 rounded-md mb-3">
    <p className="text-orange-700 text-sm">
      Unable to render user story #{id}. The story may have an invalid format.
    </p>
  </div>
);

// Fallback UI for when a single journey fails to render
const JourneyErrorFallback: React.FC<{ id: string }> = ({ id }) => (
  <div className="p-3 border border-orange-200 bg-orange-50 rounded-md mb-3">
    <p className="text-orange-700 text-sm">
      Unable to render journey "{id}". The journey data may be incomplete or invalid.
    </p>
  </div>
);

// Loading state component
const LoadingState: React.FC = () => (
  <div className="py-8 text-center">
    <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
    <p className="text-gray-600">Loading user stories...</p>
  </div>
);

/**
 * Developer tool for viewing user stories and journeys related to a component
 * This component is only meant to be used in development mode
 */
const UserStoriesView: React.FC<UserStoriesViewProps> = ({
  componentName,
  isOpen,
  onClose,
  stories: propStories,
  journeys: propJourneys,
}) => {
  const [activeTab, setActiveTab] = useState<'stories' | 'journeys'>('stories');

  // Use the hook to fetch stories if not provided as props
  const {
    stories: hookStories,
    journeys: hookJourneys,
    loading,
    error,
  } = useUserStories(componentName);

  // Use props if provided, otherwise use what the hook loaded
  const stories = propStories || hookStories;
  const journeys = propJourneys || hookJourneys;

  if (!isOpen) return null;

  // Safety check for stories and journeys
  const validStories = Array.isArray(stories) ? stories : [];
  const validJourneys = Array.isArray(journeys) ? journeys : [];

  return (
    <ErrorBoundary
      componentName="UserStoriesView"
      fallback={
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
            <h2 className="text-red-600 font-medium mb-3">User Stories Viewer Error</h2>
            <p className="mb-4">There was an error displaying the user stories and journeys.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      }
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="text-lg font-medium">
              User Stories & Journeys: <span className="text-blue-600">{componentName}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'stories'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('stories')}
            >
              User Stories
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'journeys'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('journeys')}
            >
              User Journeys
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                <h3 className="font-medium mb-2">Error loading user stories</h3>
                <p className="text-sm">{error.message}</p>
              </div>
            ) : activeTab === 'stories' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-4">
                  <p>
                    <strong>User stories</strong> follow the format: "As a [role], I want to [goal]
                    so that [benefit]". They help teams understand the user's perspective and the
                    value they seek from a feature.
                  </p>
                </div>

                {validStories.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No user stories defined for this component.
                  </p>
                ) : (
                  validStories.map(story => (
                    <ErrorBoundary
                      key={story.id}
                      componentName={`Story ${story.id}`}
                      fallback={<StoryErrorFallback id={story.id} />}
                    >
                      <UserStoryElement story={story} />
                    </ErrorBoundary>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-4">
                  <p>
                    <strong>User journeys</strong> map out the step-by-step path a user takes to
                    accomplish their goals. They help identify friction points and opportunities for
                    improvement.
                  </p>
                </div>

                {validJourneys.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No user journeys defined for this component.
                  </p>
                ) : (
                  validJourneys.map(journey => (
                    <ErrorBoundary
                      key={journey.id}
                      componentName={`Journey ${journey.id}`}
                      fallback={<JourneyErrorFallback id={journey.id} />}
                    >
                      <UserJourneyElement journey={journey} />
                    </ErrorBoundary>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-3 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Developer tool - not visible in production
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default UserStoriesView;
