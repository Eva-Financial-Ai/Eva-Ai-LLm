import React, { useState, useEffect, Suspense } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

// Types for our component testing utility
export interface ComponentTestResult {
  name: string;
  path: string;
  status: 'success' | 'error' | 'warning';
  message?: string;
  renderTime?: number;
  props?: Record<string, any>;
}

export interface ComponentMap {
  [key: string]: {
    component: React.ComponentType<any>;
    defaultProps?: Record<string, any>;
  };
}

interface ComponentTesterProps {
  componentMap: ComponentMap;
  onComplete?: (results: ComponentTestResult[]) => void;
}

// Test container to render components in isolation
const TestContainer: React.FC<{
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  onRenderComplete: (success: boolean, error?: Error) => void;
}> = ({ component: Component, props = {}, onRenderComplete }) => {
  useEffect(() => {
    try {
      // We successfully rendered if we got to this useEffect
      onRenderComplete(true);
    } catch (error) {
      onRenderComplete(false, error instanceof Error ? error : new Error('Unknown error'));
    }

    // Cleanup function
    return () => {};
  }, [onRenderComplete]);

  try {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary onError={error => onRenderComplete(false, error)}>
          <Component {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  } catch (error) {
    onRenderComplete(false, error instanceof Error ? error : new Error('Unknown error'));
    return <div>Error rendering component</div>;
  }
};

// Error boundary to catch rendering errors
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return <div>Component Error: {this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

// Main component tester
export const ComponentTester: React.FC<ComponentTesterProps> = ({ componentMap, onComplete }) => {
  const [results, setResults] = useState<ComponentTestResult[]>([]);
  const [currentComponent, setCurrentComponent] = useState<string | null>(null);
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [totalTests] = useState(Object.keys(componentMap).length);

  useEffect(() => {
    const testNextComponent = async () => {
      const componentNames = Object.keys(componentMap);

      if (testsCompleted >= componentNames.length) {
        // All tests are complete
        if (onComplete) {
          onComplete(results);
        }
        return;
      }

      const componentName = componentNames[testsCompleted];
      setCurrentComponent(componentName);

      // Create a div to render the component into
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.visibility = 'hidden';
      document.body.appendChild(testDiv);

      try {
        const startTime = performance.now();
        const { component, defaultProps = {} } = componentMap[componentName];

        let testPassed = false;
        let error: Error | undefined;

        // Render the component in the test div
        render(
          <TestContainer
            component={component}
            props={defaultProps}
            onRenderComplete={(success, err) => {
              testPassed = success;
              error = err;
            }}
          />,
          testDiv
        );

        // Wait a bit to allow component lifecycles to execute
        await new Promise(resolve => setTimeout(resolve, 100));

        const endTime = performance.now();

        // Create result
        const result: ComponentTestResult = {
          name: componentName,
          path: component.displayName || componentName,
          status: testPassed ? 'success' : 'error',
          renderTime: endTime - startTime,
          props: defaultProps,
          message: error?.message,
        };

        setResults(prev => [...prev, result]);
      } catch (error) {
        // Catch any errors that might happen during testing
        setResults(prev => [
          ...prev,
          {
            name: componentName,
            path: componentName,
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        ]);
      } finally {
        // Clean up
        unmountComponentAtNode(testDiv);
        document.body.removeChild(testDiv);
        setTestsCompleted(prev => prev + 1);
      }
    };

    testNextComponent();
  }, [testsCompleted, totalTests, componentMap, onComplete, results]);

  return (
    <div className="component-tester">
      <h2>Component Testing</h2>
      <div className="progress">
        Testing: {testsCompleted} / {totalTests} components
        {currentComponent && <div>Current: {currentComponent}</div>}
      </div>
      <div className="results">
        <h3>Results</h3>
        <ul>
          {results.map(result => (
            <li key={result.name} className={`result-item ${result.status}`}>
              <div className="component-name">{result.name}</div>
              <div className="component-status">{result.status}</div>
              {result.renderTime && (
                <div className="render-time">{result.renderTime.toFixed(2)}ms</div>
              )}
              {result.message && <div className="error-message">{result.message}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
