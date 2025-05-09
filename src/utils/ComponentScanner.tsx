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

// Mock component map for browser environment
// In a real implementation, you would use a build-time process to scan the filesystem
// and generate this map, or use a different approach like importing a manifest
const MOCK_COMPONENT_MAP: Record<string, string> = {
  // Common components
  Button: './components/common/Button',
  Card: './components/common/Card',
  Input: './components/common/Input',
  Dropdown: './components/common/Dropdown',
  Table: './components/common/Table',
  Modal: './components/common/Modal',

  // Feature components
  CreditApplicationForm: './components/CreditApplicationForm',
  BorrowerSelector: './components/BorrowerSelector',
  LienUCCManagement: './components/credit/LienUCCManagement',
  NAICSSelector: './components/NAICSSelector',
  OwnerManager: './components/OwnerManager',
  ContactsManager: './components/communications/ContactsManager',

  // Layout components
  Sidebar: './components/layout/Sidebar',
  TopNavigation: './components/layout/TopNavigation',
  CreditApplicationNav: './components/layout/CreditApplicationNav',

  // Page components
  Dashboard: './pages/Dashboard',
  CreditApplication: './pages/CreditApplication',
  RiskAssessment: './pages/RiskAssessment',
};

/**
 * Browser-compatible component scanner that uses a pre-defined list of components
 * instead of scanning the file system
 */
export const scanComponents = async (options: ScanOptions): Promise<ScanResult> => {
  const { componentDirs, excludeDirs = [], excludeFiles = [], recursive = true } = options;

  const componentMap: ComponentMap = {};
  const errors: Array<{ file: string; error: string }> = [];

  console.log('Scanning directories:', componentDirs);

  // In browser environment, we can't actually scan the filesystem
  // Instead, we'll use our mock component map

  // Filter components based on directories to include
  const dirPrefixes = componentDirs.map(dir => dir.replace('./src/', './').replace('./', ''));

  // Process each component in our mock map
  Object.entries(MOCK_COMPONENT_MAP).forEach(([componentName, componentPath]) => {
    // Check if this component is in one of our target directories
    const matchesDir = dirPrefixes.some(prefix => componentPath.startsWith(prefix));

    if (!matchesDir) return;

    // Check exclusions
    const fileName = componentName + '.tsx';
    if (excludeFiles.includes(fileName)) return;

    const dirParts = componentPath.split('/');
    const matchesExcludedDir = dirParts.some(part => excludeDirs.includes(part));

    if (matchesExcludedDir) return;

    try {
      // Create a lazy-loaded component
      // In a real implementation, this would dynamically import the actual component
      const LazyComponent = lazy(() => {
        // This is a mock that just returns a div with the component name
        // In a real implementation, you would import the actual component
        const MockComponent = (props: any) => (
          <div className="mock-component" data-component-name={componentName}>
            {componentName} Component
            <pre>{JSON.stringify(props, null, 2)}</pre>
          </div>
        );

        return Promise.resolve({ default: MockComponent });
      });

      // Add default props based on component name
      const defaultProps = getDefaultPropsForComponent(componentName);

      componentMap[componentName] = {
        component: LazyComponent,
        defaultProps,
      };
    } catch (error) {
      errors.push({
        file: componentPath,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  console.log(`Found ${Object.keys(componentMap).length} components`);

  return { componentMap, errors };
};

// Helper to provide reasonable default props for testing components
function getDefaultPropsForComponent(componentName: string): Record<string, any> {
  switch (componentName) {
    case 'Button':
      return { children: 'Test Button', onClick: () => console.log('Button clicked') };
    case 'Input':
      return { placeholder: 'Test input', onChange: () => console.log('Input changed') };
    case 'CreditApplicationForm':
      return {
        onSubmit: (data: any) => console.log('Form submitted', data),
        initialData: { businessName: 'Test Business', businessType: 'new' },
      };
    case 'BorrowerSelector':
      return { onSelect: (borrower: any) => console.log('Borrower selected', borrower) };
    case 'ContactsManager':
      return {};
    default:
      return {};
  }
}
