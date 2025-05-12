/**
 * Utility functions for documenting user stories and journeys
 */

import React from 'react';

export interface UserStory {
  id: string;
  role: string;
  goal: string;
  benefit: string;
}

export interface JourneyStep {
  id: number;
  name: string;
  description?: string;
}

export interface UserJourney {
  id: string;
  title: string;
  role: string;
  steps: JourneyStep[];
}

/**
 * Formats a user story in standard format
 * @param story The user story object
 * @returns Formatted user story string
 */
export const formatUserStory = (story: UserStory): string => {
  return `As a ${story.role}, I want to ${story.goal} so that ${story.benefit}`;
};

/**
 * Creates a formatted user story element
 * @param story The user story object
 * @returns JSX element with formatted user story
 */
export const UserStoryElement: React.FC<{ story: UserStory }> = ({ story }) => {
  return (
    <div className="user-story p-4 border border-gray-200 rounded-md mb-3">
      <h4 className="font-medium text-sm text-gray-700 mb-1">User Story #{story.id}</h4>
      <p className="text-gray-800">
        <span className="font-medium">As a</span> {story.role},{' '}
        <span className="font-medium">I want to</span> {story.goal}{' '}
        <span className="font-medium">so that</span> {story.benefit}
      </p>
    </div>
  );
};

/**
 * Creates a formatted user journey element
 * @param journey The user journey object
 * @returns JSX element with formatted user journey
 */
export const UserJourneyElement: React.FC<{ journey: UserJourney }> = ({ journey }) => {
  return (
    <div className="user-journey p-4 border border-gray-200 rounded-md">
      <h3 className="font-medium text-gray-800 mb-2">{journey.title}</h3>
      <p className="text-sm text-gray-600 mb-3">User role: {journey.role}</p>

      <ol className="journey-steps">
        {journey.steps.map(step => (
          <li key={step.id} className="mb-2 pl-2 border-l-2 border-indigo-300">
            <div className="step-header flex items-center">
              <span className="step-number font-bold mr-2">{step.id}.</span>
              <span className="step-name font-medium">{step.name}</span>
            </div>
            {step.description && <p className="text-sm text-gray-600 ml-6">{step.description}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
};

/**
 * Parses JSDoc comments for user stories and journeys
 * This is a mock implementation that would be replaced with
 * actual code to parse JSDoc comments at build time
 */
export const extractUserStoriesFromComponent = (componentPath: string): UserStory[] => {
  // This would be implemented to extract stories from JSDoc comments
  return [];
};

/**
 * Generates documentation from user stories and journeys
 * @param componentName The name of the component
 * @param stories Array of user stories
 * @param journeys Array of user journeys
 * @returns Markdown documentation string
 */
export const generateComponentDocumentation = (
  componentName: string,
  stories: UserStory[],
  journeys: UserJourney[]
): string => {
  let doc = `# ${componentName} Documentation\n\n`;

  doc += `## User Stories\n\n`;
  stories.forEach(story => {
    doc += `- ${formatUserStory(story)}\n`;
  });

  doc += `\n## User Journeys\n\n`;
  journeys.forEach(journey => {
    doc += `### ${journey.title}\n\n`;
    doc += `User role: ${journey.role}\n\n`;

    journey.steps.forEach(step => {
      doc += `${step.id}. **${step.name}**: ${step.description || ''}\n`;
    });

    doc += '\n';
  });

  return doc;
};

export default {
  formatUserStory,
  UserStoryElement,
  UserJourneyElement,
  extractUserStoriesFromComponent,
  generateComponentDocumentation,
};
