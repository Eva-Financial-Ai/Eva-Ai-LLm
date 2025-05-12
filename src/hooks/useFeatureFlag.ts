import { useState, useEffect } from 'react';
import { getEdgeConfigValue } from '../services/edgeConfigService';

/**
 * Hook to check if a feature flag is enabled in Edge Config
 * @param featureName Name of the feature flag to check
 * @param defaultValue Default value to use if the feature flag is not found
 * @returns Object with isEnabled and loading state
 */
export function useFeatureFlag(featureName: string, defaultValue: boolean = false) {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeature = async () => {
      try {
        // First try to get from a features object
        const features = await getEdgeConfigValue<Record<string, boolean>>('features');
        if (features && typeof features[featureName] === 'boolean') {
          setIsEnabled(features[featureName]);
          setLoading(false);
          return;
        }

        // If not found in features object, try to get directly by feature name
        const featureValue = await getEdgeConfigValue<boolean>(featureName);
        if (typeof featureValue === 'boolean') {
          setIsEnabled(featureValue);
        }
      } catch (error) {
        console.error(`Error checking feature flag ${featureName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    checkFeature();
  }, [featureName, defaultValue]);

  return { isEnabled, loading };
}

/**
 * Hook to get multiple feature flags at once
 * @param featureNames Array of feature flag names to check
 * @param defaultValues Default values for each feature flag
 * @returns Object with feature flags state and loading state
 */
export function useFeatureFlags(
  featureNames: string[],
  defaultValues: Record<string, boolean> = {}
) {
  const [features, setFeatures] = useState<Record<string, boolean>>({
    ...defaultValues,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeatures = async () => {
      try {
        // Try to get all features at once
        const allFeatures = await getEdgeConfigValue<Record<string, boolean>>('features');

        // Create a result object with either the fetched value or the default
        const result: Record<string, boolean> = { ...defaultValues };

        if (allFeatures) {
          // Update result with values from allFeatures
          featureNames.forEach(name => {
            if (typeof allFeatures[name] === 'boolean') {
              result[name] = allFeatures[name];
            }
          });
        } else {
          // If features object doesn't exist, try to get each feature individually
          await Promise.all(
            featureNames.map(async name => {
              const value = await getEdgeConfigValue<boolean>(name);
              if (typeof value === 'boolean') {
                result[name] = value;
              }
            })
          );
        }

        setFeatures(result);
      } catch (error) {
        console.error('Error checking feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFeatures();
  }, [featureNames, JSON.stringify(defaultValues)]);

  return { features, loading };
}

export default useFeatureFlag;
