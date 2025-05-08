import TestService from './TestService';
import DiagnosticService from './DiagnosticService';

/**
 * AutomatedTestManager
 * 
 * A utility class that initializes and manages all background testing and diagnostic services.
 * This avoids showing any UI to the user while still maintaining the diagnostic capabilities.
 */
class AutomatedTestManager {
  private static instance: AutomatedTestManager;

  private constructor() {
    console.log('Initializing AutomatedTestManager...');
    this.initialize();
  }

  public static getInstance(): AutomatedTestManager {
    if (!AutomatedTestManager.instance) {
      AutomatedTestManager.instance = new AutomatedTestManager();
    }
    return AutomatedTestManager.instance;
  }

  private initialize(): void {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') {
      console.log('Skipping automated test services in non-development environment');
      return;
    }

    // Register callbacks for test service
    TestService.setResultCallback((results) => {
      console.group('Automated Component Test Results');
      console.log(`Total components tested: ${results.length}`);
      console.log(`Passed: ${results.filter(r => r.status === 'success').length}`);
      console.log(`Failed: ${results.filter(r => r.status === 'error').length}`);
      console.log(`Warnings: ${results.filter(r => r.status === 'warning').length}`);
      console.groupEnd();
    });

    // Register callbacks for diagnostic service
    DiagnosticService.setResultCallback((results) => {
      console.group('Automated Diagnostic Results');
      console.log(`Total diagnostics: ${results.length}`);
      console.log(`OK: ${results.filter(r => r.status === 'ok').length}`);
      console.log(`Warnings: ${results.filter(r => r.status === 'warning').length}`);
      console.log(`Errors: ${results.filter(r => r.status === 'error').length}`);
      console.log(`Auto-fixed issues: ${results.filter(r => r.autoFixed).length}`);
      console.groupEnd();
    });

    // Schedule periodic checks
    this.schedulePeriodicChecks();
  }

  private schedulePeriodicChecks(): void {
    // Initial run of diagnostics first (after a short delay)
    setTimeout(() => {
      DiagnosticService.runDiagnostics().catch(error => {
        console.error('Initial diagnostics run failed:', error);
      });
    }, 2000);

    // Then run tests a bit later
    setTimeout(() => {
      TestService.runTests().catch(error => {
        console.error('Initial tests run failed:', error);
      });
    }, 5000);

    // Schedule periodic runs (every 10 minutes)
    setInterval(() => {
      if (!DiagnosticService.isDiagnosticRunning()) {
        DiagnosticService.runDiagnostics().catch(error => {
          console.error('Periodic diagnostics run failed:', error);
        });
      }
    }, 10 * 60 * 1000);

    // Periodic test runs (every 30 minutes)
    setInterval(() => {
      if (!TestService.isTestRunning()) {
        TestService.runTests().catch(error => {
          console.error('Periodic tests run failed:', error);
        });
      }
    }, 30 * 60 * 1000);
  }

  // API to manually trigger tests
  public runTests(): Promise<any> {
    return TestService.runTests();
  }

  // API to manually trigger diagnostics
  public runDiagnostics(): Promise<any> {
    return DiagnosticService.runDiagnostics();
  }
}

// Export singleton instance
export default AutomatedTestManager.getInstance(); 