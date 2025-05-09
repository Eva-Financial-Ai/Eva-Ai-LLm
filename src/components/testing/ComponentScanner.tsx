import React, { lazy } from 'react';
import { ComponentMap } from './ComponentTester';

interface ScanOptions {
  componentDirs: string[];
  excludeDirs?: string[];
  excludeFiles?: string[];
  recursive?: boolean;
}

interface ScanResult {
  componentMap: ComponentMap;
  errors: Array<{ file: string; error: string }>;
}

// This is a helper function to create a context for requiring components
const createRequireContext = (baseDir: string) => {
  // In a browser environment, we need to use webpack's require.context
  // This is a special feature of webpack that allows us to require all files in a directory
  if (typeof (require as any).context === 'function') {
    try {
      return (require as any).context(baseDir, true, /\.(jsx|tsx)$/);
    } catch (error) {
      console.error(`Failed to create require context for ${baseDir}:`, error);
      return null;
    }
  }
  return null;
};

/**
 * Scans directories for React components and builds a component map
 */
export const scanComponents = async (options: ScanOptions): Promise<ScanResult> => {
  const { componentDirs, excludeDirs = [], excludeFiles = [], recursive = true } = options;

  const componentMap: ComponentMap = {};
  const errors: Array<{ file: string; error: string }> = [];

  // Use webpack's require.context to get all component files
  for (const baseDir of componentDirs) {
    const requireContext = createRequireContext(baseDir);

    if (!requireContext) {
      errors.push({
        file: baseDir,
        error: 'Failed to create require context for directory',
      });
      continue;
    }

    // Get all files that match the context
    const componentFiles = requireContext.keys();

    for (const filePath of componentFiles) {
      // Skip test files
      if (filePath.includes('.test.') || filePath.includes('.spec.')) {
        continue;
      }

      // Skip excluded files
      const fileName = filePath.split('/').pop() || '';
      if (
        excludeFiles.some(pattern => {
          if (pattern.includes('*')) {
            const regex = new RegExp(pattern.replace('*', '.*'));
            return regex.test(fileName);
          }
          return fileName === pattern;
        })
      ) {
        continue;
      }

      // Skip excluded directories
      const dirParts = filePath.split('/');
      if (dirParts.some(part => excludeDirs.includes(part))) {
        continue;
      }

      // Try to import the component
      try {
        const componentName = fileName.replace(/\.(jsx|tsx)$/, '');

        // Create a lazy-loaded component
        const LazyComponent = lazy(() => {
          return new Promise<{ default: React.ComponentType<any> }>(resolve => {
            try {
              const module = requireContext(filePath);
              // Try to get the default export or named export that matches the filename
              const Component = module.default || module[componentName];

              if (!Component) {
                throw new Error(`No component export found for ${componentName}`);
              }

              resolve({ default: Component });
            } catch (error) {
              console.error(`Error loading component ${filePath}:`, error);
              // Resolve with a placeholder component to prevent crashes
              resolve({
                default: () => <div>Failed to load component: {componentName}</div>,
              });
            }
          });
        });

        componentMap[componentName] = { component: LazyComponent };
      } catch (error) {
        errors.push({
          file: filePath,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  return { componentMap, errors };
};
